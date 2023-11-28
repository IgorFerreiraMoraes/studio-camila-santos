<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Studio Camila Santos</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding ion-text-center">
			<div class="welcome">
				<h1>Bem Vinda!</h1>
				<p>Faça seu login para agendar</p>
			</div>

			<ion-button
				color="tertiary"
				expand="block"
				@click="sign_in_with_provider(google)"
			>
				<ion-icon slot="start" :icon="logoGoogle"></ion-icon>
				Entrar com Google
			</ion-button>
			<ion-button
				color="tertiary"
				expand="block"
				@click="sign_in_with_provider(facebook)"
			>
				<ion-icon slot="start" :icon="logoFacebook"></ion-icon>
				Entrar com Facebook
			</ion-button>
			<ion-button
				href="https://www.instagram.com/studiocamila_santos/"
				target="blank"
				color="tertiary"
				fill="outline"
				expand="block"
			>
				<ion-icon slot="start" :icon="logoInstagram"></ion-icon>
				Conheça o Studio
			</ion-button>
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
		IonIcon,
		alertController,
	} from '@ionic/vue';
	import { useRouter } from 'vue-router';
	import { logoGoogle, logoFacebook, logoInstagram } from 'ionicons/icons';
	import { doc, setDoc, getDoc } from 'firebase/firestore';
	import {
		GoogleAuthProvider,
		FacebookAuthProvider,
		onAuthStateChanged,
	} from 'firebase/auth';
	import { auth, database } from '../firebase';
	import { sign_in_with_provider } from '../modules/auth';

	const router = useRouter();

	auth.languageCode = 'it';
	const google = new GoogleAuthProvider();
	const facebook = new FacebookAuthProvider();

	const MIN_MONTH = 1;
	const MAX_MONTH = 12;
	const MIN_DAY = 1;
	const MAX_DAY = 31;

	onAuthStateChanged(auth, (user) => {
		if (user) {
			handle_user_login();
		}
	});

	function handle_user_login() {
		check_birthday();
		router.push('/');
	}

	async function check_birthday() {
		const doc_snap = await getDoc(
			doc(database, 'users', auth.currentUser.uid)
		);

		const has_birthday = doc_snap.exists();

		if (!has_birthday) await show_birthday_alert();
		return;
	}

	async function show_birthday_alert() {
		const birthday_alert = await create_birthday_alert();
		birthday_alert.present();
	}

	function create_birthday_alert() {
		return alertController.create({
			header: 'Quando é Seu Aniversário?',
			subHeader: 'Receba uma mensagem especial no dia!',
			inputs: [
				{
					name: 'month',
					type: 'number',
					placeholder: 'Mês (1 - 12)',
					min: MIN_MONTH,
					max: MAX_MONTH,
				},
				{
					name: 'day',
					type: 'number',
					placeholder: 'Dia (1 - 31)',
					min: MIN_DAY,
					max: MAX_DAY,
				},
			],
			buttons: [
				{
					text: 'pronto',
					role: 'submit',
					handler: (data) => {
						if (create_user_doc(data)) return true;
						return false;
					},
				},
			],
			backdropDismiss: false,
			translucent: true,
		});
	}

	function create_user_doc(data) {
		if (!is_valid_date(data.month, data.day)) return;

		const user = auth.currentUser;
		const user_doc = doc(database, 'users', user.uid);
		setDoc(user_doc, {
			birth_day: data.day,
			birth_month: data.month,
			id: user.uid,
			name: user.displayName,
		});

		return true;
	}

	function is_valid_date(month, day) {
		month = Number(month);

		if (
			!month ||
			!day ||
			month < MIN_MONTH ||
			month > MAX_MONTH ||
			day < MIN_DAY ||
			day > MAX_DAY ||
			([4, 6, 9, 11].includes(month) && day > 30) ||
			(month == 2 && day > 28)
		)
			return false;

		return true;
	}
</script>
<style scoped>
	h1,
	p {
		margin: 0;
	}
	.welcome {
		margin: 16px 0;
	}
</style>
