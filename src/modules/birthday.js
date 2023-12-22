import { database } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { alertController } from '@ionic/vue';

const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_DAY = 1;
const MAX_DAY = 31;

export async function check_birthday() {
    const doc_snap = await getDoc(
        doc(database, 'users', auth.currentUser.uid),
    );
    console.log(doc_snap.data());

    const has_birthday = doc_snap.exists() && doc_snap.data();

    if (!has_birthday) await show_birthday_alert();
    return;
}

async function show_birthday_alert() {
    const birthday_alert = await create_birthday_alert();
    birthday_alert.present();
}

function create_birthday_alert() {
    return alertController.create({
        header: 'Quando é Seu Aniversário?',
        subHeader: 'Receba uma mensagem especial no dia!',
        inputs: [
            {
                name: 'month',
                type: 'number',
                placeholder: 'Mês (1 - 12)',
                min: MIN_MONTH,
                max: MAX_MONTH,
            },
            {
                name: 'day',
                type: 'number',
                placeholder: 'Dia (1 - 31)',
                min: MIN_DAY,
                max: MAX_DAY,
            },
        ],
        buttons: [
            {
                text: 'pronto',
                role: 'submit',
                handler: (data) => {
                    if (create_user_doc(data)) return true;
                    return false;
                },
            },
        ],
        backdropDismiss: false,
        translucent: true,
    });
}

function create_user_doc(data) {
    if (!is_valid_date(data.month, data.day)) return;

    const user = auth.currentUser;
    const user_doc = doc(database, 'users', user.uid);
    setDoc(user_doc, {
        birth_day: data.day,
        birth_month: data.month,
        id: user.uid,
        name: user.displayName,
    });

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
