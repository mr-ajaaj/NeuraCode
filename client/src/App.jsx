import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

function App() {
  const [mode, setMode] = useState("Auto");

  const [chats, setChats] = useState([
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
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [...prev, newChat]);

    setCurrentChatId(newChat.id);

  };

  const selectChat = (chat) => {
    setCurrentChatId(chat.id);
  };

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
