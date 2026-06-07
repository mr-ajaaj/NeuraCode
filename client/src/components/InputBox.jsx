import { useState } from "react";

export default function InputBox({ onSend, analysisType, setAnalysisType }) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);

  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return;

    if (files.length > 0) {
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

      onSend(
        `📂 Project Analysis (${files.length} files)`,
        projectContent,
        analysisType,
      );

      setFiles([]);
    } else {
      onSend(input);
    }
    setInput("");
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const selectedFiles = Array.from(e.target.files);

    setFiles(selectedFiles);
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
      {files.length > 0 && (
        <div className="mb-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex justify-between items-center text-sm"
            >
              <span>📎 {file.name}</span>

              <button
                onClick={() =>
                  setFiles((prev) => prev.filter((f) => f.name !== file.name))
                }
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        type="text"
        className="flex-1 p-2 rounded bg-gray-800 outline-none"
        placeholder="Ask NeuraCode..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input type="file" onChange={handleFileUpload} multiple />
      <select
        value={analysisType}
        onChange={(e) => setAnalysisType(e.target.value)}
        className="bg-gray-800 p-2 rounded outline-none"
      >
        <option value="project-analysis">Project Analysis</option>

        <option value="deep-analysis">Deep Analysis</option>
      </select>

      <button onClick={handleSend} className="bg-blue-600 px-4 rounded">
        Send
      </button>
    </div>
  );
}
