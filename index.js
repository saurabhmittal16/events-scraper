const admin = require("firebase-admin");
const serviceAccount = require("./scrape-to-db-firebase-adminsdk-by6hw-656e6a7392.json");

const scrape = require('./facebook');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://scrape-to-db.firebaseio.com"
});

const db = admin.firestore();

scrape().then(
    data => {
        Object.keys(data).forEach(
            key => {
                let ref = db.collection(key);
                data[key].forEach(
                    item => ref.add(item)
                );
            }
        )
    }
).catch(
    err => console.log(err)
);