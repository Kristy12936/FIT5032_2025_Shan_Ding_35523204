<!-- src/views/Map.vue -->
<template>
  <div class="map-page">
    <!-- 地图容器 -->
    <div ref="mapEl" class="map-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <div>Loading map…</div>
      </div>
      <div v-if="!token" class="token-warning">
        <p><strong>Missing Mapbox token.</strong></p>
        <p>Please set <code>VITE_MAPBOX_TOKEN</code> in Cloudflare Pages Variables.</p>
      </div>
    </div>

    <!-- 操作面板 -->
    <div class="panel shadow">
      <h5 class="mb-2">Find & Navigate</h5>

      <div class="input-row">
        <input
          v-model="query"
          placeholder="Search places (e.g., library, hospital)"
          @keyup.enter="searchPlace"
        />
        <button @click="searchPlace">Search</button>
      </div>

      <div v-if="errorMsg" class="alert">
        {{ errorMsg }}
      </div>

      <div v-if="tripInfo" class="trip">
        <div><strong>Distance:</strong> {{ tripInfo.km }} km</div>
        <div><strong>ETA:</strong> {{ tripInfo.mins }} mins</div>
      </div>

      <div class="hint">
        Tip: allow location permission to route from your current position.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'

const token = import.meta.env.VITE_MAPBOX_TOKEN
const mapEl = ref(null)
const map = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const query = ref('')
const userMarker = ref(null)
const destMarker = ref(null)
const routeSourceId = 'route-source'
const routeLayerId = 'route-layer'
const tripInfo = ref(null)

// ---- helpers ----
function removeRouteIfExists() {
  if (!map.value) return
  if (map.value.getLayer(routeLayerId)) map.value.removeLayer(routeLayerId)
  if (map.value.getSource(routeSourceId)) map.value.removeSource(routeSourceId)
}

function placeMarker(lngLat, type) {
  if (!map.value) return
  const color = type === 'user' ? '#2ECC71' : '#E67E22'
  const marker = new mapboxgl.Marker({ color }).setLngLat(lngLat).addTo(map.value)
  if (type === 'user') {
    if (userMarker.value) userMarker.value.remove()
    userMarker.value = marker
  } else {
    if (destMarker.value) destMarker.value.remove()
    destMarker.value = marker
  }
}

// ---- search + route ----
async function searchPlace() {
  errorMsg.value = ''
  tripInfo.value = null
  removeRouteIfExists()

  if (!query.value) {
    errorMsg.value = 'Please enter a keyword.'
    return
  }
  if (!map.value || !token) return

  try {
    // 1) Geocoding
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
      `${encodeURIComponent(query.value)}.json?limit=1&access_token=${token}`
    const res = await fetch(url)
    const data = await res.json()
    const place = data?.features?.[0]
    if (!place) {
      errorMsg.value = 'No result found.'
      return
    }

    const [lng, lat] = place.center
    placeMarker([lng, lat], 'dest')
    map.value.flyTo({ center: [lng, lat], zoom: 14 })

    // 2) Try to route from user location
    await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const start = [pos.coords.longitude, pos.coords.latitude]
          placeMarker(start, 'user')

          const routeUrl =
            `https://api.mapbox.com/directions/v5/mapbox/driving/` +
            `${start[0]},${start[1]};${lng},${lat}?geometries=geojson&overview=full&access_token=${token}`
          const r = await fetch(routeUrl)
          const j = await r.json()
          const route = j?.routes?.[0]
          if (route) {
            map.value.addSource(routeSourceId, {
              type: 'geojson',
              data: { type: 'Feature', geometry: route.geometry }
            })
            map.value.addLayer({
              id: routeLayerId,
              type: 'line',
              source: routeSourceId,
              layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: { 'line-color': '#0d6efd', 'line-width': 5 }
            })
            tripInfo.value = {
              km: Math.round((route.distance || 0) / 10) / 100,
              mins: Math.round((route.duration || 0) / 60)
            }
          }
          resolve()
        },
        () => {
          // 定位失败：只飞到目的地
          resolve()
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    })
  } catch (e) {
    errorMsg.value = 'Search failed, please try again.'
    console.error(e)
  }
}

let resizeObs = null
let mapboxgl // 动态导入以保证在构建环境下稳定

onMounted(async () => {
  try {
    if (!token) {
      loading.value = false
      return
    }
    mapboxgl = (await import('mapbox-gl')).default
    mapboxgl.accessToken = token

    map.value = new mapboxgl.Map({
      container: mapEl.value,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [144.9631, -37.8136], // Melbourne
      zoom: 12
    })

    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.value.on('load', () => {
      loading.value = false
      // 初次尝试获取用户位置
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const here = [pos.coords.longitude, pos.coords.latitude]
          placeMarker(here, 'user')
          map.value.flyTo({ center: here, zoom: 13 })
        },
        () => {}
      )
    })

    // 监听容器尺寸变化，自动 resize（避免“看起来变小/空白”）
    resizeObs = new ResizeObserver(() => {
      map.value && map.value.resize()
    })
    resizeObs.observe(mapEl.value)
  } catch (e) {
    loading.value = false
    errorMsg.value = 'Failed to initialize the map.'
    console.error(e)
  }
})

onBeforeUnmount(() => {
  if (userMarker.value) userMarker.value.remove()
  if (destMarker.value) destMarker.value.remove()
  if (resizeObs && mapEl.value) resizeObs.unobserve(mapEl.value)
  if (map.value) map.value.remove()
})
</script>

<style scoped>
/* 整页容器：顶部若有导航，减去它的高度。这里按 64px 估算。 */
.map-page {
  position: relative;
  min-height: calc(100vh - 64px);
}

/* 地图容器：填满可视区域，保证最小高度不小于 520px */
.map-container {
  width: 100%;
  height: calc(100vh - 64px);
  min-height: 520px;
  background: #f7f9fc;
  border-radius: 14px;
  overflow: hidden;
}

/* 左上角面板（自适应屏幕） */
.panel {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #fff;
  padding: 14px;
  border-radius: 12px;
  width: 360px;
  max-width: min(92vw, 420px);
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
}

.input-row { display: flex; gap: 8px; }
.input-row input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  outline: none;
}
.input-row input:focus { border-color: #0d6efd; }
.input-row button {
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  background:#0d6efd; color:#fff; cursor:pointer;
}

.trip {
  margin-top: 10px;
  background:#f6f9ff;
  padding:10px 12px;
  border-radius:10px;
  font-size: 14px;
}
.hint { font-size: 12px; color:#666; margin-top:8px; }

/* 加载与 Token 提示 */
.loading, .token-warning {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; color: #444;
}
.spinner {
  width: 28px; height: 28px; border-radius: 50%;
  border: 3px solid #ddd; border-top-color: #0d6efd;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.alert {
  margin-top: 10px;
  background: #fff5f5;
  border: 1px solid #ffd6d6;
  color: #b42318;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
}

/* 小屏优化 */
@media (max-width: 600px) {
  .panel { left: 8px; right: 8px; width: auto; }
}
</style>
