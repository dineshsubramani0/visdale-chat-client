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
import { SessionStorageUtils } from '@/lib/session-storage-utils';
import { decrypt } from '@/lib/encryption';
import type { UserProfile } from '@/@types/auth/user.inferface';
import type { ChatRoom } from '@/@types/chat/chat.interface';
import { useNavigate } from 'react-router-dom';
import { CHAT_ROUTES_CONSTANT } from '@/routers/app/chat/chat-routes.constant';
import useChatId from '@/hooks/use-chat-id';
import { useChat } from '@/api/hooks/use-chat';
import { toast } from 'sonner';


interface ChatSidebarProps {
  onClose?: () => void;
}

export function ChatSidebar({ onClose }: Readonly<ChatSidebarProps>) {
  const chatId = useChatId();
  const navigate = useNavigate();

  const { roomsQuery, createGroupMutation } = useChat();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState<ChatRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const storedValue = SessionStorageUtils.getItem('_ud');
  const roomsQueryData = roomsQuery.data?.data;

  let _ud: UserProfile | null = null;
  if (storedValue) {
    const decrypted = decrypt(storedValue as string);
    _ud = JSON.parse(decrypted as string) as UserProfile;
  }

  const defaultUsers: ChatRoom[] = [
    {
      id: _ud?.id ?? '',
      name: `${_ud?.first_name} ${_ud?.last_name} (You)`,
      lastMessage: '',
      unread: 0,
      isGroup: false,
    },
  ];

  const [users] = useState(defaultUsers);

  useEffect(() => {
    const timer = setTimeout(() => setRoomsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatId) {
      setActiveId(chatId);
    } else if (!activeId && users[0]?.id) {
      const firstId = users[0].id;
      setActiveId(firstId);
    }
  }, [chatId, users, activeId, navigate]);

  useEffect(() => {
    if (roomsQueryData) {
      const mappedGroups = roomsQueryData.map((room: ChatRoom) => ({
        id: room.id,
        name: room?.groupName ?? '',
        lastMessage: room.lastMessage || '',
        unread: 0,
        isGroup: room.isGroup,
      }));

      setGroups(mappedGroups);
    }
  }, [roomsQueryData]);


  // const filteredUsers = users.filter((u) =>
  //   u.name.toLowerCase().includes(search.toLowerCase())
  // );
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      await createGroupMutation.mutateAsync(
        {
          groupName,
          participants: [_ud?.id ?? ''],
        },
        {
          onSuccess: (response) => {
            const newGroup = response.data;

            setGroups((prev) => [
              ...prev,
              {
                id: newGroup.id,
                name: groupName,
                lastMessage: '',
                unread: 0,
                isGroup: true,
              },
            ]);


            toast.success(`Group "${groupName}" created successfully!`);
            navigate(`/chat/${newGroup.id}`);
            setGroupName('');
            setIsDialogOpen(false);
          },
          onError: (error) => {
            toast.error('Failed to create group. Please try again.');
            console.error(error);
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setActiveId(roomId);
    navigate(`${CHAT_ROUTES_CONSTANT.CHAT}/${roomId}`);
    onClose?.();
  };

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
      {room?.unread > 0 && (
        <span className="min-h-[18px] min-w-[18px] text-[10px] flex items-center justify-center bg-primary text-primary-foreground rounded-full animate-pulse">
          {room.unread}
        </span>
      )}
    </button>
  );

  const handleLogout = () => {
    console.log('Logout clicked');
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
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-3 text-sm bg-muted/40 rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        {roomsLoading ? (
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
              {/* <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Users
              </p>
              {filteredUsers.length ? (
                filteredUsers.map(renderRoom)
              ) : (
                <p className="text-xs text-muted-foreground px-4">No users</p>
              )} */}

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Rooms
                </p>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setGroupName('');
                  setIsDialogOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground cursor-pointer hover:text-primary hover:bg-primary/10">
                      <IconPlus size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Create New Room</DialogTitle>
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
                        className='cursor-pointer'
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim() || createGroupMutation.isPending}>
                        <IconUsers size={16} className="mr-1" /> Create Room
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
            <span className="text-xs font-medium leading-tight">{`${_ud?.first_name ?? ''} ${_ud?.last_name ?? ''}`}</span>
            <span className="text-[10px] text-green-500">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <button
            title="Logout"
            aria-label="Logout"
            className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition"
            onClick={handleLogout}>
            <IconLogout size={16} />
          </button>
        </div>
      </div>
    </aside >
  );
}
