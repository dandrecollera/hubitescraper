import mysql from 'mysql';
import fs from 'fs';
import { config } from 'dotenv';

config();

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

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: 'utf8mb4',
});

function createHubiteTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS hubite (
            id INT AUTO_INCREMENT PRIMARY KEY,
            src TEXT,
            username TEXT,
            nickname TEXT,
            postCount TEXT,
            mediaCount TEXT,
            videoCount TEXT,
            price TEXT,
            onlyfansurl TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `;

    connection.query(createTableQuery, (error, results) => {
        if (error) {
            console.error('Error creating table:', error);
        } else {
            console.log('Table created successfully or already exists.');
        }
    });
}

async function insertDataToHubite(data: ScrapedData[]) {
    const insertQuery = 'INSERT INTO hubite (src, username, nickname, postCount, mediaCount, videoCount, price, onlyfansurl) VALUES ?';
    const values = data.map(({ src, username, nickname, postCount, mediaCount, videoCount, price, onlyfansurl }) =>
        [src, username, nickname, postCount, mediaCount, videoCount, price, onlyfansurl]
    );

    connection.query(insertQuery, [values], (error, results) => {
        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully.');
        }
    });
}

// Check if the hubite table exists, create if not
createHubiteTable();

// Load data from the JSON file
const rawData = fs.readFileSync('scraped_data2.json');
const scrapedData: ScrapedData[] = JSON.parse(rawData.toString());

// Insert data into the hubite table
insertDataToHubite(scrapedData);

// Close the connection when done
connection.end();
