'use client';
import { useState, useEffect } from 'react';
import supabase from './utils/supabase/client.js';

export default async function Message() {
    if (req.method === 'GET') {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });
    
        if (error) {
          return res.status(500).json({ error: error.message });
        }
    
        return res.status(200).json(data);
      }
    
      if (req.method === 'POST') {
        const { context, author } = req.body;
    
        const { data, error } = await supabase
          .from('messages')
          .insert([{ context, author }]);
    
        if (error) {
          return res.status(500).json({ error: error.message });
        }
    
        return res.status(201).json(data);
      }
    }