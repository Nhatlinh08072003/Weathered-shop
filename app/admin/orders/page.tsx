// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { cinzel, lora } from '@/lib/fonts';
// import { 
//   Package, 
//   Clock, 
//   CheckCircle, 
//   Truck, 
//   ShoppingBag, 
//   XCircle, 
//   Eye, 
//   EyeOff,
//   Filter,
//   Search,
//   Calendar,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   CreditCard,
//   Trash2
// } from 'lucide-react';

// interface Order {
//   _id: string;
//   items: Array<{
//     id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     image: string;
//     size: string;
//   }>;
//   shipping: {
//     fullName: string;
//     address: string;
//     phone: string;
//     email: string;
//     paymentMethod: string;
//   };
//   total: number;
//   status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
//   language: 'vi' | 'en';
//   createdAt: string;
//   updatedAt: string;
// }

// const OrdersPage = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [language, setLanguage] = useState<'vi' | 'en'>('vi');
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dateFilter, setDateFilter] = useState('all');
//   const router = useRouter();

//   useEffect(() => {
//     const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
//     if (savedLanguage) setLanguage(savedLanguage);

//     const handleLanguageChange = (event: CustomEvent) => {
//       setLanguage(event.detail.language);
//     };
//     window.addEventListener('languageChange', handleLanguageChange as EventListener);
//     return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('No token found');
//         }
//         const response = await fetch('/api/orders', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) throw new Error('Failed to fetch orders');
//         const data = await response.json();
//         setOrders(data.orders);
//         setFilteredOrders(data.orders);
//       } catch (err) {
//         setError(language === 'vi' ? 'Không thể tải đơn hàng' : 'Failed to load orders');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, [language]);

//   useEffect(() => {
//     let filtered = orders;

//     // Filter by status
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(order => order.status === statusFilter);
//     }

//     // Filter by search term (customer name, email, order ID)
//     if (searchTerm) {
//       filtered = filtered.filter(order => 
//         order.shipping.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.shipping.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order._id.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by date
//     if (dateFilter !== 'all') {
//       const now = new Date();
//       filtered = filtered.filter(order => {
//         const orderDate = new Date(order.createdAt);
//         switch (dateFilter) {
//           case 'today':
//             return orderDate.toDateString() === now.toDateString();
//           case 'week':
//             const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//             return orderDate >= weekAgo;
//           case 'month':
//             const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//             return orderDate >= monthAgo;
//           default:
//             return true;
//         }
//       });
//     }

//     setFilteredOrders(filtered);
//   }, [orders, statusFilter, searchTerm, dateFilter]);

//   const updateOrderStatus = async (orderId: string, newStatus: string) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found');
//       }
//       const response = await fetch('/api/orders', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id: orderId, status: newStatus }),
//       });
//       if (!response.ok) throw new Error('Failed to update order status');
      
//       setOrders(orders.map(order => 
//         order._id === orderId 
//           ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString() }
//           : order
//       ));
//     } catch (err) {
//       setError(language === 'vi' ? 'Không thể cập nhật trạng thái đơn hàng' : 'Failed to update order status');
//     }
//   };

//   const deleteOrder = async (orderId: string) => {
//     if (!confirm(language === 'vi' ? 'Bạn có chắc chắn muốn xóa đơn hàng này?' : 'Are you sure you want to delete this order?')) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found');
//       }
//       const response = await fetch('/api/orders', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id: orderId }),
//       });
//       if (!response.ok) throw new Error('Failed to delete order');
      
