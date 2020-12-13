const csv = require('csv-parser');
const fs = require('fs');

let monthlyUsage = {};

fs.createReadStream('test.csv')
  .pipe(csv())
  .on('data', (row) => {
      let month = new Date(row.date).getMonth() + 1      
    if (!monthlyUsage[month]) { // first time seeing that month
        monthlyUsage[month] = 0;
    } 

    monthlyUsage[month]++
  })
  .on('end', () => {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
    path: 'percent.csv',
    header: [
        {id: 'week', title: 'Week'},
        {id: 'count', title: 'Count'},
    ]
    });

    let objectKeys = Object.keys(monthlyUsage);
    const data = [];

    for (let i = 0; i < objectKeys.length; i++) {
        const monthlyObject = monthlyUsage[objectKeys[i]];
        for (const property in monthlyObject) {
            const row = {
                'month': objectKeys[i],
                'word': property,
                'count': monthlyObject[property]
            }
            data.push(row)
        }
    }

    csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully to outByPercent.csv'));
  });