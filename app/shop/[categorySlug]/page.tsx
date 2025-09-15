
// // // 'use client';

// // // import Link from 'next/link';
// // // import Image from 'next/image';
// // // import { useEffect, useState } from 'react';
// // // import { useParams } from 'next/navigation';
// // // import { Product } from '@/types/product';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { Loader2, Search, Grid3X3, List, Heart, ChevronDown } from 'lucide-react';

// // // interface ExtendedProduct extends Product {
// // //   images?: string[];
// // // }

// // // interface Category {
// // //   _id: string;
// // //   name: string;
// // // }

// // // type ViewMode = 'grid' | 'list';
// // // type SortBy = 'name' | 'price-low' | 'price-high';

// // // async function fetchProducts(categorySlug: string): Promise<ExtendedProduct[]> {
// // //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// // //   console.log('API URL:', apiUrl);

// // //   try {
// // //     const res = await fetch(`${apiUrl}/api/products?category=${encodeURIComponent(categorySlug)}`, {
// // //       cache: 'no-store',
// // //     });
// // //     if (!res.ok) {
// // //       console.error(`Failed to fetch products for category ${categorySlug}: ${res.status}`);
// // //       return [];
// // //     }
// // //     const data = await res.json();
// // //     console.log('API Response:', data);

// // //     const products = (data.products || []).map((product: ExtendedProduct) => ({
// // //       ...product,
// // //       image: product.images?.length ? product.images[0] : product.image || '/images/placeholder.jpg',
// // //     }));

// // //     return products;
// // //   } catch (error) {
// // //     console.error('Error fetching products:', error);
// // //     return [];
// // //   }
// // // }

// // // async function fetchCategories(): Promise<Category[]> {
// // //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// // //   try {
// // //     const res = await fetch(`${apiUrl}/api/categories`, { cache: 'no-store' });
// // //     if (!res.ok) {
// // //       console.error('Failed to fetch categories:', res.status);
// // //       return [];
// // //     }
// // //     const data = await res.json();
// // //     return data.categories || [];
// // //   } catch (error) {
// // //     console.error('Error fetching categories:', error);
// // //     return [];
// // //   }
// // // }

// // // const LoadingSkeleton = () => (
// // //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// // //     {[...Array(8)].map((_, i) => (
// // //       <div key={i} className="animate-pulse">
// // //         <div className="bg-gray-200 h-80 mb-4"></div>
// // //         <div className="space-y-3">
// // //           <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
// // //           <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
// // //           <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
// // //         </div>
// // //       </div>
// // //     ))}
// // //   </div>
// // // );

// // // const ProductCard = ({ product, index }: { product: ExtendedProduct; index: number }) => {
// // //   const [isWishlisted, setIsWishlisted] = useState(false);

// // //   return (
// // //     <motion.div
// // //       initial={{ opacity: 0, y: 20 }}
// // //       animate={{ opacity: 1, y: 0 }}
// // //       transition={{ duration: 0.5, delay: index * 0.1 }}
// // //       whileHover={{ y: -8, scale: 1.02 }}
// // //       className="group relative bg-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200"
// // //     >
// // //       {/* Wishlist Button */}
// // //       <button
// // //         onClick={() => setIsWishlisted(!isWishlisted)}
// // //         className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
// // //       >
// // //         <Heart 
// // //           className={`w-5 h-5 transition-colors duration-300 ${
// // //             isWishlisted ? 'fill-black text-black' : 'text-gray-600'
// // //           }`} 
// // //         />
// // //       </button>

// // //       {/* Product Image */}
// // //       <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
// // //         <Image
// // //           src={product.image}
// // //           alt={product.name}
// // //           fill
// // //           className="object-cover transition-transform duration-700 group-hover:scale-105"
// // //           placeholder="blur"
// // //           blurDataURL="/images/placeholder.jpg"
// // //           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
// // //         />
// // //         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
// // //       </div>

// // //       {/* Product Info */}
// // //       <div className="p-6 space-y-4">
// // //         <div className="space-y-2">
// // //           <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
// // //             {product.name}
// // //           </h3>
// // //           <p className="text-sm text-gray-600 line-clamp-1">
// // //             {product.category}
// // //           </p>
// // //         </div>

// // //         {/* Price and Size */}
// // //         <div className="flex items-center justify-between">
// // //           <p className="text-xl font-semibold text-black">
// // //             {new Intl.NumberFormat('vi-VN', { 
// // //               style: 'currency', 
// // //               currency: 'VND',
// // //               minimumFractionDigits: 0 
// // //             }).format(product.price)}
// // //           </p>
// // //           <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full uppercase tracking-wider">
// // //             SIZE {product.size}
// // //           </span>
// // //         </div>

// // //         {/* Actions */}
// // //         <div className="flex space-x-3 pt-4">
// // //           <Link
// // //             href={`/products/${product._id}`}
// // //             className="flex-1 text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
// // //           >
// // //             VIEW PRODUCT
// // //           </Link>
// // //           <button className="px-6 py-3 bg-white text-black border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300">
// // //             ADD TO CART
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </motion.div>
// // //   );
// // // };

// // // const ProductListItem = ({ product, index }: { product: ExtendedProduct; index: number }) => (
// // //   <motion.div
// // //     initial={{ opacity: 0, x: -20 }}
// // //     animate={{ opacity: 1, x: 0 }}
// // //     transition={{ duration: 0.5, delay: index * 0.1 }}
// // //     className="group flex items-center space-x-6 p-6 bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
// // //   >
// // //     <div className="relative w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
// // //       <Image
// // //         src={product.image}
// // //         alt={product.name}
// // //         fill
// // //         className="object-cover group-hover:scale-105 transition-transform duration-300"
// // //       />
// // //     </div>
// // //     <div className="flex-1 min-w-0">
// // //       <h3 className="text-lg font-medium text-black truncate">{product.name}</h3>
// // //       <p className="text-sm text-gray-600 line-clamp-1 mt-1">{product.category}</p>
// // //       <span className="inline-block text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full uppercase tracking-wider mt-2">
// // //         SIZE {product.size}
// // //       </span>
// // //     </div>
// // //     <div className="text-right">
// // //       <p className="text-xl font-semibold text-black">
// // //         {new Intl.NumberFormat('vi-VN', { 
// // //           style: 'currency', 
// // //           currency: 'VND',
// // //           minimumFractionDigits: 0 
// // //         }).format(product.price)}
// // //       </p>
// // //       <Link
// // //         href={`/products/${product._id}`}
// // //         className="inline-block mt-3 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-300"
// // //       >
// // //         VIEW PRODUCT
// // //       </Link>
// // //     </div>
// // //   </motion.div>
// // // );

