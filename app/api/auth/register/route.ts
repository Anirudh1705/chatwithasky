import { connectDb } from '@/lib/mongoConnect';
import User from '@/models/userSchema';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Only Gmail addresses are allowed' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const newUser = new User({ email, password, name });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      { message: 'User created successfully', token, userId: newUser._id, name: newUser.name },
      { status: 201 }
    );

    response.cookies.set('authToken', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
