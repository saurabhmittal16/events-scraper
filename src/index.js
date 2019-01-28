const fs = require('fs')
const scrape = require('./facebook');
const single = require('./singleEvent');

scrape().then(
    data => {
        fs.writeFile('result.json', JSON.stringify(data, null, 4), (err) => {
            if (err)
                console.log('Error writing file')
            else
                console.log("Saved result.json")
        })
    }
).then(
    single().then(
        res => {
            fs.writeFile('result.json', JSON.stringify(res, null, 4), (err) => {
                if (err)
                    console.log('Error writing file')
                else
                    console.log("Updated result.json")
            })
        }
    ).catch(
        err => console.log(err)
    )
)
.catch(
    err => console.log(err)
);