// Supabase 클라이언트 라이브러리 임포트
import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // 여기에 Supabase 프로젝트 URL 입력
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // 여기에 Supabase 공개 키 입력

// Supabase 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// 초기화된 Supabase 클라이언트 내보내기
export default supabase;