// // // const CategoryFilter = ({ categories, currentCategory, onCategoryChange }: {
// // //   categories: Category[];
// // //   currentCategory: string;
// // //   onCategoryChange: (slug: string) => void;
// // // }) => {
// // //   const [isOpen, setIsOpen] = useState(false);

// // //   const displayCategoryName = (slug: string) => {
// // //     if (slug === 'all') return 'All Products';
// // //     const categoryMap: { [key: string]: string } = {
// // //       'coats--jackets': 'Coats & Jackets',
// // //       'ao-so-mi': 'Áo sơ mi',
// // //       'quan-linen': 'Quần linen',
// // //       'vay': 'Váy',
// // //       'phu-kien': 'Phụ kiện',
// // //     };
// // //     const category = categories.find(
// // //       (cat) =>
// // //         cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
// // //         cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
// // //     );
// // //     return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
// // //   };

// // //   return (
// // //     <div className="relative">
// // //       <button
// // //         onClick={() => setIsOpen(!isOpen)}
// // //         className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300 min-w-48"
// // //       >
// // //         <span>{displayCategoryName(currentCategory)}</span>
// // //         <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
// // //       </button>
      
// // //       <AnimatePresence>
// // //         {isOpen && (
// // //           <motion.div
// // //             initial={{ opacity: 0, y: -10 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             exit={{ opacity: 0, y: -10 }}
// // //             className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg z-20 max-h-60 overflow-y-auto"
// // //           >
// // //             <button
// // //               onClick={() => {
// // //                 onCategoryChange('all');
// // //                 setIsOpen(false);
// // //               }}
// // //               className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
// // //                 currentCategory === 'all' ? 'bg-gray-100' : ''
// // //               }`}
// // //             >
// // //               All Products
// // //             </button>
// // //             {categories.map((category) => {
// // //               const slug = category.name.toLowerCase().replace(/[\s&]+/g, '--');
// // //               return (
// // //                 <button
// // //                   key={category._id}
// // //                   onClick={() => {
// // //                     onCategoryChange(slug);
// // //                     setIsOpen(false);
// // //                   }}
// // //                   className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
// // //                     currentCategory === slug ? 'bg-gray-100' : ''
// // //                   }`}
// // //                 >
// // //                   {category.name}
// // //                 </button>
// // //               );
// // //             })}
// // //           </motion.div>
// // //         )}
// // //       </AnimatePresence>
// // //     </div>
// // //   );
// // // };

// // // export default function ShopPage() {
// // //   const params = useParams();
// // //   const categorySlug = params.categorySlug as string;
// // //   console.log('Category Slug:', categorySlug);

// // //   const [products, setProducts] = useState<ExtendedProduct[]>([]);
// // //   const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
// // //   const [categories, setCategories] = useState<Category[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [sortBy, setSortBy] = useState<SortBy>('name');
// // //   const [viewMode, setViewMode] = useState<ViewMode>('grid');

// // //   // Hàm chuyển đổi slug thành tên danh mục hiển thị
// // //   const displayCategoryName = (slug: string) => {
// // //     if (slug === 'all') return 'All Products';
// // //     const categoryMap: { [key: string]: string } = {
// // //       'coats--jackets': 'Coats & Jackets',
// // //       'ao-so-mi': 'Áo sơ mi',
// // //       'quan-linen': 'Quần linen',
// // //       'vay': 'Váy',
// // //       'phu-kien': 'Phụ kiện',
// // //     };
// // //     const category = categories.find(
// // //       (cat) =>
// // //         cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
// // //         cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
// // //     );
// // //     return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
// // //   };

// // //   const handleCategoryChange = (newSlug: string) => {
// // //     window.location.href = `/shop/${newSlug}`;
// // //   };

// // //   useEffect(() => {
// // //     const loadData = async () => {
// // //       setLoading(true);
// // //       setError(null);

// // //       const [fetchedProducts, fetchedCategories] = await Promise.all([
// // //         fetchProducts(categorySlug),
// // //         fetchCategories(),
// // //       ]);

// // //       setProducts(fetchedProducts);
// // //       setFilteredProducts(fetchedProducts);
// // //       setCategories(fetchedCategories);

// // //       if (fetchedProducts.length === 0 && categorySlug !== 'all') {
// // //         setError('No products found for this category.');
// // //       }

// // //       setLoading(false);
// // //     };

// // //     loadData();
// // //   }, [categorySlug]);

// // //   useEffect(() => {
// // //     const filtered = products.filter(product =>
// // //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       product.category.toLowerCase().includes(searchTerm.toLowerCase())
// // //     );

// // //     // Sort products
// // //     filtered.sort((a, b) => {
// // //       switch (sortBy) {
// // //         case 'price-low':
// // //           return a.price - b.price;
// // //         case 'price-high':
// // //           return b.price - a.price;
// // //         case 'name':
// // //         default:
// // //           return a.name.localeCompare(b.name);
// // //       }
// // //     });

// // //     setFilteredProducts(filtered);
// // //   }, [products, searchTerm, sortBy]);

// // //   // Kiểm tra slug hợp lệ
// // //   const isValidSlug = categorySlug === 'all' || categories.some(
// // //     (cat) =>
// // //       cat.name.toLowerCase().replace(/[\s&]+/g, '--') === categorySlug ||
// // //       cat.name.toLowerCase().replace(/[\s&]+/g, '-') === categorySlug
// // //   );

// // //   if (!loading && !isValidSlug && categories.length > 0) {
// // //     console.log(`Invalid category slug: ${categorySlug}`);
// // //     setError(`Invalid category slug: ${categorySlug}`);
// // //   }

// // //   return (
// // //     <div className="min-h-screen mt-[200px] text-black bg-white">
// // //       <div className="container mx-auto px-4 py-8 mt-[120px]">
// // //         {/* Header */}
// // //         <motion.header 
// // //           initial={{ opacity: 0, y: -20 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           className="text-center mb-16 space-y-4"
// // //         >
// // //           <h1 className="text-4xl sm:text-6xl font-light text-black capitalize tracking-wider">
// // //             {displayCategoryName(categorySlug)}
// // //           </h1>
// // //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
// // //             Explore our curated collection of high-quality items
// // //           </p>
// // //           <div className="w-24 h-px bg-black mx-auto"></div>
// // //         </motion.header>

