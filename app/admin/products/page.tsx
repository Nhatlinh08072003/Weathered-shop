
// // export default ProductsPage;
// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import AdminSidebar from '@/components/AdminSidebar';

// interface User {
//   email: string;
//   role: 'admin' | 'user';
// }

// interface Product {
//   _id: string;
//   name: string;
//   size: string;
//   description: string;
//   category: string;
//   collection: string;
//   price: number;
//   discount: number | null;
//   images: string[];
//   createdAt: string;
// }

// interface Category {
//   _id: string;
//   name: string;
// }

// interface Collection {
//   _id: string;
//   name: string;
// }

// interface ImageFile {
//   file: File;
//   preview: string;
// }

// const ProductsPage = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [productName, setProductName] = useState('');
//   const [size, setSize] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedCollection, setSelectedCollection] = useState('');
//   const [price, setPrice] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
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
//         } catch {
//           console.error('Token verification failed');
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
//       setIsLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         // Fetch products
//         const productsResponse = await fetch('/api/products', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const productsData = await productsResponse.json();
//         if (productsResponse.ok) {
//           setProducts(productsData.products);
//         } else {
//           setError(productsData.message || 'Không thể tải sản phẩm');
//         }

//         // Fetch categories
//         const categoriesResponse = await fetch('/api/categories', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const categoriesData = await categoriesResponse.json();
//         if (categoriesResponse.ok) {
//           setCategories(categoriesData.categories);
//         } else {
//           setError(categoriesData.message || 'Không thể tải danh mục');
//         }

//         // Fetch collections
//         const collectionsResponse = await fetch('/api/collections', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const collectionsData = await collectionsResponse.json();
//         if (collectionsResponse.ok) {
//           setCollections(collectionsData.collections);
//         } else {
//           setError(collectionsData.message || 'Không thể tải bộ sưu tập');
//         }
//       } catch {
//         setError('Đã xảy ra lỗi khi tải dữ liệu');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (user) {
//       fetchData();
//     }
//   }, [user]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newFiles = Array.from(files).map(file => ({
//         file,
//         preview: URL.createObjectURL(file),
//       }));
//       setImageFiles([...imageFiles, ...newFiles]);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const updatedFiles = imageFiles.filter((_, i) => i !== index);
//     setImageFiles(updatedFiles);
//   };

//   const handleAddProduct = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!productName.trim() || !size.trim() || !description.trim() || !selectedCategory || !price.trim() || (!editingProduct && imageFiles.length === 0)) {
//       setError('Vui lòng điền đầy đủ các trường bắt buộc và thêm ít nhất một ảnh khi thêm sản phẩm');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Vui lòng đăng nhập lại');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('name', productName.trim());
//       formData.append('size', size.trim());
//       formData.append('description', description.trim());
//       formData.append('category', selectedCategory);
//       formData.append('collection', selectedCollection || '');
//       formData.append('price', price);
//       formData.append('discount', discount.trim() || '');
//       if (editingProduct) {
//         formData.append('id', editingProduct._id);
//       }
//       imageFiles.forEach((image) => {
//         formData.append('images', image.file);
//       });

//       const response = await fetch('/api/products', {
//         method: editingProduct ? 'PUT' : 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         if (editingProduct) {
//           setSuccess('Cập nhật sản phẩm thành công');
//           setProducts(
//             products.map(prod =>
//               prod._id === editingProduct._id
//                 ? {
//                     ...prod,
//                     name: productName,
//                     size,
//                     description,
//                     category: selectedCategory,
//                     collection: selectedCollection || 'Không có bộ sưu tập',
//                     price: parseFloat(price),
//                     discount: discount ? parseFloat(discount) : null,
//                     images: data.product.images,
//                   }
//                 : prod
//             )
//           );
//           setEditingProduct(null);
//         } else {
//           setSuccess('Thêm sản phẩm thành công');
//           setProducts([...products, data.product]);
//         }
//         resetForm();
//         setShowForm(false);
//       } else {
//         setError(data.message || 'Không thể xử lý sản phẩm');
//       }
//     } catch {
//       console.error('Frontend add product error');
//       setError('Đã xảy ra lỗi khi xử lý sản phẩm');
//     }
//   };

