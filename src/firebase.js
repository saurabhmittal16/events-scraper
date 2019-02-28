const Event = require('./models/event');
const lastUpdated = require('../last.json');

const run = async () => {
    // write events to firebase that were created or modified after the lastUpdated date
    const curr = new Date().getTime();
    if (curr - lastUpdated <= 1000) {
        console.log("Future");
    } else {
        console.log("Past");
    }
}

module.exports = run;