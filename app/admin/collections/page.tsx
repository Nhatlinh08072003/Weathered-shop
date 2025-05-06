
// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import AdminSidebar from '@/components/AdminSidebar';

// interface User {
//   email: string;
//   role: 'admin' | 'user';
// }

// interface Collection {
//   _id: string;
//   name: string;
//   createdAt: string;
// }

// const CollectionsPage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [collectionName, setCollectionName] = useState('');
//   const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = localStorage.getItem('token');
//       const storedUser = localStorage.getItem('user');
//       if (token && storedUser) {
//         try {
//           const response = await fetch('/api/auth/verify', {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const data = await response.json();
//           if (response.ok) {
//             const parsedUser: User = JSON.parse(storedUser);
//             if (parsedUser.role !== 'admin') {
//               router.push('/');
//             } else {
//               setUser(parsedUser);
//             }
//           } else {
//             throw new Error(data.message || 'Invalid token');
//           }
//         } catch (err) {
//           console.error('Token verification failed:', err);
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           router.push('/');
//         }
//       } else {
//         router.push('/');
//       }
//     };
//     verifyToken();
//   }, [router]);

//   useEffect(() => {
//     const fetchCollections = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('/api/collections', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setCollections(data.collections);
//         } else {
//           setError(data.message || 'Không thể tải bộ sưu tập');
//         }
//       } catch (error) {
//         setError('Đã xảy ra lỗi khi tải bộ sưu tập');
//       }
//     };
//     if (user) {
//       fetchCollections();
//     }
//   }, [user]);

//   const handleAddCollection = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!collectionName.trim()) {
//       setError('Tên bộ sưu tập không được để trống');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Vui lòng đăng nhập lại');
//       return;
//     }

//     try {
//       const response = await fetch('/api/collections', {
//         method: editingCollection ? 'PUT' : 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(
//           editingCollection
//             ? { id: editingCollection._id, name: collectionName.trim() }
//             : { name: collectionName.trim() }
//         ),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         if (editingCollection) {
//           setSuccess('Cập nhật bộ sưu tập thành công');
//           setCollections(collections.map(col => 
//             col._id === editingCollection._id ? { ...col, name: collectionName } : col
//           ));
//           setEditingCollection(null);
//         } else {
//           setSuccess('Thêm bộ sưu tập thành công');
//           setCollections([...collections, data.collection]);
//         }
//         setCollectionName('');
//       } else {
//         setError(data.message || 'Không thể xử lý bộ sưu tập');
//       }
//     } catch (error) {
//       setError('Đã xảy ra lỗi khi xử lý bộ sưu tập');
//     }
//   };

//   const handleEditCollection = (collection: Collection) => {
//     setEditingCollection(collection);
//     setCollectionName(collection.name);
//   };

//   const handleDeleteCollection = async (id: string) => {
//     if (!confirm('Bạn có chắc muốn xóa bộ sưu tập này?')) return;

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Vui lòng đăng nhập lại');
//       return;
//     }

