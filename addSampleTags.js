const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const { v4: uuidv4 } = require('uuid');



const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const insertBlogPosts = async (blogData) => {
    for (const post of blogData) {
        const { title, date, description, content, imgurl, tags, slug } = post;
        const postid = uuidv4();

        const insertQuery =  `
            INSERT INTO posts (postid, title, date, description, content, imgurl, tags, slug)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        try {
            await client.query(insertQuery, [postid, title, date, description, content, imgurl, tags, slug]);
            console.log('Successfully inserted blog post into database');
        } catch (error) {
            console.error('Error inserting blog post into database', error);
        }
    }
};

const main = async () => {
    try {
        await client.connect();
        console.log('Successfully connected to database');

        await insertBlogPosts(blogData);

        client.query('SELECT * FROM posts', (err, res) => {
            if (err) {
                console.error(err);
            } else {
                console.log('First 10 posts:', res.rows.slice(0, 10));
            }
            client.end();
        });
    } catch (error) {
        console.error('Error connecting to database', error);
    }
};

main();