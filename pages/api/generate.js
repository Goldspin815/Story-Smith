export default async function handler(req, res) {
  const { plot, pages, genre, pace } = req.body;

  const prompt = `You are a bestselling author. Write a ${genre} novel based on this plot:
"${plot}"
Make it ${pages} pages long. Keep the pace ${pace}. Include dialogue, deep emotion, action, and character growth. Output only the story.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  res.status(200).json({ text: data.content?.[0]?.text || 'No response from Claude' });
}
