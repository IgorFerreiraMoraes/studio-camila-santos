const { onCall } = require('firebase-functions/v2/https');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

exports.set_admin = onCall(async (request) => {
    const new_admin_email = request.data.email;
    let new_admin_uid;
    try {
        new_admin_uid = await get_user_id_by_email(new_admin_email);
    } catch {
        new_admin_uid = null;
    }
    if (!new_admin_uid)
        return `Não foi possível encontrar um usuário com o email ${new_admin_email}`;

    change_firestore_document_to_admin(new_admin_uid);

    return `O usuário com email ${new_admin_email} foi definido como administrador`;
});

async function get_user_id_by_email(email) {
    return admin
        .auth()
        .getUserByEmail(email)
        .then((user_record) => {
            return user_record.uid;
        });
}

function change_firestore_document_to_admin(id) {
    admin.firestore().doc(`users/${id}`).update({ is_admin: true });
}
