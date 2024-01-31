<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Deletar Conta</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <p>
                <b>⚠️ AVISO</b>: {{ auth.currentUser.displayName }},
                esta ação é irreversível. Se você continuar, seus
                agendamentos e dados da conta serão excluídos
                permanentemente.
            </p>
            <p>
                Caso realmente queira deletar sua conta, aperte no botão
                abaixo e confirme sua escolha.
            </p>
            <ion-button
                @click="go_home()"
                color="tertiary"
                expand="block"
            >
                Voltar à tela inicial
            </ion-button>
            <ion-button
                @click="confirm_delete_account()"
                color="danger"
                expand="block"
            >
                APAGAR CONTA
            </ion-button>
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
        alertController,
    } from '@ionic/vue';
    import { auth, database } from '../firebase';
    import { useRouter } from 'vue-router';
    import { deleteUser, signOut } from 'firebase/auth';
    import {
        collection,
        deleteDoc,
        doc,
        getDocs,
        query,
        where,
    } from 'firebase/firestore';

    const router = useRouter();

    async function go_home() {
        await router.push('/');
    }

    async function confirm_delete_account() {
        const delete_alert = await alertController.create({
            header: 'Deletar Conta?',
            subHeader:
                'Sentimos ver você a partir, se mudar de ideia, estaremos aqui!',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                },
                {
                    text: 'Sim',
                    role: 'submit',
                    handler: async () => {
                        delete_account();
                    },
                },
            ],
        });
        await delete_alert.present();
    }

    async function delete_account() {
        console.log('hey');
        const appointments_collection = collection(
            database,
            'appointments',
        );
        const user_appointments_query = query(
            appointments_collection,
            where('client_id', '==', auth.currentUser.uid),
        );
        const user_appointments = await getDocs(
            user_appointments_query,
        );
        user_appointments.forEach(async (appointment) => {
            console.log(appointment.id);
            await deleteDoc(
                doc(database, 'appointments', appointment.id),
            );
        });

        await deleteDoc(doc(database, 'users', auth.currentUser.uid));

        deleteUser(auth.currentUser);

        signOut(auth).then(() => {
            router.push('/login');
        });
    }
</script>
<style scoped>
    p {
        max-width: 560px;
    }
</style>
