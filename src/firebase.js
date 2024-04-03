import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, onMessage } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';
import {
    initializeAppCheck,
    ReCaptchaV3Provider,
} from 'firebase/app-check';
import { check_user_messaging_token } from './modules/messaging_token';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env
        .VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_CAPTCHA_KEY),
    isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
export const database = getFirestore(app);
export const messaging = getMessaging(app);
export const functions = getFunctions(app);

export function setup_message_handling() {
    check_user_messaging_token();
    configure_message_handling();
}

function configure_message_handling() {
    const messaging = getMessaging();

    onMessage(messaging, handle_message);
}

function handle_message(payload) {
    const { title, body, image } = payload.notification;
    const notification_options = { body, image };
    const notification = new Notification(title, notification_options);
}
