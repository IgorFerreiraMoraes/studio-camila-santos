<template>
	<h2>Horários</h2>
	<ion-select
		aria-label="Tipo de Serviço"
		interface="popover"
		placeholder="Qual Procedimento?"
		@ionChange="select_service($event)"
	>
		<ion-select-option v-for="service in services" :value="service">
			{{ service.name }}
		</ion-select-option>
	</ion-select>
	<ul>
		<li
			v-for="[slot_id, slot] in available_slots"
			:key="slot_id"
			:class="{ selected: selected_slots.includes(slot_id) }"
			@click="select_slots(slot_id)"
		>
			<p>{{ slot.start }} - {{ slot.finish }}</p>
		</li>
	</ul>
	<ion-fab slot="fixed" vertical="bottom" horizontal="center">
		<ion-fab-button color="tertiary" @click="make_appointment()">
			<ion-icon :icon="addOutline"></ion-icon>
		</ion-fab-button>
	</ion-fab>
</template>
<script setup>
	import { ref, watch } from 'vue';
	import {
		IonSelect,
		IonSelectOption,
		IonFab,
		IonFabButton,
		IonIcon,
	} from '@ionic/vue';
	import { addOutline } from 'ionicons/icons';
	import { database, auth } from '../firebase';
	import {
		collection,
		doc,
		setDoc,
		query,
		where,
		onSnapshot,
	} from 'firebase/firestore';
	import { useRouter } from 'vue-router';

	const router = useRouter();

	const props = defineProps(['selected_day']);

	const available_slots = ref(new Map());
	const services = [
		{ name: 'Manicure', duration: 0 },
		{ name: 'Depilação Completa', duration: 1 },
	];

	const selected_slots = ref([]);
	const selected_service = ref();

	function select_slots(slot_id) {
		if (
			!selected_service.value ||
			(selected_service.value.duration == 1 &&
				!available_slots.value.get(slot_id + 1))
		)
			return;
		selected_slots.value = [slot_id];
		if (selected_service.value.duration > 0)
			selected_slots.value.push(
				slot_id + selected_service.value.duration
			);
	}
	function select_service(event) {
		selected_service.value = event.detail.value;
		selected_slots.value = [];
	}

	watch(props, async () => {
		available_slots.value = new Map([
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

		const selected_day_query = query(
			collection(database, 'appointments'),
			where('date', '==', props.selected_day)
		);
		const unsubscribe = onSnapshot(selected_day_query, (snap) => {
			snap.forEach((doc) => {
				available_slots.value.delete(doc.data().taken_slot);
			});
		});
	});

	async function make_appointment() {
		if (!selected_service.value || selected_slots.value.length < 1) return;

		for (const slot of selected_slots.value) {
			const current_timestamp = new Date().getTime() + slot;
			const appointment_id = `${auth.currentUser.uid}_${current_timestamp}`;

			await setDoc(doc(database, 'appointments', appointment_id), {
				client_id: auth.currentUser.uid,
				client_name: auth.currentUser.displayName,
				date: props.selected_day,
				service: selected_service.value.name,
				taken_slot: slot,
			});
		}
		router.push('/thanks');
	}
</script>
<style scoped>
	h2 {
		text-align: center;
		font-family: 'Playfair Display', serif;
		font-size: 1.2rem;
		letter-spacing: -0.5px;
		color: #302571;
		padding: 0;
	}
	ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		height: 35%;
		overflow-y: scroll;
		padding: 0 24px 8px 24px;
		gap: 8px;
	}
	li {
		border: #302571 1px solid;
		text-align: center;
		border-radius: 8px;
		list-style: none;
		color: #302571;
		transition: 0.15s;
	}
	li:hover {
		background-color: #f4f5f8;
		cursor: pointer;
	}
	li.selected {
		background-color: #302571;
		color: white;
	}

	ion-select {
		display: grid;
		place-content: center;
	}

	ion-fab {
		margin-bottom: 12px;
	}
</style>
