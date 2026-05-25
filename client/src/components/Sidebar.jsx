export default function Sidebar({
  mode,
  setMode,
  chats,
  createNewChat,
  currentChatId,
  selectChat,
}) {
  const modes = ["Auto", "Explain", "Debug", "Refactor"];

  return (
    <div className="w-64 bg-gray-800 p-4">
      <h1 className="text-xl font-bold mb-6">NeuraCode</h1>

      <ul>
        {modes.map((item) => (
          <li
            key={item}
            onClick={() => setMode(item)}
            className={`p-2 rounded cursor-pointer ${
              mode === item ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
      <button
        onClick={createNewChat}
        className="w-full bg-blue-600 p-2 rounded mt-6"
      >
        + New Chat
      </button>
      <div className="mt-4 space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => selectChat(chat)}
            className={`p-2 rounded cursor-pointer ${
              currentChatId === chat.id ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}
