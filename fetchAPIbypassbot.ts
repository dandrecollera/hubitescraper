import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

interface ScrapedData {
    src: string;
    username: string;
    nickname: string;
    postCount: string;
    mediaCount: string;
    videoCount: string;
    price: string;
    onlyfansurl: string;
}

puppeteer.use(StealthPlugin());

async function scrapeWebsite() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const baseUrl = 'https://hubite.com/en/free-onlyfans/female/?page=';
    const baseUrl2 = 'https://hubite.com/en/onlyfans-trial-links/?page=';
    const totalPages = 27;

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36');
        const allData: ScrapedData[] = [];

        for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
            const pageUrl = `${baseUrl2}${pageIndex}`;

            await page.goto(pageUrl);
            await page.waitForSelector('.modelCard-box', { timeout: 60000 });

            const content = await page.evaluate(() => {
                const elements = document.querySelectorAll('.modelCard-box');
                const data: ScrapedData[] = [];

                elements.forEach(element => {
                    const imageElement = element.querySelector('.modelCard-image img');
                    const src = imageElement?.getAttribute('src') || '';
                    const usernameElement = element.querySelector('.modelCard-info_username');
                    const username = usernameElement?.textContent?.trim() || '';
                    const nicknameElement = element.querySelector('.modelCard-info_nickname');
                    const nickname = nicknameElement?.textContent?.trim() || '';
                    const postCountElement = element.querySelector('.media-item:nth-child(1) span');
                    const postCount = postCountElement?.textContent?.trim() || '';
                    const mediaCountElement = element.querySelector('.media-item:nth-child(2) span');
                    const mediaCount = mediaCountElement?.textContent?.trim() || '';
                    const videoCountElement = element.querySelector('.media-item:nth-child(3) span');
                    const videoCount = videoCountElement?.textContent?.trim() || '';
                    const priceElement = element.querySelector('.modelCard-info_price');
                    const price = priceElement?.textContent?.trim() || '';

                    let onlyfansurl = '';
                    if (username.startsWith('@')) {
                        const lowercaseUsername = username.substring(1).toLowerCase();
                        onlyfansurl = `https://onlyfans.com/${lowercaseUsername}`;
                    } else {
                        onlyfansurl = `https://onlyfans.com/${username.toLowerCase()}`;
                    }

                    if (src) {
                        data.push({
                            src,
                            username,
                            nickname,
                            postCount,
                            mediaCount,
                            videoCount,
                            price,
                            onlyfansurl,
                        });
                    }
                });
                return data;
            });

            allData.push(...content);
        }

        fs.writeFileSync('scraped_data2.json', JSON.stringify(allData, null, 2));
        console.log('Scraping completed.');
    } catch (error) {
        console.error('Error while scraping:', error);
    } finally {
        await browser.close();
    }
}

scrapeWebsite();
