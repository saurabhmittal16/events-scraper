const mongoose = require('mongoose');

const Event = require('./models/event');
const scrape = require('./facebook');
const single = require('./singleEvent');

const init = async () => {
    const data = await scrape();
    Object.keys(data).forEach(
        soc => {
            data[soc].forEach(
                async event => {
                    await Event.create({
                        ...event,
                        organiser: soc
                    });
                }
            )
        }
    );
    console.log("Events Scraped");

    const res = await single();
    console.log("Details Added");
}

mongoose.connect('mongodb://localhost:27017/eventhub', {useNewUrlParser: true})
    .then(
        async () => {
            console.log("Connected to DB");
            await init();            
        }
    );
