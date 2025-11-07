import { NextResponse } from 'next/server';

import { runAgent, type ConversationMessage } from '@/lib/agent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = (body?.messages ?? []) as ConversationMessage[];

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const reply = await runAgent(messages);
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Failed to generate a response.' }, { status: 500 });
  }
}
