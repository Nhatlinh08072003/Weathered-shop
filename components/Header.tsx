"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Search, User, Globe, ChevronDown, Instagram, Facebook, Twitter } from 'lucide-react';

// Định nghĩa interface cho nội dung đa ngôn ngữ
interface LanguageContent {
  announcement: string[];
  navItems: { name: string; href: string; submenu?: { name: string; href: string }[] }[];
  searchPlaceholder: string;
  mobileSearchPlaceholder: string;
  contact: string;
  address: string;
  email: string;
  phone: string;
  followUs: string;
  ourCollection: string;
  login: string;
  register: string;
  logout: string;
  welcome: string;
}

// Định nghĩa kiểu cho object content
interface Content {
  vi: LanguageContent;
  en: LanguageContent;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [visibleSubmenu, setVisibleSubmenu] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Thêm state cho dropdown
  const headerRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Nội dung đa ngôn ngữ
  const content: Content = {
    vi: {
      announcement: [
        'MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TRÊN 500K VND',
        'THỜI TRANG BỀN VỮNG',
        'RA MẮT BST MÙA XUÂN 2025',
      ],
      navItems: [
        {
          name: 'CỬA HÀNG',
          href: '/shop',
          submenu: [
            { name: 'Tất cả sản phẩm', href: '/shop/all' },
            { name: 'Áo', href: '/shop/tops' },
            { name: 'Quần', href: '/shop/bottoms' },
            { name: 'Đầm', href: '/shop/dresses' },
            { name: 'Phụ kiện', href: '/shop/accessories' },
          ],
        },
        {
          name: 'BỘ SƯU TẬP',
          href: '/collections',
          submenu: [
            { name: 'Xuân Hè 2025', href: '/collections/spring-summer-2025' },
            { name: 'Thu Đông 2024', href: '/collections/fall-winter-2024' },
            { name: 'Capsule', href: '/collections/capsule' },
          ],
        },
        { name: 'VINTAGE', href: '/vintage' },
        { name: 'ARCHIVE', href: '/archive' },
        { name: 'GIỚI THIỆU', href: '/about' },
      ],
      searchPlaceholder: 'TÌM KIẾM SẢN PHẨM...',
      mobileSearchPlaceholder: 'TÌM KIẾM...',
      contact: 'LIÊN HỆ',
      address: '235 Nguyễn Văn Cừ, Quận 1, TP. Hồ Chí Minh',
      email: 'info@weathered.vn',
      phone: '+84 28 1234 5678',
      followUs: 'KẾT NỐI VỚI CHÚNG TÔI',
      ourCollection: 'BỘ SƯU TẬP CỦA CHÚNG TÔI',
      login: 'ĐĂNG NHẬP',
      register: 'ĐĂNG KÝ',
      logout: 'ĐĂNG XUẤT',
      welcome: 'CHÀO',
    },
    en: {
      announcement: [
        'FREE SHIPPING ON ORDERS OVER 500K VND',
        'SUSTAINABLE FASHION',
        'SPRING 2025 COLLECTION LAUNCH',
      ],
      navItems: [
        {
          name: 'SHOP',
          href: '/shop',
          submenu: [
            { name: 'All Products', href: '/shop/all' },
            { name: 'Tops', href: '/shop/tops' },
            { name: 'Bottoms', href: '/shop/bottoms' },
            { name: 'Dresses', href: '/shop/dresses' },
            { name: 'Accessories', href: '/shop/accessories' },
          ],
        },
        {
          name: 'COLLECTIONS',
          href: '/collections',
          submenu: [
            { name: 'Spring Summer 2025', href: '/collections/spring-summer-2025' },
            { name: 'Fall Winter 2024', href: '/collections/fall-winter-2024' },
            { name: 'Capsule', href: '/collections/capsule' },
          ],
        },
        { name: 'VINTAGE', href: '/vintage' },
        { name: 'ARCHIVE', href: '/archive' },
        { name: 'ABOUT', href: '/about' },
      ],
      searchPlaceholder: 'SEARCH PRODUCTS...',
      mobileSearchPlaceholder: 'SEARCH...',
      contact: 'CONTACT',
      address: '235 Nguyen Van Cu, District 1, Ho Chi Minh City',
      email: 'info@weathered.vn',
      phone: '+84 28 1234 5678',
      followUs: 'FOLLOW US',
      ourCollection: 'OUR COLLECTION',
      login: 'LOGIN',
      register: 'REGISTER',
      logout: 'LOGOUT',
      welcome: 'WELCOME',
    },
  };