// // //         {loading ? (
// // //           <div className="text-center py-16 space-y-6">
// // //             <Loader2 className="w-12 h-12 animate-spin text-black mx-auto" />
// // //             <p className="text-xl text-gray-600 font-light">Loading products...</p>
// // //             <LoadingSkeleton />
// // //           </div>
// // //         ) : error ? (
// // //           <motion.div 
// // //             initial={{ opacity: 0 }}
// // //             animate={{ opacity: 1 }}
// // //             className="text-center py-20 space-y-6"
// // //           >
// // //             <div className="w-32 h-32 bg-gray-100 mx-auto flex items-center justify-center">
// // //               <Search className="w-16 h-16 text-gray-400" />
// // //             </div>
// // //             <h3 className="text-2xl font-light text-black">Category Not Found</h3>
// // //             <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
// // //             <Link
// // //               href="/shop/all"
// // //               className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
// // //             >
// // //               BROWSE ALL PRODUCTS
// // //             </Link>
// // //           </motion.div>
// // //         ) : (
// // //           <>
// // //             {/* Controls */}
// // //             <motion.div 
// // //               initial={{ opacity: 0, y: 20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               className="flex flex-col lg:flex-row gap-4 mb-12 p-6 bg-white border border-gray-200"
// // //             >
// // //               {/* Category Filter */}
// // //               <CategoryFilter
// // //                 categories={categories}
// // //                 currentCategory={categorySlug}
// // //                 onCategoryChange={handleCategoryChange}
// // //               />

// // //               {/* Search */}
// // //               <div className="relative flex-1">
// // //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Search products..."
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                   className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
// // //                 />
// // //               </div>

// // //               {/* Sort */}
// // //               <select
// // //                 value={sortBy}
// // //                 onChange={(e) => setSortBy(e.target.value as SortBy)}
// // //                 className="px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
// // //               >
// // //                 <option value="name">Sort by Name</option>
// // //                 <option value="price-low">Price: Low to High</option>
// // //                 <option value="price-high">Price: High to Low</option>
// // //               </select>

// // //               {/* View Mode */}
// // //               <div className="flex bg-gray-100 p-1">
// // //                 <button
// // //                   onClick={() => setViewMode('grid')}
// // //                   className={`flex items-center px-4 py-2 transition-all duration-300 ${
// // //                     viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
// // //                   }`}
// // //                 >
// // //                   <Grid3X3 className="w-4 h-4 mr-2" />
// // //                   GRID
// // //                 </button>
// // //                 <button
// // //                   onClick={() => setViewMode('list')}
// // //                   className={`flex items-center px-4 py-2 transition-all duration-300 ${
// // //                     viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
// // //                   }`}
// // //                 >
// // //                   <List className="w-4 h-4 mr-2" />
// // //                   LIST
// // //                 </button>
// // //               </div>
// // //             </motion.div>

// // //             {/* Products Count */}
// // //             <motion.div 
// // //               initial={{ opacity: 0 }}
// // //               animate={{ opacity: 1 }}
// // //               className="mb-8"
// // //             >
// // //               <p className="text-gray-600 font-light">
// // //                 Showing <span className="font-medium text-black">{filteredProducts.length}</span> products
// // //               </p>
// // //             </motion.div>

// // //             {/* Products */}
// // //             <AnimatePresence mode="wait">
// // //               {filteredProducts.length === 0 ? (
// // //                 <motion.div 
// // //                   initial={{ opacity: 0 }}
// // //                   animate={{ opacity: 1 }}
// // //                   exit={{ opacity: 0 }}
// // //                   className="text-center py-20"
// // //                 >
// // //                   <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// // //                   <h3 className="text-xl font-light text-black mb-2">No products found</h3>
// // //                   <p className="text-gray-600 font-light">Try adjusting your search or filters</p>
// // //                 </motion.div>
// // //               ) : (
// // //                 <motion.div
// // //                   key={viewMode}
// // //                   initial={{ opacity: 0 }}
// // //                   animate={{ opacity: 1 }}
// // //                   exit={{ opacity: 0 }}
// // //                   transition={{ duration: 0.3 }}
// // //                 >
// // //                   {viewMode === 'grid' ? (
// // //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// // //                       {filteredProducts.map((product, index) => (
// // //                         <ProductCard key={product._id} product={product} index={index} />
// // //                       ))}
// // //                     </div>
// // //                   ) : (
// // //                     <div className="space-y-4">
// // //                       {filteredProducts.map((product, index) => (
// // //                         <ProductListItem key={product._id} product={product} index={index} />
// // //                       ))}
// // //                     </div>
// // //                   )}
// // //                 </motion.div>
// // //               )}
// // //             </AnimatePresence>
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client';

// // import Link from 'next/link';
// // import Image from 'next/image';
// // import { useEffect, useState } from 'react';
// // import { useParams } from 'next/navigation';
// // import { Product } from '@/types/product';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Loader2, Search, Grid3X3, List, Heart, ChevronDown } from 'lucide-react';

// // interface ExtendedProduct extends Product {
// //   images?: string[];
// //   status?: 'in_stock' | 'out_of_stock'; // Added status field for out-of-stock handling
// // }

// // interface Category {
// //   _id: string;
// //   name: string;
// // }

// // type ViewMode = 'grid' | 'list';
// // type SortBy = 'name' | 'price-low' | 'price-high';

// // async function fetchProducts(categorySlug: string): Promise<ExtendedProduct[]> {
// //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// //   console.log('API URL:', apiUrl);

// //   try {
// //     const res = await fetch(`${apiUrl}/api/products?category=${encodeURIComponent(categorySlug)}`, {
// //       cache: 'no-store',
// //     });
// //     if (!res.ok) {
// //       console.error(`Failed to fetch products for category ${categorySlug}: ${res.status}`);
// //       return [];
// //     }
// //     const data = await res.json();
// //     console.log('API Response:', data);

// //     const products = (data.products || []).map((product: ExtendedProduct) => ({
// //       ...product,
// //       image: product.images?.length ? product.images[0] : product.image || '/images/placeholder.jpg',
// //       status: product.status || 'in_stock', // Default to 'in_stock' if status is missing
// //     }));

// //     return products;
// //   } catch (error) {
// //     console.error('Error fetching products:', error);
// //     return [];
// //   }
// // }

// // async function fetchCategories(): Promise<Category[]> {
// //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// //   try {
// //     const res = await fetch(`${apiUrl}/api/categories`, { cache: 'no-store' });
// //     if (!res.ok) {
// //       console.error('Failed to fetch categories:', res.status);
// //       return [];
// //     }
// //     const data = await res.json();
// //     return data.categories || [];
// //   } catch (error) {
// //     console.error('Error fetching categories:', error);
// //     return [];
// //   }
// // }

// // const LoadingSkeleton = () => (
// //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //     {[...Array(8)].map((_, i) => (
// //       <div key={i} className="animate-pulse">
// //         <div className="bg-gray-200 h-80 mb-4"></div>
// //         <div className="space-y-3">
// //           <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
// //           <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
// //           <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
// //         </div>
// //       </div>
// //     ))}
// //   </div>
// // );

