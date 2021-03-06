const mongoose = require('mongoose');
const data = require('../../pages');

const eventSchema = new mongoose.Schema({
    name: String,
    society_name: String,
    society_id: String,
    // stores start date (temporarily)
    realDate: String,
    // stores date as string
    start: Date,
    end: Date,
    // start and end date of events
    location: String,
    link: String,
    image: String,
    details: String,
    hostedBy: String,
    eventID: String,
    // categories: [String],
    // isTech: Boolean
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

eventSchema.pre('save', function(next) {
    try {
        let event = this;
        let start, end;
        if (event.realDate) {
            let arr = event.realDate.split(' ');
            if (arr[4] === "from") {
                arr[5] = arr[5].split("-");
                start = arr[1] + " " + arr[2] + " " + arr[3] + " " + arr[5][0];
                end = arr[1] + " " + arr[2] + " " + arr[3] + " " + arr[5][1];
            } else if (arr[4] === "at") {
                start = arr[1] + " " + arr[2] + " " + arr[3] + " " + arr[5];
                end = start;
            } else {
                if (arr[3] === "at") {
                    start = arr[0] + " " + arr[1] + " " + arr[2] + " " + arr[4];
                    end = arr[6] + " " + arr[7] + " " + arr[8] + " " + arr[10];
                } else if (arr[2] === "at") {
                    let year = new Date().getFullYear();
                    start = arr[0] + " " + arr[1] + " " + String(year) + " " + arr[3];
                    end = arr[5] + " " + arr[6] + " " + String(year) + " " + arr[8];
                }
            }
            event.start = new Date(start);
            event.end = new Date(end);
        }
        if (!event.society_name) {
            event.society_name = data[event.society_id].name;
        }
        next();
    } catch (e) {
        console.log(e);
    }
});

const keys = [
    'name',
    'society_name',
    'society_id',
    'realDate',
    'start',
    'end',
    'location',
    'link',
    'image',
    'details',
    'hostedBy',
    'eventID',
];

eventSchema.methods.hasUndefined = function() {
    const event = this;
    // ans -> true if every attribute is not undefined
    let ans = keys.every(key => event[key] !== undefined);
    // return true if event has undefined attributes
    return !ans;
}

module.exports = mongoose.model('event', eventSchema);