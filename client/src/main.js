import {createApp} from 'vue';
import App from './App.vue';
import {createRouter, createWebHistory} from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import Profile from './components/Profile.vue';
import FAQ from './components/FAQ.vue';
import './styles.css';
import Dashboard from "./components/Dashboard.vue";
import AdminPanel from "./components/AdminPanel.vue";
import NewsList from "./components/NewsList.vue";
import FormList from "./components/FormList.vue";
import FormCreate from "./components/FormCreate.vue";
import FormSubmit from "./components/FormSubmit.vue";
import FormView from "./components/FormView.vue";

createApp(App).mount('#app');


const routes = [
    {path: '/', component: LandingPage},
    {path: '/profile', component: Profile},
    {path: '/faq', component: FAQ},
    {path: '/dashboard', component: Dashboard},
    {path: '/admin', component: AdminPanel},
    {path: '/news', component: NewsList},
    {path: '/forms', component: FormList},
    {path: '/forms/create', component: FormCreate},
    {path: '/forms/submit', component: FormSubmit},
    {path: '/forms/view', component: FormView}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app');