import Chat from "./chat.js";
export default function Home() {

  return (
    <div>
      <div className="container">
        <div className="list">sidebar</div>
        <div className="chat">chat</div>
        <Chat></Chat>
      </div>
    </div>
  );
}
