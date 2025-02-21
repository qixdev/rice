<template>
  <div class="container">
    <h2>Создать форму</h2>
    <div class="form-card">
      <input v-model="form.title" placeholder="Название формы" class="input" />
      <textarea v-model="form.description" placeholder="Описание" class="textarea"></textarea>

      <div v-for="(field, index) in form.fields" :key="index" class="field">
        <input v-model="field.label" placeholder="Название поля" class="input" />
        <select v-model="field.type" class="select">
          <option value="text">Текст</option>
          <option value="checkbox">Чекбокс</option>
          <option value="radio">Радио</option>
        </select>
        <input v-if="field.type !== 'text'" v-model="field.options" placeholder="Опции (через запятую)" class="input" />
        <label>
          <input type="checkbox" v-model="field.required" /> Обязательное поле
        </label>
        <button @click="removeField(index)" class="delete-btn">Удалить</button>
      </div>

      <button @click="addField" class="add-btn">Добавить поле</button>
      <button @click="createForm" class="submit-btn">Создать</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormCreate',
  data() {
    return { form: { title: '', description: '', fields: [] } };
  },
  methods: {
    addField() {
      this.form.fields.push({ label: '', type: 'text', options: [], required: false });
    },
    removeField(index) {
      this.form.fields.splice(index, 1);
    },
    createForm() {
      axios.post('http://localhost:3000/forms', this.form).then(() => {
        this.$router.push('/forms');
      });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.form-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.input, .textarea, .select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.add-btn, .submit-btn, .delete-btn {
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.add-btn {
  background: #8bc34a;
  color: white;
}

.submit-btn {
  background: #4caf50;
  color: white;
}

.delete-btn {
  background: #e57373;
  color: white;
}

.add-btn:hover, .submit-btn:hover {
  opacity: 0.8;
}
</style>
