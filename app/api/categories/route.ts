
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { name, collection } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const categoriesCollection = db.collection('categories');

    const existingCategory = await categoriesCollection.findOne({ name, collection });
    if (existingCategory) {
      return NextResponse.json({ message: 'Category already exists in this collection' }, { status: 400 });
    }

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
    const db = await connectToDatabase();
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find().toArray();
    return NextResponse.json({ categories }, { status: 200 });
  } catch {
    console.error('Get categories error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id, name, collection } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ message: 'Category ID and name are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const categoriesCollection = db.collection('categories');

    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, collection, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category updated successfully' }, { status: 200 });
  } catch {
    console.error('Update category error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Category ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const categoriesCollection = db.collection('categories');

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch {
    console.error('Delete category error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
