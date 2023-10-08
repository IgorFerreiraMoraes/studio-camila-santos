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
				@click="sign_in(google)"
			>
				<ion-icon slot="start" :icon="logoGoogle"></ion-icon>
				Entrar com Google
			</ion-button>
			<ion-button
				color="tertiary"
				expand="block"
				@click="sign_in(facebook)"
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
	} from '@ionic/vue';
	import { useRouter } from 'vue-router';
	import { logoGoogle, logoFacebook, logoInstagram } from 'ionicons/icons';
	import { auth, database } from '../firebase';

	import { doc, setDoc, getDoc } from 'firebase/firestore';
	import {
		GoogleAuthProvider,
		FacebookAuthProvider,
		signInWithPopup,
		setPersistence,
		browserLocalPersistence,
		onAuthStateChanged,
	} from 'firebase/auth';

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
		if (user) {
			check_birthday();
			router.push('/');
		}
	});

	auth.languageCode = 'it';
	const google = new GoogleAuthProvider();
	const facebook = new FacebookAuthProvider();

	function sign_in(provider) {
		setPersistence(auth, browserLocalPersistence).then(() => {
			return signInWithPopup(auth, provider);
		});
	}
</script>
<style scoped>
	h1,
	p {
		font-family: 'Montserrat', sans-serif;
		margin: 0;
	}
	.welcome {
		margin: 16px 0;
	}
	ion-button {
		max-width: 560px;
		margin: 8px auto;
		transition: 0.15s;
	}
	ion-title {
		font-family: 'Playfair Display', serif;
		color: #302571;
	}
</style>
