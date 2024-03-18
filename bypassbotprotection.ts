import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

async function scrapeWebsite() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36');

        await page.goto('https://hubite.com/en/free-onlyfans/female/');

        const htmlContent = await page.content();

        fs.writeFileSync('test2.html', htmlContent);


        console.log(htmlContent);
    } catch (error) {
        console.error('Error while scraping:', error);
    } finally {
        await browser.close();
    }
}

scrapeWebsite();
