// // import Link from "next/link";
// // import Image from "next/image";
// // import { Search } from "lucide-react";

// // interface Product {
// //   _id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   image: string;
// //   category: string;
// //   collection: string;
// // }

// // interface ExtendedProduct extends Product {
// //   images?: string[];
// // }

// // interface CollectionPageProps {
// //   params: Promise<{ collectionSlug: string }>;
// // }

// // async function fetchProducts(collectionSlug: string): Promise<ExtendedProduct[]> {
// //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
// //   console.log("Fetching products for collection:", collectionSlug);
// //   try {
// //     const res = await fetch(`${apiUrl}/api/products?collection=${encodeURIComponent(collectionSlug)}`, {
// //       cache: "no-store",
// //     });
// //     if (!res.ok) {
// //       console.error(`Failed to fetch products for collection ${collectionSlug}: ${res.status}`);
// //       return [];
// //     }
// //     const data = await res.json();
// //     console.log("API Response:", data);
// //     const products = (data.products || []).map((product: ExtendedProduct) => ({
// //       ...product,
// //       image: product.images?.length ? product.images[0] : product.image || "/images/placeholder.jpg",
// //     }));
// //     return products;
// //   } catch (error) {
// //     console.error("Error fetching products:", error);
// //     return [];
// //   }
// // }

// // async function fetchCollectionName(collectionSlug: string): Promise<string> {
// //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
// //   try {
// //     const res = await fetch(`${apiUrl}/api/collections`, { cache: "no-store" });
// //     if (!res.ok) {
// //       console.error(`Failed to fetch collections: ${res.status}`);
// //       return collectionSlug.replace(/--/g, " ");
// //     }
// //     const data = await res.json();
// //     const collection = data.collections.find(
// //       (col: { name: string }) => createSlug(col.name) === collectionSlug
// //     );
// //     return collection ? collection.name : collectionSlug.replace(/--/g, " ");
// //   } catch (error) {
// //     console.error("Error fetching collection name:", error);
// //     return collectionSlug.replace(/--/g, " ");
// //   }
// // }

// // const createSlug = (name: string) => {
// //   return name
// //     .toLowerCase()
// //     .normalize("NFD")
// //     .replace(/[\u0300-\u036f]/g, "")
// //     .replace(/[\s&]+/g, "--")
// //     .replace(/[^a-z0-9-]/g, "");
// // };

// // const ProductCard = ({ product }: { product: ExtendedProduct }) => {
// //   return (
// //     <div className="group relative bg-white rounded-none shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200">
// //       {/* Product Image */}
// //       <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
// //         <Image
// //           src={product.image}
// //           alt={product.name}
// //           fill
// //           className="object-cover transition-transform duration-700 group-hover:scale-105"
// //           placeholder="blur"
// //           blurDataURL="/images/placeholder.jpg"
// //           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
// //           onError={() => {
// //             console.error(`Failed to load image for product: ${product.name}, URL: ${product.image}`);
// //           }}
// //         />
// //         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
// //       </div>

// //       {/* Product Info */}
// //       <div className="p-6 space-y-4">
// //         <div className="space-y-2">
// //           <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
// //             {product.name}
// //           </h3>
// //           <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
// //             {product.description}
// //           </p>
// //         </div>