//   const handleEditProduct = (product: Product) => {
//     setEditingProduct(product);
//     setProductName(product.name);
//     setSize(product.size);
//     setDescription(product.description);
//     setSelectedCategory(product.category);
//     setSelectedCollection(product.collection === 'Không có bộ sưu tập' ? '' : product.collection);
//     setPrice(product.price.toString());
//     setDiscount(product.discount ? product.discount.toString() : '');
//     setImageFiles([]);
//     setShowForm(true);
//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const resetForm = () => {
//     setProductName('');
//     setSize('');
//     setDescription('');
//     setSelectedCategory('');
//     setSelectedCollection('');
//     setPrice('');
//     setDiscount('');
//     setImageFiles([]);
//     setEditingProduct(null);
//   };

//   const handleCancelEdit = () => {
//     resetForm();
//     setShowForm(false);
//   };

//   const handleDeleteProduct = async (id: string) => {
//     if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setError('Vui lòng đăng nhập lại');
//       return;
//     }

//     try {
//       const response = await fetch('/api/products', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setSuccess('Xóa sản phẩm thành công');
//         setProducts(products.filter(prod => prod._id !== id));
//       } else {
//         setError(data.message || 'Không thể xóa sản phẩm');
//       }
//     } catch {
//       setError('Đã xảy ra lỗi khi xóa sản phẩm');
//     }
//   };

//   // Format price to VND
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
//   };

//   // Truncate description
//   const truncateDescription = (text: string, maxLength: number) => {
//     if (text.length <= maxLength) return text;
//     return text.slice(0, maxLength) + '...';
//   };

//   // Calculate discount percentage
//   const calculateDiscountPercentage = (price: number, discount: number | null) => {
//     if (!discount || discount >= price) return null;
//     return Math.round(((price - discount) / price) * 100);
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-50">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen mt-[200px] bg-gray-50 flex">
//       <AdminSidebar />
//       <div className="flex-1 md:ml-64 p-6">
//         <div className="container max-w-7xl mx-auto mt-16">
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
//             <button
//               onClick={() => setShowForm(!showForm)}
//               className={`px-4 py-2 rounded-md ${showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors duration-200 flex items-center space-x-2`}
//             >
//               <span>{showForm ? 'Ẩn Form' : 'Thêm Sản Phẩm Mới'}</span>
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
//                 className={`transition-transform duration-200 ${showForm ? 'rotate-180' : 'rotate-0'}`} 
//                 viewBox="0 0 16 16">
//                 <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
//               </svg>
//             </button>
//           </div>

//           {/* Error/Success Messages */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-fadeIn">
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p>{error}</p>
//               </div>
//             </div>
//           )}
          
//           {success && (
//             <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md animate-fadeIn">
//               <div className="flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 <p>{success}</p>
//               </div>
//             </div>
//           )}

