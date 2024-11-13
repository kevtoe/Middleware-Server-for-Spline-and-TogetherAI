import Together from "together-ai";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      stream: true
    });

    // Handle streaming response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    for await (const token of response) {
      const content = token.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.end();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'API request failed',
      details: error.message
    });
  }
}
