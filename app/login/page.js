'use client';
import Link from "next/link";
import supabase from "../utils/supabase/client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      alert('구글 로그인 중 문제가 발생했습니다.');
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      router.push('/');
    } catch (error) {
      console.error('Error signing in:', error.message);
      alert('로그인 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const { data: session, error } = await supabase.auth.refreshSession();
        if (error) {
          throw error;
        }
        console.log('Session refreshed:', session);
      } catch (error) {
        console.error('Error refreshing session:', error.message);
      }
    };

    refreshSession();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (user) {
          console.log('Current logged-in user:', user);
        } else {
          console.log('No user is currently logged in');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    checkUser();
  }, []);

  
  

  
  return (
    <div className="SignUp">
      <div className="SignUpList">
        <span className="logo">고구려채팅</span>
        <form className="form" onSubmit={handleSubmit}>
          <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일" />
          <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호" />
          <button className="button" type="submit">로그인하기</button>
          <button className="button" onClick={handleGoogleSignIn}>구글로 로그인하기</button>
        </form>
        <p><Link href="/signup">아직 계정이 없으신가요? 회원가입하기</Link></p>
      </div>
    </div>
  );
}
