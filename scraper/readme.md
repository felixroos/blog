here I scraped a german pure data tutorial: http://www.pd-tutorial.com/german/

I did this to convert the website to a pdf.

- takes list of html files
- parses content and searches for links and images
- downloads all images and linked files (if not downloaded yet)
- generates pdf for each html file in list
- took inspiration from https://pusher.com/tutorials/web-scraper-node
- the file is now in iCloud/Dill/Documents/eBooks/puredata-loadbang.pdf

TBD: write google..

- start with single file, scrape all links and continue till everything is scraped
- exclude external links
- use puppeteer for js sites..
