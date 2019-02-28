const mongoose = require('mongoose');

const Event = require('./models/event');
const scrape = require('./scrape/main');
const single = require('./scrape/singleEvent');

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
}

mongoose.connect('mongodb://localhost:27017/eventhub', {useNewUrlParser: true})
    .then(
        async () => {
            console.log("Connected to DB");     
            await init();
            process.exit(0);            
        }
    );
