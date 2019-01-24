const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    await page.goto('http://www.imdb.com/chart/top?ref_=nv_mv_250_6');

    const data = await page.evaluate(() => {
        let titles = [];
        var x = document.querySelectorAll('.titleColumn');
        x.forEach(
            elem => titles.push(elem.innerText)
        );
        return titles;
    });
    browser.close();
    return data;
}

module.exports = run;