// // const ProductCard = ({ product, index }: { product: ExtendedProduct; index: number }) => {
// //   const [isWishlisted, setIsWishlisted] = useState(false);

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.5, delay: index * 0.1 }}
// //       whileHover={{ y: -8, scale: 1.02 }}
// //       className="group relative bg-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200"
// //     >
// //       {/* Wishlist Button */}
// //       <button
// //         onClick={() => setIsWishlisted(!isWishlisted)}
// //         className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
// //       >
// //         <Heart 
// //           className={`w-5 h-5 transition-colors duration-300 ${
// //             isWishlisted ? 'fill-black text-black' : 'text-gray-600'
// //           }`} 
// //         />
// //       </button>

// //       {/* Product Image */}
// //       <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
// //         <Link href={`/products/${product._id}`}>
// //           <Image
// //             src={product.image}
// //             alt={product.name}
// //             fill
// //             className="object-cover transition-transform duration-700 group-hover:scale-105"
// //             placeholder="blur"
// //             blurDataURL="/images/placeholder.jpg"
// //             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
// //           />
// //           {product.status === 'out_of_stock' && (
// //             <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
// //               <span className="text-white text-lg font-bold uppercase tracking-widest">
// //                 Sold Out
// //               </span>
// //             </div>
// //           )}
// //         </Link>
// //         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
// //       </div>

// //       {/* Product Info */}
// //       <div className="p-6 space-y-4">
// //         <div className="space-y-2">
// //           <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
// //             {product.name}
// //           </h3>
// //           <p className="text-sm text-gray-600 line-clamp-1">
// //             {product.category}
// //           </p>
// //         </div>

// //         {/* Price and Size */}
// //         <div className="flex items-center justify-between">
// //           <p className="text-xl font-semibold text-black">
// //             {new Intl.NumberFormat('vi-VN', { 
// //               style: 'currency', 
// //               currency: 'VND',
// //               minimumFractionDigits: 0 
// //             }).format(product.price)}
// //           </p>
// //           <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full uppercase tracking-wider">
// //             SIZE {product.size}
// //           </span>
// //         </div>

// //         {/* Actions */}
// //         <div className="flex space-x-3 pt-4">
// //           <Link
// //             href={`/products/${product._id}`}
// //             className="flex-1 text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
// //           >
// //             VIEW PRODUCT
// //           </Link>
// //           <button 
// //             className={`px-6 py-3 font-medium hover:bg-gray-50 transition-all duration-300 ${
// //               product.status === 'out_of_stock'
// //                 ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
// //                 : 'bg-white text-black border border-gray-300'
// //             }`}
// //             disabled={product.status === 'out_of_stock'}
// //           >
// //             {product.status === 'out_of_stock' ? 'SOLD OUT' : 'ADD TO CART'}
// //           </button>
// //         </div>
// //       </div>
// //     </motion.div>
// //   );
// // };

// // const ProductListItem = ({ product, index }: { product: ExtendedProduct; index: number }) => (
// //   <motion.div
// //     initial={{ opacity: 0, x: -20 }}
// //     animate={{ opacity: 1, x: 0 }}
// //     transition={{ duration: 0.5, delay: index * 0.1 }}
// //     className="group flex items-center space-x-6 p-6 bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
// //   >
// //     <div className="relative w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
// //       <Link href={`/products/${product._id}`}>
// //         <Image
// //           src={product.image}
// //           alt={product.name}
// //           fill
// //           className="object-cover group-hover:scale-105 transition-transform duration-300"
// //           placeholder="blur"
// //           blurDataURL="/images/placeholder.jpg"
// //           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
// //         />
// //         {product.status === 'out_of_stock' && (
// //           <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
// //             <span className="text-white text-sm font-bold uppercase tracking-widest">
// //               Sold Out
// //             </span>
// //           </div>
// //         )}
// //       </Link>
// //     </div>
// //     <div className="flex-1 min-w-0">
// //       <h3 className="text-lg font-medium text-black truncate">{product.name}</h3>
// //       <p className="text-sm text-gray-600 line-clamp-1 mt-1">{product.category}</p>
// //       <span className="inline-block text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full uppercase tracking-wider mt-2">
// //         SIZE {product.size}
// //       </span>
// //     </div>
// //     <div className="text-right">
// //       <p className="text-xl font-semibold text-black">
// //         {new Intl.NumberFormat('vi-VN', { 
// //           style: 'currency', 
// //           currency: 'VND',
// //           minimumFractionDigits: 0 
// //         }).format(product.price)}
// //       </p>
// //       <Link
// //         href={`/products/${product._id}`}
// //         className="inline-block mt-3 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-300"
// //       >
// //         VIEW PRODUCT
// //       </Link>
// //     </div>
// //   </motion.div>
// // );

// // const CategoryFilter = ({ categories, currentCategory, onCategoryChange }: {
// //   categories: Category[];
// //   currentCategory: string;
// //   onCategoryChange: (slug: string) => void;
// // }) => {
// //   const [isOpen, setIsOpen] = useState(false);

// //   const displayCategoryName = (slug: string) => {
// //     if (slug === 'all') return 'All Products';
// //     const categoryMap: { [key: string]: string } = {
// //       'coats--jackets': 'Coats & Jackets',
// //       'ao-so-mi': 'Áo sơ mi',
// //       'quan-linen': 'Quần linen',
// //       'vay': 'Váy',
// //       'phu-kien': 'Phụ kiện',
// //     };
// //     const category = categories.find(
// //       (cat) =>
// //         cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
// //         cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
// //     );
// //     return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
// //   };

// //   return (
// //     <div className="relative">
// //       <button
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300 min-w-48"
// //       >
// //         <span>{displayCategoryName(currentCategory)}</span>
// //         <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
// //       </button>
      
// //       <AnimatePresence>
// //         {isOpen && (
// //           <motion.div
// //             initial={{ opacity: 0, y: -10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -10 }}
// //             className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg z-20 max-h-60 overflow-y-auto"
// //           >
// //             <button
// //               onClick={() => {
// //                 onCategoryChange('all');
// //                 setIsOpen(false);
// //               }}
// //               className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
// //                 currentCategory === 'all' ? 'bg-gray-100' : ''
// //               }`}
// //             >
// //               All Products
// //             </button>
// //             {categories.map((category) => {
// //               const slug = category.name.toLowerCase().replace(/[\s&]+/g, '--');
// //               return (
// //                 <button
// //                   key={category._id}
// //                   onClick={() => {
// //                     onCategoryChange(slug);
// //                     setIsOpen(false);
// //                   }}
// //                   className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
// //                     currentCategory === slug ? 'bg-gray-100' : ''
// //                   }`}
// //                 >
// //                   {category.name}
// //                 </button>
// //               );
// //             })}
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // };

// // export default function ShopPage() {
// //   const params = useParams();
// //   const categorySlug = params.categorySlug as string;
// //   console.log('Category Slug:', categorySlug);

