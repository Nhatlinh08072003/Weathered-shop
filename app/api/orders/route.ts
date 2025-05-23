// app/api/orders/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface Order {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
  }>;
  shipping: {
    fullName: string;
    address: string;
    phone: string;
    email: string;
    paymentMethod: string;
  };
  total: number;
  language: "vi" | "en";
}

// In-memory storage (replace with MongoDB)
const orders: Order[] = [];

export async function POST(request: Request) {
  try {
    // Log environment variables
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[REDACTED]" : "undefined");
    console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { message: "Server configuration error: Missing email credentials" },
        { status: 500 }
      );
    }

    const order: Order = await request.json();

    // Validate order
    if (!order.items.length || !order.shipping.email || !order.total) {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
    }

    // Save order
    orders.push(order);

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("Nodemailer transporter verified");

    // Format price in VND
    const formatPrice = (price: number) =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

    // Email content based on language
    const content = {
      vi: {
        adminSubject: "Đơn hàng mới từ Weathered",
        userSubject: "Xác nhận đơn hàng từ Weathered",
        adminGreeting: "Chào Admin,",
        userGreeting: `Chào ${order.shipping.fullName},`,
        adminIntro: "Một đơn hàng mới đã được đặt trên Weathered:",
        userIntro: "Cảm ơn bạn đã đặt hàng tại Weathered! Dưới đây là chi tiết đơn hàng của bạn:",
        orderDetails: "Chi tiết đơn hàng",
        shippingInfo: "Thông tin giao hàng",
        total: "Tổng cộng",
        footer: "Trân trọng,\nWeathered Team",
      },
      en: {
        adminSubject: "New Order from Weathered",
        userSubject: "Order Confirmation from Weathered",
        adminGreeting: "Hello Admin,",
        userGreeting: `Hello ${order.shipping.fullName},`,
        adminIntro: "A new order has been placed on Weathered:",
        userIntro: "Thank you for your order at Weathered! Here are your order details:",
        orderDetails: "Order Details",
        shippingInfo: "Shipping Information",
        total: "Total",
        footer: "Best regards,\nWeathered Team",
      },
    };

    // Generate order items HTML
    const orderItemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatPrice(
            item.price * item.quantity
          )}</td>
        </tr>
      `
      )
      .join("");

    // Admin email
    const adminMailOptions = {
      from: `"Weathered" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: content[order.language].adminSubject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111; font-size: 24px;">${content[order.language].adminGreeting}</h2>
          <p>${content[order.language].adminIntro}</p>
          <h3 style="color: #111; margin-top: 20px;">${content[order.language].orderDetails}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f9f9f9;">
                <th style="padding: 8px; text-align: left;">Hình ảnh</th>
                <th style="padding: 8px; text-align: left;">Sản phẩm</th>
                <th style="padding: 8px; text-align: left;">Kích thước</th>
                <th style="padding: 8px; text-align: left;">Số lượng</th>
                <th style="padding: 8px; text-align: left;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          <h3 style="color: #111;">${content[order.language].shippingInfo}</h3>
          <p><strong>Họ tên:</strong> ${order.shipping.fullName}</p>
          <p><strong>Địa chỉ:</strong> ${order.shipping.address}</p>
          <p><strong>Điện thoại:</strong> ${order.shipping.phone}</p>
          <p><strong>Email:</strong> ${order.shipping.email}</p>
          <p><strong>Phương thức thanh toán:</strong> ${
            order.shipping.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thẻ ngân hàng"
          }</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
            ${content[order.language].total}: ${formatPrice(order.total)}
          </p>
          <p style="margin-top: 20px;">${content[order.language].footer}</p>
        </div>
      `,
    };

    // User email
    const userMailOptions = {
      from: `"Weathered" <${process.env.EMAIL_USER}>`,
      to: order.shipping.email,
      subject: content[order.language].userSubject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111; font-size: 24px;">${content[order.language].userGreeting}</h2>
          <p>${content[order.language].userIntro}</p>
          <h3 style="color: #111; margin-top: 20px;">${content[order.language].orderDetails}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f9f9f9;">
                <th style="padding: 8px; text-align: left;">Hình ảnh</th>
                <th style="padding: 8px; text-align: left;">Sản phẩm</th>
                <th style="padding: 8px; text-align: left;">Kích thước</th>
                <th style="padding: 8px; text-align: left;">Số lượng</th>
                <th style="padding: 8px; text-align: left;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          <h3 style="color: #111;">${content[order.language].shippingInfo}</h3>
          <p><strong>Họ tên:</strong> ${order.shipping.fullName}</p>
          <p><strong>Địa chỉ:</strong> ${order.shipping.address}</p>
          <p><strong>Điện thoại:</strong> ${order.shipping.phone}</p>
          <p><strong>Phương thức thanh toán:</strong> ${
            order.shipping.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thẻ ngân hàng"
          }</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
            ${content[order.language].total}: ${formatPrice(order.total)}
          </p>
          <p style="margin-top: 20px;">${content[order.language].footer}</p>
        </div>
      `,
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({ message: "Order placed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "Failed to place order" }, { status: 500 });
  }
}