const { onSchedule } = require('firebase-functions/v2/scheduler');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

exports.delete_past_appointments = onSchedule(
    {
        timeZone: 'America/Sao_Paulo',
        schedule: 'every day 23:59',
    },
    async (event) => {
        const now = new Date();
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
