const csv = require('csv-parser');
const fs = require('fs');

let monthlyUsage = {};
let monthCount = {};

fs.createReadStream('covid19_articles.csv')
  .pipe(csv())
  .on('data', (row) => {
    let month = new Date(row.date).getMonth() + 1;
      
    if (!monthlyUsage[month]) { // first time seeing that month
        monthlyUsage[month] = {};
        monthCount[month] = 0;
    } else {
        monthCount[month]++;
    }

    let cleanedString = row.content.replace(/[,.':“”"0-9\-]/g, '')
    let uniqueWords = new Set(cleanedString.split(/\s/g));
    let toLowercaseWords = [];

    uniqueWords.forEach((word) => {
        word = word.toLowerCase();
        toLowercaseWords.push(word);
    })

    toLowercaseWords = new Set(toLowercaseWords);

    toLowercaseWords.forEach((word) => {
        // list of words to ignore
        const mostCommonWords = [
            'coronavirus',
            'we',
            'people',
            'time',
            'covid',
            'virus',
            'pandemic',
            'outbreak',
            'week',
            'health',
            'spread',
            'march',
            'government',
            'home',
            'cases',
            'help',
            'day',
            'work',
            'crisis',
            'issues',
            'number',
            'world',
            'president',
            'country',
            'public',
            'global',
            'historic',
            'newspaper',
            'download',
            'measures',
            'million',
            'china',
            'support',
            'working',
            'us',
            'social',
            'impact',
            'health',
            'confirmed',
            'reported',
            'countries',
            'economic',
            'company',
            'market',
            'uk',
            'risk',
            'business',
            'news',
            'financial',
            'economy',
            'response',
            'medical',
            'disease',
            'companies',
            'workers',
            'lockdown',
            'situation',
            'travel',
            'emergency',
            'deaths',
            'positive',
            'infected',
            'information',
            'businesses',
            'face',
            'past',
            'local',
            'trump',
            'death',
            'future',
            'billion',
            'case',
            'markets',
            'increase',
            'patients',
            'tested',
            'symptoms',
            'plan',
            'cut',
            'national',
            'restrictions',
            'life',
            'family',
            'result',
            'testing',
            'media',
            'online',
            'supply',
            'italy',
            'warned',
            'distancing',
            'members',
            'donald',
            'hospital',
            'change',
            'authorities',
            'europe',
            'money',
            'difficult',
            'chinese',
            'national',
            'died',
            'official',
            'concerns',
            'european',
            'american',
            'wuhan',
        ];

        if (!monthlyUsage[month][word]) { // first time seeing word
            if (mostCommonWords.includes(word)) {
                monthlyUsage[month][word] = 1;
            }
        } else {
            monthlyUsage[month][word]++;
        }
    })
  })
  .on('end', () => {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
    path: 'TestDate.csv',
    header: [
        {id: 'month', title: 'Month'},
        {id: 'word', title: 'Word'},
        {id: 'count', title: 'Count'},
        {id: 'percent', title: 'Percent'},
    ]
    });

    let objectKeys = Object.keys(monthlyUsage);
    const data = [];

    for (let i = 0; i < objectKeys.length; i++) {
        const monthlyObject = monthlyUsage[objectKeys[i]];
        for (const property in monthlyObject) {
            let count = monthlyObject[property];
            const row = {
                'month': objectKeys[i],
                'word': property,
                'count': monthlyObject[property],
                'percent': (count / monthCount[objectKeys[i]]) * 100
            };
            data.push(row);
        }
    }
    csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully to out_byDate.csv'));
  });