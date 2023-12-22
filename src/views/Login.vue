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
                <ion-icon
                    slot="start"
                    :icon="logoGoogle"
                ></ion-icon>
                Entrar com Google
            </ion-button>
            <ion-button
                color="tertiary"
                expand="block"
                @click="sign_in_with_provider(facebook)"
            >
                <ion-icon
                    slot="start"
                    :icon="logoFacebook"
                ></ion-icon>
                Entrar com Facebook
            </ion-button>
            <ion-button
                href="https://www.instagram.com/studiocamila_santos/"
                target="blank"
                color="tertiary"
                fill="outline"
                expand="block"
            >
                <ion-icon
                    slot="start"
                    :icon="logoInstagram"
                ></ion-icon>
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
    import {
        logoGoogle,
        logoFacebook,
        logoInstagram,
    } from 'ionicons/icons';
    import {
        GoogleAuthProvider,
        FacebookAuthProvider,
        onAuthStateChanged,
    } from 'firebase/auth';
    import { auth } from '../firebase';
    import { sign_in_with_provider } from '../modules/auth';

    const router = useRouter();

    auth.languageCode = 'it';
    const google = new GoogleAuthProvider();
    const facebook = new FacebookAuthProvider();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            router.push('/');
        }
    });
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
