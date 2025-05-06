import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dv2gqzcis',
  api_key: process.env.CLOUDINARY_API_KEY || '925835922562689',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'We4NsPzepwMxj_lI3ozNIoPRqCE',
});

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        console.error('Unauthorized: Admin access required');
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    console.log('FormData entries:', Array.from(formData.entries()).map(([key]) => key));

    const name = formData.get('name')?.toString();
    const size = formData.get('size')?.toString();
    const description = formData.get('description')?.toString();
    const category = formData.get('category')?.toString();
    const collection = formData.get('collection')?.toString();
    const price = formData.get('price')?.toString();
    const discount = formData.get('discount')?.toString();

    if (!name || !size || !description || !category || !price) {
      console.error('Missing required fields:', { name, size, description, category, price });
      return NextResponse.json({ message: 'Name, size, description, category, and price are required' }, { status: 400 });
    }

    // Handle multiple image files
    const images = formData.getAll('images').filter((item): item is File => item instanceof File);
    if (images.length === 0) {
      console.error('No images provided');
      return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });
    }

    // Create temporary directory for file storage
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'products-'));
    const uploadedUrls: string[] = [];

    try {
      // Upload images to Cloudinary
      for (const image of images) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const tempFilePath = path.join(tempDir, image.name);
        await fs.writeFile(tempFilePath, buffer);

        try {
          const result = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'products',
            resource_type: 'image',
          });
          if (!result.secure_url) {
            console.error('Cloudinary upload failed for image:', image.name);
            return NextResponse.json({ message: 'Failed to upload image to Cloudinary' }, { status: 500 });
          }
          uploadedUrls.push(result.secure_url);
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          return NextResponse.json({ message: 'Failed to upload image to Cloudinary' }, { status: 500 });
        }
      }
    } finally {
      // Clean up temporary files
      await fs.rm(tempDir, { recursive: true, force: true });
    }

    const db = await connectToDatabase();
    const productsCollection = db.collection('products');

    const existingProduct = await productsCollection.findOne({ name, category });
    if (existingProduct) {
      console.error('Product already exists:', { name, category });
      return NextResponse.json({ message: 'Product already exists in this category' }, { status: 400 });
    }

    const newProduct = {
      name,
      size,
      description,
      category,
      collection: collection || 'Không có bộ sưu tập',
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : null,
      images: uploadedUrls,
      createdAt: new Date(),
    };
    console.log('Inserting new product:', newProduct);
    await productsCollection.insertOne(newProduct);

    return NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Add product error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find().toArray();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        console.error('Unauthorized: Admin access required');
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    console.log('FormData entries:', Array.from(formData.entries()).map(([key]) => key));

    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    const size = formData.get('size')?.toString();
    const description = formData.get('description')?.toString();
    const category = formData.get('category')?.toString();
    const collection = formData.get('collection')?.toString();
    const price = formData.get('price')?.toString();
    const discount = formData.get('discount')?.toString();

    if (!id || !name || !size || !description || !category || !price) {
      console.error('Missing required fields:', { id, name, size, description, category, price });
      return NextResponse.json({ message: 'ID, name, size, description, category, and price are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const productsCollection = db.collection('products');

    const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!existingProduct) {
      console.error('Product not found:', id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const uploadedUrls = existingProduct.images || [];
    const images = formData.getAll('images').filter((item): item is File => item instanceof File);
    if (images.length > 0) {
      // Create temporary directory for file storage
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'products-'));
      try {
        // Upload new images to Cloudinary
        for (const image of images) {
          const arrayBuffer = await image.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const tempFilePath = path.join(tempDir, image.name);
          await fs.writeFile(tempFilePath, buffer);

          try {
            const result = await cloudinary.uploader.upload(tempFilePath, {
              folder: 'products',
              resource_type: 'image',
            });
            if (!result.secure_url) {
              console.error('Cloudinary upload failed for image:', image.name);
              return NextResponse.json({ message: 'Failed to upload image to Cloudinary' }, { status: 500 });
            }
            uploadedUrls.push(result.secure_url);
          } catch (error) {
            console.error('Cloudinary upload error:', error);
            return NextResponse.json({ message: 'Failed to upload image to Cloudinary' }, { status: 500 });
          }
        }
      } finally {
        // Clean up temporary files
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }

    const updatedProduct = {
      name,
      size,
      description,
      category,
      collection: collection || 'Không có bộ sưu tập',
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : null,
      images: uploadedUrls,
      updatedAt: new Date(),
    };
    console.log('Updating product:', updatedProduct);

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    );

    if (result.modifiedCount === 0) {
      console.error('Product not found or no changes made:', id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product: { ...existingProduct, ...updatedProduct } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        console.error('Unauthorized: Admin access required');
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      console.error('Product ID is required');
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const productsCollection = db.collection('products');

    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!product) {
      console.error('Product not found:', id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        const publicId = image.split('/').pop()?.split('.')[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (error) {
            console.error('Cloudinary delete error:', error);
          }
        }
      }
    }

    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.error('Product not found:', id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}