<template>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button
                    color="medium"
                    @click="cancel"
                >
                    Cancelar
                </ion-button>
            </ion-buttons>
            <ion-title>Aplicativo</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>
            <ion-label class="ion-text-wrap">
                Gostaria de um acesso rápido e fácil aos seus
                agendamentos? Clique no botão abaixo para instalar o
                aplicativo!
            </ion-label>
        </ion-item>
        <ion-button
            @click="show_install_prompt()"
            class="ion-margin-horizontal"
            color="tertiary"
            expand="block"
        >
            Adicionar à Tela Inicial
        </ion-button>
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
        modalController,
    } from '@ionic/vue';

    const props = defineProps(['browser_prompt']);

    function show_install_prompt() {
        props.browser_prompt.prompt();
    }

    function cancel() {
        modalController.dismiss(null, 'cancel');
    }
</script>
