"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, Search, User, Globe, ChevronDown, Instagram, Facebook, Twitter } from "lucide-react";
import { useCart } from "@/lib/CartContext";

interface User {
  email: string;
  role: "admin" | "user";
}

interface Category {
  _id: string;
  name: string;
  collection: string;
  createdAt: string;
}

interface Collection {
  _id: string;
  name: string;
  createdAt: string;
}

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
  cartEmpty: string;
  viewCart: string;
  checkout: string;
  searchButton: string;
  popularSearches: string;
  noResults: string;
}

interface Content {
  vi: LanguageContent;
  en: LanguageContent;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [visibleSubmenu, setVisibleSubmenu] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const headerRef = useRef<HTMLElement>(null);

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s&]+/g, "--")
      .replace(/[^a-z0-9-]/g, "");
  };

  const getContent = (categories: Category[], collections: Collection[]): Content => ({
    vi: {
      announcement: [
        "MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TRÊN 500K VND",
        "THỜI TRANG BỀN VỮNG",
        "RA MẮT BST MÙA XUÂN 2025",
      ],
      navItems: [
        {
          name: "CỬA HÀNG",
          href: "/shop/all",
          submenu: [
            { name: "Tất cả sản phẩm", href: "/shop/all" },
            ...categories.map((category) => ({
              name: category.name,
              href: `/shop/${createSlug(category.name)}`,
            })),
          ],
        },
        {
          name: "BỘ SƯU TẬP",
          href: "/collections",
          submenu: collections.map((collection) => ({
            name: collection.name,
            href: `/collections/${createSlug(collection.name)}`,
          })),
        },
        { name: "GIỚI THIỆU", href: "/about" },
      ],
      searchPlaceholder: "TÌM KIẾM SẢN PHẨM...",
      mobileSearchPlaceholder: "TÌM KIẾM...",
      contact: "LIÊN HỆ",
      address: "235 Nguyễn Văn Cừ, Quận 1, TP. Hồ Chí Minh",
      email: "info@weathered.vn",
      phone: "+84 28 1234 5678",
      followUs: "KẾT NỐI VỚI CHÚNG TÔI",
      ourCollection: "BỘ SƯU TẬP CỦA CHÚNG TÔI",
      login: "ĐĂNG NHẬP",
      register: "ĐĂNG KÝ",
      logout: "ĐĂNG XUẤT",
      welcome: "CHÀO",
      cartEmpty: "Giỏ hàng trống",
      viewCart: "Xem giỏ hàng",
      checkout: "Thanh toán",
      searchButton: "Tìm kiếm",
      popularSearches: "TÌM KIẾM PHỔ BIẾN",
      noResults: "Không tìm thấy sản phẩm nào",
    },
    en: {
      announcement: [
        "FREE SHIPPING ON ORDERS OVER 500K VND",
        "SUSTAINABLE FASHION",
        "SPRING 2025 COLLECTION LAUNCH",
      ],
      navItems: [
        {
          name: "SHOP",
          href: "/shop/all",
          submenu: [
            { name: "All Products", href: "/shop/all" },
            ...categories.map((category) => ({
              name: category.name,
              href: `/shop/${createSlug(category.name)}`,
            })),
          ],
        },
        {
          name: "COLLECTIONS",
          href: "/collections",
          submenu: collections.map((collection) => ({
            name: collection.name,
            href: `/collections/${createSlug(collection.name)}`,
          })),
        },
        { name: "VINTAGE", href: "/vintage" },
        { name: "ARCHIVE", href: "/archive" },
        { name: "ABOUT", href: "/about" },
      ],
      searchPlaceholder: "SEARCH PRODUCTS...",
      mobileSearchPlaceholder: "SEARCH...",
      contact: "CONTACT",
      address: "235 Nguyen Van Cu, District 1, Ho Chi Minh City",
      email: "info@weathered.vn",
      phone: "+84 28 1234 5678",
      followUs: "FOLLOW US",
      ourCollection: "OUR COLLECTION",
      login: "LOGIN",
      register: "REGISTER",
      logout: "LOGOUT",
      welcome: "WELCOME",
      cartEmpty: "Your cart is empty",
      viewCart: "View Cart",
      checkout: "Checkout",
      searchButton: "Search",
      popularSearches: "POPULAR SEARCHES",
      noResults: "No products found",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await fetch("/api/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const categoriesData = await categoriesResponse.json();
        if (categoriesResponse.ok) {
          setCategories(categoriesData.categories || []);
        } else {
          console.error("Failed to fetch categories:", categoriesData.message);
        }

        const collectionsResponse = await fetch("/api/collections", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const collectionsData = await collectionsResponse.json();
        if (collectionsResponse.ok) {
          setCollections(collectionsData.collections || []);
        } else {
          console.error("Failed to fetch collections:", collectionsData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        try {
          const response = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
          } else {
            throw new Error(data.message || "Invalid token");
          }
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      const savedLanguage = localStorage.getItem("language") as "vi" | "en" | null;
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    };
    verifyToken();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isAuthModalOpen || isCartDropdownOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isAuthModalOpen, isCartDropdownOpen, searchOpen]);

  const content = getContent(categories, collections);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % content[language].announcement.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [language, content]);

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
        setIsUserDropdownOpen(false);
      }
      if (
        isCartDropdownOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsCartDropdownOpen(false);
      }
      if (
        searchOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
        setSearchValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visibleSubmenu, isUserDropdownOpen, isCartDropdownOpen, searchOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (searchOpen) setSearchOpen(false);
    if (isAuthModalOpen) setIsAuthModalOpen(false);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
    if (isCartDropdownOpen) setIsCartDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isAuthModalOpen) setIsAuthModalOpen(false);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
    if (isCartDropdownOpen) setIsCartDropdownOpen(false);
  };

  const toggleCartDropdown = () => {
    setIsCartDropdownOpen(!isCartDropdownOpen);
    if (searchOpen) setSearchOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isAuthModalOpen) setIsAuthModalOpen(false);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
  };

  const toggleLanguage = () => {
    const newLanguage = language === "vi" ? "en" : "vi";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: newLanguage } }));
  };

  const handleSubmenuToggle = (index: number) => {
    setVisibleSubmenu(visibleSubmenu === index ? null : index);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
    setError("");
    setFormData({ email: "", password: "", confirmPassword: "" });
    if (searchOpen) setSearchOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
    if (isCartDropdownOpen) setIsCartDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    if (searchOpen) setSearchOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isAuthModalOpen) setIsAuthModalOpen(false);
    if (isCartDropdownOpen) setIsCartDropdownOpen(false);
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
    setError("");
    setFormData({ email: "", password: "", confirmPassword: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    if (!formData.email || !formData.password) {
      setError(language === "vi" ? "Vui lòng điền đầy đủ thông tin" : "Please fill in all fields");
      setIsSubmitting(false);
      return;
    }
    if (!isLoginForm && formData.password !== formData.confirmPassword) {
      setError(language === "vi" ? "Mật khẩu không khớp" : "Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    try {
      const endpoint = isLoginForm ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      localStorage.setItem("token", data.token);
      const userData: User = { email: data.user.email, role: data.user.role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthModalOpen(false);
      setFormData({ email: "", password: "", confirmPassword: "" });
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || (language === "vi" ? "Đã xảy ra lỗi" : "An error occurred"));
      } else {
        setError(language === "vi" ? "Đã xảy ra lỗi" : "An error occurred");
      }
      console.error("Auth error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      handleSearch();
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-1" : "bg-white py-2"
      }`}
    >
      <style jsx>{`
        .scrollbar-hidden {
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .nav-item:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
        }
        svg {
          stroke-width: 2;
        }
        .dropdown {
          max-height: 80vh;
          overflow-y: auto;
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-in-out;
        }
        .modal-enter {
          opacity: 0;
          transform: scale(0.95);
        }
        .modal-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: opacity 300ms, transform 300ms;
        }
        .modal-exit {
          opacity: 1;
          transform: scale(1);
        }
        .modal-exit-active {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-2 overflow-hidden relative">
        <div className="relative container max-w-[95%] sm:max-w-[90%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-6 overflow-hidden">
            <div className="relative h-full flex items-center">
              {content[language].announcement.map((text, index) => (
                <div
                  key={index}
                  className={`absolute flex justify-center items-center w-full transition-all duration-700 transform ${
                    index === announcementIndex ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
                  }`}
                >
                  <span className="text-xs tracking-widest font-light px-4 whitespace-nowrap">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-[95%] sm:max-w-[90%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-auto">
          <div className="hidden lg:flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
              <Link href="/" className="group block relative">
                <div className="relative overflow-hidden">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-transparent via-gray-50 to-gray-50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center">
                    <span
                      className="font-light tracking-widest text-gray-900 group-hover:tracking-[0.35em] transition-all duration-700 font-[Cinzel,serif] text-[clamp(1.6rem,3vw,2.2rem)]"
                    >
                      WEATHERED
                    </span>
                    <span className="block h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-gray-800 to-black transition-all duration-700 ease-in-out mt-1"></span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-full mt-1 overflow-hidden">
                  <span className="hidden group-hover:block h-px w-4 bg-gray-300 mr-2 transition-all duration-500"></span>
                  <p className="text-[8px] text-gray-500 tracking-wider transition-all duration-500 group-hover:tracking-[0.25em] group-hover:text-gray-700">
                    EST. 2025
                  </p>
                  <span className="hidden group-hover:block h-px w-4 bg-gray-300 ml-2 transition-all duration-500"></span>
                </div>
              </Link>
            </div>

            <nav className="flex items-center space-x-6">
              {loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ) : (
                content[language].navItems.map((item, index) => (
                  <div key={index} className="relative group">
                    {item.submenu ? (
                      <div className="relative">
                        <button
                          className="group flex items-center font-medium text-sm tracking-widest text-gray-700 hover:text-black transition-all duration-300 transform nav-item"
                          onClick={() => handleSubmenuToggle(index)}
                        >
                          <span className="relative inline-block">
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300 ease-in-out"></span>
                          </span>
                          <ChevronDown
                            size={14}
                            className={`ml-1 transition-transform duration-300 ${visibleSubmenu === index ? "rotate-180" : ""}`}
                          />
                        </button>
                        {visibleSubmenu === index && (
                          <div className="dropdown absolute top-full left-0 mt-2 py-3 px-4 bg-white shadow-lg rounded-lg min-w-[180px] z-50 border border-gray-100 animate-fade-in-down">
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
                        className="group relative font-medium text-sm tracking-widest text-gray-700 hover:text-black transition-all duration-300 transform nav-item"
                      >
                        <span className="relative inline-block">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300 ease-in-out"></span>
                        </span>
                      </Link>
                    )}
                  </div>
                ))
              )}
              {user && user.role === "admin" && (
                <Link
                  href="/admin"
                  className="group relative font-medium text-sm tracking-widest text-gray-700 hover:text-black transition-all duration-300 transform nav-item"
                >
                  <span className="relative inline-block">
                    {language === "vi" ? "QUẢN TRỊ" : "ADMIN"}
                    <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300 ease-in-out"></span>
                  </span>
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                className="group relative text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <Search size={20} className="transition-transform duration-300" />
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
              </button>
              <div className="relative group">
                <button
                  className="group relative text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
                  aria-label="Account"
                  onClick={user ? toggleUserDropdown : toggleAuthModal}
                >
                  <User size={20} className="transition-transform duration-300" />
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </button>
                {user && isUserDropdownOpen && (
                  <div className="dropdown absolute top-full right-0 mt-2 py-3 px-5 bg-white shadow-lg rounded-lg min-w-[200px] z-50 border border-gray-100 animate-fade-in-down">
                    <div className="absolute top-0 right-5 -mt-1 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                    <div className="flex flex-col space-y-3">
                      <p className="text-sm text-gray-800 font-light tracking-wide">
                        {content[language].welcome}, {user.email}
                      </p>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300 text-left"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          {language === "vi" ? "Trang Quản Trị" : "Admin Dashboard"}
                        </Link>
                      )}
                      <button
                        className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300 text-left"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          setUser(null);
                          setIsUserDropdownOpen(false);
                          router.push("/");
                        }}
                      >
                        {content[language].logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative group">
                <button
                  className="group relative text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
                  aria-label="Cart"
                  onClick={toggleCartDropdown}
                >
                  <ShoppingBag size={20} className="transition-transform duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
                </button>
                {isCartDropdownOpen && (
                  <div className="dropdown absolute top-full right-0 mt-2 py-3 px-5 bg-white shadow-lg rounded-lg min-w-[clamp(200px,45vw,280px)] z-50 border border-gray-100 animate-fade-in-down">
                    <div className="absolute top-0 right-5 -mt-1 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                    <div className="flex flex-col space-y-3">
                      {cart.length === 0 ? (
                        <p className="text-sm text-gray-600 font-light">{content[language].cartEmpty}</p>
                      ) : (
                        <>
                          {cart.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="object-cover rounded"
                                placeholder="blur"
                                blurDataURL="/images/placeholder.jpg"
                              />
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 font-light">{item.name}</p>
                                <p className="text-xs text-gray-600">Size: {item.size}</p>
                                <p className="text-xs text-gray-600">
                                  {item.quantity} x {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2">
                            <p className="text-sm text-gray-800 font-medium">
                              {language === "vi" ? "Tổng cộng" : "Total"}: {formatPrice(totalPrice)}
                            </p>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Link
                              href="/cart"
                              className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300 text-sm"
                              onClick={() => setIsCartDropdownOpen(false)}
                            >
                              {content[language].viewCart}
                            </Link>
                            <Link
                              href="/checkout"
                              className="flex-1 text-center bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 text-sm"
                              onClick={() => setIsCartDropdownOpen(false)}
                            >
                              {content[language].checkout}
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                className="group relative flex items-center text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
                aria-label="Toggle Language"
                onClick={toggleLanguage}
              >
                <Globe size={20} className="transition-transform duration-300" />
                <span className="ml-1 text-xs tracking-wide">{language === "vi" ? "VN" : "EN"}</span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[0.5px] bg-black group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center justify-between w-full px-4 sm:px-6 relative h-16">
            <button
              className="text-gray-800 hover:text-black transition-all duration-300 transform hover:scale-105 p-2 z-20"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <X size={24} className="transition-transform duration-300" />
              ) : (
                <Menu size={24} className="transition-transform duration-300" />
              )}
            </button>

            <div className="flex items-center justify-center flex-1 z-10">
              <Link href="/" className="group block">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-transparent via-gray-100 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center overflow-hidden">
                    <span
                      className="font-light tracking-widest text-gray-900 group-hover:tracking-[0.2em] transition-all duration-300 font-[Cinzel,serif] text-[clamp(1rem,4vw,1.4rem)]"
                    >
                      WEATHERED
                      <span className="block w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-gray-700 to-black transition-all duration-300 ease-in-out"></span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-full mt-1">
                  <span className="block h-px w-2 bg-gray-300 mr-1"></span>
                  <p className="text-[7px] text-gray-500 tracking-wider transition-opacity duration-300">EST. 2025</p>
                  <span className="block h-px w-2 bg-gray-300 ml-1"></span>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6 relative z-20">
              <button
                className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
                aria-label="Search"
                onClick={() => {
                  console.log("Search clicked");
                  toggleSearch();
                }}
              >
                <Search size={20} className="transition-transform duration-300" />
              </button>
              {/* <button
                className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
                aria-label="Account"
                onClick={() => {
                  console.log("User clicked");
                  user ? toggleUserDropdown() : toggleAuthModal();
                }}
              >
                <User size={20} className="transition-transform duration-300" />
              </button> */}
              <button
  className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
  aria-label="Search"
  onClick={() => {
    console.log("Search clicked");
    toggleSearch();
  }}
>
  <Search size={20} className="transition-transform duration-300" />
</button>
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-black transition-all duration-300 transform hover:scale-105 p-2"
                  aria-label="Cart"
                  onClick={() => {
                    console.log("Cart clicked");
                    toggleCartDropdown();
                  }}
                >
                  <ShoppingBag size={20} className="transition-transform duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </button>
                {isCartDropdownOpen && (
                  <div className="dropdown absolute top-full right-0 mt-2 py-3 px-5 bg-white shadow-lg rounded-lg min-w-[clamp(180px,50vw,260px)] z-50 border border-gray-100 animate-fade-in-down">
                    <div className="absolute top-0 right-5 -mt-1 w-2 h-2 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                    <div className="flex flex-col space-y-3">
                      {cart.length === 0 ? (
                        <p className="text-sm text-gray-600 font-light">{content[language].cartEmpty}</p>
                      ) : (
                        <>
                          {cart.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="object-cover rounded"
                                placeholder="blur"
                                blurDataURL="/images/placeholder.jpg"
                              />
                              <div className="flex-1">
                                <p className="text-xs text-gray-800 font-light">{item.name}</p>
                                <p className="text-xs text-gray-600">Size: {item.size}</p>
                                <p className="text-xs text-gray-600">
                                  {item.quantity} x {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2">
                            <p className="text-sm text-gray-800 font-medium">
                              {language === "vi" ? "Tổng cộng" : "Total"}: {formatPrice(totalPrice)}
                            </p>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Link
                              href="/cart"
                              className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300 text-xs"
                              onClick={() => setIsCartDropdownOpen(false)}
                            >
                              {content[language].viewCart}
                            </Link>
                            <Link
                              href="/checkout"
                              className="flex-1 text-center bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 text-xs"
                              onClick={() => setIsCartDropdownOpen(false)}
                            >
                              {content[language].checkout}
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-x-0 top-0 bg-white shadow-md py-6 px-4 sm:px-6 border-b border-gray-100 animate-fade-in-down">
            <div className="container max-w-[90vw] sm:max-w-xl mx-auto relative">
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-all duration-300 transform hover:rotate-90"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchValue("");
                }}
                aria-label="Close Search"
              >
                <X size={20} />
              </button>
              <div className="relative group">
                <div className="flex items-center">
                  <Search size={18} className="absolute left-0 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                  <input
                    id="desktop-search-input"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={content[language].searchPlaceholder}
                    className="w-full border-0 border-b border-gray-200 py-2 pl-8 pr-16 text-[clamp(0.85rem,3vw,0.95rem)] focus:outline-none focus:border-gray-800 bg-transparent transition-colors duration-300 placeholder:text-gray-400 placeholder:font-light"
                    autoFocus
                    aria-label="Search products"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-all duration-300"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gray-800 transition-all duration-700 group-focus-within:w-full"></div>
                {searchValue && (
                  <button
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    onClick={() => setSearchValue("")}
                    aria-label="Clear Search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {!searchValue && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2 tracking-wider font-light">
                    {content[language].popularSearches}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {language === "vi"
                      ? ["Áo sơ mi", "Quần linen", "Váy", "Phụ kiện", "Sale"]
                      : ["Shirts", "Linen Pants", "Dresses", "Accessories", "Sale"].map((item, index) => (
                          <button
                            key={index}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors duration-300"
                            onClick={() => {
                              setSearchValue(item);
                              handleSearch();
                            }}
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

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden modal-enter-active">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-all duration-300 transform hover:scale-110"
              onClick={toggleAuthModal}
              aria-label="Close Auth Modal"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-6 relative z-10">
              {isLoginForm ? content[language].login : content[language].register}
            </h2>
            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50/80 p-3 rounded-md relative z-10">{error}</p>
            )}
            <form onSubmit={handleAuthSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all duration-300 text-sm"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium" htmlFor="password">
                  {language === "vi" ? "Mật khẩu" : "Password"}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all duration-300 text-sm"
                  required
                  aria-required="true"
                />
              </div>
              {!isLoginForm && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium" htmlFor="confirmPassword">
                    {language === "vi" ? "Xác nhận mật khẩu" : "Confirm Password"}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg py-2.5 px-4 focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200 transition-all duration-300 text-sm"
                    required
                    aria-required="true"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-2.5 rounded-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 text-sm font-medium flex items-center justify-center disabled:opacity-50"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoginForm ? content[language].login : content[language].register}
              </button>
            </form>
            <p className="text-sm text-gray-600 mt-4 text-center relative z-10">
              {isLoginForm ? (language === "vi" ? "Chưa có tài khoản?" : "Don't have an account?") : language === "vi" ? "Đã có tài khoản?" : "Already have an account?"}
              <button className="text-gray-900 hover:text-black underline ml-1 font-medium" onClick={switchForm}>
                {isLoginForm ? content[language].register : content[language].login}
              </button>
            </p>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto scrollbar-hidden transition-all duration-500 ease-in-out">
          <div className="min-h-screen flex flex-col max-w-[95%] mx-auto">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <Link href="/" className="block" onClick={closeMenu}>
                <span className="font-light text-lg sm:text-xl tracking-widest text-gray-900 font-[Cinzel,serif]">WEATHERED</span>
              </Link>
              <button
                className="text-gray-800 hover:text-black transition-all duration-300 transform hover:scale-105 hover:rotate-90 p-2"
                onClick={toggleMenu}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
              <nav className="space-y-6 mb-10">
                {loading ? (
                  <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-28"></div>
                    <div className="h-5 bg-gray-200 rounded w-28"></div>
                    <div className="h-5 bg-gray-200 rounded w-28"></div>
                  </div>
                ) : (
                  content[language].navItems.map((item, index) => (
                    <div key={index} className="overflow-hidden">
                      {item.submenu ? (
                        <div className="border-b border-gray-100 pb-3">
                          <button
                            className="flex items-center justify-between w-full text-left text-gray-800 font-medium text-base sm:text-lg tracking-wide transition-colors duration-300"
                            onClick={() => handleSubmenuToggle(index)}
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-300 ${visibleSubmenu === index ? "rotate-180" : ""}`}
                            />
                          </button>
                          <div
                            className={`mt-2 pl-4 space-y-2 overflow-hidden transition-all duration-500 ${
                              visibleSubmenu === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {item.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block text-gray-600 hover:text-black text-sm transition-colors duration-300"
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
                          className="block text-gray-800 hover:text-black font-medium text-base sm:text-lg tracking-wide border-b border-gray-100 pb-3 transition-colors duration-300"
                          onClick={closeMenu}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))
                )}
                <Link
                  href="/contact"
                  className="block text-gray-800 hover:text-black font-medium text-base sm:text-lg tracking-wide border-b border-gray-100 pb-3 transition-colors duration-300"
                  onClick={closeMenu}
                >
                  {content[language].contact}
                </Link>
                {user && user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block text-gray-800 hover:text-black font-medium text-base sm:text-lg tracking-wide border-b border-gray-100 pb-3 transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    {language === "vi" ? "QUẢN TRỊ" : "ADMIN"}
                  </Link>
                )}
                {user ? (
                  <div className="border-b border-gray-100 pb-3">
                    <p className="text-gray-800 text-sm sm:text-base font-light tracking-wide">
                      {content[language].welcome}, {user.email}
                    </p>
                    <button
                      className="text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300 mt-2"
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setUser(null);
                        closeMenu();
                        router.push("/");
                      }}
                    >
                      {content[language].logout}
                    </button>
                  </div>
                ) : (
                  <button
                    className="block text-gray-800 hover:text-black font-medium text-base sm:text-lg tracking-wide border-b border-gray-100 pb-3"
                    onClick={() => {
                      toggleAuthModal();
                      closeMenu();
                    }}
                  >
                    {content[language].login}
                  </button>
                )}
              </nav>
              <div className="mb-10">
                <div className="relative group">
                  <div className="flex items-center">
                    <Search size={18} className="absolute left-0 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={content[language].mobileSearchPlaceholder}
                      className="w-full border-0 border-b border-gray-200 py-2 pl-8 pr-16 text-[clamp(0.85rem,3vw,0.95rem)] focus:outline-none transition-colors duration-300 bg-transparent placeholder:text-gray-400 placeholder:font-light"
                      aria-label="Search products"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-all duration-300"
                      aria-label="Search"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-black transition-all duration-700 group-focus-within:w-full"></div>
                  {searchValue && (
                    <button
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      onClick={() => setSearchValue("")}
                      aria-label="Clear Search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {!searchValue && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2 tracking-wider font-light">
                      {content[language].popularSearches}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {language === "vi"
                        ? ["Áo sơ mi", "Quần linen", "Váy", "Phụ kiện", "Sale"]
                        : ["Shirts", "Linen Pants", "Dresses", "Accessories", "Sale"].map((item, index) => (
                            <button
                              key={index}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors duration-300"
                              onClick={() => {
                                setSearchValue(item);
                                handleSearch();
                              }}
                            >
                              {item}
                            </button>
                          ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-10">
                <button className="flex items-center text-gray-700 hover:text-black transition-colors duration-300" onClick={toggleLanguage}>
                  <Globe size={18} className="mr-2" />
                  <span className="text-sm sm:text-base">{language === "vi" ? "Tiếng Việt" : "English"}</span>
                </button>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <h3 className="text-gray-800 font-medium text-sm tracking-wider mb-3">{content[language].contact}</h3>
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
              <div className="mt-8">
                <h3 className="text-gray-800 font-medium text-sm tracking-wider mb-3">{content[language].followUs}</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-auto px-4 sm:px-6 py-4 border-t border-gray-100 text-xs text-gray-500">© 2025 WEATHERED. All rights reserved.</div>
          </div>
        </div>
      )}

      <div className={`${scrolled ? "h-10 sm:h-12" : "h-14 sm:h-16"} transition-all duration-500`}></div>
    </header>
  );
};

export default Header;