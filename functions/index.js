const { logger } = require('firebase-functions');
const { onSchedule } = require('firebase-functions/v2/scheduler');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});

exports.delete_past_appointments = onSchedule(
	'every day 22:00',
	async (event) => {
		const now = new Date(
			new Date().toLocaleString({ timeZone: 'America/Sao_Paulo' })
		);
		const appointments = admin.firestore().collection('appointments');
		const past_appointments_query = appointments.where(
			'end_time',
			'<',
			now
		);
		const past_appointments = await past_appointments_query.get();

		const delete_promises = [];
		past_appointments.forEach((doc) => {
			delete_promises.push(doc.ref.delete());
		});

		await Promise.all(delete_promises);
		return null;
	}
);

exports.send_birthday_message = onSchedule('every day 10:00', async (event) => {
	const today = new Date();

	const users = admin.firestore().collection('users');
	const birthday_users_query = users
		.where('birth_day', '==', today.getDate().toString())
		.where('birth_month', '==', (today.getMonth() + 1).toString());
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
});
