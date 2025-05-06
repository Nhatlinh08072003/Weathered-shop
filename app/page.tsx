"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Define Product interface
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

// Banner slider data
const banners = [
  {
    src: "/images/banner1.png",
    title: "Welcome to Our Store",
    description: "Discover the latest fashion trends",
    buttonText: "Shop Now",
    link: "/products",
  },
  {
    src: "/images/banner2.png",
    title: "New Arrivals",
    description: "Explore our newest collection",
    buttonText: "View Collection",
    link: "/collections/new",
  },
  {
    src: "/images/banner3.png",
    title: "Seasonal Sale",
    description: "Up to 50% off selected items",
    buttonText: "Shop Deals",
    link: "/collections/sale",
  },
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cartNotification, setCartNotification] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Autoplay for banner slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Map API data to match UI expectations
        const formattedProducts = data.products.map(
          (product: { _id: string; name: string; images: string[]; price: number }) => ({
            id: product._id,
            name: product.name,
            image: product.images[0] || "https://via.placeholder.com/300x400", // Use first image or fallback
            price: product.price,
          })
        );
        setProducts(formattedProducts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  // Add to cart handler
  const addToCart = (product: Product) => {
    console.log(`Product added: ${product.name}, ID: ${product.id}`);
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 3000);
  };

  return (
    <div className="bg-white">
      {/* Banner Slider */}
      <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="relative w-full h-full flex-shrink-0">
              <Image
                src={banner.src}
                alt={banner.title}
                fill
                style={{ objectFit: "cover" }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-center justify-center">
                <div className="text-center text-white max-w-3xl px-4">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                    {banner.title}
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl mb-6 font-light">
                    {banner.description}
                  </p>
                  <Link
                    href={banner.link}
                    className="inline-block bg-white text-black px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-medium hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    {banner.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-white text-lg" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-white text-lg" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">NEW ARRIVALS</h2>
        <p className="text-gray-600 text-center mb-12">Discover our latest collection</p>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-600">Loading products...</div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600">Error: {error}</div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: Product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-lg">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors mx-auto"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="text-gray-800 text-base" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm md:text-base font-medium">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.price.toLocaleString("vi-VN")} đ</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center text-gray-600">No products available.</div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block px-8 py-3 border-2 border-black text-sm md:text-base hover:bg-black hover:text-white transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Cart Notification */}
      {cartNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Product added to cart!
        </div>
      )}
    </div>
  );
}