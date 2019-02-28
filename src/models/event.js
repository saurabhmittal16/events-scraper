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
    eventID: String,
    categories: [String],
    isTech: Boolean
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('event', eventSchema);