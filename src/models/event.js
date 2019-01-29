const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    date: String,
    location: String,
    guests: String,
    link: String,
    details: String,
    organiser: String
}, {
    versionKey: false
});

module.exports = mongoose.model('event', eventSchema);