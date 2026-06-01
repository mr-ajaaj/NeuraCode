import { useState } from "react";
import InputBox from "./InputBox";
import Message from "./Message";

export default function ChatWindow({ mode, chats, setChats, currentChat }) {
  const [isThinking, setIsThinking] = useState(false);

  const messages = currentChat.messages;

  const updateCurrentChatMessages = (newMessages) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChat.id
          ? {
              ...chat,
              messages: newMessages,
            }
          : chat,
      ),
    );
  };

  const handleSendMessage = async (text, fileContent = null) => {
    const userMessage = { text, isUser: true };
    if (currentChat.title === "New Chat") {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChat.id
            ? {
                ...chat,
                title: text.length > 25 ? text.slice(0, 25) + "..." : text,
              }
            : chat,
        ),
      );
    }
    updateCurrentChatMessages([...messages, userMessage]);
    setIsThinking(true);

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

      updateCurrentChatMessages([
        ...messages,
        userMessage,
        { text: "", isUser: false },
      ]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        aiText += decoder.decode(value);

        setIsThinking(false);

        const updatedMessages = [
          ...messages,
          userMessage,
          {
            text: aiText,
            isUser: false,
          },
        ];

        updateCurrentChatMessages(updatedMessages);
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
        {isThinking && (
          <div className="text-gray-400 italic">NeuraCode is thinking...</div>
        )}
      </div>

      {/* Input */}
      <InputBox onSend={handleSendMessage} />
    </div>
  );
}
