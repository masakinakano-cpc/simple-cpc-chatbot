// pages/index.tsx
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'エラーが発生しました';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: 'エラーが発生しました' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🗨️ CPC チャットポッド</h1>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 400, overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{msg.role === 'user' ? 'あなた' : 'チャットボット'}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && <div>チャットボットが考え中...</div>}
      </div>
      <div style={{ display: 'flex', marginTop: 10 }}>
        <input
          style={{ flex: 1, padding: 8 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力..."
        />
        <button onClick={sendMessage} style={{ padding: 8 }}>
          送信
        </button>
      </div>
    </div>
  );
}