//       setOrders(orders.filter(order => order._id !== orderId));
//     } catch (err) {
//       setError(language === 'vi' ? 'Không thể xóa đơn hàng' : 'Failed to delete order');
//     }
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('vi-VN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="w-5 h-5 text-yellow-500" />;
//       case 'confirmed':
//         return <CheckCircle className="w-5 h-5 text-blue-500" />;
//       case 'shipping':
//         return <Truck className="w-5 h-5 text-purple-500" />;
//       case 'delivered':
//         return <Package className="w-5 h-5 text-green-500" />;
//       case 'cancelled':
//         return <XCircle className="w-5 h-5 text-red-500" />;
//       default:
//         return <Clock className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'confirmed':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'shipping':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'delivered':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const content = {
//     vi: {
//       title: 'Quản lý đơn hàng',
//       searchPlaceholder: 'Tìm kiếm theo tên, email hoặc mã đơn hàng...',
//       filterStatus: 'Lọc theo trạng thái',
//       filterDate: 'Lọc theo ngày',
//       all: 'Tất cả',
//       today: 'Hôm nay',
//       week: 'Tuần này',
//       month: 'Tháng này',
//       orderId: 'Mã đơn hàng',
//       customerInfo: 'Thông tin khách hàng',
//       total: 'Tổng cộng',
//       status: 'Trạng thái',
//       createdAt: 'Ngày tạo',
//       items: 'Sản phẩm',
//       shippingInfo: 'Thông tin giao hàng',
//       name: 'Họ tên',
//       address: 'Địa chỉ',
//       phone: 'Số điện thoại',
//       email: 'Email',
//       paymentMethod: 'Phương thức thanh toán',
//       updateStatus: 'Cập nhật trạng thái',
//       deleteOrder: 'Xóa đơn hàng',
//       viewDetails: 'Xem chi tiết',
//       hideDetails: 'Ẩn chi tiết',
//       noOrders: 'Không có đơn hàng nào',
//       loading: 'Đang tải...',
//       cod: 'Thanh toán khi nhận hàng',
//       card: 'Thẻ ngân hàng',
//       pending: 'Đang chờ',
//       confirmed: 'Đã xác nhận',
//       shipping: 'Đang giao',
//       delivered: 'Đã giao',
//       cancelled: 'Đã hủy',
//       ordersCount: 'đơn hàng',
//       size: 'Kích thước',
//       quantity: 'Số lượng',
//       price: 'Giá'
//     },
//     en: {
//       title: 'Order Management',
//       searchPlaceholder: 'Search by name, email or order ID...',
//       filterStatus: 'Filter by status',
//       filterDate: 'Filter by date',
//       all: 'All',
//       today: 'Today',
//       week: 'This week',
//       month: 'This month',
//       orderId: 'Order ID',
//       customerInfo: 'Customer Information',
//       total: 'Total',
//       status: 'Status',
//       createdAt: 'Created At',
//       items: 'Items',
//       shippingInfo: 'Shipping Information',
//       name: 'Name',
//       address: 'Address',
//       phone: 'Phone',
//       email: 'Email',
//       paymentMethod: 'Payment Method',
//       updateStatus: 'Update Status',
//       deleteOrder: 'Delete Order',
//       viewDetails: 'View Details',
//       hideDetails: 'Hide Details',
//       noOrders: 'No orders found',
//       loading: 'Loading...',
//       cod: 'Cash on Delivery',
//       card: 'Bank Card',
//       pending: 'Pending',
//       confirmed: 'Confirmed',
//       shipping: 'Shipping',
//       delivered: 'Delivered',
//       cancelled: 'Cancelled',
//       ordersCount: 'orders',
//       size: 'Size',
//       quantity: 'Quantity',
//       price: 'Price'
//     },
//   };

//   const statusOptions = [
//     { value: 'pending', label: content[language].pending },
//     { value: 'confirmed', label: content[language].confirmed },
//     { value: 'shipping', label: content[language].shipping },
//     { value: 'delivered', label: content[language].delivered },
//     { value: 'cancelled', label: content[language].cancelled },
//   ];

//   return (
//     <div className={`min-h-screen text-black bg-gray-50 py-8 ${cinzel.variable} ${lora.variable}`}>
//       <div className="container max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <motion.div
//           className="text-center mb-8"
//           initial={{ y: 30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="flex items-center justify-center mb-4">
//             <ShoppingBag className="w-8 h-8 text-black mr-3" />
//             <h1 className="text-4xl md:text-5xl text-black font-cinzel font-bold">
//               {content[language].title}
//             </h1>
//           </div>
//           <div className="flex items-center justify-center text-sm text-gray-600">
//             <Package className="w-4 h-4 mr-1" />
//             <span>{filteredOrders.length} {content[language].ordersCount}</span>
//           </div>
//         </motion.div>

//         {/* Filters */}
//         <motion.div 
//           className="bg-white rounded-xl shadow-sm p-6 mb-8"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//         >
//           <div className="grid md:grid-cols-3 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder={content[language].searchPlaceholder}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <Filter className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
//               <select
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">{content[language].all}</option>
//                 {statusOptions.map((status) => (
//                   <option key={status.value} value={status.value}>
//                     {status.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Date Filter */}
//             <div className="relative">
//               <Calendar className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
//               <select
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//               >
//                 <option value="all">{content[language].all}</option>
//                 <option value="today">{content[language].today}</option>
//                 <option value="week">{content[language].week}</option>
//                 <option value="month">{content[language].month}</option>
//               </select>
//             </div>
//           </div>
//         </motion.div>

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-16">
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               className="inline-block"
//             >
//               <Package className="w-8 h-8 text-gray-400" />
//             </motion.div>
//             <p className="text-gray-600 mt-4">{content[language].loading}</p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-center mb-8">
//             {error}
//           </div>
//         )}

//         {/* No Orders State */}
//         {!loading && !error && filteredOrders.length === 0 && (
//           <div className="text-center py-16">
//             <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-600">{content[language].noOrders}</p>
//           </div>
//         )}

//         {/* Orders List */}
//         {!loading && !error && filteredOrders.length > 0 && (
//           <motion.div
//             className="space-y-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <AnimatePresence>
//               {filteredOrders.map((order, index) => (
//                 <motion.div
//                   key={order._id}
//                   className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   exit={{ y: -20, opacity: 0 }}
//                   transition={{ duration: 0.4, delay: index * 0.05 }}
//                 >
//                   {/* Order Header */}
//                   <div className="p-6">
//                     <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2">
//                           {getStatusIcon(order.status)}
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
//                             {content[language][order.status as keyof typeof content[typeof language]]}
//                           </span>
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           <span className="font-medium">{content[language].orderId}:</span> {order._id}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
//                           className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-black transition-colors"
//                         >
//                           {expandedOrder === order._id ? (
//                             <>
//                               <EyeOff className="w-4 h-4" />
//                               <span>{content[language].hideDetails}</span>
//                             </>
//                           ) : (
//                             <>
//                               <Eye className="w-4 h-4" />
//                               <span>{content[language].viewDetails}</span>
//                             </>
//                           )}
//                         </button>
                        
//                         <button
//                           onClick={() => deleteOrder(order._id)}
//                           className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Quick Info */}
//                     <div className="grid md:grid-cols-3 gap-4 text-sm">
//                       <div className="flex items-center space-x-2 text-gray-600">
//                         <User className="w-4 h-4" />
//                         <span>{order.shipping.fullName}</span>
//                       </div>
//                       <div className="flex items-center space-x-2 text-gray-600">
//                         <Mail className="w-4 h-4" />
//                         <span>{order.shipping.email}</span>
//                       </div>
//                       <div className="flex items-center space-x-2 text-gray-600">
//                         <span className="font-semibold text-black">{formatPrice(order.total)}</span>
//                       </div>
//                     </div>

//                     {/* Status Update Dropdown */}
//                     <div className="mt-4 flex items-center space-x-4">
//                       <select
//                         className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
//                         value={order.status}
//                         onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                       >
//                         {statusOptions.map((status) => (
//                           <option key={status.value} value={status.value}>
//                             {status.label}
//                           </option>
//                         ))}
//                       </select>
//                       <div className="text-xs text-gray-500">
//                         {content[language].createdAt}: {formatDate(order.createdAt)}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expanded Details */}
//                   <AnimatePresence>
//                     {expandedOrder === order._id && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: 'auto', opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="border-t border-gray-200 bg-gray-50"
//                       >
//                         <div className="p-6 space-y-6">
//                           {/* Items */}
//                           <div>
//                             <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                               <Package className="w-4 h-4 mr-2" />
//                               {content[language].items}
//                             </h4>
//                             <div className="space-y-3">
//                               {order.items.map((item, itemIndex) => (
//                                 <div key={itemIndex} className="flex items-center space-x-4 bg-white rounded-lg p-3">
//                                   <img
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="w-16 h-16 object-cover rounded-lg"
//                                   />
//                                   <div className="flex-1">
//                                     <h5 className="font-medium text-gray-900">{item.name}</h5>
//                                     <div className="text-sm text-gray-600 space-y-1">
//                                       <div>{content[language].size}: {item.size}</div>
//                                       <div>{content[language].quantity}: {item.quantity}</div>
//                                       <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>

//                           {/* Shipping Info */}
//                           <div>
//                             <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                               <Truck className="w-4 h-4 mr-2" />
//                               {content[language].shippingInfo}
//                             </h4>
//                             <div className="bg-white rounded-lg p-4 space-y-3">
//                               <div className="grid md:grid-cols-2 gap-4 text-sm">
//                                 <div className="flex items-center space-x-2">
//                                   <User className="w-4 h-4 text-gray-400" />
//                                   <span className="text-gray-600">{content[language].name}:</span>
//                                   <span className="font-medium">{order.shipping.fullName}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                   <Phone className="w-4 h-4 text-gray-400" />
//                                   <span className="text-gray-600">{content[language].phone}:</span>
//                                   <span className="font-medium">{order.shipping.phone}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                   <Mail className="w-4 h-4 text-gray-400" />
//                                   <span className="text-gray-600">{content[language].email}:</span>
//                                   <span className="font-medium">{order.shipping.email}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                   <CreditCard className="w-4 h-4 text-gray-400" />
//                                   <span className="text-gray-600">{content[language].paymentMethod}:</span>
//                                   <span className="font-medium">
//                                     {order.shipping.paymentMethod === 'cod' ? content[language].cod : content[language].card}
//                                   </span>
//                                 </div>
//                               </div>
//                               <div className="flex items-start space-x-2">
//                                 <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
//                                 <div>
//                                   <span className="text-gray-600">{content[language].address}:</span>
//                                   <p className="font-medium">{order.shipping.address}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Added import for Next.js Image
import { motion, AnimatePresence } from 'framer-motion';
import { cinzel, lora } from '@/lib/fonts';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  ShoppingBag, 
  XCircle, 
  Eye, 
  EyeOff,
  Filter,
  Search,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Trash2
} from 'lucide-react';

