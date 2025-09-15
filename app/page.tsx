
// "use client";

// import { useState, useEffect, useRef, useMemo } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import Head from "next/head";
// import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
// import { useCart } from "@/lib/CartContext";
// import { cinzel, lora } from "@/lib/fonts";

// // Define Product interface
// interface Product {
//   id: string;
//   name: string;
//   image: string;
//   size: string;
//   description: string;
//   category: string;
//   collection?: string;
//   price: number;
//   discount?: number | null;
//   images: string[];
//   createdAt: string;
//   isNew?: boolean;
//   isFeatured?: boolean;
// }

// // Define API Product interface for raw API data
// interface ApiProduct {
//   _id: string;
//   name: string;
//   images: string[];
//   size: string;
//   description: string;
//   category: string;
//   collection?: string;
//   price: number;
//   discount?: number | null;
//   createdAt: string;
// }

// // Define Collection interface
// interface Collection {
//   name: string;
// }

// // Banner slider data
// const banners = [
//   {
//     src: "/images/banner1.png",
//     title: "Refined Elegance",
//     description: "Curated collections that epitomize modern sophistication",
//     buttonText: "Discover Now",
//     link: "/collections/new",
//   },
//   {
//     src: "/images/banner2.png",
//     title: "Monochrome Mastery",
//     description: "Bold contrasts that define contemporary aesthetics",
//     buttonText: "Explore",
//     link: "/collections/summer",
//   },
//   {
//     src: "/images/banner3.png",
//     title: "Limited Edition",
//     description: "Exclusive pieces available for a limited time only",
//     buttonText: "Shop Sale",
//     link: "/collections/sale",
//   },
// ];

// // Category showcase data
// const categories = [
//   {
//     title: "Archive Collection",
//     image: "/images/archive.png",
//     link: "/collections/archive",
//     description: "Timeless pieces inspired by vintage aesthetics",
//   },
//   {
//     title: "Blockcore Collection",
//     image: "/images/blockcore.png",
//     link: "/collections/blockcore",
//     description: "Bold, modern designs for the urban trendsetter",
//   },
//   {
//     title: "Vintage Collection",
//     image: "/images/vintage.png",
//     link: "/collections/vintage",
//     description: "Classic styles reimagined for today's fashion",
//   },
// ];

// // Testimonials data with curly quotes
// const testimonials = [
//   {
//     name: "Sophie Laurent",
//     role: "Fashion Blogger",
//     quote: "The attention to detail and quality of fabrics is unmatched. Every piece tells a story of craftsmanship.",
//   },
//   {
//     name: "Alex Chen",
//     role: "Creative Director",
//     quote: "This brand has redefined what minimalist elegance means in contemporary fashion. Simply outstanding.",
//   },
//   {
//     name: "Emma Rodriguez",
//     role: "Style Influencer",
//     quote: "The designs have a timeless quality that transcends seasonal trends. A must-have for any wardrobe.",
//   },
// ];

// // Skeleton component
// const ProductSkeleton = () => (
//   <div className="animate-pulse group">
//     <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
//     <div className="mt-4">
//       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//       <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
//     </div>
//   </div>
// );

// function HomePage() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [testimonialIndex, setTestimonialIndex] = useState(0);
//   const [cartNotification, setCartNotification] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [wishlist, setWishlist] = useState<Set<string>>(new Set());
//   const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState<string>("");
//   const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
//   const [showBackToTop, setShowBackToTop] = useState(false);
//   const bannerRef = useRef<HTMLDivElement>(null);
//   const [language, setLanguage] = useState<'vi' | 'en'>('vi');
//   const { addToCart } = useCart();

//   // Animation variants
//   const fadeInUp = {
//     initial: { y: 30, opacity: 0 },
//     animate: { y: 0, opacity: 1 },
//     transition: { duration: 0.6, ease: "easeOut" },
//   };

//   const productHover = {
//     hover: {
//       scale: 1.03,
//       transition: { duration: 0.4, ease: "easeOut" },
//     },
//   };

//   const staggerChildren = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const fadeInItem = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

//   // Hàm tạo slug từ tên bộ sưu tập
//   const createSlug = (name: string) => {
//     return name
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "")
//       .replace(/[\s&]+/g, "--")
//       .replace(/[^a-z0-9-]/g, "");
//   };

//   // Sync language
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
//     if (savedLanguage) {
//       setLanguage(savedLanguage);
//     }

//     const handleLanguageChange = (event: CustomEvent) => {
//       setLanguage(event.detail.language);
//     };

//     window.addEventListener('languageChange', handleLanguageChange as EventListener);
//     return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
//   }, []);

//   // Handle scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowBackToTop(window.scrollY > 300);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Fetch collections
//   useEffect(() => {
//     async function fetchCollections() {
//       try {
//         const response = await fetch("/api/collections", { cache: 'no-store' });
//         if (!response.ok) throw new Error("Failed to fetch collections");
//         const data = await response.json();
//         setCollections(data.collections || []);
//       } catch (error) {
//         console.error('Error fetching collections:', error);
//         setCollections([
//           { name: 'Archive' },
//           { name: 'Blockcore' },
//           { name: 'Vintage' },
//         ]);
//       }
//     }
//     fetchCollections();
//   }, []);

//   // Fetch products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/products");
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();
//         const mappedProducts: Product[] = data.products.map((product: ApiProduct) => ({
//           id: product._id.toString(),
//           name: product.name,
//           image: product.images[0] || "/placeholder/300x400",
//           size: product.size,
//           description: product.description,
//           category: product.category,
//           collection: product.collection,
//           price: product.price,
//           discount: product.discount,
//           images: product.images,
//           createdAt: product.createdAt,
//           isNew: new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           isFeatured: !!product.discount,
//         }));
//         setProducts(mappedProducts);
//       } catch {
//         setError("Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProducts();
//   }, []);

//   // Autoplay banner
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % banners.length);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   // Autoplay testimonials
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Preload images
//   useEffect(() => {
//     banners.forEach((banner) => {
//       const img = new window.Image();
//       img.src = banner.src;
//     });
//     categories.forEach((category) => {
//       const img = new window.Image();
//       img.src = category.image;
//     });
//     products.forEach((product) => {
//       const img = new window.Image();
//       img.src = product.image;
//     });
//   }, [products]);

//   // Memoized filtered products
//   const filteredProducts = useMemo(() => {
//     if (activeTab === "all") {
//       return products;
//     }
//     if (activeTab === "featured") {
//       return products.filter((product) => product.isFeatured);
//     }
//     const collectionName = collections.find((col) => createSlug(col.name) === activeTab)?.name;
//     if (collectionName) {
//       return products.filter((product) =>
//         product.collection?.toLowerCase() === collectionName.toLowerCase()
//       );
//     }
//     return [];
//   }, [activeTab, products, collections]);

//   // Handlers
//   const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
//     e?.preventDefault();
//     e?.stopPropagation();
//     setWishlist((prev) => {
//       const newWishlist = new Set(prev);
//       if (newWishlist.has(productId)) {
//         newWishlist.delete(productId);
//       } else {
//         newWishlist.add(productId);
//       }
//       return newWishlist;
//     });
//   };

//   const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
//   const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
//   const goToSlide = (index: number) => setCurrentIndex(index);

//   const addToCartHandler = (product: Product, quantity: number = 1, size: string = "", e?: React.MouseEvent) => {
//     e?.preventDefault();
//     e?.stopPropagation();
//     addToCart({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       quantity,
//       size,
//     });
//     setCartNotification(true);
//     setTimeout(() => setCartNotification(false), 3000);
//   };

