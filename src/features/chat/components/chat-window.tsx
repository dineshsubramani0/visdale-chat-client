import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { SessionStorageUtils } from '@/lib/session-storage-utils';
import { decrypt } from '@/lib/encryption';
import { useChat } from '@/api/hooks/use-chat';
import { SkeletonMessages } from './skeletons';
import { MessageItem } from './message-item';
import { TypingIndicator } from './typing-indicator';
import type { MessageList } from '@/@types/chat/chat.interface';
import type { UIEvent } from 'react';

interface ChatWindowProps {
  roomId: string;
  typingUsers: Record<string, string | null>;
}

export function ChatWindow({ roomId, typingUsers }: Readonly<ChatWindowProps>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { useMessagesInfiniteQuery } = useChat();
  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessagesInfiniteQuery(roomId, 10);

  const messages = useMemo(() => {
    return (messagesData as unknown as MessageList)?.pages
      .flatMap(page => page.messages)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messagesData]);

  const storedValue = SessionStorageUtils.getItem('_ud');
  let currentUser: UserProfile | null = null;
  if (storedValue) {
    const decrypted = decrypt(storedValue as string);
    currentUser = JSON.parse(decrypted as string) as UserProfile;
  }

  // Flag to scroll to bottom only on initial load
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (!initialLoadDone && scrollRef?.current && messages?.length > 0) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
      setInitialLoadDone(true);
    }
  }, [initialLoadDone, messages]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    if (el.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const previousHeight = el.scrollHeight;

      fetchNextPage().then(() => {
        if (scrollRef.current) {
          const newHeight = scrollRef.current.scrollHeight;
          const diff = newHeight - previousHeight;

          // Smoothly maintain scroll position after loading older messages
          scrollRef.current.scrollTo({
            top: diff, // maintain position
            behavior: 'auto', // or 'smooth' if you want a smooth effect
          });
        }
      });
    }
  };

  if (!currentUser)
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-muted/10 border-l border-border">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden scroll-smooth custom-scroll"
      >
        <div className="flex flex-col space-y-4 pb-2">
          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <span className="text-sm text-muted-foreground">
                Loading older messages...
              </span>
            </div>
          )}

          {isLoading && <SkeletonMessages />}

          <AnimatePresence initial={false}>
            {messages?.length > 0 ? (
              messages.map(msg => {
                const isMe = currentUser?.id === msg?.senderId;
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
                      time={new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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

            {typingUsers[roomId] && <TypingIndicator name={typingUsers[roomId]} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
