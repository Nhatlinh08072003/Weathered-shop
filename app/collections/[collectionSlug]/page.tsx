import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

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

interface CollectionPageProps {
  params: Promise<{ collectionSlug: string }>;
}

async function fetchProducts(collectionSlug: string): Promise<ExtendedProduct[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  console.log("Fetching products for collection:", collectionSlug);
  try {
    const res = await fetch(`${apiUrl}/api/products?collection=${encodeURIComponent(collectionSlug)}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to fetch products for collection ${collectionSlug}: ${res.status}`);
      return [];
    }
    const data = await res.json();
    console.log("API Response:", data);
    const products = (data.products || []).map((product: ExtendedProduct) => ({
      ...product,
      image: product.images?.length ? product.images[0] : product.image || "/images/placeholder.jpg",
    }));
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function fetchCollectionName(collectionSlug: string): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/api/collections`, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Failed to fetch collections: ${res.status}`);
      return collectionSlug.replace(/--/g, " ");
    }
    const data = await res.json();
    const collection = data.collections.find(
      (col: { name: string }) => createSlug(col.name) === collectionSlug
    );
    return collection ? collection.name : collectionSlug.replace(/--/g, " ");
  } catch (error) {
    console.error("Error fetching collection name:", error);
    return collectionSlug.replace(/--/g, " ");
  }
}

const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s&]+/g, "--")
    .replace(/[^a-z0-9-]/g, "");
};

const ProductCard = ({ product }: { product: ExtendedProduct }) => {
  return (
    <div className="group relative bg-white rounded-none shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200">
      {/* Product Image */}
      <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="/images/placeholder.jpg"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => {
            console.error(`Failed to load image for product: ${product.name}, URL: ${product.image}`);
          }}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-black">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
            }).format(product.price)}
          </p>
          <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Link
            href={`/products/${product._id}`}
            className="flex-1 text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
          >
            VIEW PRODUCT
          </Link>
          <button className="px-6 py-3 bg-white text-black border border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionSlug } = await params; // Unwrap the Promise
  const products = await fetchProducts(collectionSlug);
  const collectionName = await fetchCollectionName(collectionSlug);
  const error = products.length === 0 ? `No products found in the "${collectionName}" collection.` : null;

  return (
    <div className="min-h-screen text-black bg-white">
      <div className="container mx-auto px-4 py-8 mt-[120px]">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-6xl font-light text-black capitalize tracking-wider">
            {collectionName || "Collection"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Discover our carefully curated selection of premium products
          </p>
          <div className="w-24 h-px bg-black mx-auto"></div>
        </div>

        {error ? (
          <div className="text-center py-20 space-y-6">
            <div className="w-32 h-32 bg-gray-100 mx-auto flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-light text-black">Collection Empty</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto font-light">{error}</p>
            <Link
              href="/shop/all"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
            >
              EXPLORE ALL PRODUCTS
            </Link>
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="mb-8">
              <p className="text-gray-600 font-light">
                Showing <span className="font-medium text-black">{products.length}</span> products
              </p>
            </div>

            {/* Products (Grid View Only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}