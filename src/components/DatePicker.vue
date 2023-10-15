<template>
	<div
		class="ion-justify-content-center ion-margin-vertical"
		id="select-month"
	>
		<button @click="change_month(-1)">
			<ion-icon v-if="month_index != 0" :icon="chevronBack"></ion-icon>
		</button>
		{{ selected_month }}
		<button @click="change_month(1)">
			<ion-icon
				v-if="month_index != months.length - 1"
				:icon="chevronForward"
			></ion-icon>
		</button>
	</div>
	<div class="ion-margin-horizontal scroll-horizontal">
		<Day
			v-for="day in days_in_selected_month"
			:key="day.getTime()"
			:day="day"
			:class="{ selected: same_day(selected_day, day) }"
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

	const emit = defineEmits(['select_day']);

	const today = new Date();
	const schedule_limit = addMonths(today, 4);
	const months = ref([]);
	const days_in_month = ref([]);

	let current_month = today;
	while (current_month < schedule_limit) {
		let start_date = startOfMonth(current_month);
		if (current_month == today) {
			start_date = today;
		}
		let end_date = endOfMonth(current_month);
		days_in_month.value.push(
			eachDayOfInterval({ start: start_date, end: end_date })
		);
		months.value.push(
			format(current_month, 'MMMM, yyyy', { locale: ptBR })
		);
		current_month = addMonths(current_month, 1);
	}

	const month_index = ref(0);
	const selected_month = ref(months.value[month_index.value]);
	const days_in_selected_month = ref(days_in_month.value[month_index.value]);
	watch(month_index, () => {
		selected_month.value = months.value[month_index.value];
		days_in_selected_month.value = days_in_month.value[month_index.value];
	});

	function change_month(months_to_change) {
		if (months_to_change < 0 && month_index.value > 0) {
			month_index.value--;
		} else if (
			months_to_change > 0 &&
			month_index.value < months.value.length - 1
		) {
			month_index.value++;
		}
	}

	function same_day(day1, day2) {
		return (
			day1.getFullYear() == day2.getFullYear() &&
			day1.getMonth() == day2.getMonth() &&
			day1.getDate() == day2.getDate()
		);
	}

	const selected_day = ref('');
	watch(selected_day, () => {
		emit('select_day', selected_day.value);
	});
	selected_day.value = days_in_selected_month.value[0];
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
