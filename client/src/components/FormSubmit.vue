<template>
  <div class="container">
    <h2>Заполнить форму: {{ form.title }}</h2>
    <form @submit.prevent="submitForm" class="form-card">
      <div v-for="field in form.fields" :key="field._id">
        <label>{{ field.label }}</label>
        <input v-if="field.type === 'text'" v-model="submission.responses[field._id]" class="input" />
        <div v-if="field.type === 'checkbox'">
          <label v-for="option in field.options" :key="option">
            <input type="checkbox" :value="option" v-model="submission.responses[field._id]" />
            {{ option }}
          </label>
        </div>
        <div v-if="field.type === 'radio'">
          <label v-for="option in field.options" :key="option">
            <input type="radio" :value="option" v-model="submission.responses[field._id]"/>
            {{ option }}
          </label>
        </div>
      </div>
      <button type="submit" class="submit-btn">Отправить</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormSubmit',
  data() {
    return {form: {}, submission: {responses: {}}};
  },
  mounted() {
    axios.get('http://localhost:3000/forms/' + this.$route.params.id).then(res => {
      this.form = res.data;
      this.initializeResponses();
    });
  },
  methods: {
    initializeResponses() {
      this.form.fields.forEach(field => {
        this.submission.responses[field._id] = field.type === 'checkbox' ? [] : '';
      });
    },
    submitForm() {
      axios.post('http://localhost:3000/forms/' + this.form._id + '/submit', this.submission).then(() => {
        this.$router.push('/forms');
      });
    }
  }
};
</script>
