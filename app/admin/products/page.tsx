"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface User {
  email: string;
  role: 'admin' | 'user';
}

const ProductsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            const parsedUser: User = JSON.parse(storedUser);
            if (parsedUser.role !== 'admin') {
              router.push('/');
            } else {
              setUser(parsedUser);
            }
          } else {
            throw new Error(data.message || 'Invalid token');
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };
    verifyToken();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-8">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl font-light text-gray-900 mb-6">Quản Lý Sản Phẩm</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-gray-900 mb-4">Thêm Sản Phẩm</h2>
            <p className="text-gray-600 mb-4">Chức năng quản lý sản phẩm đang phát triển.</p>
            <button
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
              onClick={() => alert('Chức năng thêm sản phẩm đang phát triển')}
            >
              Thêm Sản Phẩm
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-xl font-light text-gray-900 mb-4">Danh Sách Sản Phẩm</h2>
            <p className="text-gray-600">Chưa có sản phẩm nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;