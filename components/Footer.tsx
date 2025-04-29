"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e: { preventDefault: () => void; }) => {
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
                <p className="text-xs text-gray-500 tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">EST. 2025</p>
              </Link>
            </div>
            <p className="text-gray-600 mb-10 leading-relaxed text-sm max-w-md animate-fade-in">
              Chúng tôi kết hợp phong cách vintage và archive đầy cá tính với những thiết kế tối giản,
              mang lại vẻ đẹp weathered - những dấu ấn thời gian đã trở thành nghệ thuật trên trang phục.
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
              NEWSLETTER
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Đăng ký để nhận thông tin về sản phẩm mới và bộ sưu tập giới hạn của chúng tôi.
            </p>
            <form onSubmit={handleSubscribe} className="relative mb-6">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn" 
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
                Cảm ơn bạn đã đăng ký nhận bản tin từ Weathered.
              </div>
            )}
          </div>
        </div>
        
        {/* Middle section with links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 gap-y-12 mb-20">
          <div>
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">SHOP</h3>
            <ul className="space-y-4">
              {[
                { name: "Hàng Mới Về", href: "/collections/new-arrivals" },
                { name: "Bán Chạy Nhất", href: "/collections/best-sellers" },
                { name: "Vintage", href: "/collections/vintage" },
                { name: "Archive", href: "/collections/archive" },
                { name: "Khuyến Mãi", href: "/collections/sale" }
              ].map((item, index) => (
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
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">HỖ TRỢ</h3>
            <ul className="space-y-4">
              {[
                { name: "Hướng Dẫn Chọn Size", href: "/size-guide" },
                { name: "Vận Chuyển", href: "/shipping" },
                { name: "Đổi Trả", href: "/returns" },
                { name: "FAQ", href: "/faq" },
                { name: "Liên Hệ", href: "/contact" }
              ].map((item, index) => (
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
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">THƯƠNG HIỆU</h3>
            <ul className="space-y-4">
              {[
                { name: "Về Chúng Tôi", href: "/about" },
                { name: "Bền Vững", href: "/sustainability" },
                { name: "Cửa Hàng", href: "/stores" },
                { name: "Blog", href: "/blog" },
                { name: "Tuyển Dụng", href: "/careers" }
              ].map((item, index) => (
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
            <h3 className="text-xs font-light uppercase tracking-widest mb-6 text-gray-900">LIÊN HỆ</h3>
            <ul className="space-y-4 text-gray-500 text-sm">
              {/* <li className="flex items-start">
                <span>235 Nguyễn Văn Cừ<br/>Quận 1, TP. Hồ Chí Minh</span>
              </li> */}
              <li>
                <a 
                  href="mailto:info@weathered.vn" 
                  className="text-gray-500 hover:text-black text-sm transition-colors duration-300 transform-gpu relative group inline-block"
                >
                  <span>weathered@gmail.com</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+842812345678" 
                  className="text-gray-500 hover:text-black text-sm transition-colors duration-300 transform-gpu relative group inline-block"
                >
                  <span>+84 0886007589</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <span>10:00 - 22:00<br/>Thứ Hai - Chủ Nhật</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs mb-4 md:mb-0">
              © {currentYear} <span className="text-gray-900">WEATHERED</span>. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex flex-wrap space-x-8">
              {["Điều Khoản", "Chính Sách Bảo Mật", "Cookies"].map((item, index) => (
                <Link 
                  key={index}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-gray-500 text-sm hover:text-black transition-colors duration-300 transform-gpu relative group"
                >
                  <span>{item}</span>
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