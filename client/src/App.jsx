import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

function App() {
  const [mode, setMode] = useState("Auto")
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar mode={mode} setMode={setMode} />
      <ChatWindow mode={mode} />
    </div>
  );
}

export default App;
