<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script setup>
	import { IonApp, IonRouterOutlet } from '@ionic/vue';
	import { getMessaging, onMessage } from 'firebase/messaging';
	import { get_and_write_user_messaging_token } from './modules/messaging_token';

	get_and_write_user_messaging_token();

	const messaging = getMessaging();
	onMessage(messaging, (payload) => {
		console.log('Message received. ', payload);
	});
</script>
