/* The scraping logic of a single events */

const run = async (page) => {    
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
    return data;
}

module.exports = run;