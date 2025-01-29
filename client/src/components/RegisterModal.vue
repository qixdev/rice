copy
vue

<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '', // Updated to email
      password: '',
      errorMessage: null, // To hold error messages
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:3000/users/register', {
          email: this.email,
          password: this.password,
        });
        console.log('Registration successful:', response.data);
        this.$emit('close');
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.error;
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    },
  },
};
</script>
<style scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}
.close {
  cursor: pointer;
}
</style>