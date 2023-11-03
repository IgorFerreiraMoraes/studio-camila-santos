import { createRouter, createWebHistory } from '@ionic/vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';

const routes = [
	{
		path: '/',
		component: () => import('../views/Tabs.vue'),
		children: [
			{
				path: 'home',
				name: 'Home',
				component: () => import('../views/HomePage.vue'),
				meta: {
					requiresAuth: true,
				},
			},
			{
				path: 'my-appointments',
				name: 'MyAppointments',
				component: () => import('../views/MyAppointments.vue'),
				meta: {
					requiresAuth: true,
				},
			},
			{
				path: 'appointments-with-me',
				name: 'AppointmentsWithMe',
				component: () => import('../views/AppointmentsWithMe.vue'),
				meta: {
					requiresAuth: true,
				},
			},
		],
		redirect: '/home',
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue'),
	},
	{
		path: '/thanks',
		name: 'Thanks',
		component: () => import('../views/Thanks.vue'),
		meta: {
			requiresAuth: true,
		},
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

	onAuthStateChanged(auth, (user) => {
		if (requiresAuth && !user) {
			next('/login');
		} else {
			next();
		}
	});
});

export default router;
