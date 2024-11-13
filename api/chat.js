import axios from 'axios';

export default async function handler(req, res) {
  // Basic request logging
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);

  // Step 1: Basic error handling setup
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
  });

  // Step 2: CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Step 3: Method check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethod: 'POST',
      receivedMethod: req.method
    });
  }

  try {
    // Step 4: Validate input
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }

    // Step 5: Validate API key
    const API_KEY = process.env.TOGETHER_API_KEY;
    if (!API_KEY) {
      console.error('API key missing');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Step 6: Prepare request
    const payload = {
      model: 'togethercomputer/llama-2-70b-chat',
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 512
    };

    console.log('Making API request with payload:', JSON.stringify(payload));

    // Step 7: Make API request
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.together.xyz/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        data: payload,
        timeout: 10000 // 10 second timeout
      });

      // Step 8: Return response
      return res.status(200).json({
        success: true,
        data: response.data
      });

    } catch (apiError) {
      console.error('API Error:', {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data
      });

      return res.status(500).json({
        error: 'API request failed',
        details: {
          message: apiError.message,
          status: apiError.response?.status,
          data: apiError.response?.data
        }
      });
    }

  } catch (error) {
    console.error('Server Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      error: 'Server error',
      details: {
        name: error.name,
        message: error.message
      }
    });
  }
}
