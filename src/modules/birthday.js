import { auth, database } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { alertController } from '@ionic/vue';

const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_DAY = 1;
const MAX_DAY = 31;

export async function check_birthday() {
    const doc_snap = await getDoc(
        doc(database, 'users', auth.currentUser.uid),
    );

    let has_birthday = false;
    if (doc_snap.exists()) {
        has_birthday =
            doc_snap.data().birth_day && doc_snap.data().birth_month;
    }

    if (!has_birthday) await show_birthday_alert();
    return;
}

export async function show_birthday_alert() {
    const birthday_alert = await create_birthday_alert();
    birthday_alert.present();
}

function create_birthday_alert() {
    return alertController.create({
        header: 'Quando é Seu Aniversário?',
        subHeader: 'Receba uma mensagem especial no dia!',
        inputs: [
            {
                name: 'day',
                type: 'number',
                placeholder: 'Dia (1 - 31)',
                min: MIN_DAY,
                max: MAX_DAY,
            },
            {
                name: 'month',
                type: 'number',
                placeholder: 'Mês (1 - 12)',
                min: MIN_MONTH,
                max: MAX_MONTH,
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
    if (!is_valid_date(data.month, data.day)) return false;

    const user = auth.currentUser;
    const user_doc = doc(database, 'users', user.uid);
    const user_info = {
        birth_day: data.day,
        birth_month: data.month,
        id: user.uid,
        name: user.displayName,
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

function is_valid_date(month, day) {
    month = Number(month);

    if (
        !month ||
        !day ||
        month < MIN_MONTH ||
        month > MAX_MONTH ||
        day < MIN_DAY ||
        day > MAX_DAY ||
        ([4, 6, 9, 11].includes(month) && day > 30) ||
        (month == 2 && day > 28)
    )
        return false;

    return true;
}
