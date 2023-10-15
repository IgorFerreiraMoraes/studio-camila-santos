import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue';
import Login from '../views/Login.vue';
import Thanks from '../views/Thanks.vue';

const routes = [
	{
		path: '/',
		component: () => import('@/views/Tabs.vue'),
		children: [
			{
				path: 'home',
				name: 'Home',
				component: HomePage,
			},
		],
		redirect: '/home',
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
