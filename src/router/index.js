import { createRouter, createWebHistory } from '@ionic/vue-router';
import Login from '../views/Login.vue';
import HomePage from '../views/HomePage.vue';
import Thanks from '../views/Thanks.vue';
import MyDates from '../views/MyDates.vue';

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
			{
				path: 'my-dates',
				name: 'MyDates',
				component: MyDates,
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