//   const openQuickView = (product: Product, e?: React.MouseEvent) => {
//     e?.preventDefault();
//     e?.stopPropagation();
//     setQuickViewProduct(product);
//     setQuantity(1);
//     setSelectedSize("");
//     document.body.style.overflow = "hidden";
//   };

//   const closeQuickView = () => {
//     setQuickViewProduct(null);
//     setSelectedSize("");
//     document.body.style.overflow = "auto";
//   };

//   const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
//   const increaseQuantity = () => setQuantity((prev) => prev + 1);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Structured data for SEO
//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "WebPage",
//     name: "WEATHERED | Premium Fashion Collections",
//     description: "Discover premium fashion collections with a timeless vintage and archive aesthetic.",
//     publisher: {
//       "@type": "Organization",
//       name: "WEATHERED",
//       logo: {
//         "@type": "ImageObject",
//         url: "/images/logo.png",
//       },
//     },
//     potentialAction: {
//       "@type": "SearchAction",
//       target: "/search?q={search_term_string}",
//       "query-input": "required name=search_term_string",
//     },
//   };

//   return (
//     <>
//       <Head>
//         <title>WEATHERED | Premium Fashion Collections</title>
//         <meta
//           name="description"
//           content="Discover premium fashion collections with a timeless vintage and archive aesthetic."
//         />
//         <meta name="keywords" content="fashion, luxury, vintage, archive, weathered, premium" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
//       </Head>

//       <div className={`bg-white mt-[50px] ${cinzel.variable} ${lora.variable}`}>
//         {/* Hero Banner Slider */}
//         <div className="relative w-full h-screen max-h-[90vh] overflow-hidden">
//           <div
//             ref={bannerRef}
//             className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
//             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           >
//             {banners.map((banner, index) => (
//               <motion.div
//                 key={index}
//                 className="relative w-full h-full flex-shrink-0"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.8 }}
//               >
//                 <Image
//                   src={banner.src}
//                   alt={banner.title}
//                   fill
//                   priority={index === 0}
//                   sizes="100vw"
//                   className="object-cover w-full h-full"
//                   style={{
//                     transform: currentIndex === index ? "scale(1.05)" : "scale(1)",
//                     transition: "transform 10s ease-out",
//                   }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-center">
//                   <div className="container max-w-7xl mx-auto px-4">
//                     <motion.div
//                       className="max-w-md text-white"
//                       initial={{ opacity: 0, x: -50 }}
//                       animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : -50 }}
//                       transition={{ duration: 0.8, delay: 0.3 }}
//                     >
//                       <p className="text-xs uppercase tracking-widest mb-3 font-light">
//                         {language === 'vi' ? 'Xuân/Hè 2025' : 'Spring/Summer 2025'}
//                       </p>
//                       <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 leading-tight">
//                         {banner.title}
//                       </h1>
//                       <p className="text-base md:text-lg mb-8 font-light">{banner.description}</p>
//                       <Link
//                         href={banner.link}
//                         className="group inline-block px-8 py-3 border border-white text-white text-sm uppercase tracking-widest font-light hover:bg-white hover:text-black transition-all duration-300"
//                       >
//                         {banner.buttonText}
//                         <ArrowRight
//                           size={18}
//                           className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
//                         />
//                       </Link>
//                     </motion.div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Navigation Arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white hover:text-black transition-all duration-300 z-10 text-white"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white hover:text-black transition-all duration-300 z-10 text-white"
//             aria-label="Next slide"
//           >
//             <ChevronRight size={24} />
//           </button>

//           {/* Slide Indicators */}
//           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
//             {banners.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`h-2 rounded-full transition-all duration-300 ${
//                   currentIndex === index ? "bg-white w-12" : "bg-white/50 w-2"
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Unique Selling Points */}
//         <div className="bg-white text-black py-16 border-b border-gray-100">
//           <div className="container max-w-7xl mx-auto px-4">
//             <motion.div
//               className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-8 md:gap-12"
//               variants={staggerChildren}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true }}
//             >
//               {[
//                 {
//                   title: language === 'vi' ? 'Vintage Tuyển Chọn' : 'Curated Vintage Finds',
//                   description: language === 'vi'
//                     ? 'Mỗi sản phẩm được tuyển chọn kỹ lưỡng từ các bộ sưu tập vintage uy tín, đảm bảo tính nguyên bản và giá trị thẩm mỹ.'
//                     : 'Each item is carefully sourced from trusted vintage collections, ensuring authenticity and aesthetic value.',
//                   icon: (
//                     <svg className="h-8 w-8 mx-auto text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                             d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                     </svg>
//                   ),
//                 },
//                 {
//                   title: language === 'vi' ? 'Giao Hàng Cẩn Thận' : 'Carefully Handled Shipping',
//                   description: language === 'vi'
//                     ? 'Giao hàng toàn quốc và quốc tế. Miễn phí vận chuyển với đơn hàng từ 500.000đ. Đóng gói an toàn, theo tiêu chuẩn thương hiệu.'
//                     : 'Nationwide and international delivery. Free shipping on orders from 500,000 VND. Secure packaging meets brand standards.',
//                   icon: (
//                     <svg className="h-8 w-8 mx-auto text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                             d="M3 9.75L12 4.5l9 5.25M3 9.75v4.5l9 5.25 9-5.25v-4.5M3 14.25l9-5.25 9 5.25" />
//                     </svg>
//                   ),
//                 },
//                 {
//                   title: language === 'vi' ? 'Thời Trang Có Tính Kết Nối' : 'Fashion With a Story',
//                   description: language === 'vi'
//                     ? 'Chúng tôi đề cao thời trang tuần hoàn – sử dụng lại, giảm lãng phí và thúc đẩy tiêu dùng có trách nhiệm.'
//                     : 'We promote circular fashion – reuse, reduce waste, and encourage responsible consumption.',
//                   icon: (
//                     <svg className="h-8 w-8 mx-auto text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                             d="M4.5 9.75A7.5 7.5 0 0112 4.5c2.623 0 4.934 1.35 6.3 3.375M19.5 14.25A7.5 7.5 0 0112 19.5a7.5 7.5 0 01-6.3-3.375M15 9l3-3m0 0l-3-3m3 3H9" />
//                     </svg>
//                   ),
//                 },
//               ].map((usp, index) => (
//                 <motion.div
//                   key={index}
//                   className="text-center"
//                   variants={fadeInItem}
//                 >
//                   <div className="mb-4">{usp.icon}</div>
//                   <h3 className="text-lg font-cinzel font-medium mb-2">{usp.title}</h3>
//                   <p className="text-gray-600 text-sm font-light">{usp.description}</p>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>

//         {/* Shop by Collection */}
//         <div className="py-24 bg-[#f9f9f9]">
//           <div className="container max-w-7xl mx-auto px-4">
//             <motion.div
//               className="text-center mb-16"
//               {...fadeInUp}
//               viewport={{ once: true }}
//             >
//               <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
//                 {language === 'vi' ? 'Khám Phá' : 'Explore'}
//               </span>
//               <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
//                 {language === 'vi' ? 'Bộ Sưu Tập' : 'Collections'}
//               </h2>
//               <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
//             </motion.div>
//             <motion.div
//               className="grid grid-cols-1 md:grid-cols-3 gap-8"
//               variants={staggerChildren}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true }}
//             >
//               {categories.map((category, index) => (
//                 <motion.div
//                   key={index}
//                   className="relative group cursor-pointer"
//                   variants={fadeInItem}
//                 >
//                   <div className="relative w-full h-96 rounded-full overflow-hidden">
//                     <Image
//                       src={category.image}
//                       alt={category.title}
//                       fill
//                       sizes="(max-width: 768px) 100vw, 33vw"
//                       className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
//                       loading="lazy"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
//                       <h3 className="text-xl font-cinzel font-bold text-white bg-black/50 px-6 py-2 rounded">
//                         {category.title}
//                       </h3>
//                     </div>
//                   </div>
//                   <motion.div
//                     className="absolute inset-0 flex items-end p-6 text-white"
//                     initial={{ opacity: 0 }}
//                     whileHover={{ opacity: 1 }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <div className="w-full text-center">
//                       <p className="text-sm mb-4 font-light">{category.description}</p>
//                       <Link
//                         href={category.link}
//                         className="group inline-block px-6 py-2 border border-white text-white text-xs uppercase tracking-widest font-light hover:bg-white hover:text-black transition-all duration-300"
//                       >
//                         {language === 'vi' ? 'Mua Sắm Ngay' : 'Shop Now'}
//                         <ArrowRight
//                           size={16}
//                           className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
//                         />
//                       </Link>
//                     </div>
//                   </motion.div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>

