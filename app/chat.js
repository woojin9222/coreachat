'use client'
import supabase from './utils/supabase/client';
import { useState, useEffect, useCallback } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');

  useEffect(() => {
    // 채널을 가져오는 함수
    const fetchChannels = async () => {
      const { data, error } = await supabase
        .from('channels') // 스키마를 한 번만 지정
        .select('*');

      if (error) {
        console.error('Error fetching channels:', error.message);
      } else {
        setChannels(data);
        if (data.length > 0) {
          setSelectedChannel(data[0].id); // 첫 번째 채널을 기본 선택
        }
      }
    };

    fetchChannels();

    const channels = supabase
      .channels('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prevMessages => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  const sendMessage = useCallback(async () => {
    if (!selectedChannel) {
      console.error('No channel selected');
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError.message);
      return;
    }

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ content: newMessage, author: user.id, channel: selectedChannel, created_at: new Date() }]);

    if (error) {
      console.error('Error sending message:', error.message);
    } else {
      setNewMessage('');
    }
  }, [newMessage, selectedChannel]);

  return (
    <div>
      <select value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)}>
        {channels.map(channels => (
          <option key={channels.id} value={channels.id}>
            {channels.name} ({channels.type})
          </option>
        ))}
      </select>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        placeholder="Type your message here..."
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default Chat;
