import Together from "together-ai";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { userPrompt } = req.body;
      
      if (!userPrompt) {
        return res.status(400).json({ error: 'userPrompt is required' });
      }

      const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

      const response = await together.chat.completions.create({
        messages: [{
          role: 'user',
          content: userPrompt
        }],
        model: "meta-llama/Llama-Vision-Free",
        max_tokens: null,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>","<|eom_id|>"],
        stream: false
      });

      // Return a clean JSON response
      return res.status(200).json({
        content: response.choices[0].message.content
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        error: 'API request failed',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
