<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style> -->




<!-- Activity3 完整的代码-->
<!-- <script setup>
import AllFamousWorks from './components/AllFamousWorks.vue'
</script>

<template>
  <div>
    <header style="text-align: center;">
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="100" />
      <h1>欢迎来到图书馆 📚</h1>
    </header>

    <main style="max-width: 600px; margin: 0 auto; padding-top: 30px;">
      <AllFamousWorks />
    </main>
  </div>
</template> -->


<!-- Activity 4
<template>
  <div id="app">
    <header>
      <h1>📚 Author Search Application</h1>
    </header>

    <main>
      <SearchAuthorByName />
    </main>
  </div>
</template>

<script setup>
import SearchAuthorByName from './components/SearchAuthorByName.vue'
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #eef2f5;
}

#app {
  text-align: center;
  padding: 32px;
}

header {
  margin-bottom: 24px;
}

main {
  display: flex;
  justify-content: center;
}
</style> -->


<!-- activity5
<template>
  <div id="app">
    <header>
      <h1>📘 Author Lookup App</h1>
    </header>

    <main>
      <section class="activity-section">
        <SearchAuthorByName />
      </section>

      <section class="activity-section">
        <SearchAuthorById />
      </section>
    </main>
  </div>
</template>

<script setup>
import SearchAuthorByName from './components/SearchAuthorByName.vue'
import SearchAuthorById from './components/SearchAuthorById.vue'
</script>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
}

#app {
  text-align: center;
  padding: 40px;
}

header {
  margin-bottom: 32px;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.activity-section {
  width: 100%;
  max-width: 600px;
}
</style> -->




<!-- activity 6
<template>
  <div id="app">
    <h1>Author List</h1>
    <ul>
      <li v-for="author in authors" :key="author.id">
        {{ author.name }} ({{ author.birthYear }})
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      authors: [
        { id: 1, name: "Jane Austen", birthYear: 1775 },
        { id: 2, name: "Mark Twain", birthYear: 1835 },
        { id: 3, name: "Virginia Woolf", birthYear: 1882 },
        { id: 4, name: "George Orwell", birthYear: 1903 }
      ]
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 20px;
}
h1 {
  color: #2c3e50;
  margin-bottom: 15px;
}
ul {
  padding-left: 20px;
}
li {
  font-size: 16px;
  margin-bottom: 6px;
}
</style> -->






<!-- activity 7
<template>
  <div id="app">
    <h1>Modern Authors (Born After 1850)</h1>
    <ul>
      <li v-for="author in modernAuthors" :key="author.id">
        {{ author.name }} ({{ author.birthYear }})
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      authors: [
        { id: 1, name: "Jane Austen", birthYear: 1775 },
        { id: 2, name: "Mark Twain", birthYear: 1835 },
        { id: 3, name: "Virginia Woolf", birthYear: 1882 },
        { id: 4, name: "George Orwell", birthYear: 1903 },
        { id: 5, name: "Ernest Hemingway", birthYear: 1899 },
        { id: 6, name: "F. Scott Fitzgerald", birthYear: 1896 }
      ]
    };
  },
  computed: {
    modernAuthors() {
      return this.authors.filter(author => author.birthYear > 1850);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 20px;
}
h1 {
  color: #34495e;
  margin-bottom: 15px;
}
ul {
  padding-left: 20px;
}
li {
  font-size: 16px;
  margin-bottom: 6px;
}
</style> -->




<!-- <template>
  <div id="app">
    <h1>All Famous Works</h1>
    <ul>
      <li v-for="work in allFamousWorks" :key="work">
        {{ work }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      authors: [
        {
          id: 1,
          name: "Jane Austen",
          birthYear: 1775,
          famousWorks: ["Pride and Prejudice", "Sense and Sensibility"]
        },
        {
          id: 2,
          name: "Mark Twain",
          birthYear: 1835,
          famousWorks: ["Adventures of Huckleberry Finn", "The Adventures of Tom Sawyer"]
        },
        {
          id: 3,
          name: "Virginia Woolf",
          birthYear: 1882,
          famousWorks: ["Mrs Dalloway", "To the Lighthouse"]
        },
        {
          id: 4,
          name: "George Orwell",
          birthYear: 1903,
          famousWorks: ["1984", "Animal Farm"]
        }
      ]
    };
  },
  computed: {
    allFamousWorks() {
      return this.authors.flatMap(author => author.famousWorks);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 20px;
}
h1 {
  color: #2c3e50;
  margin-bottom: 15px;
}
ul {
  padding-left: 20px;
}
li {
  font-size: 16px;
  margin-bottom: 6px;
}
</style> -->




<script setup>
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
import JsonVue from './components/JSON.vue' //  引入 json.vue
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
    
    <!-- 使用 JsonVue 组件 -->
    <JsonVue />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
