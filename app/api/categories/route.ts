
// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { connectToDatabase } from '@/lib/mongodb';

// export async function POST(request: Request) {
//   try {
//     // Lấy token từ header Authorization
//     const token = request.headers.get('authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return NextResponse.json({ message: 'No token provided' }, { status: 401 });
//     }

//     // Xác minh token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//       if (typeof decoded !== 'object' || decoded.role !== 'admin') {
//         return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
//       }
//     } catch (error) {
//       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//     }

//     // Lấy dữ liệu từ body
//     const { name, collection } = await request.json();
//     if (!name) {
//       return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
//     }

//     // Kết nối MongoDB
//     const db = await connectToDatabase();
//     const categoriesCollection = db.collection('categories');

//     // Kiểm tra danh mục đã tồn tại
//     const existingCategory = await categoriesCollection.findOne({ name, collection });
//     if (existingCategory) {
//       return NextResponse.json({ message: 'Category already exists in this collection' }, { status: 400 });
//     }

//     // Thêm danh mục mới
//     const newCategory = {
//       name,
//       collection: collection || 'Không có bộ sưu tập',
//       createdAt: new Date(),
//     };
//     await categoriesCollection.insertOne(newCategory);

//     return NextResponse.json({ message: 'Category added successfully', category: newCategory }, { status: 201 });
//   } catch (error) {
//     console.error('Add category error:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     // Kết nối MongoDB
//     const db = await connectToDatabase();
//     const categoriesCollection = db.collection('categories');

//     // Lấy danh sách danh mục
//     const categories = await categoriesCollection.find().toArray();

//     return NextResponse.json({ categories }, { status: 200 });
//   } catch (error) {
//     console.error('Get categories error:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    // Lấy token từ header Authorization
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // Xác minh token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Lấy dữ liệu từ body
    const { name, collection } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    // Kết nối MongoDB
    const db = await connectToDatabase();
    const categoriesCollection = db.collection('categories');

    // Kiểm tra danh mục đã tồn tại
    const existingCategory = await categoriesCollection.findOne({ name, collection });
    if (existingCategory) {
      return NextResponse.json({ message: 'Category already exists in this collection' }, { status: 400 });
    }

    // Thêm danh mục mới
    const newCategory = {
      name,
      collection: collection || 'Không có bộ sưu tập',
      createdAt: new Date(),
    };
    await categoriesCollection.insertOne(newCategory);

    return NextResponse.json({ message: 'Category added successfully', category: newCategory }, { status: 201 });
  } catch {
    console.error('Add category error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Kết nối MongoDB
    const db = await connectToDatabase();
    const categoriesCollection = db.collection('categories');

    // Lấy danh sách danh mục
    const categories = await categoriesCollection.find().toArray();

    return NextResponse.json({ categories }, { status: 200 });
  } catch {
    console.error('Get categories error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}