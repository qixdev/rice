<template>
  <div class="container">
    <h2>Список форм</h2>
    <ul class="form-list">
      <li v-for="form in forms" :key="form._id" class="form-item">
        <router-link :to="'/forms/' + form._id">{{ form.title }}</router-link>
      </li>
    </ul>
    <router-link to="/forms/create" class="create-btn">Создать новую форму</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormsList',
  data() {
    return { forms: [] };
  },
  mounted() {
    axios.get('http://localhost:3000/forms').then(res => {
      this.forms = res.data;
    });
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.form-list {
  list-style: none;
  padding: 0;
}

.form-item {
  background: #e8f5e9;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-item a {
  text-decoration: none;
  font-weight: bold;
  color: #2e7d32;
}

.create-btn {
  display: inline-block;
  padding: 10px 15px;
  background: #4caf50;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 20px;
}

.create-btn:hover {
  background: #388e3c;
}
</style>
