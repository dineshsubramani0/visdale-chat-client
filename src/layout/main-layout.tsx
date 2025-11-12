import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ChatSidebar } from '@/components/layout/chat-sidebar';
import { ChatHeader } from '@/components/layout/chat-header';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <ChatSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden flex transition-all duration-300 ${
          sidebarOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}>
        {/* Backdrop as button for full accessibility */}
        <button
          type="button"
          aria-label="Close sidebar"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div className="relative w-80 h-full bg-background shadow-lg">
          <ChatSidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 border-l border-border bg-background/80 backdrop-blur-sm transition-all">
        {/* Header */}
        <ChatHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
