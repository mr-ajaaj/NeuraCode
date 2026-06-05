import { useState } from "react";

export default function InputBox({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    let projectContent = "";

    for (const file of files) {
      const content = await file.text();

      projectContent += `
        ====================
        FILE: ${file.name}
        ====================

        ${content}

      `;
    }

    onSend(`📂 Project Analysis (${files.length} files)`, projectContent);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;

      onSend(`📂 Uploaded File: ${file.name}`, content);
    };

    reader.readAsText(file);
  };

  return (
    <div
      className="p-4 border-t border-gray-700 flex gap-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="text"
        className="flex-1 p-2 rounded bg-gray-800 outline-none"
        placeholder="Ask NeuraCode..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input type="file" onChange={handleFileUpload} multiple />

      <button onClick={handleSend} className="bg-blue-600 px-4 rounded">
        Send
      </button>
    </div>
  );
}
