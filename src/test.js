/* Check for events that have some fields missing and rescrape those details */

const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

const Event = require('./models/event');
const details = require('./scrape/details');

const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 926 },
        args: ['--lang=en-US,en']
    });
    const page = await browser.newPage();

    let events = await Event.find({});
    events = events.filter(
        event => event.hasUndefined()
    );

    for(let i=0; i<events.length; i++) {
        try {
            await page.goto(events[i].link);
            await page.waitForSelector('div[data-testid="event-permalink-details"]');
            await page.waitForSelector("div#event_summary tbody tr");

            const data = await details(page);

            events[i] = Object.assign(events[i], data);
            await events[i].save();
        } catch (err) { 
            console.log(err);
        }
    }
    browser.close();
}

mongoose.connect('mongodb://localhost:27017/eventhub', {useNewUrlParser: true})
    .then(
        async () => {
            console.log("Connected to DB");    
            await run();
            console.log("Events Checked and Rescraped");
            process.exit(0);
        }
    );