<template>
  <div>
    <div ref="mapEl" class="map-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'

const mapEl = ref(null)

onMounted(async () => {
  const mapboxgl = (await import('mapbox-gl')).default
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  new mapboxgl.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [144.9631, -37.8136], // 墨尔本坐标
    zoom: 10
  })
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;   /* 改大高度，比如 500px 或 80vh */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
