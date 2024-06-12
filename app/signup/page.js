'use client';

import {useEffect}  from 'react';
import Link from "next/link"
import supabase from "../utils/supabase/server.js";


export default function SignUp() {

    const handleGoogleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google', // Specify the provider
          options: {
            redirectTo: 'https://jmidonpzzzgcmpzhwipg.supabase.co/auth/v1/callback',
          },
        });
    
        if (error) {
          console.error('Error signing in with Google:', error);
        } else {
          if (data.url) {
            window.location.href = data.url; // Redirect to the URL provided by Supabase
          }
        }
      };
      
    return(
        <div className="SignUp">
            <div className="SignUpList">
                <span className="logo">고구려채팅</span>
                <form className="form">
                    <input className="input" type="text" placeholder="당신의 닉네임"/>

                    <input className="input" type="email" placeholder="이메일"/>

                    <input className="input" type="password" placeholder="비밀번호"/>

                    <input style={{display:"none"}} type="file" id="file"/>
                    <label style={{ fontSize: "12px",  color: "black", cursor: "pointer"}} htmlFor="file">당신의 프로필사진</label>
                    <button className="button">가입하기</button>
                    <button className="button" onClick={handleGoogleSignIn}>
                            구글로 로그인하기
                    </button>
                </form>
                <p><Link href="/login">이미 계정이 있으신가요? 로그인하기</Link></p>
            </div>
        </div>
    );
}