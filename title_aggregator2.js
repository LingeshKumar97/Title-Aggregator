const fs = require('fs');
const { RequestQueue, CheerioCrawler, Dataset }  = require('crawlee');

const scrapWebsite = async () => {
    const requestQueue = await RequestQueue.open();

    // Add requests for multiple pages
    for (let x = 1; x < 349; x++) {
        await requestQueue.addRequest({ url: `https://sea.mashable.com/?page=${x}&ist=broll` });
        console.log("page", x);
    }

    const pageData = [];

    const crawler = new CheerioCrawler({
        requestQueue,
        async requestHandler({ $, request }) {
            const page1 = [];
            $('.blogroll').each((index, element) => {
                const caption = $(element).find('.caption').text().trim();
                const time = $(element).find('.datepublished').text().trim();
                const hyperlink = $(element).find('a').attr('href'); // Find <a> tag and get the href attribute
                if (new Date(time) >= new Date('2021-12-31')) {
                    page1.push({ title: caption, date: time, hyperlink: hyperlink });
                }
            });
            pageData.push(...page1);
        }
    });

    await crawler.run();
    pageData.sort((a, b) => new Date(b.date) - new Date(a.date));
    return pageData;
}

const generateHTML = (pageData) => {
    let htmlContent = '<!DOCTYPE html><html><head><title>Scraped Data</title><style> .item { margin-bottom: 20px; } </style></head><body>';

    pageData.forEach(item => {
        // Encode the URL to ensure it's correctly formatted for HTML
        const encodedUrl = encodeURI(item.hyperlink);
        htmlContent += `<div class="item"><h2><a href="${encodedUrl}">${item.title}</a></h2><p>Date: ${item.date}</p></div>`;
    });

    htmlContent += '</body></html>';
    return htmlContent;
}

const saveHTMLToFile = (htmlContent) => {
    fs.writeFile('scraped_data.html', htmlContent, (err) => {
        if (err) throw err;
        console.log('HTML file has been saved.');
    });
}

const startScrapingAndGenerateHTML = async () => {
    try {
        const scrapedData = await scrapWebsite();
        const htmlContent = generateHTML(scrapedData);
        saveHTMLToFile(htmlContent);
    } catch (error) {
        console.error('Error:', error);
    }
}

startScrapingAndGenerateHTML();
