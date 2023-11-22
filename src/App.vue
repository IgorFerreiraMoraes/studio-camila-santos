<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script setup>
	import { IonApp, IonRouterOutlet } from '@ionic/vue';

	import { get_and_write_user_messaging_token } from './modules/messaging_token';
	get_and_write_user_messaging_token();
</script>
