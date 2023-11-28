<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { IonApp, IonRouterOutlet } from '@ionic/vue';
	import { getMessaging, onMessage } from 'firebase/messaging';
	import { check_user_messaging_token } from './modules/messaging_token';

	onMounted(() => {
		setup_message_handling();
	});

	function setup_message_handling() {
		check_user_messaging_token();

		const messaging = getMessaging();

		onMessage(messaging, (payload) => {
			const notification_title = payload.notification.title;
			const notification_options = {
				body: payload.notification.body,
				image: payload.notification.image,
			};
			const notification = new Notification(
				notification_title,
				notification_options
			);
		});
	}
</script>
