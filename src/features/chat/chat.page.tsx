import useChatId from '@/hooks/use-chat-id';
import { ChatWindow } from './components/chat-window';
import { MessageInput } from './components/message-input';
import { SessionStorageUtils } from '@/lib/session-storage-utils';
import { decrypt } from '@/lib/encryption';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { useSocket } from '@/hooks/use-socket';

export default function ChatPage() {
  const chatId = useChatId()!;

  const storedValue = SessionStorageUtils.getItem('_ud');
  let user: UserProfile | null = null;
  if (storedValue) {
    const decrypted = decrypt(storedValue as string);
    user = JSON.parse(decrypted as string) as UserProfile;
  }

   const { sendMessage, sendTyping, typingUsers } = useSocket(user, chatId);


  if (!chatId)
    return <div className="p-4 text-center text-muted-foreground">No chat selected.</div>;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex-1 overflow-hidden">
        <ChatWindow roomId={chatId} typingUsers={typingUsers} />
      </div>
      <MessageInput roomId={chatId} onSend={sendMessage} onTyping={sendTyping} />
    </div>
  );
}