// //         {/* Price */}
// //         <div className="flex items-center justify-between">
// //           <p className="text-xl font-semibold text-black">
// //             {new Intl.NumberFormat("vi-VN", {
// //               style: "currency",
// //               currency: "VND",
// //               minimumFractionDigits: 0,
// //             }).format(product.price)}
// //           </p>
// //           <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full uppercase tracking-wider">
// //             {product.category}
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
// //           <button className="px-6 py-3 bg-white text-black border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300">
// //             ADD TO CART
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default async function CollectionPage({ params }: CollectionPageProps) {
// //   const { collectionSlug } = await params; // Unwrap the Promise
// //   const products = await fetchProducts(collectionSlug);
// //   const collectionName = await fetchCollectionName(collectionSlug);
// //   const error = products.length === 0 ? `No products found in the "${collectionName}" collection.` : null;

// //   return (
// //     <div className="min-h-screen text-black bg-white">
// //       <div className="container mx-auto px-4 py-8 mt-[120px]">
// //         {/* Header */}
// //         <div className="text-center mb-16 space-y-4">
// //           <h1 className="text-4xl sm:text-6xl font-light text-black capitalize tracking-wider">
// //             {collectionName || "Collection"}
// //           </h1>
// //           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
// //             Discover our carefully curated selection of premium products
// //           </p>
// //           <div className="w-24 h-px bg-black mx-auto"></div>
// //         </div>

// //         {error ? (
// //           <div className="text-center py-20 space-y-6">
// //             <div className="w-32 h-32 bg-gray-100 mx-auto flex items-center justify-center">
// //               <Search className="w-16 h-16 text-gray-400" />
// //             </div>
// //             <h3 className="text-2xl font-light text-black">Collection Empty</h3>
// //             <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
// //             <Link
// //               href="/shop/all"
// //               className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
// //             >
// //               EXPLORE ALL PRODUCTS
// //             </Link>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Products Count */}
// //             <div className="mb-8">
// //               <p className="text-gray-600 font-light">
// //                 Showing <span className="font-medium text-black">{products.length}</span> products
// //               </p>
// //             </div>

// //             {/* Products (Grid View Only) */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //               {products.map((product) => (
// //                 <ProductCard key={product._id} product={product} />
// //               ))}
// //             </div>
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
// import { motion, AnimatePresence } from 'framer-motion';
// import { Loader2, Search, Grid3X3, List, Heart, ChevronDown } from 'lucide-react';

// interface ExtendedProduct {
//   _id: string;
//   name: string;
//   image: string;
//   category: string;
//   price: number;
//   size: string;
//   images?: string[];
//   status?: 'in_stock' | 'out_of_stock';
// }

// interface Collection {
//   _id: string;
//   name: string;
// }

// type ViewMode = 'grid' | 'list';
// type SortBy = 'name' | 'price-low' | 'price-high';

// async function fetchProducts(collectionSlug: string): Promise<ExtendedProduct[]> {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
//   try {
//     const res = await fetch(`${apiUrl}/api/products?collection=${encodeURIComponent(collectionSlug)}`, {
//       cache: 'no-store',
//     });
//     if (!res.ok) {
//       console.error(`Failed to fetch products for collection ${collectionSlug}: ${res.status}`);
//       return [];
//     }
//     const data = await res.json();
//     return (data.products || []).map((product: ExtendedProduct) => ({
//       ...product,
//       image: product.images?.length ? product.images[0] : product.image || '/images/placeholder.jpg',
//       status: product.status || 'in_stock',
//     }));
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return [];
//   }
// }

// async function fetchCollections(): Promise<Collection[]> {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
//   try {
//     const res = await fetch(`${apiUrl}/api/collections`, { cache: 'no-store' });
//     if (!res.ok) {
//       console.error('Failed to fetch collections:', res.status);
//       return [];
//     }
//     const data = await res.json();
//     return data.collections || [];
//   } catch (error) {
//     console.error('Error fetching collections:', error);
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

// const CollectionFilter = ({ collections, currentCollection, onCollectionChange }: {
//   collections: Collection[];
//   currentCollection: string;
//   onCollectionChange: (slug: string) => void;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const displayCollectionName = (slug: string) => {
//     if (slug === 'all') return 'All Collections';
//     const collection = collections.find(
//       (col) => col.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
//     );
//     return collection ? collection.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
//   };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300 min-w-48"
//       >
//         <span>{displayCollectionName(currentCollection)}</span>
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
//                 onCollectionChange('all');
//                 setIsOpen(false);
//               }}
//               className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
//                 currentCollection === 'all' ? 'bg-gray-100' : ''
//               }`}
//             >
//               All Collections
//             </button>
//             {collections.map((collection) => {
//               const slug = collection.name.toLowerCase().replace(/[\s&]+/g, '-');
//               return (
//                 <button
//                   key={collection._id}
//                   onClick={() => {
//                     onCollectionChange(slug);
//                     setIsOpen(false);
//                   }}
//                   className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
//                     currentCollection === slug ? 'bg-gray-100' : ''
//                   }`}
//                 >
//                   {collection.name}
//                 </button>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default function CollectionPage() {
//   const params = useParams();
//   const collectionSlug = params.collectionSlug as string;
//   const [products, setProducts] = useState<ExtendedProduct[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState<SortBy>('name');
//   const [viewMode, setViewMode] = useState<ViewMode>('grid');

//   const displayCollectionName = (slug: string) => {
//     if (slug === 'all') return 'All Collections';
//     const collection = collections.find(
//       (col) => col.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
//     );
//     return collection ? collection.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
//   };

//   const handleCollectionChange = (newSlug: string) => {
//     window.location.href = `/collections/${newSlug}`;
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       setError(null);

//       const [fetchedProducts, fetchedCollections] = await Promise.all([
//         fetchProducts(collectionSlug),
//         fetchCollections(),
//       ]);

//       setProducts(fetchedProducts);
//       setFilteredProducts(fetchedProducts);
//       setCollections(fetchedCollections);

//       if (fetchedProducts.length === 0 && collectionSlug !== 'all') {
//         setError('No products found for this collection.');
//       }

//       setLoading(false);
//     };

//     loadData();
//   }, [collectionSlug]);

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

//   const isValidSlug = collectionSlug === 'all' || collections.some(
//     (col) => col.name.toLowerCase().replace(/[\s&]+/g, '-') === collectionSlug
//   );

//   if (!loading && !isValidSlug && collections.length > 0) {
//     console.log(`Invalid collection slug: ${collectionSlug}`);
//     setError(`Invalid collection slug: ${collectionSlug}`);
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
//             {displayCollectionName(collectionSlug)}
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
//             <h3 className="text-2xl font-light text-black">Collection Not Found</h3>
//             <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
//             <Link
//               href="/collections/all"
//               className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
//             >
//               BROWSE ALL COLLECTIONS
//             </Link>
//           </motion.div>
//         ) : (
//           <>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex flex-col lg:flex-row gap-4 mb-12 p-6 bg-white border border-gray-200"
//             >
//               <CollectionFilter
//                 collections={collections}
//                 currentCollection={collectionSlug}
//                 onCollectionChange={handleCollectionChange}
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
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Grid3X3, List, Heart, ChevronDown } from 'lucide-react';

