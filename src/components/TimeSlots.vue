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
	import { slots_reference } from '../SlotsReference';
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
		const selected_day_query = query(
			collection(database, 'appointments'),
			where('date', '==', props.selected_day)
		);
		const selected_day_snap = onSnapshot(selected_day_query, (snap) => {
			available_slots.value = new Map(slots_reference);

			snap.forEach((doc) => {
				available_slots.value.delete(doc.data().taken_slot);
			});
		});
	});

	async function make_appointment() {
		if (!selected_service.value || selected_slots.value.length < 1) return;

		const unique_service_id = `${auth.currentUser.uid}_${
			selected_service.value.name
		}_${new Date().getTime()}`;

		for (const slot of selected_slots.value) {
			const current_timestamp = new Date().getTime() + slot;
			const appointment_id = `${auth.currentUser.uid}_${current_timestamp}`;

			await setDoc(doc(database, 'appointments', appointment_id), {
				client_id: auth.currentUser.uid,
				client_name: auth.currentUser.displayName,
				date: props.selected_day,
				service: selected_service.value.name,
				taken_slot: slot,
				unique_service_id: unique_service_id,
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
