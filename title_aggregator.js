const puppeteer = require('puppeteer');
const http = require('http');

async function scrapeHeadersWithDate(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const headerData = await page.evaluate(() => {
            const headersWithDate = [];

            // Find all header elements
            const headerNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headerNodes.forEach(node => {
                // For each header element, find the nearest ancestor containing the date and time
                const dateElement = node.closest('[datetime]');
                const headerText = node.textContent.trim();
                const datePublished = dateElement ? dateElement.getAttribute('datetime') : 'Date not found'; // Extract datetime attribute value as date published
                const headerLink = node.closest('a') ? node.closest('a').href : ''; // Extract the href attribute of the header's parent anchor element
                headersWithDate.push({ headerText, datePublished, headerLink });
            });

            return headersWithDate;
        });

        browser.close();

        return headerData;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}

http.createServer(async function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    const headerData = await scrapeHeadersWithDate('https://www.theverge.com/');

    res.write('<html><head><title>Title Aggregator</title></head><body>');
    res.write('<h1>Title Aggregator</h1><ul>');
    headerData.forEach(header => {
        const completeUrl = new URL(header.headerLink, 'https://www.theverge.com'); // Ensure the URL is complete
        res.write(`<li><a href="${completeUrl}">${header.headerText}</a> - ${header.datePublished}</li>`); // Include the complete URL within the anchor tag
    });
    res.write('</ul>');
    res.write('</body></html>');
    res.end();
}).listen(8080);

console.log('Server running at http://localhost:8080/');
