// app/order-confirmation/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LanguageContent {
  title: string;
  message: string;
  continueShopping: string;
}

interface Content {
  vi: LanguageContent;
  en: LanguageContent;
}

const OrderConfirmationPage = () => {
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
      title: "Cảm ơn bạn đã đặt hàng!",
      message: "Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ gửi email xác nhận sớm.",
      continueShopping: "Tiếp tục mua sắm",
    },
    en: {
      title: "Thank You for Your Order!",
      message: "Your order has been confirmed. You will receive a confirmation email soon.",
      continueShopping: "Continue Shopping",
    },
  };

  return (
    <div className="container mt-[200px] max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-light tracking-widest text-white font-[Cinzel,serif] mb-6">
        {content[language].title}
      </h1>
      <p className="text-white mb-6">{content[language].message}</p>
      <Link
        href="/shop"
        className="inline-block bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide"
      >
        {content[language].continueShopping}
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;