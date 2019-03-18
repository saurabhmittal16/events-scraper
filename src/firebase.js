/* Upload events to Firebase */

const mongoose = require('mongoose');
const admin = require("firebase-admin");
const Event = require('./models/event');

const serviceAccount = require("./serviceAccount.json");

// Firebase initialization
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://eventsflutter.firebaseio.com"
});
admin.firestore().settings( { timestampsInSnapshots: true });

const db = admin.firestore();  
const ref = db.collection('events');
const mini_ref = db.collection('events_mini');

const curr = new Date().getTime();

const writeData = async (event) => {
    let temp = {
        name: event.name || '',
        image: event.image || '',
        details: event.details || '',
        date: event.start || '',
        location: event.location || '',
        society: event.society_name || '',
        society_id: event.society_id || '',
        society_fullname: event.hostedBy || '',
        college: 'DTU',
        tech: event.isTech || false,
        keywords: event.categories || []
    };
    return ref.doc(event.eventID).set(temp);
}

const writeMiniData = async (event) => {
    let temp = {
        name: event.name || '',
        image: event.image || '',
        date: event.start || '',
        location: event.location || '',
        society: event.society_name || '',
        college: 'DTU',
        tech: event.isTech || false,
    };
    return mini_ref.doc(event.eventID).set(temp);
}

mongoose.connect('mongodb://localhost:27017/eventhub', {useNewUrlParser: true})
    .then(
        async () => {
            console.log("Connected to DB");     
            const events = await Event.find({});
            return events;
        }
    )
    .then(
        events => events.forEach(
            async (event, index) => {                
                await writeData(event);
                await writeMiniData(event);
                if (index === events.length - 1) {
                    console.log("Uploaded");
                    process.exit(0);
                }
            }
        )
    );
