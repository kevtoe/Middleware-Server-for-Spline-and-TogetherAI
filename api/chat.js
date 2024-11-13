export default async function handler(req, res) {
  console.log('1. Request received:', req.method);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // For GET requests, return a simple message
    if (req.method === 'GET') {
      console.log('2. GET request detected');
      return res.status(200).json({ 
        message: 'Chat endpoint is working. Please use POST method.',
        env: {
          hasApiKey: !!process.env.TOGETHER_API_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    // For POST requests
    if (req.method === 'POST') {
      console.log('3. POST request detected');
      const { userPrompt } = req.body;
      
      return res.status(200).json({ 
        message: 'POST received',
        promptReceived: userPrompt,
        env: {
          hasApiKey: !!process.env.TOGETHER_API_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    // If neither GET nor POST
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return res.status(500).json({
      error: 'Server error',
      details: {
        message: error.message,
        type: error.name,
        env: {
          hasApiKey: !!process.env.TOGETHER_API_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      }
    });
  }
}
