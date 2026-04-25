import { connectDb } from '@/lib/mongoConnect';
import Chat from '@/models/chatSchema';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDb();

    const chats = await Chat.find({ userId: decoded.userId })
      .select('_id title createdAt')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
