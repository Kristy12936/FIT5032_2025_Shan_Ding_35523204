<template>
  <div class="container py-5" data-aos="fade-up">
    <h2 class="text-primary mb-4 text-center">Articles Table</h2>

    <!-- 表格展示文章 -->
    <div class="table-responsive shadow-sm rounded">
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
            <td>{{ article.content }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-container text-center mt-4">
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

const articles = ref([]) // 存储文章数据
const currentPage = ref(1) // 当前页码
const articlesPerPage = 5 // 每页显示 5 篇文章

onMounted(async () => {
  try {
    const res = await fetch('/src/assets/data/articles.json')
    articles.value = await res.json()
  } catch (e) {
    console.error('❌ Failed to load articles', e)
  }
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
