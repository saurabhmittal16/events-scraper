const puppeteer = require('puppeteer');

const Event = require('./models/event');

const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
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
                let image = document.querySelector('div.uiScaledImageContainer > img')
                
                let x = document.querySelector("div#event_summary tbody tr");
                let realDate = x.children[1].firstChild.firstChild.children[1].firstChild.firstChild.innerText
                
                let z = document.querySelector('div[data-testid="event_permalink_feature_line"]');
                let hostedBy = z.firstElementChild.innerText;

                return {
                    details: details.innerText,
                    image: image.src,
                    realDate,
                    hostedBy
                }
            });

            if (
                events[i]["details"] != data.details ||
                events[i]["image"] != data.image || 
                events[i]["realDate"] != data.realDate || 
                events[i]["hostedBy"] != data.hostedBy
            ) {
                events[i].save();
            }
        } catch (err) { 
            console.log(err);
        }
    }
    browser.close();
}   

module.exports = run;