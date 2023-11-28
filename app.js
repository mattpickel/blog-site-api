const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Successfully connected to database');
    } catch (error) {
        console.error('Error connecting to database', error);
    }
};

connectToDatabase();

const getPosts = async () => {
    try {
        const res = await client.query('SELECT * FROM posts');
        return res.rows;
    } catch (error) {
        console.error('Error getting posts from database', error);
    }
};

const getTags = async () => {
    try {
        const res = await client.query('SELECT DISTINCT UNNEST(tags) as unique_tag FROM posts');
        return res.rows;
    } catch (error) {
        console.error('Error getting tags from database', error);
    }
};

app.get('/api/posts', async (req, res) => {  
    const posts = await getPosts();
    res.send(posts);
});

app.get('/api/tags', async (req, res) => {
    const tags = await getTags();
    res.send(tags);
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});