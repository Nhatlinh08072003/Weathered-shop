import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-secret-key');
    return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}