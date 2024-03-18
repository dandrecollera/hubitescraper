import fs from 'fs';
import puppeteer from 'puppeteer';

async function scrapeWebsite() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto('https://hubite.com/en/free-onlyfans/female/');

        const htmlContent = await page.content();

        fs.writeFileSync('test.html', htmlContent);

        console.log('HTML content saved to test.html');
    } catch (error) {
        console.error('Error while scraping:', error);
    } finally {
        await browser.close();
    }
}

scrapeWebsite();
