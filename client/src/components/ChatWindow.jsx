import InputBox from "./InputBox";
import Message from "./Message";

export default function ChatWindow() {
  return (
    <div className="flex flex-col flex-1">
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <Message text="Hello 👋 I'm NeuraCode" isUser={false} />
      </div>

      {/* Input */}
      <InputBox />
    </div>
  );
}