
  // import { NextResponse } from 'next/server';
  // import jwt from 'jsonwebtoken';
  // import { connectToDatabase } from '@/lib/mongodb';
  // import { ObjectId } from 'mongodb';

  // export async function POST(request: Request) {
  //   try {
  //     const token = request.headers.get('authorization')?.replace('Bearer ', '');
  //     if (!token) {
  //       return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  //     }

  //     let decoded;
  //     try {
  //       decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  //       if (typeof decoded !== 'object' || decoded.role !== 'admin') {
  //         return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
  //       }
  //     } catch {
  //       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  //     }

  //     const { name } = await request.json();
  //     if (!name) {
  //       return NextResponse.json({ message: 'Collection name is required' }, { status: 400 });
  //     }

  //     const db = await connectToDatabase();
  //     const collectionsCollection = db.collection('collections');

  //     const existingCollection = await collectionsCollection.findOne({ name });
  //     if (existingCollection) {
  //       return NextResponse.json({ message: 'Collection already exists' }, { status: 400 });
  //     }

  //     const newCollection = {
  //       name,
  //       createdAt: new Date(),
  //     };
  //     await collectionsCollection.insertOne(newCollection);

  //     return NextResponse.json({ message: 'Collection added successfully', collection: newCollection }, { status: 201 });
  //   } catch {
  //     console.error('Add collection error');
  //     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  //   }
  // }

  // export async function GET() {
  //   try {
  //     const db = await connectToDatabase();
  //     const collectionsCollection = db.collection('collections');
  //     const collections = await collectionsCollection.find().toArray();
  //     return NextResponse.json({ collections }, { status: 200 });
  //   } catch {
  //     console.error('Get collections error');
  //     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  //   }
  // }

  // export async function PUT(request: Request) {
  //   try {
  //     const token = request.headers.get('authorization')?.replace('Bearer ', '');
  //     if (!token) {
  //       return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  //     }

  //     let decoded;
  //     try {
  //       decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  //       if (typeof decoded !== 'object' || decoded.role !== 'admin') {
  //         return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
  //       }
  //     } catch {
  //       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  //     }

  //     const { id, name } = await request.json();
  //     if (!id || !name) {
  //       return NextResponse.json({ message: 'Collection ID and name are required' }, { status: 400 });
  //     }

  //     const db = await connectToDatabase();
  //     const collectionsCollection = db.collection('collections');

  //     const result = await collectionsCollection.updateOne(
  //       { _id: new ObjectId(id) },
  //       { $set: { name, updatedAt: new Date() } }
  //     );

  //     if (result.modifiedCount === 0) {
  //       return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
  //     }

  //     return NextResponse.json({ message: 'Collection updated successfully' }, { status: 200 });
  //   } catch {
  //     console.error('Update collection error');
  //     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  //   }
  // }

  // export async function DELETE(request: Request) {
  //   try {
  //     const token = request.headers.get('authorization')?.replace('Bearer ', '');
  //     if (!token) {
  //       return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  //     }

  //     let decoded;
  //     try {
  //       decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  //       if (typeof decoded !== 'object' || decoded.role !== 'admin') {
  //         return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
  //       }
  //     } catch {
  //       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  //     }

  //     const { id } = await request.json();
  //     if (!id) {
  //       return NextResponse.json({ message: 'Collection ID is required' }, { status: 400 });
  //     }

  //     const db = await connectToDatabase();
  //     const collectionsCollection = db.collection('collections');
  //     const categoriesCollection = db.collection('categories');

  //     // Check if collection is used in categories
  //     const categoryCount = await categoriesCollection.countDocuments({ collection: id });
  //     if (categoryCount > 0) {
  //       return NextResponse.json({ message: 'Cannot delete collection with associated categories' }, { status: 400 });
  //     }

  //     const result = await collectionsCollection.deleteOne({ _id: new ObjectId(id) });

  //     if (result.deletedCount === 0) {
  //       return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
  //     }

  //     return NextResponse.json({ message: 'Collection deleted successfully' }, { status: 200 });
  //   } catch {
  //     console.error('Delete collection error');
  //     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  //   }
  // }
  import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collectionsCollection = db.collection('collections');
    const collections = await collectionsCollection.find().toArray();
    return NextResponse.json({ collections }, { status: 200 });
  } catch {
    console.error('Get collections error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

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

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Collection name is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collectionsCollection = db.collection('collections');

    const existingCollection = await collectionsCollection.findOne({ name });
    if (existingCollection) {
      return NextResponse.json({ message: 'Collection already exists' }, { status: 400 });
    }

    const newCollection = {
      name,
      createdAt: new Date(),
    };
    await collectionsCollection.insertOne(newCollection);

    return NextResponse.json({ message: 'Collection added successfully', collection: newCollection }, { status: 201 });
  } catch {
    console.error('Add collection error');
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

    const { id, name } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ message: 'Collection ID and name are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collectionsCollection = db.collection('collections');

    const result = await collectionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Collection updated successfully' }, { status: 200 });
  } catch {
    console.error('Update collection error');
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
      return NextResponse.json({ message: 'Collection ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collectionsCollection = db.collection('collections');
    const categoriesCollection = db.collection('categories');

    const categoryCount = await categoriesCollection.countDocuments({ collection: id });
    if (categoryCount > 0) {
      return NextResponse.json({ message: 'Cannot delete collection with associated categories' }, { status: 400 });
    }

    const result = await collectionsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Collection deleted successfully' }, { status: 200 });
  } catch {
    console.error('Delete collection error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}