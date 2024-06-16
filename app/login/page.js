'use client';
import Link from "next/link";
import supabase from "../utils/supabase/server.js";
import { useState } from 'react';
import { useRouter } from 'next/navigation';



export default function login() {
  const router = useRouter(); // useRouter 훅을 사용합니다.
  const handleGoogleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const { error, session } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: '/',
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      alert('구글 로그인 중 문제가 발생했습니다.');
    } else {
      // 세션 정보를 로컬 스토리지에 저장
      localStorage.setItem('supabaseSession', JSON.stringify(session));
      router.push('/');
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
    e.preventDefault(); // Prevent default form submission
    const { email, password } = formData;

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error; 
      // 에러가 있다면 예외를 발생시킵니다.
      if (session) {
        // 세션 정보를 로컬 스토리지에 저장
        localStorage.setItem('supabaseSession', JSON.stringify(session));
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      alert('로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="SignUp">
      <div className="SignUpList">
        <span className="logo">고구려채팅</span>
        <form className="form" onSubmit={handleSubmit}>

          <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일" />

          <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호" />
          <button className="button" type="submit">로그인하기</button>
          <button className="button" onClick={handleGoogleSignIn}>
            구글로 로그인하기
          </button>

        </form>
        <p><Link href="/signup">아직 계정이 없으신가요? 회원가입하기</Link></p>
      </div>
    </div>
  );

} 
