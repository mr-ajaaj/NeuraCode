import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

function App() {
  const [mode, setMode] = useState("Auto");

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("neuracode-chats");

    return savedChats
      ? JSON.parse(savedChats)
      : [
          {
            id: 1,
            title: "New Chat",
            messages: [
              {
                text: "Hello 👋 I'm NeuraCode",
                isUser: false,
              },
            ],
          },
        ];
  });

  const [currentChatId, setCurrentChatId] = useState(() => {
    return Number(localStorage.getItem("neuracode-current-chat")) || 1;
  });

  useEffect(() => {
    localStorage.setItem("neuracode-current-chat", currentChatId);
  }, [currentChatId]);

  const currentChat =
    chats.find((chat) => chat.id === currentChatId) || chats[0];

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          text: "Hello 👋 I'm NeuraCode",
          isUser: false,
        },
      ],
    };

    setChats((prev) => [...prev, newChat]);

    setCurrentChatId(newChat.id);

  };

  const selectChat = (chat) => {
    setCurrentChatId(chat.id);
  };

  useEffect(() => {
    localStorage.setItem("neuracode-chats", JSON.stringify(chats));
  }, [chats]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        mode={mode}
        setMode={setMode}
        chats={chats}
        createNewChat={createNewChat}
        currentChatId={currentChatId}
        selectChat={selectChat}
      />
      <ChatWindow
        mode={mode}
        chats={chats}
        setChats={setChats}
        currentChat={currentChat}
      />
    </div>
  );
}

export default App;
