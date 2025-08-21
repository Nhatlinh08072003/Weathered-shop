"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Tag, Package, Folder } from 'lucide-react';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Tổng Quan', href: '/admin', icon: <Menu size={20} /> },
    { name: 'Danh Mục', href: '/admin/categories', icon: <Tag size={20} /> },
    { name: 'Sản Phẩm', href: '/admin/products', icon: <Package size={20} /> },
    { name: 'Bộ Sưu Tập', href: '/admin/collections', icon: <Folder size={20} /> },
    { name: 'Đơn Hàng', href: '/admin/orders', icon: <Folder size={20} /> },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-gray-800 hover:text-black transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full mt-[200px] bg-white shadow-lg z-40 transition-transform duration-300 md:w-64 w-64 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-light text-gray-900 mb-8">Quản Trị</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors duration-300 ${
                  pathname === item.href
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;