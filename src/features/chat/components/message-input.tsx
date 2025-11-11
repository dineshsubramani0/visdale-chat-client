import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useState } from 'react';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleSend = () => {
    console.log({ message, files });
    setMessage('');
    setFiles([]);
  };

  return (
    <div className="flex flex-col gap-1 p-3 border-t bg-background/90 backdrop-blur-sm">
      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded">
              <span className="text-[10px] truncate">{file.name}</span>
              <button
                onClick={() =>
                  setFiles((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="text-red-500 text-xs">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <Paperclip className="w-5 h-5 text-muted-foreground hover:text-primary transition" />
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>

        <Button variant="ghost" size="icon">
          <Smile className="w-5 h-5 text-muted-foreground hover:text-primary transition" />
        </Button>

        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim() && files.length === 0}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
