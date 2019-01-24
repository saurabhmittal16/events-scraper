const puppeteer = require('puppeteer');

const pages = [
    'iosdofficial',
    'Led-zepplin-458226214198430'
];

const getEventURL = (pageID) => `https://facebook.com/pg/${pageID}/events`;

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 926 }
    });
    const page = await browser.newPage();

    const res = {};
    for(let j=0; j<pages.length; j++) {
        await page.goto(getEventURL(pages[j]));
        await page.waitFor(5000);
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitFor(5000);
    
        const data = await page.evaluate(() => {
            const es = [];
            const events = document.querySelector('div#past_events_card').childNodes[0].childNodes;
            
            for(let i=1; i<events.length; i++) {
                try {
                    let event = events[i].firstElementChild.firstElementChild.firstElementChild;
                    let date = event.childNodes[0].firstElementChild;
                    let finalDate = date.childNodes[1].innerText + " " + date.childNodes[0].innerText;
            
                    let details = event.childNodes[1].firstElementChild;
                    let name = details.childNodes[0].firstElementChild.firstElementChild.innerText;
                    let realDate = details.childNodes[1].childNodes[0].innerText;
                    let guests = details.childNodes[1].childNodes[2].textContent;
            
                    let loc = event.childNodes[2].firstElementChild;
                    let exact = loc.childNodes[0].firstElementChild.innerText;
                    let city = loc.childNodes[1].innerText;
        
                    es.push({
                        name,
                        date: realDate,
                        location: exact,
                        city,
                        guests
                    })
                } catch (err) {
                    console.log(err);
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