//           {/* Product Form */}
//           {showForm && (
//             <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-slideDown">
//               <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//                 {editingProduct ? (
//                   <>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                     </svg>
//                     Chỉnh Sửa Sản Phẩm
//                   </>
//                 ) : (
//                   <>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     Thêm Sản Phẩm Mới
//                   </>
//                 )}
//               </h2>
//               <form onSubmit={handleAddProduct} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sản Phẩm <span className="text-red-500">*</span></label>
//                     <input
//                       type="text"
//                       value={productName}
//                       onChange={(e) => setProductName(e.target.value)}
//                       className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                       placeholder="Nhập tên sản phẩm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Kích Thước <span className="text-red-500">*</span></label>
//                     <input
//                       type="text"
//                       value={size}
//                       onChange={(e) => setSize(e.target.value)}
//                       className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                       placeholder="Nhập kích thước (VD: S, M, L)"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả <span className="text-red-500">*</span></label>
//                   <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Nhập mô tả sản phẩm"
//                     rows={4}
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Danh Mục <span className="text-red-500">*</span></label>
//                     <select
//                       value={selectedCategory}
//                       onChange={(e) => setSelectedCategory(e.target.value)}
//                       className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                     >
//                       <option value="" className="text-gray-500">Chọn danh mục</option>
//                       {categories.map((category) => (
//                         <option key={category._id} value={category.name}>
//                           {category.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Bộ Sưu Tập</label>
//                     <select
//                       value={selectedCollection}
//                       onChange={(e) => setSelectedCollection(e.target.value)}
//                       className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                     >
//                       <option value="" className="text-gray-500">Chọn bộ sưu tập (không bắt buộc)</option>
//                       {collections.map((collection) => (
//                         <option key={collection._id} value={collection.name}>
//                           {collection.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Giá <span className="text-red-500">*</span></label>
//                     <div className="mt-1 relative rounded-md shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <span className="text-gray-500 sm:text-sm">₫</span>
//                       </div>
//                       <input
//                         type="number"
//                         value={price}
//                         onChange={(e) => setPrice(e.target.value)}
//                         className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                         placeholder="Nhập giá sản phẩm"
//                         min="0"
//                         step="1000"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Giảm Giá</label>
//                     <div className="mt-1 relative rounded-md shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <span className="text-gray-500 sm:text-sm">₫</span>
//                       </div>
//                       <input
//                         type="number"
//                         value={discount}
//                         onChange={(e) => setDiscount(e.target.value)}
//                         className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                         placeholder="Nhập giá giảm (không bắt buộc)"
//                         min="0"
//                         step="1000"
//                       />
//                     </div>
//                     {price && discount && parseFloat(price) > 0 && parseFloat(discount) > 0 && (
//                       <p className="mt-1 text-sm text-gray-500">
//                         Giảm {calculateDiscountPercentage(parseFloat(price), parseFloat(discount))}%
//                       </p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Ảnh Sản Phẩm {!editingProduct && <span className="text-red-500">*</span>}
//                   </label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                     <div className="space-y-1 text-center">
//                       <svg
//                         className="mx-auto h-12 w-12 text-gray-400"
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                         aria-hidden="true"
//                       >
//                         <path
//                           d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                           strokeWidth={2}
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                       <div className="flex text-sm text-gray-600">
//                         <label
//                           htmlFor="file-upload"
//                           className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                         >
//                           <span>Tải ảnh lên</span>
//                           <input
//                             id="file-upload"
//                             name="file-upload"
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="sr-only"
//                           />
//                         </label>
//                         <p className="pl-1">hoặc kéo và thả</p>
//                       </div>
//                       <p className="text-xs text-gray-500">PNG, JPG, GIF lên đến 10MB</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 {imageFiles.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="text-sm font-medium text-gray-700 mb-3">Ảnh đã chọn</h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                       {imageFiles.map((image, index) => (
//                         <div key={index} className="relative group">
//                           <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
//                             <Image
//                               src={image.preview}
//                               alt={`Preview ${index}`}
//                               width={100}
//                               height={100}
//                               style={{ objectFit: 'cover' }}
//                               className="w-full h-full"
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveImage(index)}
//                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 {editingProduct && editingProduct.images.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="text-sm font-medium text-gray-700 mb-3">Ảnh hiện tại</h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                       {editingProduct.images.map((url, index) => (
//                         <div key={index} className="relative group">
//                           <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
//                             <Image
//                               src={url}
//                               alt={`Existing ${index}`}
//                               width={100}
//                               height={100}
//                               style={{ objectFit: 'cover' }}
//                               className="w-full h-full"
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <p className="mt-2 text-sm text-gray-500">Lưu ý: Thêm ảnh mới sẽ không xóa các ảnh hiện tại</p>
//                   </div>
//                 )}
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleCancelEdit}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                   >
//                     Hủy
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
          
//           {/* Products List */}
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//                 Danh Sách Sản Phẩm
//                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                   {products.length}
//                 </span>
//               </h2>
//             </div>
            
