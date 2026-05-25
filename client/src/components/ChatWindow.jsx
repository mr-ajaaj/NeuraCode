import { useState } from "react";
import InputBox from "./InputBox";
import Message from "./Message";

export default function ChatWindow({ mode }) {
  const [messages, setMessages] = useState([
    { text: "Hello 👋 I'm NeuraCode", isUser: false },
  ]);

  const handleSendMessage = async (text, fileContent = null) => {
    const userMessage = { text, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: fileContent ? `Analyze this code:\n\n${fileContent}` : text,
          mode,
        }),
      });

      const reader = res.body.getReader();

      const decoder = new TextDecoder();

      let aiText = "";

      setMessages((prev) => [...prev, { text: "", isUser: false }]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        aiText += decoder.decode(value);

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            text: aiText,
            isUser: false,
          };

          return updated;
        });
      }
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
