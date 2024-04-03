const { onSchedule } = require('firebase-functions/v2/scheduler');
const { format, subHours } = require('date-fns');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

exports.send_reminder_message = onSchedule(
    {
        timeZone: 'America/Sao_Paulo',
        schedule: 'every day 05:00',
    },
    async (event) => {
        const today = new Date();
        today.setHours(3, 0, 0, 0);

        const appointments = admin
            .firestore()
            .collection('appointments');
        const today_appointments_query = appointments.where(
            'date',
            '==',
            today,
        );
        const today_appointments = await today_appointments_query.get();

        today_appointments.forEach(async (doc) => {
            const appointment_time = subHours(
                doc.data().start_time.toDate(),
                3,
            );
            const appointment_hour = `${format(
                appointment_time,
                'kk:mm',
            )}`;

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
