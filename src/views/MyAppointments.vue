<template>
	<ion-page>
		<ion-header :translucent="true">
			<ion-toolbar>
				<ion-title class="ion-margin-bottom">Minhas Datas</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="medium">Minhas Datas</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-list>
				<ion-item v-if="!has_appointments">
					Você ainda não possui nenhum agendamento. <br />
					Vá na aba "Agendar" para marcar um horário
				</ion-item>
				<ion-item v-else v-for="appointment of user_appointments">
					<ion-label>
						<span class="date">
							{{
								format(appointment.date, `d 'de' MMMM`, {
									locale: ptBR,
									addSuffix: true,
								})
							}}
						</span>
						<span class="service">{{ appointment.service }}</span>
						<span class="time">
							{{
								format(appointment.start, `p`, { locale: ptBR })
							}}
							-
							{{ format(appointment.end, `p`, { locale: ptBR }) }}
						</span>
					</ion-label>
					<button
						class="delete"
						@click="confirm_delete_appointment(appointment.id)"
					>
						x
					</button>
				</ion-item>
			</ion-list>
		</ion-content>
	</ion-page>
</template>
<script setup>
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		alertController,
	} from '@ionic/vue';
	import { format } from 'date-fns';
	import { ptBR } from 'date-fns/locale';
	import { auth, database } from '../firebase';
	import {
		onSnapshot,
		query,
		where,
		collection,
		orderBy,
		deleteDoc,
		doc,
	} from 'firebase/firestore';
	import { computed, reactive } from 'vue';

	const user_appointments = reactive([]);
	const appointments_collection = collection(database, 'appointments');

	const has_appointments = computed(() => user_appointments.length > 0);

	load_appointments();

	function load_appointments() {
		const user_appointments_query = query(
			appointments_collection,
			where('client_id', '==', auth.currentUser.uid),
			orderBy('date'),
			orderBy('start_time')
		);
		const user_appointments_snap = onSnapshot(
			user_appointments_query,
			(snap) => {
				const updated_user_appointments = [];
				snap.forEach((doc) => {
					const appointment_data = doc.data();

					const user_appointment = {
						id: doc.id,
						date: appointment_data.date.toDate(),
						service: appointment_data.service,
						start: appointment_data.start_time.toDate(),
						end: appointment_data.end_time.toDate(),
					};
					updated_user_appointments.push(user_appointment);
				});
				user_appointments.length = 0;
				user_appointments.push(...updated_user_appointments);
			}
		);
	}

	async function confirm_delete_appointment(id) {
		const delete_alert = await alertController.create({
			header: 'Deletar esse agendamento?',
			subHeader: 'Você pode perder a data e horário!',
			buttons: [
				{
					text: 'Sim',
					role: 'submit',
					handler: async () => {
						delete_appointment(id);
					},
				},
				{
					text: 'Não',
					role: 'cancel',
				},
			],
		});
		await delete_alert.present();
	}
	async function delete_appointment(id) {
		await deleteDoc(doc(appointments_collection, id));
	}
</script>
<style scoped>
	.delete {
		background-color: var(--ion-color-danger-tint);
		padding: 4px 8px;
		color: white;
		border-radius: 6px;
		transition: 0.1s;
	}
	.delete:hover {
		background-color: var(--ion-color-danger-shade);
	}
</style>
