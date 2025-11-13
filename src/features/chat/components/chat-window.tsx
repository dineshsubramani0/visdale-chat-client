import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { SessionStorageUtils } from '@/lib/session-storage-utils';
import { decrypt } from '@/lib/encryption';
import { useChat } from '@/api/hooks/use-chat';
import { SkeletonMessages } from './skeletons';
import { MessageItem } from './message-item';
import { TypingIndicator } from './typing-indicator';

interface ChatWindowProps {
  roomId: string;
  typingUsers: Record<string, string | null>;
}

export function ChatWindow({ roomId, typingUsers }: Readonly<ChatWindowProps>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { useMessagesQuery } = useChat();
  const { data: messagesData, isLoading } = useMessagesQuery(roomId, 10);
  const messages = messagesData?.data ?? [];

  // Get current user
  const storedValue = SessionStorageUtils.getItem('_ud');
  let currentUser: UserProfile | null = null;
  if (storedValue) {
    const decrypted = decrypt(storedValue as string);
    currentUser = JSON.parse(decrypted as string) as UserProfile;
  }

  // Scroll to bottom whenever messages or typing changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      console.log('[ChatWindow] Scrolled to bottom');
    }
  }, [messages, typingUsers]);

  if (!currentUser) return <div className="p-4 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-muted/10 border-l border-border">
      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden scroll-smooth custom-scroll"
      >
        <div className="flex flex-col space-y-4 pb-2">
          {isLoading ? (
            <SkeletonMessages />
          ) : (
            <AnimatePresence initial={false}>
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = currentUser?.id === msg.senderId;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <MessageItem
                        id={msg.id}
                        text={msg.content}
                        sender={isMe ? 'me' : 'other'}
                        name={`${msg.sender.first_name} ${msg.sender.last_name}`}
                        time={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        attachments={msg.image ? [msg.image] : []}
                      />
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-sm text-muted-foreground mt-4"
                >
                  No messages yet. Be the first to say something!
                </motion.div>
              )}

              {/* Typing indicator */}
              {typingUsers[roomId] && <TypingIndicator name={typingUsers[roomId]} />}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
