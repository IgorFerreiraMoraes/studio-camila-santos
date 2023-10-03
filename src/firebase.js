import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAYeFgawpgIuNlNnJwVL__BQqEzw2CkeWk',
	authDomain: 'studio-camila-santos.firebaseapp.com',
	projectId: 'studio-camila-santos',
	storageBucket: 'studio-camila-santos.appspot.com',
	messagingSenderId: '247953260689',
	appId: '1:247953260689:web:f9b2fe5ef5696763197f30',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Handle Login States
export const auth = getAuth(app);
