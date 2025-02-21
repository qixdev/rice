<template>
  <div class="container">
    <h2>{{ form.title }}</h2>
    <p>{{ form.description }}</p>
    <router-link :to="'/forms/' + form._id + '/submit'" class="submit-btn">Заполнить форму</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormView',
  data() {
    return { form: {} };
  },
  mounted() {
    axios.get('http://localhost:3000/forms/' + this.$route.params.id).then(res => {
      this.form = res.data;
    });
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

p {
  color: #555;
}

.submit-btn {
  display: inline-block;
  padding: 10px 15px;
  background: #4caf50;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 20px;
}

.submit-btn:hover {
  background: #388e3c;
}
</style>
