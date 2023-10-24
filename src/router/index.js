import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tabs from '../views/Tabs.vue';
import Login from '../views/Login.vue';
import HomePage from '../views/HomePage.vue';
import Thanks from '../views/Thanks.vue';
import MyDates from '../views/MyDates.vue';
import AllDates from '../views/AllDates.vue';

const routes = [
	{
		path: '/',
		component: Tabs,
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
			{
				path: 'all-dates',
				name: 'AllDates',
				component: AllDates,
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
