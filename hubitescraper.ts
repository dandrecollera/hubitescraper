import puppeteer from 'puppeteer';

async function scrapeWebsite() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto('https://hubite.com/en/free-onlyfans/female/');

        await page.waitForSelector('.modelCard-box', { timeout: 60000 });

        const content = await page.evaluate(() => {
            const elements = document.querySelectorAll('.modelCard-box');
            const data: string[] = [];
            elements.forEach(element => {
                data.push(element.outerHTML);
            });
            return data;
        });

        console.log(content);
    } catch (error) {
        console.error('Error while scraping:', error);
    } finally {
        await browser.close();
    }
}

scrapeWebsite();
