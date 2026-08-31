const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_TOKEN = '9f3c7a1d6e4b8c2f0a5d9e7b3c1f6a8e2d4b7c9f1a3e5d8b0c6f2a9e4d7b1c5';
const API_URL = 'https://api.request-management.octor.health/api/v1/submissions';

app.post('/api/submit-form', async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-API-TOKEN': API_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});