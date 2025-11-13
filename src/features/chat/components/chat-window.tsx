import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageItem } from './message-item';
import { SkeletonMessages } from './skeletons';
import type { MessageResponse } from '@/@types/chat/chat.interface';
import { useChat } from '@/api/hooks/use-chat';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { decrypt } from '@/lib/encryption';
import { SessionStorageUtils } from '@/lib/session-storage-utils';

interface ChatWindowProps {
  roomId: string;
}

export function ChatWindow({ roomId }: Readonly<ChatWindowProps>) {
  const { useMessagesQuery } = useChat();
  const { data: messagesData, isLoading } = useMessagesQuery(roomId, 50);
  const messages = messagesData?.data ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const storedValue = SessionStorageUtils.getItem('_ud');

  let _ud: UserProfile | null = null;

  if (storedValue) {
    const decrypted = decrypt(storedValue as string);
    _ud = JSON.parse(decrypted as string) as UserProfile;
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-muted/10 border-l border-border">
      <div
        ref={scrollRef}
        className="flex-1 px-4 py-4 overflow-y-auto scroll-smooth custom-scroll"
      >
        <div className="flex flex-col space-y-4 pb-2">
          {isLoading ? (
            <SkeletonMessages />
          ) : (
            <AnimatePresence initial={false}>
              {messages.length > 0 ? (
                messages.map((msg: MessageResponse) => {
                  const isMe = _ud?.id === msg.senderId;

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
                        name={msg.sender.first_name + ' ' + msg.sender.last_name}
                        time={new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        attachments={msg.image ? [msg.image] : []}
                        className={isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}
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
            </AnimatePresence>

          )}
        </div>
      </div>
    </div>
  );
}
