import { ref } from 'vue';
import {
    onAuthStateChanged,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
} from 'firebase/auth';
import { getDoc, doc, collection } from 'firebase/firestore';
import { auth, database } from '../firebase';

const is_user_admin = ref(false);

function sign_in_with_provider(provider) {
    setPersistence(auth, browserLocalPersistence).then(() => {
        return signInWithPopup(auth, provider);
    });
}

const check_user_role = async (user) => {
    try {
        const user_document = await getDoc(
            doc(collection(database, 'users'), user.uid),
        );
        is_user_admin.value =
            user_document.exists() && user_document.data().is_admin;
    } catch (error) {}
};

onAuthStateChanged(auth, (user) => {
    check_user_role(user);
});

export { is_user_admin, sign_in_with_provider };
