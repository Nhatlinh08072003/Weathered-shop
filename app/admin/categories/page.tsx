
//   "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import AdminSidebar from '@/components/AdminSidebar';

// interface User {
//   email: string;
//   role: 'admin' | 'user';
// }

// interface Category {
//   _id: string;
//   name: string;
//   collection: string;
//   createdAt: string;
// }

// interface Collection {
//   _id: string;
//   name: string;
// }

// const CategoriesPage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [categoryName, setCategoryName] = useState('');
//   const [selectedCollection, setSelectedCollection] = useState('');
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const categoriesResponse = await fetch('/api/categories', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const categoriesData = await categoriesResponse.json();
//         if (categoriesResponse.ok) {
//           setCategories(categoriesData.categories);
//         } else {
//           setError(categoriesData.message || 'Không thể tải danh mục');
//         }

//         const collectionsResponse = await fetch('/api/collections', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const collectionsData = await collectionsResponse.json();
//         if (collectionsResponse.ok) {
//           setCollections(collectionsData.collections);
//         } else {
//           setError(collectionsData.message || 'Không thể tải bộ sưu tập');
//         }
//       } catch (error) {
//         setError('Đã xảy ra lỗi khi tải dữ liệu');
//       }
//     };
//     if (user) {
//       fetchData();
//     }
//   }, [user]);

//   const handleAddCategory = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!categoryName.trim()) {
//       setError('Tên danh mục không được để trống');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Vui lòng đăng nhập lại');
//       return;
//     }

//     try {
//       const response = await fetch('/api/categories', {
//         method: editingCategory ? 'PUT' : 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(
//           editingCategory
//             ? { id: editingCategory._id, name: categoryName.trim(), collection: selectedCollection }
//             : { name: categoryName.trim(), collection: selectedCollection }
//         ),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         if (editingCategory) {
//           setSuccess('Cập nhật danh mục thành công');
//           setCategories(categories.map(cat => 
//             cat._id === editingCategory._id ? { ...cat, name: categoryName, collection: selectedCollection } : cat
//           ));
//           setEditingCategory(null);
//         } else {
//           setSuccess('Thêm danh mục thành công');
//           setCategories([...categories, data.category]);
//         }
//         setCategoryName('');
//         setSelectedCollection('');
//       } else {
//         setError(data.message || 'Không thể xử lý danh mục');
//       }
//     } catch (error) {
//       setError('Đã xảy ra lỗi khi xử lý danh mục');
//     }
//   };

//   const handleEditCategory = (category: Category) => {
//     setEditingCategory(category);
//     setCategoryName(category.name);
//     setSelectedCollection(category.collection);
//   };

//   const handleDeleteCategory = async (id: string) => {
//     if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Vui lòng đăng nhập lại');
//       return;
//     }

//     try {
//       const response = await fetch('/api/categories', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setSuccess('Xóa danh mục thành công');
//         setCategories(categories.filter(cat => cat._id !== id));
//       } else {
//         setError(data.message || 'Không thể xóa danh mục');
//       }
//     } catch (error) {
//       setError('Đã xảy ra lỗi khi xóa danh mục');
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
//           <h1 className="text-3xl font-light text-black mb-6">Quản Lý Danh Mục</h1>
//           <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
//             <h2 className="text-xl font-light text-black mb-4">
//               {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}
//             </h2>
//             <form onSubmit={handleAddCategory} className="space-y-4">
//               <div>
//                 <label className="block text-sm text-black mb-2">Tên Danh Mục</label>
//                 <input
//                   type="text"
//                   value={categoryName}
//                   onChange={(e) => setCategoryName(e.target.value)}
//                   className="w-full border text-black border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-black transition-colors duration-300"
//                   placeholder="Nhập tên danh mục"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-black mb-2">Bộ Sưu Tập</label>
//                 <select
//                   value={selectedCollection}
//                   onChange={(e) => setSelectedCollection(e.target.value)}
//                   className="w-full border text-black border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-black transition-colors duration-300"
//                 >
//                   <option value="">Chọn bộ sưu tập</option>
//                   {collections.map((collection) => (
//                     <option key={collection._id} value={collection.name}>
//                       {collection.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               {success && <p className="text-green-500 text-sm">{success}</p>}
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
//                 >
//                   {editingCategory ? 'Cập nhật' : 'Thêm'} Danh Mục
//                 </button>
//                 {editingCategory && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditingCategory(null);
//                       setCategoryName('');
//                       setSelectedCollection('');
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
//             <h2 className="text-xl font-light text-black mb-4">Danh Sách Danh Mục</h2>
//             {categories.length === 0 ? (
//               <p className="text-black">Chưa có danh mục nào.</p>
//             ) : (
//               <ul className="space-y-2">
//                 {categories.map((category) => (
//                   <li
//                     key={category._id}
//                     className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
//                   >
//                     <div>
//                       <span className="font-medium text-black">{category.name}</span>
//                       <span className="text-sm text-black ml-2">
//                         ({category.collection})
//                       </span>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEditCategory(category)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         Sửa
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCategory(category._id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Xóa
//                       </button>
//                       <span className="text-sm text-black">
//                         {new Date(category.createdAt).toLocaleDateString()}
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

// export default CategoriesPage;
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface User {
  email: string;
  role: 'admin' | 'user';
}

interface Category {
  _id: string;
  name: string;
  collection: string;
  createdAt: string;
}

interface Collection {
  _id: string;
  name: string;
}

const CategoriesPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const categoriesResponse = await fetch('/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoriesData = await categoriesResponse.json();
        if (categoriesResponse.ok) {
          setCategories(categoriesData.categories);
        } else {
          setError(categoriesData.message || 'Không thể tải danh mục');
        }

        const collectionsResponse = await fetch('/api/collections', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const collectionsData = await collectionsResponse.json();
        if (collectionsResponse.ok) {
          setCollections(collectionsData.collections);
        } else {
          setError(collectionsData.message || 'Không thể tải bộ sưu tập');
        }
      } catch {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!categoryName.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập lại');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          editingCategory
            ? { id: editingCategory._id, name: categoryName.trim(), collection: selectedCollection }
            : { name: categoryName.trim(), collection: selectedCollection }
        ),
      });

      const data = await response.json();
      if (response.ok) {
        if (editingCategory) {
          setSuccess('Cập nhật danh mục thành công');
          setCategories(categories.map(cat => 
            cat._id === editingCategory._id ? { ...cat, name: categoryName, collection: selectedCollection } : cat
          ));
          setEditingCategory(null);
        } else {
          setSuccess('Thêm danh mục thành công');
          setCategories([...categories, data.category]);
        }
        setCategoryName('');
        setSelectedCollection('');
      } else {
        setError(data.message || 'Không thể xử lý danh mục');
      }
    } catch {
      setError('Đã xảy ra lỗi khi xử lý danh mục');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedCollection(category.collection);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập lại');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Xóa danh mục thành công');
        setCategories(categories.filter(cat => cat._id !== id));
      } else {
        setError(data.message || 'Không thể xóa danh mục');
      }
    } catch {
      setError('Đã xảy ra lỗi khi xóa danh mục');
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
          <h1 className="text-3xl font-light text-black mb-6">Quản Lý Danh Mục</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-light text-black mb-4">
              {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm text-black mb-2">Tên Danh Mục</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full border text-black border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-black transition-colors duration-300"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm text-black mb-2">Bộ Sưu Tập</label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full border text-black border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-black transition-colors duration-300"
                >
                  <option value="">Chọn bộ sưu tập</option>
                  {collections.map((collection) => (
                    <option key={collection._id} value={collection.name}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  {editingCategory ? 'Cập nhật' : 'Thêm'} Danh Mục
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryName('');
                      setSelectedCollection('');
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
            <h2 className="text-xl font-light text-black mb-4">Danh Sách Danh Mục</h2>
            {categories.length === 0 ? (
              <p className="text-black">Chưa có danh mục nào.</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                  >
                    <div>
                      <span className="font-medium text-black">{category.name}</span>
                      <span className="text-sm text-black ml-2">
                        ({category.collection})
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                      <span className="text-sm text-black">
                        {new Date(category.createdAt).toLocaleDateString()}
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

export default CategoriesPage;