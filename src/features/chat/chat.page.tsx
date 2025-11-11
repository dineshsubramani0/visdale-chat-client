import { ChatWindow } from './components/chat-window';
import { MessageInput } from './components/message-input';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
      <MessageInput />
    </div>
  );
}
