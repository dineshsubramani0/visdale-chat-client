import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconMenu, IconUser, IconPlus, IconPhone, IconVideo, IconInfoCircle, IconDots } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

type Participant = {
  id: number;
  name: string;
  image?: string;
  status?: 'online' | 'offline';
};

export function ChatHeader({
  chatName,
  participants = [],
  isGroup = false,
  onOpenSidebar,
  onAddParticipants,
}: Readonly<{
  chatName?: string;
  participants?: Participant[];
  isGroup?: boolean;
  onOpenSidebar?: () => void;
  onAddParticipants?: (users: Participant[]) => void;
}>) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentParticipants, setCurrentParticipants] = useState<Participant[]>(participants);
  const [search, setSearch] = useState('');

  const dummyUsers: Participant[] = [
    { id: 1, name: 'Sarah Johnson', image: '/avatars/1.jpg', status: 'online' },
    { id: 2, name: 'Alex Carter', image: '/avatars/2.jpg', status: 'offline' },
    { id: 3, name: 'John Doe', image: '/avatars/3.jpg', status: 'online' },
    { id: 4, name: 'Emily Clark', image: '/avatars/4.jpg', status: 'offline' },
    { id: 5, name: 'Michael Lee', image: '/avatars/5.jpg', status: 'online' },
  ];

  const filteredUsers = useMemo(
    () =>
      dummyUsers.filter(
        (u) =>
          !currentParticipants.some((p) => p.id === u.id) &&
          u.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, currentParticipants]
  );

  const handleToggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleAddParticipants = () => {
    const usersToAdd = dummyUsers.filter((u) => selectedUsers.includes(u.id));
    const updated = [...currentParticipants, ...usersToAdd];
    setCurrentParticipants(updated);
    onAddParticipants?.(usersToAdd);
    setSelectedUsers([]);
    setSearch('');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur-md shadow-sm">
      {/* Mobile menu button */}
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

      {/* Chat info */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
          <AvatarImage src={currentParticipants?.[0]?.image || '/avatars/default.jpg'} alt={chatName || 'Chat'} />
          <AvatarFallback>
            <IconUser size={16} />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold truncate">{chatName || 'Dinesh S'}</p>
          {isGroup ? (
            <p className="text-xs text-muted-foreground">{currentParticipants.length} participant{currentParticipants.length !== 1 ? 's' : ''}</p>
          ) : (
            <p className="text-xs flex items-center gap-1 text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Add participants for group */}
        {isGroup && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" title="Add Participant">
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
                {filteredUsers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-3">No users found</p>
                )}
                {filteredUsers.map((user) => (
                  <label key={user.id} className="flex items-center justify-between gap-2 p-2 rounded hover:bg-muted/20 cursor-pointer transition">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleToggleUser(user.id)}
                        className="w-4 h-4"
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-sm">
                        <span>{user.name}</span>
                        <span className={`text-[10px] ${user.status === 'online' ? 'text-green-500' : 'text-muted-foreground'}`}>{user.status}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <DialogFooter className="mt-3 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddParticipants} disabled={selectedUsers.length === 0}>
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {
          isGroup && (
            <>
              <Button size="icon" variant="ghost" className="hover:bg-primary/10 text-muted-foreground"><IconPhone size={18} /></Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary/10 text-muted-foreground"><IconVideo size={18} /></Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary/10 text-muted-foreground"><IconInfoCircle size={18} /></Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary/10 text-muted-foreground"><IconDots size={18} /></Button></>
          )
        }

      </div>
    </header>
  );
}
