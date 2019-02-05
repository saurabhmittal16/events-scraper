const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    date: String,
    realDate: String,
    location: String,
    guests: String,
    link: String,
    image: String,
    details: String,
    organiser: String,
    hostedBy: String,
    eventID: String
}, {
    versionKey: false
});

module.exports = mongoose.model('event', eventSchema);