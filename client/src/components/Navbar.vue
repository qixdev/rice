<template>
  <nav>
    <ul>
      <li @click="showLoginModal">Login</li>
      <li @click="showRegisterModal">Register</li>
      <li @click="goToProfile">My Profile</li>
      <li @click="goToAdmin">Admin</li>
      <li @click="goToDashboard">Dashboard</li>
    </ul>
    <LoginModal v-if="isLoginModalVisible" @close="isLoginModalVisible = false"/>
    <RegisterModal v-if="isRegisterModalVisible" @close="isRegisterModalVisible = false"/>
  </nav>
</template>

<script>
import LoginModal from './LoginModal.vue';
import RegisterModal from './RegisterModal.vue';
import {useRouter} from 'vue-router';

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
    }
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: #282c34;
  color: white;
}

ul {
  list-style: none;
  display: flex;
}

li {
  margin: 0 15px;
  cursor: pointer;
}
</style>