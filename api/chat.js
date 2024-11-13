const axios = require('axios');

export default async function handler(req, res) {
  console.log('Request received:', req.method);
  
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ message: 'Chat endpoint is working. Please use POST method.' });
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { userPrompt } = req.body;
    
    if (!userPrompt) {
      res.status(400).json({ error: 'userPrompt is required' });
      return;
    }

    const payload = {
      model: "togethercomputer/llama-2-70b-chat",
      messages: [
        { role: "user", content: userPrompt }
      ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repetition_penalty: 1,
      stream: false
    };

    const API_KEY = process.env.TOGETHER_API_KEY;
    console.log('API Key exists:', !!API_KEY);
    
    if (!API_KEY) {
      throw new Error('TOGETHER_API_KEY environment variable is not set');
    }

    const response = await axios.post('https://api.together.xyz/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response Status:', response.status);

    if (!response.data) {
      throw new Error('No data received from API');
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
