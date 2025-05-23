// app/checkout/page.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";

interface LanguageContent {
  quantity: ReactNode;
  size: ReactNode;
  checkoutTitle: string;
  orderSummary: string;
  shippingAddress: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  paymentMethod: string;
  cashOnDelivery: string;
  bankCard: string;
  placeOrder: string;
  backToCart: string;
  total: string;
  requiredField: string;
  invalidEmail: string;
  invalidPhone: string;
  errorMessage: string;
}

interface Content {
  vi: LanguageContent;
  en: LanguageContent;
}

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "cod",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
        checkoutTitle: "Thanh toán",
        orderSummary: "Tóm tắt đơn hàng",
        shippingAddress: "Thông tin giao hàng",
        fullName: "Họ và tên",
        address: "Địa chỉ",
        phone: "Số điện thoại",
        email: "Email",
        paymentMethod: "Phương thức thanh toán",
        cashOnDelivery: "Thanh toán khi nhận hàng",
        bankCard: "Thẻ ngân hàng",
        placeOrder: "Đặt hàng",
        backToCart: "Quay lại giỏ hàng",
        total: "Tổng cộng",
        requiredField: "Trường này là bắt buộc",
        invalidEmail: "Email không hợp lệ",
        invalidPhone: "Số điện thoại không hợp lệ",
        errorMessage: "Đã xảy ra lỗi, vui lòng thử lại",
        quantity: undefined,
        size: undefined
    },
    en: {
        checkoutTitle: "Checkout",
        orderSummary: "Order Summary",
        shippingAddress: "Shipping Address",
        fullName: "Full Name",
        address: "Address",
        phone: "Phone Number",
        email: "Email",
        paymentMethod: "Payment Method",
        cashOnDelivery: "Cash on Delivery",
        bankCard: "Bank Card",
        placeOrder: "Place Order",
        backToCart: "Back to Cart",
        total: "Total",
        requiredField: "This field is required",
        invalidEmail: "Invalid email address",
        invalidPhone: "Invalid phone number",
        errorMessage: "An error occurred, please try again",
        quantity: undefined,
        size: undefined
    },
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Format price in VND
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = { fullName: "", address: "", phone: "", email: "" };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = content[language].requiredField;
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = content[language].requiredField;
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = content[language].requiredField;
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = content[language].invalidPhone;
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = content[language].requiredField;
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = content[language].invalidEmail;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shipping: formData,
          total: totalPrice,
          language, // Include language for email content
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || content[language].errorMessage);
      }

      // Clear cart on successful order
      clearCart();
      // Redirect to order confirmation
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Order submission error:", error);
      setErrors({
        ...errors,
        email: content[language].errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-[100px] max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light tracking-widest text-gray-900 font-[Cinzel,serif] mb-8">
        {content[language].checkoutTitle}
      </h1>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Shipping and Payment Form */}
        <div className="flex-1">
          {/* Shipping Address */}
          <div className="bg-gray-50 p-6 rounded-md mb-6">
            <h2 className="text-lg font-light text-gray-900 mb-4">
              {content[language].shippingAddress}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {content[language].fullName}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {content[language].address}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300 ${
                    errors.address ? "border-red-500" : ""
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {content[language].phone}
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {content[language].email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-800 transition-colors duration-300 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h2 className="text-lg font-light text-gray-900 mb-4">
                  {content[language].paymentMethod}
                </h2>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="text-black focus:ring-black"
                    />
                    <span className="text-gray-600">{content[language].cashOnDelivery}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bankCard"
                      checked={formData.paymentMethod === "bankCard"}
                      onChange={handleInputChange}
                      className="text-black focus:ring-black"
                    />
                    <span className="text-gray-600">{content[language].bankCard}</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Đang xử lý..." : content[language].placeOrder}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 mt-8 lg:mt-0">
          <div className="bg-gray-50 p-6 rounded-md">
            <h2 className="text-lg font-light text-gray-900 mb-4">
              {content[language].orderSummary}
            </h2>
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                className="flex items-center space-x-4 border-b border-gray-100 py-4"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="w-15 h-15 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-light">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {content[language].size}: {item.size}
                  </p>
                  <p className="text-sm text-gray-600">
                    {content[language].quantity}: {item.quantity}
                  </p>
                </div>
                <p className="text-gray-800 font-light">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-gray-800 font-light">
                <span>{content[language].total}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
          <Link
            href="/cart"
            className="block mt-4 text-center text-gray-600 hover:text-black transition-colors duration-300 text-sm"
          >
            {content[language].backToCart}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;