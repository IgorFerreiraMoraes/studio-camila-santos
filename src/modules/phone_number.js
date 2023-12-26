import { auth, database } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { alertController } from '@ionic/vue';
import { isValidPhoneNumber } from 'libphonenumber-js/mobile';

export async function check_phone() {
    const doc_snap = await getDoc(
        doc(database, 'users', auth.currentUser.uid),
    );

    let has_phone = false;
    if (doc_snap.exists()) {
        has_phone = doc_snap.data().phone;
    }

    if (!has_phone) await show_phone_alert();
    return;
}

export async function show_phone_alert() {
    const phone_alert = await create_phone_alert();
    phone_alert.present();
}

function create_phone_alert() {
    return alertController.create({
        header: 'Qual seu Whatsapp?',
        subHeader: 'Se precisarmos contatar',
        inputs: [
            {
                name: 'phone',
                type: 'number',
                placeholder: 'Número com DDD',
            },
        ],
        buttons: [
            {
                text: 'pronto',
                role: 'submit',
                handler: (data) => {
                    if (update_user_doc(data)) return true;
                    return false;
                },
            },
        ],
        backdropDismiss: false,
        translucent: true,
    });
}

async function update_user_doc(data) {
    if (!isValidPhoneNumber(data.phone, 'BR')) return false;

    const user = auth.currentUser;
    const user_doc = doc(database, 'users', user.uid);
    const user_info = {
        id: user.uid,
        name: user.displayName,
        phone: data.phone,
    };

    const user_doc_snap = await getDoc(
        doc(database, 'users', auth.currentUser.uid),
    );
    if (!user_doc_snap.exists()) {
        setDoc(user_doc, user_info);
        return true;
    }

    updateDoc(user_doc, user_info);
    return true;
}
