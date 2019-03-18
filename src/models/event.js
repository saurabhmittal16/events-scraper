const mongoose = require('mongoose');
const map = require('../pages').map;

const eventSchema = new mongoose.Schema({
    name: String,
    date: String,
    society_name: String,
    society_id: String,
    // stores start date (temporarily)
    realDate: String,
    // stores date as string
    start: Date,
    end: Date,
    // start and end date of events
    location: String,
    guests: String,
    link: String,
    image: String,
    details: String,
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

eventSchema.pre('save', function(next) {
    let event = this;
    let start, end;
    if (event.realDate) {
        let arr = event.realDate.split(' ');
        if (arr.length === 7) {
            if (arr[4] === 'at') {
                start = arr[1] + ' ' + arr[2] + ' ' + arr[3] + ' ' + arr[5];
                end = start;
            } else {
                arr[5] = arr[5].split('-');
                start = arr[1] + ' ' + arr[2] + ' ' + arr[3] + ' ' + arr[5][0];
                end = arr[1] + ' ' + arr[2] + ' ' + arr[3] + ' ' + arr[5][1];
            }
        }
        else {
            start = arr[0] + ' ' + arr[1] + ' ' + arr[2] + ' ' + arr[4];
            end = arr[6] + ' ' + arr[7] + ' ' + arr[8] + ' ' + arr[10]; 
        }
        event.start = new Date(start);
        event.end = new Date(end);
    }
    if (!event.society_name) {
        event.society_name = map[event.society_id];
    }
    next();
});

module.exports = mongoose.model('event', eventSchema);