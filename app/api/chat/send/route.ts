import { connectDb } from '@/lib/mongoConnect';
import Chat from '@/models/chatSchema';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { estimateTokens, calculateCarbonEmissions } from '@/lib/tokenCounter';

export const dynamic = 'force-dynamic';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
  } catch {
    return null;
  }
}

function getToken(req: NextRequest) {
  const cookieToken = req.cookies.get('authToken')?.value;
  if (cookieToken) return cookieToken;
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), { status: 500 });

  const { message, chatId } = await req.json();
  if (!message) return new Response(JSON.stringify({ error: 'Message required' }), { status: 400 });

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: "You are Asky, a professional and helpful AI assistant. Provide clear, concise, and thoughtful responses. Format your response using markdown with proper syntax for headers (#, ##, ###), bold (**text**), italic (*text*), code blocks (```), lists (- or *), and tables (| header | header |). Be direct and keep responses concise.",
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    }),
  });

  if (!groqRes.ok) {
    const err = await groqRes.json();
    console.error('Groq API error:', err);
    return new Response(JSON.stringify({ error: `Groq API error: ${groqRes.status}` }), { status: 500 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        await connectDb();
        let chat;
        if (chatId) {
          chat = await Chat.findById(chatId);
          if (!chat || chat.userId.toString() !== decoded.userId) {
            controller.close();
            return;
          }
        } else {
          chat = new Chat({
            userId: decoded.userId,
            title: message.substring(0, 50),
            msgs: [],
          });
        }

        chat.msgs.push({ role: 'user', content: message, timestamp: new Date() });
        chat.msgs.push({ role: 'assistant', content: fullContent, timestamp: new Date() });
        chat.updatedAt = new Date();
        await chat.save();

        const inputTokens = estimateTokens(message);
        const outputTokens = estimateTokens(fullContent);
        const totalTokens = inputTokens + outputTokens;
        const carbonEmissions = calculateCarbonEmissions(totalTokens);

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          done: true,
          chatId: chat._id,
          tokens: { input: inputTokens, output: outputTokens, total: totalTokens },
          carbon: {
            kg: carbonEmissions,
            formatted: carbonEmissions < 0.000001
              ? `${(carbonEmissions * 1000000).toFixed(2)} ug`
              : `${carbonEmissions.toFixed(6)} kg`,
          },
        })}\n\n`));

        controller.close();
      } catch (err) {
        console.error('Stream error:', err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
