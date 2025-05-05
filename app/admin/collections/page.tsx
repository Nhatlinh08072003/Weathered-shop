"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface User {
  email: string;
  role: 'admin' | 'user';
}

interface Collection {
  _id: string;
  name: string;
  createdAt: string;
}

const CollectionsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionName, setCollectionName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Xác minh token
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

  // Lấy danh sách bộ sưu tập
  useEffect(() => {
    const fetchCollections = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/collections', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setCollections(data.collections);
        } else {
          console.error('Failed to fetch collections:', data.message);
          setError(data.message || 'Không thể tải bộ sưu tập');
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
        setError('Đã xảy ra lỗi khi tải bộ sưu tập');
      }
    };
    if (user) {
      fetchCollections();
    }
  }, [user]);

  // Xử lý thêm bộ sưu tập
  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!collectionName.trim()) {
      setError('Tên bộ sưu tập không được để trống');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập lại');
      return;
    }

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: collectionName.trim() }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Thêm bộ sưu tập thành công');
        setCollectionName('');
        setCollections([...collections, data.collection]);
      } else {
        setError(data.message || 'Không thể thêm bộ sưu tập');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi thêm bộ sưu tập');
      console.error('Add collection error:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen mt-[200px] bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-8">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl font-light text-gray-900 mb-6">Quản Lý Bộ Sưu Tập</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-light text-gray-900 mb-4">Thêm Bộ Sưu Tập</h2>
            <form onSubmit={handleAddCollection} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Tên Bộ Sưu Tập</label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300"
                  placeholder="Nhập tên bộ sưu tập"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <button
                type="submit"
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
              >
                Thêm Bộ Sưu Tập
              </button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-gray-900 mb-4">Danh Sách Bộ Sưu Tập</h2>
            {collections.length === 0 ? (
              <p className="text-gray-600">Chưa có bộ sưu tập nào.</p>
            ) : (
              <ul className="space-y-2">
                {collections.map((collection) => (
                  <li
                    key={collection._id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                  >
                    <span>{collection.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;