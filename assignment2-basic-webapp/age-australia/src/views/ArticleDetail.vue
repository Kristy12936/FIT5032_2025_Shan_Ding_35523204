<template>
  <div class="container py-5">
    <div v-if="article">
      <!-- 返回按钮 -->
      <button @click="$router.back()" class="btn btn-outline-secondary mb-4">
        <i class="fas fa-arrow-left me-2"></i>Back to Articles
      </button>
      
      <!-- 文章内容 -->
      <div class="article-detail-card shadow-sm p-4 rounded">
        <h1 class="text-primary mb-3">{{ article.title }}</h1>
        <div class="mb-3">
          <span class="badge bg-info fs-6">{{ article.category }}</span>
        </div>
        <p class="article-content">{{ article.content }}</p>
        
        <img 
          v-if="article.image" 
          :src="article.image" 
          :alt="'Image for ' + article.title" 
          class="img-fluid rounded mt-4 article-image" 
        />
        
        <!-- 导出按钮 -->
        <div class="text-center mt-5">
          <button @click="exportArticleAsCSV" class="btn btn-primary me-3">
            <i class="fas fa-file-csv me-2"></i>Export as CSV
          </button>
          <button @click="exportArticleAsPDF" class="btn btn-secondary">
            <i class="fas fa-file-pdf me-2"></i>Export as PDF
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading article...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import articlesData from '@/assets/data/articles.json'

// 获取路由参数
const route = useRoute()
const articleId = parseInt(route.params.id)
const article = ref(null)

onMounted(() => {
  // 从导入的数据中查找文章
  article.value = articlesData.find(a => a.id === articleId)
})

// 导出文章为 CSV
const exportArticleAsCSV = () => {
  const headers = 'Title,Category,Content\n'
  const content = `"${article.value.title}","${article.value.category}","${article.value.content.replace(/"/g, '""')}"`
  const csv = headers + content
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${article.value.title.replace(/\s+/g, '_')}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 导出文章为 PDF
const exportArticleAsPDF = () => {
  // 简化版PDF导出 - 实际项目中应使用jsPDF等库
  const printContent = `
    <h1>${article.value.title}</h1>
    <p><strong>Category:</strong> ${article.value.category}</p>
    <p>${article.value.content}</p>
  `
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>${article.value.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #007bff; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `)
  printWindow.document.close()
  
  printWindow.print()
}
</script>

<style scoped>
.article-detail-card {
  background-color: #f8f9fa;
  border-left: 5px solid #007bff;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
}

.article-image {
  max-height: 400px;
  object-fit: cover;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 20px;
}
</style>