"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";

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
  isNew?: boolean;
  isFeatured?: boolean;
}

// Define API response type
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

// Define props type to handle params as a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState

(0);
  const [cartNotification, setCartNotification] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // Animation variants
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  // Resolve params and fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        // Await params to resolve the Promise
        const { id } = await params;

        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 400) {
            throw new Error("Invalid product ID");
          }
          throw new Error(errorData.message || "Failed to fetch product");
        }
        const data: ApiProduct = await response.json();
        setProduct({
          id: data._id.toString(),
          name: data.name,
          image: data.images[0] || "/placeholder/300x400",
          size: data.size,
          description: data.description,
          category: data.category,
          collection: data.collection,
          price: data.price,
          discount: data.discount,
          images: data.images,
          createdAt: data.createdAt,
          isNew: new Date(data.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isFeatured: !!data.discount,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || "Failed to load product");
        } else {
          setError("Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params]);

  // Handlers
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const addToCartHandler = () => {
    if (!product || !selectedSize) {
      alert("Please select a size.");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
    });
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 3000);
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Structured data for SEO
  const structuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images,
        description: product.description,
        offers: {
          "@type": "Offer",
          priceCurrency: "VND",
          price: product.price,
          availability: "http://schema.org/InStock",
        },
      }
    : {};

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-cinzel font-bold text-red-600">Error</h2>
        <p className="mt-4 text-gray-600 font-light">{error || "Product not found."}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-block px-8 py-3 border border-gray-900 text-gray-900 text-xs uppercase tracking-widest font-light hover:bg-gray-900 hover:text-white transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} | WEATHERED</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.name}, ${product.category}, fashion, weathered`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="bg-white py-16 mt-[100px] font-lora">
        <div className="container text-black max-w-7xl mx-auto px-4">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </button>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" {...fadeInUp}>
            {/* Product Images */}
            <div className="relative">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - WEATHERED`}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-xs uppercase tracking-widest font-light">
                    New
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-all duration-300"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-all duration-300"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 relative rounded-md overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-gray-900" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1} - WEATHERED`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-cinzel font-bold mb-4">{product.name}</h1>
                <p className="text-2xl text-gray-900 mb-6 font-medium">
                  {product.price.toLocaleString("vi-VN")} đ
                  {product.discount && (
                    <span className="text-red-500 ml-2">
                      (-{((product.discount / product.price) * 100).toFixed(0)}%)
                    </span>
                  )}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed font-light">{product.description}</p>

                {/* Size Selection */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-900">Size</h4>
                  <div className="flex gap-2">
                    {product.size.split(",").map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size.trim())}
                        className={`w-12 h-12 border flex items-center justify-center hover:border-gray-900 transition-all font-light text-sm ${
                          selectedSize === size.trim() ? "border-gray-900 bg-gray-100" : "border-gray-200"
                        }`}
                        aria-label={`Select size ${size.trim()}`}
                      >
                        {size.trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-8">
                  <h4 className="font-medium mb-3 text-gray-900">Quantity</h4>
                  <div className="flex border border-gray-200 w-36">
                    <button
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
                      onClick={decreaseQuantity}
                      aria-label="Decrease quantity"
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
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
                      onClick={increaseQuantity}
                      aria-label="Increase quantity"
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

              {/* Add to Cart Button */}
              <button
                onClick={addToCartHandler}
                className="w-full py-4 bg-gray-900 text-white text-xs uppercase tracking-widest font-light hover:bg-black transition-all"
                aria-label="Add to Cart"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>

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
              <span>Added to cart!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}