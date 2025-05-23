// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";

interface LanguageContent {
  cartTitle: string;
  emptyCart: string;
  product: string;
  size: string;
  quantity: string;
  price: string;
  total: string;
  checkoutButton: string;
  continueShopping: string;
}

interface Content {
  vi: LanguageContent;
  en: LanguageContent;
}

const CartPage = () => {
  const { cart, removeFromCart, addToCart } = useCart();
  const [language, setLanguage] = useState<"vi" | "en">("vi");

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "vi" | "en" | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Multilingual content
  const content: Content = {
    vi: {
      cartTitle: "Giỏ hàng",
      emptyCart: "Giỏ hàng của bạn đang trống",
      product: "Sản phẩm",
      size: "Kích thước",
      quantity: "Số lượng",
      price: "Giá",
      total: "Tổng cộng",
      checkoutButton: "Tiến hành thanh toán",
      continueShopping: "Tiếp tục mua sắm",
    },
    en: {
      cartTitle: "Cart",
      emptyCart: "Your cart is empty",
      product: "Product",
      size: "Size",
      quantity: "Quantity",
      price: "Price",
      total: "Total",
      checkoutButton: "Proceed to Checkout",
      continueShopping: "Continue Shopping",
    },
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Format price in VND
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Update quantity for an item
  const updateQuantity = (item: { id: string; size: string }, delta: number) => {
    const existingItem = cart.find((i) => i.id === item.id && i.size === item.size);
    if (existingItem) {
      const newQuantity = existingItem.quantity + delta;
      if (newQuantity <= 0) {
        removeFromCart(item.id, item.size);
      } else {
        removeFromCart(item.id, item.size);
        addToCart({
          id: item.id,
          name: existingItem.name,
          price: existingItem.price,
          image: existingItem.image,
          quantity: newQuantity,
          size: item.size,
        });
      }
    }
  };

  return (
    <div className="container max-w-5xl mt-[150px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-light tracking-widest text-gray-900 font-[Cinzel,serif] mb-8">
        {content[language].cartTitle}
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg font-light mb-6">{content[language].emptyCart}</p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide"
          >
            {content[language].continueShopping}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="hidden md:grid grid-cols-5 gap-4 border-b border-gray-200 pb-4 mb-6 text-sm text-gray-600 font-light">
              <span className="col-span-2">{content[language].product}</span>
              <span>{content[language].size}</span>
              <span>{content[language].quantity}</span>
              <span>{content[language].price}</span>
            </div>
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                className="flex flex-col md:grid md:grid-cols-5 gap-4 items-center border-b border-gray-100 py-6"
              >
                {/* Product Image and Name */}
                <div className="col-span-2 flex items-center space-x-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="text-gray-800 font-light text-base">{item.name}</p>
                  </div>
                </div>
                {/* Size */}
                <div className="text-gray-600 text-sm">{item.size}</div>
                {/* Quantity */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity({ id: item.id, size: item.size }, -1)}
                    className="text-gray-600 hover:text-black transition-colors duration-300"
                    disabled={item.quantity <= 1}
                  >
                    <ChevronDown size={18} />
                  </button>
                  <span className="text-gray-800 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity({ id: item.id, size: item.size }, 1)}
                    className="text-gray-600 hover:text-black transition-colors duration-300"
                  >
                    <ChevronUp size={18} />
                  </button>
                </div>
                {/* Price */}
                <div className="text-gray-800 font-light">
                  {formatPrice(item.price * item.quantity)}
                </div>
                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="absolute right-0 md:static text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 mt-8 lg:mt-0 bg-gray-50 p-6 rounded-md">
            <h2 className="text-lg font-light text-gray-900 mb-4">
              {content[language].total}
            </h2>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-800 font-light mb-4">
                <span>{content[language].total}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 text-center text-sm tracking-wide"
              >
                {content[language].checkoutButton}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;