<template>
	<div
		class="ion-justify-content-center ion-margin-vertical"
		id="select-month"
	>
		<button
			aria-label="Selecionar mês anterior"
			@click="change_month(-1)"
			v-if="month_index != 0"
		>
			<ion-icon :icon="chevronBack"></ion-icon>
		</button>
		{{ selected_month }}
		<button
			aria-label="Selecionar próximo mês"
			@click="change_month(1)"
			v-if="month_index != months.length - 1"
		>
			<ion-icon :icon="chevronForward"></ion-icon>
		</button>
	</div>
	<div class="ion-margin-horizontal scroll-horizontal">
		<Day
			v-for="day in days_in_selected_month"
			:key="day.getTime()"
			:day="day"
			:class="{ selected: is_same_day(selected_day, day) }"
			@click="selected_day = day"
		></Day>
	</div>
</template>
<script setup>
	import { IonIcon } from '@ionic/vue';
	import { chevronBack, chevronForward } from 'ionicons/icons';
	import {
		format,
		addMonths,
		eachDayOfInterval,
		startOfMonth,
		endOfMonth,
	} from 'date-fns';
	import { ptBR } from 'date-fns/locale';
	import { ref, watch } from 'vue';
	import Day from './Day.vue';

	const MONTHS_IN_ADVANCE = 4;

	const { months, days_in_month } = initialize_months();
	const {
		month_index,
		selected_month,
		days_in_selected_month,
		selected_day,
	} = initialize_selected();

	watch(month_index, () => {
		selected_month.value = months.value[month_index.value];
		days_in_selected_month.value = days_in_month.value[month_index.value];
	});

	const emit = defineEmits(['select_day']);
	watch(
		selected_day,
		() => {
			emit('select_day', selected_day.value);
		},
		{ immediate: true }
	);

	function initialize_months() {
		const today = new Date();
		const schedule_limit = addMonths(today, MONTHS_IN_ADVANCE);
		const months = ref([]);
		const days_in_month = ref([]);

		let current_month = today;

		while (current_month < schedule_limit) {
			let start_date = startOfMonth(current_month);
			if (current_month == today) start_date = today;

			const end_date = endOfMonth(current_month);

			days_in_month.value.push(
				eachDayOfInterval({ start: start_date, end: end_date })
			);
			months.value.push(
				format(current_month, 'MMMM, yyyy', { locale: ptBR })
			);
			current_month = addMonths(current_month, 1);
		}

		return { months, days_in_month };
	}

	function initialize_selected() {
		const month_index = ref(0);
		const selected_month = ref(months.value[month_index.value]);
		const days_in_selected_month = ref(
			days_in_month.value[month_index.value]
		);
		const selected_day = ref(days_in_selected_month.value[0]);

		return {
			month_index,
			selected_month,
			days_in_selected_month,
			selected_day,
		};
	}

	function change_month(months_to_change) {
		month_index.value += months_to_change;
	}

	function is_same_day(date1, date2) {
		return (
			date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() == date2.getDate()
		);
	}
</script>
<style scoped>
	#select-month {
		display: flex;
		gap: 0.5rem;
	}
	#select-month > button {
		background: none;
		color: #000;
	}

	.scroll-horizontal {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 15%;
		overflow-x: scroll;
		padding-bottom: 6px;
		gap: 8px;
	}
</style>
