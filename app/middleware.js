import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function middleware(req) {
  const accessToken = req.cookies.get('sb-access-token');

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { data: { session }, error } = await supabase.auth.getSession(accessToken);

  if (error || !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};