//         {/* New Arrivals */}
//         <div className="py-24 bg-white">
//           <div className="container max-w-7xl mx-auto px-4">
//             <motion.div
//               className="text-center mb-16"
//               {...fadeInUp}
//               viewport={{ once: true }}
//             >
//               <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
//                 {language === 'vi' ? 'Mới Về' : 'Just Arrived'}
//               </span>
//               <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
//                 {language === 'vi' ? 'Hàng Mới Về' : 'New Arrivals'}
//               </h2>
//               <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
//             </motion.div>

//             {loading && (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
//                 {Array(4)
//                   .fill(0)
//                   .map((_, index) => (
//                     <ProductSkeleton key={index} />
//                   ))}
//               </div>
//             )}

//             {!loading && !error && (
//               <motion.div
//                 className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
//                 variants={staggerChildren}
//                 initial="hidden"
//                 whileInView="show"
//                 viewport={{ once: true }}
//               >
//                 {products
//                   .filter((product) => product.isNew)
//                   .slice(0, 4)
//                   .map((product, index) => (
//                     <motion.div
//                       key={product.id}
//                       className="group relative"
//                       variants={productHover}
//                       whileHover="hover"
//                       initial={{ opacity: 0, y: 30 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
//                       viewport={{ once: true }}
//                       onMouseEnter={() => setHoveredProduct(product.id)}
//                       onMouseLeave={() => setHoveredProduct(null)}
//                     >
//                       <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-gray-100">
//                         <Link href={`/products/${product.id}`} className="block relative h-full w-full">
//                           <Image
//                             src={product.image}
//                             alt={`${product.name} - WEATHERED`}
//                             fill
//                             sizes="(max-width: 768px) 50vw, 25vw"
//                             className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
//                             loading="lazy"
//                           />
//                           {product.isNew && (
//                             <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest font-light">
//                               {language === 'vi' ? 'Mới' : 'New'}
//                             </div>
//                           )}
//                         </Link>

//                         <motion.div
//                           className="absolute top-2 right-2 flex flex-col gap-2"
//                           initial={{ opacity: 0, x: 20 }}
//                           animate={{
//                             opacity: hoveredProduct === product.id ? 1 : 0,
//                             x: hoveredProduct === product.id ? 0 : 20,
//                           }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <button
//                             onClick={(e) => toggleWishlist(product.id, e)}
//                             className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
//                             aria-label="Add to Wishlist"
//                           >
//                             <svg
//                               className={`h-5 w-5 ${wishlist.has(product.id) ? "text-red-500 fill-red-500" : "text-gray-700"}`}
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                               fill="none"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={wishlist.has(product.id) ? 0 : 1.5}
//                                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={(e) => openQuickView(product, e)}
//                             className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
//                             aria-label="Quick View"
//                           >
//                             <svg
//                               className="h-5 w-5 text-gray-700"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={1.5}
//                                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                               />
//                             </svg>
//                           </button>
//                         </motion.div>

//                         <motion.button
//                           onClick={(e) => addToCartHandler(product, 1, "", e)}
//                           className="absolute bottom-0 left-0 right-0 py-3 bg-black text-white text-xs uppercase tracking-widest font-light hover:bg-gray-900 transition-all"
//                           initial={{ y: "100%" }}
//                           animate={{ y: hoveredProduct === product.id ? 0 : "100%" }}
//                           transition={{ duration: 0.3 }}
//                           aria-label="Add to Cart"
//                         >
//                           {language === 'vi' ? 'Thêm Vào Giỏ' : 'Add to Cart'}
//                         </motion.button>
//                       </div>

//                       <div className="mt-4 text-center">
//                         <h3 className="text-sm font-medium">
//                           <Link href={`/products/${product.id}`} className="group relative inline-block">
//                             <span className="text-gray-800 hover:text-black transition-colors duration-300">
//                               {product.name}
//                             </span>
//                             <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
//                           </Link>
//                         </h3>
//                         <p className="text-gray-800 text-sm font-medium mt-1">
//                           {product.price.toLocaleString("vi-VN")} đ
//                           {product.discount && (
//                             <span className="text-red-500 ml-2">
//                               (-{((product.discount / product.price) * 100).toFixed(0)}%)
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </motion.div>
//                   ))}
//               </motion.div>
//             )}

//             <div className="text-center mt-12">
//               <Link
//                 href="/products/new"
//                 className="group inline-block px-8 py-3 border border-gray-900 text-gray-900 text-xs uppercase tracking-widest font-light hover:bg-gray-900 hover:text-white transition-all duration-300"
//               >
//                 {language === 'vi' ? 'Xem Tất Cả Hàng Mới' : 'View All New Arrivals'}
//                 <ArrowRight
//                   size={16}
//                   className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Trending Now */}
//         <div className="py-24 bg-[#f9f9f9]">
//           <div className="container max-w-7xl mx-auto px-4">
//             <motion.div
//               className="text-center mb-16"
//               {...fadeInUp}
//               viewport={{ once: true }}
//             >
//               <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
//                 {language === 'vi' ? 'Được Yêu Thích' : 'Curated Picks'}
//               </span>
//               <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
//                 {language === 'vi' ? 'Xu Hướng Hiện Nay' : 'Trending Now'}
//               </h2>
//               <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
//             </motion.div>

//             <motion.div
//               className="flex flex-wrap justify-center gap-4 mb-12"
//               variants={staggerChildren}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true }}
//             >
//               {["all", "featured", ...collections.map((col) => createSlug(col.name))].map((tab) => (
//                 <motion.button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition-all duration-300 ${
//                     activeTab === tab ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
//                   } rounded-full`}
//                   variants={fadeInItem}
//                 >
//                   {tab === 'all'
//                     ? language === 'vi' ? 'Tất Cả' : 'All'
//                     : tab === 'featured'
//                     ? language === 'vi' ? 'Nổi Bật' : 'Featured'
//                     : collections.find((col) => createSlug(col.name) === tab)?.name || tab}
//                 </motion.button>
//               ))}
//             </motion.div>

//             {loading && (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
//                 {Array(8)
//                   .fill(0)
//                   .map((_, index) => (
//                     <ProductSkeleton key={index} />
//                   ))}
//               </div>
//             )}

//             {error && <div className="text-center text-red-600 py-16 text-lg">Error: {error}</div>}

