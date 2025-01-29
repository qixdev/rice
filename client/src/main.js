import {createApp} from 'vue';
import App from './App.vue';
import {createRouter, createWebHistory} from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import Profile from './components/Profile.vue';
import FAQ from './components/FAQ.vue';
import './styles.css';
import Dashboard from "./components/Dashboard.vue";
import AdminPanel from "./components/AdminPanel.vue";

createApp(App).mount('#app');


const routes = [
    {path: '/', component: LandingPage},
    {path: '/profile', component: Profile},
    {path: '/faq', component: FAQ},
    {path: '/dashboard', component: Dashboard},
    {path: '/admin', component: AdminPanel},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app');