// //   const [products, setProducts] = useState<ExtendedProduct[]>([]);
// //   const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [sortBy, setSortBy] = useState<SortBy>('name');
// //   const [viewMode, setViewMode] = useState<ViewMode>('grid');

// //   // Hàm chuyển đổi slug thành tên danh mục hiển thị
// //   const displayCategoryName = (slug: string) => {
// //     if (slug === 'all') return 'All Products';
// //     const categoryMap: { [key: string]: string } = {
// //       'coats--jackets': 'Coats & Jackets',
// //       'ao-so-mi': 'Áo sơ mi',
// //       'quan-linen': 'Quần linen',
// //       'vay': 'Váy',
// //       'phu-kien': 'Phụ kiện',
// //     };
// //     const category = categories.find(
// //       (cat) =>
// //         cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
// //         cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
// //     );
// //     return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
// //   };

// //   const handleCategoryChange = (newSlug: string) => {
// //     window.location.href = `/shop/${newSlug}`;
// //   };

// //   useEffect(() => {
// //     const loadData = async () => {
// //       setLoading(true);
// //       setError(null);

// //       const [fetchedProducts, fetchedCategories] = await Promise.all([
// //         fetchProducts(categorySlug),
// //         fetchCategories(),
// //       ]);

// //       setProducts(fetchedProducts);
// //       setFilteredProducts(fetchedProducts);
// //       setCategories(fetchedCategories);

// //       if (fetchedProducts.length === 0 && categorySlug !== 'all') {
// //         setError('No products found for this category.');
// //       }

// //       setLoading(false);
// //     };

// //     loadData();
// //   }, [categorySlug]);

// //   useEffect(() => {
// //     const filtered = products.filter(product =>
// //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       product.category.toLowerCase().includes(searchTerm.toLowerCase())
// //     );

// //     // Sort products
// //     filtered.sort((a, b) => {
// //       switch (sortBy) {
// //         case 'price-low':
// //           return a.price - b.price;
// //         case 'price-high':
// //           return b.price - a.price;
// //         case 'name':
// //         default:
// //           return a.name.localeCompare(b.name);
// //       }
// //     });

// //     setFilteredProducts(filtered);
// //   }, [products, searchTerm, sortBy]);

// //   // Kiểm tra slug hợp lệ
// //   const isValidSlug = categorySlug === 'all' || categories.some(
// //     (cat) =>
// //       cat.name.toLowerCase().replace(/[\s&]+/g, '--') === categorySlug ||
// //       cat.name.toLowerCase().replace(/[\s&]+/g, '-') === categorySlug
// //   );

// //   if (!loading && !isValidSlug && categories.length > 0) {
// //     console.log(`Invalid category slug: ${categorySlug}`);
// //     setError(`Invalid category slug: ${categorySlug}`);
// //   }

// //   return (
// //     <div className="min-h-screen mt-[200px] text-black bg-white">
// //       <div className="container mx-auto px-4 py-8 mt-[120px]">
// //         {/* Header */}
// //         <motion.header 
// //           initial={{ opacity: 0, y: -20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="text-center mb-16 space-y-4"
// //         >
// //           <h1 className="text-4xl sm:text-6xl font-light text-black capitalize tracking-wider">
// //             {displayCategoryName(categorySlug)}
// //           </h1>
// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
// //             Explore our curated collection of high-quality items
// //           </p>
// //           <div className="w-24 h-px bg-black mx-auto"></div>
// //         </motion.header>

// //         {loading ? (
// //           <div className="text-center py-16 space-y-6">
// //             <Loader2 className="w-12 h-12 animate-spin text-black mx-auto" />
// //             <p className="text-xl text-gray-600 font-light">Loading products...</p>
// //             <LoadingSkeleton />
// //           </div>
// //         ) : error ? (
// //           <motion.div 
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             className="text-center py-20 space-y-6"
// //           >
// //             <div className="w-32 h-32 bg-gray-100 mx-auto flex items-center justify-center">
// //               <Search className="w-16 h-16 text-gray-400" />
// //             </div>
// //             <h3 className="text-2xl font-light text-black">Category Not Found</h3>
// //             <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
// //             <Link
// //               href="/shop/all"
// //               className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
// //             >
// //               BROWSE ALL PRODUCTS
// //             </Link>
// //           </motion.div>
// //         ) : (
// //           <>
// //             {/* Controls */}
// //             <motion.div 
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="flex flex-col lg:flex-row gap-4 mb-12 p-6 bg-white border border-gray-200"
// //             >
// //               {/* Category Filter */}
// //               <CategoryFilter
// //                 categories={categories}
// //                 currentCategory={categorySlug}
// //                 onCategoryChange={handleCategoryChange}
// //               />

// //               {/* Search */}
// //               <div className="relative flex-1">
// //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search products..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
// //                 />
// //               </div>

// //               {/* Sort */}
// //               <select
// //                 value={sortBy}
// //                 onChange={(e) => setSortBy(e.target.value as SortBy)}
// //                 className="px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
// //               >
// //                 <option value="name">Sort by Name</option>
// //                 <option value="price-low">Price: Low to High</option>
// //                 <option value="price-high">Price: High to Low</option>
// //               </select>

// //               {/* View Mode */}
// //               <div className="flex bg-gray-100 p-1">
// //                 <button
// //                   onClick={() => setViewMode('grid')}
// //                   className={`flex items-center px-4 py-2 transition-all duration-300 ${
// //                     viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
// //                   }`}
// //                 >
// //                   <Grid3X3 className="w-4 h-4 mr-2" />
// //                   GRID
// //                 </button>
// //                 <button
// //                   onClick={() => setViewMode('list')}
// //                   className={`flex items-center px-4 py-2 transition-all duration-300 ${
// //                     viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
// //                   }`}
// //                 >
// //                   <List className="w-4 h-4 mr-2" />
// //                   LIST
// //                 </button>
// //               </div>
// //             </motion.div>

// //             {/* Products Count */}
// //             <motion.div 
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               className="mb-8"
// //             >
// //               <p className="text-gray-600 font-light">
// //                 Showing <span className="font-medium text-black">{filteredProducts.length}</span> products
// //               </p>
// //             </motion.div>

