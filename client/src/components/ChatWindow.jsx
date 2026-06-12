import { useState, useEffect, useRef } from "react";
import InputBox from "./InputBox";
import Message from "./Message";

export default function ChatWindow({ mode, chats, setChats, currentChat }) {
  const [isThinking, setIsThinking] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const [status, setStatus] = useState("");

  const [analysisType, setAnalysisType] = useState("project-analysis");

  const controllerRef = useRef(null);

  const messagesEndRef = useRef(null);

  const messages = currentChat.messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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

  const handleSendMessage = async (
    text,
    fileContent = null,
    analysisType = "project-analysis",
  ) => {
    const userMessage = { text, isUser: true };
    if (currentChat.title === "New Chat") {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChat.id
            ? {
                ...chat,
                title: text.startsWith("📂")
                  ? analysisType === "deep-analysis"
                    ? "Deep Project Analysis"
                    : "Project Analysis"
                  : text.length > 25
                    ? text.slice(0, 25) + "..."
                    : text,
              }
            : chat,
        ),
      );
    }
    updateCurrentChatMessages([...messages, userMessage]);
    setIsThinking(true);
    setIsGenerating(true);

    if (fileContent) {
      setStatus(
        analysisType === "deep-analysis"
          ? "🧠 Deep analyzing project..."
          : "🔍 Analyzing project...",
      );
    } else {
      setStatus("NeuraCode is thinking...");
    }

    try {
      const conversationHistory = messages
        .map((msg) => `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`)
        .join("\n");

      const finalMessage = fileContent
        ? `Analyze this code:\n\n${fileContent}`
        : `
        ${conversationHistory}

        User: ${text}
        `;
      controllerRef.current = new AbortController();

      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controllerRef.current.signal,
        body: JSON.stringify({
          message: fileContent ? fileContent : finalMessage,
          mode,
          task: fileContent ? analysisType : "chat",
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

      setIsGenerating(false);
      setStatus("");
    } catch (err) {
      if (err.name === "AbortError") {
        setIsThinking(false);
        setIsGenerating(false);
        setStatus("");
        return;
      }

      console.error(err);

      setIsThinking(false);
      setIsGenerating(false);
      setStatus("");
    }
  };

  const stopGenerating = () => {
    controllerRef.current?.abort();

    setIsThinking(false);
    setIsGenerating(false);
    setStatus("");
  };
  return (
    <div className="flex flex-col flex-1">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} isUser={msg.isUser} />
        ))}

        <div ref={messagesEndRef}></div>
        {isThinking && <div className="text-gray-400 italic">{status}</div>}
      </div>

      {isGenerating && (
        <button
          onClick={stopGenerating}
          className="mx-4 mb-2 bg-red-600 px-4 py-2 rounded"
        >
          Stop Generating
        </button>
      )}

      {/* Input */}
      <InputBox
        onSend={handleSendMessage}
        analysisType={analysisType}
        setAnalysisType={setAnalysisType}
      />
    </div>
  );
}
