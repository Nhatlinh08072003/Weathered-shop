"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cinzel, lora } from '@/lib/fonts';

const ThankYouPage = () => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
    if (savedLanguage) setLanguage(savedLanguage);

    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const content = {
    vi: {
      title: 'Cảm ơn bạn đã đặt hàng',
      message: 'Đơn hàng của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn để xác nhận trong thời gian sớm nhất.',
      backToShop: 'Quay lại cửa hàng',
    },
    en: {
      title: 'Thank You for Your Order',
      message: 'Your order has been successfully submitted. We will contact you to confirm as soon as possible.',
      backToShop: 'Back to Shop',
    },
  };

  return (
    <div className={`bg-white py-24 ${cinzel.variable} ${lora.variable}`}>
      <div className="container max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest text-gray-600 mb-3 block">
            {language === 'vi' ? 'THÀNH CÔNG' : 'SUCCESS'}
          </span>
          <h2 className="text-4xl md:text-5xl text-black font-cinzel font-bold mb-4">
            {content[language].title}
          </h2>
          <span className="block w-16 h-[1px] bg-gray-900 mx-auto mb-6"></span>
          <p className="text-lg text-gray-600 mb-8">{content[language].message}</p>
          <Link
            href="/shop/all"
            className="inline-block px-8 py-3 bg-gray-900 text-white text-xs uppercase tracking-widest font-light hover:bg-black transition-all"
          >
            {content[language].backToShop}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouPage;