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
</script>

<style scoped>
	ion-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.3rem;
		letter-spacing: -0.5px;
		color: #302571;
	}
</style>
