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
    <div className={cn('flex w-full', isMe ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] px-4 py-3 text-sm shadow-md transition-all space-y-1 wrap-break-word',
          isMe
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-none' // me messages
            : 'bg-gray-200 text-gray-900 rounded-2xl rounded-bl-none', // other messages
          className
        )}
      >
        {name && <span className="font-semibold text-xs">{name}</span>}
        <p className="mt-1">{text}</p>
        {attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {attachments.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="attachment"
                className="w-24 h-24 object-cover rounded-lg border border-border"
              />
            ))}
          </div>
        )}
        <span className="block text-[10px] text-gray-400 mt-1 text-right">
          {time}
        </span>
      </div>
    </div>
  );
}