interface Order {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'vi' | 'en' | null;
    if (savedLanguage) setLanguage(savedLanguage);

    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch {
        setError(language === 'vi' ? 'Không thể tải đơn hàng' : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [language]);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term (customer name, email, order ID)
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.shipping.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm, dateFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString() }
          : order
      ));
    } catch {
      setError(language === 'vi' ? 'Không thể cập nhật trạng thái đơn hàng' : 'Failed to update order status');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm(language === 'vi' ? 'Bạn có chắc chắn muốn xóa đơn hàng này?' : 'Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch('/api/orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId }),
      });
      if (!response.ok) throw new Error('Failed to delete order');
      
      setOrders(orders.filter(order => order._id !== orderId));
    } catch {
      setError(language === 'vi' ? 'Không thể xóa đơn hàng' : 'Failed to delete order');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipping':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const content = {
    vi: {
      title: 'Quản lý đơn hàng',
      searchPlaceholder: 'Tìm kiếm theo tên, email hoặc mã đơn hàng...',
      filterStatus: 'Lọc theo trạng thái',
      filterDate: 'Lọc theo ngày',
      all: 'Tất cả',
      today: 'Hôm nay',
      week: 'Tuần này',
      month: 'Tháng này',
      orderId: 'Mã đơn hàng',
      customerInfo: 'Thông tin khách hàng',
      total: 'Tổng cộng',
      status: 'Trạng thái',
      createdAt: 'Ngày tạo',
      items: 'Sản phẩm',
      shippingInfo: 'Thông tin giao hàng',
      name: 'Họ tên',
      address: 'Địa chỉ',
      phone: 'Số điện thoại',
      email: 'Email',
      paymentMethod: 'Phương thức thanh toán',
      updateStatus: 'Cập nhật trạng thái',
      deleteOrder: 'Xóa đơn hàng',
      viewDetails: 'Xem chi tiết',
      hideDetails: 'Ẩn chi tiết',
      noOrders: 'Không có đơn hàng nào',
      loading: 'Đang tải...',
      cod: 'Thanh toán khi nhận hàng',
      card: 'Thẻ ngân hàng',
      pending: 'Đang chờ',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
      ordersCount: 'đơn hàng',
      size: 'Kích thước',
      quantity: 'Số lượng',
      price: 'Giá'
    },
    en: {
      title: 'Order Management',
      searchPlaceholder: 'Search by name, email or order ID...',
      filterStatus: 'Filter by status',
      filterDate: 'Filter by date',
      all: 'All',
      today: 'Today',
      week: 'This week',
      month: 'This month',
      orderId: 'Order ID',
      customerInfo: 'Customer Information',
      total: 'Total',
      status: 'Status',
      createdAt: 'Created At',
      items: 'Items',
      shippingInfo: 'Shipping Information',
      name: 'Name',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      paymentMethod: 'Payment Method',
      updateStatus: 'Update Status',
      deleteOrder: 'Delete Order',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      noOrders: 'No orders found',
      loading: 'Loading...',
      cod: 'Cash on Delivery',
      card: 'Bank Card',
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipping: 'Shipping',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      ordersCount: 'orders',
      size: 'Size',
      quantity: 'Quantity',
      price: 'Price'
    },
  };

  const statusOptions = [
    { value: 'pending', label: content[language].pending },
    { value: 'confirmed', label: content[language].confirmed },
    { value: 'shipping', label: content[language].shipping },
    { value: 'delivered', label: content[language].delivered },
    { value: 'cancelled', label: content[language].cancelled },
  ];

  return (
    <div className={`min-h-screen text-black bg-gray-50 py-8 ${cinzel.variable} ${lora.variable}`}>
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-black mr-3" />
            <h1 className="text-4xl md:text-5xl text-black font-cinzel font-bold">
              {content[language].title}
            </h1>
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-1" />
            <span>{filteredOrders.length} {content[language].ordersCount}</span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={content[language].searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{content[language].all}</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">{content[language].all}</option>
                <option value="today">{content[language].today}</option>
                <option value="week">{content[language].week}</option>
                <option value="month">{content[language].month}</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Package className="w-8 h-8 text-gray-400" />
            </motion.div>
            <p className="text-gray-600 mt-4">{content[language].loading}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-center mb-8">
            {error}
          </div>
        )}

        {/* No Orders State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">{content[language].noOrders}</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && filteredOrders.length > 0 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {/* Order Header */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {content[language][order.status as keyof typeof content[typeof language]]}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{content[language].orderId}:</span> {order._id}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-black transition-colors"
                        >
                          {expandedOrder === order._id ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              <span>{content[language].hideDetails}</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              <span>{content[language].viewDetails}</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{order.shipping.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{order.shipping.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="font-semibold text-black">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Status Update Dropdown */}
                    <div className="mt-4 flex items-center space-x-4">
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-500">
                        {content[language].createdAt}: {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 bg-gray-50"
                      >
                        <div className="p-6 space-y-6">
                          {/* Items */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Package className="w-4 h-4 mr-2" />
                              {content[language].items}
                            </h4>
                            <div className="space-y-3">
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center space-x-4 bg-white rounded-lg p-3">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <div>{content[language].size}: {item.size}</div>
                                      <div>{content[language].quantity}: {item.quantity}</div>
                                      <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Truck className="w-4 h-4 mr-2" />
                              {content[language].shippingInfo}
                            </h4>
                            <div className="bg-white rounded-lg p-4 space-y-3">
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{content[language].name}:</span>
                                  <span className="font-medium">{order.shipping.fullName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{content[language].phone}:</span>
                                  <span className="font-medium">{order.shipping.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{content[language].email}:</span>
                                  <span className="font-medium">{order.shipping.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{content[language].paymentMethod}:</span>
                                  <span className="font-medium">
                                    {order.shipping.paymentMethod === 'cod' ? content[language].cod : content[language].card}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                  <span className="text-gray-600">{content[language].address}:</span>
                                  <p className="font-medium">{order.shipping.address}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;