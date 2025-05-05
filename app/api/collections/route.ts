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
//     const { name } = await request.json();
//     if (!name) {
//       return NextResponse.json({ message: 'Collection name is required' }, { status: 400 });
//     }

//     // Kết nối MongoDB
//     const db = await connectToDatabase();
//     const collectionsCollection = db.collection('collections');

//     // Kiểm tra bộ sưu tập đã tồn tại
//     const existingCollection = await collectionsCollection.findOne({ name });
//     if (existingCollection) {
//       return NextResponse.json({ message: 'Collection already exists' }, { status: 400 });
//     }

//     // Thêm bộ sưu tập mới
//     const newCollection = {
//       name,
//       createdAt: new Date(),
//     };
//     await collectionsCollection.insertOne(newCollection);

//     return NextResponse.json({ message: 'Collection added successfully', collection: newCollection }, { status: 201 });
//   } catch (error) {
//     console.error('Add collection error:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function GET(request: Request) {
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

//     // Kết nối MongoDB
//     const db = await connectToDatabase();
//     const collectionsCollection = db.collection('collections');

//     // Lấy danh sách bộ sưu tập
//     const collections = await collectionsCollection.find().toArray();

//     return NextResponse.json({ collections }, { status: 200 });
//   } catch (error) {
//     console.error('Get collections error:', error);
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
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Lấy dữ liệu từ body
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Collection name is required' }, { status: 400 });
    }

    // Kết nối MongoDB
    const db = await connectToDatabase();
    const collectionsCollection = db.collection('collections');

    // Kiểm tra bộ sưu tập đã tồn tại
    const existingCollection = await collectionsCollection.findOne({ name });
    if (existingCollection) {
      return NextResponse.json({ message: 'Collection already exists' }, { status: 400 });
    }

    // Thêm bộ sưu tập mới
    const newCollection = {
      name,
      createdAt: new Date(),
    };
    await collectionsCollection.insertOne(newCollection);

    return NextResponse.json({ message: 'Collection added successfully', collection: newCollection }, { status: 201 });
  } catch (error) {
    console.error('Add collection error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Kết nối MongoDB
    const db = await connectToDatabase();
    const collectionsCollection = db.collection('collections');

    // Lấy danh sách bộ sưu tập
    const collections = await collectionsCollection.find().toArray();

    return NextResponse.json({ collections }, { status: 200 });
  } catch (error) {
    console.error('Get collections error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}