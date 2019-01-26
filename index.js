const admin = require("firebase-admin");
const serviceAccount = require("./scrape-to-db-firebase-adminsdk-by6hw-656e6a7392.json");
const fs = require('fs')
const scrape = require('./facebook');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://scrape-to-db.firebaseio.com"
});

const db = admin.firestore();

scrape().then(
    data => {
        fs.writeFile('result.json', JSON.stringify(data, null, 4), (err) => {
            if (err)
                console.log('Error writing file')
            else
                console.log("saved result.json")
        })
        //dont update to firebase yet..

        // Object.keys(data).forEach(
        //     key => {
        //         let ref = db.collection(key);
        //         data[key].forEach(
        //             item => ref.add(item)
        //         );
        //     }
        // )
    }
).catch(
    err => console.log(err)
);