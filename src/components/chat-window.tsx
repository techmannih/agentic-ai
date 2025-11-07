'use client';

import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { ArrowDown, ArrowUpIcon, LoaderCircle } from 'lucide-react';

import { ChatMessageBubble, type ChatMessage } from '@/components/chat-message-bubble';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

function ChatMessages(props: { messages: ChatMessage[]; emptyStateComponent: React.ReactNode; aiEmoji?: string }) {
  if (props.messages.length === 0) {
    return <div>{props.emptyStateComponent}</div>;
  }

  return (
    <div className="flex flex-col max-w-[768px] mx-auto pb-12 w-full">
      {props.messages.map(message => (
        <ChatMessageBubble key={message.id} message={message} aiEmoji={props.aiEmoji} />
      ))}
    </div>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button variant="outline" className={props.className} onClick={() => scrollToBottom()}>
      <ArrowDown className="w-4 h-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

function ChatInput(props: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      onSubmit={e => {
        e.stopPropagation();
        e.preventDefault();
        props.onSubmit(e);
      }}
      className={cn('flex w-full flex-col', props.className)}
    >
      <div className="border border-input bg-background rounded-lg flex flex-col gap-2 max-w-[768px] w-full mx-auto">
        <input
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          className="border-none outline-none bg-transparent p-4"
          autoFocus
        />

        <div className="flex justify-between ml-4 mr-2 mb-2">
          <div className="flex gap-3">{props.children}</div>

          <Button className="rounded-full p-1.5 h-fit border dark:border-zinc-600" type="submit" disabled={props.loading}>
            {props.loading ? <LoaderCircle className="animate-spin" /> : <ArrowUpIcon size={14} />}
          </Button>
        </div>
      </div>
    </form>
  );
}

function StickyToBottomContent(props: {
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const context = useStickToBottomContext();

  return (
    <div
      ref={context.scrollRef}
      style={{ width: '100%', height: '100%' }}
      className={cn('grid grid-rows-[1fr,auto]', props.className)}
    >
      <div ref={context.contentRef} className={props.contentClassName}>
        {props.content}
      </div>

      {props.footer}
    </div>
  );
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

function useChat(endpoint: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const conversationForApi = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...conversationForApi, { role: 'user', content: trimmed }] }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response.');
      }

      const data = (await response.json()) as { reply: string };
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: data.reply,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Something went wrong while generating a response.');
      setMessages(prev => prev.filter(message => message.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, isLoading, sendMessage };
}

export function ChatWindow(props: {
  endpoint: string;
  emptyStateComponent: React.ReactNode;
  placeholder?: string;
  emoji?: string;
}) {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChat(props.endpoint);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;

    const currentInput = input;
    setInput('');
    await sendMessage(currentInput);
  }

  return (
    <StickToBottom>
      <StickyToBottomContent
        className="absolute inset-0"
        contentClassName="py-8 px-2"
        content={
          <ChatMessages
            messages={messages}
            aiEmoji={props.emoji}
            emptyStateComponent={props.emptyStateComponent}
          />
        }
        footer={
          <div className="sticky bottom-8 px-2">
            <ScrollToBottom className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4" />
            <ChatInput
              value={input}
              onChange={e => setInput(e.target.value)}
              onSubmit={handleSubmit}
              loading={isLoading}
              placeholder={props.placeholder ?? 'What can I help you with?'}
            />
          </div>
        }
      />
    </StickToBottom>
  );
}
