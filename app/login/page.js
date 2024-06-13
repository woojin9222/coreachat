'use client';
import Link from "next/link";
import supabase from "../utils/supabase/server.js";
import { useState } from 'react';



export default function login() {

    
    const handleGoogleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: '/',
      },
    })
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
          const { error } = await supabase.auth.signInWithPassword({ 
            email,
            password, 
            });

          if (error) {
            console.error('Error signing in:', error.message);
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
          } else {
            console.log('Login successful');
            // 로그인 성공 후 리다이렉트 또는 다른 로직 추가
          }
        } catch (error) {
          console.error('Error signing in:', error.message);
          alert('로그인 중 문제가 발생했습니다.');
        }
      };

    return(
        <div className="SignUp">
            <div className="SignUpList">
                <span className="logo">고구려채팅</span>
                <form className="form" onSubmit={handleSubmit}>

                    <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일"/>

                    <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호"/>
                    <button className="button" type="submit">로그인하기</button>
                    <button className="button" onClick={handleGoogleSignIn}>
                            구글로 로그인하기
                    </button>

                </form>
                <p><Link href="/signup">아직계정이 없으신가요? 회원가입하기</Link></p>
            </div>
        </div>
    );

} 