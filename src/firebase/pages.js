/* Upload pages to Firebase */

const mongoose = require('mongoose');
const admin = require("firebase-admin");
const data = require('../../pages');

const serviceAccount = require("../serviceAccount.json");

// Firebase initialization
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://eventsflutter.firebaseio.com"
});
admin.firestore().settings( { timestampsInSnapshots: true });

const db = admin.firestore();  
const ref = db.collection('societies');

const run = async () => {
    Object.keys(data).forEach(
        async key => {
            await ref.doc(key).set(data[key]);
        }
    )
}

run();