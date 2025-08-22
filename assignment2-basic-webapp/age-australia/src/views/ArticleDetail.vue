<template>
  <div class="container py-5">
    <div v-if="article">
      <h1>{{ article.title }}</h1>
      <p>{{ article.content }}</p>
      <img :src="article.image" :alt="`Image for ${article.title}`" class="img-fluid" />

      <!-- 导出按钮 -->
      <div class="text-center mt-4">
        <button @click="exportArticleAsCSV" class="btn btn-primary me-3">Export as CSV</button>
        <button @click="exportArticleAsPDF" class="btn btn-secondary">Export as PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { exportToCSV, exportToPDF } from '@/utils/exportUtils'  // 导入导出函数

// 获取路由参数
const route = useRoute()
const articleId = route.params.id
const article = ref(null)

// 模拟获取文章详情（实际应该从 Firebase 或本地加载）
const fetchArticleDetails = async (id) => {
  const articles = [
    { 
      id: 1, 
      title: 'Healthy Eating Tips for Seniors', 
      content: 'A detailed guide on healthy eating habits for seniors...', 
      image: new URL('@/assets/images/healthy-eating.jpg', import.meta.url).href
    },
    { 
      id: 2, 
      title: 'Gentle Exercises for Joint Health', 
      content: 'Exercises to maintain joint flexibility and strength...', 
      image: new URL('@/assets/images/gentle-exercises.jpg', import.meta.url).href
    },
    { 
      id: 3, 
      title: 'Staying Connected: Social Wellness', 
      content: 'Ways to stay socially and emotionally connected...', 
      image: new URL('@/assets/images/staying-connected.jpg', import.meta.url).href
    },
    { 
      id: 4, 
      title: 'Mental Health and Well-being', 
      content: 'How to maintain mental health as you age...', 
      image: new URL('@/assets/images/mental-health.jpg', import.meta.url).href
    },
    { 
      id: 5, 
      title: 'The Importance of Sleep for Seniors', 
      content: 'Why quality sleep is important for older adults...', 
      image: new URL('@/assets/images/sleep-health.jpg', import.meta.url).href
    },
    { 
      id: 6, 
      title: "Nutrition and Hydration for Seniors", 
      content: "Stay hydrated and eat nutrient-rich foods...", 
      image: new URL('@/assets/images/nutrition.jpg', import.meta.url).href
    },
    { 
      id: 7, 
      title: "Managing Stress and Anxiety", 
      content: "Stress management techniques for seniors...", 
      image: new URL('@/assets/images/stress-management.jpg', import.meta.url).href
    },
    { 
      id: 8, 
      title: "Mindfulness for Seniors", 
      content: "Practices to improve mental clarity and reduce stress...", 
      image: new URL('@/assets/images/mindfullless.jpg', import.meta.url).href
    }
  ]

  article.value = articles.find(a => a.id == id)  // 根据 ID 查找文章
}

onMounted(() => {
  fetchArticleDetails(articleId)  // 根据路由参数获取文章详情
})

// 导出文章为 CSV
const exportArticleAsCSV = () => {
  exportToCSV([article.value], 'article-details.csv')  // 传递单篇文章数据
}

// 导出文章为 PDF
const exportArticleAsPDF = () => {
  exportToPDF([article.value], 'article-details.pdf')  // 传递单篇文章数据
}
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}
img {
  max-width: 100%;
  margin-top: 20px;
}
</style>
