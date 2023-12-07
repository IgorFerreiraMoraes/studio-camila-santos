<template>
    <ion-app>
        <ion-router-outlet />
    </ion-app>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import {
        IonApp,
        IonRouterOutlet,
        modalController,
    } from '@ionic/vue';
    import { getMessaging, onMessage } from 'firebase/messaging';
    import { check_user_messaging_token } from './modules/messaging_token';
    import InstallModal from './components/InstallModal.vue';

    let prompt;
    const is_modal_open = ref(false);

    onMounted(() => {
        check_installation();
        setup_message_handling();
    });

    async function check_installation() {
        if (!user_in_browser()) return;

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            prompt = event;

            if (!is_modal_open.value) {
                show_install_modal(prompt);
                is_modal_open.value = true;
            }
        });
    }

    function user_in_browser() {
        return (
            typeof window !== 'undefined' &&
            'BeforeInstallPromptEvent' in window
        );
    }

    async function show_install_modal(prompt) {
        const modal = await modalController.create({
            component: InstallModal,
            componentProps: { browser_prompt: prompt },
        });
        modal.present();
    }

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
