<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div v-if="weatherData" class="weather">
      <h2>Weather in {{ weatherData.city }}</h2>
      <img :src="weatherData.icon" alt="Weather Icon" />
      <p><strong>Temperature:</strong> {{ weatherData.temperature }} °C</p>
      <p><strong>Description:</strong> {{ weatherData.description }}</p>
      <p><strong>Feels like:</strong> {{ weatherData.feels_like }} °C</p>
      <p><strong>Humidity:</strong> {{ weatherData.humidity }} %</p>
      <p><strong>Wind Speed:</strong> {{ weatherData.wind_speed }} m/s</p>
      <p><strong>Pressure:</strong> {{ weatherData.pressure }} hPa</p>
      <p><strong>Rain in last 3 hours:</strong> {{ weatherData.rain_volume_3h }} mm</p>
      <a :href="weatherData.mapUrl" target="_blank">View on Map</a>
    </div>

    <div v-if="cryptoData" class="crypto">
      <h2>Trump Coin Price</h2>
      <p><strong>Price (USD):</strong> ${{ cryptoData.price }}</p>
      <p><strong>Source:</strong> {{ cryptoData.source }}</p>
    </div>

    <CurrencyCryptoConverter />

    <div v-if="loading">Loading data...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import CurrencyCryptoConverter from './components/CurrencyCryptoConverter.vue';

export default {
  components: {
    CurrencyCryptoConverter,
  },
  data() {
    return {
      weatherData: null,
      cryptoData: null,
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchWeather() {
      try {
        const response = await axios.get('http://localhost:3000/assignments/weather', {
          params: {city: 'London'},
        });
        this.weatherData = response.data.weather;
        this.weatherData.city = 'London'; // Если city не передается с сервера
      } catch (err) {
        this.error = 'Failed to fetch weather data';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async fetchCrypto() {
      try {
        const response = await axios.get('http://localhost:3000/assignments/crypto/trump');
        this.cryptoData = response.data;
      } catch (err) {
        this.error = 'Failed to fetch Trump Coin data';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchWeather();
    this.fetchCrypto();
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.weather, .crypto {
  margin-bottom: 20px;
}

img {
  width: 50px;
  height: 50px;
}
</style>
