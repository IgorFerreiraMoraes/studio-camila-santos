<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title class="ion-margin-bottom"
                    >Minha Conta</ion-title
                >
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="medium">Minha Conta</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-card>
                <ion-card-header>
                    <ion-card-title size="medium"
                        >{{ user_name }}!</ion-card-title
                    >
                    <ion-card-subtitle>Olá,</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <ion-button
                        expand="block"
                        color="tertiary"
                        @click="logout()"
                    >
                        Sair
                    </ion-button>
                </ion-card-content>
            </ion-card>
            <ion-list>
                <ion-item
                    button
                    @click="call_set_admin()"
                    v-if="is_user_admin"
                >
                    <ion-icon
                        :icon="personAddOutline"
                        size="small"
                    ></ion-icon>
                    Incluir Administradora
                </ion-item>
                <ion-item
                    button
                    @click="show_birthday_alert()"
                >
                    <ion-icon
                        :icon="balloonOutline"
                        size="small"
                    ></ion-icon>
                    Mudar Aniversário
                </ion-item>
                <ion-item
                    button
                    @click="show_phone_alert()"
                >
                    <ion-icon
                        :icon="callOutline"
                        size="small"
                    ></ion-icon>
                    Mudar Número
                </ion-item>
                <ion-item
                    button
                    href="https://wa.me/5511910604946"
                    target="_blank"
                >
                    <ion-icon
                        :icon="logoWhatsapp"
                        size="small"
                    ></ion-icon>
                    Entrar em contato
                </ion-item>
                <ion-item
                    @click="router.push('/deletar-usuario')"
                    color="danger"
                    button
                >
                    <ion-icon
                        :icon="warningOutline"
                        size="small"
                    ></ion-icon>
                    DELETAR CONTA
                </ion-item>
            </ion-list>
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
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
        IonButton,
        IonList,
        IonItem,
        IonIcon,
        alertController,
    } from '@ionic/vue';
    import {
        balloonOutline,
        logoWhatsapp,
        callOutline,
        personAddOutline,
        warningOutline,
    } from 'ionicons/icons';
    import { useRouter } from 'vue-router';
    import { signOut } from 'firebase/auth';
    import { httpsCallable } from 'firebase/functions';
    import { auth, functions } from '../firebase';
    import { is_user_admin } from '../modules/auth';
    import { show_birthday_alert } from '../modules/birthday';
    import { show_phone_alert } from '../modules/phone_number';

    const user_name = auth.currentUser.displayName;
    const router = useRouter();

    function logout() {
        signOut(auth).then(() => {
            router.push('/login');
        });
    }

    async function call_set_admin() {
        const new_admin_email = await get_new_admin_email();
        if (!new_admin_email) return;

        const set_admin = httpsCallable(functions, 'set_admin');
        set_admin({ email: new_admin_email }).then(async (result) => {
            const message_alert = show_message_alert(result.data);
        });
    }

    async function get_new_admin_email() {
        const email_alert = await create_new_admin_email_alert();
        await email_alert.present();

        const email_alert_response = await email_alert.onDidDismiss();

        if (
            !email_alert_response.data ||
            email_alert_response.role == 'backdrop' ||
            email_alert_response.role == 'cancel'
        )
            return;

        return email_alert_response.data.values.email;
    }

    function create_new_admin_email_alert() {
        return alertController.create({
            header: 'Insira o e-mail da nova administradora:',
            inputs: [{ name: 'email', placeholder: 'email' }],
            buttons: [
                {
                    name: 'cancel',
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    name: 'submit',
                    text: 'Pronto',
                    role: 'submit',
                    handler: (data) => {
                        return is_email_valid(data.email);
                    },
                },
            ],
        });
    }

    function is_email_valid(email) {
        const valid_email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return valid_email_regex.test(email);
    }

    async function show_message_alert(message) {
        const message_alert = await alertController.create({
            header: 'Operação De Administrador',
            message: message,
            buttons: ['Fechar'],
        });
        message_alert.present();
    }
</script>
<style scoped>
    ion-icon {
        margin-right: 6px;
    }
</style>
