import { useState } from "react";
import InputBox from "./InputBox";
import Message from "./Message";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { text: "Hello 👋 I'm NeuraCode", isUser: false },
  ]);

  const handleSendMessage = async (text) => {
    const userMessage = { text, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMessage = {
        text: data.reply,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    }
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
