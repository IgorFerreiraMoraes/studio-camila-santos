<template>
	<ion-toolbar>
		<ion-title>Horários</ion-title>
	</ion-toolbar>
	<ion-select
		aria-label="Escolher Profissional"
		interface="popover"
		placeholder="Com quem marcar?"
		@ion-change="handle_staff_selection($event)"
	>
		<ion-select-option
			v-for="staff of staff_reference"
			:value="staff"
			:key="staff"
		>
			{{ staff.name }}
		</ion-select-option>
	</ion-select>
	<ion-select
		v-if="selected_staff"
		aria-label="Tipo de Serviço"
		interface="popover"
		placeholder="Qual Procedimento?"
		v-model="selected_service"
	>
		<ion-select-option v-for="service of selected_staff.services">
			{{ service.name }}
		</ion-select-option>
	</ion-select>
	<ul v-if="selected_staff && selected_service">
		<li
			v-for="[slot_id, slot] in available_slots"
			:key="slot_id"
			:class="{ selected: selected_slots.includes(slot_id) }"
			@click="handle_slot_selection(slot_id)"
		>
			<p>{{ slot.start }} - {{ slot.finish }}</p>
		</li>
	</ul>
	<p class="cta" v-else>
		Pronta para brilhar? <br />
		Escolha uma profissional e um procedimento para ver os horários
		disponíveis.
	</p>
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
		IonTitle,
		IonToolbar,
	} from '@ionic/vue';
	import { addOutline } from 'ionicons/icons';
	import {
		slots_reference,
		staff_reference,
	} from '../modules/bussiness_reference';
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
	const selected_slots = ref([]);
	const selected_service = ref();
	const selected_staff = ref();

	function handle_staff_selection($event) {
		selected_staff.value = $event.detail.value;
		selected_service.value = null;
	}
	function handle_slot_selection(slot_id) {
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

	function render_slots() {
		available_slots.value = new Map(slots_reference); //reset slots

		const selected_day_query = query(
			collection(database, 'appointments'),
			where('date', '==', props.selected_day)
		);
		const selected_day_snap = onSnapshot(selected_day_query, (snap) => {
			snap.forEach((doc) => {
				available_slots.value.delete(doc.data().taken_slot); // Delete unavailable slots
			});
		});
	}

	watch(props, async () => {
		await render_slots();
	});

	async function make_appointment() {
		if (
			!selected_service.value ||
			selected_slots.value.length < 1 ||
			!selected_staff
		)
			return;

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
	p.cta {
		max-width: min(400px, 90%);
		margin: 1.55rem auto;
	}
	ion-title {
		font-weight: 400;
		background-color: white;
	}
	ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		overflow-y: scroll;
		height: calc(100vh - 465px);
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
