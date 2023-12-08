<template>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button
                    color="medium"
                    @click="cancel"
                >
                    Ok
                </ion-button>
            </ion-buttons>
            <ion-title>Aplicativo</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>
            <ion-label class="ion-text-wrap">
                Instale este aplicativo em seu iPhone: aperte em
                <ion-icon
                    :icon="shareOutline"
                    color="tertiary"
                ></ion-icon>
                e depois em 'Adicionar à Tela de Início'
            </ion-label>
        </ion-item>
    </ion-content>
</template>

<script setup>
    import {
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonButton,
        IonItem,
        IonLabel,
        IonIcon,
        modalController,
    } from '@ionic/vue';
    import { shareOutline } from 'ionicons/icons';

    function cancel() {
        modalController.dismiss(null, 'cancel');
    }
</script>
<style scoped>
    .ion-text-wrap {
        font-size: 1.1rem;
    }
    ion-icon {
        width: 1.5rem;
        height: 1.5rem;
    }
</style>
