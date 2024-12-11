import express from 'express';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: ''
});
const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.static('public'));
app.use(express.json()); 

app.get('/fetchContent', async (req, res) => {
    const targetURL = req.query.url;
    if (!targetURL) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        const response = await fetch(targetURL);
        const body = await response.text();
        res.send(body);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).send('Failed to fetch the content.');
    }
});
app.use(express.json());
app.post('/testGPT', async (req, res) => {
    const userInput = req.body.content;

    if (!userInput) {
        return res.status(400).send('Content is required.');
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: userInput }],
            model: 'gpt-4o-2024-08-06',
        });

        console.log("GPT-3 Response:", completion.choices);
        res.send(completion.choices);
    } catch (error) {
        console.error("Error calling GPT-3:", error);
        res.status(500).send('Failed to get response from GPT-3.');
    }
});


app.use((req, res, next) => {
    if (req.path.indexOf('.') === -1) {
        var file = req.path + '.html';
        res.sendFile(file, { root: './public' });
    } else {
        next();
    }
});

app.listen(PORT, async err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server listening on port: ${PORT} | CNTL-C to Quit`);
        console.log('http:
    }
});
