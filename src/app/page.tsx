import { ChatWindow } from '@/components/chat-window';
import { GuideInfoBox } from '@/components/guide/GuideInfoBox';

const InfoCard = (
  <GuideInfoBox>
    <ul>
      <li className="text-l">
        🤝
        <span className="ml-2">
          This starter keeps only the essentials so you can focus on experimenting with{' '}
          <a className="text-blue-500" href="https://langchain-ai.github.io/langgraphjs/" target="_blank" rel="noreferrer">
            LangGraph.js
          </a>
          {' '}and{' '}
          <a className="text-blue-500" href="https://js.langchain.com/docs/introduction/" target="_blank" rel="noreferrer">
            LangChain.js
          </a>
          {' '}inside a{' '}
          <a className="text-blue-500" href="https://nextjs.org/" target="_blank" rel="noreferrer">
            Next.js
          </a>
          {' '}app.
        </span>
      </li>
      <li className="hidden text-l md:block">
        💻
        <span className="ml-2">
          The chat agent lives in <code>src/lib/agent.ts</code> and powers the{' '}
          <code>POST /api/chat</code> endpoint.
        </span>
      </li>
      <li className="hidden text-l md:block">
        🎨
        <span className="ml-2">
          The UI is a single page built from <code>src/app/page.tsx</code> and{' '}
          <code>src/components/chat-window.tsx</code>.
        </span>
      </li>
      <li className="text-l">
        👇
        <span className="ml-2">Try asking something like <code>What can you help me with?</code>.</span>
      </li>
    </ul>
  </GuideInfoBox>
);

export default function Home() {
  return (
    <ChatWindow
      endpoint="/api/chat"
      emoji="🤖"
      placeholder="Hello! I'm your friendly AI assistant. How can I help you today?"
      emptyStateComponent={InfoCard}
    />
  );
}