//             {!loading && !error && (
//               <motion.div
//                 className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
//                 variants={staggerChildren}
//                 initial="hidden"
//                 whileInView="show"
//                 viewport={{ once: true }}
//               >
//                 {filteredProducts.slice(0, 8).map((product, index) => (
//                   <motion.div
//                     key={product.id}
//                     className="group relative"
//                     variants={productHover}
//                     whileHover="hover"
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
//                     viewport={{ once: true }}
//                     onMouseEnter={() => setHoveredProduct(product.id)}
//                     onMouseLeave={() => setHoveredProduct(null)}
//                   >
//                     <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-gray-100">
//                       <Link href={`/products/${product.id}`} className="block relative h-full w-full">
//                         <Image
//                           src={product.image}
//                           alt={`${product.name} - WEATHERED`}
//                           fill
//                           sizes="(max-width: 768px) 50vw, 25vw"
//                           className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
//                           loading="lazy"
//                         />
//                         {product.isNew && (
//                           <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest font-light">
//                             {language === 'vi' ? 'Mới' : 'New'}
//                           </div>
//                         )}
//                       </Link>

//                       <motion.div
//                         className="absolute top-2 right-2 flex flex-col gap-2"
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{
//                           opacity: hoveredProduct === product.id ? 1 : 0,
//                           x: hoveredProduct === product.id ? 0 : 20,
//                         }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <button
//                           onClick={(e) => toggleWishlist(product.id, e)}
//                           className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
//                           aria-label="Add to Wishlist"
//                         >
//                           <svg
//                             className={`h-5 w-5 ${wishlist.has(product.id) ? "text-red-500 fill-red-500" : "text-gray-700"}`}
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             fill="none"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={wishlist.has(product.id) ? 0 : 1.5}
//                               d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                             />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={(e) => openQuickView(product, e)}
//                           className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
//                           aria-label="Quick View"
//                         >
//                           <svg
//                             className="h-5 w-5 text-gray-700"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1.5}
//                               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                             />
//                           </svg>
//                         </button>
//                       </motion.div>

//                       <motion.button
//                         onClick={(e) => addToCartHandler(product, 1, "", e)}
//                         className="absolute bottom-0 left-0 right-0 py-3 bg-black text-white text-xs uppercase tracking-widest font-light hover:bg-gray-900 transition-all"
//                         initial={{ y: "100%" }}
//                         animate={{ y: hoveredProduct === product.id ? 0 : "100%" }}
//                         transition={{ duration: 0.3 }}
//                         aria-label="Add to Cart"
//                       >
//                         {language === 'vi' ? 'Thêm Vào Giỏ' : 'Add to Cart'}
//                       </motion.button>
//                     </div>

//                     <div className="mt-4 text-center">
//                       <h3 className="text-sm font-medium">
//                         <Link href={`/products/${product.id}`} className="group relative inline-block">
//                           <span className="text-gray-800 hover:text-black transition-colors duration-300">
//                             {product.name}
//                           </span>
//                           <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
//                         </Link>
//                       </h3>
//                       <p className="text-gray-800 text-sm font-medium mt-1">
//                         {product.price.toLocaleString("vi-VN")} đ
//                         {product.discount && (
//                           <span className="text-red-500 ml-2">
//                             (-{((product.discount / product.price) * 100).toFixed(0)}%)
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}

//             {!loading && !error && filteredProducts.length === 0 && (
//               <div className="text-center text-gray-600 py-16">
//                 <p className="mb-6 text-lg font-light">
//                   {language === 'vi' ? 'Không có sản phẩm trong bộ sưu tập này' : 'No products in this collection'}
//                 </p>
//                 <button
//                   onClick={() => setActiveTab("all")}
//                   className="px-8 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest font-light hover:bg-black transition-all"
//                 >
//                   {language === 'vi' ? 'Xem Tất Cả Sản Phẩm' : 'View All Products'}
//                 </button>
//               </div>
//             )}

//             <div className="text-center mt-12">
//               <Link
//                 href="/products"
//                 className="group inline-block px-8 py-3 border border-gray-900 text-gray-900 text-xs uppercase tracking-widest font-light hover:bg-gray-900 hover:text-white transition-all duration-300"
//               >
//                 {language === 'vi' ? 'Xem Tất Cả Sản Phẩm' : 'View All Products'}
//                 <ArrowRight
//                   size={16}
//                   className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Testimonials */}
//         <div className="py-24 bg-white relative">
//           <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5"></div>
//           <div className="container max-w-7xl mx-auto px-4 relative">
//             <motion.div
//               className="text-center mb-16"
//               {...fadeInUp}
//               viewport={{ once: true }}
//             >
//               <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
//                 {language === 'vi' ? 'Ý Kiến Khách Hàng' : 'What They Say'}
//               </span>
//               <h2 className="text-4xl text-black md:text-5xl font-cinzel font-bold mb-4">
//                 {language === 'vi' ? 'Nhận Xét' : 'Testimonials'}
//               </h2>
//               <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
//             </motion.div>
//             <motion.div
//               className="max-w-2xl mx-auto text-center"
//               key={testimonialIndex}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//             >
//               <p className="text-lg italic text-gray-600 mb-6 font-light">{testimonials[testimonialIndex].quote}</p>
//               <p className="text-sm font-cinzel font-medium">{testimonials[testimonialIndex].name}</p>
//               <p className="text-sm text-gray-500 font-light">{testimonials[testimonialIndex].role}</p>
//             </motion.div>
//             <div className="flex justify-center space-x-3 mt-8">
//               {testimonials.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setTestimonialIndex(index)}
//                   className={`h-2 w-2 rounded-full ${
//                     testimonialIndex === index ? "bg-gray-900" : "bg-gray-300"
//                   }`}
//                   aria-label={`Go to testimonial ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Newsletter */}
//         <div className="bg-gray-900 text-white py-24">
//           <div className="container max-w-7xl mx-auto px-4">
//             <motion.div
//               className="max-w-xl mx-auto text-center"
//               {...fadeInUp}
//               viewport={{ once: true }}
//             >
//               <h2 className="text-3xl md:text-4xl font-cinzel font-bold mb-4">
//                 {language === 'vi' ? 'Đăng Ký Bản Tin' : 'Join Our Newsletter'}
//               </h2>
//               <p className="text-gray-300 mb-8 text-lg font-light">
//                 {language === 'vi'
//                   ? 'Nhận thông tin về các bộ sưu tập mới và ưu đãi độc quyền'
//                   : 'Receive updates on new collections and exclusive offers'}
//               </p>
//               <form className="relative mb-6">
//                 <input
//                   type="email"
//                   placeholder={language === 'vi' ? 'Email của bạn' : 'Your email'}
//                   className="bg-transparent border-0 border-b border-gray-400 px-0 py-3 pr-10 w-full text-white focus:outline-none focus:border-white text-sm font-light transition-all duration-300"
//                   required
//                   aria-label="Email address"
//                 />
//                 <button
//                   type="submit"
//                   className="absolute right-0 top-0 h-full text-gray-400 hover:text-white transition-all duration-300 transform-gpu hover:scale-105"
//                   aria-label="Subscribe"
//                 >
//                   <ArrowRight size={24} strokeWidth={1.5} />
//                 </button>
//               </form>
//             </motion.div>
//           </div>
//         </div>

