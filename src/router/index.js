import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue';
import Login from '../views/Login.vue';
import Thanks from '../views/Thanks.vue';

const routes = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/home',
		name: 'Home',
		component: HomePage,
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/thanks',
		name: 'Thanks',
		component: Thanks,
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
