<template>
  <div class="health-wrapper py-5">
    <div class="container" data-aos="fade-up">
      <h2 class="mb-4 text-center text-success">
        <i class="fas fa-heartbeat me-2" aria-hidden="true"></i>
        <span class="visually-hidden">Health Resources</span>
        Health Resources
      </h2>

      <!-- 分类筛选 -->
      <div class="text-center mb-4">
        <div class="btn-group flex-wrap">
          <button
            class="btn btn-outline-primary m-1"
            :class="{ active: selectedType === '' }"
            @click="selectedType = ''"
          >All</button>

          <button
            v-for="type in uniqueTypes"
            :key="type"
            class="btn btn-outline-primary m-1"
            :class="{ active: selectedType === type }"
            @click="selectedType = type"
          >{{ type }}</button>
        </div>
      </div>

      <!-- 资源卡片 -->
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4"
          v-for="(item, i) in filteredResources"
          :key="i"
        >
          <div class="card h-100 shadow-sm border-0 resource-card" data-aos="zoom-in" data-aos-delay="100">
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-2">
                <i :class="['fas', item.icon || 'fa-leaf', 'fa-2x', 'text-success', 'me-3']" aria-hidden="true"></i>
                <div>
                  <h5 class="card-title text-primary mb-0">{{ item.title }}</h5>
                  <small class="text-muted">{{ item.type }}</small>
                </div>
              </div>

              <p class="card-text flex-grow-1 mt-2">{{ item.description }}</p>

              <a v-if="item.link" :href="item.link" target="_blank" rel="noopener"
                 class="btn btn-sm btn-outline-success mt-2 align-self-start">
                <i class="fas fa-external-link-alt me-1" aria-hidden="true"></i> More Info
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
import { ref, computed } from 'vue'
// ✅ 关键：静态导入 JSON，不再用 fetch（部署最稳）
import raw from '@/assets/data/health_resources.json'

// 兼容两种结构：数组 或 { items: [...] }
const src = Array.isArray(raw) ? raw : (raw.items || [])

// 如你的 JSON 字段名与下方不同，可在这里做一次映射
const resources = ref(
  src.map(r => ({
    title: r.title ?? r.name ?? '',
    description: r.description ?? r.desc ?? '',
    type: r.type ?? r.category ?? '',
    icon: r.icon ?? 'fa-leaf',
    link: r.link ?? r.website ?? ''
  }))
)

const selectedType = ref('')

const uniqueTypes = computed(() =>
  [...new Set(resources.value.map(r => r.type).filter(Boolean))]
)

const filteredResources = computed(() =>
  selectedType.value
    ? resources.value.filter(r => r.type === selectedType.value)
    : resources.value
)
</script>

<style scoped>
.health-wrapper { background: linear-gradient(135deg, #f8fbff, #f2f8ff); min-height: 100vh; }

.resource-card { border-radius: 14px; background: linear-gradient(145deg, #ffffff, #f1f6ff); transition: all .3s; }
.resource-card:hover { transform: translateY(-6px); box-shadow: 0 8px 24px rgba(0, 123, 255, 0.1); }

.btn-group .btn.active { background:#0d6efd; color:#fff; font-weight:500; box-shadow:0 0 8px rgba(13,110,253,.3); }
.card-title { font-size: 1.1rem; font-weight: 600; }
.fa-2x { font-size: 1.6rem !important; }
.visually-hidden { position:absolute; left:-9999px; }
</style>
