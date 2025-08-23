<!-- src/views/Map.vue -->
<template>
  <div class="map-page">
    <div id="map"></div>

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
import mapboxgl from 'mapbox-gl'

const query = ref('')
const map = ref(null)
const userMarker = ref(null)
const destMarker = ref(null)
const routeSourceId = 'route-source'
const routeLayerId = 'route-layer'
const tripInfo = ref(null)

const token = import.meta.env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = token

function removeRouteIfExists() {
  if (!map.value) return
  if (map.value.getLayer(routeLayerId)) map.value.removeLayer(routeLayerId)
  if (map.value.getSource(routeSourceId)) map.value.removeSource(routeSourceId)
}

function placeMarker(lngLat, type) {
  const marker = new mapboxgl.Marker({ color: type === 'user' ? '#2ECC71' : '#E67E22' })
    .setLngLat(lngLat)
    .addTo(map.value)

  if (type === 'user') {
    if (userMarker.value) userMarker.value.remove()
    userMarker.value = marker
  } else {
    if (destMarker.value) destMarker.value.remove()
    destMarker.value = marker
  }
}

async function searchPlace() {
  if (!query.value) return

  // 1) Geocoding
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query.value
  )}.json?access_token=${token}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.features?.length) return

  const place = data.features[0]
  const [lng, lat] = place.center

  // 2) 标记目标点并飞到
  placeMarker([lng, lat], 'dest')
  map.value.flyTo({ center: [lng, lat], zoom: 14 })

  // 3) 获取用户当前位置 → 路径导航
  tripInfo.value = null
  removeRouteIfExists()

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const start = [pos.coords.longitude, pos.coords.latitude]
      placeMarker(start, 'user')

      const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${lng},${lat}?geometries=geojson&overview=full&access_token=${token}`
      const r = await fetch(routeUrl)
      const j = await r.json()
      const route = j.routes?.[0]
      if (!route) return

      // 4) 绘制路线
      map.value.addSource(routeSourceId, {
        type: 'geojson',
        data: { type: 'Feature', geometry: route.geometry },
      })
      map.value.addLayer({
        id: routeLayerId,
        type: 'line',
        source: routeSourceId,
        paint: { 'line-color': '#0074D9', 'line-width': 5 },
      })

      // 5) 显示行程信息
      tripInfo.value = {
        km: Math.round((route.distance || 0) / 10) / 100, // 米->公里, 保留2位
        mins: Math.round((route.duration || 0) / 60),
      }
    },
    () => {
      // 定位失败也能用：仅定位目标点
      map.value.flyTo({ center: [lng, lat], zoom: 14 })
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

onMounted(() => {
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8136], // Melbourne
    zoom: 12,
  })

  // 添加缩放/方向控件
  map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // 初次尝试获取并标记用户位置（提高 UX）
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const here = [pos.coords.longitude, pos.coords.latitude]
      placeMarker(here, 'user')
      map.value.flyTo({ center: here, zoom: 13 })
    },
    () => {}
  )
})

onBeforeUnmount(() => {
  if (userMarker.value) userMarker.value.remove()
  if (destMarker.value) destMarker.value.remove()
  if (map.value) map.value.remove()
})
</script>

<style scoped>
.map-page { position: relative; }
#map { width: 100%; height: calc(100vh - 60px); }
.panel {
  position: absolute;
  top: 12px; left: 12px;
  background: #fff; padding: 12px; border-radius: 10px;
  width: 320px; max-width: 92%;
}
.input-row { display: flex; gap: 8px; }
.input-row input {
  flex: 1; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px;
}
.input-row button {
  padding: 8px 12px; border: none; border-radius: 8px; background:#0d6efd; color:#fff; cursor:pointer;
}
.trip { margin-top: 10px; background:#f6f9ff; padding:8px 10px; border-radius:8px; }
.hint { font-size: 12px; color:#666; margin-top:6px; }
</style>
