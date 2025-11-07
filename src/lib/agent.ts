import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const systemMessage = new SystemMessage(
  'You are a friendly AI assistant built for quick demos. Keep answers concise, helpful, and approachable.'
);

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.2,
});

function toMessage(message: ConversationMessage) {
  if (message.role === 'user') {
    return new HumanMessage(message.content);
  }

  return new AIMessage(message.content);
}

export async function runAgent(messages: ConversationMessage[]) {
  const history = messages.map(toMessage);
  const response = await model.invoke([systemMessage, ...history]);

  if (typeof response.content === 'string') {
    return response.content;
  }

  if (Array.isArray(response.content)) {
    return response.content
      .map(part => {
        if (typeof part === 'string') return part;
        if (typeof part === 'object' && 'text' in part) return part.text ?? '';
        return '';
      })
      .join('');
  }

  return '';
}
