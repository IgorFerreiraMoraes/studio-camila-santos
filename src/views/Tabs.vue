<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>
			<ion-tab-bar slot="bottom">
				<ion-tab-button tab="Home" href="/home">
					<ion-icon :icon="calendarNumberOutline" />
					<ion-label>Agendar</ion-label>
				</ion-tab-button>
				<ion-tab-button tab="MyDates" href="/my-dates">
					<ion-icon :icon="bookmarkOutline" />
					<ion-label>Minhas Datas</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="AllDates" href="/all-dates">
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
	import { ref } from 'vue';
	import { database, auth } from '../firebase';
	import { collection, getDoc, doc } from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';

	const is_admin = ref(false);

	onAuthStateChanged(auth, async (user) => {
		if (user) {
			const user_document = await getDoc(
				doc(collection(database, 'users'), user.uid)
			);
			if (user_document.exists() && user_document.data().is_admin)
				is_admin.value = true;
		} else router.push('/login');
	});
</script>
<style scoped>
	ion-tab-button {
		--color-selected: var(--ion-color-tertiary);
	}
</style>