//             {isLoading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : products.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//                 <h3 className="text-lg font-medium text-gray-900">Chưa có sản phẩm nào</h3>
//                 <p className="mt-1 text-sm text-gray-500">Bắt đầu thêm sản phẩm mới vào cửa hàng của bạn.</p>
//                 <button
//                   onClick={() => setShowForm(true)}
//                   className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   Thêm sản phẩm
//                 </button>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Sản phẩm
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Thông tin
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Phân loại
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Giá
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Ngày tạo
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Hành động
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {products
//                       .slice()
//                       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//                       .map((product) => (
//                         <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md overflow-hidden">
//                                 {product.images.length > 0 ? (
//                                   <Image
//                                     src={product.images[0]}
//                                     alt={product.name}
//                                     width={56}
//                                     height={56}
//                                     style={{ objectFit: 'cover' }}
//                                     className="w-full h-full"
//                                   />
//                                 ) : (
//                                   <div className="h-full w-full flex items-center justify-center text-gray-400">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                     </svg>
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                                 {product.images.length > 1 && (
//                                   <div className="text-xs text-gray-500">{product.images.length} ảnh</div>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="text-sm text-gray-900">Kích thước: {product.size}</div>
//                             <div className="text-sm text-gray-500" title={product.description}>
//                               {truncateDescription(product.description, 50)}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div>
//                               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                                 {product.category}
//                               </span>
//                             </div>
//                             {product.collection !== 'Không có bộ sưu tập' && (
//                               <div className="mt-1">
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                   {product.collection}
//                                 </span>
//                               </div>
//                             )}
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {formatPrice(product.price)}
//                             </div>
//                             {product.discount && (
//                               <div className="flex items-center mt-1">
//                                 <span className="text-xs text-red-600 line-through mr-1">
//                                   {formatPrice(product.price)}
//                                 </span>
//                                 <span className="text-xs font-medium text-red-600">
//                                   {formatPrice(product.discount)}
//                                 </span>
//                                 <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded-sm">
//                                   -{calculateDiscountPercentage(product.price, product.discount)}%
//                                 </span>
//                               </div>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {new Date(product.createdAt).toLocaleDateString('vi-VN', {
//                               year: 'numeric',
//                               month: '2-digit',
//                               day: '2-digit',
//                             })}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <div className="flex justify-end space-x-3">
//                               <button
//                                 onClick={() => handleEditProduct(product)}
//                                 className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline flex items-center"
//                               >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                 </svg>
//                                 Sửa
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteProduct(product._id)}
//                                 className="text-red-600 hover:text-red-900 focus:outline-none focus:underline flex items-center"
//                               >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                 </svg>
//                                 Xóa
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductsPage;
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';

interface User {
  email: string;
  role: 'admin' | 'user';
}

interface Product {
  _id: string;
  name: string;
  size: string;
  description: string;
  category: string;
  collection: string;
  price: number;
  discount: number | null;
  images: string[];
  createdAt: string;
  status?: 'in_stock' | 'out_of_stock';
}

interface Category {
  _id: string;
  name: string;
}

interface Collection {
  _id: string;
  name: string;
}

interface ImageFile {
  file: File;
  preview: string;
}

const ProductsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [productName, setProductName] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch products
        const productsResponse = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsData = await productsResponse.json();
        if (productsResponse.ok) {
          setProducts(productsData.products);
        } else {
          setError(productsData.message || 'Không thể tải sản phẩm');
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoriesData = await categoriesResponse.json();
        if (categoriesResponse.ok) {
          setCategories(categoriesData.categories);
        } else {
          setError(categoriesData.message || 'Không thể tải danh mục');
        }

        // Fetch collections
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
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImageFiles([...imageFiles, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!productName.trim() || !size.trim() || !description.trim() || !selectedCategory || !price.trim() || (!editingProduct && imageFiles.length === 0)) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc và thêm ít nhất một ảnh khi thêm sản phẩm');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập lại');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productName.trim());
      formData.append('size', size.trim());
      formData.append('description', description.trim());
      formData.append('category', selectedCategory);
      formData.append('collection', selectedCollection || '');
      formData.append('price', price);
      formData.append('discount', discount.trim() || '');
      formData.append('status', status);
      if (editingProduct) {
        formData.append('id', editingProduct._id);
      }
      imageFiles.forEach((image) => {
        formData.append('images', image.file);
      });

      const response = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        if (editingProduct) {
          setSuccess('Cập nhật sản phẩm thành công');
          setProducts(
            products.map(prod =>
              prod._id === editingProduct._id
                ? {
                    ...prod,
                    name: productName,
                    size,
                    description,
                    category: selectedCategory,
                    collection: selectedCollection || 'Không có bộ sưu tập',
                    price: parseFloat(price),
                    discount: discount ? parseFloat(discount) : null,
                    images: data.product.images,
                    status,
                  }
                : prod
            )
          );
          setEditingProduct(null);
        } else {
          setSuccess('Thêm sản phẩm thành công');
          setProducts([...products, { ...data.product, status: data.product.status || 'in_stock' }]);
        }
        resetForm();
        setShowForm(false);
      } else {
        setError(data.message || 'Không thể xử lý sản phẩm');
      }
    } catch {
      console.error('Frontend add product error');
      setError('Đã xảy ra lỗi khi xử lý sản phẩm');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setSize(product.size);
    setDescription(product.description);
    setSelectedCategory(product.category);
    setSelectedCollection(product.collection === 'Không có bộ sưu tập' ? '' : product.collection);
    setPrice(product.price.toString());
    setDiscount(product.discount ? product.discount.toString() : '');
    setStatus(product.status || 'in_stock');
    setImageFiles([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = async (id: string, newStatus: 'in_stock' | 'out_of_stock') => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập lại');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Cập nhật trạng thái sản phẩm thành công');
        setProducts(
          products.map((prod) =>
            prod._id === id ? { ...prod, status: newStatus } : prod
          )
        );
      } else {
        setError(data.message || 'Không thể cập nhật trạng thái sản phẩm');
      }
    } catch {
      setError('Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm');
    }
  };

  const resetForm = () => {
    setProductName('');
    setSize('');
    setDescription('');
    setSelectedCategory('');
    setSelectedCollection('');
    setPrice('');
    setDiscount('');
    setStatus('in_stock');
    setImageFiles([]);
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowForm(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập lại');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Xóa sản phẩm thành công');
        setProducts(products.filter(prod => prod._id !== id));
      } else {
        setError(data.message || 'Không thể xóa sản phẩm');
      }
    } catch {
      setError('Đã xảy ra lỗi khi xóa sản phẩm');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const calculateDiscountPercentage = (price: number, discount: number | null) => {
    if (!discount || discount >= price) return null;
    return Math.round(((price - discount) / price) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[200px] bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="container max-w-7xl mx-auto mt-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-4 py-2 rounded-md ${showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors duration-200 flex items-center space-x-2`}
            >
              <span>{showForm ? 'Ẩn Form' : 'Thêm Sản Phẩm Mới'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                className={`transition-transform duration-200 ${showForm ? 'rotate-180' : 'rotate-0'}`} 
                viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-fadeIn">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md animate-fadeIn">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>{success}</p>
              </div>
            </div>
          )}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-slideDown">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                {editingProduct ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Chỉnh Sửa Sản Phẩm
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm Sản Phẩm Mới
                  </>
                )}
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sản Phẩm <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kích Thước <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Nhập kích thước (VD: S, M, L)"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả <span className="text-red-500">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Nhập mô tả sản phẩm"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh Mục <span className="text-red-500">*</span></label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="" className="text-gray-500">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bộ Sưu Tập</label>
                    <select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="" className="text-gray-500">Chọn bộ sưu tập (không bắt buộc)</option>
                      {collections.map((collection) => (
                        <option key={collection._id} value={collection.name}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₫</span>
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Nhập giá sản phẩm"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giảm Giá</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₫</span>
                      </div>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 pl-8 pr-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Nhập giá giảm (không bắt buộc)"
                        min="0"
                        step="1000"
                      />
                    </div>
                    {price && discount && parseFloat(price) > 0 && parseFloat(discount) > 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        Giảm {calculateDiscountPercentage(parseFloat(price), parseFloat(discount))}%
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái <span className="text-red-500">*</span></label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'in_stock' | 'out_of_stock')}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="in_stock">Còn hàng</option>
                    <option value="out_of_stock">Hết hàng</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh Sản Phẩm {!editingProduct && <span className="text-red-500">*</span>}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Tải ảnh lên</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">hoặc kéo và thả</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF lên đến 10MB</p>
                    </div>
                  </div>
                </div>
                
                {imageFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Ảnh đã chọn</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imageFiles.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={image.preview}
                              alt={`Preview ${index}`}
                              width={100}
                              height={100}
                              style={{ objectFit: 'cover' }}
                              className="w-full h-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {editingProduct && editingProduct.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Ảnh hiện tại</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {editingProduct.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={url}
                              alt={`Existing ${index}`}
                              width={100}
                              height={100}
                              style={{ objectFit: 'cover' }}
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Lưu ý: Thêm ảnh mới sẽ không xóa các ảnh hiện tại</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Danh Sách Sản Phẩm
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {products.length}
                </span>
              </h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">Chưa có sản phẩm nào</h3>
                <p className="mt-1 text-sm text-gray-500">Bắt đầu thêm sản phẩm mới vào cửa hàng của bạn.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm sản phẩm
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thông tin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phân loại
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products
                      .slice()
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md overflow-hidden">
                                {product.images.length > 0 ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={56}
                                    height={56}
                                    style={{ objectFit: 'cover' }}
                                    className="w-full h-full"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                {product.images.length > 1 && (
                                  <div className="text-xs text-gray-500">{product.images.length} ảnh</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">Kích thước: {product.size}</div>
                            <div className="text-sm text-gray-500" title={product.description}>
                              {truncateDescription(product.description, 50)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {product.category}
                              </span>
                            </div>
                            {product.collection !== 'Không có bộ sưu tập' && (
                              <div className="mt-1">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {product.collection}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </div>
                            {product.discount && (
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-red-600 line-through mr-1">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-xs font-medium text-red-600">
                                  {formatPrice(product.discount)}
                                </span>
                                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded-sm">
                                  -{calculateDiscountPercentage(product.price, product.discount)}%
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {product.status === 'out_of_stock' ? 'Hết hàng' : 'Còn hàng'}
                            </span>
                            <button
                              onClick={() => handleToggleStatus(product._id, product.status === 'in_stock' ? 'out_of_stock' : 'in_stock')}
                              className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none focus:underline flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Chuyển trạng thái
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-900 focus:outline-none focus:underline flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;