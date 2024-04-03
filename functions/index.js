const { onCall } = require('firebase-functions/v2/https');

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const delete_past_appointments = require('./delete_past_appointments');
const send_reminder_message = require('./send_reminder_message');
const send_birthday_message = require('./send_birthday_message');
const set_admin = require('./set_admin');

exports.delete_past_appointments =
    delete_past_appointments.delete_past_appointments;
exports.send_reminder_message =
    send_reminder_message.send_reminder_message;
exports.send_birthday_message =
    send_birthday_message.send_birthday_message;
exports.set_admin = set_admin.set_admin;
