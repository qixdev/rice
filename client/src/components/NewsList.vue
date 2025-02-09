<template>
  <div>
    <h2>Latest News</h2>

    <button @click="toggleLanguage">
      {{ language === "en" ? "Switch to Russian" : "Switch to English" }}
    </button>

    <div v-if="loading">Loading...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>

    <Splide v-if="!loading" :options="carouselOptions">
      <SplideSlide v-for="news in newsList" :key="news._id">
        <div class="news-item">
          <h3>{{ language === "en" ? news.name_en : news.name_ru }}</h3>
          <p>{{ language === "en" ? news.desc_en : news.desc_ru }}</p>

          <div v-if="news.images.length">
            <img :src="news.images[0]" alt="News Image" class="news-image"/>
          </div>
        </div>
      </SplideSlide>
    </Splide>
  </div>
</template>

<script>
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

export default {
  components: { Splide, SplideSlide },
  data() {
    return {
      newsList: [],
      loading: false,
      error: null,
      language: "en",
      carouselOptions: {
        type: "loop",
        perPage: 1,
        autoplay: true,
        interval: 3000,
        arrows: true,
        pagination: false,
      },
    };
  },
  methods: {
    async fetchNews() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3000/news");
        this.newsList = response.data;
      } catch (err) {
        this.error = "Failed to load news.";
      } finally {
        this.loading = false;
      }
    },

    toggleLanguage() {
      this.language = this.language === "en" ? "ru" : "en";
    }
  },
  mounted() {
    this.fetchNews();
  },
};
</script>

<style scoped>
.news-item {
  text-align: center;
  padding: 20px;
}

.news-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-top: 10px;
}
</style>
