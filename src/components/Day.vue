<template>
	<div class="day">
		<p>
			{{ day_of_week }}
		</p>
		<p>
			{{ day_number }}
		</p>
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
		display: flex;
		flex-direction: column;
		gap: 12px;
		place-items: center;
		padding: 12px 0;
		border-radius: 8px;
		font-family: 'Montserrat', sans-serif;
	}
	.day:hover {
		background-color: #f4f5f8;
		cursor: pointer;
	}
	.day p {
		margin: 0;
	}
</style>