// //             {/* Products */}
// //             <AnimatePresence mode="wait">
// //               {filteredProducts.length === 0 ? (
// //                 <motion.div 
// //                   initial={{ opacity: 0 }}
// //                   animate={{ opacity: 1 }}
// //                   exit={{ opacity: 0 }}
// //                   className="text-center py-20"
// //                 >
// //                   <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// //                   <h3 className="text-xl font-light text-black mb-2">No products found</h3>
// //                   <p className="text-gray-600 font-light">Try adjusting your search or filters</p>
// //                 </motion.div>
// //               ) : (
// //                 <motion.div
// //                   key={viewMode}
// //                   initial={{ opacity: 0 }}
// //                   animate={{ opacity: 1 }}
// //                   exit={{ opacity: 0 }}
// //                   transition={{ duration: 0.3 }}
// //                 >
// //                   {viewMode === 'grid' ? (
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //                       {filteredProducts.map((product, index) => (
// //                         <ProductCard key={product._id} product={product} index={index} />
// //                       ))}
// //                     </div>
// //                   ) : (
// //                     <div className="space-y-4">
// //                       {filteredProducts.map((product, index) => (
// //                         <ProductListItem key={product._id} product={product} index={index} />
// //                       ))}
// //                     </div>
// //                   )}
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // } 
// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { Product } from '@/types/product';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Loader2, Search, Grid3X3, List, Heart, ChevronDown } from 'lucide-react';

// interface ExtendedProduct extends Product {
//   images?: string[];
//   status?: 'in_stock' | 'out_of_stock';
// }

// interface Category {
//   _id: string;
//   name: string;
// }

// type ViewMode = 'grid' | 'list';
// type SortBy = 'name' | 'price-low' | 'price-high';

// async function fetchProducts(categorySlug: string): Promise<ExtendedProduct[]> {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
//   console.log('API URL:', apiUrl);

//   try {
//     const res = await fetch(`${apiUrl}/api/products?category=${encodeURIComponent(categorySlug)}`, {
//       cache: 'no-store',
//     });
//     if (!res.ok) {
//       console.error(`Failed to fetch products for category ${categorySlug}: ${res.status}`);
//       return [];
//     }
//     const data = await res.json();
//     console.log('API Response:', data);

//     const products = (data.products || []).map((product: ExtendedProduct) => ({
//       ...product,
//       image: product.images?.length ? product.images[0] : product.image || '/images/placeholder.jpg',
//       status: product.status || 'in_stock',
//     }));

//     return products;
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return [];
//   }
// }

// async function fetchCategories(): Promise<Category[]> {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
//   try {
//     const res = await fetch(`${apiUrl}/api/categories`, { cache: 'no-store' });
//     if (!res.ok) {
//       console.error('Failed to fetch categories:', res.status);
//       return [];
//     }
//     const data = await res.json();
//     return data.categories || [];
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return [];
//   }
// }

// const LoadingSkeleton = () => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//     {[...Array(8)].map((_, i) => (
//       <div key={i} className="animate-pulse">
//         <div className="bg-gray-200 h-80 mb-4"></div>
//         <div className="space-y-3">
//           <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
//           <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
//           <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const ProductCard = ({ product, index }: { product: ExtendedProduct; index: number }) => {
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       whileHover={{ y: -8, scale: 1.02 }}
//       className="group relative bg-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200"
//     >
//       <button
//         onClick={() => setIsWishlisted(!isWishlisted)}
//         className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
//       >
//         <Heart
//           className={`w-5 h-5 transition-colors duration-300 ${
//             isWishlisted ? 'fill-black text-black' : 'text-gray-600'
//           }`}
//         />
//       </button>
//       <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
//         <Link href={`/products/${product._id}`}>
//           <Image
//             src={product.image}
//             alt={product.name}
//             fill
//             className="object-cover transition-transform duration-700 group-hover:scale-105"
//             placeholder="blur"
//             blurDataURL="/images/placeholder.jpg"
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//           />
//           {product.status === 'out_of_stock' && (
//             <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
//               <span className="text-white text-lg font-bold uppercase tracking-widest">Sold Out</span>
//             </div>
//           )}
//         </Link>
//         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//       </div>
//       <div className="p-6 space-y-4">
//         <div className="space-y-2">
//           <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
//             {product.name}
//           </h3>
//           <p className="text-sm text-gray-600 line-clamp-1">{product.category}</p>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-xl font-semibold text-black">
//             {new Intl.NumberFormat('vi-VN', {
//               style: 'currency',
//               currency: 'VND',
//               minimumFractionDigits: 0,
//             }).format(product.price)}
//           </p>
//           <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full uppercase tracking-wider">
//             SIZE {product.size}
//           </span>
//         </div>
//         <div className="flex space-x-3 pt-4">
//           <Link
//             href={`/products/${product._id}`}
//             className="flex-1 text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
//           >
//             VIEW PRODUCT
//           </Link>
//           <button
//             className={`px-6 py-3 font-medium transition-all duration-300 ${
//               product.status === 'out_of_stock'
//                 ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
//                 : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
//             }`}
//             disabled={product.status === 'out_of_stock'}
//           >
//             {product.status === 'out_of_stock' ? 'SOLD OUT' : 'ADD TO CART'}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const ProductListItem = ({ product, index }: { product: ExtendedProduct; index: number }) => (
//   <motion.div
//     initial={{ opacity: 0, x: -20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ duration: 0.5, delay: index * 0.1 }}
//     className="group flex items-center space-x-6 p-6 bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
//   >
//     <div className="relative w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
//       <Link href={`/products/${product._id}`}>
//         <Image
//           src={product.image}
//           alt={product.name}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-300"
//           placeholder="blur"
//           blurDataURL="/images/placeholder.jpg"
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//         />
//         {product.status === 'out_of_stock' && (
//           <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
//             <span className="text-white text-sm font-bold uppercase tracking-widest">Sold Out</span>
//           </div>
//         )}
//       </Link>
//     </div>
//     <div className="flex-1 min-w-0">
//       <h3 className="text-lg font-medium text-black truncate">{product.name}</h3>
//       <p className="text-sm text-gray-600 line-clamp-1 mt-1">{product.category}</p>
//       <span className="inline-block text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full uppercase tracking-wider mt-2">
//         SIZE {product.size}
//       </span>
//     </div>
//     <div className="text-right">
//       <p className="text-xl font-semibold text-black">
//         {new Intl.NumberFormat('vi-VN', {
//           style: 'currency',
//           currency: 'VND',
//           minimumFractionDigits: 0,
//         }).format(product.price)}
//       </p>
//       <Link
//         href={`/products/${product._id}`}
//         className="inline-block mt-3 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-300"
//       >
//         VIEW PRODUCT
//       </Link>
//     </div>
//   </motion.div>
// );

