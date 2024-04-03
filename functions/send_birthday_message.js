const { onSchedule } = require('firebase-functions/v2/scheduler');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

exports.send_birthday_message = onSchedule(
    {
        timeZone: 'America/Sao_Paulo',
        schedule: 'every day 07:00',
    },
    async (event) => {
        const today = new Date();

        const users = admin.firestore().collection('users');
        const birthday_users_query = users
            .where('birth_day', 'in', [
                today.getDate().toString(),
                '0' + today.getDate().toString(),
            ])
            .where('birth_month', 'in', [
                (today.getMonth() + 1).toString(),
                '0' + (today.getMonth() + 1).toString(),
            ]);
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
