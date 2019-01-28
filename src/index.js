const fs = require('fs')
const scrape = require('./facebook');
const single = require('./singleEvent');

const init = async () => {
    const data = await scrape();
    fs.writeFileSync('result.json', JSON.stringify(data, null, 4), (err) => {
        if (err)
            console.log('Error writing file')
        else
            console.log("Saved result.json")
    });
    const updatedData = await single();
    fs.writeFileSync('result.json', JSON.stringify(updatedData, null, 4), (err) => {
        if (err)
            console.log('Error writing file')
        else
            console.log("Updated result.json")
    });
}

init();