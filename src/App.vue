<template>
    <ion-app>
        <ion-router-outlet />
    </ion-app>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { IonApp, IonRouterOutlet } from '@ionic/vue';
    import { getMessaging, onMessage } from 'firebase/messaging';
    import { onAuthStateChanged } from 'firebase/auth';
    import { auth } from './firebase';
    import { check_user_messaging_token } from './modules/messaging_token';
    import { check_installation } from './modules/installation';
    import { check_birthday } from './modules/birthday';

    onMounted(() => {
        setup_message_handling();
        check_installation();
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            check_birthday();
        }
    });

    function setup_message_handling() {
        check_user_messaging_token();

        const messaging = getMessaging();

        onMessage(messaging, (payload) => {
            const notification_title = payload.notification.title;
            const notification_options = {
                body: payload.notification.body,
                image: payload.notification.image,
            };
            const notification = new Notification(
                notification_title,
                notification_options,
            );
        });
    }
</script>
