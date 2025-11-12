import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  IconX,
  IconMessageCircle2,
  IconPlus,
  IconUsers,
  IconLogout,
} from '@tabler/icons-react';
import clsx from 'clsx';
import { ModeToggle } from '../theme/mode-toggle';
import { useAuth } from '@/api/hooks/use-auth';
import { SessionStorageUtils } from '@/lib/session-storage-utils';
import { decrypt } from '@/lib/encryption';
import type { UserProfile } from '@/@types/auth/user.inferface';

export type ChatRoom = {
  id: number;
  name: string;
  lastMessage: string;
  unread: number;
};

// Dummy data
const defaultUsers: ChatRoom[] = [
  { id: 1, name: 'Dinesh S', lastMessage: 'See you soon!', unread: 1 },
];

const defaultGroups: ChatRoom[] = [
  {
    id: 101,
    name: 'Design Team',
    lastMessage: 'Update Figma mockups',
    unread: 2,
  },
  { id: 102, name: 'Developers', lastMessage: 'Build ready!', unread: 0 },
  { id: 103, name: 'Marketing', lastMessage: 'Campaign approved', unread: 1 },
];

interface ChatSidebarProps {
  onClose?: () => void;
  users?: ChatRoom[];
  groups?: ChatRoom[];
}

export function ChatSidebar({
  onClose,
  users = defaultUsers,
  groups: initialGroups = defaultGroups,
}: Readonly<ChatSidebarProps>) {
  const { logoutMutation } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(users[0]?.id || null);
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState(initialGroups);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const storedValue = SessionStorageUtils.getItem('_ud');

  let _ud: UserProfile | null = null;

  if (storedValue) {
    const decrypted = decrypt(storedValue as string); // returns string
    _ud = JSON.parse(decrypted as string) as UserProfile;
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoomSelect = (roomId: number) => {
    setActiveId(roomId);
    onClose?.();
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    const newGroup: ChatRoom = {
      id: Date.now(),
      name: groupName,
      lastMessage: 'New group created',
      unread: 0,
    };
    setGroups([newGroup, ...groups]);
    setGroupName('');
    setIsDialogOpen(false);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderRoom = (room: ChatRoom) => (
    <button
      key={room.id}
      type="button"
      onClick={() => handleRoomSelect(room.id)}
      className={clsx(
        'flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg w-full text-left transition',
        activeId === room.id
          ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
          : 'hover:bg-muted/60 focus:ring-1 focus:ring-primary/30'
      )}>
      <Avatar className="h-9 w-9">
        <AvatarImage src={`/avatars/${room.id}.jpg`} />
        <AvatarFallback>{room.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{room.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {room.lastMessage}
        </p>
      </div>

      {room.unread > 0 && (
        <span className="min-h-[18px] min-w-[18px] text-[10px] flex items-center justify-center bg-primary text-primary-foreground rounded-full animate-pulse">
          {room.unread}
        </span>
      )}
    </button>
  );

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      console.log('Logged out successfully');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <aside className="w-80 h-full flex flex-col bg-background/90 border-r border-border md:relative fixed z-40 md:translate-x-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
            <IconMessageCircle2 size={18} />
          </div>
          <h2 className="text-lg font-semibold bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent tracking-tight">
            Chats
          </h2>
        </div>

        <button
          aria-label="Close sidebar"
          className="md:hidden hover:bg-muted p-1 rounded-lg transition"
          onClick={onClose}>
          <IconX size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-3 text-sm bg-muted/40 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3 h-full overflow-y-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-36" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="mt-3 px-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Users
              </p>
              {filteredUsers.length ? (
                filteredUsers.map(renderRoom)
              ) : (
                <p className="text-xs text-muted-foreground px-4">No users</p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Groups
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <IconPlus size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Create New Group</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                      <Input
                        placeholder="Group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim()}>
                        <IconUsers size={16} className="mr-1" /> Create Group
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {filteredGroups.length ? (
                filteredGroups.map(renderRoom)
              ) : (
                <p className="text-xs text-muted-foreground px-4">No groups</p>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between bg-muted/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/user.jpg" />
            <AvatarFallback>
              {_ud?.first_name ? _ud.first_name[0].toUpperCase() : 'U'}
            </AvatarFallback>

          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium leading-tight">{`${_ud?.first_name ?? ''} ${_ud?.last_name ?? ''}` }</span>
            <span className="text-[10px] text-green-500">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <button
            title="Logout"
            aria-label="Logout"
            className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition"
            onClick={() => {

              handleLogout();
            }}>
            <IconLogout size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
