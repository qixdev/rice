<template>
  <div class="currency-crypto-converter">
    <h2>Currency & Crypto Converter</h2>

    <!-- Form for conversion -->
    <form @submit.prevent="convertCurrency">
      <div>
        <label for="fromCurrency">From:</label>
        <select v-model="fromCurrency" id="fromCurrency">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="KZT">KZT</option>
          <option value="BTC">BTC</option> <!-- Bitcoin -->
          <option value="ETH">ETH</option> <!-- Ethereum -->
          <!-- Add more currencies/cryptos if needed -->
        </select>
      </div>

      <div>
        <label for="toCurrency">To:</label>
        <select v-model="toCurrency" id="toCurrency">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="KZT">KZT</option>
          <option value="BTC">BTC</option> <!-- Bitcoin -->
          <option value="ETH">ETH</option> <!-- Ethereum -->
          <!-- Add more currencies/cryptos if needed -->
        </select>
      </div>

      <div>
        <label for="amount">Amount:</label>
        <input v-model.number="amount" type="number" id="amount" required />
      </div>

      <button type="submit">Convert</button>
    </form>

    <div v-if="conversionResult !== null">
      <h3>Conversion Result:</h3>
      <p>{{ amount }} {{ fromCurrency }} = {{ conversionResult }} {{ toCurrency }}</p>
    </div>

    <div v-if="error" style="color: red;">
      {{ error }}
    </div>

    <!-- History Section -->
    <div v-if="conversionHistory.length > 0">
      <h3>Conversion History</h3>
      <ul>
        <li v-for="(entry, index) in conversionHistory" :key="index">
          {{ entry.amount }} {{ entry.fromCurrency }} = {{ entry.conversionResult }} {{ entry.toCurrency }} ({{ entry.date }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 1,
      conversionResult: null,
      error: null,
      conversionHistory: [], // Array to store conversion history
    };
  },
  methods: {
    async convertCurrency() {
      this.conversionResult = null;
      this.error = null;

      try {
        let conversionRate = 0;

        // Determine if converting between cryptocurrencies
        if (this.fromCurrency === 'BTC' || this.fromCurrency === 'ETH' || this.toCurrency === 'BTC' || this.toCurrency === 'ETH') {
          const cryptoResponse = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
              ids: this.fromCurrency.toLowerCase(),
              vs_currencies: this.toCurrency.toLowerCase(),
            },
          });

          if (cryptoResponse.data[this.fromCurrency.toLowerCase()] && cryptoResponse.data[this.fromCurrency.toLowerCase()][this.toCurrency.toLowerCase()]) {
            conversionRate = cryptoResponse.data[this.fromCurrency.toLowerCase()][this.toCurrency.toLowerCase()];
          } else {
            this.error = 'Conversion rate not available for the selected cryptocurrencies.';
            return;
          }
        } else {
          const fiatResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/${this.fromCurrency}`);

          if (fiatResponse.data.rates[this.toCurrency]) {
            conversionRate = fiatResponse.data.rates[this.toCurrency];
          } else {
            this.error = 'Conversion rate not available for the selected fiat currencies.';
            return;
          }
        }

        this.conversionResult = (this.amount * conversionRate).toFixed(2);

        // Save the conversion to history
        const conversionEntry = {
          amount: this.amount,
          fromCurrency: this.fromCurrency,
          toCurrency: this.toCurrency,
          conversionResult: this.conversionResult,
          date: new Date().toLocaleString(),
        };
        this.conversionHistory.unshift(conversionEntry); // Add new entry at the top

      } catch (err) {
        this.error = 'Failed to fetch conversion rates. Please try again.';
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.currency-crypto-converter {
  margin-top: 20px;
}

form {
  margin-bottom: 10px;
}

label {
  margin-right: 10px;
}

button {
  margin-top: 10px;
}

input[type="number"] {
  width: 100px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
}
</style>
