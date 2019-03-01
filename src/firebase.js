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

const curr = new Date().getTime();

const writeData = async (event) => {
    let temp = {
        name: event.name || '',
        image: event.image || '',
        descp: event.details || '',
        date: event.start || '',
        realDate: event.realDate || '',
        categories: event.categories || [],
        location: event.location || '',
        link: event.link || '',
        organiser: event.organiser || '',
        hostedBy: event.hostedBy || '',
        isTech: event.isTech || '',
        guests: event.guest || '',
        start: event.start || '',
        end: event.end || ''
    };
    return ref.doc(event.eventID).set(temp);
}

// write events to firebase that were created or modified withing 60 minutes of current date
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
                if (index === events.length - 1) {
                    console.log("Uploaded");
                    process.exit(0);
                }
            }
        )
    );
