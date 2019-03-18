/* Scrapes the event list of all pages provided to the scraper */

const puppeteer = require('puppeteer');

const pages = Object.keys(require('../../pages'));

const getEventURL = (pageID) => `https://facebook.com/pg/${pageID}/events`;

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 926 },
        args: ['--lang=en-US,en']
    });
    const page = await browser.newPage();

    const res = {};
    for(let j=0; j<pages.length; j++) {
        await page.goto(getEventURL(pages[j]));
        await page.waitForSelector('div#past_events_card');
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitFor(5000);
    
        const data = await page.evaluate(() => {
            const es = [];
            let events = document.querySelector('div#past_events_card').childNodes[0];
           
            if (!!events) {
                events = events.childNodes;
                for(let i=1; i<events.length; i++) {
                    try {
                        let event = events[i].firstElementChild.firstElementChild.firstElementChild;
                        let date = event.childNodes[0].firstElementChild;
                        // let finalDate = date.childNodes[1].innerText + " " + date.childNodes[0].innerText;
                
                        let details = event.childNodes[1].firstElementChild;
                        let title = details.childNodes[0].firstElementChild;
                        let link = title.href; 
                        let name = title.firstElementChild.innerText;
                        // let realDate = details.childNodes[1].childNodes[0].innerText;
                        let guests = details.childNodes[1].childNodes[2].textContent;
                
                        let loc = event.childNodes[2].firstElementChild;
                        let exact = loc.childNodes[0].firstElementChild.innerText;
                        let city = loc.childNodes[1].innerText;
                        let eventID = link.slice(32, 47);
            
                        es.push({
                            name,
                            location: exact,
                            city,
                            eventID,
                            link: link.slice(0, 48)
                        })
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
            return es;
        });
        res[pages[j]] = data;
    }

    browser.close();
    return res;
}

module.exports = run;