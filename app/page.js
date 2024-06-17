import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import supabase from './utils/supabase/client';
import Chat from "./chat.js";

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token');

  if (!accessToken) {
    redirect('/login');
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    redirect('/login');
  }

  return (
    <div>
      <div className="container">
        <div className="list">sidebar</div>
        <div className="chat">chat</div>
        <Chat />
      </div>
    </div>
  );
}
