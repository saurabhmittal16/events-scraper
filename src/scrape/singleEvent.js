/* Scrapes the details of all events stored in the DB */

const puppeteer = require('puppeteer');

const Event = require('../models/event');
const details = require('./details');

const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 926
        },
        args: ['--lang=en-US,en']
    });
    const page = await browser.newPage();

    const events = await Event.find({
        "created_at": {
            $gt: new Date(Date.now() - 60 * 60 * 1000)
        }
    })

    for (let i = 0; i < events.length; i++) {
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

module.exports = run;