<template>
	<h2>Horários</h2>
	<ion-select
		aria-label="Tipo de Serviço"
		interface="popover"
		placeholder="Qual Plocedimento?"
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
</template>
<script setup>
	import { ref } from 'vue';
	import { IonSelect, IonSelectOption } from '@ionic/vue';

	const available_slots = {
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
	};

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
				!available_slots[slot.id + 1])
		)
			return;
		selected_slots.value = [
			slot.id,
			slot.id + selected_service.value.duration,
		];
	}
	function select_service(event) {
		selected_service.value = event.detail.value;
		selected_slots.value = [];
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
</style>
