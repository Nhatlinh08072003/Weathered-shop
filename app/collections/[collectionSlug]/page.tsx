// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   category: string;
//   collection: string;
// }

// interface ExtendedProduct extends Product {
//   images?: string[];
// }

// async function fetchProducts(collectionSlug: string): Promise<ExtendedProduct[]> {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
//   console.log('API URL:', apiUrl);

//   try {
//     const res = await fetch(`${apiUrl}/api/products?collection=${encodeURIComponent(collectionSlug)}`, {
//       cache: 'no-store',
//     });
//     if (!res.ok) {
//       console.error(`Failed to fetch products for collection ${collectionSlug}: ${res.status}`);
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

// export default function CollectionPage({ params }: { params: { collectionSlug: string } }) {
//   const [products, setProducts] = useState<ExtendedProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       setError(null);

//       const fetchedProducts = await fetchProducts(params.collectionSlug);
//       console.log('Fetched products:', fetchedProducts); // Debug fetched products
//       setProducts(fetchedProducts);

//       if (fetchedProducts.length === 0) {
//         setError('No products found in this collection.');
//       }

//       setLoading(false);
//     };

//     loadData();
//   }, [params.collectionSlug]);

//   return (
//     <div className="container mt-[150px] mx-auto px-4 py-16 sm:py-24">
//       <header className="mb-12 text-center">
//         <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 capitalize tracking-tight">
//           {params.collectionSlug.replace(/--/g, ' ')}
//         </h1>
//         <p className="mt-2 text-lg text-gray-500">
//           Explore our curated selection in this collection
//         </p>
//       </header>

//       {loading ? (
//         <div className="text-center py-16">
//           <p className="text-xl text-gray-600">Loading...</p>
//         </div>
//       ) : error ? (
//         <div className="text-center py-16">
//           <p className="text-xl text-red-600">{error}</p>
//           <Link
//             href="/shop/all"
//             className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
//           >
//             Browse All Products
//           </Link>
//         </div>
//       ) : products.length === 0 ? (
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
//           {products.map((product) => {
//             console.log(`Rendering product: ${product.name}, Image: ${product.image}`); // Debug image URL
//             return (
//               <div
//                 key={product._id}
//                 className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
//               >
//                 <div className="relative w-full h-64 sm:h-72 bg-gray-100">
//                   <Image
//                     src={product.image}
//                     alt={product.name}
//                     fill
//                     className="object-cover rounded-t-xl"
//                     placeholder="blur"
//                     blurDataURL="/images/placeholder.jpg"
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//                     onError={() => {
//                       console.error(`Failed to load image for product: ${product.name}, URL: ${product.image}`);
//                     }}
//                   />
//                 </div>
//                 <div className="p-4 sm:p-6">
//                   <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
//                     {product.name}
//                   </h2>
//                   <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
//                   <p className="mt-2 text-lg font-medium text-gray-900">
//                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
//                       product.price
//                     )}
//                   </p>
//                   <Link
//                     href={`/products/${product._id}`}
//                     className="mt-4 block w-full text-center px-4 py-2 bg-black text-white rounded-md group-hover:bg-gray-800 transition-colors duration-300"
//                   >
//                     View Product
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  collection: string;
}

interface ExtendedProduct extends Product {
  images?: string[];
}

async function fetchProducts(collectionSlug: string): Promise<ExtendedProduct[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  console.log('Fetching products for collection:', collectionSlug);

  try {
    const res = await fetch(`${apiUrl}/api/products?collection=${encodeURIComponent(collectionSlug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Failed to fetch products for collection ${collectionSlug}: ${res.status}`);
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

export default function CollectionPage({ params }: { params: { collectionSlug: string } }) {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const fetchedProducts = await fetchProducts(params.collectionSlug);
      console.log('Fetched products:', fetchedProducts);
      setProducts(fetchedProducts);

      if (fetchedProducts.length === 0) {
        setError(`No products found in the "${params.collectionSlug.replace(/--/g, ' ')}" collection.`);
      }

      setLoading(false);
    };

    loadData();
  }, [params.collectionSlug]);

  return (
    <div className="container mt-16 mx-auto px-4 py-16 sm:py-24">
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 capitalize tracking-tight">
          {params.collectionSlug.replace(/--/g, ' ')}
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Explore our curated selection in this collection
        </p>
      </header>

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
          {products.map((product) => {
            console.log(`Rendering product: ${product.name}, Image: ${product.image}`);
            return (
              <div
                key={product._id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-64 sm:h-72 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-xl"
                    placeholder="blur"
                    blurDataURL="/images/placeholder.jpg"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onError={() => {
                      console.error(`Failed to load image for product: ${product.name}, URL: ${product.image}`);
                    }}
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <p className="mt-2 text-lg font-medium text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      product.price
                    )}
                  </p>
                  <Link
                    href={`/products/${product._id}`}
                    className="mt-4 block w-full text-center px-4 py-2 bg-black text-white rounded-md group-hover:bg-gray-800 transition-colors duration-300"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}