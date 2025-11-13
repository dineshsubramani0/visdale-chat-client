import useChatId from '@/hooks/use-chat-id';
import { ChatWindow } from './components/chat-window';
import { MessageInput } from './components/message-input';

export default function ChatPage() {
  const chatId = useChatId();
  
  if (!chatId) return <div className="p-4 text-center">No chat selected.</div>;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex-1 overflow-hidden">
        <ChatWindow roomId={chatId} />
      </div>
      <MessageInput roomId={chatId} />
    </div>
  );
}
