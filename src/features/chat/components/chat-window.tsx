import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem, type Message } from './message-item';
import { TypingIndicator } from './typing-indicator';
import { useEffect, useState } from 'react';

const initialMessages: Message[] = [
  { id: 1, text: 'Hey there! 👋', sender: 'me', time: '10:00 AM' },
  {
    id: 2,
    text: 'Hi! How’s the app coming?',
    sender: 'other',
    time: '10:01 AM',
  },
];

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(initialMessages);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-muted/10 border-l border-border">
      <ScrollArea className="flex-1 px-4 py-4 space-y-4">
        {loading ? (
          // Skeletons
          [...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`h-10 w-full max-w-[30%] rounded-2xl bg-muted/50 animate-pulse ${
                i % 2 === 0 ? 'ml-auto' : 'mr-auto'
              }`}
            />
          ))
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <MessageItem key={msg.id} {...msg} />
            ))}
            <TypingIndicator name="Sarah" />
          </>
        ) : (
          // Placeholder for empty chat
          <div className="text-center text-sm text-muted-foreground mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
