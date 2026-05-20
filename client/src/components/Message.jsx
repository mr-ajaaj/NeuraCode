export default function Message({ text, isUser }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg max-w-lg ${
          isUser ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        {text}
      </div>
    </div>
  );
}