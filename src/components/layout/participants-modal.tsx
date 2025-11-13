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
import type { CreateGroupResponse } from '@/@types/chat/chat.interface';

interface ParticipantsModalProps {
  roomData: CreateGroupResponse | undefined | null;
}

export function ParticipantsModal({ roomData }: Readonly<ParticipantsModalProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const room = roomData?.data;

  const filteredParticipants = useMemo(() => {
    if (!room?.participants) return [];
    return room.participants.filter((p) =>
      `${p.user.first_name} ${p.user.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [room?.participants, search]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer' size="icon" variant="outline" title="View Participants">
          👥
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm w-full rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle>
            Participants ({room?.participants?.length || 0})
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search participants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 text-sm"
        />

        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredParticipants.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              No participants found
            </p>
          ) : (
            filteredParticipants.map((p) => (
              <div
                key={p.user.id}
                className="flex items-center justify-between gap-2 p-2 rounded hover:bg-muted/20 transition"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={'/avatars/default.jpg'} />
                    <AvatarFallback>{p.user.first_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm">
                    <span>{p.user.first_name} {p.user.last_name}</span>
                    {p.isAdmin && (
                      <span className="text-xs text-orange-500 font-semibold">Admin</span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[10px] ${ 'text-green-500' }`}
                >
                  {'online'}
                </span>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="mt-3 flex justify-end">
          <DialogClose asChild>
            <Button className='cursor-pointer' variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
