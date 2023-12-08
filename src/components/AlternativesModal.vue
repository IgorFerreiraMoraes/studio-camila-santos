<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>Aplicativo</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>
            <ion-label class="ion-text-wrap">
                Olá! No momento, não conseguimos verificar se seu
                navegador suporta a instalação de aplicativos web. Aqui
                estão algumas dicas:

                <br />
                <br />

                1. Procure por 'Instalar aplicativo' ou 'Adicionar à
                tela inicial' no menu do seu navegador, (geralmente
                <ion-icon
                    :icon="ellipsisVertical"
                    color="tertiary"
                ></ion-icon>
                ou similares).

                <br />
                <br />

                2. Se não encontrar, considere instalar o Google Chrome,
                que costuma oferecer melhor compatibilidade.

                <br />
                <br />

                3. Caso prefira, continue usando o aplicativo no
                navegador. Todos os recursos estão disponíveis!
            </ion-label>
        </ion-item>
        <ion-button
            @click="cancel"
            class="ion-margin-horizontal"
            color="tertiary"
            expand="block"
        >
            Continuar por Aqui
        </ion-button>
    </ion-content>
</template>

<script setup>
    import {
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButton,
        IonItem,
        IonLabel,
        IonIcon,
        modalController,
    } from '@ionic/vue';
    import { ellipsisVertical } from 'ionicons/icons';

    function cancel() {
        modalController.dismiss(null, 'cancel');
    }
</script>