//         {/* Quick View Modal */}
//         <AnimatePresence>
//           {quickViewProduct && (
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
//               onClick={closeQuickView}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 className="w-full max-w-4xl bg-white p-8 overflow-auto max-h-[90vh] rounded-lg relative"
//                 onClick={(e) => e.stopPropagation()}
//                 initial={{ scale: 0.9, y: 20 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.9, y: 20 }}
//                 transition={{ duration: 0.4, type: "spring" }}
//               >
//                 <button
//                   onClick={closeQuickView}
//                   className="absolute right-4 top-4 text-gray-500 hover:text-gray-900 transition-all duration-300"
//                   aria-label="Close Quick View"
//                 >
//                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="aspect-square relative bg-gray-100 rounded-lg">
//                     <Image
//                       src={quickViewProduct.image}
//                       alt={`${quickViewProduct.name} - WEATHERED`}
//                       fill
//                       sizes="50vw"
//                       className="object-cover rounded-lg"
//                     />
//                     {quickViewProduct.isNew && (
//                       <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest font-light">
//                         {language === 'vi' ? 'Mới' : 'New'}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col justify-between">
//                     <div>
//                       <h3 className="text-2xl font-cinzel font-bold mb-2">{quickViewProduct.name}</h3>
//                       <p className="text-xl text-gray-900 mb-6 font-medium">
//                         {quickViewProduct.price.toLocaleString("vi-VN")} đ
//                         {quickViewProduct.discount && (
//                           <span className="text-red-500 ml-2">
//                             (-{((quickViewProduct.discount / quickViewProduct.price) * 100).toFixed(0)}%)
//                           </span>
//                         )}
//                       </p>
//                       <p className="text-gray-600 mb-6 leading-relaxed font-light">{quickViewProduct.description}</p>
//                       <div className="mb-6">
//                         <h4 className="font-medium mb-3 text-gray-900">
//                           {language === 'vi' ? 'Kích Cỡ' : 'Size'}
//                         </h4>
//                         <div className="flex gap-2">
//                           {quickViewProduct.size.split(",").map((size) => (
//                             <button
//                               key={size}
//                               onClick={() => setSelectedSize(size.trim())}
//                               className={`w-12 h-12 border flex items-center justify-center hover:border-gray-900 transition-all font-light text-sm ${
//                                 selectedSize === size.trim() ? "border-gray-900 bg-gray-100" : "border-gray-200"
//                               }`}
//                               aria-label={`Select size ${size.trim()}`}
//                             >
//                               {size.trim()}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="mb-8">
//                         <h4 className="font-medium mb-3 text-gray-900">
//                           {language === 'vi' ? 'Số Lượng' : 'Quantity'}
//                         </h4>
//                         <div className="flex border border-gray-200 w-36">
//                           <button
//                             className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
//                             onClick={decreaseQuantity}
//                             aria-label="Decrease quantity"
//                           >
//                             <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                               <path
//                                 fillRule="evenodd"
//                                 d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                           <div className="flex-grow h-12 flex items-center justify-center border-x border-gray-200 font-medium">
//                             {quantity}
//                           </div>
//                           <button
//                             className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
//                             onClick={increaseQuantity}
//                             aria-label="Increase quantity"
//                           >
//                             <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                               <path
//                                 fillRule="evenodd"
//                                 d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-4">
//                       <button
//                         onClick={() => {
//                           if (!selectedSize) {
//                             alert(language === 'vi' ? "Vui lòng chọn kích cỡ." : "Please select a size.");
//                             return;
//                           }
//                           addToCartHandler(quickViewProduct, quantity, selectedSize);
//                           closeQuickView();
//                         }}
//                         className="flex-grow py-4 bg-gray-900 text-white text-xs uppercase tracking-widest font-light hover:bg-black transition-all"
//                         aria-label="Add to Cart"
//                       >
//                         {language === 'vi' ? 'Thêm Vào Giỏ' : 'Add to Cart'}
//                       </button>
//                       <button
//                         onClick={() => toggleWishlist(quickViewProduct.id)}
//                         className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:border-gray-900 transition-all"
//                         aria-label="Add to Wishlist"
//                       >
//                         <svg
//                           className={`h-6 w-6 ${
//                             wishlist.has(quickViewProduct.id) ? "text-red-500 fill-red-500" : "text-gray-700"
//                           }`}
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           fill="none"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={wishlist.has(quickViewProduct.id) ? 0 : 1.5}
//                             d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Cart Notification */}
//         <AnimatePresence>
//           {cartNotification && (
//             <motion.div
//               className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                 />
//               </svg>
//               <span>{language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!'}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Back to Top Button */}
//         <AnimatePresence>
//           {showBackToTop && (
//             <motion.button
//               onClick={scrollToTop}
//               className="fixed bottom-8 right-8 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-all duration-300 z-50"
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0 }}
//               aria-label="Back to Top"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//               </svg>
//             </motion.button>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }

// // Error Boundary
// import { Component, PropsWithChildren } from "react";

// class ErrorBoundary extends Component<PropsWithChildren> {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="text-center py-16">
//           <h2 className="text-2xl font-cinzel font-bold text-red-600">Something went wrong.</h2>
//           <p className="mt-4 text-gray-600 font-light">Please try refreshing the page.</p>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default function HomePageWithErrorBoundary() {
//   return (
//     <ErrorBoundary>
//       <HomePage />
//     </ErrorBoundary>
//   );
// }
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { cinzel, lora } from "@/lib/fonts";

// Define Product interface
interface Product {
  id: string;
  name: string;
  image: string;
  size: string;
  description: string;
  category: string;
  collection?: string;
  price: number;
  discount?: number | null;
  images: string[];
  createdAt: string;
  status: 'in_stock' | 'out_of_stock';
  isNew?: boolean;
  isFeatured?: boolean;
}

// Define API Product interface for raw API data
interface ApiProduct {
  _id: string;
  name: string;
  images: string[];
  size: string;
  description: string;
  category: string;
  collection?: string;
  price: number;
  discount?: number | null;
  createdAt: string;
  status: 'in_stock' | 'out_of_stock';
}

// Define Collection interface
interface Collection {
  name: string;
}

// Banner slider data
const banners = [
  {
    src: "/images/banner1.png",
    title: "Refined Elegance",
    description: "Curated collections that epitomize modern sophistication",
    buttonText: "Discover Now",
    link: "/collections/new",
  },
  {
    src: "/images/banner2.png",
    title: "Monochrome Mastery",
    description: "Bold contrasts that define contemporary aesthetics",
    buttonText: "Explore",
    link: "/collections/summer",
  },
  {
    src: "/images/banner3.png",
    title: "Limited Edition",
    description: "Exclusive pieces available for a limited time only",
    buttonText: "Shop Sale",
    link: "/collections/sale",
  },
];

// Category showcase data
const categories = [
  {
    title: "Archive Collection",
    image: "/images/archive.png",
    link: "/collections/archive",
    description: "Timeless pieces inspired by vintage aesthetics",
  },
  {
    title: "Blockcore Collection",
    image: "/images/blockcore.png",
    link: "/collections/blockcore",
    description: "Bold, modern designs for the urban trendsetter",
  },
  {
    title: "Vintage Collection",
    image: "/images/vintage.png",
    link: "/collections/vintage",
    description: "Classic styles reimagined for today's fashion",
  },
];

// Testimonials data with curly quotes
const testimonials = [
  {
    name: "Sophie Laurent",
    role: "Fashion Blogger",
    quote: "The attention to detail and quality of fabrics is unmatched. Every piece tells a story of craftsmanship.",
  },
  {
    name: "Alex Chen",
    role: "Creative Director",
    quote: "This brand has redefined what minimalist elegance means in contemporary fashion. Simply outstanding.",
  },
  {
    name: "Emma Rodriguez",
    role: "Style Influencer",
    quote: "The designs have a timeless quality that transcends seasonal trends. A must-have for any wardrobe.",
  },
];

