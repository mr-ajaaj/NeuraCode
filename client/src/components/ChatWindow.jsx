import { useState } from "react";
import InputBox from "./InputBox";
import Message from "./Message";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { text: "Hello 👋 I'm NeuraCode", isUser: false },
  ]);

  const handleSendMessage = (text) => {
    const newMessage = {
      text: text,
      isUser: true,
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col flex-1">

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>

      {/* Input */}
      <InputBox onSend={handleSendMessage} />
    </div>
  );
}
