export async function callAI(prompt, maxTokens = 800) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3-0324',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: 'You are a professional AI assistant. Respond in English only. Be specific, practical, and high quality. No generic advice.' },
        { role: 'user', content: prompt },
      ],
    }),
  })
  const data = await res.json()
  return data.choices[0].message.content
}
