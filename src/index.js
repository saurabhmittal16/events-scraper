const fs = require('fs')
const scrape = require('./facebook');

scrape().then(
    data => {
        fs.writeFile('result.json', JSON.stringify(data, null, 4), (err) => {
            if (err)
                console.log('Error writing file')
            else
                console.log("saved result.json")
        })
    }
).catch(
    err => console.log(err)
);