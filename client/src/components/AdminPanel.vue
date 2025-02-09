<template>
  <div class="admin-panel">
    <h2>Admin Panel</h2>

    <div class="tabs">
      <button :class="{ active: activeTab === 'news' }" @click="activeTab = 'news'">Manage News</button>
      <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Manage Users</button>
    </div>

    <div v-if="activeTab === 'news'">
      <button @click="createNews">Add News</button>

      <div v-if="isCreatingOrEditingNews" class="news-form">
        <h3>{{ newsFormTitle }}</h3>
        <form @submit.prevent="submitNewsForm">
          <div>
            <label for="name_en">Title (English):</label>
            <input v-model="newsFormData.name_en" type="text" id="name_en" required />
          </div>
          <div>
            <label for="name_ru">Title (Russian):</label>
            <input v-model="newsFormData.name_ru" type="text" id="name_ru" required />
          </div>
          <div>
            <label for="desc_en">Description (English):</label>
            <textarea v-model="newsFormData.desc_en" id="desc_en" required></textarea>
          </div>
          <div>
            <label for="desc_ru">Description (Russian):</label>
            <textarea v-model="newsFormData.desc_ru" id="desc_ru" required></textarea>
          </div>

          <div>
            <label for="images">Images (max 3):</label>
            <input type="file" id="images" multiple @change="handleNewsFileUpload" accept="image/*" />
          </div>

          <div v-if="newsFormData.images.length">
            <h4>Selected Images:</h4>
            <ul>
              <li v-for="(img, index) in newsFormData.images" :key="index">{{ img.name }}</li>
            </ul>
          </div>

          <button type="submit">{{ isEditingNews ? "Update" : "Create" }} News</button>
        </form>

        <button @click="resetNewsForm">Cancel</button>
      </div>

      <div v-if="!isCreatingOrEditingNews">
        <table>
          <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="news in newsList" :key="news._id">
            <td>{{ news.title }}</td>
            <td>{{ news.content }}</td>
            <td>
              <button @click="editNews(news)">Edit</button>
              <button @click="deleteNews(news._id)">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'users'">
      <button @click="createUser">Add New User</button>

      <div v-if="isCreatingOrEditingUser" class="user-form">
        <h3>{{ userFormTitle }}</h3>
        <form @submit.prevent="submitUserForm">
          <div>
            <label for="name">Name:</label>
            <input v-model="userFormData.name" type="text" id="name" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input v-model="userFormData.email" type="email" id="email" required />
          </div>
          <div>
            <label for="role">Role:</label>
            <select v-model="userFormData.role" id="role" required>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit">{{ isEditingUser ? "Update" : "Create" }} User</button>
        </form>
        <button @click="resetUserForm">Cancel</button>
      </div>

      <div v-if="!isCreatingOrEditingUser">
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
    </div>

    <div v-if="loading">Loading...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activeTab: "news",

      newsList: [],
      isCreatingOrEditingNews: false,
      isEditingNews: false,
      newsFormData: { name_en: "", name_ru: "", desc_en: "", desc_ru: "", images: [] },
      newsFormTitle: "Create News",

      users: [],
      isCreatingOrEditingUser: false,
      isEditingUser: false,
      userFormData: { name: "", email: "", role: "user" },
      userFormTitle: "Create User",

      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchNews() {
      this.loading = true;
      try {
        const response = await axios.get("/news");
        this.newsList = response.data;
      } catch (err) {
        this.error = "Failed to fetch news.";
      } finally {
        this.loading = false;
      }
    },

    createNews() {
      this.resetNewsForm();
      this.isCreatingOrEditingNews = true;
      this.newsFormTitle = "Create News";
      this.isEditingNews = false;
    },

    editNews(news) {
      this.isCreatingOrEditingNews = true;
      this.newsFormTitle = "Edit News";
      this.isEditingNews = true;
      this.newsFormData = { ...news };
    },

    resetNewsForm() {


      this.newsFormData = { name_en: "", name_ru: "", desc_en: "", desc_ru: "", images: [] };
      this.isCreatingOrEditingNews = false;
    },

    async submitNewsForm() {
      this.loading = true;

      try {
        if (this.isEditingNews) {
          await axios.put(`http://localhost:3000/news/${this.newsFormData._id}`, this.newsFormData);
        } else {
          await axios.post("http://localhost:3000/news", this.newsFormData);
        }
        this.resetNewsForm();
        await this.fetchNews();
      } catch (err) {
        this.error = "Failed to save news.";
      } finally {
        this.loading = false;
      }
    },

    async deleteNews(newsId) {
      if (confirm("Delete this news?")) {
        await axios.delete(`http://localhost:3000/news/${newsId}`);
        await this.fetchNews();
      }
    },

    handleNewsFileUpload(event) {
      this.newsFormData.images = Array.from(event.target.files);
    },

    async fetchUsers() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:3000/admin/users");
        this.users = response.data;
      } catch (err) {
        this.error = "Failed to fetch users.";
      } finally {
        this.loading = false;
      }
    },

    createUser() {
      this.resetUserForm();
      this.isCreatingOrEditingUser = true;
      this.userFormTitle = "Create User";
      this.isEditingUser = false;
    },

    editUser(user) {
      this.isCreatingOrEditingUser = true;
      this.userFormTitle = "Edit User";
      this.isEditingUser = true;
      this.userFormData = { ...user };
    },

    resetUserForm() {
      this.userFormData = { name: "", email: "", role: "user" };
      this.isCreatingOrEditingUser = false;
    },

    async submitUserForm() {
      this.loading = true;
      try {
        if (this.isEditingUser) {
          await axios.put(`http://localhost:3000/admin/edit/${this.userFormData._id}`, this.userFormData);
        } else {
          await axios.post("http://localhost:3000/admin/add", this.userFormData);
        }
        this.resetUserForm();
        await this.fetchUsers();
      } catch (err) {
        this.error = "Failed to save user.";
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId) {
      if (confirm("Delete this user?")) {
        await axios.delete(`http://localhost:3000/admin/delete/${userId}`);
        await this.fetchUsers();
      }
    },
  },

  mounted() {
    this.fetchNews();
    this.fetchUsers();
  },
};
</script>

<style scoped>
.tabs button.active {
  font-weight: bold;
}
</style>
