<template>
	<ion-page>
		<ion-header :translucent="true">
			<ion-toolbar>
				<ion-title class="ion-margin-bottom"
					>Agendados com Você</ion-title
				>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="medium">Agendados com Você</ion-title>
				</ion-toolbar>
			</ion-header>
			<p v-if="appointments <= 0" class="ion-margin-horizontal">
				Quando alguém marcar um agendamento com você, vai aparecer aqui!
			</p>
			<ion-list v-else>
				<ion-item v-for="appointment in appointments">
					<ion-label>
						<span class="date">
							{{
								format(
									appointment.date.toDate(),
									`d 'de' MMMM`,
									{
										locale: ptBR,
										addSuffix: true,
									}
								)
							}}
						</span>
						<div class="appointment-info">
							<span class="client"
								>{{ appointment.client_name }} -
							</span>
							<span class="service">{{
								appointment.service
							}}</span>
						</div>
						<span class="time">
							{{
								format(appointment.start_time.toDate(), 'p', {
									locale: ptBR,
								})
							}}
							-
							{{
								format(appointment.end_time.toDate(), 'p', {
									locale: ptBR,
								})
							}}
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
		IonTitle,
		IonToolbar,
		IonHeader,
	} from '@ionic/vue';
	import { reactive } from 'vue';
	import {
		collection,
		onSnapshot,
		orderBy,
		query,
		where,
	} from 'firebase/firestore';
	import { database, auth } from '../firebase.js';
	import { format } from 'date-fns';
	import { ptBR } from 'date-fns/locale';

	const appointments = reactive([]);
	const id = auth.currentUser.uid;

	const appointments_query = query(
		collection(database, 'appointments'),
		where('staff_id', '==', id),
		orderBy('date'),
		orderBy('start_time')
	);

	const appointments_snapshot = onSnapshot(
		appointments_query,
		(appointments_collection) => {
			appointments.length = 0;
			appointments_collection.forEach((appointment) => {
				appointments.push(appointment.data());
			});
		}
	);
</script>
<style scoped>
	.appointment-info > * {
		display: inline;
	}
</style>
