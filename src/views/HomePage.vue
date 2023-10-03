<template>
	<ion-page>
		<ion-header :translucent="true">
			<ion-toolbar>
				<ion-title class="ion-margin-bottom">Agendamento</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="medium">Agendamento</ion-title>
				</ion-toolbar>
			</ion-header>
			<date-picker></date-picker>
		</ion-content>
	</ion-page>
</template>

<script setup>
	import {
		IonContent,
		IonHeader,
		IonPage,
		IonTitle,
		IonToolbar,
	} from '@ionic/vue';
	import DatePicker from '../components/DatePicker.vue';
	import { auth } from '../firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { useRouter } from 'vue-router';

	const router = useRouter();
	onAuthStateChanged(auth, (user) => {
		if (!user) router.push('/login');
	});
</script>

<style scoped>
	ion-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.3rem;
		letter-spacing: -0.5px;
		color: #302571;
	}
</style>
