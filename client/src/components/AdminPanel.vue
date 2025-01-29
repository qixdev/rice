<template>
  <div class="admin-panel">
    <h2>Admin Panel - Manage Users</h2>

    <button @click="createUser">Add New User</button>

    <!-- Create/Edit User Form -->
    <div v-if="isCreatingOrEditing" class="user-form">
      <h3>{{ formTitle }}</h3>
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Name:</label>
          <input v-model="formData.name" type="text" id="name" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input v-model="formData.email" type="email" id="email" required />
        </div>
        <div>
          <label for="role">Role:</label>
          <select v-model="formData.role" id="role" required>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <button type="submit">{{ isEditing ? 'Update' : 'Create' }} User</button>
        </div>
      </form>
      <button @click="resetForm">Cancel</button>
    </div>

    <!-- User List -->
    <div v-if="!isCreatingOrEditing">
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(user)">Edit</button>
            <button @click="deleteUser(user._id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading and Error -->
    <div v-if="loading">Loading users...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      isCreatingOrEditing: false,
      isEditing: false,
      formData: { name: "", email: "", role: "user" },
      formTitle: "Create User",
    };
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3000/admin/users");
        this.users = response.data;
      } catch (err) {
        this.error = "Failed to fetch users.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    createUser() {
      this.resetForm();
      this.isCreatingOrEditing = true;
      this.formTitle = "Create User";
      this.isEditing = false;
    },

    editUser(user) {
      this.isCreatingOrEditing = true;
      this.formTitle = "Edit User";
      this.isEditing = true;
      this.formData = { ...user };
    },

    resetForm() {
      this.formData = { name: "", email: "", role: "user" };
      this.isCreatingOrEditing = false;
      this.error = null;
    },

    async submitForm() {
      this.loading = true;
      try {
        if (this.isEditing) {
          await axios.put(`http://localhost:3000/admin/edit/${this.formData._id}`, this.formData);
        } else {
          await axios.post("http://localhost:3000/admin/add", this.formData);
        }
        this.resetForm();
        this.fetchUsers();
      } catch (err) {
        this.error = "Failed to save user data.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId) {
      const confirmDelete = confirm("Are you sure you want to delete this user?");
      if (confirmDelete) {
        try {
          await axios.delete(`http://localhost:3000/admin/delete/${userId}`);
          this.fetchUsers();
        } catch (err) {
          this.error = "Failed to delete user.";
          console.error(err);
        }
      }
    },
  },

  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.admin-panel {
  margin: 20px;
}

.user-form {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 10px;
  text-align: left;
}

button {
  margin-top: 10px;
}
</style>
