import axios from 'axios';

export default async function handler(req, res) {
  console.log('Request received:', req.method);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    if (req.method === 'POST') {
      const { userPrompt } = req.body;
      console.log('Processing prompt:', userPrompt);

      const API_KEY = process.env.TOGETHER_API_KEY;
      const payload = {
        model: 'togethercomputer/llama-2-70b-chat',
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 512
      };

      console.log('Making API request to Together AI');
      const response = await axios.post('https://api.together.xyz/v1/chat/completions', 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API response received');
      return res.status(200).json(response.data);
    }

    // For GET requests
    if (req.method === 'GET') {
      return res.status(200).json({ 
        message: 'Chat endpoint is working. Please use POST method.'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return res.status(500).json({
      error: 'API request failed',
      details: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      }
    });
  }
}
