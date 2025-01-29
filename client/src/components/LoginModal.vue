<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Login</h2>

      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <button @click="loginWithGoogle" class="google-btn">Login with Google</button>

      <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password,
        });
        console.log('Login successful:', response.data);
        this.$emit('close');
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
      }
    },

    async loginWithGoogle() {
      try {
        window.location.href = 'http://localhost:3000/auth/google';
      } catch (error) {
        console.error('Google login error:', error);
        this.errorMessage = 'Failed to login with Google.';
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
.google-btn {
  background-color: #db4437;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  margin-top: 10px;
}
</style>
