// SearchContent.tsx (at root)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cinzel, lora } from "@/lib/fonts";

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
  isNew?: boolean;
  isFeatured?: boolean;
}

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
}

interface SearchContentProps {
  searchQuery: string;
}

const ProductSkeleton = () => (
  <div className="animate-pulse group">
    <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
    <div className="mt-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
    </div>
  </div>
);

export default function SearchContent({ searchQuery }: SearchContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"vi" | "en">("vi");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "vi" | "en" | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };

    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`, {
          cache: "no-store",
        });
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
          isNew: new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isFeatured: !!product.discount,
        }));
        setProducts(mappedProducts);
      } catch (error: unknown) {
        console.error("Fetch error:", error);
        setError(language === "vi" ? "Không thể tải sản phẩm" : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, language]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
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

  return (
    <div className={`bg-white py-24 ${cinzel.variable} ${lora.variable}`}>
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
            {language === "vi" ? "TÌM KIẾM" : "SEARCH"}
          </span>
          <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
            {language === "vi" ? `Kết quả cho "${searchQuery}"` : `Results for "${searchQuery}"`}
          </h2>
          <span className="block w-16 h-[1px] bg-gray-900 mx-auto"></span>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {Array(8).fill(0).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-600 py-16 text-lg">{error}</div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center text-gray-600 py-16">
            <p className="mb-6 text-lg font-light">
              {language === "vi" ? "Không tìm thấy sản phẩm nào" : "No products found"}
            </p>
            <Link
              href="/shop/all"
              className="inline-block px-8 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest font-light hover:bg-black transition-all"
            >
              {language === "vi" ? "Xem Tất Cả Sản Phẩm" : "View All Products"}
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            variants={staggerChildren}
            initial="hidden"
            animate="show"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="group relative"
                variants={fadeInItem}
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
                        {language === "vi" ? "Mới" : "New"}
                      </div>
                    )}
                  </Link>
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
                    {formatPrice(product.price)}
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
      </div>
    </div>
  );
}