// const CategoryFilter = ({ categories, currentCategory, onCategoryChange }: {
//   categories: Category[];
//   currentCategory: string;
//   onCategoryChange: (slug: string) => void;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const displayCategoryName = (slug: string) => {
//     if (slug === 'all') return 'All Products';
//     const categoryMap: { [key: string]: string } = {
//       'coats--jackets': 'Coats & Jackets',
//       'ao-so-mi': 'Áo sơ mi',
//       'quan-linen': 'Quần linen',
//       'vay': 'Váy',
//       'phu-kien': 'Phụ kiện',
//     };
//     const category = categories.find(
//       (cat) =>
//         cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
//         cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
//     );
//     return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
//   };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300 min-w-48"
//       >
//         <span>{displayCategoryName(currentCategory)}</span>
//         <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg z-20 max-h-60 overflow-y-auto"
//           >
//             <button
//               onClick={() => {
//                 onCategoryChange('all');
//                 setIsOpen(false);
//               }}
//               className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
//                 currentCategory === 'all' ? 'bg-gray-100' : ''
//               }`}
//             >
//               All Products
//             </button>
//             {categories.map((category) => {
//               const slug = category.name.toLowerCase().replace(/[\s&]+/g, '--');
//               return (
//                 <button
//                   key={category._id}
//                   onClick={() => {
//                     onCategoryChange(slug);
//                     setIsOpen(false);
//                   }}
//                   className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
//                     currentCategory === slug ? 'bg-gray-100' : ''
//                   }`}
//                 >
//                   {category.name}
//                 </button>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default function ShopPage() {
//   const params = useParams();
//   const categorySlug = params.categorySlug as string;
//   console.log('Category Slug:', categorySlug);

//   const [products, setProducts] = useState<ExtendedProduct[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState<SortBy>('name');
//   const [viewMode, setViewMode] = useState<ViewMode>('grid');

//   const displayCategoryName = (slug: string) => {
//     if (slug === 'all') return 'All Products';
//     const categoryMap: { [key: string]: string } = {
//       'coats--jackets': 'Coats & Jackets',
//       'ao-so-mi': 'Áo sơ mi',
//       'quan-linen': 'Quần linen',
//       'vay': 'Váy',
//       'phu-kien': 'Phụ kiện',
//     };
//     const category = categories.find(
//       (cat) =>
//         cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
//         cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
//     );
//     return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
//   };

//   const handleCategoryChange = (newSlug: string) => {
//     window.location.href = `/shop/${newSlug}`;
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       setError(null);

//       const [fetchedProducts, fetchedCategories] = await Promise.all([
//         fetchProducts(categorySlug),
//         fetchCategories(),
//       ]);

//       setProducts(fetchedProducts);
//       setFilteredProducts(fetchedProducts);
//       setCategories(fetchedCategories);

//       if (fetchedProducts.length === 0 && categorySlug !== 'all') {
//         setError('No products found for this category.');
//       }

//       setLoading(false);
//     };

//     loadData();
//   }, [categorySlug]);

//   useEffect(() => {
//     const filtered = products.filter((product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-low':
//           return a.price - b.price;
//         case 'price-high':
//           return b.price - a.price;
//         case 'name':
//         default:
//           return a.name.localeCompare(b.name);
//       }
//     });

//     setFilteredProducts(filtered);
//   }, [products, searchTerm, sortBy]);

//   const isValidSlug = categorySlug === 'all' || categories.some(
//     (cat) =>
//       cat.name.toLowerCase().replace(/[\s&]+/g, '--') === categorySlug ||
//       cat.name.toLowerCase().replace(/[\s&]+/g, '-') === categorySlug
//   );

//   if (!loading && !isValidSlug && categories.length > 0) {
//     console.log(`Invalid category slug: ${categorySlug}`);
//     setError(`Invalid category slug: ${categorySlug}`);
//   }

//   return (
//     <div className="min-h-screen mt-[200px] text-black bg-white">
//       <div className="container mx-auto px-4 py-8 mt-[120px]">
//         <motion.header
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-16 space-y-4"
//         >
//           <h1 className="text-4xl sm:text-6xl font-light text-black capitalize tracking-wider">
//             {displayCategoryName(categorySlug)}
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
//             Explore our curated collection of high-quality items
//           </p>
//           <div className="w-24 h-px bg-black mx-auto"></div>
//         </motion.header>

//         {loading ? (
//           <div className="text-center py-16 space-y-6">
//             <Loader2 className="w-12 h-12 animate-spin text-black mx-auto" />
//             <p className="text-xl text-gray-600 font-light">Loading products...</p>
//             <LoadingSkeleton />
//           </div>
//         ) : error ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-20 space-y-6"
//           >
//             <div className="w-32 h-32 bg-gray-100 mx-auto flex items-center justify-center">
//               <Search className="w-16 h-16 text-gray-400" />
//             </div>
//             <h3 className="text-2xl font-light text-black">Category Not Found</h3>
//             <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
//             <Link
//               href="/shop/all"
//               className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
//             >
//               BROWSE ALL PRODUCTS
//             </Link>
//           </motion.div>
//         ) : (
//           <>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex flex-col lg:flex-row gap-4 mb-12 p-6 bg-white border border-gray-200"
//             >
//               <CategoryFilter
//                 categories={categories}
//                 currentCategory={categorySlug}
//                 onCategoryChange={handleCategoryChange}
//               />
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
//                 />
//               </div>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as SortBy)}
//                 className="px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//               </select>
//               <div className="flex bg-gray-100 p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`flex items-center px-4 py-2 transition-all duration-300 ${
//                     viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
//                   }`}
//                 >
//                   <Grid3X3 className="w-4 h-4 mr-2" />
//                   GRID
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`flex items-center px-4 py-2 transition-all duration-300 ${
//                     viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
//                   }`}
//                 >
//                   <List className="w-4 h-4 mr-2" />
//                   LIST
//                 </button>
//               </div>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="mb-8"
//             >
//               <p className="text-gray-600 font-light">
//                 Showing <span className="font-medium text-black">{filteredProducts.length}</span> products
//               </p>
//             </motion.div>
//             <AnimatePresence mode="wait">
//               {filteredProducts.length === 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-center py-20"
//                 >
//                   <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-light text-black mb-2">No products found</h3>
//                   <p className="text-gray-600 font-light">Try adjusting your search or filters</p>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key={viewMode}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {viewMode === 'grid' ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                       {filteredProducts.map((product, index) => (
//                         <ProductCard key={product._id} product={product} index={index} />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {filteredProducts.map((product, index) => (
//                         <ProductListItem key={product._id} product={product} index={index} />
//                       ))}
//                     </div>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Grid3X3, List, Heart, ChevronDown } from 'lucide-react';

interface ExtendedProduct extends Product {
  images?: string[];
  status?: 'in_stock' | 'out_of_stock';
}

