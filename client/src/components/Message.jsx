import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Message({ text, isUser }) {
  const [copiedCode, setCopiedCode] = useState(null);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg max-w-lg ${
          isUser ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              return !inline && match ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(children));

                      const code = String(children);

                      setCopiedCode(code);

                      setTimeout(() => {
                        setCopiedCode(null);
                      }, 2000);
                    }}
                    className="absolute right-2 top-2 bg-gray-700 px-2 py-1 text-sm rounded"
                  >
                    {copiedCode === String(children) ? "Copied ✅" : "Copy"}
                  </button>

                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-gray-700 px-1 rounded">{children}</code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
