const fetch = require('node-fetch');
const Promise = require('bluebird');
fetch.Promise = Promise;
const cheerio = require('cheerio');
const scrapeIt = require('scrape-it');

const Fetch = () =>
  fetch("https://www.free-proxy-list.net/", {
    "credentials": "omit",
    "headers": {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
    },
    "method": "GET"
  })
  .then(data => data.text())
  .then(text => cheerio.load(text))
  .then($ => scrapeIt.scrapeHTML($, {
    proxies: {
      listItem: '#proxylisttable tbody tr',
      data: {
        ip: 'td:nth-child(1)',
        port: 'td:nth-child(2)',
        countryCode: 'td:nth-child(3)',
        anonymity: {
          selector: 'td:nth-child(5)',
          convert: x => x.replace(' proxy', ''),
        },
        protocol: {
          selector: 'td:nth-child(6)',
          convert: x => x === 'yes' ? 'https' : 'http',
        },
      }
    },
  }));

module.exports = Fetch;
