import { getToken } from 'firebase/messaging';
import { database, messaging, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function check_user_messaging_token() {
    const current_token = await getToken(messaging, {
        vapidKey:
            'BJlFonPC6dTp5ZJTgcoohFvRH_gC1nSAhH4qQOci5oGS7YvgVmEzHWYAyjUa8PPj6D7Pwbg5A2nwelm29y0GVdQ',
    });

    if (!current_token) Notification.requestPermission();
    if (!auth.currentUser.uid) return;
    write_user_token(current_token);
}

async function write_user_token(token) {
    const user_existing_token = user_has_messaging_token;
    if (!user_existing_token || user_existing_token == token) return;

    await updateDoc(doc(database, 'users', auth.currentUser.uid), {
        messaging_token: token,
    });
}
async function user_has_messaging_token() {
    if (!auth.currentUser.uid) return false;

    const user_document = await getDoc(
        doc(database, 'users', auth.currentUser.uid),
    );
    if (!user_document.exists()) return false;

    return user_document.data().messaging_token;
}
