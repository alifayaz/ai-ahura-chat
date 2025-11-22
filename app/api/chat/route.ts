import { NextRequest } from 'next/server';
import constants from '@/app/constant';

interface MessageType {
  id: string;
  role: string;
  parts: PartsType[];
}

interface PartsType {
  type: string;
  text: string;
}
export async function POST(request: NextRequest) {
  const URL = process.env.NEXT_PUBLIC_BASE_URL || '';
  try {
    const { messages } = await request.json();

    const openAIMessages = messages.map((message: MessageType) => {
      return {
        role: message.role,
        content: message.parts?.map((p: PartsType) => p.text).join('') ?? '',
      };
    });

    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_MODEL,
        messages: openAIMessages,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(constants.errorAI, data);
      return Response.json({ error: data.message || constants.errorAI }, { status: 500 });
    }

    const content = data?.choices?.[0]?.message?.content ?? constants.not_response;

    const assistantMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      parts: [{ type: 'text', text: content }],
      timestamp: new Date().toISOString(),
    };

    return Response.json({
      messages: [...messages, assistantMessage],
    });
  } catch (error) {
    console.error(constants.errorAI, error);
    return Response.json({ error: constants.server_error }, { status: 500 });
  }
}
