import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    if (req.method === 'POST') {
      const { userPrompt } = req.body;
      
      // Verify API key
      const API_KEY = process.env.TOGETHER_API_KEY;
      if (!API_KEY) {
        throw new Error('API key is not configured');
      }

      // Log the request configuration
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

      // Try the API request in a separate try-catch
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.together.xyz/v1/chat/completions',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          data: payload,
          timeout: 30000 // 30 second timeout
        });

        return res.status(200).json(response.data);
      } catch (apiError) {
        // Specific error handling for API calls
        return res.status(500).json({
          error: 'API request failed',
          details: {
            message: apiError.message,
            status: apiError.response?.status,
            data: apiError.response?.data,
            code: apiError.code
          }
        });
      }
    }

    // Handle GET requests
    if (req.method === 'GET') {
      return res.status(200).json({ 
        message: 'Chat endpoint is working. Please use POST method.',
        env: {
          hasApiKey: !!process.env.TOGETHER_API_KEY
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    // General error handling
    return res.status(500).json({
      error: 'Server error',
      type: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
