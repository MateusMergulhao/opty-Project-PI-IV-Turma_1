import { User, Headset } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  type: "client" | "supervisor" | "system";
  message: string;
  time: string;
  senderName?: string;
}

const ChatMessage = ({ type, message, time, senderName }: ChatMessageProps) => {
  if (type === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="text-xs text-muted-foreground italic bg-muted px-4 py-2 rounded-full">
          {message}
        </div>
      </div>
    );
  }

  const isClient = type === "client";

  return (
    <div className={cn("flex gap-3 mb-4 animate-fade-in", isClient ? "flex-row-reverse" : "")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md",
          isClient ? "bg-primary" : "bg-secondary"
        )}
      >
        {isClient ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Headset className="h-5 w-5 text-secondary-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col max-w-[70%] min-w-0", isClient ? "items-end" : "items-start")}>
        {/* Sender Name */}
        {senderName && (
          <span className="text-xs font-medium text-muted-foreground mb-1">{senderName}</span>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm overflow-hidden",
            isClient
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          )}
          style={{ maxWidth: '100%' }}
        >
          <p className="text-sm leading-relaxed" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{message}</p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">{time}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
