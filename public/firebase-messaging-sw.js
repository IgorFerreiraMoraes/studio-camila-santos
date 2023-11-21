importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
	'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js'
);
importScripts('/sw.js');

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
