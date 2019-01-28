const puppeteer = require('puppeteer');
const result = require('../result.json');

const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 926 },
        args: ['--lang=en-US,en']
    });
    const page = await browser.newPage();

    const keys = Object.keys(result);

    for(let i=0; i<keys.length; i++) {
        let events = result[keys[i]];
        for(let j=0; j<events.length; j++) {
            try {
                await page.goto(events[j].link);
                await page.waitForSelector('div[data-testid="event-permalink-details"]');
    
                const data = await page.evaluate(() => {
                    let details = document.querySelector('div[data-testid="event-permalink-details"]');
                    return details.innerText;
                })
                events[j]["details"] = data;
            } catch (err) {
                console.log(err);
            }
        }
    }
    browser.close();
    return result;
}   

module.exports = run;