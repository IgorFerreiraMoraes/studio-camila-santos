importScripts(
	'https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js'
);
importScripts(
	'https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js'
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
	apiKey: 'AIzaSyAYeFgawpgIuNlNnJwVL__BQqEzw2CkeWk',
	authDomain: 'studio-camila-santos.firebaseapp.com',
	projectId: 'studio-camila-santos',
	storageBucket: 'studio-camila-santos.appspot.com',
	messagingSenderId: '247953260689',
	appId: '1:247953260689:web:f9b2fe5ef5696763197f30',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
	return payload;
});
