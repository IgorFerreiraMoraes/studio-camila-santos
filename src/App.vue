<template>
    <ion-app>
        <ion-router-outlet />
    </ion-app>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { IonApp, IonRouterOutlet } from '@ionic/vue';
    import { onAuthStateChanged } from 'firebase/auth';
    import { auth, setup_message_handling } from './firebase';
    import { check_installation } from './modules/installation';
    import { check_birthday } from './modules/birthday';
    import { check_phone } from './modules/phone_number';

    onMounted(() => {
        setup_message_handling();
        check_installation();
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            check_birthday();
            check_phone();
        }
    });
</script>
