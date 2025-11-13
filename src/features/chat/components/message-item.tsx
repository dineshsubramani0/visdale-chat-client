import { cn } from '@/lib/utils';

export type MessageItemProps = {
  id: string;
  text: string;
  sender: string;
  time: string;
  name?: string;
  attachments: string[];
  className?: string;
};

export function MessageItem({
  text,
  sender,
  time,
  name,
  attachments,
  className = '',
}: Readonly<MessageItemProps>) {
  const isMe = sender === 'me';

  return (
    <div className={cn('flex w-full min-w-0', isMe ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-full sm:max-w-[75%] px-4 py-3 text-sm shadow-md transition-all space-y-1 break-words',
          isMe
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-2xl rounded-bl-none',
          className
        )}
      >
        {name && <span className="font-semibold text-xs">{name}</span>}
        <p className="mt-1 break-words">{text}</p>

        {attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {attachments.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="attachment"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-border"
              />
            ))}
          </div>
        )}

        <span className="block text-[10px] text-gray-400 mt-1 text-right">{time}</span>
      </div>
    </div>
  );
}
