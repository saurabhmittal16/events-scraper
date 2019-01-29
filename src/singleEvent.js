const puppeteer = require('puppeteer');

const Event = require('./models/event');
const result = require('../result.json');

const run = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--lang=en-US,en']
    });
    const page = await browser.newPage();

    const events = await Event.find({});

    for(let i=0; i<events.length; i++) {
        try {
            await page.goto(events[i].link);
            await page.waitForSelector('div[data-testid="event-permalink-details"]');

            const data = await page.evaluate(() => {
                let details = document.querySelector('div[data-testid="event-permalink-details"]');
                return details.innerText;
            })
            events[i]["details"] = data;
            events[i].save();
        } catch (err) {
            console.log(err);
        }
    }
    browser.close();
}   

module.exports = run;