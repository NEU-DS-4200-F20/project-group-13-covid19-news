const csv = require('csv-parser');
const fs = require('fs');

let domainUsage = {};

fs.createReadStream('covid19_articles.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (!domainUsage[row.domain]) { // first time seeing article from domain
        domainUsage[row.domain] = {};
    }

    let cleanedString = row.content.replace(/[,.':“”"0-9\-]/g, '')
    let uniqueWords = new Set(cleanedString.split(/\s/g));
    let toLowercaseWords = [];

    uniqueWords.forEach((word) => {
        word = word.toLowerCase();
        toLowercaseWords.push(word);
    })

    toLowercaseWords = new Set(toLowercaseWords)

    toLowercaseWords.forEach((word) => {
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
        ] // did not include people, work, case, government, company, number, group, problem from wikipedia
        if (!domainUsage[row.domain][word]) { // first time seeing word
            if (mostCommonWords.includes(word)) {
                domainUsage[row.domain][word] = 1
            }
        } else {
            domainUsage[row.domain][word]++;
        }
    })
  })
  .on('end', () => {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
    path: 'out_allLower.csv',
    header: [
        {id: 'domain', title: 'Domain'},
        {id: 'word', title: 'Word'},
        {id: 'count', title: 'Count'},
    ]
    });

    let objectKeys = Object.keys(domainUsage);
    const data = [];

    for (let i = 0; i < objectKeys.length; i++) {
        const domainObject = domainUsage[objectKeys[i]];
        for (const property in domainObject) {
            const row = {
                'domain': objectKeys[i],
                'word': property,
                'count': domainObject[property]
            }
            data.push(row)
        }
    }

    csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully to out.csv'));
  });