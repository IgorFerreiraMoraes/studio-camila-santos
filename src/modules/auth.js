import { ref } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, collection } from 'firebase/firestore';
import { auth, database } from '../firebase';

const is_user_admin = ref(false);

const check_user_role = async (user) => {
	const user_document = await getDoc(
		doc(collection(database, 'users'), user.uid)
	);
	is_user_admin.value =
		user_document.exists() && user_document.data().is_admin;
};

onAuthStateChanged(auth, (user) => {
	check_user_role(user);
});

export { is_user_admin };
