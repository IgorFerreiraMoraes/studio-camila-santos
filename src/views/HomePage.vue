<template>
	<ion-page>
		<ion-header :translucent="true">
			<ion-toolbar>
				<ion-title class="ion-margin-bottom">Agendamento</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="medium">Agendamento</ion-title>
				</ion-toolbar>
			</ion-header>
			<date-picker></date-picker>
		</ion-content>
	</ion-page>
</template>

<script setup>
	import {
		IonContent,
		IonHeader,
		IonPage,
		IonTitle,
		IonToolbar,
		alertController,
	} from '@ionic/vue';
	import DatePicker from '../components/DatePicker.vue';
	import { auth, database } from '../firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { doc, setDoc, getDoc } from 'firebase/firestore';
	import { useRouter } from 'vue-router';

	async function check_birthday() {
		const doc_snap = await getDoc(
			doc(database, 'users', auth.currentUser.uid)
		);
		let has_birthday = doc_snap.exists();

		const birthday_alert = await alertController.create({
			header: 'Quando é Seu Aniversário?',
			subHeader: 'Receba uma mensagem especial no dia!',
			inputs: [
				{
					name: 'month',
					type: 'number',
					placeholder: 'Mês (1 - 12)',
					min: 1,
					max: 12,
				},
				{
					name: 'day',
					type: 'number',
					placeholder: 'Dia (1 - 31)',
					min: 1,
					max: 31,
				},
			],
			buttons: [
				{
					text: 'pronto',
					role: 'submit',
					handler: (data) => {
						if (valid_date(data.month, data.day)) {
							const user = auth.currentUser;
							console.log(user.uid);
							console.log(user.displayName);

							const user_doc = doc(database, 'users', user.uid);
							setDoc(user_doc, {
								birth_day: data.day,
								birth_month: data.month,
								id: user.uid,
								name: user.displayName,
							});

							return true;
						}
						return false;
					},
				},
			],
			backdropDismiss: false,
			translucent: true,
		});
		if (!has_birthday) await birthday_alert.present();
		return;
	}
	function valid_date(month, day) {
		month = Number(month);

		if (
			!month ||
			!day ||
			month < 1 ||
			month > 12 ||
			day < 1 ||
			day > 31 ||
			([4, 6, 9, 11].includes(month) && day > 30) ||
			(month == 2 && day > 28)
		)
			return false;

		return true;
	}

	const router = useRouter();
	onAuthStateChanged(auth, (user) => {
		if (user) check_birthday();
		if (!user) router.push('/login');
	});
</script>

<style scoped>
	ion-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.3rem;
		letter-spacing: -0.5px;
		color: #302571;
	}
</style>
