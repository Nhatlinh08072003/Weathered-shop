"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface User {
  email: string;
  role: 'admin' | 'user';
}

const AdminDashboard = () => {
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
    <div className="min-h-screen mt-[200px] bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-8">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl font-light text-gray-900 mb-6">Tổng Quan Quản Trị</h1>
          <p className="text-gray-600 mb-8">Chào {user.email}, đây là trang tổng quan.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-light text-gray-900 mb-4">Thống Kê</h2>
              <p className="text-gray-600">Xem thông tin tổng quan về cửa hàng.</p>
              <button
                className="mt-4 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
                onClick={() => alert('Chức năng đang phát triển')}
              >
                Xem Chi Tiết
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-light text-gray-900 mb-4">Hành Động Nhanh</h2>
              <p className="text-gray-600">Quản lý danh mục, sản phẩm hoặc đơn hàng.</p>
              <div className="mt-4 space-y-2">
                <a
                  href="/admin/categories"
                  className="block bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300 text-center"
                >
                  Quản Lý Danh Mục
                </a>
                <a
                  href="/admin/products"
                  className="block bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300 text-center"
                >
                  Quản Lý Sản Phẩm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;