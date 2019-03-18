const puppeteer = require('puppeteer');

const Event = require('../models/event');

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
            await page.waitForSelector('#event_guest_list');
            await page.waitForSelector("div#event_summary tbody tr");

            const data = await page.evaluate(() => {
                    let details = document.querySelector('div[data-testid="event-permalink-details"]');
                    let image = document.querySelector('div.uiScaledImageContainer > img')
                    
                    let x = document.querySelector("div#event_summary tbody tr");
                    let realDate = x.children[1].firstChild.firstChild.children[1].firstChild.firstChild.innerText
                    
                    let z = document.querySelector('div[data-testid="event_permalink_feature_line"]');
                    let hostedBy = z.firstElementChild.innerText;

                    let temp = document.querySelectorAll('#event_guest_list')[1];
                    temp = temp.nextSibling.firstChild.firstChild.children[1].firstChild.lastChild.children;
                    if (temp[temp.length - 1].localName === "a") {
                        temp[temp.length - 1].click();
                    }
                    temp = document.querySelectorAll('#event_guest_list')[1];
                    temp = temp.nextSibling.firstChild.firstChild.children[1].firstChild.lastChild
                    
                    let categories = [];
                    let isTech = false;

                    if (temp.localName === "ul") {
                        categories = Array.from(temp.children);
                        for(let i=0; i<categories.length; i++) {
                            categories[i] = categories[i].innerText;
                            if (categories[i] === "Technology") {
                                isTech = true;
                            }
                        }
                    }
    
                    return {
                        details: details.innerText,
                        image: image.src,
                        realDate,
                        hostedBy,
                        categories,
                        isTech
                    }
            });

            if (
                events[i]["details"] != data.details ||
                events[i]["image"] != data.image || 
                events[i]["realDate"] != data.realDate || 
                events[i]["hostedBy"] != data.hostedBy
            ) {
                events[i]["details"] = data.details;	
                events[i]["image"] = data.image;
                events[i]["realDate"] = data.realDate;
                events[i]["hostedBy"] = data.hostedBy;
                events[i]["categories"] = data.categories;
                events[i]["isTech"] = data.isTech; 
                events[i].save();
            }
        } catch (err) { 
            console.log(err);
        }
    }
    browser.close();
}   

module.exports = run;