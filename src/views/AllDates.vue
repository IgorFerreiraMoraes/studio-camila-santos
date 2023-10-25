<template>
	<ion-page>
		<ion-content>
			<ion-list>
				<ion-item v-for="date in dates">
					<ion-label>
						<span class="date">
							{{
								format(date.date.toDate(), `d 'de' MMMM`, {
									locale: ptBR,
									addSuffix: true,
								})
							}}
						</span>
						<span>{{ date.client_name }}</span>
						<span class="service">{{ date.service }}</span>
						<span class="time">
							{{ slots_reference.get(date.taken_slot).start }} -
							{{ slots_reference.get(date.taken_slot).finish }}
						</span>
					</ion-label>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>
<script setup>
	import {
		IonPage,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
	} from '@ionic/vue';
	import { ref } from 'vue';
	import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { database } from '../firebase.js';
	import { slots_reference } from '../SlotsReference.js';
	import { format } from 'date-fns';
	import { ptBR } from 'date-fns/locale';

	const dates = ref([]);

	const dates_query = query(
		collection(database, 'appointments'),
		orderBy('date'),
		orderBy('taken_slot')
	);
	const dates_snapshot = onSnapshot(dates_query, (col) => {
		dates.value.length = 0;
		col.forEach((doc) => {
			dates.value.push(doc.data());
		});
	});
</script>
<style scoped>
	ion-label span {
		display: block;
	}
</style>
