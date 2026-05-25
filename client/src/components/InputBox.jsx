import { useState } from "react";

export default function InputBox({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;

      onSend(`📂 Uploaded File: ${file.name}`, content);
    };

    reader.readAsText(file);
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
      <input type="file" onChange={handleFileUpload} />

      <button onClick={handleSend} className="bg-blue-600 px-4 rounded">
        Send
      </button>
    </div>
  );
}
