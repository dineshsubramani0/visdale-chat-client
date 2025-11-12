import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconMenu,
  IconUser,
  IconPlus,
  IconDots,
  IconInfoCircle,
  IconPhone,
  IconVideo,
} from '@tabler/icons-react';
import { useChat } from '@/api/hooks/use-chat';
import type { CreateGroupResponse } from '@/@types/chat/chat.interface';

type Participant = {
  id: string;
  name: string;
  image?: string;
  status?: 'online' | 'offline';
};

export function ChatHeader({
  onOpenSidebar,
  onAddParticipants,
  roomData,
  roomLoading,
}: Readonly<{
  onOpenSidebar?: () => void;
  onAddParticipants?: (users: Participant[]) => void;
  roomData: CreateGroupResponse | undefined;
  roomLoading?: boolean;
}>) {
  const { userQuery } = useChat();
  const { data: users, isLoading: usersLoading } = userQuery;
  const usersData = users?.data;

  const room = roomData?.data;

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1️⃣ Filter users not already in participants (use Set)
  const availableUsers: Participant[] = useMemo(() => {
    if (!usersData || !room?.participants) return [];

    const participantIds = new Set(room.participants.map((p) => p.user.id));

    return usersData
      .filter((u) => !participantIds.has(u.id))
      .map((u) => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        image: '/avatars/default.jpg',
        status: 'online',
      }));
  }, [usersData, room?.participants]);

  // 2️⃣ Filter based on search
  const filteredUsers = useMemo(
    () =>
      availableUsers.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      ),
    [availableUsers, search]
  );

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleAddParticipants = () => {
    const usersToAdd = availableUsers.filter((u) =>
      selectedUsers.includes(u.id)
    );
    onAddParticipants?.(usersToAdd);
    setSelectedUsers([]);
    setSearch('');
    setIsDialogOpen(false); // close dialog after adding
  };

  const participantCount = room?.participants?.length || 0;

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur-md shadow-sm">
      {/* Sidebar button */}
      {onOpenSidebar && (
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden mr-2"
          onClick={onOpenSidebar}
        >
          <IconMenu size={20} />
        </Button>
      )}

      {/* Chat Info */}
      <div className="flex items-center gap-3 min-w-0">
        {roomLoading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={'/avatars/default.jpg'} />
            <AvatarFallback>
              <IconUser size={16} />
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col min-w-0">
          {roomLoading ? (
            <>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </>
          ) : (
            <>
              <p className="text-sm font-semibold truncate">
                {room?.groupName || 'Chat'}
              </p>
              {room?.isGroup && participantCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {participantCount} participant{participantCount !== 1 ? 's' : ''}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      {!roomLoading && room?.isGroup && (
        <div className="flex items-center gap-2">
          {/* Add Participants Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                title="Add Participant"
                onClick={() => setIsDialogOpen(true)}
              >
                <IconPlus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle>Add Participants</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-3 text-sm"
              />
              <div className="max-h-72 overflow-y-auto space-y-2">
                {usersLoading && (
                  <>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </>
                )}
                {!usersLoading && filteredUsers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-3">
                    No users found
                  </p>
                )}
                {!usersLoading &&
                  filteredUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center justify-between gap-2 p-2 rounded hover:bg-muted/20 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4"
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm">
                          <span>{user.name}</span>
                          <span
                            className={`text-[10px] ${user.status === 'online'
                              ? 'text-green-500'
                              : 'text-muted-foreground'
                              }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
              <DialogFooter className="mt-3 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleAddParticipants}
                  disabled={selectedUsers.length === 0}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Other group actions */}
          <Button size="icon" variant="ghost">
            <IconPhone size={18} />
          </Button>
          <Button size="icon" variant="ghost">
            <IconVideo size={18} />
          </Button>
          <Button size="icon" variant="ghost">
            <IconInfoCircle size={18} />
          </Button>
          <Button size="icon" variant="ghost">
            <IconDots size={18} />
          </Button>
        </div>
      )}
    </header>
  );
}
