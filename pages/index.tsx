import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setReply(data.reply || 'No response');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🧠 simple-cpc-chatbot</h1>
      <p>Hello from CPC chatbot!</p>

      <div style={{ marginTop: '2rem' }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="聞きたいことを入力..."
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button
          onClick={sendMessage}
          style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
        >
          送信
        </button>
      </div>

      {reply && (
        <div style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem' }}>
          <strong>🧠 返答：</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
