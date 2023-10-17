<template>
	<ion-page>
		<ion-header :translucent="true">
			<ion-toolbar>
				<ion-title class="ion-margin-bottom">Minhas Datas</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="medium">Minhas Datas</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-list>
				<ion-item v-for="i of [1, 2, 3]">
					{{ i }}
				</ion-item>
			</ion-list>
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
		IonList,
		IonItem,
	} from '@ionic/vue';
	import { auth } from '../firebase';
	import { database } from '../firebase';
</script>
<style scoped>
	ion-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.3rem;
		letter-spacing: -0.5px;
		color: #302571;
		padding: 0;
	}
</style>
