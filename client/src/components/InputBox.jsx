import { useState } from "react";

export default function InputBox({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 border-t border-gray-700 flex gap-2">
      <input
        type="text"
        className="flex-1 p-2 rounded bg-gray-800 outline-none"
        placeholder="Ask NeuraCode..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSend} className="bg-blue-600 px-4 rounded">
        Send
      </button>
    </div>
  );
}
