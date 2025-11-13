import { useState, useMemo, useEffect } from 'react';
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
import { IconMenu, IconUser, IconPlus } from '@tabler/icons-react';
import { useChat } from '@/api/hooks/use-chat';
import type { CreateGroupResponse } from '@/@types/chat/chat.interface';
import BallTriangleSpinner from '../common/spinners/ball-triangle.spinner';
import { ParticipantsModal } from './participants-modal';

type Participant = {
  id: string;
  name: string;
  image?: string;
  status?: 'online' | 'offline';
};

export function ChatHeader({
  onOpenSidebar,
  roomData,
  roomLoading,
  currentUserId,
}: Readonly<{
  onOpenSidebar?: () => void;
  roomData: CreateGroupResponse | undefined | null;
  roomLoading?: boolean;
  currentUserId: string;
}>) {
  const { userQuery, addParticipantsMutation } = useChat();
  const { data: users, isLoading: usersLoading, refetch } = userQuery;
  const usersData = users?.data;
  const room = roomData?.data;

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /** Refetch users whenever the dialog opens */
  useEffect(() => {
    if (isDialogOpen) {
      refetch();
    }
  }, [isDialogOpen, refetch]);

  /** Check if current user is admin */
  const isAdmin = useMemo(() => {
    if (!room?.participants) return false;
    return room.participants.some(
      (p) => p.user.id === currentUserId && p.isAdmin
    );
  }, [room?.participants, currentUserId]);

  /** Available users to add */
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

  /** Async add participants */
  const handleAddParticipants = async () => {
    if (!room || selectedUsers.length === 0) return;

    const usersToAdd = availableUsers.filter((u) =>
      selectedUsers.includes(u.id)
    );

    try {
      await addParticipantsMutation.mutateAsync({
        roomId: room.id,
        userIds: usersToAdd.map((u) => u.id),
      });
      setSelectedUsers([]);
      setSearch('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add participants:', error);
    }
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
          onClick={onOpenSidebar}>
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
                  {participantCount} participant
                  {participantCount !== 1 ? 's' : ''}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      {!roomLoading && room?.isGroup && (
        <div className="flex items-center gap-2">
          {/* Add Participants (admin only) */}
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  title="Add Participant"
                  className="cursor-pointer"
                  onClick={() => setIsDialogOpen(true)}>
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
                  {usersLoading ? (
                    <div className="flex justify-center py-4">
                      <BallTriangleSpinner />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-3">
                      No users found
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center justify-between gap-2 p-2 rounded hover:bg-muted/20 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="w-4 h-4"
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col text-sm">
                            <span>{user.name}</span>
                            <span className="text-[10px] text-green-500">
                              online
                            </span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <DialogFooter className="mt-3 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button className="cursor-pointer" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    className="cursor-pointer"
                    onClick={handleAddParticipants}
                    disabled={
                      selectedUsers.length === 0 ||
                      addParticipantsMutation.isPending
                    }>
                    {addParticipantsMutation.isPending ? 'Adding...' : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* View Participants */}
          <ParticipantsModal roomData={roomData} />
        </div>
      )}
    </header>
  );
}
