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
    import IosModal from './components/IosModal.vue';
    import AlternativesModal from './components/AlternativesModal.vue';

    let prompt;
    const is_modal_open = ref(false);

    onMounted(() => {
        check_installation();
        setup_message_handling();
    });

    async function check_installation() {
        if (!user_can_install()) return;

        if (is_ios() && !('BeforeInstallPromptEvent' in window)) {
            show_modal(IosModal);
            return;
        }

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            prompt = event;

            if (!is_modal_open.value) {
                show_modal(InstallModal, {
                    browser_prompt: prompt,
                });
                is_modal_open.value = true;
            }
        });
    }

    function user_can_install() {
        if (typeof window == 'undefined' || navigator.standalone)
            return false;

        if (
            ('serviceWorker' in navigator &&
                'BeforeInstallPromptEvent' in window) ||
            is_ios()
        ) {
            return true;
        }

        show_modal(AlternativesModal);
        return false;
    }

    function is_ios() {
        return (
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !window.MSStream
        );
    }

    async function show_modal(modal_component, modal_props = {}) {
        const modal = await modalController.create({
            component: modal_component,
            componentProps: modal_props,
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
