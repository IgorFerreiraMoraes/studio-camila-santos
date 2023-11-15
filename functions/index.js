/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require('firebase-functions');
const { onSchedule } = require('firebase-functions/v2/scheduler');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

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
