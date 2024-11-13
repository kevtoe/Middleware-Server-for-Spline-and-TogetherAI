const Together = require("together-ai");

const API_KEY = '64654facb7d3ef9b803ad5ae77a82472eef08af474e15390283c20211b1fd474';

async function testAPI() {
  try {
    const together = new Together({ apiKey: API_KEY });

    const response = await together.chat.completions.create({
      messages: [{
        role: 'user',
        content: 'What is 2+2?'
      }],
      model: "meta-llama/Llama-Vision-Free",
      max_tokens: null,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>","<|eom_id|>"],
      stream: true
    });

    for await (const token of response) {
      console.log(token.choices[0]?.delta?.content);
    }
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testAPI();