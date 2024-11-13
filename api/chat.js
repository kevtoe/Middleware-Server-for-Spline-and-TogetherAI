const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { userPrompt } = req.body;

  const payload = {
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    messages: [
      { role: "user", content: userPrompt }
    ],
    max_tokens: 50,
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    repetition_penalty: 1,
    stop: ["<|eot_id|>", "<|eom_id|>"],
    stream: false
  };

  try {
    const response = await axios.post('https://api.together.xyz/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer 64654facb7d3ef9b803ad5ae77a82472eef08af474e15390283c20211b1fd474`,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