interface Category {
  _id: string;
  name: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'price-low' | 'price-high';

async function fetchProducts(categorySlug: string): Promise<ExtendedProduct[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  console.log('API URL:', apiUrl);

  try {
    const res = await fetch(`${apiUrl}/api/products?category=${encodeURIComponent(categorySlug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Failed to fetch products for category ${categorySlug}: ${res.status}`);
      return [];
    }
    const data = await res.json();
    console.log('API Response:', data);

    const products = (data.products || []).map((product: ExtendedProduct) => ({
      ...product,
      image: product.images?.length ? product.images[0] : product.image || '/images/placeholder.jpg',
      status: product.status || 'in_stock',
    }));

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/api/categories`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch categories:', res.status);
      return [];
    }
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 h-80 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

const ProductCard = ({ product, index }: { product: ExtendedProduct; index: number }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200"
    >
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-300 ${
            isWishlisted ? 'fill-black text-black' : 'text-gray-600'
          }`}
        />
      </button>
      <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="/images/placeholder.jpg"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.status === 'out_of_stock' && (
            <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
              <span className="text-white text-lg font-bold uppercase tracking-widest">Hết Hàng</span>
            </div>
          )}
        </Link>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1">{product.category}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-black">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
            }).format(product.price)}
          </p>
          <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full uppercase tracking-wider">
            SIZE {product.size}
          </span>
        </div>
        <div className="flex space-x-3 pt-4">
          <Link
            href={`/products/${product._id}`}
            className="flex-1 text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
          >
            XEM SẢN PHẨM
          </Link>
          <button
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              product.status === 'out_of_stock'
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
            disabled={product.status === 'out_of_stock'}
          >
            {product.status === 'out_of_stock' ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProductListItem = ({ product, index }: { product: ExtendedProduct; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group flex items-center space-x-6 p-6 bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
  >
    <div className="relative w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
      <Link href={`/products/${product._id}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL="/images/placeholder.jpg"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
            <span className="text-white text-sm font-bold uppercase tracking-widest">Hết Hàng</span>
          </div>
        )}
      </Link>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-medium text-black truncate">{product.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-1 mt-1">{product.category}</p>
      <span className="inline-block text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full uppercase tracking-wider mt-2">
        SIZE {product.size}
      </span>
    </div>
    <div className="text-right">
      <p className="text-xl font-semibold text-black">
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
        }).format(product.price)}
      </p>
      <Link
        href={`/products/${product._id}`}
        className="inline-block mt-3 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-300"
      >
        XEM SẢN PHẨM
      </Link>
    </div>
  </motion.div>
);

const CategoryFilter = ({ categories, currentCategory, onCategoryChange }: {
  categories: Category[];
  currentCategory: string;
  onCategoryChange: (slug: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayCategoryName = (slug: string) => {
    if (slug === 'all') return 'Tất Cả Sản Phẩm';
    const categoryMap: { [key: string]: string } = {
      'coats--jackets': 'Áo Khoác',
      'ao-so-mi': 'Áo Sơ Mi',
      'quan-linen': 'Quần Linen',
      'vay': 'Váy',
      'phu-kien': 'Phụ Kiện',
    };
    const category = categories.find(
      (cat) =>
        cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
        cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
    );
    return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300 min-w-48"
      >
        <span>{displayCategoryName(currentCategory)}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg z-20 max-h-60 overflow-y-auto"
          >
            <button
              onClick={() => {
                onCategoryChange('all');
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                currentCategory === 'all' ? 'bg-gray-100' : ''
              }`}
            >
              Tất Cả Sản Phẩm
            </button>
            {categories.map((category) => {
              const slug = category.name.toLowerCase().replace(/[\s&]+/g, '--');
              return (
                <button
                  key={category._id}
                  onClick={() => {
                    onCategoryChange(slug);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                    currentCategory === slug ? 'bg-gray-100' : ''
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ShopPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  console.log('Category Slug:', categorySlug);

  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const displayCategoryName = (slug: string) => {
    if (slug === 'all') return 'Tất Cả Sản Phẩm';
    const categoryMap: { [key: string]: string } = {
      'coats--jackets': 'Áo Khoác',
      'ao-so-mi': 'Áo Sơ Mi',
      'quan-linen': 'Quần Linen',
      'vay': 'Váy',
      'phu-kien': 'Phụ Kiện',
    };
    const category = categories.find(
      (cat) =>
        cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
        cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
    );
    return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleCategoryChange = (newSlug: string) => {
    window.location.href = `/shop/${newSlug}`;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const [fetchedProducts, fetchedCategories] = await Promise.all([
        fetchProducts(categorySlug),
        fetchCategories(),
      ]);

      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setCategories(fetchedCategories);

      if (fetchedProducts.length === 0 && categorySlug !== 'all') {
        setError('Không tìm thấy sản phẩm nào trong danh mục này.');
      }

      setLoading(false);
    };

    loadData();
  }, [categorySlug]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  const isValidSlug = categorySlug === 'all' || categories.some(
    (cat) =>
      cat.name.toLowerCase().replace(/[\s&]+/g, '--') === categorySlug ||
      cat.name.toLowerCase().replace(/[\s&]+/g, '-') === categorySlug
  );

  if (!loading && !isValidSlug && categories.length > 0) {
    console.log(`Invalid category slug: ${categorySlug}`);
    setError(`Danh mục không hợp lệ: ${categorySlug}`);
  }

  return (
    <div className="min-h-screen mt-[200px] text-black bg-white">
      <div className="container mx-auto px-4 py-8 mt-[120px]">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl font-light text-black capitalize tracking-wider">
            {displayCategoryName(categorySlug)}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Khám phá bộ sưu tập sản phẩm chất lượng cao của chúng tôi
          </p>
          <div className="w-24 h-px bg-black mx-auto"></div>
        </motion.header>

        {loading ? (
          <div className="text-center py-16 space-y-6">
            <Loader2 className="w-12 h-12 animate-spin text-black mx-auto" />
            <p className="text-xl text-gray-600 font-light">Đang tải sản phẩm...</p>
            <LoadingSkeleton />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-6"
          >
            <div className="w-32 h-32 bg-gray-100 mx-auto flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-light text-black">Không Tìm Thấy Danh Mục</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
            <Link
              href="/shop/all"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
            >
              XEM TẤT CẢ SẢN PHẨM
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-4 mb-12 p-6 bg-white border border-gray-200"
            >
              <CategoryFilter
                categories={categories}
                currentCategory={categorySlug}
                onCategoryChange={handleCategoryChange}
              />
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 bg-white"
              >
                <option value="name">Sắp xếp theo Tên</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
              </select>
              <div className="flex bg-gray-100 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center px-4 py-2 transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  LƯỚI
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-4 py-2 transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  DANH SÁCH
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <p className="text-gray-600 font-light">
                Hiển thị <span className="font-medium text-black">{filteredProducts.length}</span> sản phẩm
              </p>
            </motion.div>
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-light text-black mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-600 font-light">Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc</p>
                </motion.div>
              ) : (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {filteredProducts.map((product, index) => (
                        <ProductCard key={product._id} product={product} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts.map((product, index) => (
                        <ProductListItem key={product._id} product={product} index={index} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}