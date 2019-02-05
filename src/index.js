const mongoose = require('mongoose');
const fs = require('fs');

const Event = require('./models/event');
const scrape = require('./facebook');
const single = require('./singleEvent');

const init = async () => {
    console.time("Events Scraped");
    const data = await scrape();
    Object.keys(data).forEach(
        soc => {
            data[soc].forEach(
                async event => {
                    try {
                        const foundEvent = await Event.findOne({eventID: event.eventID});
                        if (!foundEvent) {
                            await Event.create({
                                ...event,
                                organiser: soc
                            });
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            )
        }
    );
    console.timeEnd("Events Scraped");

    console.time("Details Scraped");
    const res = await single();
    console.timeEnd("Details Scraped");

    // Call write to firebase and then update the lastUpdated date

    fs.writeFileSync('last.json', Date.now().toString(), (err) => {
        if (!err) console.log(err);
    });
}

mongoose.connect('mongodb://localhost:27017/eventhub', {useNewUrlParser: true})
    .then(
        async () => {
            console.log("Connected to DB");
            await init();
            process.exit(0);            
        }
    );
