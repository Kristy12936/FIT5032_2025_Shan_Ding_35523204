<!-- src/views/Map.vue  (Leaflet + OSM with fixed overlay panel) -->
<template>
  <div class="map-page">
    <!-- 地图容器 -->
    <div ref="mapEl" class="map-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <div>Loading map…</div>
      </div>
    </div>

    <!-- 顶部浮动面板（搜索与导航） -->
    <div class="panel shadow">
      <h5 class="mb-2">Find & Navigate (OSM)</h5>

      <div class="input-row">
        <input
          v-model="query"
          placeholder="Search places (e.g., library, hospital)"
          @keyup.enter="searchPlace"
          aria-label="Search places"
        />
        <button @click="searchPlace">Search</button>
      </div>

      <div v-if="errorMsg" class="alert">{{ errorMsg }}</div>

      <div v-if="tripInfo" class="trip">
        <div><strong>Distance:</strong> {{ tripInfo.km }} km</div>
        <div><strong>ETA:</strong> {{ tripInfo.mins }} mins</div>
      </div>

      <div class="hint">
        Data source: OpenStreetMap + Nominatim + OSRM (free).
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 修复打包后默认 marker 图标丢失（Vite 常见）
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const mapEl = ref(null)
const map = ref(null)
const loading = ref(true)
const errorMsg = ref('')

const query = ref('')
let userMarker = null
let destMarker = null
let routeLayer = null

const tripInfo = ref(null)

function clearRoute() {
  if (routeLayer) {
    routeLayer.remove()
    routeLayer = null
  }
  tripInfo.value = null
}

function setMarker(lat, lng, type) {
  if (!map.value) return
  const m = L.marker([lat, lng]).addTo(map.value)
  if (type === 'user') {
    if (userMarker) userMarker.remove()
    userMarker = m
  } else {
    if (destMarker) destMarker.remove()
    destMarker = m
  }
}

// OSM Nominatim 地理编码（免费，有限流；请勿高频并发）
async function geocode(q) {
  const url =
    'https://nominatim.openstreetmap.org/search?' +
    new URLSearchParams({ format: 'json', q })
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' } // 稳定英文结果
  })
  const data = await res.json()
  return data?.[0] // 取第一个结果
}

// OSRM 公共路由服务（免费，有限流；仅演示用途）
async function route(from, to) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?overview=full&geometries=geojson`
  const r = await fetch(url)
  const j = await r.json()
  return j?.routes?.[0]
}

async function searchPlace() {
  errorMsg.value = ''
  clearRoute()

  if (!query.value.trim()) {
    errorMsg.value = 'Please enter a keyword.'
    return
  }

  try {
    const p = await geocode(query.value.trim())
    if (!p) {
      errorMsg.value = 'No result found.'
      return
    }

    const lat = parseFloat(p.lat)
    const lon = parseFloat(p.lon)
    setMarker(lat, lon, 'dest')
    map.value.setView([lat, lon], 14)

    // 从用户位置规划路线（允许失败）
    await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const start = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          const end = { lat, lng: lon }
          setMarker(start.lat, start.lng, 'user')

          const r = await route(start, end)
          if (r?.geometry) {
            const line = L.geoJSON(r.geometry, {
              style: { color: '#0d6efd', weight: 5 }
            })
            line.addTo(map.value)
            routeLayer = line

            // 距离米→公里、时长秒→分钟
            tripInfo.value = {
              km: Math.round((r.distance || 0) / 10) / 100,
              mins: Math.round((r.duration || 0) / 60)
            }

            // 视野适配整条路线
            map.value.fitBounds(line.getBounds(), { padding: [30, 30] })
          }
          resolve()
        },
        () => resolve(), // 拒绝定位也继续（仅标注目的地）
        { enableHighAccuracy: true, timeout: 8000 }
      )
    })
  } catch (e) {
    console.error(e)
    errorMsg.value = 'Search failed. Please try again.'
  }
}

let resizeObs = null

onMounted(() => {
  map.value = L.map(mapEl.value).setView([-37.8136, 144.9631], 12) // Melbourne

  // OSM 瓦片（不需要 token）
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)

  // 初次尝试定位用户位置
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setMarker(pos.coords.latitude, pos.coords.longitude, 'user')
      map.value.setView([pos.coords.latitude, pos.coords.longitude], 13)
    },
    () => {}
  )

  loading.value = false

  // 自动 resize
  resizeObs = new ResizeObserver(() => {
    map.value && map.value.invalidateSize()
  })
  resizeObs.observe(mapEl.value)
})

onBeforeUnmount(() => {
  if (resizeObs && mapEl.value) resizeObs.unobserve(mapEl.value)
  if (map.value) map.value.remove()
})
</script>

<style scoped>
.map-page {
  position: relative;
  min-height: calc(100vh - 64px);
}

/* 地图容器在下层 */
.map-container {
  position: relative;   /* 提供定位上下文 */
  z-index: 1;
  width: 100%;
  height: calc(100vh - 64px);
  min-height: 520px;
  background: #f7f9fc;
  border-radius: 14px;
  overflow: hidden;
}

/* Leaflet 容器层级（确保不盖住面板） */
.leaflet-container { z-index: 1; }

/* 顶部功能面板永远覆盖在地图之上 */
.panel {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10000;       /* 关键：高于地图 */
  pointer-events: auto; /* 面板可点击/输入 */
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
}
.input-row input:focus { border-color: #0d6efd; outline: none; }
.input-row button {
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  background:#0d6efd;
  color:#fff;
  cursor: pointer;
}

.trip {
  margin-top: 10px;
  background:#f6f9ff;
  padding:10px 12px;
  border-radius:10px;
  font-size: 14px;
}
.hint { font-size: 12px; color:#666; margin-top:8px; }

.loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #444;
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

@media (max-width: 600px) {
  .panel { left: 8px; right: 8px; width: auto; z-index: 10000; }
}
</style>
