<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Obrigada Por Agendar</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<p>
				{{ auth.currentUser.displayName }}, sua sessão foi marcada com
				sucesso!
			</p>
			<p>Estamos ansiosas para atendê-la na data e horário escolhidos.</p>
			<ion-button @click="go_home()" color="tertiary" expand="block"
				>Voltar à tela inicial</ion-button
			>
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
		IonButton,
	} from '@ionic/vue';
	import { auth } from '../firebase';
	import { useRouter } from 'vue-router';

	const router = useRouter();

	async function go_home() {
		await router.push('/');
	}
</script>
<style scoped>
	p {
		max-width: 560px;
	}
</style>
