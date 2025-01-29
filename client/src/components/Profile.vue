<template>
  <div>
    <h2>Your Profile</h2>
    <div class="card">
      <h3>Profile Details</h3>
      <p>Your profile information goes here.</p>
    </div>
    <router-link to="/faq" class="button">Go to FAQ</router-link>
  </div>
</template>

<script>
export default {
  name: 'Profile',
};
</script>

<style scoped>
.button {
  display: inline-block;
  padding: 10px 15px;
  background-color: #4a90e2;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #357ab8;
}
</style>