// Skeleton component
const ProductSkeleton = () => (
  <div className="animate-pulse group">
    <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
    <div className="mt-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
    </div>
  </div>
);

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [cartNotification, setCartNotification] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const { addToCart } = useCart();

  // Animation variants
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const productHover = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Hàm tạo slug từ tên bộ sưu tập
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s&]+/g, "--")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Sync language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch collections
  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/collections", { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to fetch collections");
        const data = await response.json();
        setCollections(data.collections || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setCollections([
          { name: 'Archive' },
          { name: 'Blockcore' },
          { name: 'Vintage' },
        ]);
      }
    }
    fetchCollections();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products", { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const mappedProducts: Product[] = data.products.map((product: ApiProduct) => ({
          id: product._id.toString(),
          name: product.name,
          image: product.images[0] || "/placeholder/300x400",
          size: product.size,
          description: product.description,
          category: product.category,
          collection: product.collection,
          price: product.price,
          discount: product.discount,
          images: product.images,
          createdAt: product.createdAt,
          status: product.status || 'in_stock',
          isNew: new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isFeatured: !!product.discount,
        }));
        setProducts(mappedProducts);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Autoplay banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Autoplay testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Preload images
  useEffect(() => {
    banners.forEach((banner) => {
      const img = new window.Image();
      img.src = banner.src;
    });
    categories.forEach((category) => {
      const img = new window.Image();
      img.src = category.image;
    });
    products.forEach((product) => {
      const img = new window.Image();
      img.src = product.image;
    });
  }, [products]);

  // Memoized filtered products (include all products, no status filter)
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") {
      return products;
    }
    if (activeTab === "featured") {
      return products.filter((product) => product.isFeatured);
    }
    const collectionName = collections.find((col) => createSlug(col.name) === activeTab)?.name;
    if (collectionName) {
      return products.filter((product) =>
        product.collection?.toLowerCase() === collectionName.toLowerCase()
      );
    }
    return [];
  }, [activeTab, products, collections]);

  // Handlers
  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  const addToCartHandler = (product: Product, quantity: number = 1, size: string = "", e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (product.status === 'out_of_stock') {
      alert(language === 'vi' ? "Sản phẩm hiện đã hết hàng." : "This product is currently out of stock.");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size,
    });
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 3000);
  };

  const openQuickView = (product: Product, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setQuickViewProduct(product);
    setQuantity(1);
    setSelectedSize("");
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSelectedSize("");
    document.body.style.overflow = "auto";
  };

  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "WEATHERED | Premium Fashion Collections",
    description: "Discover premium fashion collections with a timeless vintage and archive aesthetic.",
    publisher: {
      "@type": "Organization",
      name: "WEATHERED",
      logo: {
        "@type": "ImageObject",
        url: "/images/logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <title>WEATHERED | Premium Fashion Collections</title>
        <meta
          name="description"
          content="Discover premium fashion collections with a timeless vintage and archive aesthetic."
        />
        <meta name="keywords" content="fashion, luxury, vintage, archive, weathered, premium" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <div className={`bg-white mt-[50px] ${cinzel.variable} ${lora.variable}`}>
        {/* Hero Banner Slider */}
        <div className="relative w-full h-screen max-h-[90vh] overflow-hidden">
          <div
            ref={bannerRef}
            className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <motion.div
                key={index}
                className="relative w-full h-full flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={banner.src}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover w-full h-full"
                  style={{
                    transform: currentIndex === index ? "scale(1.05)" : "scale(1)",
                    transition: "transform 10s ease-out",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-center">
                  <div className="container max-w-7xl mx-auto px-4">
                    <motion.div
                      className="max-w-md text-white"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : -50 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <p className="text-xs uppercase tracking-widest mb-3 font-light">
                        {language === 'vi' ? 'Xuân/Hè 2025' : 'Spring/Summer 2025'}
                      </p>
                      <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 leading-tight">
                        {banner.title}
                      </h1>
                      <p className="text-base md:text-lg mb-8 font-light">{banner.description}</p>
                      <Link
                        href={banner.link}
                        className="group inline-block px-8 py-3 border border-white text-white text-sm uppercase tracking-widest font-light hover:bg-white hover:text-black transition-all duration-300"
                      >
                        {banner.buttonText}
                        <ArrowRight
                          size={18}
                          className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                        />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white hover:text-black transition-all duration-300 z-10 text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white hover:text-black transition-all duration-300 z-10 text-white"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "bg-white w-12" : "bg-white/50 w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Unique Selling Points */}
        <div className="bg-white text-black py-16 border-b border-gray-100">
          <div className="container max-w-7xl mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-8 md:gap-12"
              variants={staggerChildren}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  title: language === 'vi' ? 'Vintage Tuyển Chọn' : 'Curated Vintage Finds',
                  description: language === 'vi'
                    ? 'Mỗi sản phẩm được tuyển chọn kỹ lưỡng từ các bộ sưu tập vintage uy tín, đảm bảo tính nguyên bản và giá trị thẩm mỹ.'
                    : 'Each item is carefully sourced from trusted vintage collections, ensuring authenticity and aesthetic value.',
                  icon: (
                    <svg className="h-8 w-8 mx-auto text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ),
                },
                {
                  title: language === 'vi' ? 'Giao Hàng Cẩn Thận' : 'Carefully Handled Shipping',
                  description: language === 'vi'
                    ? 'Giao hàng toàn quốc và quốc tế. Miễn phí vận chuyển với đơn hàng từ 500.000đ. Đóng gói an toàn, theo tiêu chuẩn thương hiệu.'
                    : 'Nationwide and international delivery. Free shipping on orders from 500,000 VND. Secure packaging meets brand standards.',
                  icon: (
                    <svg className="h-8 w-8 mx-auto text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M3 9.75L12 4.5l9 5.25M3 9.75v4.5l9 5.25 9-5.25v-4.5M3 14.25l9-5.25 9 5.25" />
                    </svg>
                  ),
                },
                {
                  title: language === 'vi' ? 'Thời Trang Có Tính Kết Nối' : 'Fashion With a Story',
                  description: language === 'vi'
                    ? 'Chúng tôi đề cao thời trang tuần hoàn – sử dụng lại, giảm lãng phí và thúc đẩy tiêu dùng có trách nhiệm.'
                    : 'We promote circular fashion – reuse, reduce waste, and encourage responsible consumption.',
                  icon: (
                    <svg className="h-8 w-8 mx-auto text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4.5 9.75A7.5 7.5 0 0112 4.5c2.623 0 4.934 1.35 6.3 3.375M19.5 14.25A7.5 7.5 0 0112 19.5a7.5 7.5 0 01-6.3-3.375M15 9l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  ),
                },
              ].map((usp, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={fadeInItem}
                >
                  <div className="mb-4">{usp.icon}</div>
                  <h3 className="text-lg font-cinzel font-medium mb-2">{usp.title}</h3>
                  <p className="text-gray-600 text-sm font-light">{usp.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Shop by Collection */}
        <div className="py-24 bg-[#f9f9f9]">
          <div className="container max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
                {language === 'vi' ? 'Khám Phá' : 'Explore'}
              </span>
              <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
                {language === 'vi' ? 'Bộ Sưu Tập' : 'Collections'}
              </h2>
              <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer"
                  variants={fadeInItem}
                >
                  <div className="relative w-full h-96 rounded-full overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <h3 className="text-xl font-cinzel font-bold text-white bg-black/50 px-6 py-2 rounded">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 flex items-end p-6 text-white"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-full text-center">
                      <p className="text-sm mb-4 font-light">{category.description}</p>
                      <Link
                        href={category.link}
                        className="group inline-block px-6 py-2 border border-white text-white text-xs uppercase tracking-widest font-light hover:bg-white hover:text-black transition-all duration-300"
                      >
                        {language === 'vi' ? 'Mua Sắm Ngay' : 'Shop Now'}
                        <ArrowRight
                          size={16}
                          className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* New Arrivals */}
        <div className="py-24 bg-white">
          <div className="container max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
                {language === 'vi' ? 'Mới Về' : 'Just Arrived'}
              </span>
              <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
                {language === 'vi' ? 'Hàng Mới Về' : 'New Arrivals'}
              </h2>
              <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
            </motion.div>

            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
              </div>
            )}

            {!loading && !error && (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                variants={staggerChildren}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {filteredProducts
                  .filter((product) => product.isNew)
                  .slice(0, 4)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="group relative"
                      variants={productHover}
                      whileHover="hover"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                      viewport={{ once: true }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-gray-100">
                        <Link href={`/products/${product.id}`} className="block relative h-full w-full">
                          <Image
                            src={product.image}
                            alt={`${product.name} - WEATHERED`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          {product.isNew && (
                            <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest font-light">
                              {language === 'vi' ? 'Mới' : 'New'}
                            </div>
                          )}
                          {product.status === 'out_of_stock' && (
                            <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                              <span className="text-white text-lg font-cinzel font-bold uppercase tracking-widest">
                                {language === 'vi' ? 'Hết Hàng' : 'Sold Out'}
                              </span>
                            </div>
                          )}
                        </Link>

                        <motion.div
                          className="absolute top-2 right-2 flex flex-col gap-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{
                            opacity: hoveredProduct === product.id && product.status !== 'out_of_stock' ? 1 : 0,
                            x: hoveredProduct === product.id && product.status !== 'out_of_stock' ? 0 : 20,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
                            aria-label="Add to Wishlist"
                          >
                            <svg
                              className={`h-5 w-5 ${wishlist.has(product.id) ? "text-red-500 fill-red-500" : "text-gray-700"}`}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              fill="none"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={wishlist.has(product.id) ? 0 : 1.5}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => openQuickView(product, e)}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
                            aria-label="Quick View"
                          >
                            <svg
                              className="h-5 w-5 text-gray-700"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </button>
                        </motion.div>

                        <motion.button
                          onClick={(e) => addToCartHandler(product, 1, "", e)}
                          className={`absolute bottom-0 left-0 right-0 py-3 text-white text-xs uppercase tracking-widest font-light transition-all ${
                            product.status === 'out_of_stock'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-black hover:bg-gray-900'
                          }`}
                          initial={{ y: "100%" }}
                          animate={{ y: hoveredProduct === product.id && product.status !== 'out_of_stock' ? 0 : "100%" }}
                          transition={{ duration: 0.3 }}
                          aria-label="Add to Cart"
                          disabled={product.status === 'out_of_stock'}
                        >
                          {language === 'vi'
                            ? product.status === 'out_of_stock'
                              ? 'Hết Hàng'
                              : 'Thêm Vào Giỏ'
                            : product.status === 'out_of_stock'
                            ? 'Sold Out'
                            : 'Add to Cart'}
                        </motion.button>
                      </div>

                      <div className="mt-4 text-center">
                        <h3 className="text-sm font-medium">
                          <Link href={`/products/${product.id}`} className="group relative inline-block">
                            <span className="text-gray-800 hover:text-black transition-colors duration-300">
                              {product.name}
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                          </Link>
                        </h3>
                        <p className="text-gray-800 text-sm font-medium mt-1">
                          {product.price.toLocaleString("vi-VN")} đ
                          {product.discount && (
                            <span className="text-red-500 ml-2">
                              (-{((product.discount / product.price) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/products/new"
                className="group inline-block px-8 py-3 border border-gray-900 text-gray-900 text-xs uppercase tracking-widest font-light hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                {language === 'vi' ? 'Xem Tất Cả Hàng Mới' : 'View All New Arrivals'}
                <ArrowRight
                  size={16}
                  className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Trending Now */}
        <div className="py-24 bg-[#f9f9f9]">
          <div className="container max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
                {language === 'vi' ? 'Được Yêu Thích' : 'Curated Picks'}
              </span>
              <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
                {language === 'vi' ? 'Xu Hướng Hiện Nay' : 'Trending Now'}
              </h2>
              <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              variants={staggerChildren}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {["all", "featured", ...collections.map((col) => createSlug(col.name))].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-xs uppercase tracking-widest font-light transition-all duration-300 ${
                    activeTab === tab ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
                  } rounded-full`}
                  variants={fadeInItem}
                >
                  {tab === 'all'
                    ? language === 'vi' ? 'Tất Cả' : 'All'
                    : tab === 'featured'
                    ? language === 'vi' ? 'Nổi Bật' : 'Featured'
                    : collections.find((col) => createSlug(col.name) === tab)?.name || tab}
                </motion.button>
              ))}
            </motion.div>

            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
              </div>
            )}

            {error && <div className="text-center text-red-600 py-16 text-lg">Error: {error}</div>}

            {!loading && !error && (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                variants={staggerChildren}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {filteredProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group relative"
                    variants={productHover}
                    whileHover="hover"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-gray-100">
                      <Link href={`/products/${product.id}`} className="block relative h-full w-full">
                        <Image
                          src={product.image}
                          alt={`${product.name} - WEATHERED`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        {product.isNew && (
                          <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest font-light">
                            {language === 'vi' ? 'Mới' : 'New'}
                          </div>
                        )}
                        {product.status === 'out_of_stock' && (
                          <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                            <span className="text-white text-lg font-cinzel font-bold uppercase tracking-widest">
                              {language === 'vi' ? 'Hết Hàng' : 'Sold Out'}
                            </span>
                          </div>
                        )}
                      </Link>

                      <motion.div
                        className="absolute top-2 right-2 flex flex-col gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                          opacity: hoveredProduct === product.id && product.status !== 'out_of_stock' ? 1 : 0,
                          x: hoveredProduct === product.id && product.status !== 'out_of_stock' ? 0 : 20,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
                          aria-label="Add to Wishlist"
                        >
                          <svg
                            className={`h-5 w-5 ${wishlist.has(product.id) ? "text-red-500 fill-red-500" : "text-gray-700"}`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={wishlist.has(product.id) ? 0 : 1.5}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => openQuickView(product, e)}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md"
                          aria-label="Quick View"
                        >
                          <svg
                            className="h-5 w-5 text-gray-700"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </button>
                      </motion.div>

                      <motion.button
                        onClick={(e) => addToCartHandler(product, 1, "", e)}
                        className={`absolute bottom-0 left-0 right-0 py-3 text-white text-xs uppercase tracking-widest font-light transition-all ${
                          product.status === 'out_of_stock'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black hover:bg-gray-900'
                        }`}
                        initial={{ y: "100%" }}
                        animate={{ y: hoveredProduct === product.id && product.status !== 'out_of_stock' ? 0 : "100%" }}
                        transition={{ duration: 0.3 }}
                        aria-label="Add to Cart"
                        disabled={product.status === 'out_of_stock'}
                      >
                        {language === 'vi'
                          ? product.status === 'out_of_stock'
                            ? 'Hết Hàng'
                            : 'Thêm Vào Giỏ'
                          : product.status === 'out_of_stock'
                          ? 'Sold Out'
                          : 'Add to Cart'}
                      </motion.button>
                    </div>

                    <div className="mt-4 text-center">
                      <h3 className="text-sm font-medium">
                        <Link href={`/products/${product.id}`} className="group relative inline-block">
                          <span className="text-gray-800 hover:text-black transition-colors duration-300">
                            {product.name}
                          </span>
                          <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                        </Link>
                      </h3>
                      <p className="text-gray-800 text-sm font-medium mt-1">
                        {product.price.toLocaleString("vi-VN")} đ
                        {product.discount && (
                          <span className="text-red-500 ml-2">
                            (-{((product.discount / product.price) * 100).toFixed(0)}%)
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center text-gray-600 py-16">
                <p className="mb-6 text-lg font-light">
                  {language === 'vi' ? 'Không có sản phẩm trong bộ sưu tập này' : 'No products in this collection'}
                </p>
                <button
                  onClick={() => setActiveTab("all")}
                  className="px-8 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest font-light hover:bg-black transition-all"
                >
                  {language === 'vi' ? 'Xem Tất Cả Sản Phẩm' : 'View All Products'}
                </button>
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="group inline-block px-8 py-3 border border-gray-900 text-gray-900 text-xs uppercase tracking-widest font-light hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                {language === 'vi' ? 'Xem Tất Cả Sản Phẩm' : 'View All Products'}
                <ArrowRight
                  size={16}
                  className="inline-block ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5"></div>
          <div className="container max-w-7xl mx-auto px-4 relative">
            <motion.div
              className="text-center mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
                {language === 'vi' ? 'Ý Kiến Khách Hàng' : 'What They Say'}
              </span>
              <h2 className="text-4xl text-black md:text-5xl font-cinzel font-bold mb-4">
                {language === 'vi' ? 'Nhận Xét' : 'Testimonials'}
              </h2>
              <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
            </motion.div>
            <motion.div
              className="max-w-2xl mx-auto text-center"
              key={testimonialIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg italic text-gray-600 mb-6 font-light">{testimonials[testimonialIndex].quote}</p>
              <p className="text-sm font-cinzel font-medium">{testimonials[testimonialIndex].name}</p>
              <p className="text-sm text-gray-500 font-light">{testimonials[testimonialIndex].role}</p>
            </motion.div>
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    testimonialIndex === index ? "bg-gray-900" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-900 text-white py-24">
          <div className="container max-w-7xl mx-auto px-4">
            <motion.div
              className="max-w-xl mx-auto text-center"
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-cinzel font-bold mb-4">
                {language === 'vi' ? 'Đăng Ký Bản Tin' : 'Join Our Newsletter'}
              </h2>
              <p className="text-gray-300 mb-8 text-lg font-light">
                {language === 'vi'
                  ? 'Nhận thông tin về các bộ sưu tập mới và ưu đãi độc quyền'
                  : 'Receive updates on new collections and exclusive offers'}
              </p>
              <form className="relative mb-6">
                <input
                  type="email"
                  placeholder={language === 'vi' ? 'Email của bạn' : 'Your email'}
                  className="bg-transparent border-0 border-b border-gray-400 px-0 py-3 pr-10 w-full text-white focus:outline-none focus:border-white text-sm font-light transition-all duration-300"
                  required
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full text-gray-400 hover:text-white transition-all duration-300 transform-gpu hover:scale-105"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={24} strokeWidth={1.5} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Quick View Modal */}
        <AnimatePresence>
          {quickViewProduct && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              onClick={closeQuickView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-4xl bg-white p-8 overflow-auto max-h-[90vh] rounded-lg relative"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <button
                  onClick={closeQuickView}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-900 transition-all duration-300"
                  aria-label="Close Quick View"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="aspect-square relative bg-gray-100 rounded-lg">
                    <Image
                      src={quickViewProduct.image}
                      alt={`${quickViewProduct.name} - WEATHERED`}
                      fill
                      sizes="50vw"
                      className="object-cover rounded-lg"
                    />
                    {quickViewProduct.isNew && (
                      <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest font-light">
                        {language === 'vi' ? 'Mới' : 'New'}
                      </div>
                    )}
                    {quickViewProduct.status === 'out_of_stock' && (
                      <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
                        <span className="text-white text-lg font-cinzel font-bold uppercase tracking-widest">
                          {language === 'vi' ? 'Hết Hàng' : 'Sold Out'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-cinzel font-bold mb-2">{quickViewProduct.name}</h3>
                      <p className="text-xl text-gray-900 mb-6 font-medium">
                        {quickViewProduct.price.toLocaleString("vi-VN")} đ
                        {quickViewProduct.discount && (
                          <span className="text-red-500 ml-2">
                            (-{((quickViewProduct.discount / quickViewProduct.price) * 100).toFixed(0)}%)
                          </span>
                        )}
                      </p>
                      <p className="text-gray-600 mb-6 leading-relaxed font-light">{quickViewProduct.description}</p>
                      <div className="mb-6">
                        <h4 className="font-medium mb-3 text-gray-900">
                          {language === 'vi' ? 'Kích Cỡ' : 'Size'}
                        </h4>
                        <div className="flex gap-2">
                          {quickViewProduct.size.split(",").map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size.trim())}
                              className={`w-12 h-12 border flex items-center justify-center transition-all font-light text-sm ${
                                quickViewProduct.status === 'out_of_stock'
                                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                  : selectedSize === size.trim()
                                  ? 'border-gray-900 bg-gray-100'
                                  : 'border-gray-200 hover:border-gray-900'
                              }`}
                              aria-label={`Select size ${size.trim()}`}
                              disabled={quickViewProduct.status === 'out_of_stock'}
                            >
                              {size.trim()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-8">
                        <h4 className="font-medium mb-3 text-gray-900">
                          {language === 'vi' ? 'Số Lượng' : 'Quantity'}
                        </h4>
                        <div className="flex border border-gray-200 w-36">
                          <button
                            className={`w-12 h-12 flex items-center justify-center transition-all ${
                              quickViewProduct.status === 'out_of_stock'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            onClick={decreaseQuantity}
                            aria-label="Decrease quantity"
                            disabled={quickViewProduct.status === 'out_of_stock'}
                          >
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <div className="flex-grow h-12 flex items-center justify-center border-x border-gray-200 font-medium">
                            {quantity}
                          </div>
                          <button
                            className={`w-12 h-12 flex items-center justify-center transition-all ${
                              quickViewProduct.status === 'out_of_stock'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            onClick={increaseQuantity}
                            aria-label="Increase quantity"
                            disabled={quickViewProduct.status === 'out_of_stock'}
                          >
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          if (!selectedSize) {
                            alert(language === 'vi' ? "Vui lòng chọn kích cỡ." : "Please select a size.");
                            return;
                          }
                          if (quickViewProduct.status === 'out_of_stock') {
                            alert(language === 'vi' ? "Sản phẩm hiện đã hết hàng." : "This product is currently out of stock.");
                            return;
                          }
                          addToCartHandler(quickViewProduct, quantity, selectedSize);
                          closeQuickView();
                        }}
                        className={`flex-grow py-4 text-white text-xs uppercase tracking-widest font-light transition-all ${
                          quickViewProduct.status === 'out_of_stock'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 hover:bg-black'
                        }`}
                        aria-label="Add to Cart"
                        disabled={quickViewProduct.status === 'out_of_stock'}
                      >
                        {language === 'vi'
                          ? quickViewProduct.status === 'out_of_stock'
                            ? 'Hết Hàng'
                            : 'Thêm Vào Giỏ'
                          : quickViewProduct.status === 'out_of_stock'
                          ? 'Sold Out'
                          : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => toggleWishlist(quickViewProduct.id)}
                        className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:border-gray-900 transition-all"
                        aria-label="Add to Wishlist"
                      >
                        <svg
                          className={`h-6 w-6 ${
                            wishlist.has(quickViewProduct.id) ? "text-red-500 fill-red-500" : "text-gray-700"
                          }`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          fill="none"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={wishlist.has(quickViewProduct.id) ? 0 : 1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Notification */}
        <AnimatePresence>
          {cartNotification && (
            <motion.div
              className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>{language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!'}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-all duration-300 z-50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              aria-label="Back to Top"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// Error Boundary
import { Component, PropsWithChildren } from "react";

class ErrorBoundary extends Component<PropsWithChildren> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-cinzel font-bold text-red-600">Something went wrong.</h2>
          <p className="mt-4 text-gray-600 font-light">Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HomePageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  );
}