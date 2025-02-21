<template>
  <nav>
    <ul>
      <li @click="showLoginModal">Login</li>
      <li @click="showRegisterModal">Register</li>
      <li @click="goToProfile">My Profile</li>
      <li @click="goToAdmin">Admin</li>
      <li @click="goToDashboard">Dashboard</li>
      <li @click="goToForms">Forms</li>
    </ul>
    <LoginModal v-if="isLoginModalVisible" @close="isLoginModalVisible = false"/>
    <RegisterModal v-if="isRegisterModalVisible" @close="isRegisterModalVisible = false"/>
  </nav>
</template>

<script>
import LoginModal from './LoginModal.vue';
import RegisterModal from './RegisterModal.vue';

export default {
  components: {
    LoginModal,
    RegisterModal,
  },
  data() {
    return {
      isLoginModalVisible: false,
      isRegisterModalVisible: false,
    };
  },
  methods: {
    showLoginModal() {
      this.isLoginModalVisible = true;
    },
    showRegisterModal() {
      this.isRegisterModalVisible = true;
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    goToAdmin() {
      this.$router.push('/admin');
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    goToForms() {
      this.$router.push('/forms');
    }
  },
};
</script>

<style scoped>
nav {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #66bb6a;
  padding: 15px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px 15px;
  background: white;
  border-radius: 5px;
  color: #388e3c;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  text-align: center;
  margin-left: 10px;
}

li:hover {
  background: #43a047;
  color: white;
  transform: translateY(-2px);
}

li:active {
  transform: scale(0.95);
}
</style>
