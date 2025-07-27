<template>
  <div class="health-wrapper py-5">
    <div class="container" data-aos="fade-up">
      <h2 class="mb-4 text-center text-success">
        <i class="fas fa-heartbeat me-2"></i>Health Resources
      </h2>

      <!-- 分类筛选 -->
      <div class="text-center mb-4">
        <div class="btn-group flex-wrap">
          <button
            class="btn btn-outline-primary m-1"
            :class="{ active: selectedType === '' }"
            @click="selectedType = ''"
          >
            All
          </button>
          <button
            v-for="type in uniqueTypes"
            :key="type"
            class="btn btn-outline-primary m-1"
            :class="{ active: selectedType === type }"
            @click="selectedType = type"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- 资源展示 -->
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4"
          v-for="(item, index) in filteredResources"
          :key="index"
        >
          <div class="card h-100 shadow-sm border-0 resource-card" data-aos="zoom-in" data-aos-delay="100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-primary">
                <i class="fas fa-stethoscope me-2"></i>{{ item.title }}
              </h5>
              <h6 class="text-muted mb-2">{{ item.type }}</h6>
              <p class="card-text flex-grow-1">{{ item.description }}</p>
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                class="btn btn-sm btn-outline-success mt-2 align-self-start"
              >
                <i class="fas fa-external-link-alt me-1"></i>More Info
              </a>
            </div>
          </div>
        </div>
      </div>

      <p v-if="filteredResources.length === 0" class="text-center text-muted mt-4">
        No resources available.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const resources = ref([])
const selectedType = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/src/assets/data/health_resources.json')
    resources.value = await res.json()
  } catch (e) {
    console.error('❌ Failed to load resources', e)
  }
})

const uniqueTypes = computed(() =>
  [...new Set(resources.value.map(r => r.type))].filter(Boolean)
)

const filteredResources = computed(() => {
  return selectedType.value
    ? resources.value.filter(r => r.type === selectedType.value)
    : resources.value
})
</script>

<style scoped>
/* ✅ 页面背景 */
.health-wrapper {
  background: linear-gradient(135deg, #f8fbff, #f2f8ff);
  min-height: 100vh;
}

/* ✅ 卡片样式 */
.resource-card {
  border-radius: 14px;
  background: linear-gradient(145deg, #fdf8f4, #f1f6ff);
  transition: all 0.3s ease;
}
.resource-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.1);
}

/* ✅ 分类按钮样式 */
.btn-group .btn.active {
  background-color: #0d6efd;
  color: white;
  font-weight: 500;
  box-shadow: 0 0 8px rgba(13, 110, 253, 0.3);
}
</style>
