'use client';

import { useState, useEffect } from 'react';
import supabase from './utils/supabase/client.js';

export default function Chat({ initialMessages }) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      // Check for user session on component mount
      const session = supabase.auth.getSession();
      setUser(session?.user ?? null);
  
      // Set up listener for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
      });
  
      // Clean up the listener on component unmount
      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);
  
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
  
      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data);
      }
    };
  
    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !user) return;
  
      const { data, error } = await supabase
        .from('messages')
        .insert([{ context: newMessage, author: user.id }]);
  
      if (error) {
        console.error('Error sending message:', error.message);
      } else {
        setNewMessage('');
        fetchMessages();
      }
    };
  return(
    <div>
        <div>
        {messages && messages.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
            <span>{new Date(message.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          className='send-message'
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );

}