interface ExtendedProduct {
  _id: string;
  name: string;
  image: string;
  category: string;
  collection: string;
  price: number;
  size: string;
  images?: string[];
  status?: 'in_stock' | 'out_of_stock';
}

interface Collection {
  _id: string;
  name: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'price-low' | 'price-high';

async function fetchProducts(collectionSlug: string): Promise<ExtendedProduct[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/api/products?collection=${encodeURIComponent(collectionSlug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Failed to fetch products for collection ${collectionSlug}: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return (data.products || []).map((product: ExtendedProduct) => ({
      ...product,
      image: product.images?.length ? product.images[0] : product.image || '/images/placeholder.jpg',
      status: product.status || 'in_stock',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function fetchCollections(): Promise<Collection[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/api/collections`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch collections:', res.status);
      return [];
    }
    const data = await res.json();
    return data.collections || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
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

const CollectionFilter = ({ collections, currentCollection, onCollectionChange }: {
  collections: Collection[];
  currentCollection: string;
  onCollectionChange: (slug: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayCollectionName = (slug: string) => {
    if (slug === 'all') return 'Tất Cả Bộ Sưu Tập';
    const collection = collections.find(
      (col) => col.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
    );
    return collection ? collection.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300 min-w-48"
      >
        <span>{displayCollectionName(currentCollection)}</span>
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
                onCollectionChange('all');
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                currentCollection === 'all' ? 'bg-gray-100' : ''
              }`}
            >
              Tất Cả Bộ Sưu Tập
            </button>
            {collections.map((collection) => {
              const slug = collection.name.toLowerCase().replace(/[\s&]+/g, '-');
              return (
                <button
                  key={collection._id}
                  onClick={() => {
                    onCollectionChange(slug);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                    currentCollection === slug ? 'bg-gray-100' : ''
                  }`}
                >
                  {collection.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CollectionPage() {
  const params = useParams();
  const collectionSlug = params.collectionSlug as string;
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const displayCollectionName = (slug: string) => {
    if (slug === 'all') return 'Tất Cả Bộ Sưu Tập';
    const collection = collections.find(
      (col) => col.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
    );
    return collection ? collection.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleCollectionChange = (newSlug: string) => {
    window.location.href = `/collections/${newSlug}`;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const [fetchedProducts, fetchedCollections] = await Promise.all([
        fetchProducts(collectionSlug),
        fetchCollections(),
      ]);

      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setCollections(fetchedCollections);

      if (fetchedProducts.length === 0 && collectionSlug !== 'all') {
        setError('Không tìm thấy sản phẩm nào trong bộ sưu tập này.');
      }

      setLoading(false);
    };

    loadData();
  }, [collectionSlug]);

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

  const isValidSlug = collectionSlug === 'all' || collections.some(
    (col) => col.name.toLowerCase().replace(/[\s&]+/g, '-') === collectionSlug
  );

  if (!loading && !isValidSlug && collections.length > 0) {
    console.log(`Invalid collection slug: ${collectionSlug}`);
    setError(`Bộ sưu tập không hợp lệ: ${collectionSlug}`);
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
            {displayCollectionName(collectionSlug)}
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
            <h3 className="text-2xl font-light text-black">Không Tìm Thấy Bộ Sưu Tập</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
            <Link
              href="/collections/all"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
            >
              XEM TẤT CẢ BỘ SƯU TẬP
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-4 mb-12 p-6 bg-white border border-gray-200"
            >
              <CollectionFilter
                collections={collections}
                currentCollection={collectionSlug}
                onCollectionChange={handleCollectionChange}
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