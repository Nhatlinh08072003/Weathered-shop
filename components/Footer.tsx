"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

// Định nghĩa interface cho nội dung đa ngôn ngữ
interface LanguageContent {
  description: string;
  newsletterTitle: string;
  newsletterDescription: string;
  subscribeSuccess: string;
  shopTitle: string;
  shopItems: { name: string; href: string }[];
  supportTitle: string;
  supportItems: { name: string; href: string }[];
  brandTitle: string;
  brandItems: { name: string; href: string }[];
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactHours: string;
  copyright: string;
  legalItems: { name: string; href: string }[];
}

// Định nghĩa kiểu cho object content
interface Content {
  vi: LanguageContent;
  en: LanguageContent;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  // Nội dung đa ngôn ngữ
  const content: Content = {
    vi: {
      description:
        'Chúng tôi kết hợp phong cách vintage và archive đầy cá tính với những thiết kế tối giản, mang lại vẻ đẹp weathered - những dấu ấn thời gian đã trở thành nghệ thuật trên trang phục.',
      newsletterTitle: 'NEWSLETTER',
      newsletterDescription:
        'Đăng ký để nhận thông tin về sản phẩm mới và bộ sưu tập giới hạn của chúng tôi.',
      subscribeSuccess: 'Cảm ơn bạn đã đăng ký nhận bản tin từ Weathered.',
      shopTitle: 'SHOP',
      shopItems: [
        { name: 'Hàng Mới Về', href: '/collections/new-arrivals' },
        { name: 'Bán Chạy Nhất', href: '/collections/best-sellers' },
        { name: 'Vintage', href: '/collections/vintage' },
        { name: 'Archive', href: '/collections/archive' },
        { name: 'Khuyến Mãi', href: '/collections/sale' },
      ],
      supportTitle: 'HỖ TRỢ',
      supportItems: [
        { name: 'Hướng Dẫn Chọn Size', href: '/size-guide' },
        { name: 'Vận Chuyển', href: '/shipping' },
        { name: 'Đổi Trả', href: '/returns' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Liên Hệ', href: '/contact' },
      ],
      brandTitle: 'THƯƠNG HIỆU',
      brandItems: [
        { name: 'Về Chúng Tôi', href: '/about' },
        { name: 'Bền Vững', href: '/sustainability' },
        { name: 'Cửa Hàng', href: '/stores' },
        { name: 'Blog', href: '/blog' },
        { name: 'Tuyển Dụng', href: '/careers' },
      ],
      contactTitle: 'LIÊN HỆ',
      contactEmail: 'weathered@gmail.com',
      contactPhone: '+84 0886007589',
      contactHours: '10:00 - 22:00<br/>Thứ Hai - Chủ Nhật',
      copyright: `© ${currentYear} <span className="text-gray-900">WEATHERED</span>. Tất cả quyền được bảo lưu.`,
      legalItems: [
        { name: 'Điều Khoản', href: '/dieu-khoan' },
        { name: 'Chính Sách Bảo Mật', href: '/chinh-sach-bao-mat' },
        { name: 'Cookies', href: '/cookies' },
      ],
    },
    en: {
      description:
        'We blend distinctive vintage and archive styles with minimalist designs, delivering a weathered aesthetic—where the marks of time become art on clothing.',
      newsletterTitle: 'NEWSLETTER',
      newsletterDescription:
        'Subscribe to receive updates on new products and our limited-edition collections.',
      subscribeSuccess: 'Thank you for subscribing to Weathered’s newsletter.',
      shopTitle: 'SHOP',
      shopItems: [
        { name: 'New Arrivals', href: '/collections/new-arrivals' },
        { name: 'Best Sellers', href: '/collections/best-sellers' },
        { name: 'Vintage', href: '/collections/vintage' },
        { name: 'Archive', href: '/collections/archive' },
        { name: 'Sale', href: '/collections/sale' },
      ],
      supportTitle: 'SUPPORT',
      supportItems: [
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
      ],
      brandTitle: 'BRAND',
      brandItems: [
        { name: 'About Us', href: '/about' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Stores', href: '/stores' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
      ],
      contactTitle: 'CONTACT',
      contactEmail: 'weathered@gmail.com',
      contactPhone: '+84 0886007589',
      contactHours: '10:00 - 22:00<br/>Monday - Sunday',
      copyright: `© ${currentYear} <span className="text-gray-900">WEATHERED</span>. All rights reserved.`,
      legalItems: [
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Cookies', href: '/cookies' },
      ],
    },
  };

  // Đồng bộ ngôn ngữ từ localStorage và custom event
  useEffect(() => {
    // Đọc ngôn ngữ từ localStorage khi mount
    const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Lắng nghe sự thay đổi của localStorage từ các tab khác
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
      if (newLanguage && newLanguage !== language) {
        setLanguage(newLanguage);
      }
    };

    // Lắng nghe custom event từ cùng tab
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language as 'vi' | 'en';
      if (newLanguage && newLanguage !== language) {
        setLanguage(newLanguage);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, [language]);

  const handleSubscribe = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
            <div className="mb-8">
              <Link href="/" className="group block">
                <h2 className="text-2xl font-light tracking-widest text-gray-900 group-hover:tracking-[0.15em] transition-all duration-300 font-[Cinzel,serif]">
                  WEATHERED
                  <span className="block w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-gray-700 to-black transition-all duration-300"></span>
                </h2>
                <p className="text-xs text-gray-500 tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  EST. 2025
                </p>
              </Link>
            </div>
            <p className="text-gray-600 mb-10 leading-relaxed text-sm max-w-md animate-fade-in">
              {content[language].description}
            </p>
            <div className="flex space-x-8">
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-black transition-all duration-300 transform-gpu hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram size={24} strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-black transition-all duration-300 transform-gpu hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook size={24} strokeWidth={1.5} />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-black transition-all duration-300 transform-gpu hover:scale-105"
                aria-label="Twitter"
              >
                <Twitter size={24} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">
              {content[language].newsletterTitle}
            </h3>
            <p className="text-gray-600 mb-6 text-sm">{content[language].newsletterDescription}</p>
            <form onSubmit={handleSubscribe} className="relative mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'vi' ? 'Email của bạn' : 'Your email'}
                className="bg-transparent border-0 border-b border-gray-200 px-0 py-3 pr-10 w-full text-gray-800 focus:outline-none focus:border-gray-400 text-sm transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full text-gray-400 hover:text-black transition-all duration-300 transform-gpu hover:scale-105"
                aria-label="Subscribe"
              >
                <ArrowRight size={24} strokeWidth={1.5} />
              </button>
            </form>

            {subscribed && (
              <div className="py-2 text-sm text-gray-900 animate-fade-in">
                {content[language].subscribeSuccess}
              </div>
            )}
          </div>
        </div>

        {/* Middle section with links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 gap-y-12 mb-20">
          <div>
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">
              {content[language].shopTitle}
            </h3>
            <ul className="space-y-4">
              {content[language].shopItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-black text-sm transition-colors duration-300 transform-gpu relative group"
                  >
                    <span>{item.name}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">
              {content[language].supportTitle}
            </h3>
            <ul className="space-y-4">
              {content[language].supportItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-black text-sm transition-colors duration-300 transform-gpu relative group"
                  >
                    <span>{item.name}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">
              {content[language].brandTitle}
            </h3>
            <ul className="space-y-4">
              {content[language].brandItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-black text-sm transition-colors duration-300 transform-gpu relative group"
                  >
                    <span>{item.name}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">
              {content[language].contactTitle}
            </h3>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>
                <a
                  href={`mailto:${content[language].contactEmail}`}
                  className="text-gray-500 hover:text-black text-sm transition-colors duration-300 transform-gpu relative group inline-block"
                >
                  <span>{content[language].contactEmail}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${content[language].contactPhone}`}
                  className="text-gray-500 hover:text-black text-sm transition-colors duration-300 transform-gpu relative group inline-block"
                >
                  <span>{content[language].contactPhone}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <span dangerouslySetInnerHTML={{ __html: content[language].contactHours }} />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className="text-gray-500 text-xs mb-4 md:mb-0"
              dangerouslySetInnerHTML={{ __html: content[language].copyright }}
            />
            <div className="flex flex-wrap space-x-8">
              {content[language].legalItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-500 text-sm hover:text-black transition-colors duration-300 transform-gpu relative group"
                >
                  <span>{item.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;