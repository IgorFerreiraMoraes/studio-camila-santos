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
			v-for="slot in available_slots"
			:key="slot.id"
			:class="{ selected: selected_slots.includes(slot.id) }"
			@click="select_slots(slot)"
		>
			<p>{{ slot.start }} - {{ slot.finish }}</p>
		</li>
	</ul>
	<ion-fab vertical="bottom" horizontal="center">
		<ion-fab-button color="tertiary" @click="make_appointment()">
			<ion-icon :icon="calendarNumberOutline"></ion-icon>
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
	import { calendarNumberOutline } from 'ionicons/icons';
	import { database, auth } from '../firebase';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { useRouter } from 'vue-router';
	const router = useRouter();

	const props = defineProps(['selected_day']);

	let available_slots = ref({});

	const services = [
		{ name: 'Manicure', duration: 0 },
		{ name: 'Depilação Completa', duration: 1 },
	];

	const selected_slots = ref([]);
	const selected_service = ref();

	function select_slots(slot) {
		if (
			!selected_service.value ||
			(selected_service.value.duration == 1 &&
				!available_slots.value[slot.id + 1])
		)
			return;
		selected_slots.value = [slot.id];
		if (selected_service.value.duration > 0)
			selected_slots.value.push(
				slot.id + selected_service.value.duration
			);
	}
	function select_service(event) {
		selected_service.value = event.detail.value;
		selected_slots.value = [];
	}

	let selected_day_doc;
	watch(props, async () => {
		available_slots = ref({
			1: {
				id: 1,
				start: '9:30',
				finish: '10:00',
			},
			2: {
				id: 2,
				start: '10:00',
				finish: '10:30',
			},
			3: {
				id: 3,
				start: '10:30',
				finish: '11:00',
			},
			4: {
				id: 4,
				start: '11:00',
				finish: '11:30',
			},
			5: {
				id: 5,
				start: '11:30',
				finish: '12:00',
			},
			6: {
				id: 6,
				start: '12:00',
				finish: '12:30',
			},
		});
		selected_day_doc = await getDoc(
			doc(database, 'occupied_slots', props.selected_day.toString())
		);
		if (selected_day_doc.exists()) {
			for (const slot of selected_day_doc.data().slots) {
				delete available_slots.value[slot.taken_slots];
			}
		}
	});

	async function make_appointment() {
		if (!selected_service.value || selected_slots.value.length < 1) return;

		let slots_to_occupy = [];
		for (const slot of selected_slots.value) {
			slots_to_occupy.push({
				client_id: auth.currentUser.uid,
				client_name: auth.currentUser.displayName,
				service: selected_service.value,
				taken_slots: slot,
			});
		}

		if (!selected_day_doc.exists()) {
			await setDoc(
				doc(database, 'occupied_slots', props.selected_day.toString()),
				{
					slots: slots_to_occupy,
				}
			);
			router.push('/thanks');
		} else {
		}
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
		padding: 0 24px;
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
