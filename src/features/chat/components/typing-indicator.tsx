export function TypingIndicator({ name }: Readonly<{ name: string }>) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pl-2">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-0" />
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-150" />
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-300" />
      </div>
      {name} is typing...
    </div>
  );
}
