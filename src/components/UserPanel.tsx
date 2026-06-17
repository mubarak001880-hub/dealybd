import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Package, Wallet, User as UserIcon, LogOut, ArrowRight, Truck, Info, CheckCircle, Clock, ChevronRight,
  Smartphone, CreditCard, ShieldAlert, ArrowUpRight, ArrowDownRight, Upload, X, ShieldCheck, Search, Tag, DollarSign, Camera,
  Copy, Users, Share2, Check
} from 'lucide-react';
import { User, Product, Category, Order, Withdrawal, DeliveryCharge, FooterConfig, Banner } from '../types';
import { formatResellerId } from '../idUtils';
import { getDhakaDate, formatToDhakaTime, formatToDhakaDateOnly } from '../dateUtils';
import OrderTracker from './OrderTracker';
import { TinyInvoiceDetails } from './TinyInvoiceDetails';
import { generateTrackingId, createInitialTimeline } from '../data';

interface UserPanelProps {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  products: Product[];
  categories: Category[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  withdrawals: Withdrawal[];
  setWithdrawals: React.Dispatch<React.SetStateAction<Withdrawal[]>>;
  deliveryCharges: DeliveryCharge[];
  footerConfig: FooterConfig;
  resellerBanners?: Banner[];
  onLogout: () => void;
  showNotif: (msg: string, type: 'success' | 'error') => void;
}

// Helper to calculate countdown for subscription
function getSubscriptionCountdown(expiresAt?: string): string {
  if (!expiresAt) {
    return "No active subscription";
  }
  const expiryDate = getDhakaDate(expiresAt);
  const now = getDhakaDate(new Date());
  
  const expiryStartOfDay = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
  const nowStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (expiryStartOfDay.getTime() < nowStartOfDay.getTime()) {
    return "Expired";
  }

  if (expiryStartOfDay.getTime() === nowStartOfDay.getTime()) {
    return "Expires today";
  }

  let yearDiff = expiryStartOfDay.getFullYear() - nowStartOfDay.getFullYear();
  let monthDiff = expiryStartOfDay.getMonth() - nowStartOfDay.getMonth();
  let dayDiff = expiryStartOfDay.getDate() - nowStartOfDay.getDate();

  if (dayDiff < 0) {
    const prevMonth = new Date(expiryStartOfDay.getFullYear(), expiryStartOfDay.getMonth(), 0);
    dayDiff += prevMonth.getDate();
    monthDiff--;
  }

  if (monthDiff < 0) {
    monthDiff += 12;
    yearDiff--;
  }

  const totalMonths = yearDiff * 12 + monthDiff;

  const parts: string[] = [];
  if (totalMonths > 0) {
    parts.push(`${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`);
  }
  if (dayDiff > 0) {
    parts.push(`${dayDiff} ${dayDiff === 1 ? 'day' : 'days'}`);
  }

  if (parts.length === 0) {
    return "Expires today";
  }
  return parts.join(' ');
}

export default function UserPanel({
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  products,
  categories,
  orders,
  setOrders,
  withdrawals,
  setWithdrawals,
  deliveryCharges,
  footerConfig,
  resellerBanners = [],
  onLogout,
  showNotif
}: UserPanelProps) {
  const [activeTab, setActiveTab] = useState<'shop' | 'orders' | 'wallet' | 'profile' | 'support' | 'referral'>('shop');
  const [customRates, setCustomRates] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderDetails, setOrderDetails] = useState({ custName: '', custPhone: '', custAddress: '' });
  const [selectedColor, setSelectedColor] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'COD' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('COD');
  const [checkoutTxId, setCheckoutTxId] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Pending' | 'Approved' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'>('all');

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showWdModal, setShowWdModal] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [trackingIdToView, setTrackingIdToView] = useState('');
  const [resellerDistrictId, setResellerDistrictId] = useState<string>('');
  const [currentResellerBannerIdx, setCurrentResellerBannerIdx] = useState(0);

  const [resellerBannerTouchStart, setResellerBannerTouchStart] = useState<number | null>(null);
  const [resellerBannerTouchEnd, setResellerBannerTouchEnd] = useState<number | null>(null);
  const [resellerBannerMouseDownX, setResellerBannerMouseDownX] = useState<number | null>(null);
  const [isResellerBannerDragging, setIsResellerBannerDragging] = useState(false);

  const handleResellerTouchStart = (e: React.TouchEvent) => {
    setResellerBannerTouchStart(e.targetTouches[0].clientX);
    setResellerBannerTouchEnd(e.targetTouches[0].clientX);
  };

  const handleResellerTouchMove = (e: React.TouchEvent) => {
    setResellerBannerTouchEnd(e.targetTouches[0].clientX);
  };

  const handleResellerTouchEnd = () => {
    if (resellerBannerTouchStart === null || resellerBannerTouchEnd === null) return;
    const distance = resellerBannerTouchStart - resellerBannerTouchEnd;
    const thresh = 40;
    if (distance > thresh) {
      setCurrentResellerBannerIdx(prev => (prev + 1) % resellerBanners.length);
    } else if (distance < -thresh) {
      setCurrentResellerBannerIdx(prev => (prev - 1 + resellerBanners.length) % resellerBanners.length);
    }
    setResellerBannerTouchStart(null);
    setResellerBannerTouchEnd(null);
  };

  const handleResellerMouseDown = (e: React.MouseEvent) => {
    setResellerBannerMouseDownX(e.clientX);
    setIsResellerBannerDragging(true);
  };

  const handleResellerMouseUp = (e: React.MouseEvent) => {
    if (!isResellerBannerDragging || resellerBannerMouseDownX === null) return;
    const distance = resellerBannerMouseDownX - e.clientX;
    const thresh = 40;
    if (distance > thresh) {
      setCurrentResellerBannerIdx(prev => (prev + 1) % resellerBanners.length);
    } else if (distance < -thresh) {
      setCurrentResellerBannerIdx(prev => (prev - 1 + resellerBanners.length) % resellerBanners.length);
    }
    setResellerBannerMouseDownX(null);
    setIsResellerBannerDragging(false);
  };

  const handleResellerMouseLeave = () => {
    setResellerBannerMouseDownX(null);
    setIsResellerBannerDragging(false);
  };

  useEffect(() => {
    if (resellerBanners.length > 1) {
      const timer = setInterval(() => {
        setCurrentResellerBannerIdx(prev => (prev + 1) % resellerBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [resellerBanners.length]);

  useEffect(() => {
    if (deliveryCharges && deliveryCharges.length > 0 && !resellerDistrictId) {
      setResellerDistrictId(deliveryCharges[0].id);
    }
  }, [deliveryCharges, resellerDistrictId]);

  // Form states
  const [kycForm, setKycForm] = useState({ nidName: '', nidNumber: '', dob: '', frontImage: '', backImage: '' });
  const [wdForm, setWdForm] = useState({ method: 'bKash', account: '', amount: '' });

  // Sync session client side
  useEffect(() => {
    const updated = users.find(u => u.id === currentUser.id);
    if (updated) {
      setCurrentUser(updated);
    }
  }, [users]);

  // Image upload helpers
  const handleKycImgUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'frontImage' | 'backImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKycForm(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycForm.nidName || !kycForm.nidNumber || !kycForm.dob || !kycForm.frontImage || !kycForm.backImage) {
      showNotif("Complete all verified identity information blocks.", "error");
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      kyc: {
        status: 'pending',
        nidName: kycForm.nidName,
        nidNumber: kycForm.nidNumber,
        dob: kycForm.dob,
        frontImage: kycForm.frontImage,
        backImage: kycForm.backImage,
        submittedAt: Date.now()
      }
    };

    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setShowKycModal(false);
    showNotif("Identity KYC uploaded. Pending security review.", "success");
  };

  // Place Order handler with proper dynamic metrics
  const triggerOrderPanel = (prod: Product) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.colors?.[0] || '');
    setOrderQty(1);
    setOrderDetails({ custName: '', custPhone: '', custAddress: '' });
    setShowOrderModal(true);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!orderDetails.custName.trim() || !orderDetails.custPhone.trim() || !orderDetails.custAddress.trim()) {
      showNotif("Provide full client delivery endpoints.", "error");
      return;
    }

    const userRate = customRates[selectedProduct.id] ?? selectedProduct.defaultSellRate;
    if (userRate < selectedProduct.minSellRate) {
      showNotif(`Markup rate is lower than the required minimum (৳${selectedProduct.minSellRate}).`, "error");
      return;
    }

    const unitProfit = userRate - selectedProduct.buyRate;
    const totalProfitInstance = unitProfit * orderQty;
    
    // Advance Payment Requirements Calculation
    const totalAdvanceRequired = selectedProduct.requireAdvance ? (selectedProduct.advanceAmount || 0) * orderQty : 0;
    if (totalAdvanceRequired > 0) {
      if (checkoutPaymentMethod === 'COD') {
        showNotif(`Advance payment of ৳${totalAdvanceRequired} is required for this product. Please select the payment method.`, "error");
        return;
      }
      if (!checkoutTxId.trim()) {
        showNotif("Transaction ID (TxID) is required for verification.", "error");
        return;
      }
    }

    const orderDateStr = formatToDhakaTime();
    const trackingId = generateTrackingId();

    const matchedDistrict = deliveryCharges.find(dc => dc.id === resellerDistrictId);
    const deliveryCostAmount = matchedDistrict ? matchedDistrict.charge : 0;
    const districtCombinedAddress = orderDetails.custAddress.trim() + (matchedDistrict ? ` [District: ${matchedDistrict.district}, Delivery: ৳${matchedDistrict.charge}]` : '');

    const newOrder: Order = {
      id: 'o_' + Date.now(),
      trackingId,
      type: 'reseller',
      userId: currentUser.id,
      productName: `${selectedProduct.name} (x${orderQty})`,
      prodImg: selectedProduct.img,
      qty: orderQty,
      color: selectedColor,
      sellRate: userRate * orderQty,
      buyRate: selectedProduct.buyRate,
      profit: totalProfitInstance,
      amount: (userRate * orderQty) + deliveryCostAmount,
      custName: orderDetails.custName.trim(),
      custPhone: orderDetails.custPhone.trim(),
      custAddress: districtCombinedAddress,
      status: 'Pending',
      date: orderDateStr,
      timeline: createInitialTimeline(orderDateStr),
      advancePaid: totalAdvanceRequired > 0 ? totalAdvanceRequired : 0,
      txId: totalAdvanceRequired > 0 ? checkoutTxId.trim() : '',
      paymentMethod: totalAdvanceRequired > 0 ? checkoutPaymentMethod : 'COD',
      productId: selectedProduct.id,
      sellerId: selectedProduct.sellerId,
      sellerName: selectedProduct.sellerName
    };

    setOrders(prev => [newOrder, ...prev]);
    setCheckoutPaymentMethod('COD');
    setCheckoutTxId('');
    setShowOrderModal(false);
    showNotif(`Order ${newOrder.trackingId} created! Profit ৳${totalProfitInstance} pending Delivery confirmation.`, "success");
  };

  const submitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(wdForm.amount) || 0;
    if (amt < 100) {
      showNotif("Minimum payout request limit is ৳100.", "error");
      return;
    }
    if (amt > currentUser.balance) {
      showNotif("Insufficient cleared earnings available inside wallet.", "error");
      return;
    }
    if (!wdForm.account.trim()) {
      showNotif("Payout credential key has been omitted.", "error");
      return;
    }

    // Deduct standard reseller balance internally
    const updatedUser: User = {
      ...currentUser,
      balance: currentUser.balance - amt,
      activities: [
        {
          id: 'act_' + Date.now(),
          date: formatToDhakaTime(),
          type: 'withdraw',
          desc: `Withdrawal transfer via ${wdForm.method} requested`,
          amount: amt
        },
        ...(currentUser.activities || [])
      ]
    };

    // Append standard withdrawals log
    const newWd: Withdrawal = {
      id: 'wd_' + Date.now(),
      userId: currentUser.id,
      amount: amt,
      method: wdForm.method,
      account: wdForm.account.trim(),
      status: 'pending',
      date: formatToDhakaDateOnly()
    };

    setWithdrawals(prev => [...prev, newWd]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setShowWdModal(false);
    setWdForm({ method: 'bKash', account: '', amount: '' });
    showNotif(`৳${amt} payout request sent. Approval takes 24 hours.`, "success");
  };

  // Tracking launcher
  const launchTracker = (tId: string) => {
    setTrackingIdToView(tId);
    setShowTrackerModal(true);
  };

  // Analytics Metrics
  const myOrders = orders
    .filter(o => o.userId === currentUser.id)
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

  const filteredMyOrders = orderFilter === 'all'
    ? myOrders
    : myOrders.filter(o => o.status === orderFilter);

  const clearedCommissions = (currentUser.activities || [])
    .filter(a => a.type === 'profit')
    .reduce((s, a) => s + a.amount, 0);

  const pendingCommissions = myOrders
    .filter(o => o.status !== 'Delivered')
    .reduce((s, o) => s + o.profit, 0);

  const myWithdrawals = withdrawals.filter(w => w.userId === currentUser.id);

  // Shop item search filtering
  const searchNormalized = searchQuery.toLowerCase().trim();
  const filteredProducts = products.filter(p => {
    const isCatMatched = !selectedCat || p.catId === selectedCat;
    const isSearchMatched = !searchNormalized || 
      p.name.toLowerCase().includes(searchNormalized) || 
      p.description.toLowerCase().includes(searchNormalized);
    return p.inStock && isCatMatched && isSearchMatched;
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50/80 font-sans text-slate-800">
      
      {/* GLOBAL HUD BAR */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow glows */}
        <div className="absolute -left-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-pink-650 rounded-xl flex items-center justify-center font-black animate-pulse shrink-0 shadow-md">
              DL
            </div>
            <span className="font-extrabold text-xs sm:text-base md:text-lg lg:text-xl tracking-tight uppercase truncate text-white">
              DEALY <span className="text-pink-100 font-bold">PARTNER HUB</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="bg-white/15 border border-white/20 rounded-2xl px-3 sm:px-4 py-1 sm:py-1.5 flex items-center gap-2 shadow-inner">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/50 block animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-mono font-black text-white">৳{currentUser.balance} WALLET</span>
            </div>
            <button 
              onClick={onLogout} 
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all hover:scale-105 cursor-pointer flex items-center gap-1 text-[10px] sm:text-xs font-extrabold"
              title="Logout Partner Dashboard"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD WORKSPACE */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 overflow-y-auto pb-24 md:pb-8 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR NAVIGATION MODULE */}
        <aside className="hidden md:block w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-1">
            <div className="p-3 border-b border-slate-100 mb-2">
              <h4 className="font-extrabold text-sm text-slate-900 leading-none">{currentUser.name}</h4>
              <p className="text-[10px] text-pink-600 font-bold mt-1 tracking-wider uppercase">{formatResellerId(currentUser, users)}</p>
            </div>

            <button 
              onClick={() => setActiveTab('shop')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${activeTab === 'shop' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ShoppingBag className="w-4 h-4" /> Product Catalog
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${activeTab === 'orders' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Package className="w-4 h-4" /> My Orders & Tracking
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${activeTab === 'wallet' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Wallet className="w-4 h-4" /> My Wallet
            </button>
            <button 
              onClick={() => setActiveTab('referral')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${activeTab === 'referral' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Users className="w-4 h-4" /> Refer & Team Network
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${activeTab === 'profile' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <UserIcon className="w-4 h-4" /> Account Verification
            </button>
            <button 
              onClick={() => setActiveTab('support')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3.5 cursor-pointer ${activeTab === 'support' ? 'bg-pink-500 text-white shadow-md shadow-pink-500/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Info className="w-4 h-4" /> Support & Contact Links
            </button>
          </div>

          {/* Side Category Selector (User Friendly Side Alignment) */}
          {activeTab === 'shop' && (
            <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-2 animate-fade-in">
              <h5 className="text-[10px] uppercase font-black tracking-wider text-slate-400">Products Category</h5>
              <div className="space-y-1 flex flex-col">
                <button 
                  onClick={() => setSelectedCat(null)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${!selectedCat ? 'bg-pink-50 text-pink-600 font-bold border-l-2 border-pink-500 pl-2' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>All Collections</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
                {categories.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${selectedCat === c.id ? 'bg-pink-50 text-pink-600 font-bold border-l-2 border-pink-500 pl-2' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span className="truncate pr-2">{c.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* WORKSPACE MIDDLE PANELS */}
        <div className="flex-1 min-w-0">
          
          <AnimatePresence mode="wait">
            
            {/* 1. CUSTOM CATALOG VIEW LIMIT */}
            {activeTab === 'shop' && (
              <motion.div 
                key="shop" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Reseller-only Interactive Promo Banner Slider */}
                {resellerBanners && resellerBanners.length > 0 && (
                  <div 
                    onTouchStart={handleResellerTouchStart}
                    onTouchMove={handleResellerTouchMove}
                    onTouchEnd={handleResellerTouchEnd}
                    onMouseDown={handleResellerMouseDown}
                    onMouseUp={handleResellerMouseUp}
                    onMouseLeave={handleResellerMouseLeave}
                    className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-2xs aspect-[12/5] sm:aspect-auto sm:h-[220px] md:h-[320px] lg:h-[365px] bg-slate-55 select-none cursor-grab active:cursor-grabbing"
                  >
                    <div 
                      className="h-full flex w-full transition-transform duration-500 ease-in-out pointer-events-none"
                      style={{ 
                        transform: `translateX(-${(currentResellerBannerIdx % resellerBanners.length) * 100}%)`
                      }}
                    >
                      {resellerBanners.map(ban => (
                        <div key={ban.id} className="h-full w-full flex-shrink-0 relative overflow-hidden pointer-events-auto">
                          {ban.link ? (
                            <a 
                              href={ban.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block h-full w-full cursor-pointer hover:opacity-95 transition-opacity"
                              title="Campaign link"
                            >
                              <img 
                                src={ban.img} 
                                alt="Reseller Announcement Banner" 
                                className="w-full h-full object-cover select-none pointer-events-none" 
                                onDragStart={(e) => e.preventDefault()}
                              />
                            </a>
                          ) : (
                            <img 
                              src={ban.img} 
                              alt="Reseller Announcement Banner" 
                              className="w-full h-full object-cover select-none pointer-events-none" 
                              onDragStart={(e) => e.preventDefault()}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Tiny dots indicator overlay */}
                    {resellerBanners.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-15 bg-black/30 px-2 py-1 rounded-full backdrop-blur-3xs">
                        {resellerBanners.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentResellerBannerIdx(idx);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${idx === currentResellerBannerIdx ? 'bg-pink-500 w-3' : 'bg-white/60 hover:bg-white/95'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Collections Carousel Filter */}
                <div className="md:hidden space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">Products Category</span>
                  <div className="scroll-x-container pb-2 px-0.5">
                    <button 
                      onClick={() => setSelectedCat(null)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${!selectedCat ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      All Collections
                    </button>
                    {categories.map(c => (
                      <button 
                        key={c.id}
                        onClick={() => setSelectedCat(c.id)}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${selectedCat === c.id ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Filter bar */}
                <div className="bg-white p-4 border rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:max-w-md">
                    <input 
                      type="text" 
                      placeholder="Quick model / brand search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input pl-10 text-xs py-2 w-full"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  
                  {/* Category Status Indicator */}
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Showing: <span className="text-pink-600 font-black">{selectedCat ? categories.find(c => c.id === selectedCat)?.name : 'All Collections'}</span>
                  </div>
                </div>

                {/* Reselling Product Grid items list - compact, beautiful high-density layout */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                  {filteredProducts.map(p => {
                    const priceInput = customRates[p.id] ?? p.defaultSellRate;
                    const maxProfit = p.defaultSellRate - p.buyRate;
                    
                    return (
                      <div 
                        key={p.id}
                        onClick={() => triggerOrderPanel(p)}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-3 relative overflow-hidden group hover:shadow-md hover:border-pink-300 transition-all cursor-pointer"
                      >
                        {/* Header Image box */}
                        <div className="h-28 sm:h-36 bg-slate-50/80 rounded-xl overflow-hidden flex items-center justify-center p-3 relative bg-gradient-to-b from-slate-50/50 to-slate-100/50">
                          <img src={p.img} alt={p.name} className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-2 right-2 bg-pink-50 border border-pink-100 text-[10px] font-black rounded-lg px-2 py-0.5 text-pink-600 shadow-xs">
                            ৳{p.buyRate} Buy
                          </span>
                        </div>

                        {/* Title metadata */}
                        <div className="mt-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-tight h-8 sm:h-10">
                              {p.name}
                            </h4>
                            
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                                <span>Suggest: ৳{p.defaultSellRate}</span>
                              </div>
                              
                              <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg px-2 py-1 flex items-center justify-between">
                                <span>Profit Margin:</span>
                                <span>+৳{maxProfit}</span>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerOrderPanel(p);
                            }}
                            className="w-full mt-3 bg-pink-600 hover:bg-pink-700 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 duration-200 cursor-pointer"
                          >
                            <span>Sell Product</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 2. ADVANCED TRACKABLE HISTORY VIEW */}
            {activeTab === 'orders' && (
              <motion.div 
                key="orders" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">E-commerce Delivery Records</h3>
                  <span className="text-xs bg-white py-1 px-2.5 rounded-full border text-slate-500 font-bold">
                    {myOrders.length} active orders
                  </span>
                </div>

                {/* Sub-Filters Tabs for orderFilter */}
                {myOrders.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 bg-slate-100/60 p-2 rounded-2xl border border-slate-200 animate-fade-in">
                    {(['all', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'] as const).map(f => {
                      const count = f === 'all' 
                        ? myOrders.length
                        : myOrders.filter(o => o.status === f).length;
                      return (
                        <button
                          key={f}
                          onClick={() => setOrderFilter(f)}
                          className={`px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border leading-none cursor-pointer ${
                            orderFilter === f 
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-xs' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {f === 'all' ? 'All Orders' : f === 'Pending' ? 'Pending' : f === 'Approved' ? 'Approved' : f === 'Processing' ? 'Processing' : f === 'Shipped' ? 'Shipped' : f === 'Delivered' ? 'Delivered' : f === 'Cancelled' ? 'Cancelled' : 'Returned'} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {myOrders.length === 0 ? (
                  <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-500">No placed orders yet</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Place customer orders from the product catalog.</p>
                  </div>
                ) : filteredMyOrders.length === 0 ? (
                  <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-500">No matching orders found</h4>
                    <p className="text-xs text-slate-400 mt-0.5">No orders with status "{orderFilter}" were found.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredMyOrders.map(ord => {
                      const finalStatusColor = {
                        Pending: 'bg-amber-100 text-amber-700 border-amber-200',
                        Approved: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                        Processing: 'bg-pink-100 text-pink-700 border-pink-200',
                        Shipped: 'bg-sky-100 text-sky-700 border-sky-200',
                        Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                        Cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
                        Returned: 'bg-purple-100 text-purple-700 border-purple-200'
                      }[ord.status] || 'bg-slate-100';

                      return (
                        <div key={ord.id} className="bg-white border hover:border-pink-200 rounded-xl shadow-xs p-3 flex flex-col gap-2.5 transition-all text-xs">
                          {/* Row 1 metadata */}
                          <div className="flex flex-wrap justify-between items-center gap-1.5 pb-2 border-b border-slate-100">
                            <div>
                              <p className="text-[8.5px] text-slate-400 font-black tracking-wider uppercase leading-none">ORDER TRACKING ID</p>
                              <h5 className="font-extrabold text-[11.5px] text-indigo-950 flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono">{ord.trackingId}</span>
                                <span className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-black border leading-none ${finalStatusColor}`}>
                                  {ord.status}
                                </span>
                              </h5>
                            </div>
                            <div className="text-right">
                              <p className="text-[8.5px] text-slate-400 font-black tracking-wider uppercase leading-none">YOUR COMMISSIONS</p>
                              <span className={`text-[11.5px] font-black block mt-0.5 ${ord.status === 'Delivered' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                {ord.status === 'Delivered' ? `+৳${ord.profit} CLEARED` : `৳${ord.profit} PENDING`}
                              </span>
                            </div>
                          </div>

                          {/* Row 2 shipment logistics */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100/50 text-[10.5px] text-slate-600">
                            <div>
                              <p className="text-[8px] text-slate-450 font-black uppercase tracking-wider">PRODUCT DETAILS</p>
                              <p className="font-bold text-slate-800 truncate mt-0.5">{ord.productName}</p>
                              {ord.color && <p className="text-[9.5px] text-slate-400">Variant: {ord.color}</p>}
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-450 font-black uppercase tracking-wider">RECIPIENT CONTACT</p>
                              <p className="font-bold text-slate-800 truncate mt-0.5">{ord.custName}</p>
                              <p className="text-[9.5px] text-slate-400 font-mono">{ord.custPhone}</p>
                              {ord.advancePaid && ord.advancePaid > 0 ? (
                                <span className="inline-block mt-0.5 bg-emerald-50 border border-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-black text-[8px] uppercase tracking-wider leading-none">
                                  ADV ৳{ord.advancePaid}
                                </span>
                              ) : null}
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-450 font-black uppercase tracking-wider">DELIVERY DESTINATION</p>
                              <p className="font-medium text-slate-500 mt-0.5 line-clamp-1 truncate" title={ord.custAddress}>
                                {ord.custAddress}
                              </p>
                            </div>
                            <div className="md:border-l md:pl-2.5 border-slate-200">
                              <TinyInvoiceDetails order={ord} />
                            </div>
                          </div>

                          {/* Row 3 Real-time actions - TRACK ORDER STATUS */}
                          <div className="flex justify-between items-center gap-2 pt-0.5">
                            <span className="text-[9.5px] text-slate-400 font-bold font-mono">Date: {ord.date}</span>
                            <button 
                              onClick={() => launchTracker(ord.trackingId)}
                              className="bg-indigo-50 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100 font-extrabold px-2.5 py-1.2 rounded-lg text-[9.5px] flex items-center gap-1 transition-colors shadow-2xs cursor-pointer uppercase tracking-wider"
                            >
                              <Truck className="w-3 h-3 text-indigo-500" /> Track Status
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. RESELLER WALLET HUB */}
            {activeTab === 'wallet' && (
              <motion.div 
                key="wallet" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Visual Cleared Wallet Balance card */}
                <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-pink-400/30">
                  <div className="absolute right-0 bottom-0 translate-x-12 translate-y-6 opacity-15">
                    <Wallet className="w-44 h-44 font-black" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-baseline md:items-center gap-4">
                    <div>
                      <p className="text-[10px] tracking-widest font-black uppercase text-pink-100 !text-pink-100">CLEARED WITHDRAWABLE EARNINGS</p>
                      <h2 className="text-3xl md:text-5xl font-black mt-1 tracking-tight text-white !text-white drop-shadow-sm">৳{currentUser.balance}</h2>
                      <p className="text-xs text-pink-100 mt-1.5 flex items-center gap-1 opacity-90">
                        <Info className="w-3.5 h-3.5" /> Payout processed immediately to nominated standard gateways.
                      </p>
                    </div>

                    <button 
                      onClick={() => setShowWdModal(true)}
                      className="bg-white text-pink-600 px-6 py-3.5 rounded-2xl text-xs font-black hover:bg-pink-50 transition-all shadow-lg hover:scale-[1.02] active:scale-95 duration-200 flex items-center gap-1.5 cursor-pointer border border-white"
                    >
                      Request Payout Transfer
                    </button>
                  </div>
                </div>

                {/* Sub totals stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 border rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">CLEARED METRIC</p>
                      <h3 className="font-extrabold text-lg text-slate-800">৳{clearedCommissions}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-4 border rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 font-bold animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">PENDING SHIPMENTS</p>
                      <h3 className="font-extrabold text-lg text-slate-800">৳{pendingCommissions}</h3>
                    </div>
                  </div>
                </div>

                {/* historical payout records */}
                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b">
                    <h4 className="font-extrabold text-sm text-slate-900">Historical Withdrawal Log</h4>
                  </div>

                  {myWithdrawals.length === 0 ? (
                    <p className="text-slate-400 py-12 text-center text-xs font-bold">No historical payout payouts requested yet.</p>
                  ) : (
                    <div className="divide-y text-xs">
                      {myWithdrawals.reverse().map(wd => (
                        <div key={wd.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-extrabold text-slate-800">৳{wd.amount} Transfer requested</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{wd.method} • {wd.account} • {wd.date}</p>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${wd.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : wd.status === 'rejected' ? 'bg-red-100 text-red-700 font-bold' : 'bg-amber-100 text-amber-700'}`}>
                            {wd.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 4. IDENTITY PROFILE & KYC PORTAL */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Summary Info - Hot Pink Premium Branded Board */}
                <div className="relative overflow-hidden bg-[#e6005c] rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 justify-between items-start md:items-center text-white min-h-[240px] font-sans">
                  {/* Visual ambient glassmorphism shine highlights */}
                  <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-pink-400/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Left Column: Business & Person metadata block */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 w-full lg:w-auto">
                    {/* Circle shop/profile logo container with black background matching image */}
                    <div className="relative shrink-0 select-none">
                      <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden bg-[#090912] flex items-center justify-center p-3 border-2 border-white/20 shadow-md relative group hover:border-white/40 transition-colors">
                        {currentUser.avatarUrl ? (
                          <img 
                            src={currentUser.avatarUrl} 
                            alt={currentUser.name} 
                            className="w-full h-full object-cover rounded-full pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-[17px] sm:text-[19px] font-black text-pink-500 tracking-tighter">AGC</span>
                            <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 leading-none">AUTHENTIC</span>
                          </div>
                        )}
                      </div>

                      {/* Photo upload trigger - exact camera/edit pen badge overlay */}
                      <label className="absolute -top-1 -right-1 flex items-center justify-center bg-pink-500 hover:bg-pink-600 border border-white/30 w-7 h-7 rounded-full cursor-pointer text-white shadow-md active:scale-90 transition-all">
                        <Camera className="w-3.5 h-3.5" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                showNotif("Image size must be less than 2MB.", "error");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                const base64 = reader.result as string;
                                const updatedUser = {
                                  ...currentUser,
                                  avatarUrl: base64
                                };
                                setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
                                setCurrentUser(updatedUser);
                                showNotif("Reseller profile photo updated successfully!", "success");
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Reseller Info Metadata List */}
                    <div className="flex-1 text-center sm:text-left space-y-2 mt-1">
                      {/* Shop/Agency brand header name */}
                      <h3 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight drop-shadow-xs">
                        {currentUser.name === "Reseller Demo User" ? "Authentic Gadgets Care" : currentUser.name}
                      </h3>

                      <div className="space-y-1 text-white/95 text-xs sm:text-[13px] font-semibold tracking-wide">
                        {/* ID Code with Copy option */}
                        <div className="flex items-center justify-center sm:justify-start gap-1">
                          <span>ID: {formatResellerId(currentUser, users)}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(formatResellerId(currentUser, users));
                              showNotif("ID Code copied successfully!", "success");
                            }}
                            className="p-1 hover:bg-white/15 rounded-md text-white/80 hover:text-white cursor-pointer active:scale-95 transition-all"
                            title="Copy ID Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* User real name display */}
                        <p>Name: {currentUser.kyc.nidName || "Md Mobarok Khondokar HRidoy"}</p>

                        {/* Customer contact phone */}
                        <p>Phone: {currentUser.phone || "01307559032"}</p>

                        {/* Dynamic Kyc status label */}
                        <p>
                          Status: <span className="font-extrabold text-[#74f884] uppercase drop-shadow-xs">
                            {currentUser.kyc.status === 'verified' ? 'VERIFIED' : currentUser.kyc.status.toUpperCase()}
                          </span>
                        </p>

                        {/* Modern Share button matching image */}
                      <div className="pt-2 flex justify-center sm:justify-start">
                        <button
                          onClick={async () => {
                            const refLink = `${window.location.origin}/?ref=${formatResellerId(currentUser, users)}`;
                            
                            // Copy to clipboard
                            try {
                              await navigator.clipboard.writeText(refLink);
                              showNotif("Profile referral link copied! You can now share it with others.", "success");
                            } catch (err) {
                              console.error("Clipboard copy failed", err);
                            }

                            // Use Web Share API if supported to allow sharing
                            if (navigator.share) {
                              try {
                                await navigator.share({
                                  title: 'Join Dealy Affiliate / Reseller Program',
                                  text: `Check out Dealy's amazing earning Reseller Program! Register using my ref link.`,
                                  url: refLink,
                                });
                              } catch (err) {
                                console.log("User cancelled share or share failed", err);
                              }
                            }
                          }}
                          className="inline-flex items-center gap-1.5 bg-white text-slate-800 px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-100 active:scale-95 transition-all select-none cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5 text-pink-600" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Subscription countdown (no grid stats) */}
                  <div className="w-full lg:w-auto flex flex-col items-center lg:items-end justify-center">
                    {/* Subscription countdown line at extreme bottom right of banner */}
                    <div className="text-center lg:text-right w-full pr-1">
                      <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Subscription ends on:</p>
                      <p className="text-sm sm:text-base text-white font-extrabold mt-1">
                        {getSubscriptionCountdown(currentUser.subscriptionExpiresAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

                {/* Identity Verification Portal */}
                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b px-5 py-3.5 flex justify-between items-center">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest">National Identity Verification (KYC)</h4>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${currentUser.kyc.status === 'verified' ? 'bg-green-100 text-green-700' : currentUser.kyc.status === 'pending' ? 'bg-amber-100 text-amber-700' : currentUser.kyc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100'}`}>
                      {currentUser.kyc.status}
                    </span>
                  </div>

                  <div className="p-5 md:p-6">
                    {currentUser.kyc.status === 'unverified' && (
                      <div className="space-y-4 text-center py-6">
                        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
                        <div className="max-w-md mx-auto space-y-1">
                          <h4 className="font-extrabold text-slate-800 text-sm">Security Verification Pending</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            To protect financial transfers, escrow payouts require identity compliance. Upload NID info to unlock withdrawals.
                          </p>
                        </div>
                        <button 
                          onClick={() => { setKycForm({ nidName: '', nidNumber: '', dob: '', frontImage: '', backImage: '' }); setShowKycModal(true); }}
                          className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow"
                        >
                          Establish KYC Compliance
                        </button>
                      </div>
                    )}

                    {currentUser.kyc.status === 'pending' && (
                      <div className="text-center py-8 space-y-3">
                        <Clock className="w-12 h-12 text-amber-500 animate-pulse mx-auto" />
                        <h4 className="font-extrabold text-slate-800 text-sm">Reviewing Verification Data</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                          We are validating NID match records against local government registries. This check completes inside 12-24 verification hours.
                        </p>
                      </div>
                    )}

                    {currentUser.kyc.status === 'verified' && (
                      <div className="border border-green-100 bg-green-50/50 rounded-2xl p-4 flex gap-4 items-start text-xs text-green-800">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="space-y-1 pr-4">
                          <p className="font-extrabold">Compliance Identity Established</p>
                          <p className="text-green-600">NID Holder: {currentUser.kyc.nidName}</p>
                          <p className="text-green-600/90 font-mono mt-1">Registrar: {currentUser.kyc.nidNumber}</p>
                        </div>
                      </div>
                    )}

                    {currentUser.kyc.status === 'rejected' && (
                      <div className="space-y-4">
                        <div className="border border-red-100 bg-red-50 text-red-700 rounded-2xl p-4 text-xs">
                          <p className="font-extrabold">Verification KYC Rejected</p>
                          <p className="text-red-600/90 mt-1 leading-relaxed">Reason: {currentUser.kyc.rejectReason}</p>
                        </div>
                        <button 
                          onClick={() => { setKycForm({ nidName: '', nidNumber: '', dob: '', frontImage: '', backImage: '' }); setShowKycModal(true); }}
                          className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow hover:bg-red-700"
                        >
                          Resubmit Identity Files
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Reseller Activity Log */}
                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b">
                    <h4 className="font-extrabold text-sm text-slate-900 text-xs uppercase tracking-wider">Account Operations History</h4>
                  </div>
                  <div className="divide-y text-xs">
                    {(currentUser.activities || []).length === 0 ? (
                      <p className="text-slate-400 py-8 text-center">No operation history recorded.</p>
                    ) : (
                      (currentUser.activities || []).map(act => (
                        <div key={act.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{act.desc}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{act.date}</p>
                          </div>
                          <span className={`font-black ${act.type === 'profit' ? 'text-green-600' : 'text-red-600'}`}>
                            {act.type === 'profit' ? '+' : '-'}৳{act.amount}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* 4.5 DEDICATED REFERRAL NETWORK PAGE */}
            {activeTab === 'referral' && (
              <motion.div 
                key="referral" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 animate-fade-in font-sans"
              >
                <div id="reseller-referral-system" className="bg-white border rounded-2xl shadow-sm overflow-hidden space-y-5 p-5 md:p-6 text-slate-800">
                  <div className="border-b pb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100 shrink-0">
                      <Users className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight uppercase">Referral & Team Network (রেফারেল ও টিম নেটওয়ার্ক)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">আপনার রেফারেল লিংক ব্যবহার করে অন্য রিসেলারদের যুক্ত করুন ও আজীবন ওয়ান-ক্লিক কমিশন ইনকাম করুন।</p>
                    </div>
                  </div>

                  {/* Highlights Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100/30 border border-pink-100 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider">Total Active Teammates</span>
                        <h4 className="text-xl font-black text-slate-800 font-mono mt-1">
                          {(users || []).filter(u => u.referredBy === currentUser.idCode).length} Teammates
                        </h4>
                      </div>
                      <div className="bg-pink-100 text-pink-650 w-9 h-9 rounded-lg flex items-center justify-center font-black shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Lifetime Team Earnings</span>
                        <h4 className="text-xl font-black text-slate-850 font-mono mt-1">
                          ৳{(currentUser.activities || [])
                            .filter(act => act.type === 'profit' && act.desc.toLowerCase().includes('referral'))
                            .reduce((sum, act) => sum + act.amount, 0)}
                        </h4>
                      </div>
                      <div className="bg-emerald-100 text-emerald-750 w-9 h-9 rounded-lg flex items-center justify-center font-black shrink-0">
                        <DollarSign className="w-4 h-4 text-emerald-650 shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Referral Links Operations box  */}
                  <div className="space-y-4 bg-slate-50 border rounded-xl p-4 text-slate-800 text-xs font-semibold">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">My Referral RES Code</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={formatResellerId(currentUser, users)} 
                          className="font-mono font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-0 text-slate-900 shadow-sm"
                        />
                        <button 
                          id="btn-copy-ref-code"
                          onClick={() => {
                            navigator.clipboard.writeText(formatResellerId(currentUser, users));
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                            showNotif("Referral Code Copied!", "success");
                          }}
                          className="bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-slate-700 active:scale-95 transition-all text-center shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Shareable Registration Link</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={`${window.location.origin}/?ref=${formatResellerId(currentUser, users)}`} 
                          className="font-mono text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-0 text-slate-500 truncate shadow-sm"
                        />
                        <button 
                          id="btn-copy-ref-link"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/?ref=${formatResellerId(currentUser, users)}`);
                            setCopiedLink(true);
                            setTimeout(() => setCopiedLink(false), 2000);
                            showNotif("Referral Link Copied!", "success");
                          }}
                          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-lg text-xs active:scale-95 transition-all text-center shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-pink-500/10"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Teammates List */}
                  <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-50 border-b px-4 py-2.5 flex justify-between items-center">
                      <span className="font-extrabold text-[10px] uppercase text-slate-400 tracking-wider">Approved Reseller Team Members</span>
                      <span className="bg-pink-50 text-pink-650 px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider font-mono">
                        {(users || []).filter(u => u.referredBy === currentUser.idCode).length} Join(s)
                      </span>
                    </div>

                    <div className="divide-y max-h-60 overflow-y-auto bg-white">
                      {(users || []).filter(u => u.referredBy === currentUser.idCode).length === 0 ? (
                        <div className="py-10 px-4 text-center space-y-1.5">
                          <Users className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="text-slate-500 font-bold">কোনো মেম্বার জয়েন করেনি</p>
                          <p className="text-[10px] text-slate-400 font-medium">আজই আপনার রেজিস্টার লিংক শেয়ার করে একটি টিম তৈরি করুন!</p>
                        </div>
                      ) : (
                        (users || []).filter(u => u.referredBy === currentUser.idCode).map((teamUsr) => (
                          <div key={teamUsr.id} className="p-3 bg-white hover:bg-slate-50/50 flex items-center justify-between font-sans transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center font-bold text-pink-600 text-xs shrink-0 border border-pink-100">
                                {teamUsr.name.substring(0, 1).toUpperCase()}
                              </div>
                              <div className="min-w-0 leading-tight">
                                <span className="block font-black text-slate-850 truncate text-[11px]">{teamUsr.name}</span>
                                <span className="text-[9.5px] text-slate-450 font-mono italic mt-0.5 block">{teamUsr.phone || 'N/A Phone'}</span>
                              </div>
                            </div>
                            <span className="font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border font-black text-[9.5px] shrink-0">
                              {formatResellerId(teamUsr, users)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. SUPPORT & HELP CHANNELS */}
            {activeTab === 'support' && (
              <motion.div 
                key="support" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-pink-500 to-indigo-600 p-6 rounded-[24px] text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <Info className="w-36 h-36" />
                  </div>
                  <div className="relative z-10 max-w-lg space-y-1.5">
                    <h2 className="text-lg md:text-xl font-black">Reseller Support Channels Desk</h2>
                    <p className="text-xs text-white/85 leading-relaxed font-semibold">
                      Need immediate help with products, order delivery, cash updates, or withdrawals? Connect with our dedicated official administrative helpdesks directly below! Admin changes apply here in real-time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(!footerConfig.customLinks || footerConfig.customLinks.length === 0) ? (
                    <div className="col-span-full text-center py-12 bg-white border rounded-2xl">
                      <p className="text-slate-400 font-bold text-xs">No active helper links registered by our support team currently.</p>
                    </div>
                  ) : (
                    footerConfig.customLinks.map((link, idx) => {
                      const nameLower = link.name.toLowerCase();
                      let iconBg = "bg-pink-50 text-pink-600";
                      let bgTheme = "hover:border-pink-300";
                      
                      if (nameLower.includes('whatsapp')) {
                        iconBg = "bg-emerald-50 text-emerald-600";
                        bgTheme = "hover:border-emerald-300";
                      } else if (nameLower.includes('telegram')) {
                        iconBg = "bg-sky-50 text-sky-600";
                        bgTheme = "hover:border-sky-300";
                      } else if (nameLower.includes('instagram')) {
                        iconBg = "bg-rose-50 text-rose-600";
                        bgTheme = "hover:border-rose-300";
                      } else if (nameLower.includes('facebook')) {
                        iconBg = "bg-indigo-50 text-indigo-600";
                        bgTheme = "hover:border-indigo-300";
                      } else if (nameLower.includes('youtube')) {
                        iconBg = "bg-red-50 text-red-600";
                        bgTheme = "hover:border-red-300";
                      }

                      return (
                        <a 
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`bg-white border text-left p-4 rounded-2xl flex items-center gap-3.5 transition-all active:scale-[0.98] ${bgTheme} shadow-xs hover:shadow-xs cursor-pointer group`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${iconBg} group-hover:scale-105 shadow-sm`}>
                            {link.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1 leading-tight">
                            <span className="block font-black text-[12px] text-slate-800 tracking-tight group-hover:text-pink-600 transition-colors truncate">{link.name}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Click to Join Support Channel →</span>
                          </div>
                        </a>
                      );
                    })
                  )}
                </div>

                <div className="bg-white p-5 border rounded-2xl shadow-sm text-xs font-semibold text-slate-600 space-y-3.5">
                  <h4 className="font-extrabold text-slate-900 text-xs tracking-wide uppercase border-b pb-2">Direct Contact Channels</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 font-extrabold">
                        @
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase">SUPPORT EMAIL</span>
                        <a href={`mailto:${footerConfig.contactEmail}`} className="text-slate-800 text-xs font-bold hover:underline mt-0.5 block">{footerConfig.contactEmail}</a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 font-extrabold">
                        #
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold leading-none uppercase">DIRECT HELPLINE</span>
                        <a href={`tel:${footerConfig.contactPhone}`} className="text-slate-800 text-xs font-bold hover:underline mt-0.5 block">{footerConfig.contactPhone}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* FOOTER MOBILE NAVIGATION RIG */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex justify-around items-center h-16 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-1.5">
        <button 
          onClick={() => setActiveTab('shop')} 
          className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'shop' ? 'text-pink-500 font-extrabold' : 'text-slate-400'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider">Catalog</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`flex flex-col items-center justify-center flex-1 py-1 relative ${activeTab === 'orders' ? 'text-pink-500 font-extrabold' : 'text-slate-400'}`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider">Orders</span>
        </button>
        <button 
          onClick={() => setActiveTab('wallet')} 
          className={`flex flex-col items-center justify-center flex-1 py-1 relative ${activeTab === 'wallet' ? 'text-pink-500 font-extrabold' : 'text-slate-400'}`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider">Wallet</span>
        </button>
        <button 
          onClick={() => setActiveTab('referral')} 
          className={`flex flex-col items-center justify-center flex-1 py-1 relative ${activeTab === 'referral' ? 'text-pink-500 font-extrabold' : 'text-slate-400'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider">Refer</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'profile' ? 'text-pink-500 font-extrabold' : 'text-slate-400'}`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider">NID</span>
        </button>
        <button 
          onClick={() => setActiveTab('support')} 
          className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'support' ? 'text-pink-500 font-extrabold' : 'text-slate-400'}`}
        >
          <Info className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider">Help</span>
        </button>
      </div>


      {/* === WORKSPACE LAYER MODALS === */}

      {/* 1. Place Order client shipping credentials */}
      <AnimatePresence>
        {showOrderModal && selectedProduct && (() => {
          const priceInput = customRates[selectedProduct.id] ?? selectedProduct.defaultSellRate;
          const isBelowMin = priceInput < selectedProduct.minSellRate;
          const estimatedUnitProfit = priceInput - selectedProduct.buyRate;
          const estimatedTotalProfit = estimatedUnitProfit * orderQty;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowOrderModal(false)}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="flex gap-4 pb-4 border-b border-slate-100 items-start">
                  <img src={selectedProduct.img} className="w-14 h-14 object-contain rounded bg-slate-50 border p-1" />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm truncate">{selectedProduct.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">Wholesale rate: ৳{selectedProduct.buyRate}</p>
                  </div>
                  <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600 ml-auto p-1 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={submitOrder} className="space-y-4 mt-4">
                  
                  {/* 1. Customize Selling Price & Live Earnings calculator */}
                  <div className="bg-pink-50/40 border border-pink-100/60 rounded-2xl p-4 space-y-3 shadow-xs">
                    <h5 className="font-black text-[10px] text-pink-600 uppercase tracking-widest flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-pink-500" /> Adjust Pricing Strategy
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-bold">
                      <div className="bg-white p-2 border border-slate-100 rounded-xl">
                        <span className="block text-slate-400">Min Sell Price:</span>
                        <span className="text-slate-800 text-xs font-black">৳{selectedProduct.minSellRate}</span>
                      </div>
                      <div className="bg-white p-2 border border-slate-100 rounded-xl">
                        <span className="block text-slate-400">Suggest Price:</span>
                        <span className="text-slate-800 text-xs font-black">৳{selectedProduct.defaultSellRate}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Your Customer Retail Price (৳)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-400 font-extrabold">৳</span>
                        <input 
                          type="number" 
                          className={`form-input pl-6 text-xs font-black py-2 w-full ${isBelowMin ? 'border-red-300 bg-red-50/50 focus:border-red-500 text-red-600' : 'border-slate-200 focus:border-pink-500'}`}
                          value={priceInput}
                          onChange={(e) => setCustomRates({ ...customRates, [selectedProduct.id]: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      {isBelowMin && (
                        <p className="text-[9px] text-red-500 font-bold mt-1">⚠️ Selling price is lower than the mandatory minimum limit!</p>
                      )}
                    </div>

                    {/* Calculated Live Earnings Box */}
                    <div className={`p-2.5 rounded-xl flex items-center justify-between text-xs ${isBelowMin ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}>
                      <span className="font-bold flex items-center gap-1">
                        {isBelowMin ? <ShieldAlert className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                        {isBelowMin ? 'Pricing Error' : 'Your Net Profit'}
                      </span>
                      <span className="font-black">
                        {isBelowMin ? 'Blocked' : `+৳${estimatedTotalProfit}`}
                      </span>
                    </div>
                  </div>

                  {/* Variant Color selection */}
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Select Color</label>
                      <select 
                        className="form-input text-xs"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                      >
                        {selectedProduct.colors.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Qty Box */}
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 w-fit overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                        className="px-3.5 py-1.5 hover:bg-slate-100 font-extrabold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{orderQty}</span>
                      <button 
                        type="button"
                        onClick={() => setOrderQty(orderQty + 1)}
                        className="px-3.5 py-1.5 hover:bg-slate-100 font-extrabold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4 my-2"></div>
                  <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest mb-3">Customer Details</h5>

                  <div className="form-group">
                    <label className="form-label">Customer Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter customer name"
                      className="form-input text-xs py-2.5" 
                      required 
                      value={orderDetails.custName}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, custName: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Customer Mobile Number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      placeholder="Enter phone number"
                      className="form-input text-xs py-2.5" 
                      required 
                      value={orderDetails.custPhone}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, custPhone: e.target.value }))}
                    />
                  </div>

                  {/* Client Shipping District */}
                  <div className="form-group">
                    <label className="form-label">Client Shipping District / Region <span className="text-red-500">*</span></label>
                    <select 
                      value={resellerDistrictId}
                      onChange={(e) => setResellerDistrictId(e.target.value)}
                      className="form-input text-xs py-2.5 font-bold bg-white"
                      required
                    >
                      <option value="">-- Choose Customer's District --</option>
                      {deliveryCharges.map(dc => (
                        <option key={dc.id} value={dc.id}>{dc.district} (৳{dc.charge})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Address <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={2} 
                      placeholder="Enter full address"
                      className="form-input text-xs py-2" 
                      required 
                      value={orderDetails.custAddress}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, custAddress: e.target.value }))}
                    />
                  </div>

                  {/* Advance Payment Details Section for Resellers */}
                  {(() => {
                    const totalAdvanceRequired = selectedProduct.requireAdvance ? (selectedProduct.advanceAmount || 0) * orderQty : 0;
                    if (totalAdvanceRequired <= 0) return null;

                    return (
                      <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/50 space-y-3.5 text-xs text-slate-800">
                        <h4 className="font-extrabold text-[10px] text-amber-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-amber-200/30 pb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Client Advance Required
                        </h4>
                        
                        <div className="bg-amber-100/40 p-2.5 rounded-xl text-amber-900 font-bold leading-relaxed text-[11px]">
                          এই পণ্যটির জন্য গ্রাহকের থেকে অগ্রিম পেমেন্ট ৳<b>{totalAdvanceRequired}</b> আবশ্যক। যেকোনো মাধ্যমে গ্রাহক থেকে অগ্রিম সংগ্রহ করে ট্রানজেকশন আইডি প্রদান করুন।
                        </div>

                        {/* Account detail columns */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-505 bg-white p-2.5 rounded-xl border border-amber-100 font-medium">
                          <div className="flex flex-col border-r border-slate-100 pr-1 pb-1">
                            <span className="font-bold text-pink-650">bKash (Send Money)</span>
                            <span className="font-mono text-slate-800">017XXXXXXXX</span>
                          </div>
                          <div className="flex flex-col pl-2 pb-1">
                            <span className="font-bold text-orange-650">Nagad (Send Money)</span>
                            <span className="font-mono text-slate-800">017XXXXXXXX</span>
                          </div>
                          <div className="flex flex-col border-r border-slate-100 pt-1 border-t">
                            <span className="font-bold text-indigo-650">Rocket (Send Money)</span>
                            <span className="font-mono text-slate-800">017XXXXXXXX-*</span>
                          </div>
                          <div className="flex flex-col pl-2 pt-1 border-t">
                            <span className="font-bold text-teal-650">Bank Transfer</span>
                            <span className="font-mono text-slate-800 truncate">DBBL (AC: XXXX)</span>
                          </div>
                        </div>

                        {/* Selection tab pills */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Payment Channel</label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map(method => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setCheckoutPaymentMethod(method)}
                                className={`py-1.5 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider border cursor-pointer ${
                                  checkoutPaymentMethod === method 
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' 
                                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>

                        {checkoutPaymentMethod !== 'COD' && (
                          <div className="space-y-1.5 pt-0.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sender's Transaction ID (TxID)</label>
                            <input 
                              type="text"
                              className="form-input text-xs uppercase font-mono tracking-widest placeholder-slate-300"
                              placeholder="e.g. 5K98JKD7WS"
                              value={checkoutTxId}
                              onChange={(e) => setCheckoutTxId(e.target.value.toUpperCase())}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {(() => {
                    const rRate = customRates[selectedProduct.id] ?? selectedProduct.defaultSellRate;
                    const matchedDistrict = deliveryCharges.find(dc => dc.id === resellerDistrictId);
                    const deliveryCostAmount = matchedDistrict ? matchedDistrict.charge : 0;
                    const finalTotalSum = (rRate * orderQty) + deliveryCostAmount;

                    return (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60 flex justify-between items-center text-xs font-bold text-slate-700 leading-normal">
                        <span className="text-slate-500">Retail Total + Shipping:</span>
                        <span className="text-indigo-600 font-extrabold font-mono text-right">
                          ৳{rRate * orderQty} + ৳{deliveryCostAmount} Delivery = ৳{finalTotalSum}
                        </span>
                      </div>
                    );
                  })()}

                  <button 
                    type="submit"
                    disabled={isBelowMin}
                    className="w-full bg-pink-600 disabled:bg-slate-100 disabled:text-slate-300 disabled:border-slate-100 hover:bg-pink-700 text-white font-extrabold py-3 rounded-xl uppercase text-xs tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Confirm Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 2. KYC Submission form overlay */}
      <AnimatePresence>
        {showKycModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowKycModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-extrabold text-base flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Identity KYC Portal
                </h3>
                <button onClick={() => setShowKycModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitKyc} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">NID Legal Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    className="form-input text-xs" 
                    placeholder="Enter exact full name per NID"
                    required
                    value={kycForm.nidName}
                    onChange={(e) => setKycForm({ ...kycForm, nidName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">NID Registry Number <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      className="form-input text-xs font-mono" 
                      placeholder="NID card clearance id"
                      required
                      value={kycForm.nidNumber}
                      onChange={(e) => setKycForm({ ...kycForm, nidNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth <span className="text-rose-500">*</span></label>
                    <input 
                      type="date" 
                      className="form-input text-xs" 
                      required
                      value={kycForm.dob}
                      onChange={(e) => setKycForm({ ...kycForm, dob: e.target.value })}
                    />
                  </div>
                </div>

                {/* Uploaders mock blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">NID Front Image <span className="text-rose-500">*</span></label>
                    <div className="border border-dashed border-slate-200/80 rounded-xl p-3 bg-slate-50 text-center relative hover:border-slate-300">
                      {kycForm.frontImage ? (
                        <div className="relative">
                          <img src={kycForm.frontImage} className="max-h-24 mx-auto rounded object-cover" />
                          <button onClick={() => setKycForm({ ...kycForm, frontImage: '' })} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                            <X className="w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block py-4 text-[10px] text-slate-400 font-extrabold">
                          <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                          <span>UPLOAD FRONT</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleKycImgUpload(e, 'frontImage')} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">NID Back Image <span className="text-rose-500">*</span></label>
                    <div className="border border-dashed border-slate-200/80 rounded-xl p-3 bg-slate-50 text-center relative hover:border-slate-300">
                      {kycForm.backImage ? (
                        <div className="relative">
                          <img src={kycForm.backImage} className="max-h-24 mx-auto rounded object-cover" />
                          <button onClick={() => setKycForm({ ...kycForm, backImage: '' })} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                            <X className="w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block py-4 text-[10px] text-slate-400 font-extrabold">
                          <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                          <span>UPLOAD BACK</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleKycImgUpload(e, 'backImage')} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl uppercase text-xs tracking-wider shadow mt-2"
                >
                  Verify Compliance
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Reseller Withdrawal Request Cash box */}
      <AnimatePresence>
        {showWdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowWdModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-sm"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-extrabold text-base flex items-center gap-1.5 text-slate-900">
                  <CreditCard className="w-5 h-5 text-indigo-500" /> Wallet Cash Request
                </h3>
                <button onClick={() => setShowWdModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 border rounded-2xl p-4.5 text-center mb-4">
                <span className="text-[10px] text-slate-400 uppercase font-black">AVAILABLE BALANCE</span>
                <h4 className="text-2xl font-black text-slate-800 mt-0.5">৳{currentUser.balance}</h4>
              </div>

              <form onSubmit={submitWithdrawal} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Withdrawal Amount (৳) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    className="form-input text-xs font-bold py-2.5" 
                    placeholder="Minimum amount: ৳100" 
                    required
                    value={wdForm.amount}
                    onChange={(e) => setWdForm({ ...wdForm, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Gateway Router</label>
                  <select 
                    className="form-input text-xs py-2.5"
                    value={wdForm.method}
                    onChange={(e) => setWdForm({ ...wdForm, method: e.target.value })}
                  >
                    <option value="bKash">bKash Mobile Wallet</option>
                    <option value="Nagad">Nagad Mobile Wallet</option>
                    <option value="Rocket">Rocket Mobile Wallet</option>
                    <option value="Bank Transfer">Central Bank EFT Routing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {wdForm.method === 'Bank Transfer' ? 'Clearing Bank Routing Number & Card account' : `${wdForm.method} Mobile Account`}
                  </label>
                  <input 
                    type="text" 
                    className="form-input text-xs font-mono" 
                    placeholder={wdForm.method === 'Bank Transfer' ? 'e.g. IBAN / Branch layout' : 'e.g. 017XXXXXXXX'}
                    required
                    value={wdForm.account}
                    onChange={(e) => setWdForm({ ...wdForm, account: e.target.value })}
                  />
                </div>

                <div className="bg-amber-50 rounded-xl p-3 text-[10px] text-amber-700 leading-normal border border-amber-100">
                  <Clock className="w-3.5 h-3.5 text-amber-500 inline-block mr-1 align-middle" />
                  Your withdrawal parameters will undergo security authorization, completing transit inside 24 to 48 hours.
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl uppercase text-xs tracking-wider transition-colors shadow"
                >
                  Submit Cash Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Tracking Visual Timeline Popup Modal */}
      <AnimatePresence>
        {showTrackerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowTrackerModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 border border-slate-100"
            >
              <OrderTracker 
                orders={orders} 
                defaultTrackingId={trackingIdToView} 
                onTrackClose={() => setShowTrackerModal(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
