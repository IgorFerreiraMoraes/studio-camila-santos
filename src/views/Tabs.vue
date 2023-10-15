<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>
			<ion-tab-bar slot="bottom">
				<ion-tab-button tab="Home" href="/home">
					<ion-icon :icon="calendarNumberOutline" />
					<ion-label>Agendar</ion-label>
				</ion-tab-button>
				<ion-tab-button tab="Login" href="/login">
					<ion-icon :icon="bookmarkOutline" />
					<ion-label>Minhas Datas</ion-label>
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

	import { bookmarkOutline, calendarNumberOutline } from 'ionicons/icons';
</script>
<style scoped>
	ion-tab-button {
		--color-selected: var(--ion-color-tertiary);
	}
</style>
