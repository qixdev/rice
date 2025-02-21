<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Login</h2>

      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" class="login-btn">Login</button>
      </form>

      <button @click="loginWithGoogle" class="google-btn">
        <img src="https://media.lpgenerator.ru/uploads/2019/07/11/1_thumb600x460.jpg" alt="Google" />
        Login with Google
      </button>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
        const response = await axios.post('http://localhost:3000/users/login', {
          email: this.email,
          password: this.password,
        }, {withCredentials: true});
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
  animation: slideIn 0.3s ease-in-out;
}

h2 {
  margin-bottom: 15px;
  color: #333;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}

.close:hover {
  color: #000;
}

input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #45a049;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  background: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;
}

.google-btn img {
  width: 18px;
  margin-right: 8px;
}

.google-btn:hover {
  background: #f7f7f7;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
