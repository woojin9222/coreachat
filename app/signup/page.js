'use client';

import {useEffect, useState}  from 'react';
import Link from "next/link"
import supabase from "../utils/supabase/server.js";


export default function SignUp() {

    const handleGoogleSignIn = async (e) => {
            e.preventDefault(); // Prevent default form submission
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://coreachat.vercel.app/',
          },
        })


      };

      const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        file: null,
      });

      const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
          ...formData,
          [name]: files ? files[0] : value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const { displayName, email, password, file } = formData;
    
        try {
          const { error } = await supabase.auth.signUp({
            email: email ,
            password: password,
            options: {
              emailRedirectTo: 'https://coreachat.vercel.app/',
              data: {
                displayName: displayName,
              },
            },
          });
    
          if (error) {
            if (error.message.includes('Email rate limit exceeded')) {
              console.error('Too many sign-up attempts. Please try again later.');
            } else {
              throw error;
            }
          } else {
            console.log('User signed up successfully');
          }
        } catch (error) { 
          console.error('Error signing up:', error.message);
        }
      };
      
    return(
        <div className="SignUp">
            <div className="SignUpList">
                <span className="logo">고구려채팅</span>
                <form className="form" onSubmit={handleSubmit}>
                    <input className="input" type="text" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="당신의 닉네임"/>

                    <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일"/>

                    <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호"/>

                    <input style={{display:"none"}} type="file" name="file" onChange={handleChange} id="file"/>
                    <label style={{ fontSize: "12px",  color: "black", cursor: "pointer"}} htmlFor="file">당신의 프로필사진</label>
                    <button className="button" type='submit'>가입하기</button>
                    <button className="button" onClick={handleGoogleSignIn}>
                            구글로 로그인하기
                    </button>
                </form>
                <p><Link href="/login">이미 계정이 있으신가요? 로그인하기</Link></p>
            </div>
        </div>
    );
}