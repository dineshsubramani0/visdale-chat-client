import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ChatSidebar } from '@/components/layout/chat-sidebar';
import { ChatHeader } from '@/components/layout/chat-header';
import useChatId from '@/hooks/use-chat-id';
import { NoChatFound } from '@/components/layout/no-chat-found';
import { useChat } from '@/api/hooks/use-chat';
import { SessionStorageUtils } from '@/lib/session-storage-utils';
import type { UserProfile } from '@/@types/auth/user.inferface';
import { decrypt } from '@/lib/encryption';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatId = useChatId()!;
  const { useRoomQuery } = useChat();
  const {
    data: roomData,
    isLoading: roomLoading,
    isError,
  } = useRoomQuery(chatId);
  const storedValue = SessionStorageUtils.getItem('_ud');

  let _ud: UserProfile | null = null;
  if (storedValue) {
    const decrypted = decrypt(storedValue as string);
    _ud = JSON.parse(decrypted as string) as UserProfile;
  }

  const isValidChat = !isError && !!chatId;

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <div className="hidden md:flex">
        <ChatSidebar currentUser={_ud} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden flex transition-all duration-300 ${
          sidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}>
        <button
          type="button"
          aria-label="Close sidebar"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative w-80 h-full bg-background shadow-lg">
          <ChatSidebar
            currentUser={_ud}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 border-l border-border bg-background/80 backdrop-blur-sm transition-all">
        {/* Header — hide if invalid chat */}
        {isValidChat && (
          <ChatHeader
            currentUserId={_ud?.id as string}
            roomData={roomData}
            roomLoading={roomLoading}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {isValidChat ? <Outlet /> : <NoChatFound />}
        </div>
      </div>
    </div>
  );
}
