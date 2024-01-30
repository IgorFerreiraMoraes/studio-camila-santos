<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Política de Privacidade</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <p>
                Recolhemos o seu nome/email e número de telefone para
                comunicações e agendamentos essenciais. Seus dados são
                armazenados com segurança no Google Firebase. Consulte
                as políticas do Google/Facebook para obter mais detalhes
                sobre a autenticação.
            </p>
            <ion-button
                @click="go_home()"
                color="tertiary"
                expand="block"
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
