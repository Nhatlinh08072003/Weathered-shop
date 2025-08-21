
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  language: 'vi' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[REDACTED]' : 'undefined');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { message: 'Server configuration error: Missing email credentials' },
        { status: 500 }
      );
    }

    const order: Order = await request.json();

    if (!order.items.length || !order.shipping.email || !order.total) {
      console.error('Invalid order data');
      return NextResponse.json({ message: 'Invalid order data' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    const newOrder: Order = {
      ...order,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Inserting new order:', newOrder);
    const result = await ordersCollection.insertOne(newOrder);

    const formatPrice = (price: number) =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const content = {
      vi: {
        adminSubject: 'Đơn hàng mới từ Weathered',
        userSubject: 'Xác nhận đơn hàng từ Weathered',
        adminGreeting: 'Chào Admin,',
        userGreeting: `Chào ${order.shipping.fullName},`,
        adminIntro: 'Một đơn hàng mới đã được đặt trên Weathered:',
        userIntro: 'Cảm ơn bạn đã đặt hàng tại Weathered! Dưới đây là chi tiết đơn hàng của bạn:',
        orderDetails: 'Chi tiết đơn hàng',
        shippingInfo: 'Thông tin giao hàng',
        total: 'Tổng cộng',
        footer: 'Trân trọng,\nWeathered Team',
      },
      en: {
        adminSubject: 'New Order from Weathered',
        userSubject: 'Order Confirmation from Weathered',
        adminGreeting: 'Hello Admin,',
        userGreeting: `Hello ${order.shipping.fullName},`,
        adminIntro: 'A new order has been placed on Weathered:',
        userIntro: 'Thank you for your order at Weathered! Here are your order details:',
        orderDetails: 'Order Details',
        shippingInfo: 'Shipping Information',
        total: 'Total',
        footer: 'Best regards,\nWeathered Team',
      },
    };

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
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
      )
      .join('');

    const adminMailOptions = {
      from: `"Weathered" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: content[order.language].adminSubject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111; font-size: 24px;">${content[order.language].adminGreeting}</h2>
          <p>${content[order.language].adminIntro}</p>
          <p><strong>Mã đơn hàng:</strong> ${result.insertedId}</p>
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
            order.shipping.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ ngân hàng'
          }</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
            ${content[order.language].total}: ${formatPrice(order.total)}
          </p>
          <p style="margin-top: 20px;">${content[order.language].footer}</p>
        </div>
      `,
    };

    const userMailOptions = {
      from: `"Weathered" <${process.env.EMAIL_USER}>`,
      to: order.shipping.email,
      subject: content[order.language].userSubject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111; font-size: 24px;">${content[order.language].userGreeting}</h2>
          <p>${content[order.language].userIntro}</p>
          <p><strong>Mã đơn hàng:</strong> ${result.insertedId}</p>
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
            order.shipping.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ ngân hàng'
          }</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
            ${content[order.language].total}: ${formatPrice(order.total)}
          </p>
          <p style="margin-top: 20px;">${content[order.language].footer}</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json(
      { message: 'Order placed successfully', orderId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        console.error('Unauthorized: Admin access required');
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');
    const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();

    console.log('Found orders count:', orders.length);
    return NextResponse.json({ orders }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT method for updating order status
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        console.error('Unauthorized: Admin access required');
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      console.error('Order ID and status are required');
      return NextResponse.json({ message: 'Order ID and status are required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      console.error('Invalid status:', status);
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    const order = await ordersCollection.findOne({ _id: new ObjectId(id) }) as Order | null;
    if (!order) {
      console.error('Order not found:', id);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      console.error('Order not found or not updated:', id);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Send status update email to customer
    const formatPrice = (price: number) =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const statusMessages = {
      vi: {
        confirmed: {
          subject: 'Đơn hàng đã được xác nhận - Weathered',
          message: 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.',
        },
        shipping: {
          subject: 'Đơn hàng đang được giao - Weathered',
          message: 'Đơn hàng của bạn đang trên đường giao đến bạn.',
        },
        delivered: {
          subject: 'Đơn hàng đã được giao thành công - Weathered',
          message: 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại Weathered!',
        },
        cancelled: {
          subject: 'Đơn hàng đã bị hủy - Weathered',
          message: 'Chúng tôi rất tiếc phải thông báo rằng đơn hàng của bạn đã bị hủy.',
        },
      },
      en: {
        confirmed: {
          subject: 'Order Confirmed - Weathered',
          message: 'Your order has been confirmed and is being prepared.',
        },
        shipping: {
          subject: 'Order Shipped - Weathered',
          message: 'Your order is on its way to you.',
        },
        delivered: {
          subject: 'Order Delivered Successfully - Weathered',
          message: 'Your order has been delivered successfully. Thank you for shopping with Weathered!',
        },
        cancelled: {
          subject: 'Order Cancelled - Weathered',
          message: 'We regret to inform you that your order has been cancelled.',
        },
      },
    };

    const statusContent = statusMessages[order.language][status as keyof typeof statusMessages['vi']];
    
    if (statusContent && status !== 'pending') {
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
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
          </tr>
        `
        )
        .join('');

      const userMailOptions = {
        from: `"Weathered" <${process.env.EMAIL_USER}>`,
        to: order.shipping.email,
        subject: statusContent.subject,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #111; font-size: 24px;">Chào ${order.shipping.fullName},</h2>
            <p>${statusContent.message}</p>
            <p><strong>Mã đơn hàng:</strong> ${id}</p>
            <h3 style="color: #111; margin-top: 20px;">Chi tiết đơn hàng</h3>
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
            <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
              Tổng cộng: ${formatPrice(order.total)}
            </p>
            <p style="margin-top: 20px;">Trân trọng,<br>Weathered Team</p>
          </div>
        `,
      };

      await transporter.sendMail(userMailOptions);
      console.log('Status update email sent to customer:', order.shipping.email);
    }

    return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// export async function DELETE(request: NextRequest) {
//   try {
//     const token = request.headers.get('authorization')?.replace('Bearer ', '');
//     if (!token) {
//       console.error('No token provided');
//       return NextResponse.json({ message: 'No token provided' }, { status: 401 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-secret-key');
//       if (typeof decoded !== 'object' || decoded.role !== 'admin') {
//         console.error('Unauthorized: Admin access required');
//         return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
//       }
//     } catch (error) {
//       console.error('JWT verification error:', error);
//       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//     }

//     const { id } = await request.json();
//     if (!id) {
//       console.error('Order ID is required');
//       return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
//     }

//     const db = await connectToDatabase();
//     const ordersCollection = db.collection('orders');

//     const order = await ordersCollection.findOne({ _id: new ObjectId(id) }) as Order | null;
//     if (!order) {
//       console.error('Order not found:', id);
//       return NextResponse.json({ message: 'Order not found' }, { status: 404 });
//     }

//     const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
//     if (result.deletedCount === 0) {
//       console.error('Order not found or not deleted:', id);
//       return NextResponse.json({ message: 'Order not found' }, { status: 404 });
//     }

//     const formatPrice = (price: number) =>
//       new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

//     const content = {
//       vi: {
//         userSubject: 'Hủy đơn hàng từ Weathered',
//         userGreeting: `Chào ${order.shipping.fullName},`,
//         userIntro: 'Chúng tôi rất tiếc phải thông báo rằng đơn hàng của bạn đã bị hủy. Dưới đây là chi tiết đơn hàng:',
//         orderDetails: 'Chi tiết đơn hàng',
//         shippingInfo: 'Thông tin giao hàng',
//         total: 'Tổng cộng',
//         footer: 'Trân trọng,\nWeathered Team',
//       },
//       en: {
//         userSubject: 'Order Cancellation from Weathered',
//         userGreeting: `Hello ${order.shipping.fullName},`,
//         userIntro: 'We regret to inform you that your order has been cancelled. Here are the order details:',
//         orderDetails: 'Order Details',
//         shippingInfo: 'Shipping Information',
//         total: 'Total',
//         footer: 'Best regards,\nWeathered Team',
//       },
//     };

//     const orderItemsHtml = order.items
//       .map(
//         (item: { image: any; name: any; size: any; quantity: number; price: number; }) => `
//         <tr>
//           <td style="padding: 8px; border-bottom: 1px solid #eee;">
//             <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
//           </td>
//           <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
//           <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
//           <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
//           <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
//         </tr>
//       `
//       )
//       .join('');

//     const userMailOptions = {
//       from: `"Weathered" <${process.env.EMAIL_USER}>`,
//       to: order.shipping.email,
//       subject: content[order.language].userSubject,
//       html: `
//         <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2 style="color: #111; font-size: 24px;">${content[order.language].userGreeting}</h2>
//           <p>${content[order.language].userIntro}</p>
//           <p><strong>Mã đơn hàng:</strong> ${id}</p>
//           <h3 style="color: #111; margin-top: 20px;">${content[order.language].orderDetails}</h3>
//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//             <thead>
//               <tr style="background: #f9f9f9;">
//                 <th style="padding: 8px; text-align: left;">Hình ảnh</th>
//                 <th style="padding: 8px; text-align: left;">Sản phẩm</th>
//                 <th style="padding: 8px; text-align: left;">Kích thước</th>
//                 <th style="padding: 8px; text-align: left;">Số lượng</th>
//                 <th style="padding: 8px; text-align: left;">Giá</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${orderItemsHtml}
//             </tbody>
//           </table>
//           <h3 style="color: #111;">${content[order.language].shippingInfo}</h3>
//           <p><strong>Họ tên:</strong> ${order.shipping.fullName}</p>
//           <p><strong>Địa chỉ:</strong> ${order.shipping.address}</p>
//           <p><strong>Điện thoại:</strong> ${order.shipping.phone}</p>
//           <p><strong>Phương thức thanh toán:</strong> ${
//             order.shipping.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ ngân hàng'
//           }</p>
//           <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
//             ${content[order.language].total}: ${formatPrice(order.total)}
//           </p>
//           <p style="margin-top: 20px;">${content[order.language].footer}</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(userMailOptions);
//     console.log('Cancellation email sent to customer:', order.shipping.email);

//     return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Delete order error:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-secret-key');
      if (typeof decoded !== 'object' || decoded.role !== 'admin') {
        console.error('Unauthorized: Admin access required');
        return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
      }
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      console.error('Order ID is required');
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    const order = await ordersCollection.findOne({ _id: new ObjectId(id) }) as Order | null;
    if (!order) {
      console.error('Order not found:', id);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      console.error('Order not found or not deleted:', id);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const formatPrice = (price: number) =>
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const content = {
      vi: {
        userSubject: 'Hủy đơn hàng từ Weathered',
        userGreeting: `Chào ${order.shipping.fullName},`,
        userIntro: 'Chúng tôi rất tiếc phải thông báo rằng đơn hàng của bạn đã bị hủy. Dưới đây là chi tiết đơn hàng:',
        orderDetails: 'Chi tiết đơn hàng',
        shippingInfo: 'Thông tin giao hàng',
        total: 'Tổng cộng',
        footer: 'Trân trọng,\nWeathered Team',
      },
      en: {
        userSubject: 'Order Cancellation from Weathered',
        userGreeting: `Hello ${order.shipping.fullName},`,
        userIntro: 'We regret to inform you that your order has been cancelled. Here are the order details:',
        orderDetails: 'Order Details',
        shippingInfo: 'Shipping Information',
        total: 'Total',
        footer: 'Best regards,\nWeathered Team',
      },
    };

    const orderItemsHtml = order.items
      .map(
        (item: Order['items'][number]) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
      )
      .join('');

    const userMailOptions = {
      from: `"Weathered" <${process.env.EMAIL_USER}>`,
      to: order.shipping.email,
      subject: content[order.language].userSubject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111; font-size: 24px;">${content[order.language].userGreeting}</h2>
          <p>${content[order.language].userIntro}</p>
          <p><strong>Mã đơn hàng:</strong> ${id}</p>
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
            order.shipping.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ ngân hàng'
          }</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">
            ${content[order.language].total}: ${formatPrice(order.total)}
          </p>
          <p style="margin-top: 20px;">${content[order.language].footer}</p>
        </div>
      `,
    };

    await transporter.sendMail(userMailOptions);
    console.log('Cancellation email sent to customer:', order.shipping.email);

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}