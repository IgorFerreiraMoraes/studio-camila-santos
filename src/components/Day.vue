<template>
	<div class="day">
		{{ day_number }}
		{{ day_of_week }}
	</div>
</template>
<script setup>
	import { format } from 'date-fns';
	import { ptBR } from 'date-fns/locale';

	const props = defineProps(['day']);

	let day_of_week = format(props.day, 'EEEEEE', { locale: ptBR });
	let day_number = format(props.day, 'dd', { locale: ptBR });
</script>
<style scoped>
	.day {
		background-color: red;
		color: #fff;
		font-family: 'Montserrat', sans-serif;
	}
</style>
