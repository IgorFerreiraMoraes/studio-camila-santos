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
				<ion-item v-for="appointment of user_dates">
					<p class="date">
						{{
							formatRelative(appointment.date, new Date(), {
								locale: ptBR,
								addSuffix: true,
							})
						}}
					</p>
					<p class="service">{{ appointment.service }}</p>
					<p class="time">{{ slots.get(appointment.slot) }}</p>
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
	} from '@ionic/vue';
	import { format, formatDistance, formatRelative } from 'date-fns';
	import { ptBR } from 'date-fns/locale';

	import { auth } from '../firebase';
	import { database } from '../firebase';
	import {
		getDocs,
		query,
		where,
		collection,
		orderBy,
	} from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';

	const router = useRouter();
	const user_dates = ref([]);

	async function load_dates() {
		const dates_collection = collection(database, 'appointments');
		const user_dates_query = query(
			dates_collection,
			where('client_id', '==', auth.currentUser.uid),
			orderBy('date'),
			orderBy('taken_slot')
		);
		const user_dates_snap = await getDocs(user_dates_query);

		user_dates_snap.forEach((doc) => {
			const date_data = doc.data();

			const user_date = {
				date: date_data.date.toDate(),
				service: date_data.service,
				slot: date_data.taken_slot,
			};
			user_dates.value.push(user_date);
		});
	}

	onAuthStateChanged(auth, (user) => {
		if (user) load_dates();
		else router.push('/login');
	});

	const slots = new Map([
		[
			1,
			{
				start: '7:00',
				finish: '7:30',
			},
		],
		[
			2,
			{
				start: '7:30',
				finish: '8:00',
			},
		],
		[
			3,
			{
				start: '8:00',
				finish: '8:30',
			},
		],
		[
			4,
			{
				start: '8:30',
				finish: '9:00',
			},
		],
		[
			5,
			{
				start: '9:00',
				finish: '9:30',
			},
		],
		[
			6,
			{
				start: '9:30',
				finish: '10:00',
			},
		],
		[
			7,
			{
				start: '10:00',
				finish: '10:30',
			},
		],
		[
			8,
			{
				start: '10:30',
				finish: '11:00',
			},
		],
		[
			9,
			{
				start: '11:00',
				finish: '11:30',
			},
		],
		[
			10,
			{
				start: '11:30',
				finish: '12:00',
			},
		],
		[
			11,
			{
				start: '12:00',
				finish: '12:30',
			},
		],
		[
			12,
			{
				start: '12:30',
				finish: '13:00',
			},
		],
		[
			13,
			{
				start: '13:00',
				finish: '13:30',
			},
		],
		[
			14,
			{
				start: '13:30',
				finish: '14:00',
			},
		],
		[
			15,
			{
				start: '14:00',
				finish: '14:30',
			},
		],
		[
			16,
			{
				start: '14:30',
				finish: '15:00',
			},
		],
		[
			17,
			{
				start: '15:00',
				finish: '15:30',
			},
		],
		[
			18,
			{
				start: '15:30',
				finish: '16:00',
			},
		],
		[
			19,
			{
				start: '16:00',
				finish: '16:30',
			},
		],
		[
			20,
			{
				start: '16:30',
				finish: '17:00',
			},
		],
		[
			21,
			{
				start: '17:00',
				finish: '17:30',
			},
		],
		[
			22,
			{
				start: '17:30',
				finish: '18:00',
			},
		],
		[
			23,
			{
				start: '18:00',
				finish: '18:30',
			},
		],
		[
			24,
			{
				start: '18:30',
				finish: '19:00',
			},
		],
	]);
</script>
<style scoped>
	ion-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.3rem;
		letter-spacing: -0.5px;
		color: #302571;
		padding: 0;
	}
</style>
