<template>
	<ion-page>
		<ion-content>
			<p v-for="date in dates">
				{{ date }}
			</p>
		</ion-content>
	</ion-page>
</template>
<script setup>
	import { IonPage, IonContent } from '@ionic/vue';
	import { ref } from 'vue';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { database } from '../firebase.js';

	const dates = ref([]);

	const dates_snapshot = onSnapshot(
		collection(database, 'appointments'),
		(col) => {
			dates.value.length = 0;
			col.forEach((doc) => {
				dates.value.push(doc.data());
			});
		}
	);
</script>
