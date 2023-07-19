const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())

const OPENAI_API_KEY = process.env.API_KEY

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CreativeIsaiah.',
    })
        });

app.post('/', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${'OPENAI_API_KEY'}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: req.body.messages,
            max_tokens: 1500,
        }, null, 2).trim()
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        if (!response.ok) {
            res.status(response.status).send(data);
        } else {
            res.send(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
})

app.listen(PORT, () => console.log('Your server is running on PORT' + PORT));
