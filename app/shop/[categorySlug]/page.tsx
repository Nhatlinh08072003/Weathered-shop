// import Link from 'next/link';
// import { notFound } from 'next/navigation';
// import Image from 'next/image';
// import { Product } from '@/types/product';

// interface ShopPageProps {
//   params: Promise<{ categorySlug: string }>; // Allow Promise for Next.js 15.3.1
// }

// interface ExtendedProduct extends Product {
//   images?: string[];
// }

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
//     }));

//     return products;
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return [];
//   }
// }

// export default async function ShopPage({ params }: ShopPageProps) {
//   const { categorySlug } = await params; // Await params to resolve Promise
//   console.log('Category Slug:', categorySlug);

//   const products = await fetchProducts(categorySlug);
//   console.log('Products:', products.map(p => ({ name: p.name, image: p.image, category: p.category })));

//   if (products.length === 0 && categorySlug !== 'all') {
//     console.log(`No products found for category: ${categorySlug}`);
//     notFound();
//   }

//   return (
//     <div className="container mt-16 mx-auto px-4 py-16 sm:py-24">
//       {/* Header Section */}
//       <header className="mb-12 text-center">
//         <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 capitalize tracking-tight">
//           {categorySlug === 'all'
//             ? 'All Products'
//             : `Products in ${categorySlug.replace(/-/g, ' ')}`}
//         </h1>
//         <p className="mt-2 text-lg text-gray-500">
//           Explore our curated collection of high-quality items
//         </p>
//       </header>

//       {/* Product Grid */}
//       {products.length === 0 ? (
//         <div className="text-center py-16">
//           <p className="text-xl text-gray-600">No products found.</p>
//           <Link
//             href="/shop/all"
//             className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
//           >
//             Browse All Products
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
//             >
//               {/* Image Container */}
//               <div className="relative w-full h-64 sm:h-72 bg-gray-100">
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   fill
//                   className="object-cover rounded-t-xl"
//                   placeholder="blur"
//                   blurDataURL="/images/placeholder.jpg"
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//                 />
//               </div>

//               {/* Product Details */}
//               <div className="p-4 sm:p-6">
//                 <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
//                   {product.name}
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">{product.category}</p>
//                 <p className="mt-2 text-lg font-bold text-gray-900">
//                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
//                     product.price
//                   )}
//                 </p>
//                 <p className="mt-1 text-sm text-gray-600">Size: {product.size}</p>
//                 <Link
//                   href={`/products/${product._id}`}
//                   className="mt-4 block w-full text-center px-4 py-2 bg-black text-white rounded-md group-hover:bg-gray-800 transition-colors duration-300"
//                 >
//                   View Details
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types/product';

interface ExtendedProduct extends Product {
  images?: string[];
}

interface Category {
  _id: string;
  name: string;
}

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

export default function ShopPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  console.log('Category Slug:', categorySlug);

  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const [fetchedProducts, fetchedCategories] = await Promise.all([
        fetchProducts(categorySlug),
        fetchCategories(),
      ]);

      setProducts(fetchedProducts);
      setCategories(fetchedCategories);

      if (fetchedProducts.length === 0 && categorySlug !== 'all') {
        setError('No products found for this category.');
      }

      setLoading(false);
    };

    loadData();
  }, [categorySlug]);

  // Hàm chuyển đổi slug thành tên danh mục hiển thị
  const displayCategoryName = (slug: string) => {
    if (slug === 'all') return 'All Products';
    const categoryMap: { [key: string]: string } = {
      'coats--jackets': 'Coats & Jackets',
      'ao-so-mi': 'Áo sơ mi',
      'quan-linen': 'Quần linen',
      'vay': 'Váy',
      'phu-kien': 'Phụ kiện',
    };
    // Tìm danh mục từ API categories
    const category = categories.find(
      (cat) =>
        cat.name.toLowerCase().replace(/[\s&]+/g, '--') === slug ||
        cat.name.toLowerCase().replace(/[\s&]+/g, '-') === slug
    );
    return category ? category.name : categoryMap[slug] || slug.replace(/--?/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Kiểm tra slug hợp lệ
  const isValidSlug = categorySlug === 'all' || categories.some(
    (cat) =>
      cat.name.toLowerCase().replace(/[\s&]+/g, '--') === categorySlug ||
      cat.name.toLowerCase().replace(/[\s&]+/g, '-') === categorySlug
  );

  if (!loading && !isValidSlug) {
    console.log(`Invalid category slug: ${categorySlug}`);
    // notFound();
    setError(`Invalid category slug: ${categorySlug}`);
  }

  return (
    <div className="container  mt-[150px] mx-auto px-4 py-16 sm:py-24">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 capitalize tracking-tight">
          {displayCategoryName(categorySlug)}
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Explore our curated collection of high-quality items
        </p>
      </header>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-xl text-red-600">{error}</p>
          <Link
            href="/shop/all"
            className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
          >
            Browse All Products
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products found.</p>
          <Link
            href="/shop/all"
            className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 sm:h-72 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-xl"
                  placeholder="blur"
                  blurDataURL="/images/placeholder.jpg"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Product Details */}
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{displayCategoryName(product.category)}</p>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    product.price
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-600">Size: {product.size}</p>
                <Link
                  href={`/products/${product._id}`}
                  className="mt-4 block w-full text-center px-4 py-2 bg-black text-white rounded-md group-hover:bg-gray-800 transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}