import { cn } from '@/lib/utils';

export type Message = {
  id: number;
  text: string;
  sender: string;
  time: string;
  name?: string;
  attachments?: string[];
};

export function MessageItem({
  text,
  sender,
  time,
  attachments,
}: Readonly<Message>) {
  const isMe = sender === 'me';

  return (
    <div className={cn('flex w-full', isMe ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm transition-all space-y-1',
          isMe
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-background border border-border rounded-bl-none'
        )}>
        <p>{text}</p>

        {/* Attachments */}
        {attachments && attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {attachments.map((url, i) => (
              <img
                key={i}
                src={url}
                className="w-20 h-20 object-cover rounded-lg border border-border"
                alt="attachment"
              />
            ))}
          </div>
        )}

        <span className="block text-[10px] text-muted-foreground mt-1 text-right">
          {time}
        </span>
      </div>
    </div>
  );
}
