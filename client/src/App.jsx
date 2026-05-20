import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

function App() {
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default App;
