import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Kết nối đến MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu người dùng vào MongoDB với role mặc định là 'user'
    const newUser = {
      email,
      password: hashedPassword,
      role: 'user', // Mặc định role là 'user'
      createdAt: new Date(),
    };
    await usersCollection.insertOne(newUser);

    // Tạo JWT
    const token = jwt.sign(
      { email, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Trả về token và thông tin người dùng
    return NextResponse.json(
      {
        token,
        user: {
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}