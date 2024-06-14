'use client';
import { useState, useEffect } from 'react';
import supabase from './utils/supabase/client.js';


export default function Home() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .from('messages')
      .on('*', payload => {
        fetchMessages();
      })
      .subscribe();
    return () => supabase.removeSubscription(subscription);
  }, []);

  async function fetchMessages() {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages(data);
  }

  async function sendMessage() {
    await supabase.from('messages').insert([{ content: message }]);
    setMessage('');
  }
  return (
    <div>
      <div className="container">
        <div className="list">sidebar</div>
        <div className="chat">chat</div>
        <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.content}</li>
        ))}
      </ul>
    </div>
      </div>
    </div>
  );
}
