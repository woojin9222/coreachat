'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace('#', ''));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        // 세션을 수동으로 설정
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error.message);
          alert('세션 설정 중 문제가 발생했습니다.');
          router.push('/login');
        } else {
          router.push('/');
        }
      } else {
        console.error('Error handling auth callback: Missing tokens');
        alert('인증 처리 중 문제가 발생했습니다.');
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return <div>Loading...</div>;
}