//     try {
//       const response = await fetch('/api/collections', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setSuccess('Xóa bộ sưu tập thành công');
//         setCollections(collections.filter(col => col._id !== id));
//       } else {
//         setError(data.message || 'Không thể xóa bộ sưu tập');
//       }
//     } catch (error) {
//       setError('Đã xảy ra lỗi khi xóa bộ sưu tập');
//     }
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen mt-[200px] bg-gray-100 flex">
//       <AdminSidebar />
//       <div className="flex-1 md:ml-64 p-8">
//         <div className="container max-w-6xl mx-auto">
//           <h1 className="text-3xl font-light text-black mb-6">Quản Lý Bộ Sưu Tập</h1>
//           <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
//             <h2 className="text-xl font-light text-black mb-4">
//               {editingCollection ? 'Sửa Bộ Sưu Tập' : 'Thêm Bộ Sưu Tập'}
//             </h2>
//             <form onSubmit={handleAddCollection} className="space-y-4">
//               <div>
//                 <label className="block text-sm text-black mb-2">Tên Bộ Sưu Tập</label>
//                 <input
//                   type="text"
//                   value={collectionName}
//                   onChange={(e) => setCollectionName(e.target.value)}
//                   className="w-full border text-black border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-black transition-colors duration-300"
//                   placeholder="Nhập tên bộ sưu tập"
//                 />
//               </div>
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               {success && <p className="text-green-500 text-sm">{success}</p>}
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
//                 >
//                   {editingCollection ? 'Cập nhật' : 'Thêm'} Bộ Sưu Tập
//                 </button>
//                 {editingCollection && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditingCollection(null);
//                       setCollectionName('');
//                     }}
//                     className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
//                   >
//                     Hủy
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-light text-black mb-4">Danh Sách Bộ Sưu Tập</h2>
//             {collections.length === 0 ? (
//               <p className="text-black">Chưa có bộ sưu tập nào.</p>
//             ) : (
//               <ul className="space-y-2">
//                 {collections.map((collection) => (
//                   <li
//                     key={collection._id}
//                     className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
//                   >
//                     <span className="text-black">{collection.name}</span>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEditCollection(collection)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         Sửa
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCollection(collection._id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Xóa
//                       </button>
//                       <span className="text-sm text-black">
//                         {new Date(collection.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollectionsPage;
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
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        } catch {
          console.error('Token verification failed');
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
          setError(data.message || 'Không thể tải bộ sưu tập');
        }
      } catch {
        setError('Đã xảy ra lỗi khi tải bộ sưu tập');
      }
    };
    if (user) {
      fetchCollections();
    }
  }, [user]);

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
        method: editingCollection ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          editingCollection
            ? { id: editingCollection._id, name: collectionName.trim() }
            : { name: collectionName.trim() }
        ),
      });

      const data = await response.json();
      if (response.ok) {
        if (editingCollection) {
          setSuccess('Cập nhật bộ sưu tập thành công');
          setCollections(collections.map(col => 
            col._id === editingCollection._id ? { ...col, name: collectionName } : col
          ));
          setEditingCollection(null);
        } else {
          setSuccess('Thêm bộ sưu tập thành công');
          setCollections([...collections, data.collection]);
        }
        setCollectionName('');
      } else {
        setError(data.message || 'Không thể xử lý bộ sưu tập');
      }
    } catch {
      setError('Đã xảy ra lỗi khi xử lý bộ sưu tập');
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setCollectionName(collection.name);
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bộ sưu tập này?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập lại');
      return;
    }

    try {
      const response = await fetch('/api/collections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Xóa bộ sưu tập thành công');
        setCollections(collections.filter(col => col._id !== id));
      } else {
        setError(data.message || 'Không thể xóa bộ sưu tập');
      }
    } catch {
      setError('Đã xảy ra lỗi khi xóa bộ sưu tập');
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
          <h1 className="text-3xl font-light text-black mb-6">Quản Lý Bộ Sưu Tập</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-light text-black mb-4">
              {editingCollection ? 'Sửa Bộ Sưu Tập' : 'Thêm Bộ Sưu Tập'}
            </h2>
            <form onSubmit={handleAddCollection} className="space-y-4">
              <div>
                <label className="block text-sm text-black mb-2">Tên Bộ Sưu Tập</label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full border text-black border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-black transition-colors duration-300"
                  placeholder="Nhập tên bộ sưu tập"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  {editingCollection ? 'Cập nhật' : 'Thêm'} Bộ Sưu Tập
                </button>
                {editingCollection && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollection(null);
                      setCollectionName('');
                    }}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-light text-black mb-4">Danh Sách Bộ Sưu Tập</h2>
            {collections.length === 0 ? (
              <p className="text-black">Chưa có bộ sưu tập nào.</p>
            ) : (
              <ul className="space-y-2">
                {collections.map((collection) => (
                  <li
                    key={collection._id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                  >
                    <span className="text-black">{collection.name}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCollection(collection)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCollection(collection._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                      <span className="text-sm text-black">
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
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