<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title class="ion-margin-bottom"
                    >Agendamento</ion-title
                >
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="medium">Agendamento</ion-title>
                </ion-toolbar>
            </ion-header>
            <date-picker
                @select_day="(d) => (selected_day = d)"
            ></date-picker>
            <time-slots :selected_day="selected_day"></time-slots>
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
    } from '@ionic/vue';
    import { ref } from 'vue';
    import TimeSlots from '../components/TimeSlots.vue';
    import DatePicker from '../components/DatePicker.vue';

    const selected_day = ref();
</script>
