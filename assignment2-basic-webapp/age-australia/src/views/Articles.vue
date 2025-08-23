<template>
  <div class="articles-wrapper py-5">
    <!-- 顶部渐变卡片 -->
    <div class="container hero-card text-center py-4 mb-5" data-aos="zoom-in">
      <h2 class="text-primary mb-2">
        <i class="fas fa-book-reader me-2"></i>📚 Health Articles
      </h2>
      <p class="text-muted">
        Browse health tips, advice and stories for older adults.
      </p>
    </div>

    <div class="container" data-aos="fade-up">
      <div class="row">
        <div class="col-md-4 mb-4" v-for="article in articles" :key="article.id">
          <div
            class="card h-100 shadow article-card"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-dark fw-bold">
                {{ article.title }}
              </h5>
              <p class="card-text text-secondary flex-grow-1">
                {{ article.content }}
              </p>
              <button
                class="btn btn-outline-warning mt-auto"
                @click="toggleFavorite(article)"
              >
                <i
                  :class="isFavorited(article.id) ? 'fas fa-star' : 'far fa-star'"
                ></i>
                {{ isFavorited(article.id) ? 'Saved' : 'Save' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!articles.length" class="text-center text-muted mt-4">
        No articles available.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'

const articles = ref([])
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

onMounted(async () => {
  const res = await fetch('/articles.json')
  if (res.ok) {
    articles.value = await res.json()
  }
})

watchEffect(() => {
  localStorage.setItem('user', JSON.stringify(user.value))
})

const toggleFavorite = (article) => {
  user.value.favorites = user.value.favorites || []
  const index = user.value.favorites.indexOf(article.id)
  if (index === -1) {
    user.value.favorites.push(article.id)
  } else {
    user.value.favorites.splice(index, 1)
  }
}

const isFavorited = (id) => user.value?.favorites?.includes(id)
</script>

<style scoped>
/* 🌈 页面整体背景 */
.articles-wrapper {
  background: radial-gradient(circle at top left, #eef4ff, #fcfbff);
  min-height: 100vh;
}

/* ✅ 顶部渐变卡片样式 */
.hero-card {
  background: linear-gradient(135deg, #e9f7f9, #f3e7f3);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* ✅ 文章卡片样式 */
.article-card {
  border-radius: 15px;
  background: linear-gradient(145deg, #fdf8f4, #f1f6ff);
  transition: all 0.3s ease-in-out;
  border: 1px solid #e0e0e0;
}

.article-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.2rem;
}

.card-text {
  font-size: 0.95rem;
  color: #555;
}
</style>
