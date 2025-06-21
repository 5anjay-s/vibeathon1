import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Globe, Send, User } from 'lucide-react';
import { useState } from 'react';
import { SmsDialog } from './sms-dialog';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
};

export default function ChatMessage({ role, content, isLoading = false }: ChatMessageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        !isAssistant && 'justify-end'
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Globe className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xl rounded-lg p-3 text-sm shadow-sm relative group',
          isAssistant
            ? 'bg-card text-card-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2 p-1">
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{content}</p>
            {isAssistant && content && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-muted"
                  onClick={() => setDialogOpen(true)}
                >
                  <Send className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Send via SMS</span>
                </Button>
                <SmsDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  message={content}
                />
              </>
            )}
          </>
        )}
      </div>
      {!isAssistant && (
         <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
