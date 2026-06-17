import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Box, Layers, LogOut, Plus, Trash2, Edit, Check, X, ShieldAlert, CheckCircle, Clock, 
  ShoppingBag, Upload, User, Smartphone, Lock, Eye, EyeOff, Tag, AlertTriangle, TrendingUp, Inbox
} from 'lucide-react';
import { TinyInvoiceDetails } from './TinyInvoiceDetails';
import { User as UserType, Product, Category, Order, OrderStatus } from '../types';
import { formatSellerId } from '../idUtils';
import { getDhakaDate, formatToDhakaTime, formatToDhakaDateOnly } from '../dateUtils';

interface SellerPanelProps {
  currentUser: UserType;
  setCurrentUser: (u: UserType | null) => void;
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onLogout: () => void;
  showNotif: (msg: string, type: 'success' | 'error') => void;
}

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

export default function SellerPanel({
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  products,
  setProducts,
  categories,
  orders,
  setOrders,
  onLogout,
  showNotif
}: SellerPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'profile'>('dashboard');

  // Add Product & Edit Product States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states for Add / Edit Product
  const [prodForm, setProdForm] = useState({
    name: '',
    catId: categories[0]?.id || '',
    description: '',
    img: '',
    originalPrice: 0,
    discountPrice: 0,
    buyRate: 0,
    minSellRate: 0,
    defaultSellRate: 0,
    inStock: true
  });

  // Password / Profile update states
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [shopBioDesc, setShopBioDesc] = useState(currentUser.kyc?.nidName || '');

  // Tracking details state for orders
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState('');
  const [courierTracking, setCourierTracking] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [localSellerOrderFilter, setLocalSellerOrderFilter] = useState<'all' | OrderStatus>('all');

  const updateSellerOrderStatus = (orderId: string, nextStage: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    let logsDesc = '';
    if (nextStage === 'Approved') {
      logsDesc = 'Order confirmed and approved by the vendor store.';
    } else if (nextStage === 'Processing') {
      logsDesc = 'Product packed and dispatched to vendor logistic hub.';
    } else if (nextStage === 'Shipped') {
      logsDesc = `Shipped via ${courierName || 'Local Courier'}. Tracking Ref: ${courierTracking || 'N/A'}`;
    } else if (nextStage === 'Delivered') {
      logsDesc = 'Order delivered successfully to the terminal address.';
    } else if (nextStage === 'Cancelled') {
      logsDesc = `Cancelled by vendor. Reason: ${cancelReason || 'Inventory shortfall'}`;
    }

    const timestampStr = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newTimelineNode = {
      status: nextStage,
      date: timestampStr,
      description: logsDesc,
      isCompleted: true
    };

    const cleanTimeline = (targetOrder.timeline || []).map(node => {
      if (node.status === nextStage) {
        return { ...node, isCompleted: true, date: timestampStr, description: logsDesc };
      }
      return node;
    });

    const hasNode = cleanTimeline.some(node => node.status === nextStage);
    const updatedTimelineLog = hasNode ? cleanTimeline : [...cleanTimeline, newTimelineNode];

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStage,
          timeline: updatedTimelineLog
        };
      }
      return o;
    });

    setOrders(updatedOrders);

    if (nextStage === 'Delivered' && targetOrder.status !== 'Delivered') {
      if (targetOrder.type === 'reseller' && targetOrder.userId) {
        const pMargin = targetOrder.profit || 0;
        if (pMargin > 0) {
          setUsers(prev => prev.map(u => {
            if (u.id === targetOrder.userId) {
              const newBal = u.balance + pMargin;
              return {
                ...u,
                balance: newBal,
                activities: [
                  {
                    id: 'act_' + Date.now(),
                    date: timestampStr,
                    type: 'profit',
                    desc: `Delivered: ${targetOrder.productName} + commission credited.`,
                    amount: pMargin
                  },
                  ...(u.activities || [])
                ]
              };
            }
            return u;
          }));
          showNotif(`Delivered! Added ৳${pMargin} commission profit to reseller's cleared balance.`, "success");
        }
      }
    } else {
      showNotif(`Order tracking ID ${targetOrder.trackingId} updated to: ${nextStage}`, "success");
    }

    const updatedSelectedOrder = updatedOrders.find(o => o.id === orderId);
    if (updatedSelectedOrder) {
      setSelectedOrder(updatedSelectedOrder);
    } else {
      setSelectedOrder(null);
    }

    setCourierName('');
    setCourierTracking('');
    setCancelReason('');
  };

  // Filter seller's products
  const sellerProducts = useMemo(() => {
    return products.filter(p => p.sellerId === currentUser.id);
  }, [products, currentUser.id]);

  // Statistics for products
  const stats = useMemo(() => {
    const total = sellerProducts.length;
    const approved = sellerProducts.filter(p => p.approvalStatus === 'approved').length;
    const pending = sellerProducts.filter(p => p.approvalStatus === 'pending').length;
    const rejected = sellerProducts.filter(p => p.approvalStatus === 'rejected').length;
    return { total, approved, pending, rejected };
  }, [sellerProducts]);

  // Orders that contain this seller's products
  const sellerOrders = useMemo(() => {
    return orders
      .filter(o => {
        if (o.sellerId) {
          return o.sellerId === currentUser.id;
        }
        return sellerProducts.some(sp => sp.name.trim().toLowerCase() === o.productName.trim().split(' (x')[0].trim().toLowerCase());
      })
      .sort((a, b) => {
        const aTimeStr = a.id.replace('o_demo', '').replace('o_', '');
        const bTimeStr = b.id.replace('o_demo', '').replace('o_', '');
        const aTimeNum = parseInt(aTimeStr, 10);
        const bTimeNum = parseInt(bTimeStr, 10);
        if (!isNaN(aTimeNum) && !isNaN(bTimeNum)) {
          return bTimeNum - aTimeNum;
        }
        const aDate = Date.parse(a.date);
        const bDate = Date.parse(b.date);
        if (!isNaN(aDate) && !isNaN(bDate) && aDate !== bDate) {
          return bDate - aDate;
        }
        return b.id.localeCompare(a.id);
      });
  }, [orders, sellerProducts, currentUser.id]);

  // Statistics for orders and revenue
  const orderStats = useMemo(() => {
    const totalOrders = sellerOrders.length;
    const completedOrders = sellerOrders.filter(o => o.status === 'Delivered').length;
    const activeOrders = sellerOrders.filter(o => ['Approved', 'Processing', 'Shipped'].includes(o.status)).length;
    const pendingOrders = sellerOrders.filter(o => o.status === 'Pending').length;
    const cancelledOrders = sellerOrders.filter(o => o.status === 'Cancelled').length;

    const totalRevenue = sellerOrders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + (o.sellRate * o.qty), 0);

    const pendingRevenue = sellerOrders
      .filter(o => ['Pending', 'Approved', 'Processing', 'Shipped'].includes(o.status))
      .reduce((sum, o) => sum + (o.sellRate * o.qty), 0);

    return {
      totalOrders,
      completedOrders,
      activeOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      pendingRevenue
    };
  }, [sellerOrders]);

  const filteredSellerOrders = useMemo(() => {
    if (localSellerOrderFilter === 'all') return sellerOrders;
    return sellerOrders.filter(o => o.status === localSellerOrderFilter);
  }, [sellerOrders, localSellerOrderFilter]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotif("Image must be under 5MB size limit.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const compressed = await compressImage(reader.result as string);
        setProdForm(prev => ({ ...prev, img: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) {
      showNotif("Please provide a valid product name", "error");
      return;
    }
    if (!prodForm.img) {
      showNotif("Product image is required.", "error");
      return;
    }

    const newProd: Product = {
      id: 'prod_' + Date.now(),
      catId: prodForm.catId,
      name: prodForm.name.trim(),
      description: prodForm.description.trim(),
      img: prodForm.img,
      originalPrice: Number(prodForm.originalPrice) || 0,
      discountPrice: Number(prodForm.discountPrice) || 0,
      buyRate: Number(prodForm.buyRate) || 0,
      minSellRate: Number(prodForm.minSellRate) || 0,
      defaultSellRate: Number(prodForm.defaultSellRate) || 0,
      rating: 5.0,
      sales: 0,
      inStock: prodForm.inStock,
      isFlash: false,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      approvalStatus: 'pending' // Added products must go through administrative review
    };

    setProducts(prev => [newProd, ...prev]);
    setShowAddModal(false);
    resetProdForm();
    showNotif("Product submitted successfully for Admin review, please wait for approval.", "success");
  };

  const handleEditClick = (p: Product) => {
    setSelectedProduct(p);
    setProdForm({
      name: p.name,
      catId: p.catId,
      description: p.description,
      img: p.img,
      originalPrice: p.originalPrice,
      discountPrice: p.discountPrice,
      buyRate: p.buyRate,
      minSellRate: p.minSellRate,
      defaultSellRate: p.defaultSellRate,
      inStock: p.inStock
    });
    setShowEditModal(true);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!prodForm.name.trim()) {
      showNotif("Please enter a valid product name", "error");
      return;
    }

    setProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          name: prodForm.name.trim(),
          catId: prodForm.catId,
          description: prodForm.description.trim(),
          img: prodForm.img,
          originalPrice: Number(prodForm.originalPrice) || 0,
          discountPrice: Number(prodForm.discountPrice) || 0,
          buyRate: Number(prodForm.buyRate) || 0,
          minSellRate: Number(prodForm.minSellRate) || 0,
          defaultSellRate: Number(prodForm.defaultSellRate) || 0,
          inStock: prodForm.inStock,
          approvalStatus: 'pending' // Resets verification status for safety audit reviews
        };
      }
      return p;
    }));

    setShowEditModal(false);
    setSelectedProduct(null);
    resetProdForm();
    showNotif("Product details updated and re-queued for Admin review approval.", "success");
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== prodId));
      showNotif("Product deleted successfully.", "success");
    }
  };

  const resetProdForm = () => {
    setProdForm({
      name: '',
      catId: categories[0]?.id || '',
      description: '',
      img: '',
      originalPrice: 0,
      discountPrice: 0,
      buyRate: 0,
      minSellRate: 0,
      defaultSellRate: 0,
      inStock: true
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      showNotif("Enter all required fields.", "error");
      return;
    }
    if (passwordForm.oldPassword !== currentUser.pass) {
      showNotif("Current password verification mismatch.", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotif("New Password and Confirmation do not match.", "error");
      return;
    }

    const updatedUser = { ...currentUser, pass: passwordForm.newPassword };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    showNotif("Seller account login credential updated successfully!", "success");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-64 bg-[#111322] text-slate-300 flex flex-col justify-between shadow-2xl h-full border-r border-slate-800 shrink-0 hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center font-black text-white text-base">S</div>
            <div>
              <span className="font-extrabold text-sm text-white block">SELLER CONSOLE</span>
              <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Multi-Vendor Partner</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Console Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'products', label: 'My Products Catalog', icon: <Box className="w-4 h-4" /> },
              { id: 'orders', label: 'Customer Order Claims', icon: <ShoppingBag className="w-4 h-4" /> },
              { id: 'profile', label: 'Shop Settings', icon: <User className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-500 hover:text-white font-bold flex items-center justify-center gap-2 transition-all text-xs border border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Panel</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER BAR */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0 font-sans shadow-2xs">
          <div className="flex items-center gap-2 md:gap-0">
            {/* Mobile Sidebar Toggle Hamburger (simplified) */}
            <div className="md:hidden flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 bg-pink-100 text-pink-600 py-1 px-2.5 rounded-lg mr-2">S</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                {currentUser.name}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                Seller ID Code: <span className="font-mono text-slate-600">{formatSellerId(currentUser, users)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-3xs select-none">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active
            </span>
            <button 
              onClick={onLogout}
              className="md:hidden bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-250 transition-all text-xs"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTENTS */}
        <div className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            
            {/* 1. SELLER DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                              {/* Clean, Modern Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-150 mb-2 shadow-2xs">
                  <div>
                    <span className="text-[9px] text-pink-600 font-extrabold uppercase tracking-widest bg-pink-50 border border-pink-100/60 px-2.5 py-1 rounded-full w-max block mb-1.5">
                      Seller Terminal
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                      Welcome back, {currentUser.name}! 👋
                    </h2>
                    <p className="text-slate-500 text-[11.5px] mt-1.5 font-semibold">
                      Manage your inventory catalog, monitor review approvals, and track order deliveries.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        resetProdForm();
                        setShowAddModal(true);
                      }}
                      className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto uppercase tracking-wider"
                    >
                      <Plus className="w-4.5 h-4.5 font-black" />
                      <span>Add New Product</span>
                    </button>
                  </div>
                </div>

                {/* E-Commerce Product Statistics */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-slate-800 text-xs tracking-wider border-l-2 border-pink-500 pl-2.5 uppercase">Catalog Overview</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "Total Products", value: stats.total, color: "text-slate-900", bg: "bg-white", desc: "Submitted in catalog", icon: <Box className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors" /> },
                      { title: "Approved Products", value: stats.approved, color: "text-emerald-600", bg: "bg-emerald-50/40 border border-emerald-100/70", desc: "Live on the store", icon: <CheckCircle className="w-5 h-5 text-emerald-500" /> },
                      { title: "Pending Reviews", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50/40 border border-amber-100/70", desc: "Awaiting Admin view", icon: <Clock className="w-5 h-5 text-amber-500" /> },
                      { title: "Rejected Submissions", value: stats.rejected, color: "text-rose-600", bg: "bg-rose-50/40 border border-rose-100/70", desc: "Re-submission required", icon: <AlertTriangle className="w-5 h-5 text-rose-500" /> }
                    ].map((srv, idx) => (
                      <div key={idx} className={`p-4 sm:p-5 rounded-3xl ${srv.bg} shadow-2xs space-y-2 relative group hover:scale-[1.01] transition-transform`}>
                        <div className="flex items-start justify-between">
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-450 uppercase block tracking-wider">{srv.title}</span>
                          {srv.icon}
                        </div>
                        <h4 className={`text-2xl font-black ${srv.color}`}>{srv.value}</h4>
                        <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-semibold">{srv.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales & Orders Analysis */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-slate-800 text-xs tracking-wider border-l-2 border-pink-500 pl-2.5 uppercase">Sales & Performance</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Revenue Card (Dark Elegant) */}
                    <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 to-indigo-950 p-4 sm:p-5 rounded-3xl text-white shadow-sm space-y-2 relative overflow-hidden group">
                      <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Cleared Revenue</span>
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">৳{orderStats.totalRevenue}</h4>
                      <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium">From successful deliveries</p>
                    </div>

                    {/* Pending Revenue Card */}
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-450 uppercase block tracking-wider">Pipeline Revenue</span>
                        <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-mono">৳{orderStats.pendingRevenue}</h4>
                      <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium font-sans">Active processing value</p>
                    </div>

                    {/* Completed Deliveries */}
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-450 uppercase block tracking-wider">Delivered</span>
                        <Check className="w-5 h-5 text-emerald-500 bg-emerald-50 rounded-full p-0.5" />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-sans">{orderStats.completedOrders}</h4>
                      <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium font-sans">Orders completed</p>
                    </div>

                    {/* Active Dispatch Pending */}
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-450 uppercase block tracking-wider">Active Queue</span>
                        <ShoppingBag className="w-5 h-5 text-pink-500 bg-pink-50 rounded-full p-0.5" />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-pink-650 font-sans">{orderStats.activeOrders}</h4>
                      <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium font-sans">{orderStats.pendingOrders} fully pending approval</p>
                    </div>
                  </div>
                </div>

                {/* Analytical Visuals and Action Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  
                  {/* Visual Status Pills distribution charts */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-none">Order status analysis</h4>
                      <p className="text-[10.5px] text-slate-400 mt-1 font-semibold">Visual delivery progress distribution map</p>
                    </div>

                    <div className="space-y-4 pt-2">
                      {[
                        { 
                          label: 'Completed Deliveries', 
                          count: orderStats.completedOrders, 
                          color: 'bg-emerald-500', 
                          pct: orderStats.totalOrders ? (orderStats.completedOrders / orderStats.totalOrders) * 100 : 0 
                        },
                        { 
                          label: 'Active Shipped / Packing', 
                          count: orderStats.activeOrders, 
                          color: 'bg-indigo-500', 
                          pct: orderStats.totalOrders ? (orderStats.activeOrders / orderStats.totalOrders) * 100 : 0 
                        },
                        { 
                          label: 'Pending Approvals', 
                          count: orderStats.pendingOrders, 
                          color: 'bg-amber-400', 
                          pct: orderStats.totalOrders ? (orderStats.pendingOrders / orderStats.totalOrders) * 100 : 0 
                        },
                        { 
                          label: 'Canceled / Returned', 
                          count: orderStats.cancelledOrders, 
                          color: 'bg-rose-500', 
                          pct: orderStats.totalOrders ? (orderStats.cancelledOrders / orderStats.totalOrders) * 100 : 0 
                        }
                      ].map((bar, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-[10.5px] font-bold">
                            <span className="text-slate-600">{bar.label}</span>
                            <span className="text-slate-900 font-extrabold font-sans">{bar.count} ({Math.round(bar.pct)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                              style={{ width: `${orderStats.totalOrders ? bar.pct : 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed pt-1 font-medium text-center">
                      Total sales records processed: <strong className="text-slate-700">{orderStats.totalOrders}</strong>. Filter and manage actual dispatches in the <strong className="text-pink-650">"Orders"</strong> section.
                    </p>
                  </div>

                  {/* Immediate Action Items Panel */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-none">Operational Alerts & Alerts</h4>
                      <p className="text-[10.5px] text-slate-400 mt-1 font-semibold">Self-updating inventory warnings and client order requirements</p>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {/* Alert 1: Pending Orders */}
                      {orderStats.pendingOrders > 0 ? (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5 flex items-start gap-3">
                          <Clock className="w-4.5 h-4.5 text-amber-550 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-[11px] text-amber-900 uppercase tracking-wide leading-none">High Priority: Pending approvals</p>
                            <p className="text-[10px] text-amber-700 font-semibold mt-1">You have {orderStats.pendingOrders} client order(s) waiting confirmation. Approve them to prevent dispatch delays.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-3.5 flex items-start gap-3">
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-[11px] text-emerald-900 uppercase tracking-wide leading-none">All caught up!</p>
                            <p className="text-[10px] text-emerald-700 font-semibold mt-1">Excellent! No client purchases are pending approval currently.</p>
                          </div>
                        </div>
                      )}

                      {/* Alert 2: Out of Stock Warnings */}
                      {sellerProducts.filter(p => !p.inStock).length > 0 ? (
                        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-3.5 flex items-start gap-3">
                          <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-[11px] text-rose-905 uppercase tracking-wide leading-none">Inventory warning: Out of Stock</p>
                            <p className="text-[10px] text-rose-700 font-semibold mt-1">
                              {sellerProducts.filter(p => !p.inStock).length} of your products are currently set as out of stock. Edit their status once replenished.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 flex items-start gap-3">
                          <Box className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wide leading-none">Inventory status healthy</p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-1">All catalog items are currently active and listed as in-stock.</p>
                          </div>
                        </div>
                      )}

                      {/* Alert 3: Pending review products */}
                      {stats.pending > 0 && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3">
                          <Layers className="w-4.5 h-4.5 text-blue-550 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-[11px] text-blue-900 uppercase tracking-wide leading-none">Pending Store Approval</p>
                            <p className="text-[10px] text-blue-700 font-semibold mt-1">
                              {stats.pending} catalog entries are currently in admin review check. They will auto-publish upon verification.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Pending action warnings card if any products rejected */}
                {stats.rejected > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-rose-950 leading-none mb-1">Product Submissions Need Attention</h5>
                      <p className="text-xs text-rose-700 leading-relaxed max-w-2xl font-medium">
                        You have {stats.rejected} product(s) that were dismissed by the administrative review check. Click on "My Products Catalog" to view admin feedback comments, make corrections, and resubmit them easily.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. PRODUCTS LIST & CREATE MODULE */}
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">Your E-commerce Catalog</h2>
                    <p className="text-[11.5px] text-slate-400 mt-1.5 font-semibold">Manage all your products submitted on this multi-vendor storefront.</p>
                  </div>
                  <button
                    onClick={() => {
                      resetProdForm();
                      setShowAddModal(true);
                    }}
                    className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5 w-max"
                  >
                    <Plus className="w-4 h-4 font-bold" />
                    <span>Add New Product</span>
                  </button>
                </div>

                {sellerProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white border rounded-3xl shadow-3xs">
                    <Box className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-extrabold">Your catalog is empty.</p>
                    <p className="text-slate-400 text-[11px] mt-1 max-w-xs mx-auto">Get started by creating your first product. It will go automatically into admin review approval queue.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {sellerProducts.map(p => {
                      const categoryName = categories.find(c => c.id === p.catId)?.name || 'Unknown Category';
                      return (
                        <div key={p.id} className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-150 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                          <div className="relative h-28 sm:h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                            {p.img ? (
                              <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Box className="w-10 h-10 text-slate-300" />
                            )}

                            {/* Status label badge overlays */}
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 select-none">
                              {p.approvalStatus === 'approved' && (
                                <span className="bg-emerald-500 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[9px] font-black tracking-wider sm:tracking-widest uppercase shadow-xs">
                                  Approved
                                </span>
                              )}
                              {p.approvalStatus === 'pending' && (
                                <span className="bg-amber-500 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[9px] font-black tracking-wider sm:tracking-widest uppercase shadow-xs">
                                  Pending
                                </span>
                              )}
                              {p.approvalStatus === 'rejected' && (
                                <span className="bg-rose-600 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[9px] font-black tracking-wider sm:tracking-widest uppercase shadow-xs">
                                  Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-3 sm:p-5 flex-1 space-y-3 sm:space-y-4">
                            <div className="space-y-1">
                              <span className="text-[8.5px] sm:text-[9.5px] bg-slate-100 text-slate-550 border border-slate-200/50 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                {categoryName}
                              </span>
                              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight pt-1 leading-snug line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                                {p.name}
                              </h3>
                            </div>

                            {/* Prices specifications */}
                            <div className="bg-slate-50 p-2 sm:p-3 rounded-2xl grid grid-cols-2 gap-1.5 sm:gap-2 text-[9.5px] sm:text-[10.5px] border border-slate-100 font-mono">
                              <div>
                                <span className="text-slate-450 block font-semibold font-sans text-[8.5px] sm:text-[10px]">MRP</span>
                                <span className="text-slate-900 font-extrabold">৳{p.discountPrice}</span>
                              </div>
                              <div>
                                <span className="text-slate-450 block font-semibold font-sans text-[8.5px] sm:text-[10px]">Buy Rate</span>
                                <span className="text-slate-900 font-extrabold">৳{p.buyRate}</span>
                              </div>
                            </div>

                            {/* Rejection comment banner */}
                            {p.approvalStatus === 'rejected' && p.description && (
                              <div className="bg-rose-50 border border-rose-100 p-2 rounded-xl text-[9px] sm:text-[10.5px] text-rose-700">
                                <span className="font-extrabold uppercase text-[8px] sm:text-[9px] block mb-0.5 text-rose-905">Rejection Reason:</span>
                                <p className="font-medium leading-relaxed italic">Something wrong in data details</p>
                              </div>
                            )}
                          </div>

                          {/* Product Card lower CTAs footer */}
                          <div className="bg-slate-50 px-3 sm:px-5 py-2.5 sm:py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2.5">
                            <div className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span className="text-[9px] sm:text-[10px] text-slate-450 font-bold uppercase tracking-wider">{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </div>

                            <div className="flex gap-1.5 self-stretch sm:self-auto justify-end">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="p-1 px-2 bg-white border border-slate-200 text-slate-650 rounded-lg hover:bg-slate-105 hover:text-slate-800 transition-colors cursor-pointer text-[9px] sm:text-xs font-extrabold flex items-center gap-0.5 sm:gap-1"
                                title="Edit Product"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1 px-1.5 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer text-[9px] sm:text-xs font-semibold flex items-center justify-center"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. VENDOR SALES ORDERS LOG */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none text-pink-600">Merchant Sales Dispatch Ledger</h2>
                    <p className="text-[11.5px] text-slate-400 mt-2 font-semibold">Track and manage order lifetimes where you supply the product on the system.</p>
                  </div>
                  <div className="bg-slate-100 px-3.5 py-1.5 rounded-2xl border text-xs font-bold text-slate-600 flex items-center gap-1.5 shadow-3xs">
                    Orders matches: <span className="text-pink-650 font-black">{sellerOrders.length}</span>
                  </div>
                </div>

                {/* Sub-Filters Tabs for localSellerOrderFilter */}
                <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2 rounded-2xl border">
                  {(['all', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'] as const).map(f => {
                    const count = f === 'all' 
                      ? sellerOrders.length
                      : sellerOrders.filter(o => o.status === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setLocalSellerOrderFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border-none cursor-pointer ${
                          localSellerOrderFilter === f 
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' 
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {f === 'all' ? 'All Sales' : f} ({count})
                      </button>
                    );
                  })}
                </div>

                {filteredSellerOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white border rounded-3xl shadow-3xs">
                    <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-550 text-sm font-extrabold">No matching active customer orders found.</p>
                    <p className="text-slate-400 text-[11px] mt-1">Once client orders transition to this phase, you can process their delivery tracking steps.</p>
                  </div>
                ) : (
                  <div className="bg-white border rounded-3xl shadow-sm overflow-hidden text-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                            <th className="p-4">Invoice / Link ID</th>
                            <th className="p-4">Customer Details</th>
                            <th className="p-4">Supplied Item</th>
                            <th className="p-4">Rate & qty</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredSellerOrders.map(o => (
                            <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-4 font-mono font-black text-slate-900">
                                {o.trackingId}
                                <span className="text-[9.5px] text-slate-400 font-semibold block mt-1">{o.date}</span>
                                <span className="inline-block bg-slate-100 text-[9px] text-slate-500 px-1 py-0.5 rounded font-bold uppercase mt-1">
                                  {o.type} Seller Order
                                </span>
                              </td>
                              <td className="p-4 space-y-0.5">
                                <p className="font-extrabold text-slate-850">{o.custName}</p>
                                <p className="text-slate-400 font-mono text-[10.5px]">{o.custPhone}</p>
                                <p className="text-slate-400 text-[10px] font-sans truncate max-w-xs">{o.custAddress}</p>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2.5">
                                  {o.prodImg && (
                                    <img src={o.prodImg} alt={o.productName} className="w-8 h-8 rounded-lg object-cover bg-slate-100 border shrink-0" referrerPolicy="no-referrer" />
                                  )}
                                  <span className="font-extrabold text-slate-800 line-clamp-1">{o.productName}</span>
                                </div>
                              </td>
                              <td className="p-4 font-mono font-bold">
                                ৳{o.sellRate} x {o.qty}
                                <span className="text-slate-900 font-black font-sans text-xs block mt-0.5">৳{o.sellRate * o.qty}</span>
                                <div className="mt-1.5 shrink-0">
                                  <TinyInvoiceDetails order={o} />
                                </div>
                              </td>
                              <td className="p-4 text-center select-none">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[9.5px] font-black uppercase tracking-widest ${
                                  o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  o.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                  o.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' :
                                  'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => setSelectedOrder(o)}
                                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl border-none cursor-pointer shadow-xs transition-all"
                                >
                                  Manage Delivery
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TRACKING MANAGEMENT MODAL */}
                <AnimatePresence>
                  {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative border text-xs sm:text-sm text-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close Button */}
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            setCourierName('');
                            setCourierTracking('');
                            setCancelReason('');
                          }}
                          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 border-none cursor-pointer transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="bg-slate-50 p-6 border-b border-slate-100">
                          <h3 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-pink-600 animate-bounce" />
                            Dispatch Administration Controls
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1 font-semibold font-sans">
                            Tracking Code: <span className="font-mono text-slate-700 font-extrabold">{selectedOrder.trackingId}</span> | Placed on {selectedOrder.date}
                          </p>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                          {/* Order Details & Customer Box */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border">
                              <h4 className="font-extrabold text-slate-900 mb-2 border-b pb-1 text-xs uppercase text-pink-600">Client Details</h4>
                              <p className="font-extrabold text-slate-850 mt-1">{selectedOrder.custName}</p>
                              <p className="text-slate-550 font-mono mt-0.5">{selectedOrder.custPhone}</p>
                              <p className="text-slate-450 mt-1 leading-relaxed text-[11px]">{selectedOrder.custAddress}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border">
                              <h4 className="font-extrabold text-slate-900 mb-2 border-b pb-1 text-xs uppercase text-pink-600">Commodity Info</h4>
                              <div className="flex items-center gap-2.5 mt-2">
                                {selectedOrder.prodImg && (
                                  <img src={selectedOrder.prodImg} alt={selectedOrder.productName} className="w-10 h-10 object-contain bg-white border rounded-lg p-1 shrink-0" referrerPolicy="no-referrer" />
                                )}
                                <div>
                                  <span className="font-extrabold text-slate-850 block">{selectedOrder.productName}</span>
                                  {selectedOrder.color && <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Color Option: {selectedOrder.color}</span>}
                                </div>
                              </div>
                              <p className="font-mono mt-2.5 text-[11px]">
                                Quantity: <span className="font-extrabold text-slate-800">{selectedOrder.qty} items</span>
                              </p>
                              <p className="font-mono text-slate-900 font-extrabold text-xs mt-1">
                                Total Paid: <span className="text-pink-650 font-black">৳{selectedOrder.sellRate * selectedOrder.qty}</span>
                              </p>
                            </div>
                          </div>

                          {/* Current Status Tracking Diagram */}
                          <div className="space-y-3">
                            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Fulfillment Logs Timeline</h4>
                            
                            <div className="relative border-l-2 border-slate-100 pl-5 ml-2.5 space-y-4 font-sans">
                              {(selectedOrder.timeline || []).map((node, idx) => (
                                <div key={idx} className="relative">
                                  {/* Dot */}
                                  <div className={`absolute -left-[27px] top-0.5 w-3 h-3 rounded-full border-2 ${
                                    node.isCompleted 
                                      ? 'bg-emerald-500 border-white ring-2 ring-emerald-500/20' 
                                      : 'bg-slate-200 border-white ring-2 ring-slate-100'
                                  }`} />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-black text-[10px] uppercase tracking-wider ${node.isCompleted ? 'text-slate-850' : 'text-slate-400'}`}>
                                        {node.status}
                                      </span>
                                      {node.date && <span className="text-[10px] text-slate-400 font-semibold">{node.date}</span>}
                                    </div>
                                    <p className="text-[11.5px] mt-1 text-slate-500 font-semibold">{node.description || 'Stage initialized.'}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Step-by-Step State Transition actions */}
                          {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                            <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-4">
                              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide text-pink-600 flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-pink-500" /> Action Required: Propagate Next State
                              </h4>

                              <div className="flex flex-wrap gap-2.5 pt-1">
                                {selectedOrder.status === 'Pending' && (
                                  <button
                                    onClick={() => updateSellerOrderStatus(selectedOrder.id, 'Approved')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl border-none cursor-pointer transition-all shadow-xs text-[11px]"
                                  >
                                    Confirm & Approve Order
                                  </button>
                                )}

                                {selectedOrder.status === 'Approved' && (
                                  <button
                                    onClick={() => updateSellerOrderStatus(selectedOrder.id, 'Processing')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl border-none cursor-pointer transition-all shadow-xs text-[11px]"
                                  >
                                    Move to Packaging (Processing)
                                  </button>
                                )}

                                {selectedOrder.status === 'Processing' && (
                                  <div className="w-full space-y-3 bg-white p-3.5 rounded-xl border">
                                    <p className="text-[11px] font-extrabold text-slate-500 uppercase">Input Courier Consignment Handover Details</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <input
                                        type="text"
                                        placeholder="Courier Name (e.g., RedX, Pathao)"
                                        value={courierName}
                                        onChange={(e) => setCourierName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Courier Tracking Reference Code"
                                        value={courierTracking}
                                        onChange={(e) => setCourierTracking(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                                      />
                                    </div>
                                    <button
                                      onClick={() => {
                                        if(!courierName || !courierTracking) {
                                          showNotif("Please enter courier company name and tracking reference first.", "error");
                                          return;
                                        }
                                        updateSellerOrderStatus(selectedOrder.id, 'Shipped');
                                      }}
                                      className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2 rounded-xl border-none cursor-pointer transition-all shadow-xs text-[11px]"
                                    >
                                      Submit & Mark as Shipped
                                    </button>
                                  </div>
                                )}

                                {selectedOrder.status === 'Shipped' && (
                                  <button
                                    onClick={() => {
                                      if (confirm("Confirm that this item has reached terminal customer address? Profit commission will release to user balance.")) {
                                        updateSellerOrderStatus(selectedOrder.id, 'Delivered');
                                      }
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl border-none cursor-pointer transition-all shadow-xs text-[11px]"
                                  >
                                    Confirm Handover & Deliver Order
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Cancellation overlay options */}
                          {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3 font-sans">
                              <h4 className="font-extrabold text-rose-700 text-xs uppercase tracking-wide">Decline / Cancel Order</h4>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder="Provide cancel details (e.g. out of stock, courier reject)..."
                                  value={cancelReason}
                                  onChange={(e) => setCancelReason(e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-rose-400 outline-none"
                                />
                                <button
                                  onClick={() => {
                                    if(!cancelReason) {
                                      showNotif("Please specify a reason for cancellation first.", "error");
                                      return;
                                    }
                                    updateSellerOrderStatus(selectedOrder.id, 'Cancelled');
                                  }}
                                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-xl border-none cursor-pointer transition-all shadow-xs text-[11px]"
                                >
                                  Cancel Order
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 p-4 border-t border-slate-100 text-right flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedOrder(null);
                              setCourierName('');
                              setCourierTracking('');
                              setCancelReason('');
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold px-4 py-2 rounded-xl border-none cursor-pointer transition-all text-[11px]"
                          >
                            Close Controls
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* 4. SHOP PROFILE & ACCOUNT VIEW */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Left: General Info display */}
                <div className="bg-white p-6 border rounded-3xl shadow-2xs space-y-4 md:col-span-1 text-xs sm:text-sm">
                  <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs mb-3 text-pink-600">Merchant Meta</h3>
                  
                  <div className="space-y-4 font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Shop Brand Title</span>
                      <p className="text-sm font-extrabold text-slate-900">{currentUser.name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Contact Number</span>
                      <p className="font-mono text-slate-900">{currentUser.phone || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Reseller Email Code</span>
                      <p className="text-slate-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Shop Bio details</span>
                      <p className="text-slate-500 font-medium leading-relaxed pt-1 select-none">{shopBioDesc || "Authentic quality merchant and dynamic sub-partner platform."}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Forms for update */}
                <div className="md:col-span-2 space-y-6">
                  {/* Shop Details Edit */}
                  <div className="bg-white p-6 border rounded-3xl shadow-2xs space-y-4">
                    <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs text-pink-600">Update Shop information</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const updatedUser = { ...currentUser, kyc: { ...currentUser.kyc, nidName: shopBioDesc } };
                      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
                      setCurrentUser(updatedUser);
                      showNotif("Merchant profile status updated successfully!", "success");
                    }} className="space-y-4 text-xs text-slate-700">
                      <div className="form-group">
                        <label className="form-label font-bold text-slate-650 block mb-1">Shop Bio / Slogan</label>
                        <textarea 
                          className="w-full border rounded-xl p-3 focus:outline-pink-500 text-xs min-h-[80px]"
                          placeholder="Introduce your shop products and delivery services standard..."
                          value={shopBioDesc}
                          onChange={(e) => setShopBioDesc(e.target.value)}
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all"
                      >
                        Save Shop Config
                      </button>
                    </form>
                  </div>

                  {/* Password Update */}
                  <div className="bg-white p-6 border rounded-3xl shadow-2xs space-y-4">
                    <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs text-pink-600">Modify login secret key</h3>
                    <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs text-slate-700 text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="form-group pb-1">
                          <label className="form-label font-bold text-slate-650 block mb-1">Current Password</label>
                          <div className="relative">
                            <input 
                              type={showOldPass ? "text" : "password"} 
                              className="w-full border rounded-xl pl-3 pr-10 py-3 focus:outline-pink-500 text-xs"
                              placeholder="Current secret code"
                              required
                              value={passwordForm.oldPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPass(!showOldPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-450 hover:text-slate-600 flex items-center bg-transparent border-none cursor-pointer"
                            >
                              {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div className="form-group pb-1">
                          <label className="form-label font-bold text-slate-650 block mb-1">New Password</label>
                          <div className="relative">
                            <input 
                              type={showNewPass ? "text" : "password"} 
                              className="w-full border rounded-xl pl-3 pr-10 py-3 focus:outline-pink-500 text-xs"
                              placeholder="New secret key"
                              required
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-450 hover:text-slate-600 flex items-center bg-transparent border-none cursor-pointer"
                            >
                              {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div className="form-group pb-1">
                          <label className="form-label font-bold text-slate-650 block mb-1">Confirm New Password</label>
                          <div className="relative">
                            <input 
                              type={showConfirmPass ? "text" : "password"} 
                              className="w-full border rounded-xl pl-3 pr-10 py-3 focus:outline-pink-500 text-xs"
                              placeholder="Repeat new secret key"
                              required
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPass(!showConfirmPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-450 hover:text-slate-600 flex items-center bg-transparent border-none cursor-pointer"
                            >
                              {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all uppercase tracking-wider text-[10.5px]"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* 5. MODAL: ADD PRODUCT FORM */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-3xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-none">Register New Catalog Item</h3>
                  <p className="text-[10.5px] text-slate-450 mt-1 font-bold">Added items are reviewed by the administration before displaying publicly.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group space-y-1">
                    <label className="font-extrabold text-slate-700 block">Product Item Name</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-xl p-3 focus:outline-pink-500 font-bold"
                      placeholder="e.g. Galaxy Watch Active 5 Pro"
                      required
                      value={prodForm.name}
                      onChange={(e) => setProdForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group space-y-1">
                    <label className="font-extrabold text-slate-700 block">Sub Category Group</label>
                    <select 
                      className="w-full border rounded-xl p-3 focus:outline-pink-500 font-bold"
                      value={prodForm.catId}
                      onChange={(e) => setProdForm(prev => ({ ...prev, catId: e.target.value }))}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group space-y-1">
                  <label className="font-extrabold text-slate-700 block">Pricing Details Description</label>
                  <textarea 
                    className="w-full border rounded-xl p-3 focus:outline-pink-500 min-h-[70px]"
                    placeholder="Enter outstanding traits, sizing details, battery power configuration..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Original Price (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.originalPrice || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Selling Discount Price (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.discountPrice || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, discountPrice: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Buy Rate (Dealer) (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.buyRate || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, buyRate: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Suggested Sell Rate (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.defaultSellRate || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, defaultSellRate: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">Product Photo Image (Upload)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:border-pink-300 transition-colors cursor-pointer relative bg-slate-50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => handleImageUpload(e, false)}
                      />
                      <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500 block font-bold">Click to upload photo image</span>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  {prodForm.img && (
                    <div className="relative w-max mx-auto sm:mx-0 shrink-0">
                      <img src={prodForm.img} alt="Preview" className="w-[84px] h-[84px] object-cover rounded-xl border" />
                      <button 
                        type="button"
                        onClick={() => setProdForm(prev => ({ ...prev, img: '' }))}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-250 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-extrabold cursor-pointer transition-all"
                  >
                    Submit Product for Approval
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODAL: EDIT PRODUCT FORM */}
      <AnimatePresence>
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-3xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-none">Modify Product Details</h3>
                  <p className="text-[10.5px] text-slate-450 mt-1 font-bold">Editing this product will re-submit it for administration verification review.</p>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditProductSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group space-y-1">
                    <label className="font-extrabold text-slate-700 block">Product Item Name</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-xl p-3 focus:outline-pink-500 font-bold"
                      required
                      value={prodForm.name}
                      onChange={(e) => setProdForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group space-y-1">
                    <label className="font-extrabold text-slate-700 block">Sub Category Group</label>
                    <select 
                      className="w-full border rounded-xl p-3 focus:outline-pink-500 font-bold"
                      value={prodForm.catId}
                      onChange={(e) => setProdForm(prev => ({ ...prev, catId: e.target.value }))}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group space-y-1">
                  <label className="font-extrabold text-slate-700 block">Pricing Details Description</label>
                  <textarea 
                    className="w-full border rounded-xl p-3 focus:outline-pink-500 min-h-[70px]"
                    value={prodForm.description}
                    onChange={(e) => setProdForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Original Price (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.originalPrice || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Selling Discount Price (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.discountPrice || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, discountPrice: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Buy Rate (Dealer) (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.buyRate || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, buyRate: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-650 block">Suggested Sell Rate (৳)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-xl p-2.5 focus:outline-pink-500 font-mono font-bold"
                      required
                      value={prodForm.defaultSellRate || ''}
                      onChange={(e) => setProdForm(prev => ({ ...prev, defaultSellRate: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700 block">Product Photo Image (Upload)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-2 text-center hover:border-pink-300 transition-colors cursor-pointer relative bg-slate-50">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => handleImageUpload(e, true)}
                      />
                      <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <span className="text-[9px] text-slate-500 block">Replace product photo</span>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  {prodForm.img && (
                    <div className="relative w-max shrink-0 sm:mx-0">
                      <img src={prodForm.img} alt="Preview" className="w-[74px] h-[74px] object-cover rounded-xl border" />
                    </div>
                  )}

                  {/* Stock Availability Toggle */}
                  <div className="flex items-center gap-2 pt-4">
                    <input 
                      type="checkbox" 
                      id="editProdInStock" 
                      className="w-4 h-4 text-pink-550 border-slate-350 focus:ring-pink-500"
                      checked={prodForm.inStock} 
                      onChange={(e) => setProdForm(prev => ({ ...prev, inStock: e.target.checked }))} 
                    />
                    <label htmlFor="editProdInStock" className="font-extrabold text-slate-750 text-xs cursor-pointer">Product is in Stock</label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-250 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-extrabold cursor-pointer transition-all"
                  >
                    Save Changes & Re-submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR AS REQUESTED */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-pink-500 border-t border-pink-400/40 text-white flex justify-around items-center py-2 px-1 md:hidden shadow-[0_-5px_15px_rgba(219,39,119,0.15)] select-none">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4.5 h-4.5" /> },
          { id: 'products', label: 'Products', icon: <Box className="w-4.5 h-4.5" /> },
          { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4.5 h-4.5" /> },
          { id: 'profile', label: 'Settings', icon: <User className="w-4.5 h-4.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all cursor-pointer ${activeTab === tab.id ? 'bg-white/20 font-extrabold text-white scale-[1.05] shadow-sm' : 'opacity-85 hover:opacity-100'}`}
          >
            {tab.icon}
            <span className="text-[9.5px] font-black mt-1 uppercase tracking-tight">{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
