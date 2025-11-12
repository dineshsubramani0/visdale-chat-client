import { MessageItem, type Message } from './message-item';
import { TypingIndicator } from './typing-indicator';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Hey everyone 👋',
    sender: 'me',
    name: 'You',
    time: '10:00 AM',
  },
  {
    id: 2,
    text: 'Hi Dinesh! How’s the new feature going?',
    sender: 'sarah',
    name: 'Sarah',
    time: '10:01 AM',
  },
  {
    id: 3,
    text: 'Morning folks ☀️',
    sender: 'mike',
    name: 'Mike',
    time: '10:02 AM',
  },
  {
    id: 4,
    text: 'Hey Mike! Just fixing some bugs 😅',
    sender: 'me',
    name: 'You',
    time: '10:03 AM',
  },
  {
    id: 5,
    text: 'Cool. Need any help with the backend?',
    sender: 'alex',
    name: 'Alex',
    time: '10:04 AM',
  },
  {
    id: 6,
    text: 'Actually yes, maybe later today.',
    sender: 'me',
    name: 'You',
    time: '10:05 AM',
  },
  {
    id: 7,
    text: 'I’ll be online till evening. Ping me anytime.',
    sender: 'alex',
    name: 'Alex',
    time: '10:06 AM',
  },
  {
    id: 8,
    text: 'Same here 💪',
    sender: 'mike',
    name: 'Mike',
    time: '10:07 AM',
  },
];

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(initialMessages);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-muted/10 border-l border-border">
      <div
        ref={scrollAreaRef}
        className="
          flex-1 px-4 py-4 
          overflow-y-auto 
          scroll-smooth
          [scrollbar-width:thin]
          [scrollbar-color:var(--color-muted)_transparent]
          transition-colors
          duration-300
          custom-scroll
        ">
        <div className="flex flex-col space-y-4 pb-2">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-10 w-full max-w-[35%] rounded-2xl bg-muted/50 animate-pulse ${
                  i % 2 === 0 ? 'ml-auto' : 'mr-auto'
                }`}
              />
            ))
          ) : (
            <AnimatePresence initial={false}>
              {messages.length > 0 ? (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, delay: msg.id * 0.05 }}>
                      <MessageItem {...msg} />
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}>
                    <TypingIndicator name="Sarah" />
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-sm text-muted-foreground mt-4">
                  No messages yet. Be the first to say something!
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
