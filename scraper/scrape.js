const url = 'http://www.pd-tutorial.com/german/';
const pages = [
  'index.html',
  'pr01.html',
  'pr02.html',
  'ch01.html',
  'ch01s02.html',
  'ch02.html',
  'ch02s02.html',
  'ch03.html',
  'ch03s02.html',
  'ch03s03.html',
  'ch03s04.html',
  'ch03s05.html',
  'ch03s06.html',
  'ch03s07.html',
  'ch03s08.html',
  'ch03s09.html',
  'ch04.html',
  'ch04s02.html',
  'ch04s03.html',
  'ch04s04.html',
  'ch05.html',
  'ch05s02.html',
  'apa.html',
  'apas02.html',
  'apas03.html',
  'apas04.html',
  'apas05.html',
  'apas06.html',
  'apas07.html',
  'apas08.html',
  'apas09.html',
  'apas10.html',
  'apas11.html',
  'apas12.html',
  'apas13.html',
  'apas14.html',
  'apas15.html'
];
const cheerio = require('cheerio');

const fs = require('fs');
const http = require('http');
const axios = require('axios');
var pdf = require('html-pdf');

function generate(html, fileName) {
  var options = {
    format: 'A3',
    orientation: 'Landscape',
    base: 'file:///Users/felix/projects/blog/scraper/html/'
  };
  pdf
    .create(html, options)
    .toFile('./pdf/' + fileName + '.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log('generated pdf ' + res.filename);
    });
}

const downloaded = [...pages];

function download(page, index) {
  console.log('scrape page', page);
  axios({
    url: url + page,
    method: 'get',
    responseEncoding: 'latin1'
  }).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const chapter = $('div[lang=de]').html();
    let urls = [];
    $('div[lang=de] img').each(function () {
      urls.push(this.attribs.src);
    });
    $('div[lang=de] a').each(function () {
      urls.push(this.attribs.href);
    });

    const downloads = urls
      .filter((url, index, a) => a.indexOf(url) === index)
      .filter(
        (url) =>
          typeof url === 'string' &&
          !url.startsWith('http://') &&
          !url.startsWith('https://') &&
          !url.startsWith('mailto:') &&
          //!url.endsWith('.pd') && // already downloaded those
          !url.includes('#') &&
          url !== 'index.html' &&
          !downloaded.includes(url)
      )
      .map((path) => {
        return new Promise((resolve, reject) => {
          downloaded.push(path);
          if (!fs.existsSync('html/' + path)) {
            const file = fs.createWriteStream('html/' + path);
            console.log('download resource', path);
            http.get(url + path, (res) => {
              //res.setEncoding('binary');
              res.pipe(file);
              file.once('close', () => {
                resolve();
              });
            });
            //file exists
          } else {
            console.log('already downloaded resource', path);
            resolve();
          }
        });
      });

    Promise.all(downloads).then(() => {
      console.log('finished downloads');
      const stream = fs.createWriteStream('html/' + page);
      stream.once('open', () => {
        stream.end(chapter);
        if (chapter) {
          generate(chapter, index + page.replace('.html', ''));
        } else {
          console.log('no html for ', page);
        }
      });
    });
  });
}

// download(pages[0]);
pages /* .slice(0, 10) */
  .forEach((page, i) => {
    setTimeout(() => download(page, i), 10000 * i);
  });
