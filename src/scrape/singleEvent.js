/* Scrapes the details of all events stored in the DB */

const puppeteer = require('puppeteer');

const Event = require('../models/event');
const details = require('./details');

const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 926 },
        args: ['--lang=en-US,en']
    });
    const page = await browser.newPage();

    const events = await Event.find({});

    for(let i=0; i<events.length; i++) {
        try {
            await page.goto(events[i].link);
            await page.waitForSelector('div[data-testid="event-permalink-details"]');
            await page.waitForSelector("div#event_summary tbody tr");

            const data = await details(page);
            console.log(data.image);
            // if (
            //     events[i]["details"] != data.details ||
            //     events[i]["image"] != data.image || 
            //     events[i]["realDate"] != data.realDate || 
            //     events[i]["hostedBy"] != data.hostedBy
            // ) { }

            // Event.findOneAndUpdate({eventID: event.eventID}, data)

            events[i]["details"] = data.details;	
            events[i]["image"] = data.image;
            events[i]["realDate"] = data.realDate;
            events[i]["hostedBy"] = data.hostedBy;
            events[i].save();

        } catch (err) { 
            console.log(err);
        }
    }
    browser.close();
}   

module.exports = run;