const { logger } = require('firebase-functions');
const { onSchedule } = require('firebase-functions/v2/scheduler');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const { onCall } = require('firebase-functions/v2/https');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

exports.delete_past_appointments = onSchedule(
    'every day 22:00',
    async (event) => {
        const now = new Date(
            new Date().toLocaleString({
                timeZone: 'America/Sao_Paulo',
            }),
        );
        const appointments = admin
            .firestore()
            .collection('appointments');
        const past_appointments_query = appointments.where(
            'end_time',
            '<',
            now,
        );
        const past_appointments = await past_appointments_query.get();

        const delete_promises = [];
        past_appointments.forEach((doc) => {
            delete_promises.push(doc.ref.delete());
        });

        await Promise.all(delete_promises);
        return null;
    },
);

exports.send_birthday_message = onSchedule(
    'every day 10:00',
    async (event) => {
        const today = new Date();

        const users = admin.firestore().collection('users');
        const birthday_users_query = users
            .where('birth_day', '==', today.getDate().toString())
            .where(
                'birth_month',
                '==',
                (today.getMonth() + 1).toString(),
            );
        const birthday_users = await birthday_users_query.get();

        birthday_users.forEach((doc) => {
            const user = doc.data();
            const message = {
                notification: {
                    title: `Parabéns, ${user.name}!`,
                    body: 'Desejo que seu aniversário seja o início de um ano incrível, cheio de boas vibrações e momentos memoráveis. Felicidades! \n Studio Camila Santos',
                },
                token: user.messaging_token,
            };
            admin.messaging().send(message);
        });
    },
);

exports.send_reminder_message = onSchedule(
    'every day 08:00',
    async (event) => {
        const today = new Date(
            new Date().toLocaleString({
                timeZone: 'America/Sao_Paulo',
            }),
        );
        today.setHours(0, 0, 0, 0);

        const appointments = admin
            .firestore()
            .collection('appointments');
        const today_appointments_query = appointments.where(
            'date',
            '==',
            today.toString(),
        );
        const today_appointments = await today_appointments_query.get();

        today_appointments.forEach(async (doc) => {
            const appointment_time = doc.data().start_time;
            const appointment_hour = `${appointment_time.getHours()}:${appointment_time.getMinutes()}`;

            const client_id = doc.data().client_id;
            const client_reference = admin
                .firestore()
                .collection('users')
                .doc(client_id);
            const client_snap = await client_reference.get();
            const client = client_snap.data();

            const message = {
                notification: {
                    title: `${client.name}, seu horário é hoje!`,
                    body: `Às ${appointment_hour} com ${
                        doc.data().staff_name
                    }. Mal podemos esperar para vê-la! Até breve!`,
                },
                token: client.messaging_token,
            };
            admin.messaging().send(message);
        });
    },
);

exports.set_admin = onCall(async (request) => {
    const new_admin_email = request.data.email;
    let new_admin_uid;
    try {
        new_admin_uid = await get_user_id_by_email(new_admin_email);
    } catch {
        new_admin_uid = null;
    }
    if (!new_admin_uid)
        return `Não foi possível encontrar um usuário com o email ${new_admin_email}`;

    change_firestore_document_to_admin(new_admin_uid);

    return `O usuário com email ${new_admin_email} foi definido como administrador`;
});

function get_user_id_by_email(email) {
    return admin
        .auth()
        .getUserByEmail(email)
        .then((user_record) => {
            return user_record.uid;
        });
}

function change_firestore_document_to_admin(id) {
    admin.firestore().doc(`users/${id}`).update({ is_admin: true });
}
