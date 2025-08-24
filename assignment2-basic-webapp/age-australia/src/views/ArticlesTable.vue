<template>
  <div class="container py-5" data-aos="fade-up">
    <h2 class="text-primary mb-4 text-center">Articles Table</h2>

    <!-- 空状态提示 -->
    <div v-if="articles.length === 0" class="alert alert-info text-center">
      <i class="fas fa-info-circle me-2"></i>
      No articles found in the table.
      <div class="mt-2 small">If this table is for saved items, please save some articles first.</div>
    </div>

    <!-- 表格展示文章 -->
    <div v-else class="table-responsive shadow-sm rounded">
      <table class="table table-hover table-bordered table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in paginatedArticles" :key="article.id" class="table-row">
            <td>{{ article.title }}</td>
            <td>{{ article.category }}</td>
            <td>{{ article.content.slice(0, 100) }}...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div v-if="articles.length" class="pagination-container text-center mt-4">
      <button
        class="btn btn-outline-primary me-2 rounded-pill"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="fas fa-arrow-left"></i> Previous
      </button>
      <span class="text-muted">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-outline-primary ms-2 rounded-pill"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import articlesData from '@/assets/data/articles.json'

const articles = ref([]) // 存储文章数据
const currentPage = ref(1) // 当前页码
const articlesPerPage = 5 // 每页显示 5 篇文章

onMounted(() => {
  // 直接使用导入的JSON数据
  articles.value = Array.isArray(articlesData) ? articlesData : []
})

const totalPages = computed(() => {
  return Math.ceil(articles.value.length / articlesPerPage)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return articles.value.slice(start, end)
})

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.table {
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}

.table thead {
  background-color: #007bff;
  color: white;
}

.table tbody tr:hover {
  background-color: #e6f7ff;
  cursor: pointer;
}

.table th, .table td {
  vertical-align: middle;
}

.table-row {
  font-size: 1.1rem;
  transition: all 0.3s ease-in-out;
}

.table-row:hover {
  background-color: #e6f7ff;
}

.pagination-container {
  margin-top: 20px;
}

.pagination-container button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-container button {
  font-weight: bold;
}

.pagination-container span {
  font-size: 1.1rem;
  color: #666;
}

.pagination-container button {
  font-size: 1.1rem;
}
</style>