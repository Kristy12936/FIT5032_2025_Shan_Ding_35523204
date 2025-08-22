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

      <!-- 资源展示卡片 -->
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4"
          v-for="(item, index) in filteredResources"
          :key="index"
        >
          <div class="card h-100 shadow-sm border-0 resource-card" data-aos="zoom-in" data-aos-delay="100">
            <div class="card-body d-flex flex-column">
              <!-- 图标 + 标题 -->
              <div class="d-flex align-items-center mb-2">
                <i :class="['fas', item.icon || 'fa-leaf', 'fa-2x', 'text-success', 'me-3']"></i>
                <div>
                  <h5 class="card-title text-primary mb-0">{{ item.title }}</h5>
                  <small class="text-muted">{{ item.type }}</small>
                </div>
              </div>

              <!-- 描述文字 -->
              <p class="card-text flex-grow-1 mt-2">{{ item.description }}</p>

              <!-- 可选链接 -->
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

      <!-- 无内容提示 -->
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
.health-wrapper {
  background: linear-gradient(135deg, #f8fbff, #f2f8ff);
  min-height: 100vh;
}

.resource-card {
  border-radius: 14px;
  background: linear-gradient(145deg, #ffffff, #f1f6ff);
  transition: all 0.3s ease;
}
.resource-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.1);
}

.btn-group .btn.active {
  background-color: #0d6efd;
  color: white;
  font-weight: 500;
  box-shadow: 0 0 8px rgba(13, 110, 253, 0.3);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.fa-2x {
  font-size: 1.6rem !important;
}
</style>
