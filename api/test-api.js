const axios = require('axios');

const API_KEY = '64654facb7d3ef9b803ad5ae77a82472eef08af474e15390283c20211b1fd474';

async function testAPI() {
  try {
    const response = await axios.post('https://api.together.xyz/v1/chat/completions', 
      {
        model: 'togethercomputer/llama-2-70b-chat',
        messages: [
          {
            role: 'user',
            content: 'What is 2+2?'
          }
        ],
        temperature: 0.7,
        max_tokens: 512
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testAPI();