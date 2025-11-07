import { cn } from '@/utils/cn';
import { MemoizedMarkdown } from './memoized-markdown';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function ChatMessageBubble(props: { message: ChatMessage; aiEmoji?: string }) {
  const isUser = props.message.role === 'user';

  if (!props.message.content.trim()) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-[24px] max-w-[80%] mb-8 flex',
        isUser ? 'bg-secondary text-secondary-foreground px-4 py-2' : null,
        isUser ? 'ml-auto' : 'mr-auto'
      )}
    >
      {!isUser && (
        <div className="mr-4 mt-1 border bg-secondary -mt-2 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
          {props.aiEmoji}
        </div>
      )}
      <div className="chat-message-bubble whitespace-pre-wrap flex flex-col prose dark:prose-invert max-w-none">
        <MemoizedMarkdown content={props.message.content} id={props.message.id} />
      </div>
    </div>
  );
}
