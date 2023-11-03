<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>
			<ion-tab-bar slot="bottom">
				<ion-tab-button tab="Home" href="/home">
					<ion-icon :icon="calendarNumberOutline" />
					<ion-label>Agendar</ion-label>
				</ion-tab-button>
				<ion-tab-button tab="MyAppointments" href="/my-appointments">
					<ion-icon :icon="bookmarkOutline" />
					<ion-label>Minhas Datas</ion-label>
				</ion-tab-button>

				<ion-tab-button
					tab="AllDates"
					href="/all-dates"
					v-if="is_user_admin"
				>
					<ion-icon :icon="roseOutline" />
					<ion-label>Todos os Agendamentos</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script setup>
	import {
		IonPage,
		IonTabs,
		IonRouterOutlet,
		IonTabBar,
		IonTabButton,
		IonLabel,
		IonIcon,
	} from '@ionic/vue';
	import {
		bookmarkOutline,
		calendarNumberOutline,
		roseOutline,
	} from 'ionicons/icons';
	import { is_user_admin } from '../modules/auth';
</script>