  useEffect(() => {
    setIsMounted(true);
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          console.log('Verifying token:', token); // Debug
          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            const parsedUser = JSON.parse(storedUser);
            console.log('User verified:', parsedUser); // Debug
            setUser(parsedUser);
          } else {
            throw new Error(data.message || 'Invalid token');
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        console.log('No token or user found in localStorage'); // Debug
      }
      const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    };
    verifyToken();
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isAuthModalOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % content[language].announcement.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        visibleSubmenu !== null &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setVisibleSubmenu(null);
      }
      if (
        isUserDropdownOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false); // Đóng dropdown khi nhấn ra ngoài
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visibleSubmenu, isUserDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (searchOpen) setSearchOpen(false);
    if (isAuthModalOpen) setIsAuthModalOpen(false);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isAuthModalOpen) setIsAuthModalOpen(false);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
    if (!searchOpen) {
      setTimeout(() => {
        document.getElementById('desktop-search-input')?.focus();
      }, 100);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleSubmenuToggle = (index: number) => {
    setVisibleSubmenu(visibleSubmenu === index ? null : index);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
    setError('');
    setFormData({ email: '', password: '', confirmPassword: '' });
    if (searchOpen) setSearchOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    if (searchOpen) setSearchOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isAuthModalOpen) setIsAuthModalOpen(false);
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
    setError('');
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill in all fields');
      return;
    }

    if (!isLoginForm && formData.password !== formData.confirmPassword) {
      setError(language === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
      return;
    }

    try {
      const endpoint = isLoginForm ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Lưu token và thông tin người dùng
      localStorage.setItem('token', data.token);
      const userData = { email: formData.email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // Cập nhật state ngay lập tức
      console.log('User logged in:', userData); // Debug
      setIsAuthModalOpen(false);
      setFormData({ email: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.message || (language === 'vi' ? 'Đã xảy ra lỗi' : 'An error occurred'));
      console.error('Auth error:', err); // Debug
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsUserDropdownOpen(false);
    setIsAuthModalOpen(false);
    console.log('User logged out'); // Debug
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-1' : 'bg-white py-2'
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-black text-white py-2 mt-[-13px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-80"></div>
        <div className="relative container max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-6 overflow-hidden">
            <div className="relative h-full flex items-center">
              {content[language].announcement.map((text, index) => (
                <div
                  key={index}
                  className={`absolute flex justify-center items-center w-full transition-all duration-700 transform ${
                    index === announcementIndex ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
                  }`}
                >
                  <span className="text-xs tracking-widest font-light px-4 whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-1 mt-[20px]">
        <div className="flex items-center justify-between h-auto">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-800 hover:text-black transition-all duration-300 transform hover:scale-105"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X size={24} className="transition-transform duration-300" />
            ) : (
              <Menu size={24} className="transition-transform duration-300" />
            )}
          </button>

          {/* Desktop layout: Logo, Nav, Icons */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center space-x-6 mt-[20px]">
              <Link href="/" className="group block relative">
                <div className="relative overflow-hidden">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-transparent via-gray-50 to-gray-50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex flex-col items-center">
                    <span className="font-light text-3xl tracking-widest text-gray-900 group-hover:tracking-[0.35em] transition-all duration-700 font-[Cinzel,serif] group-hover:text-black">
                      WEATHERED
                    </span>
                    <span className="block h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-gray-800 to-black transition-all duration-700 ease-in-out mt-1"></span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-full mt-1 overflow-hidden">
                  <span className="hidden group-hover:block h-px w-4 bg-gray-300 mr-2 transition-all duration-500"></span>
                  <p className="text-[9px] text-gray-500 tracking-wider transition-all duration-500 group-hover:tracking-[0.25em] group-hover:text-gray-700">
                    EST. 2025
                  </p>
                  <span className="hidden group-hover:block h-px w-4 bg-gray-300 ml-2 transition-all duration-500"></span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              {content[language].navItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.submenu ? (
                    <div className="relative">
                      <button
                        className="group flex items-center font-light text-sm tracking-widest text-gray-700 hover:text-black transition-colors duration-300 transform"
                        onClick={() => handleSubmenuToggle(index)}
                      >
                        <span className="relative inline-block">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300 ease-in-out"></span>
                        </span>
                        <ChevronDown
                          size={16}
                          className={`ml-1 transition-transform duration-300 ${
                            visibleSubmenu === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {visibleSubmenu === index && (
                        <div className="absolute top-full left-0 mt-1 py-3 px-4 bg-white shadow-lg rounded-md min-w-[180px] z-50 border border-gray-100 animate-fade-in-down">
                          <div className="absolute top-0 left-5 -mt-1 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                          <div className="flex flex-col space-y-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="text-sm text-gray-700 hover:text-black hover:pl-1 transition-all duration-300 whitespace-nowrap"
                                onClick={() => setVisibleSubmenu(null)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="group relative font-light text-sm tracking-widest text-gray-700 hover:text-black transition-colors duration-300 transform"
                    >
                      <span className="relative inline-block">
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300 ease-in-out"></span>
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Icons */}
            <div className="flex items-center space-x-6">
              <button
                className="group relative text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <Search size={22} className="transition-transform duration-300" />
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
              </button>
              <div className="relative group">
                <button
                  className="group relative text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105"
                  aria-label="Account"
                  onClick={user ? toggleUserDropdown : toggleAuthModal} // Toggle dropdown nếu đã đăng nhập
                >
                  <User size={22} className="transition-transform duration-300" />
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </button>
                {user && isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 py-3 px-5 bg-white shadow-lg rounded-md min-w-[200px] z-50 border border-gray-100 animate-fade-in-down">
                    <div className="absolute top-0 right-5 -mt-1 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                    <div className="flex flex-col space-y-3">
                      <p className="text-base text-gray-800 font-light tracking-wide">
                        {content[language].welcome}, {user.email}
                      </p>
                      <button
                        className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300 text-left"
                        onClick={handleLogout}
                      >
                        {content[language].logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/cart" className="group relative" aria-label="Cart">
                <ShoppingBag
                  size={22}
                  className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105"
                />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  0
                </span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button
                className="group relative flex items-center text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105"
                aria-label="Toggle Language"
                onClick={toggleLanguage}
              >
                <Globe size={22} className="transition-transform duration-300" />
                <span className="ml-1 text-xs tracking-wide">{language === 'vi' ? 'VN' : 'EN'}</span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </div>

          {/* Mobile layout: Logo */}
          <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="group block">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-transparent via-gray-100 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center overflow-hidden">
                  <span className="font-light text-2xl tracking-widest text-gray-900 group-hover:tracking-[0.2em] transition-all duration-300 font-[Cinzel,serif]">
                    WEATHERED
                    <span className="block w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-gray-700 to-black transition-all duration-300 ease-in-out"></span>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center w-full mt-1">
                <span className="block h-px w-4 bg-gray-300 mr-2"></span>
                <p className="text-[9px] text-gray-500 tracking-wider transition-opacity duration-300">
                  EST. 2025
                </p>
                <span className="block h-px w-4 bg-gray-300 ml-2"></span>
              </div>
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-5">
            <button
              className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105"
              aria-label="Search"
              onClick={toggleSearch}
            >
              <Search size={22} className="transition-transform duration-300" />
            </button>
            <button
              className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105"
              aria-label="Account"
              onClick={user ? toggleUserDropdown : toggleAuthModal} // Toggle dropdown nếu đã đăng nhập
            >
              <User size={22} className="transition-transform duration-300" />
            </button>
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag
                size={22}
                className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105"
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/5 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-x-0 top-0 bg-white shadow-md py-8 px-4 border-b border-gray-100 transform transition-all duration-500 ease-in-out animate-fade-in-down">
            <div className="container max-w-2xl mx-auto relative">
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-all duration-300 transform hover:rotate-90"
                onClick={() => setSearchOpen(false)}
              >
                <X size={24} />
              </button>
              <div className="relative group">
                <div className="flex items-center">
                  <Search size={20} className="absolute left-0 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                  <input
                    id="desktop-search-input"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={content[language].searchPlaceholder}
                    className="w-full border-0 border-b border-gray-200 py-3 pl-8 pr-8 text-base focus:outline-none focus:border-gray-800 bg-transparent transition-colors duration-300 placeholder:text-gray-400 placeholder:font-light"
                    autoFocus
                  />
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gray-800 transition-all duration-700 group-focus-within:w-full"></div>
                {searchValue && (
                  <button
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    onClick={() => setSearchValue('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              {!searchValue && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500 mb-3 tracking-wider font-light">
                    {language === 'vi' ? 'TÌM KIẾM PHỔ BIẾN' : 'POPULAR SEARCHES'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {language === 'vi'
                      ? ['Áo sơ mi', 'Quần linen', 'Váy', 'Phụ kiện', 'Sale']
                      : ['Shirts', 'Linen Pants', 'Dresses', 'Accessories', 'Sale'].map((item, index) => (
                          <button
                            key={index}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors duration-300"
                            onClick={() => setSearchValue(item)}
                          >
                            {item}
                          </button>
                        ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative animate-fade-in-down">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-all duration-300"
              onClick={toggleAuthModal}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              {isLoginForm ? content[language].login : content[language].register}
            </h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {language === 'vi' ? 'Mật khẩu' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300"
                  required
                />
              </div>
              {!isLoginForm && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    {language === 'vi' ? 'Xác nhận mật khẩu' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300"
              >
                {isLoginForm ? content[language].login : content[language].register}
              </button>
            </form>
            <p className="text-sm text-gray-600 mt-4 text-center">
              {isLoginForm
                ? language === 'vi'
                  ? 'Chưa có tài khoản?'
                  : "Don't have an account?"
                : language === 'vi'
                ? 'Đã có tài khoản?'
                : 'Already have an account?'}
              <button
                className="text-gray-900 hover:text-black underline ml-1"
                onClick={switchForm}
              >
                {isLoginForm ? content[language].register : content[language].login}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-auto transform transition-all duration-500 ease-in-out">
          <div className="min-h-screen flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <Link href="/" className="block" onClick={closeMenu}>
                <span className="font-light text-xl tracking-widest text-gray-900 font-[Cinzel,serif]">
                  WEATHERED
                </span>
              </Link>
              <button
                className="text-gray-800 hover:text-black transition-all duration-300 transform hover:scale-105 hover:rotate-90"
                onClick={toggleMenu}
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 px-6 py-8">
              <nav className="space-y-6 mb-12">
                {content[language].navItems.map((item, index) => (
                  <div key={index} className="overflow-hidden">
                    {item.submenu ? (
                      <div className="border-b border-gray-100 pb-4">
                        <button
                          className="flex items-center justify-between w-full text-left text-gray-800 font-light text-lg tracking-wide transition-colors duration-300"
                          onClick={() => handleSubmenuToggle(index)}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${
                              visibleSubmenu === index ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <div
                          className={`mt-3 pl-4 space-y-3 overflow-hidden transition-all duration-500 ${
                            visibleSubmenu === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block text-gray-600 hover:text-black text-base transition-colors duration-300"
                              onClick={closeMenu}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-gray-800 hover:text-black font-light text-lg tracking-wide border-b border-gray-100 pb-4 transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Link
                  href="/contact"
                  className="block text-gray-800 hover:text-black font-light text-lg tracking-wide border-b border-gray-100 pb-4 transition-colors duration-300"
                  onClick={closeMenu}
                >
                  {content[language].contact}
                </Link>
                {user ? (
                  <div className="border-b border-gray-100 pb-4">
                    <p className="text-gray-800 text-base font-light tracking-wide">
                      {content[language].welcome}, {user.email}
                    </p>
                    <button
                      className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300 mt-2"
                      onClick={handleLogout}
                    >
                      {content[language].logout}
                    </button>
                  </div>
                ) : (
                  <button
                    className="block text-gray-800 hover:text-black font-light text-base tracking-wide border-b border-gray-100 pb-4"
                    onClick={() => {
                      toggleAuthModal();
                      closeMenu();
                    }}
                  >
                    {content[language].login}
                  </button>
                )}
              </nav>
              <div className="mb-12">
                <div className="relative group">
                  <div className="flex items-center">
                    <Search
                      size={20}
                      className="absolute left-0 text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
                    />
                    <input
                      type="text"
                      placeholder={content[language].mobileSearchPlaceholder}
                      className="w-full border-0 border-b border-gray-200 py-3 pl-8 text-base focus:outline-none transition-colors duration-300 bg-transparent placeholder:text-gray-400 placeholder:font-light"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-black transition-all duration-700 group-focus-within:w-full"></div>
                </div>
              </div>
              <div className="mb-12">
                <button
                  className="flex items-center text-gray-700 hover:text-black transition-colors duration-300"
                  onClick={toggleLanguage}
                >
                  <Globe size={20} className="mr-2" />
                  <span className="text-base">
                    {language === 'vi' ? 'Tiếng Việt' : 'English'}
                  </span>
                </button>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <h3 className="text-gray-800 font-medium text-sm tracking-wider mb-4">
                  {content[language].contact}
                </h3>
                <p className="flex items-start space-x-2">
                  <span className="block pt-1">◦</span>
                  <span>{content[language].address}</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="block pt-1">◦</span>
                  <span>{content[language].email}</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="block pt-1">◦</span>
                  <span>{content[language].phone}</span>
                </p>
              </div>
              <div className="mt-10">
                <h3 className="text-gray-800 font-medium text-sm tracking-wider mb-4">
                  {content[language].followUs}
                </h3>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                    <Instagram size={22} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                    <Facebook size={22} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                    <Twitter size={22} />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-auto px-6 py-4 border-t border-gray-100 text-xs text-gray-500">
              © 2025 WEATHERED. All rights reserved.
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className={`${scrolled ? 'h-12' : 'h-16'} transition-all duration-500`}></div>
    </header>
  );
};

export default Header;