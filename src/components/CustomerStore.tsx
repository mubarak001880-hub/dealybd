import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Search, LogIn, LogOut, ArrowRight, ArrowLeft, UserCheck, 
  MapPin, Phone, User, Package, Check, ChevronLeft, ChevronRight, Star,
  Smartphone, Building, Mail, Clock, HelpCircle, Eye, Tag, AlertCircle, ShoppingBag, Truck, X, ShieldCheck, Menu,
  Heart, MessageSquare, Home, Camera, Save, Edit3, Upload, Trash, Plus, Award, Layers, DollarSign, Lock, Shield, Loader2, CreditCard, CheckCircle2, MoreVertical, Info, Calendar
} from 'lucide-react';
import { Product, Category, Order, OrderStatus, Banner, SellerApp, Customer, SpecialOffer, DeliveryCharge, FooterConfig, PopupImage, ResellerPageConfig, ResellerSubscriptionOption, ResellerFAQ, ResellerBenefitCard, AdvanceConfig, PromoCode } from '../types';
import OrderTracker from './OrderTracker';
import { generateTrackingId, createInitialTimeline } from '../data';

interface CustomerStoreProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  banners: Banner[];
  popupImages?: PopupImage[];
  bannerHeight: string;
  sellerApps: SellerApp[];
  setSellerApps: React.Dispatch<React.SetStateAction<SellerApp[]>>;
  specialOffers: SpecialOffer[];
  deliveryCharges: DeliveryCharge[];
  footerConfig: FooterConfig;
  loggedCustomer: Customer | null;
  onCustLogin: (phone: string, pass: string) => boolean;
  onCustRegister: (data: Omit<Customer, 'id'>) => boolean;
  onCustLogout: () => void;
  onUpdateCustomer: (updated: Customer) => void;
  showNotif: (msg: string, type: 'success' | 'error') => void;
  openPanelLogin: () => void;
  resellerPageConfig?: ResellerPageConfig;
  resellerSubscriptions?: ResellerSubscriptionOption[];
  resellerBenefits?: ResellerBenefitCard[];
  resellerFAQs?: ResellerFAQ[];
  advanceConfig: AdvanceConfig;
  setAdvanceConfig: React.Dispatch<React.SetStateAction<AdvanceConfig>>;
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
}

const getCategoryIcon = (catId: string) => {
  switch (catId) {
    case 'cat1': return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80'; // clock
    case 'cat2': return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80'; // night light
    case 'cat3': return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=150&q=80'; // pendant
    case 'cat4': return 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&q=80'; // wood speaker
    default: return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80';
  }
};

const getThemeColorClasses = (themeColor: string) => {
  switch (themeColor) {
    case 'cyan':
      return {
        bg: 'bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 border-cyan-300',
        badge: 'bg-cyan-500 hover:bg-cyan-600',
        text: 'text-indigo-950',
        subtext: 'text-indigo-600',
        icon: ShoppingCart,
        iconColor: 'text-cyan-600'
      };
    case 'orange':
      return {
        bg: 'bg-gradient-to-br from-orange-50/50 to-yellow-50/50 border-orange-300',
        badge: 'bg-orange-500 hover:bg-orange-600',
        text: 'text-orange-950',
        subtext: 'text-orange-600',
        icon: Truck,
        iconColor: 'text-orange-600'
      };
    case 'emerald':
      return {
        bg: 'bg-gradient-to-br from-teal-50/50 to-emerald-50/50 border-emerald-300',
        badge: 'bg-emerald-500 hover:bg-emerald-600',
        text: 'text-emerald-950',
        subtext: 'text-emerald-600',
        icon: ShieldCheck,
        iconColor: 'text-emerald-600'
      };
    case 'purple':
      return {
        bg: 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-purple-300',
        badge: 'bg-purple-500 hover:bg-purple-600',
        text: 'text-purple-950',
        subtext: 'text-purple-600',
        icon: ShoppingBag,
        iconColor: 'text-purple-600'
      };
    case 'pink':
    default:
      return {
        bg: 'bg-gradient-to-br from-pink-50/50 to-rose-50/50 border-pink-300',
        badge: 'bg-pink-500 hover:bg-pink-600',
        text: 'text-pink-950',
        subtext: 'text-pink-600',
        icon: Tag,
        iconColor: 'text-pink-600'
      };
  }
};

interface SslPaymentPortalProps {
  amount: number;
  onCancel: () => void;
  onComplete: () => void;
}

const SslPaymentPortal: React.FC<SslPaymentPortalProps> = ({ amount, onCancel, onComplete }) => {
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [step, setStep] = useState<'form' | 'otp' | 'pin' | 'loading' | 'success'>('form');
  const [phone, setPhone] = useState('01815123456');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [secLeft, setSecLeft] = useState(120);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && secLeft > 0) {
      timer = setInterval(() => setSecLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, secLeft]);

  const triggerProcess = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('success');
    }, 1800);
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 font-sans bg-slate-50 text-slate-800">
      {/* Payment Channels Tabs */}
      {step === 'form' && (
        <div className="grid grid-cols-2 gap-2 border-b-2 border-slate-200 pb-3">
          <button 
            type="button"
            onClick={() => setMethod('bkash')}
            className={`flex items-center justify-center py-2 px-3 rounded-xl border-2 transition-all cursor-pointer font-black text-xs uppercase tracking-wider ${method === 'bkash' || method === 'nagad' || method === 'rocket' ? 'bg-pink-500 border-pink-600 text-white shadow-xs scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
          >
            <Smartphone className="w-4 h-4 mr-1 ml-0" /> Mobile Banking
          </button>
          <button 
            type="button"
            onClick={() => setMethod('card')}
            className={`flex items-center justify-center py-2 px-3 rounded-xl border-2 transition-all cursor-pointer font-black text-xs uppercase tracking-wider ${method === 'card' ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
          >
            <CreditCard className="w-4 h-4 mr-1 ml-0" /> Card Payment
          </button>
        </div>
      )}

      {/* Main Channel Details Panels */}
      {step === 'form' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-3xs">
          {method !== 'card' ? (
            <div className="space-y-4">
              {/* Interactive bKash, Nagad, Rocket brand selector */}
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Select Gateway Channel Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bkash', name: 'bKash Wallet', color: 'hover:border-pink-500 hover:text-pink-600', activeBg: 'bg-rose-50 border-pink-500 text-pink-600 ring-2 ring-pink-400/30' },
                    { id: 'nagad', name: 'Nagad Wallet', color: 'hover:border-orange-500 hover:text-orange-600', activeBg: 'bg-orange-50 border-orange-500 text-orange-600 ring-2 ring-orange-400/30' },
                    { id: 'rocket', name: 'DBBL Rocket', color: 'hover:border-indigo-500 hover:text-indigo-600', activeBg: 'bg-indigo-50 border-indigo-600 text-indigo-600 ring-2 ring-indigo-400/30' }
                  ].map(prov => {
                    const isActive = method === prov.id;
                    return (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => setMethod(prov.id as any)}
                        className={`text-[10px] sm:text-xs font-black py-2.5 rounded-xl border-2 transition-all cursor-pointer uppercase ${isActive ? prov.activeBg : 'bg-slate-50 border-slate-200 text-slate-500 ' + prov.color}`}
                      >
                        {prov.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone number field */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Your personal Wallet Phone Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold font-mono text-xs text-slate-400">+88</span>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs font-bold leading-none focus:outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <p className="text-[9px] text-slate-400 leading-normal">The payment process will dynamically send a test sandbox code to verify phone authorization.</p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (phone.length < 11) {
                      alert("Please provide a valid 11-digit mobile wallet number.");
                      return;
                    }
                    setSecLeft(120);
                    setStep('otp');
                  }}
                  className={`flex-1 py-3 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-xs active:scale-95 transition-all ${method === 'bkash' ? 'bg-pink-600 hover:bg-pink-700' : method === 'nagad' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  Authorize & Proceed ➔
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-250 border border-slate-250 text-slate-600 text-xs font-black uppercase rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Cardholder Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. MONIRUL ISLAM"
                  className="w-full bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs font-bold uppercase focus:outline-none"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs font-bold font-mono focus:outline-none"
                    value={cardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      let matches = val.match(/\d{4,16}/g);
                      let match = (matches && matches[0]) || '';
                      let parts = [];
                      for (let i=0, len=match.length; i<len; i+=4) {
                        parts.push(match.substring(i, i+4));
                      }
                      if (parts.length > 0) {
                        setCardNumber(parts.join(' '));
                      } else {
                        setCardNumber(val);
                      }
                    }}
                  />
                  <span className="absolute right-3 top-2.5 text-slate-350 text-[10px] font-black uppercase">VISA / MC</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Expires</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs font-bold font-mono text-center focus:outline-none"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        setCardExpiry(val.substring(0, 2) + '/' + val.substring(2, 4));
                      } else {
                        setCardExpiry(val);
                      }
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">CVV Code</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="***"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs font-bold font-mono text-center focus:outline-none"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!cardHolder.trim() || cardNumber.length < 15) {
                      alert("Please provide the card details correctly.");
                      return;
                    }
                    triggerProcess();
                  }}
                  className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  Pay Securely ৳{amount} BDT
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-250 border border-slate-250 text-slate-600 text-xs font-black uppercase rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OTP validation verification overlay step */}
      {step === 'otp' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-indigo-950 border border-orange-100 flex items-center justify-center mx-auto mb-2 text-lg font-black tracking-tighter">
              OTP
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Verification Sandbox Authentication</h4>
            <p className="text-[11px] text-slate-500 mt-1">We sent a text verification code with reference ID <b>#{Date.now().toString().substring(10)}</b> to wallet <b>+88{phone}</b>.</p>
          </div>

          <div className="space-y-1 max-w-[200px] mx-auto">
            <label className="text-[10px] text-slate-400 font-black uppercase block text-center">Type default OTP PIN (123456)</label>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 123456"
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-center font-bold font-mono tracking-widest text-lg focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            <div className="text-center text-[10px] text-slate-400 font-bold pt-1">
              Code expires in: <span className="font-mono text-pink-600 font-black">{Math.floor(secLeft / 60)}:{(secLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (otp === '123456' || otp.length === 6) {
                  setStep('pin');
                } else {
                  alert("Wrong OTP. Please use the default: 123456");
                }
              }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Verify Code ➔
            </button>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase rounded-xl cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* SECURE PIN ENTER OPTION STEP */}
      {step === 'pin' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-3xs space-y-4">
          <div className="text-center">
            <Lock className="w-10 h-10 text-pink-500 mx-auto mb-2 animate-bounce" />
            <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Enter Secure Mobile Banking PIN</h4>
            <p className="text-[11px] text-slate-500 mt-1">Provide your 4 or 5-digit security wallet key pin to authorize <b>৳{amount}.00 BDT</b> from <b>+88{phone}</b>.</p>
          </div>

          <div className="space-y-1 max-w-[160px] mx-auto">
            <input
              type="password"
              maxLength={5}
              placeholder="••••"
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-center font-black font-mono tracking-widest text-xl focus:outline-none"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            />
            <p className="text-[8px] text-slate-400 text-center uppercase tracking-wider mt-1">(Any 4-digit key is accepted for demo purposes)</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (pin.length < 4) {
                  alert("Please write your pin numbers.");
                  return;
                }
                triggerProcess();
              }}
              className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow active:scale-95"
            >
              Confirm Transaction
            </button>
            <button
              type="button"
              onClick={() => setStep('otp')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase rounded-xl cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Gateway spin progress loading screen */}
      {step === 'loading' && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-3xs text-center space-y-4">
          <Loader2 className="w-12 h-12 text-pink-500 mx-auto mb-3 animate-spin" />
          <h4 className="font-extrabold text-sm text-slate-900 duration-1000 animate-pulse uppercase tracking-wider">Verifying Gateway Socket API...</h4>
          <p className="text-[11.5px] text-slate-505 text-slate-500">Contacting Dealy payment integration endpoints through SSL Wireless secure tunnel. Do not close or refresh this page.</p>
        </div>
      )}

      {/* Success Transaction Finish overlay screen */}
      {step === 'success' && (
        <div className="bg-white rounded-xl border-4 border-emerald-500/30 p-8 shadow-2xl text-center space-y-5 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-emerald-700 uppercase tracking-wide">SSL WIRELESS DEPOSIT OK!</h4>
            <p className="text-xs text-slate-800 font-extrabold font-mono font-sans">Txn ID: SSL_SANDBOX_{Date.now().toString().substring(5)}</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto pt-1">Your payment of <b className="text-emerald-700 font-mono">৳{amount}.00 BDT</b> was verified and registered successfully.</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[10px] text-slate-500 text-left space-y-1">
            <span className="font-black text-slate-705 text-slate-700 uppercase tracking-widest block border-b pb-1 mb-1">Receipt details</span>
            <div>Payee: <b className="text-slate-800">Dealy Ltd Reseller Program</b></div>
            <div>Reference: <b className="text-slate-800 font-mono font-sans">RES_{phone}</b></div>
            <div>Time: <b className="text-slate-805 text-slate-800 font-mono font-sans">{new Date().toLocaleString()}</b></div>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow active:scale-95 transition-all"
          >
            Complete & Return to Merchant ➔
          </button>
        </div>
      )}
    </div>
  );
};

export default function CustomerStore({
  products,
  categories,
  orders,
  setOrders,
  banners,
  popupImages = [],
  bannerHeight,
  sellerApps,
  setSellerApps,
  specialOffers,
  deliveryCharges,
  footerConfig,
  loggedCustomer,
  onCustLogin,
  onCustRegister,
  onCustLogout,
  onUpdateCustomer,
  showNotif,
  openPanelLogin,
  resellerPageConfig,
  resellerSubscriptions = [],
  resellerBenefits = [],
  resellerFAQs = [],
  advanceConfig,
  setAdvanceConfig,
  promoCodes,
  setPromoCodes,
}: CustomerStoreProps) {
  const [cart, setCart] = useState<{ product: Product; qty: number; color: string; cartId: string }[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('orivian_v4_cart', JSON.stringify(cart));
  }, [cart]);

  // UI state
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<SpecialOffer | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [showCartModal, setShowCartModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showCustProfilePage, setShowCustProfilePage] = useState(false);
  const [showCartPage, setShowCartPage] = useState(false);
  const [showSupportPage, setShowSupportPage] = useState(false);
  const [showMyOrdersPage, setShowMyOrdersPage] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState<string | null>(null);
  const [orderIdToDeliver, setOrderIdToDeliver] = useState<string | null>(null);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [selectedTrackingId, setSelectedTrackingId] = useState('');
  const [checkoutDistrictId, setCheckoutDistrictId] = useState<string>('');
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);
  const [clickedPayToConfirm, setClickedPayToConfirm] = useState(false);
  const [isAdvanceLoading, setIsAdvanceLoading] = useState(false);
  const [showAdvancePaymentView, setShowAdvancePaymentView] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  // Promo code customer states
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Language & SSL payment gateway states
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [showSslGateway, setShowSslGateway] = useState(false);
  const [sslPaymentData, setSslPaymentData] = useState<{
    amount: number;
    title: string;
    onSuccess: () => void;
  } | null>(null);

  const bnDict: Record<string, string> = {
    "Home": "হোম",
    "Shop": "শপ",
    "Favorite": "প্রিয়",
    "Cart": "কার্ট",
    "Me": "অ্যাকাউন্ট",
    "Join Reseller": "রিসেলার হোন",
    "Search...": "খুঁজুন...",
    "Search product...": "পণ্য খুঁজুন...",
    "My Account": "আমার প্রোফাইল",
    "My Cart": "আমার কার্ট",
    "Help & Support": "সহায়তা ও সাপোর্ট",
    "My Orders": "আমার অর্ডারসমূহ",
    "To Pay": "পেমেন্ট বাকি",
    "To Ship": "শিপমেন্ট হবে",
    "Received": "ডেলিভারি সম্পন্ন",
    "Return/Cancel": "ফেরত/বাতিল",
    "View All Orders": "সব অর্ডার দেখুন",
    "Sign In": "লগইন করুন",
    "Log In": "লগইন",
    "My Order History": "আমার অর্ডারের ইতিহাস",
    "Logout Account": "লগআউট করুন",
    "Owner / Reseller Panel": "মালিক / রিসেলার প্যানেল",
    "Flash Sale": "ফ্ল্যাশ সেল",
    "Category": "ক্যাটাগরি",
    "All Products": "সব পণ্য",
    "Hot Deals": "হট ডিল",
    "Trending Products": "চলতি ট্রেন্ডিং পণ্য",
    "Product Details": "বিস্তারিত বিবরণ",
    "Add to Cart": "কার্টে যোগ করুন",
    "Buy Now": "এখনই কিনুন",
    "Order Now": "অর্ডার করুন",
    "In Stock": "স্টক আছে",
    "Out of Stock": "স্টক শেষ",
    "Saved Items": "প্রিয় তালিকা",
    "Clear All": "সব মুছুন",
    "Add": "যোগ করুন",
    "Again": "আবার অর্ডার",
    "Track": "ট্র্যাক",
    "Cancel": "বাতিল",
    "Browse Category": "ক্যাটাগরি সমূহ",
    "Checkout": "চেকআউট",
    "Your Favorite list is empty.": "আপনার প্রিয় তালিকা খালি আছে।",
    "Browse Store Catalog": "স্টোর ব্রাউজ করুন",
    "Apply securely by providing your profile details below": "নিচের ফর্মে সঠিক তথ্য দিয়ে আবেদন সম্পন্ন করুন",
    "রিসেলার অ্যাকাউন্ট রেজিস্ট্রেশন": "রিসেলার অ্যাকাউন্ট রেজিস্ট্রেশন",
    "সচল মোবাইল নাম্বার *": "সচল মোবাইল নাম্বার *",
    "আপনার সম্পূর্ণ নাম *": "আপনার সম্পূর্ণ নাম *",
    "অতীতের অভিজ্ঞতা বা কাস্টমাইজড রিমার্কস *": "অতীতের অভিজ্ঞতা বা কাস্টমাইজড রিমার্কস *",
    "সাবমিট অ্যাপ্লিকেশন ➔": "সাবমিট অ্যাপ্লিকেশন ➔",
  };

  const t = (text: string) => {
    if (lang === 'en') return text;
    return bnDict[text] || text;
  };

  // Active Popups Configuration
  const activePopups = popupImages ? popupImages.filter(p => p.isActive) : [];
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [currentPopupIdx, setCurrentPopupIdx] = useState(0);

  useEffect(() => {
    if (activePopups.length > 0) {
      setShowPopupModal(true);
    }
  }, []);

  const [sidebarPopupIdx, setSidebarPopupIdx] = useState(0);

  useEffect(() => {
    if (activePopups.length <= 1) return;
    const interval = setInterval(() => {
      setSidebarPopupIdx(prev => (prev + 1) % activePopups.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activePopups.length]);

  // Submit search query and show all matched products in store list
  const handleSearchSubmit = () => {
    const query = searchInput.toLowerCase().trim();
    if (!query) return;

    // Reset all sub-pages so they return to catalog/storefront
    setShowCustProfilePage(false);
    setShowCartPage(false);
    setShowSupportPage(false);
    setShowShopPage(false);
    setSelectedOffer(null);
    setShowOnlyFavorites(false);
    setSelectedCat(null);
    setViewingProduct(null); // Close any active product details page

    // Let's find any product whose name or description includes the query (case insensitive)
    const matched = products.filter(p => 
      p.inStock && (
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        (categories.find(c => c.id === p.catId)?.name.toLowerCase() || '').includes(query)
      )
    );

    if (matched.length > 0) {
      const showcaseSection = document.getElementById('products-header') || document.getElementById('categories-section');
      if (showcaseSection) {
        showcaseSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    } else {
      showNotif(`No products found matching "${searchInput}"`, "error");
    }
  };

  useEffect(() => {
    // Keep checkbox state synchronized nicely with active items in cart
    const activeIds = cart.map(item => item.cartId);
    setSelectedCartIds(prev => {
      const filtered = prev.filter(id => activeIds.includes(id));
      const missing = activeIds.filter(id => !prev.includes(id));
      if (missing.length > 0 || prev.length !== filtered.length) {
        return [...filtered, ...missing];
      }
      return prev;
    });
  }, [cart]);

  // Profile-specific states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [activeProfileTab, setActiveProfileTab] = useState<'to_pay' | 'to_ship' | 'received' | 'cancelled'>('to_pay');
  const [showShopPage, setShowShopPage] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [showResellerLandingPage, setShowResellerLandingPage] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const openResellerLandingPage = () => {
    setViewingProduct(null);
    setSelectedOffer(null);
    setSelectedCat(null);
    setShowCustProfilePage(false);
    setShowOnlyFavorites(false);
    setShowCartPage(false);
    setShowSupportPage(false);
    setShowShopPage(false);
    setShowStatement(false);
    setShowResellerLandingPage(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Customer/Reseller order editing states
  const [editingCustomerOrder, setEditingCustomerOrder] = useState<Order | null>(null);
  const [editOrderName, setEditOrderName] = useState('');
  const [editOrderPhone, setEditOrderPhone] = useState('');
  const [editOrderAddress, setEditOrderAddress] = useState('');

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showNotif("Image size must be less than 3MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
        showNotif("Avatar uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync profile fields when loggedCustomer matches
  useEffect(() => {
    if (loggedCustomer) {
      setProfileName(loggedCustomer.name);
      setProfilePhone(loggedCustomer.phone);
      setProfileAddress(loggedCustomer.address || '');
      setProfileAvatar(loggedCustomer.avatarUrl || '');
    }
  }, [loggedCustomer, showCustProfilePage]);

  useEffect(() => {
    if (deliveryCharges && deliveryCharges.length > 0 && !checkoutDistrictId) {
      setCheckoutDistrictId(deliveryCharges[0].id);
    }
  }, [deliveryCharges, checkoutDistrictId]);

  useEffect(() => {
    if (clickedPayToConfirm) {
      setIsAdvanceLoading(true);
      const timer = setTimeout(() => {
        setIsAdvanceLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clickedPayToConfirm]);

  const categoriesScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollCategories = (scrollOffset: number) => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  const goHome = () => {
    setViewingProduct(null);
    setSelectedOffer(null);
    setSelectedCat(null);
    setSearchInput('');
    setShowCustProfilePage(false);
    setShowOnlyFavorites(false);
    setShowCartPage(false);
    setShowSupportPage(false);
    setShowShopPage(false);
    setShowStatement(false);
    setIsCheckingOut(false);
    setShowResellerLandingPage(false);
    setShowMyOrdersPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const myOrders = orders.filter(o => loggedCustomer && o.custPhone === loggedCustomer.phone);

  // Input states
  const [loginData, setLoginData] = useState({ phone: '', pass: '' });
  const [regData, setRegData] = useState({ name: '', phone: '', address: '', pass: '' });
  const [sellerData, setSellerData] = useState({ name: '', phone: '', details: '' });
  const [guestDetails, setGuestDetails] = useState({ name: '', phone: '', address: '' });
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'COD' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('COD');
  const [checkoutTxId, setCheckoutTxId] = useState('');
  const [checkoutSenderNo, setCheckoutSenderNo] = useState('');
  const [useProfileInfo, setUseProfileInfo] = useState(true);

  // Derived checkout inputs
  const isProfileMode = !!(loggedCustomer && useProfileInfo);
  const currentName = isProfileMode ? (profileName || loggedCustomer?.name || '') : guestDetails.name;
  const currentPhone = isProfileMode ? (profilePhone || loggedCustomer?.phone || '') : guestDetails.phone;
  const currentAddress = isProfileMode ? (profileAddress || loggedCustomer?.address || '') : guestDetails.address;

  const handleToggleUseProfileInfo = (checked: boolean) => {
    setUseProfileInfo(checked);
    if (!checked && loggedCustomer) {
      setGuestDetails({
        name: profileName || loggedCustomer.name || '',
        phone: profilePhone || loggedCustomer.phone || '',
        address: profileAddress || loggedCustomer.address || ''
      });
    }
  };

  const activeBanners = banners.filter((b) => b.isActive);

  // Banner slider auto cycle (3 seconds stay, using active banners count strictly to avoid resets)
  useEffect(() => {
    if (activeBanners.length <= 1) {
      setCurrentBanner(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
    }, 3000); // 3 seconds stay
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Prevent mobile users from encountering constrained checkout popup modals
  useEffect(() => {
    if (showCartModal && window.innerWidth < 768) {
      setShowCartModal(false);
      setViewingProduct(null);
      setShowCartPage(true);
      setIsCheckingOut(true);
    }
  }, [showCartModal]);

  const searchLower = searchInput.toLowerCase().trim();
  const displayProducts = products.filter((p) => {
    const matchesInStock = p.inStock;
    const isSpecialProduct = specialOffers && specialOffers.some(so => so.catId === p.catId);
    const matchesCat = (searchLower.length > 0)
      ? true
      : (selectedCat ? p.catId === selectedCat : !isSpecialProduct);
    const catName = categories.find(c => c.id === p.catId)?.name.toLowerCase() || '';
    const matchesSearch = !searchLower || 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      catName.includes(searchLower);
    const matchesFav = !showOnlyFavorites || favorites.includes(p.id);
    return matchesInStock && matchesCat && matchesSearch && matchesFav;
  });

  const flashProducts = products.filter((p) => p.isFlash && p.inStock);

  // Cart Functions
  const addToCart = (product: Product, quantity = 1, color = '') => {
    const cartId = `${product.id}_${color}`;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.cartId === cartId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + quantity };
        return next;
      }
      return [...prev, { product, qty: quantity, color, cartId }];
    });
    setSelectedCartIds((prev) => prev.includes(cartId) ? prev : [...prev, cartId]);
    showNotif(`Added ${quantity}x ${product.name} to Cart.`, 'success');
  };

  const updateCartQty = (cartId: string, value: number) => {
    if (value <= 0) {
      setCart((prev) => prev.filter((i) => i.cartId !== cartId));
    } else {
      setCart((prev) => prev.map((i) => (i.cartId === cartId ? { ...i, qty: value } : i)));
    }
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  // Checkout handling
  const handleCheckout = () => {
    if (!selectedCartItems.length) {
      showNotif("Please select at least one item to order.", "error");
      return;
    }
    
    const orderDetailsObj = {
      custName: currentName.trim(),
      custPhone: currentPhone.trim(),
      custAddress: currentAddress.trim()
    };

    if (!orderDetailsObj.custName || !orderDetailsObj.custPhone || !orderDetailsObj.custAddress) {
      showNotif("Please complete Recipient Name, Mobile Phone Number, and Detailed Address.", "error");
      return;
    }

    if (!checkoutDistrictId) {
      showNotif("Please select a Delivery District Region.", "error");
      return;
    }

    const totalAmount = selectedCartItems.reduce((acc, item) => acc + item.product.discountPrice * item.qty, 0);
    
    let promoDiscount = 0;
    if (appliedPromo) {
      if (appliedPromo.discountType === 'percent') {
        promoDiscount = Math.round((totalAmount * appliedPromo.discountValue) / 100);
      } else {
        promoDiscount = appliedPromo.discountValue;
      }
    }
    const finalProductTotal = Math.max(0, totalAmount - promoDiscount);

    const matchedDistrict = deliveryCharges.find(dc => dc.id === checkoutDistrictId);
    const deliveryCostAmount = matchedDistrict ? matchedDistrict.charge : 0;

    // Advance Payment Requirements Calculation
    let totalAdvanceRequired = 0;
    if (advanceConfig && advanceConfig.requireAdvance) {
      if (advanceConfig.amountType === 'delivery') {
        totalAdvanceRequired = deliveryCostAmount;
      } else {
        totalAdvanceRequired = advanceConfig.fixedAmount || 0;
      }
    } else {
      totalAdvanceRequired = selectedCartItems.reduce((sum, item) => {
        if (item.product.requireAdvance) {
          return sum + (item.product.advanceAmount || 0) * item.qty;
        }
        return sum;
      }, 0);
    }

    if (totalAdvanceRequired > 0) {
      if (checkoutPaymentMethod === 'COD') {
        showNotif(`Advance payment of ৳${totalAdvanceRequired} is required. Please select a payment channel.`, "error");
        return;
      }
      if (!checkoutTxId.trim()) {
        showNotif("Transaction ID (TxID) is required for advance verification.", "error");
        return;
      }
    }

    const orderDateStr = new Date().toLocaleString();
    const trackingId = generateTrackingId();

    const districtCombinedAddress = orderDetailsObj.custAddress + (matchedDistrict ? ` [District: ${matchedDistrict.district}, Delivery: ৳${matchedDistrict.charge}]` : '');

    // Mapping items to a clean string or list representation for production rendering
    const orderItemsName = selectedCartItems.map((c) => `${c.product.name} (x${c.qty})`).join(', ');

    const newOrder: Order = {
      id: 'o_' + Date.now(),
      trackingId,
      type: loggedCustomer ? 'customer' : 'guest',
      productName: orderItemsName,
      prodImg: selectedCartItems[0]?.product.img,
      qty: selectedCartItems.reduce((s, i) => s + i.qty, 0),
      sellRate: finalProductTotal + deliveryCostAmount,
      profit: 0, // Direct customer purchases hold zero reseller profit margins
      amount: finalProductTotal + deliveryCostAmount,
      ...orderDetailsObj,
      custAddress: districtCombinedAddress,
      status: 'Pending',
      date: orderDateStr,
      timeline: createInitialTimeline(orderDateStr),
      advancePaid: totalAdvanceRequired > 0 ? totalAdvanceRequired : 0,
      txId: totalAdvanceRequired > 0 ? checkoutTxId.trim() : '',
      paymentMethod: totalAdvanceRequired > 0 ? checkoutPaymentMethod : 'COD'
    };

    setOrders((prev) => [...prev, newOrder]);
    
    // Increment promo usage counter if applicable
    if (appliedPromo) {
      setPromoCodes(prev => prev.map(p => p.id === appliedPromo.id ? { ...p, usedCount: p.usedCount + 1 } : p));
      setAppliedPromo(null);
      setPromoCodeInput('');
    }

    // Remove only the selected items from the cart
    setCart((prev) => prev.filter((item) => !selectedCartIds.includes(item.cartId)));
    setSelectedCartIds([]);
    
    setGuestDetails({ name: '', phone: '', address: '' });
    setCheckoutPaymentMethod('COD');
    setCheckoutTxId('');
    setShowCartModal(false);
    setIsCheckingOut(false);
    setShowCartPage(false);
    
    // Auto launch Tracker modal so they see the real timeline!
    setSelectedTrackingId(trackingId);
    setShowTrackerModal(true);
    showNotif(`Order Placed Successfully! Copy Tracking ID: ${trackingId}`, 'success');
  };

  // Form Submissions
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneClean = loginData.phone.trim();
    if (phoneClean.length !== 11) {
      showNotif("মোবাইল নাম্বার অবশ্যই ১১ ডিজিটের হতে হবে (Mobile number must be exactly 11 digits).", "error");
      return;
    }
    if (onCustLogin(phoneClean, loginData.pass)) {
      setShowAuthModal(false);
      setLoginData({ phone: '', pass: '' });
      setShowCustProfilePage(true);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.phone.trim() || !regData.pass.trim()) {
      showNotif("সবগুলো ঘর সঠিকভাবে পূরণ করুন (Please fill all fields).", "error");
      return;
    }
    const phoneClean = regData.phone.trim();
    if (phoneClean.length !== 11) {
      showNotif("মোবাইল নাম্বার অবশ্যই ১১ ডিজিটের হতে হবে (Mobile number must be exactly 11 digits).", "error");
      return;
    }
    if (onCustRegister({ ...regData, phone: phoneClean })) {
      setShowAuthModal(false);
      setRegData({ name: '', phone: '', address: '', pass: '' });
      setShowCustProfilePage(true);
    }
  };

  const handleJoinSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerData.name.trim() || !sellerData.phone.trim()) {
      showNotif("Partner details are incomplete.", "error");
      return;
    }

    // Set up SSL payment details and open sandbox gateway
    setSslPaymentData({
      amount: 100,
      title: "Reseller Sales Partner ID Activation",
      onSuccess: () => {
        const newApp: SellerApp = {
          id: 'app_' + Date.now(),
          name: sellerData.name.trim(),
          phone: sellerData.phone.trim(),
          details: sellerData.details.trim(),
          status: 'pending',
          date: new Date().toLocaleDateString()
        };
        setSellerApps((prev) => [...prev, newApp]);
        setSellerData({ name: '', phone: '', details: '' });
        setShowSellerModal(false);
        setShowResellerLandingPage(false);
        showNotif("SSL Gateway Payment Success! Your Reseller account application is active & pending review.", "success");
      }
    });
    setShowSslGateway(true);
  };

  const handleTrackQuickSearch = (tId: string) => {
    setSelectedTrackingId(tId);
    setShowTrackerModal(true);
    setShowCustProfilePage(false);
  };

  const handleOrderAgain = (ord: Order) => {
    const matchedProduct = products.find(p => p.name === ord.productName);
    if (matchedProduct) {
      addToCart(matchedProduct, ord.qty || 1, ord.color || '');
      if (window.innerWidth < 768) {
        setViewingProduct(null);
        setShowCartPage(true);
        setIsCheckingOut(true);
      } else {
        setShowCartModal(true);
      }
      showNotif(`Added "${ord.productName}" to cart. Ready to checkout!`, "success");
    } else {
      const partialProduct = products.find(p => 
        p.name.toLowerCase().includes(ord.productName.toLowerCase()) || 
        ord.productName.toLowerCase().includes(p.name.toLowerCase())
      );
      if (partialProduct) {
        addToCart(partialProduct, ord.qty || 1, ord.color || '');
        if (window.innerWidth < 768) {
          setViewingProduct(null);
          setShowCartPage(true);
          setIsCheckingOut(true);
        } else {
          setShowCartModal(true);
        }
        showNotif(`Added similar item: "${partialProduct.name}" to cart.`, "success");
      } else {
        showNotif(`Sorry, this exact product "${ord.productName}" is currently unavailable.`, "error");
      }
    }
  };

  const cartItemsCount = cart.reduce((s, i) => s + i.qty, 0);
  const selectedCartItems = cart.filter(item => selectedCartIds.includes(item.cartId));
  const cartSubtotal = selectedCartItems.reduce((s, i) => s + i.product.discountPrice * i.qty, 0);
  const matchedCheckoutDistrict = deliveryCharges.find(dc => dc.id === checkoutDistrictId);
  const activeShippingCharge = matchedCheckoutDistrict ? matchedCheckoutDistrict.charge : 0;
  const cartTotal = cartSubtotal + (selectedCartItems.length > 0 ? activeShippingCharge : 0);

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === 'percent') {
      return Math.round((cartSubtotal * appliedPromo.discountValue) / 100);
    } else {
      return appliedPromo.discountValue;
    }
  }, [appliedPromo, cartSubtotal]);

  const handleApplyPromoCode = () => {
    if (!promoCodes || promoCodes.length === 0) {
      showNotif(lang === 'en' ? "No promotional codes are currently configured." : "আপাতত কোনো প্রোমো কোড সক্রিয় নেই।", "error");
      return;
    }
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      showNotif(lang === 'en' ? "Please enter a promo code first." : "অনুগ্রহ করে প্রথমে একটি প্রোমো কোড দিন।", "error");
      return;
    }

    const found = promoCodes.find(p => p.code.toUpperCase() === code);
    if (!found) {
      showNotif(lang === 'en' ? "Invalid promo code." : "ভুল বা অকার্যকর প্রোমো কোড।", "error");
      return;
    }

    if (!found.isActive) {
      showNotif(lang === 'en' ? "This promo code is currently inactive." : "এই প্রোমো কোডটি বর্তমানে নিষ্ক্রিয় রয়েছে।", "error");
      return;
    }

    if (found.usedCount >= found.maxUses) {
      showNotif(lang === 'en' ? "This promo code has reached its usage limit." : "এই প্রোমো কোড ব্যবহারের সীমা অতিক্রম হয়েছে।", "error");
      return;
    }

    // Success
    setAppliedPromo(found);
    showNotif(
      lang === 'en'
        ? `Promo code "${found.code}" applied successfully! You got ৳${found.discountType === 'percent' ? `${found.discountValue}%` : found.discountValue} discount.`
        : `প্রোমো কোড "${found.code}" সফলভাবে প্রয়োগ করা হয়েছে! আপনি ৳${found.discountType === 'percent' ? `${found.discountValue}%` : found.discountValue} ছাড় পেয়েছেন।`,
      "success"
    );
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    showNotif(lang === 'en' ? "Promo code removed." : "প্রোমো কোড মুছে ফেলা হয়েছে।", "success");
  };

  const viewDetails = (prod: Product) => {
    setViewingProduct(prod);
    setSelectedColor(prod.colors?.[0] || '');
    setQty(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSidebarContent = () => {
    return (
      <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-[88px] self-start">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <div className="bg-pink-500 text-white px-5 py-4 font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="p-1.5 bg-white/10 rounded-lg">
              <Menu className="w-4 h-4 text-white" />
            </span>
            <span>All Categories</span>
          </div>
          <ul className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
            <li 
              onClick={() => { 
                setShowShopPage(true); 
                setSelectedCat(null); 
                setSelectedOffer(null); 
                setViewingProduct(null); 
                setShowCustProfilePage(false);
                setShowCartPage(false);
                setShowSupportPage(false);
                setShowResellerLandingPage(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-5 py-3.5 cursor-pointer transition-all flex items-center justify-between hover:bg-emerald-50/60 hover:text-emerald-600 ${showShopPage ? 'bg-emerald-50 text-emerald-600 font-extrabold border-l-4 border-emerald-500' : ''}`}
            >
              <span className="flex items-center gap-1.5 font-extrabold">
                <ShoppingBag className="w-4 h-4 text-emerald-540 text-emerald-500" />
                <span>Shop (All Products)</span>
              </span>
              <span className="bg-emerald-555 bg-emerald-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full z-10 shadow-sm leading-none">
                NEW
              </span>
            </li>
            {categories.map(c => (
              <li 
                key={c.id}
                onClick={() => { 
                  setSelectedCat(c.id); 
                  setSelectedOffer(null); 
                  setViewingProduct(null); 
                  setShowResellerLandingPage(false);
                  setShowShopPage(false);
                  setShowOnlyFavorites(false);
                  setShowCustProfilePage(false);
                  setShowCartPage(false);
                  setShowSupportPage(false);
                }}
                className={`px-5 py-3.5 cursor-pointer transition-all flex items-center justify-between hover:bg-pink-50/40 hover:text-pink-600 ${(selectedCat === c.id && !selectedOffer) ? 'bg-pink-50/50 text-pink-600 font-extrabold border-l-4 border-pink-500' : ''}`}
              >
                <span className="truncate">{c.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Popup Promotion Widget */}
        {!showPopupModal && activePopups.length > 0 && (
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-150/80 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-pink-600 tracking-wider">Special Offer 🔥</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {sidebarPopupIdx + 1}/{activePopups.length}
              </span>
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 group">
              {activePopups[sidebarPopupIdx].link ? (
                <a 
                  href={activePopups[sidebarPopupIdx].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full cursor-pointer"
                >
                  <img 
                    src={activePopups[sidebarPopupIdx].img} 
                    alt="Special Promo Banner" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </a>
              ) : (
                <img 
                  src={activePopups[sidebarPopupIdx].img} 
                  alt="Special Promo Banner" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            {activePopups[sidebarPopupIdx].link && (
              <a 
                href={activePopups[sidebarPopupIdx].link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black text-[11px] py-1.5 rounded-xl uppercase transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs leading-none"
              >
                GET OFFER <ArrowRight className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* DYNAMIC WEBSITE POPUP ADVERTISEMENTS OVERLAY */}
      <AnimatePresence>
        {showPopupModal && activePopups.length > 0 && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopupModal(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[320px] sm:max-w-[400px] bg-transparent flex flex-col items-center z-10"
            >
              <div className="w-full bg-white rounded-[24px] border border-slate-200 shadow-2xl overflow-hidden relative">
                {/* Popup Content Slider */}
                <div className="relative aspect-[4/5] bg-slate-100 flex items-center justify-center group overflow-hidden">
                  {activePopups[currentPopupIdx].link ? (
                    <a 
                      href={activePopups[currentPopupIdx].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setShowPopupModal(false)}
                    >
                      <img 
                        src={activePopups[currentPopupIdx].img} 
                        alt="Special Promotion"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ) : (
                    <img 
                      src={activePopups[currentPopupIdx].img} 
                      alt="Special Promotion"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Redirection Indicator Badge */}
                  {activePopups[currentPopupIdx].link && (
                    <div className="absolute top-2 left-2 bg-pink-600 text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md animate-pulse">
                      Promo Link Active ⚡
                    </div>
                  )}

                  {/* Slide controls if multiple popups exist */}
                  {activePopups.length > 1 && (
                    <>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPopupIdx(prev => (prev - 1 + activePopups.length) % activePopups.length);
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/90 text-slate-800 p-1.5 rounded-full hover:bg-white shadow-md cursor-pointer transition-all active:scale-90"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPopupIdx(prev => (prev + 1) % activePopups.length);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/90 text-slate-800 p-1.5 rounded-full hover:bg-white shadow-md cursor-pointer transition-all active:scale-90"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Pagination Indicator dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/60 p-1 px-2 rounded-full backdrop-blur-xs">
                        {activePopups.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPopupIdx ? 'w-3 bg-pink-500' : 'w-1.5 bg-white/60'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Subtitle Redress info bar if there is a link */}
                {activePopups[currentPopupIdx].link && (
                  <div className="p-3 bg-pink-50 border-t border-pink-100 flex items-center justify-between text-center">
                    <span className="text-[10px] font-bold text-pink-700 leading-tight">Click on image to go to offer! &rsaquo;</span>
                    <a 
                      href={activePopups[currentPopupIdx].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-lg uppercase transition-all flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowPopupModal(false)}
                    >
                      Visit Link <ArrowRight className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Close/Cross Button underneath the popup container */}
              <button 
                type="button"
                onClick={() => setShowPopupModal(false)}
                className="mt-4 flex flex-col items-center gap-1 group cursor-pointer transition-all focus:outline-none"
                title="Dismiss promotion"
              >
                <div className="bg-slate-900/90 text-white hover:bg-pink-600 p-2.5 rounded-full border border-slate-700 hover:border-pink-500 shadow-lg active:scale-95 transition-all">
                  <X className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none mt-1 select-none group-hover:text-pink-400 transition-colors">Close</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-pink-600 shadow-md text-white select-none">
        
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-18 flex items-center justify-between gap-3">
          
          {/* ----------------- MOBILE DYNAMIC HEADER (md:hidden) ----------------- */}
          <div className="flex md:hidden items-center justify-between w-full h-full gap-2">
            { (viewingProduct || showCartPage || showSupportPage || showCustProfilePage || showShopPage || showOnlyFavorites || showMyOrdersPage) ? (
              /* SUB-PAGE COMPACT HEADER (With ArrowLeft back button and small title) */
              <div className="flex items-center justify-between w-full">
                {showCustProfilePage ? (
                  <>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={goHome}
                        className="p-1.5 hover:bg-pink-700 rounded-lg text-white cursor-pointer active:scale-95 transition-transform flex-shrink-0"
                      >
                        <ArrowLeft className="w-5 h-5 text-white font-extrabold" />
                      </button>
                      <span className="font-extrabold text-sm text-white tracking-tight select-none uppercase truncate max-w-[150px]">
                        {t("My Account")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => {
                          onCustLogout();
                          setShowCustProfilePage(false);
                          showNotif("Successfully logged out.", "success");
                        }}
                        className="p-1.5 hover:bg-pink-700/50 text-white rounded-lg cursor-pointer active:scale-95 transition-all flex-shrink-0"
                        title="Logout Account"
                      >
                        <LogOut className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        if (viewingProduct) setViewingProduct(null);
                        else if (showCartPage && isCheckingOut) {
                          setIsCheckingOut(false);
                        } else if (showMyOrdersPage) {
                          setShowMyOrdersPage(false);
                          setShowCustProfilePage(true); // Return to customer account details
                        } else {
                          goHome();
                        }
                      }}
                      className="p-1.5 hover:bg-pink-700 rounded-lg text-white cursor-pointer active:scale-90 transition-transform flex-shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5 text-white font-extrabold" />
                    </button>
                    <span className="font-extrabold text-sm text-white tracking-tight select-none uppercase truncate text-center max-w-[180px]">
                      {viewingProduct ? viewingProduct.name :
                       showCartPage ? (isCheckingOut ? (lang === 'en' ? "Checkout" : "চেকআউট") : t("My Cart")) :
                       showShopPage ? t("Shop") :
                       showSupportPage ? t("Help & Support") :
                       showOnlyFavorites ? t("Saved Items") :
                       showMyOrdersPage ? (lang === 'en' ? "My Orders" : "আমার অর্ডার") :
                       showCustProfilePage ? t("My Account") : "Dealy"}
                    </span>
                    <div className="flex-shrink-0 w-8 flex justify-end">
                      {showCartPage && cart.length > 0 && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to clear your shopping cart?")) {
                              setCart([]);
                              showNotif("Cart cleared!", "success");
                            }
                          }}
                          className="p-1.5 hover:bg-pink-700 text-pink-100 hover:text-white rounded-lg cursor-pointer transition-colors"
                          title="Clear Cart"
                        >
                          <Trash className="w-4.5 h-4.5" />
                        </button>
                      )}
                      {showOnlyFavorites && favorites.length > 0 && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to clear your saved items?")) {
                              setFavorites([]);
                              showNotif("Favorites cleared!", "success");
                            }
                          }}
                          className="p-1.5 hover:bg-pink-700 text-pink-100 hover:text-white rounded-lg cursor-pointer transition-colors"
                          title="Clear Favorites"
                        >
                          <Trash className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* MAIN STOREFRONT HEADER WITH CLEAN SEARCH BOX & PINK BUTTON (like first screenshot) */
              <div className="flex items-center justify-between w-full gap-2 font-sans">
                {/* 3-dot menu icon next to Dealy on left */}
                <button 
                  type="button"
                  onClick={() => setShowMobileMenu(true)}
                  className="flex-shrink-0 p-1 bg-pink-700 hover:bg-pink-800 border border-pink-550/30 rounded-lg text-white cursor-pointer active:scale-95 transition-all w-[34px] h-[34px] flex items-center justify-center shadow-3xs"
                  title="Menu / ক্যাটাগরি ও প্রোফাইল"
                >
                  <MoreVertical className="w-5 h-5 text-white font-extrabold shrink-0" />
                </button>

                <div 
                  onClick={goHome}
                  className="flex-shrink-0 font-black text-base xs:text-lg sm:text-xl tracking-[0.05em] text-white cursor-pointer uppercase font-display leading-none ml-1.5 shadow-sm"
                >
                  DEALY
                </div>

                {/* Search input perfectly scaled & aligned */}
                <div className="flex-1 min-w-[70px] relative flex items-center h-[34px]">
                  <input 
                    type="text" 
                    placeholder={lang === 'en' ? "Search product" : "পণ্য খুঁজুন"}
                    value={searchInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchInput(val);
                      setViewingProduct(null);
                      setShowCustProfilePage(false);
                      setSelectedOffer(null);
                      setShowOnlyFavorites(false);
                      setEditingCustomerOrder(null);
                      setSelectedCat(null);
                      setShowCartPage(false);
                      setShowSupportPage(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    className="w-full h-full bg-white text-slate-900 rounded-lg pl-3 pr-10 py-1.5 text-[11px] focus:outline-none transition-all placeholder-slate-400 border border-transparent font-semibold shadow-inner"
                  />
                  {searchInput ? (
                    <button 
                      onClick={() => {
                        setSearchInput('');
                        setViewingProduct(null);
                        setShowShopPage(false);
                      }}
                      className="absolute right-8 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer transition-colors"
                      title="Clear Search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                  <button 
                    onClick={handleSearchSubmit}
                    className="absolute right-2.5 text-slate-400 hover:text-pink-600 active:scale-90 transition-transform cursor-pointer"
                  >
                    <Search className="w-4 h-4 font-black" />
                  </button>
                </div>

                {/* Clean, attractive Reseller button right of search bar with brand pink color theme - styled to perfectly match heights */}
                <button 
                  onClick={openResellerLandingPage}
                  className="flex-shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95 transition-all h-[34px] shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="leading-none uppercase hidden xs:inline">{t("Join Reseller")}</span>
                </button>

                {/* Compact language switcher right next to it - perfectly matching header height */}
                <button 
                  type="button"
                  onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                  className="flex-shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[9px] sm:text-[10px] px-1.5 py-1 rounded-lg flex items-center gap-0.5 cursor-pointer active:scale-95 transition-all h-[34px] shadow-3xs"
                  title="Switch Language / ভাষা পরিবর্তন করুন"
                >
                  <span className={lang === 'en' ? 'text-white font-black underline decoration-2 underline-offset-2' : 'text-pink-100 font-bold'}>EN</span>
                  <span className="text-white/20">|</span>
                  <span className={lang === 'bn' ? 'text-white font-black underline decoration-2 underline-offset-2' : 'text-pink-100 font-bold'}>বাং</span>
                </button>
              </div>
            )}
          </div>

          {/* ----------------- DESKTOP STANDARD HEADER (md:flex) ----------------- */}
          <div className="hidden md:flex items-center justify-between w-full h-full gap-4">
            
            {/* 1. Website Logo & Brand Name */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div 
                onClick={goHome}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white cursor-pointer hover:scale-105 transition-transform flex-shrink-0 shadow-sm"
              >
                <img 
                  src={footerConfig.brandLogoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"} 
                  alt="Brand Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div 
                onClick={goHome}
                className="cursor-pointer flex flex-col justify-center select-none ml-2.5 flex-shrink-0"
              >
                <h1 className="font-black text-xl md:text-2xl lg:text-3xl tracking-[0.05em] text-white cursor-pointer uppercase font-display leading-none shadow-sm">
                  DEALY
                </h1>
              </div>
            </div>

            {/* 2. Search input bar on desktop */}
            <div className="flex-1 max-w-sm xl:max-w-md relative flex items-center h-[38px] shrink-0">
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Search product" : "পণ্য খুঁজুন"}
                value={searchInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchInput(val);
                  setViewingProduct(null);
                  setShowCustProfilePage(false);
                  setSelectedOffer(null);
                  setShowOnlyFavorites(false);
                  setEditingCustomerOrder(null);
                  setSelectedCat(null);
                  setShowCartPage(false);
                  setShowSupportPage(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                className="w-full h-full bg-white text-slate-900 rounded-xl pl-4 pr-12 py-2 text-xs focus:outline-none transition-all placeholder-slate-400 border border-transparent font-bold shadow-inner"
              />
              {searchInput ? (
                <button 
                  onClick={() => {
                    setSearchInput('');
                    setViewingProduct(null);
                    setShowShopPage(false);
                  }}
                  className="absolute right-9 text-slate-400 hover:text-slate-605 p-1 cursor-pointer transition-colors"
                  title="Clear Search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
              <button 
                onClick={handleSearchSubmit}
                className="absolute right-3.5 text-slate-450 hover:text-pink-600 active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-4.5 h-4.5 text-slate-400 hover:text-pink-600 font-extrabold" />
              </button>
            </div>

            {/* Nav control buttons container */}
            <div className="flex items-center gap-2 text-xs font-bold shrink-0">
              
              {/* 3. Shop option */}
              <button 
                onClick={() => {
                  setShowShopPage(true); 
                  setSelectedCat(null); 
                  setSelectedOffer(null); 
                  setViewingProduct(null); 
                  setShowCustProfilePage(false);
                  setShowCartPage(false);
                  setShowSupportPage(false);
                  setShowOnlyFavorites(false);
                  setShowResellerLandingPage(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all tracking-wide cursor-pointer active:scale-95 h-[38px] flex items-center gap-1.5 ${showShopPage && !selectedCat && !selectedOffer && !showOnlyFavorites && !showCustProfilePage && !showCartPage && !showSupportPage ? 'bg-pink-700 text-white shadow-sm border border-pink-800' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>{lang === 'en' ? "Shop" : "শপিং"}</span>
              </button>

              {/* 4. Join Reseller option */}
              <button 
                onClick={openResellerLandingPage}
                className="bg-white hover:bg-pink-50 text-pink-600 font-black text-xs uppercase tracking-wide px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all h-[38px] shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-pink-500 shrink-0" />
                <span>{lang === 'en' ? "Join Reseller" : "সেলার হন"}</span>
              </button>

              {/* Wishlist Favorites link */}
              <button 
                onClick={() => {
                  setShowOnlyFavorites(true);
                  setViewingProduct(null);
                  setShowCustProfilePage(false);
                  setShowCartPage(false);
                  setShowSupportPage(false);
                  setSelectedCat(null);
                  setShowShopPage(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`relative p-2.5 rounded-xl transition-colors cursor-pointer active:scale-95 h-[38px] flex items-center justify-center ${showOnlyFavorites ? 'bg-pink-700 text-white border border-pink-805' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
                title="Favorites / প্রিয়তালিকা"
              >
                <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-white stroke-white' : 'text-white font-extrabold'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-pink-900 border border-white font-mono font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Language Switch Selector */}
              <button 
                type="button"
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[11px] px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all h-[38px] shadow-3xs"
                title="Switch Language / ভাষা পরিবর্তন করুন"
              >
                <span className={lang === 'en' ? 'text-white font-black underline decoration-2 underline-offset-2' : 'text-pink-100 font-bold'}>EN</span>
                <span className="text-white/20">|</span>
                <span className={lang === 'bn' ? 'text-white font-black underline decoration-2 underline-offset-2' : 'text-pink-100 font-bold'}>বাং</span>
              </button>

              {/* 5. Cart Option */}
              <button 
                onClick={() => {
                  setShowCartPage(true);
                  setViewingProduct(null);
                  setShowCustProfilePage(false);
                  setSelectedOffer(null);
                  setShowOnlyFavorites(false);
                  setShowSupportPage(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer active:scale-95 h-[38px] flex items-center gap-1.5 ${showCartPage ? 'bg-pink-700 text-white border border-pink-805' : 'bg-white hover:bg-pink-50 text-pink-600 border border-white'}`}
                title="My Cart"
              >
                <ShoppingCart className={`w-4 h-4 ${showCartPage ? 'text-white' : 'text-pink-600'}`} />
                <span>{lang === 'en' ? 'Cart' : 'কার্ট'}</span>
                {cartItemsCount > 0 && (
                  <span className="bg-pink-605 text-white font-mono font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs bg-pink-600">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* 6. Sign In or Profile option */}
              {loggedCustomer ? (
                <div className="relative group">
                  <button 
                    onClick={() => {
                      setShowCustProfilePage(true);
                      setViewingProduct(null);
                      setSelectedCat(null);
                      setShowOnlyFavorites(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1.5 bg-white hover:bg-pink-50 text-pink-600 px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer font-extrabold text-xs h-[38px]"
                  >
                    <User className="w-4 h-4 text-pink-500" />
                    <span className="max-w-[85px] truncate">{loggedCustomer.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-pink-400">▼</span>
                  </button>
                  
                  {/* Custom profile drop */}
                  <div className="absolute right-0 top-10 w-48 bg-white text-slate-800 rounded-2xl shadow-xl border p-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2.5 border-b mb-1">
                      <p className="font-extrabold text-xs text-slate-900 truncate">{loggedCustomer.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{loggedCustomer.phone}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowMyOrdersPage(true);
                        setShowCustProfilePage(false);
                        setViewingProduct(null);
                        setSelectedCat(null);
                        setShowOnlyFavorites(false);
                        setShowCartPage(false);
                        setShowSupportPage(false);
                        setShowShopPage(false);
                        setShowResellerLandingPage(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }} 
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-50 font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 text-pink-600" />
                      {lang === 'en' ? 'My Order History' : 'আমার অর্ডারসমূহ'}
                    </button>
                    <button 
                      onClick={() => {
                        onCustLogout();
                        setShowCustProfilePage(false);
                      }} 
                      className="w-full text-left px-3 py-2 text-xs text-red-500 rounded-xl hover:bg-red-50 font-bold flex items-center gap-2 cursor-pointer"
                    >
                      Logout Account
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                      onClick={openPanelLogin}
                      className="w-full text-left px-3 py-2 text-[10px] text-slate-400 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      Owner / Reseller Panel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => { setAuthType('login'); setShowAuthModal(true); }}
                  className="bg-white hover:bg-pink-50 text-pink-600 font-extrabold px-4.5 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer text-xs h-[38px] active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-pink-500" />
                  <span>{lang === 'en' ? 'Sign In' : 'লগইন'}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* BODY COLUMN PANEL */}
      {showCustProfilePage && loggedCustomer ? (
        <main className="flex-1 max-w-4xl mx-auto w-full px-0 sm:px-3 py-0 sm:py-8 animate-fade-in text-slate-800 pb-28 md:pb-12">
          
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* 1. TOP PROFILE INFORMATION CARD - BEAUTIFIED FOR DEALY */}
            <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-100 shadow-sm p-5 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-amber-400" />
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full sm:w-auto">
                  
                  {/* Standalone hidden file picker element */}
                  <input 
                    ref={avatarInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarFileUpload} 
                  />

                  {/* Interactive Avatar */}
                  <div 
                    onClick={() => {
                      if (isEditingProfile) {
                        avatarInputRef.current?.click();
                      }
                    }}
                    className={`relative group w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-md flex-shrink-0 ${isEditingProfile ? 'cursor-pointer hover:brightness-95' : ''}`}
                    title={isEditingProfile ? "Click to change picture / ছবি পরিবর্তনের জন্য ক্লিক করুন" : "Customer Avatar"}
                  >
                    <img 
                      src={profileAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"} 
                      alt={loggedCustomer.name} 
                      className="w-full h-full object-cover rounded-full bg-white transition-all group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    {isEditingProfile && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white mb-1 animate-bounce" />
                        <span className="text-[9px] text-white font-extrabold uppercase">Upload</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 mt-2 sm:mt-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{loggedCustomer.name}</h3>
                      <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase border border-pink-100/60 shadow-3xs">
                        Dealy VIP Shopper
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-2 flex items-center justify-center sm:justify-start gap-1">
                      <Phone className="w-3.5 h-3.5 text-pink-500" />
                      <span>সচল মোবাইল: {loggedCustomer.phone}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      Shopper ID: #{loggedCustomer.id.replace('c_', '')} | @dealy_user
                    </p>
                    
                    {!isEditingProfile && (
                      <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-4 flex-wrap">
                        <button 
                          onClick={() => {
                            setShowStatement(!showStatement);
                            showNotif(
                              lang === 'en' 
                                ? (showStatement ? "Stats dashboard has been hidden." : "Stats dashboard is now active.") 
                                : (showStatement ? "পরিসংখ্যান হাইড করা হয়েছে।" : "পরিসংখ্যান ড্যাশবোর্ড সচল করা হয়েছে।"), 
                              "success"
                            );
                          }}
                          className={`px-3.5 py-2 border rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${showStatement ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <UserCheck className="w-4 h-4 text-pink-500 shrink-0" />
                          <span>
                            {showStatement 
                              ? (lang === 'en' ? "Hide Stats" : "পরিসংখ্যান বন্ধ করুন") 
                              : (lang === 'en' ? "My Statistics" : "আমার পরিসংখ্যান")}
                          </span>
                        </button>

                        <button 
                          onClick={() => {
                            setIsEditingProfile(true);
                            setProfileName(loggedCustomer.name);
                            setProfilePhone(loggedCustomer.phone);
                            setProfileAddress(loggedCustomer.address || '');
                            setProfileAvatar(loggedCustomer.avatarUrl || '');
                          }}
                          className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-200/50 hover:scale-105 text-pink-600 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-3xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 shrink-0" />
                          <span>{lang === 'en' ? "Edit Profile" : "তথ্য সংশোধন করুন"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Profile Details Form */}
              {isEditingProfile ? (
                <div className="pt-6 space-y-5">
                  <div className="bg-pink-50/40 p-4 rounded-xl border border-pink-100/50 text-[11.5px] text-pink-700 font-bold leading-normal">
                    💡 {lang === 'en' ? (
                      <span><b>Tip:</b> You can click directly on the circular profile picture above to upload a new picture from your device, and click "Save Details".</span>
                    ) : (
                      <span><b>টিপস:</b> আপনি সরাসরি উপরের গোল প্রোফাইল ছবির উপর ক্লিক করে খুব সহজে আপনার মোবাইল থেকে বা কম্পিউটার থেকে নতুন ছবি আপলোড করে "তথ্য সংরক্ষণ করুন" এ ক্লিক করতে পারেন।</span>
                    )}
                  </div>

                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b pb-2.5">
                    <User className="w-4 h-4 text-pink-500" /> {lang === 'en' ? "Change Profile Details" : "প্রোফাইলের তথ্য পরিবর্তন করুন"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-normal">
                    <div className="form-group">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">{lang === 'en' ? "Full Name" : "কাস্টমার সম্পূর্ণ নাম"}</label>
                      <input 
                        type="text" 
                        className="w-full px-3.5 py-3 border rounded-xl font-extrabold text-slate-800 bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-100" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder={lang === 'en' ? "Enter your name" : "আপনার সম্পূর্ণ নাম টাইপ করুন"}
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">{lang === 'en' ? "Mobile Phone Number" : "কাস্টমার মোবাইল নাম্বার"}</label>
                      <input 
                        type="text" 
                        className="w-full px-3.5 py-3 border rounded-xl font-mono font-extrabold text-slate-800 bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-100" 
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX"
                      />
                    </div>
                    
                    <div className="form-group md:col-span-2">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">{lang === 'en' ? "Or select any avatar preset below" : "অথবা নিচের যেকোনো একটি অ্যাভাটার সিলেক্ট করুন"}</label>
                      <div className="flex flex-wrap gap-3 pt-1">
                        {[
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
                        ].map((url, idx) => (
                          <button 
                            key={url}
                            type="button"
                            onClick={() => setProfileAvatar(url)}
                            className={`w-11 h-11 rounded-full border-2 overflow-hidden transition-all relative ${profileAvatar === url ? 'border-pink-500 scale-110 shadow-md shadow-pink-500/20' : 'border-slate-150 hover:scale-105 hover:border-slate-300'}`}
                          >
                            <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group md:col-span-2">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">{lang === 'en' ? "Home Delivery Address" : "হোম ডেলিভারি ঠিকানা"}</label>
                      <textarea 
                        rows={2.5}
                        className="w-full px-3.5 py-3 border rounded-xl font-extrabold text-slate-700 bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-100 text-xs leading-relaxed" 
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        placeholder={lang === 'en' ? "Enter your detailed city/district, area, road and holding address" : "আপনার বাসা নং, রোড নং, থানা, জেলা সহ বিস্তারিত ডেলিভারি ঠিকানা দিন"}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-3.5 max-w-sm">
                    <button 
                      onClick={() => {
                        if (!profileName.trim() || !profilePhone.trim()) {
                          showNotif(lang === 'en' ? "Name and Phone number are required." : "নাম এবং মোবাইল নাম্বার প্রদান করুন।", "error");
                          return;
                        }
                        const phoneClean = profilePhone.trim();
                        if (phoneClean.length !== 11) {
                          showNotif(lang === 'en' ? "Mobile number must be exactly 11 digits." : "মোবাইল নাম্বার অবশ্যই ১১ ডিজিটের হতে হবে।", "error");
                          return;
                        }
                        const updated: Customer = {
                          ...loggedCustomer,
                          name: profileName,
                          phone: phoneClean,
                          address: profileAddress,
                          avatarUrl: profileAvatar
                        };
                        onUpdateCustomer(updated);
                        setIsEditingProfile(false);
                        showNotif(lang === 'en' ? "Profile details updated successfully!" : "শপার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!", "success");
                      }}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-black py-3 rounded-xl cursor-pointer shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4 shrink-0" /> {lang === 'en' ? "Save Details" : "তথ্য সংরক্ষণ করুন"}
                    </button>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-xl cursor-pointer transition-colors active:scale-95 text-xs text-[11px]"
                    >
                      {lang === 'en' ? "Cancel" : "বাতিল"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className={`${showStatement ? 'md:col-span-8' : 'md:col-span-12'} bg-slate-50/50 p-1 rounded-2xl border border-slate-100 text-xs transition-all`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      {/* Name segment */}
                      <div className="p-4 flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-xl shrink-0">
                          <User className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wider block">{lang === 'en' ? "Contact Name" : "পূর্ণ নাম"}</span>
                          <span className="font-extrabold text-slate-800 text-[13.5px] truncate block mt-0.5">{loggedCustomer.name}</span>
                        </div>
                      </div>

                      {/* Phone segment */}
                      <div className="p-4 flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-xl shrink-0">
                          <Phone className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wider block">{lang === 'en' ? "Active Phone" : "মোবাইল নাম্বার"}</span>
                          <span className="font-mono font-extrabold text-slate-800 text-[13.5px] truncate block mt-0.5">{loggedCustomer.phone}</span>
                        </div>
                      </div>

                      {/* Address segment */}
                      <div className="p-4 flex items-start gap-3">
                        <div className="p-2.5 bg-emerald-50 rounded-xl shrink-0 mt-0.5">
                          <MapPin className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wider block">{lang === 'en' ? "Delivery Address" : "ডেলিভারি ঠিকানা"}</span>
                          <span className="text-slate-600 font-extrabold text-[12px] leading-relaxed block mt-0.5 break-words line-clamp-2">
                            {loggedCustomer.address || <span className="text-slate-400 italic">{lang === 'en' ? "No saved delivery address" : "কোনো ঠিকানা সংরক্ষণ করা নেই"}</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {showStatement && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="md:col-span-4 bg-gradient-to-r from-indigo-50/20 to-pink-50/10 p-5 rounded-2xl border border-pink-100/50 flex flex-col justify-between shadow-3xs"
                    >
                      <div>
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider block mb-3 flex items-center gap-1.5 border-b pb-1.5 border-indigo-100/30">
                          <UserCheck className="w-4 h-4 text-pink-500" /> 
                          <span>{lang === 'en' ? "Dashboard Stats" : "অ্যাকাউন্ট রিপোর্ট"}</span>
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                            <p className="text-[9px] text-slate-400 font-black uppercase">{lang === 'en' ? "Total Purchases" : "মোট কেনাকাটা"}</p>
                            <p className="font-mono font-black text-pink-600 text-[15px] mt-1">৳{myOrders.reduce((s, o) => s + o.amount, 0)}</p>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                            <p className="text-[9px] text-slate-400 font-black uppercase">{lang === 'en' ? "Order Count" : "অর্ডার সংখ্যা"}</p>
                            <p className="font-mono font-black text-indigo-600 text-[15px] mt-1">{myOrders.length}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-[9.5px] text-slate-400 font-bold block pt-3 text-right">
                        {lang === 'en' ? "Status: Active today" : "লগইন স্ট্যাটাস: আজ সচল"}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
            
            {/* 2. BOTTOM MY ORDERS HUB */}
            <div className="bg-white rounded-none sm:rounded-[24px] border-0 sm:border sm:border-slate-100 shadow-none sm:shadow-xs p-4 sm:p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between font-sans border-b border-slate-100 pb-3">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
                  My Orders
                </h3>
                <button 
                  onClick={() => {
                    setShowMyOrdersPage(true);
                    setShowCustProfilePage(false);
                    setViewingProduct(null);
                    setSelectedCat(null);
                    setShowOnlyFavorites(false);
                    setShowCartPage(false);
                    setShowSupportPage(false);
                    setShowShopPage(false);
                    setShowResellerLandingPage(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-[11px] sm:text-xs text-slate-450 hover:text-pink-600 font-extrabold transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Daraz-Style Category Status Indicators (With beautiful responsive horizontal grid and count badges) */}
              <div className="grid grid-cols-4 gap-2 mb-6 pt-2 font-sans">
                {[
                  { 
                    id: 'to_pay', 
                    label: 'To Pay', 
                    icon: ShoppingCart, 
                    count: myOrders.filter(o => o.status === 'Pending').length 
                  },
                  { 
                    id: 'to_ship', 
                    label: 'To Ship', 
                    icon: Truck, 
                    count: myOrders.filter(o => o.status === 'Approved' || o.status === 'Processing' || o.status === 'Shipped').length 
                  },
                  { 
                    id: 'received', 
                    label: 'Received', 
                    icon: ShieldCheck, 
                    count: myOrders.filter(o => o.status === 'Delivered').length 
                  },
                  { 
                    id: 'cancelled', 
                    label: 'Return/Cancel', 
                    icon: X, 
                    count: myOrders.filter(o => o.status === 'Cancelled').length 
                  }
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeProfileTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveProfileTab(tab.id as any);
                        setEditingCustomerOrder(null);
                      }}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer group select-none ${isActive ? 'text-pink-600 scale-[1.03]' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                      {/* Icon Container with relative positioning for badge */}
                      <div className={`relative p-2.5 rounded-2xl transition-all border ${isActive ? 'bg-pink-100/70 border-pink-300 text-pink-600 shadow-2xs' : 'bg-slate-100 hover:bg-slate-200/90 border-slate-250 text-slate-700 shadow-3xs'}`}>
                        <IconComp className="w-5 h-5 font-bold" />
                        {tab.count > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white font-mono font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white leading-none min-w-[16px] h-[16px] flex items-center justify-center shadow-xs">
                            {tab.count}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-black mt-2 text-center leading-tight transition-all ${isActive ? 'text-pink-600 font-black' : 'text-slate-700 font-extrabold'}`}>
                        {t(tab.label)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Orders table & filter output container */}
              <div className="space-y-4">
                {/* Under editingOrder form */}
                {editingCustomerOrder ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4 text-xs"
                  >
                    <div className="flex justify-between items-center border-b pb-2 mb-1">
                      <h4 className="font-extrabold text-sm text-slate-800">Edit Order Shipping Details</h4>
                      <span className="font-mono text-[10px] font-bold text-slate-400">Order Ref: {editingCustomerOrder.id}</span>
                    </div>
                    
                    <div className="form-group">
                      <label className="text-[10px] text-zinc-400 font-extrabold uppercase block mb-1">Recipient Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border rounded-xl font-bold bg-white focus:outline-none focus:border-indigo-500" 
                        value={editOrderName}
                        onChange={(e) => setEditOrderName(e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="text-[10px] text-zinc-400 font-extrabold uppercase block mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border rounded-xl font-mono font-bold bg-white focus:outline-none focus:border-indigo-500" 
                        value={editOrderPhone}
                        onChange={(e) => setEditOrderPhone(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="text-[10px] text-zinc-400 font-extrabold uppercase block mb-1">Delivery Address</label>
                      <textarea 
                        rows={2}
                        className="w-full px-3 py-2 border rounded-xl font-medium bg-white focus:outline-none focus:border-indigo-500" 
                        value={editOrderAddress}
                        onChange={(e) => setEditOrderAddress(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => {
                          if (!editOrderName.trim() || !editOrderPhone.trim() || !editOrderAddress.trim()) {
                            showNotif("All fields are required.", "error");
                            return;
                          }
                          setOrders(prev => prev.map(o => {
                            if (o.id === editingCustomerOrder.id) {
                              return {
                                ...o,
                                custName: editOrderName,
                                custPhone: editOrderPhone,
                                custAddress: editOrderAddress,
                                timeline: [
                                  ...o.timeline,
                                  { status: o.status, date: new Date().toLocaleString(), description: 'Shipping details updated by customer.', isCompleted: true }
                                ]
                              };
                            }
                            return o;
                          }));
                          setEditingCustomerOrder(null);
                          showNotif("Order details updated successfully!", "success");
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl cursor-pointer"
                      >
                        Submit Corrected Details
                      </button>
                      <button 
                        onClick={() => setEditingCustomerOrder(null)}
                        className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  (() => {
                    const list = myOrders.filter(o => {
                      if (activeProfileTab === 'to_pay') return o.status === 'Pending';
                      if (activeProfileTab === 'to_ship') return o.status === 'Approved' || o.status === 'Processing' || o.status === 'Shipped';
                      if (activeProfileTab === 'received') return o.status === 'Delivered';
                      if (activeProfileTab === 'cancelled') return o.status === 'Cancelled';
                      return false;
                    });

                    if (list.length === 0) {
                      return (
                        <div className="text-center py-14 bg-slate-50 border border-slate-100 rounded-3xl animate-fade-in-up">
                          <Package className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                          <p className="text-slate-400 text-sm font-black uppercase tracking-wider">No matching active orders</p>
                          <p className="text-slate-400 text-[10px] font-bold mt-1 max-w-xs mx-auto">Items you submit, pay for, or cancel in the future will automatically reflect in this status group tab.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 gap-2 animate-fade-in-up font-sans">
                        {list.map((ord) => {
                          const canCancel = ord.status === 'Pending';
                          return (
                            <div key={ord.id} className="bg-white p-2.5 sm:p-3 border border-slate-100 hover:border-slate-200 rounded-xl hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs">
                              <div className="flex-1 flex items-center gap-2.5 min-w-0">
                                {ord.prodImg ? (
                                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-0.5 flex items-center justify-center shrink-0">
                                    <img src={ord.prodImg} alt={ord.productName} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-300">
                                    <Package className="w-4 h-4" />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[9px] font-mono font-black text-indigo-950 uppercase bg-slate-150/70 px-1 py-0.2 rounded leading-none">
                                      #{ord.id}
                                    </span>
                                    <span className={`text-[8.5px] font-black uppercase tracking-wide px-1.5 py-0.2 rounded-full border leading-tight ${
                                      ord.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                      ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-750 border-rose-200' :
                                      ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-pink-50 text-pink-700 border-pink-150'
                                    }`}>
                                      {ord.status}
                                    </span>
                                  </div>

                                  <p className="font-extrabold text-slate-800 truncate text-[11px] leading-tight" title={ord.productName}>
                                    {ord.productName}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-400 font-semibold leading-none">
                                    {ord.color && <span className="text-slate-500 font-bold">Finish: {ord.color}</span>}
                                    <span>Qty: <b className="text-slate-600">{ord.qty}</b></span>
                                    <span>•</span>
                                    <span>Cost: <b className="text-pink-600 font-mono">৳{ord.amount}</b></span>
                                    <span>•</span>
                                    <span className="font-mono text-[8.5px]">{ord.date}</span>
                                  </div>

                                  <div className="text-[9px] text-slate-500 font-normal truncate mt-0.5">
                                    <span className="text-slate-400 font-black uppercase text-[8px]">Send:</span> <b>{ord.custName}</b> ({ord.custPhone}) <span className="text-slate-400">• {ord.custAddress}</span>
                                  </div>

                                  {ord.advancePaid && ord.advancePaid > 0 ? (
                                    <div className="text-emerald-600 font-black text-[8.5px] uppercase tracking-wider flex items-center gap-1 leading-none mt-0.5">
                                      <span className="w-0.5 h-0.5 rounded-full bg-emerald-500"></span>
                                      ADV: ৳{ord.advancePaid} ({ord.paymentMethod})
                                    </div>
                                  ) : null}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 border-dashed">
                                <button 
                                  onClick={() => handleOrderAgain(ord)}
                                  className="bg-pink-600 hover:bg-pink-700 text-white font-black px-2.5 py-1.5 rounded-lg text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
                                >
                                  <ShoppingBag className="w-2.5 h-2.5" /> {t("Again")}
                                </button>

                                {ord.status !== 'Cancelled' && (
                                  <button 
                                    onClick={() => handleTrackQuickSearch(ord.trackingId)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-250 font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-3xs"
                                  >
                                    <Truck className="w-2.5 h-2.5 text-slate-500" /> {t("Track")}
                                  </button>
                                )}

                                {canCancel ? (
                                  orderIdToCancel === ord.id ? (
                                    <div className="flex items-center gap-1 bg-rose-50 border border-rose-150 px-1.5 py-1 rounded-lg text-[9.5px] font-bold">
                                      <span className="text-rose-700 animate-pulse text-[8px] uppercase font-black">{t("Cancel")}?</span>
                                      <button
                                        onClick={() => {
                                          setOrders(prev => prev.map(o => {
                                            if (o.id === ord.id) {
                                              return {
                                                ...o,
                                                status: 'Cancelled' as OrderStatus,
                                                timeline: [
                                                  ...o.timeline,
                                                  { status: 'Cancelled', date: new Date().toLocaleString(), description: 'Cancelled by customer.', isCompleted: true }
                                                ]
                                              };
                                            }
                                            return o;
                                          }));
                                          showNotif("Order cancelled successfully.", "success");
                                          setOrderIdToCancel(null);
                                        }}
                                        className="bg-rose-600 hover:bg-rose-750 text-white px-1.5 py-0.5 rounded text-[8px] uppercase font-black cursor-pointer"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={() => setOrderIdToCancel(null)}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-1 py-0.5 rounded text-[8px] font-black uppercase cursor-pointer"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setOrderIdToCancel(ord.id)}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300 font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase"
                                    >
                                      {t("Cancel")}
                                    </button>
                                  )
                                ) : (
                                  ord.status !== 'Cancelled' && (
                                    <span className="text-[9px] text-emerald-700 font-extrabold uppercase px-2 py-1 bg-emerald-50 border border-emerald-150 rounded-lg flex items-center gap-1 select-none">
                                      <Check className="w-2.5 h-2.5 text-emerald-600 font-bold" /> Done
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </main>
      ) : showMyOrdersPage && loggedCustomer ? (
        <main className="flex-1 max-w-4xl mx-auto w-full px-0 sm:px-3 py-0 sm:py-8 animate-fade-in text-slate-800 pb-28 md:pb-12">
          <div className="bg-white rounded-none sm:rounded-[24px] border-0 sm:border sm:border-slate-100 shadow-none sm:shadow-xs p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Top design highlight stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-indigo-500 to-amber-400" />
            
            {/* Sub-header inside My Orders screen */}
            <div className="mb-6 flex items-center justify-between font-sans border-b border-slate-100 pb-3 mt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowMyOrdersPage(false);
                    setShowCustProfilePage(true);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Back to Profile"
                >
                  <ChevronLeft className="w-5 h-5 font-bold" />
                </button>
                <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                  {lang === 'en' ? "My Orders" : "আমার অর্ডারসমূহ"}
                </h3>
              </div>
              <span className="text-[10px] sm:text-xs font-mono bg-pink-50 text-pink-600 px-2.5 py-1 rounded-full font-black border border-pink-100 shadow-3xs uppercase">
                {myOrders.length} {lang === 'en' ? "Total Orders" : "টি মোট অর্ডার"}
              </span>
            </div>

            {/* Daraz-Style Category Status Indicators (With beautiful responsive horizontal grid and count badges) */}
            <div className="grid grid-cols-4 gap-2 mb-6 pt-2 font-sans">
              {[
                { 
                  id: 'to_pay', 
                  label: 'To Pay', 
                  icon: ShoppingCart, 
                  count: myOrders.filter(o => o.status === 'Pending').length 
                },
                { 
                  id: 'to_ship', 
                  label: 'To Ship', 
                  icon: Truck, 
                  count: myOrders.filter(o => o.status === 'Approved' || o.status === 'Processing' || o.status === 'Shipped').length 
                },
                { 
                  id: 'received', 
                  label: 'Received', 
                  icon: ShieldCheck, 
                  count: myOrders.filter(o => o.status === 'Delivered').length 
                },
                { 
                  id: 'cancelled', 
                  label: 'Return/Cancel', 
                  icon: X, 
                  count: myOrders.filter(o => o.status === 'Cancelled').length 
                }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeProfileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveProfileTab(tab.id as any);
                      setEditingCustomerOrder(null);
                    }}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer group select-none ${isActive ? 'text-pink-600 scale-[1.03]' : 'text-slate-400 hover:text-slate-705'}`}
                  >
                    {/* Icon Container with relative positioning for badge */}
                    <div className={`relative p-2.5 rounded-2xl transition-all border ${isActive ? 'bg-pink-100/70 border-pink-300 text-pink-600 shadow-2xs' : 'bg-slate-100 hover:bg-slate-200/90 border-slate-250 text-slate-700 shadow-3xs'}`}>
                      <IconComp className="w-5 h-5 font-bold" />
                      {tab.count > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white font-mono font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white leading-none min-w-[16px] h-[16px] flex items-center justify-center shadow-xs">
                          {tab.count}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-black mt-2 text-center leading-tight transition-all ${isActive ? 'text-pink-600 font-black' : 'text-slate-700 font-extrabold'}`}>
                      {t(tab.label)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orders list outputs */}
            <div className="space-y-4">
              {editingCustomerOrder ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4 text-xs"
                >
                  <div className="flex justify-between items-center border-b pb-2 mb-1">
                    <h4 className="font-extrabold text-sm text-slate-850">Edit Order Shipping Details</h4>
                    <span className="font-mono text-[10px] font-bold text-slate-400">Order Ref: {editingCustomerOrder.id}</span>
                  </div>
                  
                  <div className="form-group">
                    <label className="text-[10px] text-zinc-400 font-extrabold uppercase block mb-1">Recipient Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-xl font-bold bg-white focus:outline-none focus:border-indigo-500" 
                      value={editOrderName}
                      onChange={(e) => setEditOrderName(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="text-[10px] text-zinc-400 font-extrabold uppercase block mb-1">Contact Phone</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold bg-white focus:outline-none focus:border-indigo-500" 
                      value={editOrderPhone}
                      onChange={(e) => setEditOrderPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="text-[10px] text-zinc-400 font-extrabold uppercase block mb-1">Delivery Address</label>
                    <textarea 
                      rows={2}
                      className="w-full px-3 py-2 border rounded-xl font-medium bg-white focus:outline-none focus:border-indigo-500" 
                      value={editOrderAddress}
                      onChange={(e) => setEditOrderAddress(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => {
                        if (!editOrderName.trim() || !editOrderPhone.trim() || !editOrderAddress.trim()) {
                          showNotif("All fields are required.", "error");
                          return;
                        }
                        setOrders(prev => prev.map(o => {
                          if (o.id === editingCustomerOrder.id) {
                            return {
                              ...o,
                              custName: editOrderName,
                              custPhone: editOrderPhone,
                              custAddress: editOrderAddress,
                              timeline: [
                                ...o.timeline,
                                { status: o.status, date: new Date().toLocaleString(), description: 'Shipping details updated by customer.', isCompleted: true }
                              ]
                            };
                          }
                          return o;
                        }));
                        setEditingCustomerOrder(null);
                        showNotif("Order details updated successfully!", "success");
                      }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl cursor-pointer"
                    >
                      Submit Corrected Details
                    </button>
                    <button 
                      onClick={() => setEditingCustomerOrder(null)}
                      className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                (() => {
                  const list = myOrders.filter(o => {
                    if (activeProfileTab === 'to_pay') return o.status === 'Pending';
                    if (activeProfileTab === 'to_ship') return o.status === 'Approved' || o.status === 'Processing' || o.status === 'Shipped';
                    if (activeProfileTab === 'received') return o.status === 'Delivered';
                    if (activeProfileTab === 'cancelled') return o.status === 'Cancelled';
                    return false;
                  });

                  if (list.length === 0) {
                    return (
                      <div className="text-center py-14 bg-slate-50 border border-slate-100 rounded-3xl animate-fade-in-up">
                        <Package className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm font-black uppercase tracking-wider">No matching active orders</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1 max-w-xs mx-auto">Items you submit, pay for, or cancel in the future will automatically reflect in this status group tab.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 gap-2 animate-fade-in-up font-sans">
                      {list.map((ord) => {
                        const canCancel = ord.status === 'Pending';
                        return (
                          <div key={ord.id} className="bg-white p-2.5 sm:p-3 border border-slate-150 hover:border-slate-200 rounded-xl hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs">
                            <div className="flex-1 flex items-center gap-2.5 min-w-0">
                              {ord.prodImg ? (
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-0.5 flex items-center justify-center shrink-0">
                                  <img src={ord.prodImg} alt={ord.productName} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-300">
                                  <Package className="w-4 h-4" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] font-mono font-black text-indigo-950 uppercase bg-slate-150/70 px-1 py-0.2 rounded leading-none">
                                    #{ord.id}
                                  </span>
                                  <span className={`text-[8.5px] font-black uppercase tracking-wide px-1.5 py-0.2 rounded-full border leading-tight ${
                                    ord.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-750 border-rose-200' :
                                    ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-705 border-emerald-200' : 'bg-pink-50 text-pink-700 border-pink-150'
                                  }`}>
                                    {ord.status}
                                  </span>
                                </div>

                                <p className="font-extrabold text-slate-850 truncate text-[11px] leading-tight" title={ord.productName}>
                                  {ord.productName}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-400 font-semibold leading-none">
                                  {ord.color && <span className="text-slate-500 font-bold">Finish: {ord.color}</span>}
                                  <span>Qty: <b className="text-slate-600">{ord.qty}</b></span>
                                  <span>•</span>
                                  <span>Cost: <b className="text-pink-600 font-mono">৳{ord.amount}</b></span>
                                  <span>•</span>
                                  <span className="font-mono text-[8.5px]">{ord.date}</span>
                                </div>

                                <div className="text-[9px] text-slate-500 font-normal truncate mt-0.5">
                                  <span className="text-slate-400 font-black uppercase text-[8px]">Send:</span> <b>{ord.custName}</b> ({ord.custPhone}) <span className="text-slate-400">• {ord.custAddress}</span>
                                </div>

                                {ord.advancePaid && ord.advancePaid > 0 ? (
                                  <div className="text-emerald-600 font-black text-[8.5px] uppercase tracking-wider flex items-center gap-1 leading-none mt-0.5">
                                    <span className="w-0.5 h-0.5 rounded-full bg-emerald-500 font-bold"></span>
                                    ADV: ৳{ord.advancePaid} ({ord.paymentMethod})
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 border-dashed">
                              <button 
                                onClick={() => handleOrderAgain(ord)}
                                className="bg-pink-600 hover:bg-pink-700 text-white font-black px-2.5 py-1.5 rounded-lg text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
                              >
                                <ShoppingBag className="w-2.5 h-2.5" /> {t("Again")}
                              </button>

                              {ord.status !== 'Cancelled' && (
                                <button 
                                  onClick={() => handleTrackQuickSearch(ord.trackingId)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-850 border border-slate-250 font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-3xs"
                                >
                                  <Truck className="w-2.5 h-2.5 text-slate-500" /> {t("Track")}
                                </button>
                              )}

                              {canCancel ? (
                                orderIdToCancel === ord.id ? (
                                  <div className="flex items-center gap-1 bg-rose-50 border border-rose-150 px-1.5 py-1 rounded-lg text-[9.5px] font-bold">
                                    <span className="text-rose-700 animate-pulse text-[8px] uppercase font-black">{t("Cancel")}?</span>
                                    <button
                                      onClick={() => {
                                        setOrders(prev => prev.map(o => {
                                          if (o.id === ord.id) {
                                            return {
                                              ...o,
                                              status: 'Cancelled' as OrderStatus,
                                              timeline: [
                                                ...o.timeline,
                                                { status: 'Cancelled', date: new Date().toLocaleString(), description: 'Cancelled by customer.', isCompleted: true }
                                              ]
                                            };
                                          }
                                          return o;
                                        }));
                                        showNotif("Order cancelled successfully.", "success");
                                        setOrderIdToCancel(null);
                                      }}
                                      className="bg-rose-600 hover:bg-rose-750 text-white px-1.5 py-0.5 rounded text-[8px] uppercase font-black cursor-pointer"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() => setOrderIdToCancel(null)}
                                      className="bg-slate-205 hover:bg-slate-300 text-slate-705 px-1 py-0.5 rounded text-[8px] font-black uppercase cursor-pointer"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setOrderIdToCancel(ord.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300 font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer"
                                  >
                                    {t("Cancel")}
                                  </button>
                                )
                              ) : (
                                ord.status !== 'Cancelled' && (
                                  <span className="text-[9px] text-emerald-705 font-extrabold uppercase px-2 py-1 bg-emerald-50 border border-emerald-150 rounded-lg flex items-center gap-1 select-none animate-bounce">
                                    <Check className="w-2.5 h-2.5 text-emerald-600 font-bold" /> Done
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </main>
      ) : showOnlyFavorites ? (
        <main className="flex-1 max-w-2xl mx-auto w-full px-0 sm:px-3 py-0 sm:py-8 animate-fade-in text-slate-800 pb-28 md:pb-12">
          <div className="bg-white rounded-none sm:rounded-[24px] border-0 sm:border sm:border-slate-100 shadow-none sm:shadow-xs p-4 sm:p-6 relative overflow-hidden">
            {/* Soft pink highlight indicator at the top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
            
            {(() => {
              const favProducts = products.filter(p => favorites.includes(p.id));
              if (favProducts.length === 0) {
                return (
                  <div className="text-center py-12 px-4">
                    <Heart className="w-10 h-10 text-slate-350 mx-auto mb-3" />
                    <p className="text-slate-600 font-extrabold text-xs sm:text-sm">Your Favorite list is empty.</p>
                    <p className="text-slate-400 text-[11px] mt-1">Found something you love? Tap the heart icon to save it here!</p>
                    <button 
                      onClick={goHome} 
                      className="mt-5 bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-black px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Browse Store Catalog
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-tight text-slate-500">
                      Saved Items ({favProducts.length})
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to clear all favorites?")) {
                          setFavorites([]);
                          showNotif("Favorites cleared!", "success");
                        }
                      }}
                      className="text-[10px] font-black uppercase text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {favProducts.map(prod => {
                      return (
                        <div key={prod.id} className="py-4 flex gap-3 sm:gap-4 items-center justify-between first:pt-0 last:pb-0">
                          <div 
                            onClick={() => {
                              setViewingProduct(prod);
                              setQty(1);
                              setSelectedColor(prod.colors[0] || '');
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="flex gap-3 hover:opacity-85 transition-opacity cursor-pointer text-left flex-1"
                          >
                            <img 
                              src={prod.img || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&q=80"} 
                              alt={prod.name} 
                              className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl bg-slate-50 border border-slate-205 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-1 my-auto">
                              <h4 className="font-extrabold text-xs sm:text-xs text-slate-800 line-clamp-1 leading-tight sm:leading-snug">{prod.name}</h4>
                              <p className="text-[10px] font-mono text-pink-500 font-bold">
                                ৳{prod.discountPrice} {prod.originalPrice > prod.discountPrice && <span className="line-through text-slate-350 text-[9px] ml-1">৳{prod.originalPrice}</span>}
                              </p>
                              <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${prod.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                {prod.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            {prod.inStock ? (
                              <button
                                onClick={() => {
                                  const alreadyInCart = cart.find(item => item.product.id === prod.id);
                                  if (alreadyInCart) {
                                    setCart(prev => prev.map(item => item.product.id === prod.id ? { ...item, qty: item.qty + 1 } : item));
                                  } else {
                                    setCart(prev => [...prev, {
                                      product: prod,
                                      qty: 1,
                                      color: prod.colors[0] || '',
                                      cartId: 'cart_' + Date.now() + Math.random().toString(36).substr(2, 4)
                                    }]);
                                  }
                                  showNotif(`${prod.name} added to cart!`, "success");
                                }}
                                className="bg-pink-50 hover:bg-pink-100 text-pink-500 border border-pink-100 text-[10px] font-black px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Add</span>
                              </button>
                            ) : null}
                            <button
                              onClick={() => {
                                setFavorites(prev => prev.filter(fid => fid !== prod.id));
                                showNotif("Product removed from favorites.", "error");
                              }}
                              className="text-slate-400 hover:text-red-500 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-lg cursor-pointer transition-all"
                              title="Delete Favorite Item"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </main>
      ) : showCartPage ? (
        <main className="flex-1 max-w-2xl mx-auto w-full px-0 sm:px-3 py-0 sm:py-8 animate-fade-in text-slate-800 pb-28 md:pb-12">
          <div className="bg-white rounded-none sm:rounded-[24px] border-0 sm:border sm:border-slate-100/80 shadow-none sm:shadow-xs p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-pink-500" />

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-extrabold text-xs sm:text-sm">Your shopping cart is empty.</p>
                <p className="text-slate-400 text-[11px] mt-1">Check out our trending collections and find amazing deals!</p>
                <button 
                  onClick={goHome} 
                  className="mt-5 bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-black px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Browse Store Catalog
                </button>
              </div>
            ) : isCheckingOut ? (
              /* CHECKOUT STEP VIEW OWNER BY CUSTOMER DETAILS FORM */
              <div className="space-y-4 animate-fade-in text-xs font-semibold text-slate-800">
                {(() => {
                  const matchedDistrict = deliveryCharges.find(dc => dc.id === checkoutDistrictId);
                  const deliveryCostAmount = matchedDistrict ? matchedDistrict.charge : 0;
                  const finalTotalSum = Math.max(0, cartSubtotal - promoDiscountAmount) + deliveryCostAmount;

                  let totalAdvanceRequired = 0;
                  if (advanceConfig && advanceConfig.requireAdvance) {
                    if (advanceConfig.amountType === 'delivery') {
                      totalAdvanceRequired = deliveryCostAmount;
                    } else {
                      totalAdvanceRequired = advanceConfig.fixedAmount || 0;
                    }
                  } else {
                    totalAdvanceRequired = selectedCartItems.reduce((sum, item) => {
                      if (item.product.requireAdvance) {
                        return sum + (item.product.advanceAmount || 0) * item.qty;
                      }
                      return sum;
                    }, 0);
                  }

                  const isAdvanceEnabled = totalAdvanceRequired > 0;
                  const activeChannels = advanceConfig.channels ? advanceConfig.channels.filter(c => c.isActive) : [];

                  if (!clickedPayToConfirm) {
                    /* ========================================================== */
                    /*   STAGE 1: SHIPPING DETAILS & ORDER SUMMARY                  */
                    /* ========================================================== */
                    return (
                      <div className="space-y-6">
                        {/* Header Banner */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-1">
                          <button 
                            type="button"
                            onClick={() => setIsCheckingOut(false)}
                            className="p-1 px-3 hover:bg-slate-50 text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg text-[10px] font-black cursor-pointer transition-all flex items-center gap-1 uppercase"
                          >
                            ← {lang === 'en' ? 'Back to Cart' : 'কার্টে ফিরে যান'}
                          </button>
                          <h4 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                            {lang === 'en' ? 'Secure Checkout (Step 1 of 2)' : 'নিরাপদ চেকআউট (ধাপ ১/২)'}
                          </h4>
                        </div>

                        {/* Two Column Layout on Desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          {/* Left Column: Shipping Form (7 cols) */}
                          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-150/80 shadow-3xs space-y-4">
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2.5 border-slate-100">
                              <MapPin className="w-4 h-4 text-pink-500 shrink-0" /> 
                              {lang === 'en' ? 'Shipping & Delivery Address' : 'শিপিং ও কুরিয়ার ঠিকানা'}
                            </h4>

                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                                    {lang === 'en' ? 'Customer Name' : 'গ্রাহকের নাম'} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <input 
                                      type="text" 
                                      disabled={isProfileMode}
                                      className={`w-full font-semibold border rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-400 focus:border-pink-400 focus:outline-none transition-all ${
                                        isProfileMode 
                                          ? 'bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed font-medium' 
                                          : 'bg-white border-slate-250 text-slate-800 shadow-3xs'
                                      }`}
                                      placeholder={lang === 'en' ? "Enter recipient name" : "অর্ডার রিসিভারের নাম লিখুন"}
                                      value={currentName}
                                      onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })}
                                    />
                                    {isProfileMode && (
                                      <span className="absolute right-3 top-2.5 text-[9px] bg-green-50 text-green-600 border border-green-250/50 rounded-md px-1.5 py-0.5 leading-none font-bold">
                                        ✓ Profile
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                                    {lang === 'en' ? 'Phone Number' : 'মোবাইল নম্বর'} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <input 
                                      type="tel" 
                                      disabled={isProfileMode}
                                      className={`w-full font-semibold border rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-400 focus:border-pink-400 focus:outline-none transition-all ${
                                        isProfileMode 
                                          ? 'bg-slate-50 text-slate-500 border-slate-205 cursor-not-allowed font-medium' 
                                          : 'bg-white border-slate-250 text-slate-800 shadow-3xs'
                                      }`}
                                      placeholder={lang === 'en' ? "e.g. 017XXXXXXXX" : "যেমন: ০১৭xxxxxxxx"}
                                      value={currentPhone}
                                      onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                                    />
                                    {isProfileMode && (
                                      <span className="absolute right-3 top-2.5 text-[9px] bg-green-50 text-green-600 border border-green-250/50 rounded-md px-1.5 py-0.5 leading-none font-bold">
                                        ✓ Verified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Selecting district auto adds dynamic delivery charge */}
                              <div>
                                <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                                  {lang === 'en' ? 'Select Delivery Region/District' : 'ডেলিভারি জেলা/এলাকা নির্বাচন করুন'} <span className="text-red-500">*</span>
                                </label>
                                <select 
                                  value={checkoutDistrictId}
                                  onChange={(e) => setCheckoutDistrictId(e.target.value)}
                                  className="w-full bg-white border border-slate-250 rounded-xl p-2.5 font-bold text-xs text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-pink-400 focus:border-pink-400 shadow-3xs"
                                >
                                  <option value="">{lang === 'en' ? '-- Choose Location --' : '-- জেলা বা অঞ্চল নির্বাচন করুন --'}</option>
                                  {deliveryCharges.map(dc => (
                                    <option key={dc.id} value={dc.id}>{dc.district} ({lang === 'en' ? 'Delivery Fee' : 'ডেলিভারি চার্জ'}: ৳{dc.charge})</option>
                                  ))}
                                </select>

                                {/* Dynamic Charge visualizer badge */}
                                {checkoutDistrictId ? (
                                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-pink-700 bg-pink-50/40 p-3 rounded-xl border border-pink-100/40 animate-fade-in">
                                    <span className="flex items-center gap-1.5">
                                      <Truck className="w-4.5 h-4.5 text-pink-500 shrink-0" />
                                      {lang === 'en' ? 'Selected Area Delivery Fee:' : 'আপনার নির্বাচিত এলাকার কুরিয়ার চার্জ:'}
                                    </span>
                                    <span className="text-sm font-black text-pink-600">
                                      ৳ {deliveryCharges.find(dc => dc.id === checkoutDistrictId)?.charge || 0}
                                    </span>
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-slate-400 font-bold mt-1.5 leading-normal italic">
                                    {lang === 'en' 
                                      ? '* Select district to automatically calculate real-time home delivery fee.' 
                                      : '* কুরিয়ার চার্জ হিসাব ও ডেলিভারি সঠিকভাবে নির্ধারণ করতে জেলা নির্বাচন করুন।'}
                                  </p>
                                )}
                              </div>

                              {/* Detailed location details */}
                              <div>
                                <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                                  {lang === 'en' ? 'Full Courier Address' : 'বিস্তারিত কুরিয়ার ঠিকানা'} <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                  rows={2} 
                                  disabled={isProfileMode}
                                  className={`w-full font-semibold border rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-400 focus:border-pink-400 focus:outline-none leading-snug transition-all ${
                                    isProfileMode 
                                      ? 'bg-slate-50 text-slate-500 border-slate-205 cursor-not-allowed font-medium' 
                                      : 'bg-white border-slate-250 text-slate-800 shadow-3xs'
                                  }`}
                                  placeholder={lang === 'en' 
                                    ? "e.g. Area, House No, Road, Ward No, Police Station" 
                                    : "যেমন: হাউজ নং, রোড নং, থানা, উপ-জেলা ও জেলা"}
                                  value={currentAddress}
                                  onChange={(e) => setGuestDetails({ ...guestDetails, address: e.target.value })}
                                />
                              </div>
                            </div>

                            {/* Tickbox Options */}
                            {loggedCustomer ? (
                              <div className="pt-3 border-t border-slate-100 flex items-center">
                                <label className="relative flex items-center gap-2 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    className="peer sr-only"
                                    checked={useProfileInfo}
                                    onChange={(e) => handleToggleUseProfileInfo(e.target.checked)}
                                  />
                                  <div className="w-4 h-4 rounded border border-slate-300 bg-white peer-checked:bg-pink-500 peer-checked:border-pink-500 flex items-center justify-center transition-all">
                                    <svg className="w-2.5 h-2.5 text-white stroke-[3.5] stroke-current" fill="none" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                  <span className="text-[11px] font-extrabold text-slate-700 select-none group-hover:text-slate-900 transition-colors">
                                    {lang === 'en' ? 'Use my profile information' : 'আমার অ্যাকাউন্ট প্রোফাইলের তথ্য ব্যবহার করুন'}
                                  </span>
                                </label>
                              </div>
                            ) : (
                              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                                <Lock className="w-3 h-3 text-slate-300" />
                                {lang === 'en' 
                                  ? 'Logging in allows you to autofill checkout details from saved profile.' 
                                  : 'লগইন থাকলে আপনার প্রোফাইল থেকে এই ফর্মটি স্বয়ংক্রিয়ভাবে পূরণ হতো।'}
                              </div>
                            )}
                          </div>

                          {/* Right Column: Order Summary & Invoiced total (5 cols) */}
                          <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-3xs space-y-4">
                              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider border-b pb-2.5 border-slate-100 flex items-center justify-between">
                                <span>{lang === 'en' ? 'Order Items' : 'অর্ডারকৃত পণ্য'}</span>
                                <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 leading-none">{selectedCartItems.length} items</span>
                              </h4>

                              <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                                {selectedCartItems.map(item => (
                                  <div key={item.cartId} className="flex gap-2.5 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <img src={item.product.img} className="w-8 h-8 rounded object-cover border bg-white shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <span className="block text-[11px] font-bold text-slate-800 truncate">{item.product.name}</span>
                                      <span className="block text-[10px] text-slate-400 font-bold font-mono">Qty: {item.qty} {item.color && `| Color: ${item.color}`}</span>
                                    </div>
                                    <span className="font-mono text-slate-705 text-xs font-black">৳{item.product.discountPrice * item.qty}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Promo Code Apply Section */}
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">
                                  {lang === 'en' ? 'Have a Promo Code?' : 'প্রোমো কোড আছে কি?'}
                                </label>
                                {appliedPromo ? (
                                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-xs animate-fade-in text-[11px] font-bold">
                                    <span className="font-extrabold text-emerald-800 flex items-center gap-1.2 font-mono font-bold leading-none">
                                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      {appliedPromo.code} (-৳{promoDiscountAmount})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={handleRemovePromoCode}
                                      className="text-red-500 hover:text-red-700 font-extrabold focus:outline-none p-0.5 cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={promoCodeInput}
                                      onChange={(e) => setPromoCodeInput(e.target.value)}
                                      placeholder={lang === 'en' ? "e.g. FLASH100" : "যেমন: FLASH100"}
                                      className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                                    />
                                    <button
                                      type="button"
                                      onClick={handleApplyPromoCode}
                                      className="bg-pink-500 hover:bg-pink-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer transition-colors"
                                    >
                                      {lang === 'en' ? 'Apply' : 'প্রয়োগ'}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Billing invoice breakdowns */}
                              <div className="space-y-1.5 pt-1 text-[11px] text-slate-500 font-bold border-t border-slate-100">
                                <div className="flex justify-between items-center text-[11.5px]">
                                  <span>{lang === 'en' ? 'Merchandise Subtotal' : 'পণ্যের সাবটোটাল'}</span>
                                  <span className="font-extrabold text-slate-805">৳ {cartSubtotal}</span>
                                </div>
                                {promoDiscountAmount > 0 && (
                                  <div className="flex justify-between items-center text-emerald-600 animate-fade-in">
                                    <span className="flex items-center gap-1 font-bold">
                                      <Tag className="w-3.5 h-3.5 shrink-0" />
                                      {lang === 'en' ? 'Discount Code:' : 'ডিসকাউন্ট কোড:'}
                                    </span>
                                    <span className="font-mono font-extrabold">-৳ {promoDiscountAmount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <span>{lang === 'en' ? 'Courier Shipping Cost' : 'কুরিয়ার ও ডেলিভারি ফি'}</span>
                                  <span className="font-extrabold text-pink-650">৳ {deliveryCostAmount}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm border-t border-dashed border-slate-200 pt-2 text-slate-900 font-extrabold mt-2">
                                  <span className="text-slate-805 uppercase tracking-wide text-[10px] font-black">{lang === 'en' ? 'Total Invoice Amount' : 'সর্বমোট ইনভয়েস বিল'}</span>
                                  <span className="text-[#f85606] text-sm sm:text-base font-black">৳ {finalTotalSum}</span>
                                </div>
                              </div>

                              {/* PROCEED TO PAY ORANGE ACTION BUTTON */}
                              <div className="pt-2">
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (!currentName.trim() || !currentPhone.trim() || !currentAddress.trim()) {
                                      showNotif(lang === 'en' ? "Please complete recipient name, mobile number, and address." : "অনুগ্রহ করে নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন।", "error");
                                      return;
                                    }
                                    if (!checkoutDistrictId) {
                                      showNotif(lang === 'en' ? "Please select a Delivery District Region first." : "অনুগ্রহ করে ডেলিভারি এলাকা বা জেলা নির্বাচন করুন।", "error");
                                      return;
                                    }
                                    setClickedPayToConfirm(true);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                    showNotif(lang === 'en' ? "Payment gateway loaded. Select your method securely." : "পেমেন্ট মাধ্যমসমূহ লোড হয়েছে। অনুগ্রহ করে আপনার পেমেন্ট মাধ্যমটি নির্বাচন করুন।", "success");
                                  }}
                                  className="w-full bg-[#f85606] hover:bg-[#d04600] text-white font-extrabold py-3 px-5 rounded-xl flex items-center justify-between text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer"
                                >
                                  <span>{lang === 'en' ? 'Proceed to Pay' : 'পেমেন্ট করুন'}</span>
                                  <span className="font-mono font-black text-sm text-amber-100">৳ {finalTotalSum}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    /* ========================================================== */
                    /*   STAGE 2: SELECT PAYMENT METHOD (PRECISE SCREEN REPLICA)    */
                    /* ========================================================== */
                    return (
                      <div className="space-y-4 max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in font-sans">
                        
                        {/* Header Title & Close Button X */}
                        <div className="flex items-center justify-between border-b pb-2 mb-2">
                          <button 
                            type="button"
                            onClick={() => setClickedPayToConfirm(false)}
                            className="bg-slate-50 hover:bg-slate-100 border text-slate-600 font-extrabold text-[10px] px-2.5 py-1 rounded bg-white hover:bg-slate-50"
                          >
                            ← Back
                          </button>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 text-center flex-1 select-none font-display">
                            Select Payment Method
                          </h3>
                          <button 
                            onClick={() => setClickedPayToConfirm(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex items-center justify-center"
                          >
                            <X className="w-5 h-5 shrink-0" />
                          </button>
                        </div>

                        {/* Light-blue Banner Alert Notification */}
                        <div className="bg-blue-50/70 border border-blue-250/30 text-[#0066cc] p-3 rounded-xl flex items-start gap-2.5 text-[10.5px] font-bold leading-normal">
                          <Info className="w-4 h-4 text-[#0066cc] shrink-0 mt-0.5" />
                          <span>Collect payment voucher & get extra savings on your purchase!</span>
                        </div>

                        {/* Recommended Method Container */}
                        <div className="space-y-2 mt-4">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider select-none">
                            Recommended method(s)
                          </p>
                          <button 
                            type="button"
                            onClick={() => {
                              setCheckoutPaymentMethod('Card');
                              showNotif("CreditCard selected.", "success");
                            }}
                            className={`w-full bg-white border rounded-xl p-3 flex items-center justify-between gap-3 text-left transition-all hover:bg-slate-50 cursor-pointer ${
                              checkoutPaymentMethod === 'Card' ? 'border-pink-500 bg-pink-100/10 ring-1 ring-pink-500' : 'border-slate-150'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <CreditCard className="w-4.5 h-4.5" />
                              </div>
                              <div>
                                <span className="block text-[11.5px] font-black text-slate-800">Credit/Debit Card</span>
                                <span className="block text-[9.5px] text-slate-400 font-bold font-mono">Credit/Debit Card</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] uppercase font-bold text-slate-400 bg-slate-50 px-1 rounded border leading-none py-0.5">Visa / MC</span>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </button>
                        </div>

                        {/* Other Payment Methods List Container */}
                        <div className="space-y-2.5 mt-4">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider select-none">
                            Other Payment Methods
                          </p>

                          <div className="divide-y divide-slate-150 border border-slate-150 rounded-xl overflow-hidden shadow-3xs">
                            
                            {/* bKash Selection Item */}
                            <button 
                              type="button"
                              onClick={() => {
                                setCheckoutPaymentMethod('bKash');
                                setCheckoutTxId('');
                              }}
                              className={`w-full bg-white p-3.5 flex items-center justify-between gap-3 text-left transition-all hover:bg-slate-100/30 cursor-pointer ${
                                checkoutPaymentMethod === 'bKash' ? 'bg-pink-100/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center font-black shrink-0 shadow-3xs border border-pink-400 text-xs">
                                  bK
                                </div>
                                <div>
                                  <span className="block text-[11.5px] font-black text-slate-800">Save bKash Account</span>
                                  <span className="block text-[9.5px] text-slate-400 font-bold select-none">Bkash instant personal account validation</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {checkoutPaymentMethod === 'bKash' && <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </button>

                            {/* Nagad Selection Item */}
                            <button 
                              type="button"
                              onClick={() => {
                                setCheckoutPaymentMethod('Nagad');
                                setCheckoutTxId('');
                              }}
                              className={`w-full bg-white p-3.5 flex items-center justify-between gap-3 text-left transition-all hover:bg-slate-100/30 cursor-pointer ${
                                checkoutPaymentMethod === 'Nagad' ? 'bg-orange-100/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0 shadow-3xs border border-orange-400 text-xs text-orange-100">
                                  Ng
                                </div>
                                <div>
                                  <span className="block text-[11.5px] font-black text-slate-800">Nagad Pay</span>
                                  <span className="block text-[9.5px] text-slate-400 font-bold select-none">Secure instant Nagad pay-out channels</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {checkoutPaymentMethod === 'Nagad' && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </button>

                            {/* Rocket Selection Item */}
                            <button 
                              type="button"
                              onClick={() => {
                                setCheckoutPaymentMethod('Rocket');
                                setCheckoutTxId('');
                              }}
                              className={`w-full bg-white p-3.5 flex items-center justify-between gap-3 text-left transition-all hover:bg-slate-100/30 cursor-pointer ${
                                checkoutPaymentMethod === 'Rocket' ? 'bg-purple-100/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 shadow-3xs border border-indigo-400 text-xs text-indigo-100">
                                  Rk
                                </div>
                                <div>
                                  <span className="block text-[11.5px] font-black text-slate-800">Rocket Pay</span>
                                  <span className="block text-[9.5px] text-slate-400 font-bold select-none">DBBL Rocket payment transaction</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {checkoutPaymentMethod === 'Rocket' && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </button>

                            {/* Cash on Delivery (COD) Selection Item */}
                            <button 
                              type="button"
                              onClick={() => {
                                setCheckoutPaymentMethod('COD');
                                setCheckoutTxId('');
                              }}
                              className={`w-full bg-white p-3.5 flex items-center justify-between gap-3 text-left transition-all hover:bg-slate-100/30 cursor-pointer ${
                                checkoutPaymentMethod === 'COD' ? 'bg-green-100/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full shrink-0 shadow-empty w-9 h-9 flex items-center justify-center font-black border border-emerald-100">
                                  <Truck className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="block text-[11.5px] font-black text-slate-808 font-sans">Cash on Delivery</span>
                                  <span className="block text-[9.5px] text-slate-400 font-bold select-none font-sans">Pay at your shipping doorstep handoff!</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {checkoutPaymentMethod === 'COD' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </button>

                            {/* Instalment Item (Grayed/Inactive) */}
                            <div className="w-full bg-slate-50 p-3.5 flex items-center justify-between gap-3 text-left cursor-not-allowed opacity-60">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 text-slate-400 rounded-full shrink-0 w-9 h-9 flex items-center justify-center">
                                  <Calendar className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="block text-[11.5px] font-black text-slate-400 select-none font-sans">Instalment (EMI)</span>
                                  <span className="block text-[9.5px] text-slate-400 font-medium select-none font-sans">Instalment option is disabled for checkout</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                          </div>
                        </div>

                        {/* SPECIFIC INSTRUCTION & TXID BOXES IF ADVANCE CHANNEL SPECIFIED */}
                        {(() => {
                          if (checkoutPaymentMethod === 'COD') {
                            if (isAdvanceEnabled) {
                              return (
                                <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 text-[11px] text-amber-805 font-bold mt-2 animate-fade-in space-y-1 font-sans">
                                  <span className="block text-amber-900 font-extrabold flex items-center gap-1.2">
                                    ⚠️ Action Required for Cash on Delivery (COD)
                                  </span>
                                  <span>
                                    শপিং কার্ট আইটেমের জন্য নিরাপত্তা এডভান্স কুরিয়ার ফি ৳<b>{totalAdvanceRequired}</b> আবশ্যক। দয়া করে bKash, Nagad অথবা Rocket পেমেন্ট মাধ্যম নির্বাচন করে অগ্রিম প্রদান সম্পন্ন করুন।
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-[11px] text-emerald-800 font-bold mt-2 animate-fade-in font-sans">
                                <span>No advance required. Pay full ৳{finalTotalSum} at delivery point handoff!</span>
                              </div>
                            );
                          }

                          if (checkoutPaymentMethod === 'Card') {
                            return (
                              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 text-[11px] text-blue-800 font-bold mt-2 animate-fade-in space-y-2 font-sans">
                                <span className="block font-extrabold text-blue-900">Credit/Debit Online Checkout Gateway Mock</span>
                                <span>Secure online mock gateway has been pre-selected. After confirming the order, wait while details are validated.</span>
                              </div>
                            );
                          }

                          // Selected an advance channel: bKash, Nagad, Rocket
                          const matchedChannel = activeChannels.find(c => c.name.toLowerCase().includes(checkoutPaymentMethod.toLowerCase()) || checkoutPaymentMethod.toLowerCase().includes(c.name.toLowerCase()) || checkoutPaymentMethod.toLowerCase().includes(c.methodType.toLowerCase()));
                          const selectedChannelObj = matchedChannel || (activeChannels.length > 0 ? activeChannels[0] : null);

                          return (
                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-3 mt-3 animate-fade-in font-sans">
                              <h4 className="font-extrabold text-[11px] text-amber-850 uppercase tracking-wider flex items-center gap-1.5 font-display">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                {checkoutPaymentMethod} {lang === 'en' ? 'Gateway Instructions' : 'গেটওয়ে নির্দেশনাবলী'}
                              </h4>

                              {selectedChannelObj ? (
                                <div className="space-y-4 font-sans">
                                  <div className="bg-white p-3 rounded-lg border border-amber-100 font-bold text-xs space-y-1 text-slate-705">
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                      <span className="text-slate-500 uppercase text-[9px] font-black">{checkoutPaymentMethod} {lang === 'en' ? 'Account Number' : 'একাউন্ট নম্বর'} ({selectedChannelObj.methodType})</span>
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(selectedChannelObj.accountNumber);
                                          showNotif("Account Number copied!", "success");
                                        }}
                                        className="text-[9.5px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded leading-none transition-colors border animate-fade-in"
                                      >
                                        Copy Code
                                      </button>
                                    </div>
                                    <div className="text-sm font-black text-slate-808 font-mono tracking-wide select-all">{selectedChannelObj.accountNumber}</div>
                                  </div>

                                  <p className="text-[10px] text-amber-750 leading-relaxed font-bold bg-white p-2.5 rounded-lg border border-amber-105/50">
                                    {advanceConfig.instructionText || `কুরিয়ার অগ্রিম ভেরিফিকেশন পেমেন্ট ৳${totalAdvanceRequired} সেন্ড মানি করুন। নিচে সঠিক ট্রানজেকশন আইডি প্রদান করুন।`}
                                  </p>

                                  <div className="space-y-1 md:block hidden">
                                    <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block">Sender's Mobile Number</label>
                                    <input 
                                      type="tel"
                                      className="w-full text-xs bg-white border border-slate-205 rounded-lg p-2 font-mono font-bold"
                                      placeholder="e.g. 017XXXXXXXX"
                                      value={checkoutSenderNo}
                                      onChange={(e) => setCheckoutSenderNo(e.target.value)}
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block">Transaction ID (TxID)</label>
                                    <input 
                                      type="text"
                                      className="w-full text-xs font-mono font-bold uppercase tracking-wider bg-white border border-slate-205 rounded-lg p-2"
                                      placeholder="e.g. 8K90LMD2"
                                      value={checkoutTxId}
                                      onChange={(e) => setCheckoutTxId(e.target.value)}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-400 text-[10.5px] font-bold">No accounts configured.</p>
                              )}
                            </div>
                          );
                        })()}

                        {/* Submit Button Action for Stage 2 */}
                        <div className="flex gap-3 pt-3">
                          <button 
                            type="button"
                            onClick={() => {
                              if (!checkoutPaymentMethod) {
                                showNotif(lang === 'en' ? "Please select a payment method." : "অনুগ্রহ করে একটি কুরিয়ার পেমেন্ট মাধ্যম নির্বাচন করুন।", "error");
                                return;
                              }
                              if (checkoutPaymentMethod !== 'COD' && checkoutPaymentMethod !== 'Card') {
                                const isMobile = window.innerWidth < 768;
                                if (!checkoutTxId.trim() || (!isMobile && !checkoutSenderNo.trim())) {
                                  showNotif(
                                    lang === 'en' 
                                      ? (isMobile ? "Please provide transaction ID." : "Please provide sender mobile and transaction ID.")
                                      : (isMobile ? "অনুগ্রহ করে ট্রানজেকশন আইডি প্রদান করুন।" : "অনুগ্রহ করে প্রেরক মোবাইল এবং ট্রানজেকশন আইডি প্রদান করুন।"), 
                                    "error"
                                  );
                                  return;
                                }
                              }
                              handleCheckout();
                            }}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold uppercase py-3.5 rounded-xl text-xs tracking-wider transition-all shadow-md active:scale-95 cursor-pointer text-center"
                          >
                            {lang === 'en' ? 'Confirm Payment & Order' : 'পেমেন্ট ও অর্ডার কনফার্ম করুন'}
                          </button>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            ) : (
              /* STANDARD CART VIEW (ONLY PRODUCT LIST & RECEIPT SUMMARY WITH NO GUEST ADDRESSES) */
              <div className="space-y-4 text-xs font-semibold">
                
                {/* CHOICE SHOP VENDOR HEADER CHOKBAZAR */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                  <div className="flex items-center gap-2 border-b border-slate-250/20 pb-2 mb-2">
                    <input 
                      type="checkbox"
                      checked={cart.length > 0 && selectedCartIds.length === cart.length}
                      onChange={() => {
                        if (selectedCartIds.length === cart.length) {
                          setSelectedCartIds([]);
                        } else {
                          setSelectedCartIds(cart.map(i => i.cartId));
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex items-center gap-1">
                      <span className="bg-pink-500 text-white text-[9px] font-extrabold px-1 rounded uppercase tracking-wider">Choice</span>
                      <span className="font-extrabold text-xs text-slate-800">Dealy Bangladesh Outlet ❯</span>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const isSelected = selectedCartIds.includes(item.cartId);
                      return (
                        <div 
                          key={item.cartId} 
                          className={`flex items-center gap-3 bg-white p-3 rounded-lg border transition-all ${isSelected ? 'border-pink-300/85 bg-pink-50/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          {/* Item Checkbox */}
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {
                              setSelectedCartIds(prev => 
                                prev.includes(item.cartId) 
                                  ? prev.filter(id => id !== item.cartId) 
                                  : [...prev, item.cartId]
                              );
                            }}
                            className="w-4 h-4 rounded border-slate-305 text-pink-500 focus:ring-pink-500 cursor-pointer flex-shrink-0 bg-white"
                          />

                          {/* Product Image - Klik korle details open hobe */}
                          <div 
                            onClick={() => {
                              setViewingProduct(item.product);
                              setShowCartPage(false);
                            }}
                            className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-pink-350 hover:bg-slate-100/50 transition-all"
                            title="View Product Details"
                          >
                            <img src={item.product.img} className="max-h-full max-w-full object-contain" />
                          </div>

                          {/* Product Details - Klik korle details open hobe */}
                          <div className="flex-1 min-w-0">
                            <p 
                              onClick={() => {
                                setViewingProduct(item.product);
                                setShowCartPage(false);
                              }}
                              className="font-black text-xs text-slate-800 leading-snug truncate max-w-[140px] sm:max-w-xs cursor-pointer hover:text-pink-600 transition-colors"
                              title="View Product Details"
                            >
                              {item.product.name}
                            </p>
                            
                            {item.color && (
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Variant: {item.color}</p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-pink-600 font-black">৳{item.product.discountPrice}</span>
                              {item.product.originalPrice > item.product.discountPrice && (
                                <span className="text-[9.5px] text-slate-400 line-through font-bold">৳{item.product.originalPrice}</span>
                              )}
                            </div>
                          </div>

                          {/* Compact counter to change value */}
                          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg h-fit p-1 text-[10px]">
                            <button 
                              onClick={() => updateCartQty(item.cartId, item.qty - 1)} 
                              className="px-2 py-0.5 hover:bg-slate-200 font-extrabold text-slate-600 rounded cursor-pointer touch-manipulation text-[11px]"
                            >
                              -
                            </button>
                            <span className="font-black w-4 text-center text-slate-800">{item.qty}</span>
                            <button 
                              onClick={() => updateCartQty(item.cartId, item.qty + 1)} 
                              className="px-2 py-0.5 hover:bg-slate-200 font-extrabold text-slate-600 rounded cursor-pointer touch-manipulation text-[11px]"
                            >
                              +
                            </button>
                          </div>

                          {/* Individual delete */}
                          <button 
                            onClick={() => removeFromCart(item.cartId)} 
                            className="p-1 hover:bg-red-50 text-slate-450 hover:text-red-505 rounded transition-colors cursor-pointer flex-shrink-0"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtotals & Receipt Panel */}
                <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/70 space-y-2 text-xs text-slate-500 font-bold">
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Cart Products Subtotal ({selectedCartItems.length} selected)</span>
                    <span className="font-extrabold text-slate-800">৳{cartSubtotal}</span>
                  </div>
                </div>

                {/* STICKY BOTTOM CHECKOUT PANEL FOR MOBILE */}
                <div className="fixed bottom-12 md:relative md:bottom-0 left-0 right-0 z-30 bg-white border-t md:border-t-0 md:rounded-xl border-slate-200/80 p-3 md:p-0 flex items-center justify-between shadow-[0_-4px_15px_rgba(0,0,0,0.06)] md:shadow-none gap-3">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <input 
                      type="checkbox" 
                      checked={cart.length > 0 && selectedCartIds.length === cart.length}
                      onChange={() => {
                        if (selectedCartIds.length === cart.length) {
                          setSelectedCartIds([]);
                        } else {
                          setSelectedCartIds(cart.map(i => i.cartId));
                        }
                      }}
                      className="w-4.5 h-4.5 rounded border-slate-250 text-pink-500 focus:ring-pink-500 cursor-pointer"
                    />
                    <span className="text-xs font-black text-slate-600 select-none">All</span>
                  </div>

                  <div className="text-right flex-1 select-none pr-1">
                    <div className="text-[10px] text-slate-400 font-bold leading-none">Subtotal:</div>
                    <div className="text-xs text-pink-600 font-extrabold sm:text-sm mt-0.5">৳{cartSubtotal}</div>
                  </div>

                  <button 
                    onClick={() => {
                      if (selectedCartItems.length === 0) {
                        showNotif("Please select at least one item using checkboxes to order.", "error");
                        return;
                      }
                      setIsCheckingOut(true);
                      setClickedPayToConfirm(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-orange-400 to-pink-500 bg-pink-500 hover:from-pink-600 hover:to-pink-700 text-white font-extrabold uppercase py-2 px-4 sm:px-6 rounded-lg text-xs tracking-wider transition-all shadow active:scale-95 cursor-pointer max-w-[170px] flex-shrink-0 h-9 flex items-center justify-center text-center font-display"
                  >
                    Check Out ({selectedCartItems.length})
                  </button>
                </div>

                <p className="text-[9px] text-slate-400 text-center leading-normal pt-2 select-none">
                  * Dynamic shipping values are processed once Order is confirmed on delivery handoff.
                </p>
              </div>
            )}
          </div>
        </main>
      ) : showResellerLandingPage ? (
        <main className="flex-1 max-w-5xl mx-auto w-full px-3 py-6 md:py-12 animate-fade-in text-slate-800 pb-24">
          
          {/* Back button to return to home shop */}
          <button
            onClick={goHome}
            className="mb-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </button>

          {/* 1. Header Hero Segment */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="bg-pink-100 text-pink-700 font-black text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full select-none">
              Dealy Exclusive Reseller Hub
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight select-text">
              {resellerPageConfig?.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              {resellerPageConfig?.subtitle}
            </p>

            <div className="flex justify-center pt-2">
              <a 
                href="#register_area"
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transition-all active:scale-95 text-center cursor-pointer select-none"
              >
                {resellerPageConfig?.registerBtnText}
              </a>
            </div>

            {/* Social Proof Stats Notice bar */}
            {resellerPageConfig?.bannerNotice && (
              <div className="bg-emerald-50 text-emerald-800 border-y border-emerald-100/60 py-2.5 px-4 text-[10.5px] font-extrabold flex items-center justify-center gap-2 max-w-lg mx-auto rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{resellerPageConfig.bannerNotice}</span>
              </div>
            )}
          </div>

          {/* 2. Embedded Promotional Video Segment */}
          {resellerPageConfig?.videoUrl && (
            <div className="mt-8 max-w-3xl mx-auto bg-slate-950 p-2 sm:p-3 rounded-2xl shadow-xl border border-slate-900 overflow-hidden relative select-none">
              <div className="aspect-video w-full rounded-xl overflow-hidden">
                <iframe
                  src={resellerPageConfig.videoUrl}
                  title="Reseller Introduction Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* 3. Fully Functional Reseller Application Form Area */}
          <div id="register_area" className="mt-12 max-w-lg mx-auto bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-md relative scroll-mt-6">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400" />
            <div className="text-center pb-5 border-b mb-6 border-slate-100">
              <h3 className="font-extrabold text-base text-slate-950 uppercase leading-none">রিসেলার অ্যাকাউন্ট রেজিস্ট্রেশন</h3>
              <p className="text-[10px] text-slate-400 mt-1.5">Apply securely by providing your profile details below</p>
            </div>

            <form onSubmit={handleJoinSellerSubmit} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider block mb-1">আপনার সম্পূর্ণ নাম *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. আশরাফুল ইসলাম (Asik)" 
                  className="w-full border border-slate-250 hover:border-slate-350 focus:border-pink-500 bg-slate-50/20 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-0 transition-colors"
                  value={sellerData.name}
                  onChange={(e) => setSellerData({ ...sellerData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider block mb-1">সচল মোবাইল নাম্বার *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full border border-slate-250 hover:border-slate-350 focus:border-pink-500 bg-slate-50/20 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 focus:outline-none focus:ring-0 transition-colors"
                  value={sellerData.phone}
                  onChange={(e) => setSellerData({ ...sellerData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider block mb-1">অতীতের অভিজ্ঞতা বা কাস্টমাইজড রিমার্কস *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="e.g. আমি পূর্বে কসমেটিক্স নিয়ে ফেসবুকে রিসেলিং করেছি..."
                  className="w-full border border-slate-250 hover:border-slate-350 focus:border-pink-500 bg-slate-50/20 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-0 transition-colors leading-relaxed"
                  value={sellerData.details}
                  onChange={(e) => setSellerData({ ...sellerData, details: e.target.value })}
                />
              </div>

              <div className="bg-slate-50 border p-3 rounded-xl flex items-start gap-2 border-slate-105/90">
                <Check className="w-4 h-4 text-emerald-555 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal font-medium">বেসিক রেজিস্ট্রেশনের পর ১২ থেকে ২৪ ঘণ্টার মধ্যে আমাদের টিম আপনার সাথে ফোনে যোগাযোগ করবে।</p>
              </div>

              <button 
                type="submit"
                className="mt-2 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:shadow-lg active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                সাবমিট অ্যাপ্লিকেশন ➔
              </button>
            </form>
          </div>

          {/* 4. Reseller Details / Pathway grid cards */}
          {resellerBenefits && resellerBenefits.length > 0 && (
            <div className="mt-16 space-y-8">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                  {resellerPageConfig?.sectionsHeadline}
                </h2>
                <div className="w-12 h-1 bg-pink-500 mx-auto rounded-full mt-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {resellerBenefits.map((benefit) => (
                  <div key={benefit.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-3xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-650 text-pink-500 select-none">
                        {benefit.iconName === 'UserCheck' && <UserCheck className="w-5 h-5" />}
                        {benefit.iconName === 'Award' && <Award className="w-5 h-5" />}
                        {benefit.iconName === 'Layers' && <Layers className="w-5 h-5" />}
                        {benefit.iconName === 'ShoppingBag' && <ShoppingBag className="w-5 h-5" />}
                        {benefit.iconName === 'Truck' && <Truck className="w-5 h-5" />}
                        {benefit.iconName === 'DollarSign' && <DollarSign className="w-5 h-5" />}
                        {benefit.iconName === 'HelpCircle' && <HelpCircle className="w-5 h-5" />}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-950 font-display leading-tight">{benefit.title}</h4>
                      <p className="text-[11.5px] leading-relaxed text-slate-500 font-semibold">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Subscription Options section */}
          {resellerSubscriptions && resellerSubscriptions.filter(s => s.isActive).length > 0 && (
            <div className="mt-20 space-y-8">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase">প্রিমিয়াম প্যাক ও সাবস্ক্রিপশন</h2>
                <p className="text-xs text-slate-400 font-medium">রিসেলিং দ্বিগুণ স্পিডে বৃদ্ধি করার সমাধান</p>
                <div className="w-12 h-1 bg-pink-505 bg-pink-500 mx-auto rounded-full mt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-2">
                {resellerSubscriptions.filter(s => s.isActive).map((sub) => (
                  <div key={sub.id} className="bg-gradient-to-b from-white to-slate-50/40 p-6 sm:p-8 rounded-[32px] border border-slate-200 hover:border-slate-350 transition-all shadow-xs flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-950 leading-tight">{sub.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1.5 pb-5 border-b border-slate-100">
                        <span className="text-2xl sm:text-3xl font-black text-pink-500">৳{sub.price}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase">/ {sub.duration}</span>
                      </div>

                      <ul className="mt-5 space-y-2 text-[11px] text-slate-600 font-semibold">
                        {sub.features.map((feat, idx) => (
                          <li key={idx} className="flex gap-2 items-start leading-snug">
                            <span className="text-pink-500 font-extrabold text-xs">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => showNotif(`Dealy: ${sub.name} subscription checkout trigger is enabled. Please connect with support desk to pay ৳${sub.price}!`, "success")}
                      className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-2xl text-[10.5px] uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                    >
                      সাবস্ক্রাইব করুন ➔
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Dynamic FAQ Section */}
          {resellerFAQs && resellerFAQs.length > 0 && (
            <div className="mt-20 space-y-8 max-w-3xl mx-auto scroll-mt-6">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase">Reseller FAQ</h2>
                <p className="text-xs text-slate-400 font-medium">সার্বক্ষণিক সাধারণ জিজ্ঞাসিত প্রশ্নোত্তর</p>
                <div className="w-12 h-1 bg-pink-505 bg-pink-500 mx-auto rounded-full mt-2" />
              </div>

              <div className="space-y-3 pt-2">
                {resellerFAQs.map((faq) => {
                  const isOpened = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className="bg-white border rounded-[20px] overflow-hidden transition-all duration-250 hover:border-slate-350 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isOpened ? null : faq.id)}
                        className="w-full text-left px-5 py-4 font-extrabold text-slate-900 text-xs sm:text-[13px] flex items-center justify-between gap-3 bg-slate-50/30 cursor-pointer select-none"
                      >
                        <span>{faq.question}</span>
                        <span className="text-pink-500 font-black text-xs">
                          {isOpened ? '▲' : '▼'}
                        </span>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpened && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 pt-1.5 text-xs text-slate-500 font-medium leading-relaxed bg-white border-t select-text">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. Founder Section board */}
          {resellerPageConfig?.founderName && (
            <div className="mt-20 max-w-3xl mx-auto bg-slate-50/50 p-6 sm:p-10 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-250 p-1 flex-shrink-0 border shadow-sm">
                <img
                  src={resellerPageConfig.founderPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                  alt={resellerPageConfig.founderName}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3 flex-1 text-center md:text-left">
                <blockquote className="text-xs sm:text-[13px] italic text-slate-650 leading-relaxed font-semibold">
                  "{resellerPageConfig.founderMsg}"
                </blockquote>
                
                <div className="pt-2 border-t border-slate-205">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-950">{resellerPageConfig.founderName}</h4>
                  <p className="text-[10.5px] text-pink-500 font-mono font-bold">{resellerPageConfig.founderTitle}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      ) : showShopPage ? (
        <main className="flex-1 max-w-7xl mx-auto w-full px-0 sm:px-4 py-0 sm:py-8 md:py-10 animate-fade-in text-slate-800">
          <div className="bg-white rounded-none sm:rounded-[24px] border-0 sm:border sm:border-slate-100 shadow-none sm:shadow-xs p-4 sm:p-6 relative overflow-hidden">
            
            {/* Custom search filter inside Shop page */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 gap-3 flex flex-col sm:flex-row sm:items-center justify-between mt-6">
              <span className="text-xs font-black text-slate-650 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-555 text-emerald-500" />
                <span>Showing {products.filter(p => p.inStock).length} premium quality verified products</span>
              </span>
              <div className="w-full sm:w-64 relative">
                <input 
                  type="text"
                  placeholder="Filtering active products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 text-slate-800 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none transition-all font-semibold"
                />
              </div>
            </div>

            {/* Product list grid showing ALL active products without category pre-selection */}
            <div className="pt-6">
              {products.filter(p => {
                const searchLower = searchInput.toLowerCase().trim();
                const matchesSearch = !searchLower || 
                  p.name.toLowerCase().includes(searchLower) || 
                  p.description.toLowerCase().includes(searchLower) ||
                  (categories.find(c => c.id === p.catId)?.name.toLowerCase() || '').includes(searchLower);
                return p.inStock && matchesSearch;
              }).length === 0 ? (
                <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200/85 rounded-2xl">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-500">No active products found</h4>
                  <p className="text-xs text-slate-400 mt-1">Refine your search filter or clear active keywords</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {products.filter(p => {
                    const searchLower = searchInput.toLowerCase().trim();
                    const matchesSearch = !searchLower || 
                      p.name.toLowerCase().includes(searchLower) || 
                      p.description.toLowerCase().includes(searchLower) ||
                      (categories.find(c => c.id === p.catId)?.name.toLowerCase() || '').includes(searchLower);
                    return p.inStock && matchesSearch;
                  }).map(prod => {
                    const sPct = prod.originalPrice > 0 ? Math.round(((prod.originalPrice - prod.discountPrice) / prod.originalPrice) * 100) : 0;
                    return (
                      <div 
                        key={prod.id}
                        onClick={() => {
                          setViewingProduct(prod);
                          setShowShopPage(false);
                        }}
                        className="bg-white hover:bg-slate-50/20 border border-slate-150 rounded-2xl p-3 cursor-pointer select-none transition-all hover:shadow-lg hover:border-pink-200 group flex flex-col justify-between relative"
                      >
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const isFav = favorites.includes(prod.id);
                            if (isFav) {
                              setFavorites(prev => prev.filter(id => id !== prod.id));
                              showNotif("Removed from Favorites", "success");
                            } else {
                              setFavorites(prev => [...prev, prod.id]);
                              showNotif("Added to Favorites", "success");
                            }
                          }}
                          className="absolute top-3 right-3 bg-white/95 p-1.5 rounded-full z-10 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-slate-100"
                        >
                          <Heart className={`w-3.5 h-3.5 ${favorites.includes(prod.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                        </button>

                        <div>
                          <div className="aspect-square bg-white rounded-xl flex items-center justify-center p-2 mb-2 relative overflow-hidden border border-slate-100">
                            {sPct > 0 && (
                              <span className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded-md z-10 shadow-xs uppercase tracking-wider">
                                {sPct}% OFF
                              </span>
                            )}
                            <img src={prod.img} alt={prod.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="font-extrabold text-slate-905 text-slate-900 text-xs truncate leading-snug group-hover:text-pink-500 transition-colors">
                            {prod.name}
                          </h4>
                          
                          {/* Rating and Reviews count */}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] font-extrabold text-amber-500 flex items-center gap-0.5">
                              ★ {prod.rating}
                            </span>
                            <span className="text-[9px] text-slate-400">({prod.sales})</span>
                          </div>

                          <p className="text-[9.5px] text-slate-400 font-bold mt-0.5 truncate">{categories.find(c => c.id === prod.catId)?.name || 'N/A'}</p>
                        </div>
                        <div className="flex justify-between items-end mt-2.5">
                          <div>
                            <span className="text-pink-650 font-black text-xs sm:text-[13px] block text-pink-600">৳{prod.discountPrice}</span>
                            {prod.originalPrice > prod.discountPrice && (
                              <span className="text-[10px] text-slate-400 line-through">৳{prod.originalPrice}</span>
                            )}
                          </div>
                          <button className="p-1 bg-pink-50 hover:bg-pink-500 hover:text-white rounded-lg text-pink-500 transition-all active:scale-90 border border-pink-200">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      ) : showSupportPage ? (
        <main className="flex-1 max-w-md mx-auto w-full px-0 sm:px-4 py-0 sm:py-8 md:py-10 animate-fade-in text-slate-800">
          <div className="bg-white rounded-none sm:rounded-[24px] border-0 sm:border sm:border-slate-100 shadow-none sm:shadow-xs relative overflow-hidden">
            {/* Header */}
            <div className="bg-pink-500 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-pink-400 bg-white/10 flex items-center justify-center font-bold">
                  BW
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-none">WhatsApp Support Desk</h4>
                  <p className="text-[10px] text-pink-100 mt-1">Available for order updates</p>
                </div>
              </div>
              <button 
                onClick={goHome} 
                className="text-xs transition-colors text-pink-100 hover:text-white font-bold cursor-pointer hover:underline"
              >
                Close Chat
              </button>
            </div>

            {/* Chat area */}
            <div className="p-6 space-y-4 bg-slate-50">
              <div className="bg-pink-50/50 p-4 border border-pink-100 rounded-2xl">
                <p className="text-xs font-bold text-pink-950">Assalamu Alaikum 🙏</p>
                <p className="text-xs text-pink-600 mt-1 leading-relaxed">
                  Welcome to <b>DEALY</b>. How can we assist you with your orders, reseller support guidelines, or logistics tracking today? Connect directly with support team handlers below!
                </p>
              </div>

              {/* Dynamic support links on help page */}
              <div className="space-y-2">
                {footerConfig.customLinks && footerConfig.customLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-slate-50 border border-slate-150 text-slate-800 font-extrabold p-3.5 rounded-xl text-xs flex items-center justify-between transition-all"
                  >
                    <span>{link.name}</span>
                    <span className="text-[10px] text-pink-500 font-bold uppercase shrink-0">Connect →</span>
                  </a>
                ))}
              </div>

              <a 
                href="https://wa.me/8801735165971" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 active:scale-95 transition-all text-center cursor-pointer mt-4"
              >
                <MessageSquare className="w-4 h-4" /> Go to WhatsApp Direct Helpdesk
              </a>
            </div>
          </div>
        </main>
      ) : (
        <main className={`flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-10 ${viewingProduct || selectedOffer ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : 'space-y-8'} text-slate-800`}>
          
          {/* Left sidebar directory layout */}
          {(viewingProduct || selectedOffer) && renderSidebarContent()}

          {/* Right Workspace Main frame */}
          <div className={viewingProduct || selectedOffer ? "lg:col-span-3" : "w-full"}>
            <AnimatePresence mode="wait">
              {viewingProduct ? (
              // === PRODUCT DETAIL INTERACTIVE PAGE ===
              <motion.div 
                key="details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-4 sm:p-6"
              >
                <button 
                  onClick={() => setViewingProduct(null)} 
                  className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 font-bold text-xs mb-4 hover:underline cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to {selectedOffer ? `${selectedOffer.title} Campaign` : 'Collections'}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-start">
                  
                  {/* Left Column: Compact Photo Frame & Specifications for Desktop */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-center h-[180px] sm:h-[220px] md:h-[280px] border border-slate-10 border-slate-100">
                      <img 
                        src={viewingProduct.img} 
                        alt={viewingProduct.name} 
                        className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform hover:scale-[1.03] duration-300"
                      />
                    </div>
                    
                    {/* Specifications block (Visible on Desktop here) */}
                    <div className="hidden md:block bg-slate-50 p-4 rounded-2xl border border-slate-100/70">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Detailed Specifications</h3>
                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line font-medium">
                        {viewingProduct.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Title, Ratings, Pricing, Compact Attributes side-by-side, & CTAs */}
                  <div className="flex flex-col">
                    <span className="w-fit text-[9px] font-black tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md uppercase">
                      Premium Quality
                    </span>
                    
                    <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-800 tracking-tight mt-2 mb-1 leading-snug">
                      {viewingProduct.name}
                    </h2>
                    
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex text-amber-400">
                        {[1,2,3,4,5].map(x => <Star key={x} className="w-3 h-3 fill-current" />)}
                      </div>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-bold">({viewingProduct.sales} reviews)</span>
                    </div>

                    {/* Pricing Badge */}
                    <div className="bg-pink-50/40 border border-pink-100/50 p-3 rounded-xl mb-4 text-left">
                      <p className="text-[9px] text-pink-600/70 font-black uppercase mb-0.5 tracking-wider">PROMOTIONAL OFFER</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-pink-600">৳{viewingProduct.discountPrice}</span>
                        {viewingProduct.originalPrice > viewingProduct.discountPrice && (
                          <span className="text-xs sm:text-sm text-slate-400 line-through font-bold">৳{viewingProduct.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Side-by-side Color Select & Quantity Regulator */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Color Option Block */}
                      {viewingProduct.colors && viewingProduct.colors.length > 0 ? (
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">Select Color</label>
                          <div className="flex gap-1 flex-wrap">
                            {viewingProduct.colors.map(col => (
                              <button
                                key={col}
                                onClick={() => setSelectedColor(col)}
                                className={`px-2 py-1 text-[11px] border-2 rounded-lg font-bold transition-all cursor-pointer ${selectedColor === col ? 'border-pink-500 bg-pink-50 text-pink-600 ring-1 ring-pink-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                              >
                                {col}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">Choice Preference</label>
                          <span className="text-[10.5px] font-bold text-indigo-550 text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-lg">Standard Pack</span>
                        </div>
                      )}

                      {/* Quantity option block */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">Quantity</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-lg w-fit bg-slate-50 overflow-hidden text-[11px]">
                          <button 
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="px-2 py-1 hover:bg-slate-100 bg-slate-100 font-extrabold text-slate-500 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-slate-900 font-black">{qty}</span>
                          <button 
                            onClick={() => setQty(qty + 1)}
                            className="px-2 py-1 hover:bg-slate-100 bg-slate-100 font-extrabold text-slate-500 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Compact Purchase Button actions */}
                    <div className="flex gap-2.5 mt-2">
                      <button 
                        onClick={() => addToCart(viewingProduct, qty, selectedColor)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black py-2.5 rounded-xl text-xs hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer shadow-2xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-slate-500" /> Add to Cart
                      </button>
                      <button 
                        onClick={() => handleBuyNow(viewingProduct, qty, selectedColor)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-md shadow-pink-500/10 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Buy Now Direct
                      </button>
                    </div>

                    {/* Trust Signals Block (Daraz / E-commerce like) */}
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 mt-4 pt-4 text-[10px] text-slate-450 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span className="text-slate-500">Genuine Product Guarantee</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span className="text-slate-500">Cash On Delivery Available</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Mobile block specifications - Sits beautifully below purchase flow */}
                <div className="block md:hidden border-t border-slate-100 mt-5 pt-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Detailed Specifications</h3>
                  <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line font-medium">
                    {viewingProduct.description}
                  </p>
                </div>
              </motion.div>
            ) : selectedOffer ? (
              // === EXCLUSIVE CAMPAIGN LANDING PAGE ===
              <motion.div 
                key={`campaign-${selectedOffer.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Campaign Header banner */}
                {(() => {
                  const theme = getThemeColorClasses(selectedOffer.themeColor);
                  const IconComponent = theme.icon;
                  return (
                    <div className={`relative overflow-hidden rounded-[20px] p-4 sm:p-5 border shadow-2xs flex flex-row justify-between items-center gap-4 ${theme.bg}`}>
                      {/* Ambient background vector icons */}
                      <div className="absolute right-[-10px] bottom-[-20px] opacity-10">
                        <IconComponent className={`w-24 h-24 ${theme.iconColor}`} />
                      </div>
                      
                      <div className="space-y-1 relative z-10 flex-1">
                        <button 
                          onClick={() => setSelectedOffer(null)}
                          className="inline-flex items-center gap-1 text-[10px] font-black text-pink-500 hover:text-pink-600 uppercase tracking-wider mb-1.5 hover:underline"
                        >
                          ← Continue Shopping
                        </button>
                        
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-wider ${theme.badge}`}>
                            {selectedOffer.badge}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold tracking-tight">Campaign Spotlight</span>
                        </div>
                        
                        <h2 className={`text-base sm:text-lg font-black uppercase tracking-tight leading-none ${theme.text} mt-1`}>
                          {selectedOffer.title}
                        </h2>
                        
                        <p className={`text-[10.5px] font-semibold max-w-xl ${theme.subtext} leading-tight line-clamp-1`}>
                          {selectedOffer.desc}
                        </p>
                      </div>

                      <div className="shrink-0 relative z-10 hidden sm:block">
                        <div className="bg-white/90 backdrop-blur-xs border border-slate-200/40 px-3 py-1.5 rounded-xl shadow-2xs text-center">
                          <span className="block text-[8px] font-black text-slate-450 uppercase tracking-widest">Category</span>
                          <span className="block text-[10.5px] font-black text-slate-800 uppercase tracking-tight mt-0.5 truncate max-w-[125px]">
                            {categories.find(c => c.id === selectedOffer.catId)?.name || 'Campaign'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Campaign Products Feed list */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-4 tracking-tight border-b pb-2 flex items-center justify-between">
                    <span>Exclusive Campaign Collection</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {products.filter(p => p.catId === selectedOffer.catId && p.inStock).length} items found
                    </span>
                  </h3>

                  {(() => {
                    const campaignProducts = products.filter(p => p.catId === selectedOffer.catId && p.inStock);
                    if (campaignProducts.length === 0) {
                      return (
                        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-xs">
                          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                          <h4 className="font-bold text-slate-500">Products are coming soon!</h4>
                          <p className="text-xs text-slate-400 mt-1">Our resellers are setting up active stock packages for this special campaign.</p>
                          <button 
                            onClick={() => setSelectedOffer(null)}
                            className="mt-4 inline-flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
                          >
                            Explore Trending Deals
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {campaignProducts.map(prod => {
                          const sPct = prod.originalPrice > 0 ? Math.round(((prod.originalPrice - prod.discountPrice) / prod.originalPrice) * 100) : 0;
                          return (
                            <div 
                              key={prod.id}
                              onClick={() => viewDetails(prod)}
                              className="bg-white rounded-2xl border border-slate-200/50 hover:shadow-lg hover:border-slate-200 transition-all p-3 flex flex-col group cursor-pointer relative"
                            >
                              {sPct > 0 && (
                                <span className="absolute top-3 left-3 bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full z-10 shadow">
                                  -{sPct}%
                                </span>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const isFav = favorites.includes(prod.id);
                                  if (isFav) {
                                    setFavorites(prev => prev.filter(id => id !== prod.id));
                                    showNotif("Removed from Favorites", "success");
                                  } else {
                                    setFavorites(prev => [...prev, prod.id]);
                                    showNotif("Added to Favorites", "success");
                                  }
                                }}
                                className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-slate-100"
                              >
                                <Heart className={`w-3.5 h-3.5 ${favorites.includes(prod.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                              </button>

                              <div className="aspect-square bg-slate-50 group-hover:bg-slate-100/50 rounded-xl overflow-hidden flex items-center justify-center p-4 transition-colors">
                                <img 
                                  src={prod.img} 
                                  alt={prod.name} 
                                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" 
                                />
                              </div>

                              <div className="p-2 flex flex-col flex-1 mt-2">
                                <h4 className="font-extrabold text-slate-800 text-xs md:text-sm leading-tight line-clamp-2 min-h-[32px] group-hover:text-indigo-600 transition-colors">
                                  {prod.name}
                                </h4>
                                
                                <div className="flex items-center gap-1 mt-1 mb-2">
                                  <span className="text-[10px] font-extrabold text-amber-500 flex items-center gap-0.5">
                                    ★ {prod.rating}
                                  </span>
                                  <span className="text-[9px] text-slate-400">({prod.sales})</span>
                                </div>

                                <div className="mt-auto flex justify-between items-baseline pt-2 border-t border-slate-100">
                                  <span className="text-pink-600 font-extrabold text-sm md:text-base">৳{prod.discountPrice}</span>
                                  {sPct > 0 && (
                                    <span className="text-[10px] text-slate-400 line-through">৳{prod.originalPrice}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            ) : (
              // === STORE PRIMARY FRONT INTERFACE ===
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                  {renderSidebarContent()}
                  <div className="lg:col-span-3 space-y-8 animate-fade-in">
                {/* Banner Carousel Hero */}
                {!selectedCat && activeBanners.length > 0 && (
                  <div className={`relative overflow-hidden rounded-2xl shadow-lg border border-slate-100 aspect-[12/5] sm:aspect-auto ${bannerHeight === 'small' ? 'sm:h-[180px] md:h-[260px] lg:h-[295px]' : bannerHeight === 'large' ? 'sm:h-[260px] md:h-[390px] lg:h-[435px]' : 'sm:h-[220px] md:h-[320px] lg:h-[365px]'}`}>
                    <div 
                      className="h-full flex w-full transition-transform duration-500 ease-in-out"
                      style={{ 
                        transform: `translateX(-${(currentBanner % activeBanners.length) * 100}%)`
                      }}
                    >
                      {activeBanners.map(ban => (
                        <div key={ban.id} className="h-full w-full flex-shrink-0 relative overflow-hidden">
                          {ban.link ? (
                            <a 
                              href={ban.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block h-full w-full cursor-pointer hover:opacity-95 transition-opacity"
                              title="View promotion"
                            >
                              <img src={ban.img} alt="Promo" className="w-full h-full object-cover" />
                            </a>
                          ) : (
                            <img src={ban.img} alt="Promo" className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Offers Section - Displayed on both Desktop and Mobile */}
                {!selectedCat && specialOffers && specialOffers.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 px-1">
                      <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Special Offers & Events 🎯</h3>
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                    </div>
                    
                    <div className="scroll-x-container pb-2 px-1">
                      {specialOffers.map(offer => {
                        const theme = getThemeColorClasses(offer.themeColor);
                        const IconComponent = theme.icon;
                        return (
                          <button
                            key={offer.id}
                            onClick={() => {
                              setSelectedOffer(offer);
                              setSelectedCat(null);
                              setViewingProduct(null);
                              showNotif(`Opened ${offer.title} campaign!`, 'success');
                            }}
                            className={`flex-shrink-0 text-left w-[145px] border-2 rounded-2xl p-3 flex flex-col justify-between h-[160px] shadow-xs relative overflow-hidden transition-all hover:scale-[1.03] active:scale-95 cursor-pointer ${theme.bg} border-slate-200/60 hover:border-pink-300`}
                            id={`offer-btn-${offer.id}`}
                          >
                            <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                              <IconComponent className={`w-16 h-16 ${theme.iconColor}`} />
                            </div>
                            <div className="w-full">
                              <span className={`${theme.badge} text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit`}>
                                {offer.badge}
                              </span>
                              <h4 className={`font-black ${theme.text} text-xs mt-2 uppercase tracking-tight leading-tight line-clamp-2`}>
                                {offer.title}
                              </h4>
                              <p className={`text-[8px] ${theme.subtext} font-bold mt-1 line-clamp-1`}>
                                {offer.desc}
                              </p>
                            </div>
                            <div className={`w-full text-white font-black text-[9px] uppercase tracking-wider text-center py-1 rounded-xl transition-all shadow-xs ${theme.badge}`}>
                              {offer.actionText}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mobile-First Premium Layout Elements (Shown on Mobile Screen Sizes below standard tablet breakpoint) */}
                <div id="categories-section" className="block lg:hidden space-y-4">
                  {/* Horizontal Scroll Categories mimicking user image */}
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Categories</h3>
                      <div className="flex items-center gap-2">
                        {/* Elegant Left/Right Click Nav Icons */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5 border border-slate-200/50">
                          <button 
                            onClick={() => scrollCategories(-110)}
                            className="w-6 h-6 rounded-full bg-white text-slate-700 hover:text-pink-600 active:scale-90 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                            title="Previous Category"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => scrollCategories(110)}
                            className="w-6 h-6 rounded-full bg-white text-slate-700 hover:text-pink-600 active:scale-90 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                            title="Next Category"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-slate-300 text-[10px] font-thin">|</span>
                        <button onClick={() => {
                          setSelectedCat(null);
                          setSelectedOffer(null);
                          setViewingProduct(null);
                          setShowShopPage(true);
                          setShowResellerLandingPage(false);
                          setShowCustProfilePage(false);
                          setShowOnlyFavorites(false);
                          setShowCartPage(false);
                          setShowSupportPage(false);
                        }} className="text-pink-500 font-extrabold text-xs uppercase hover:underline cursor-pointer">All</button>
                      </div>
                    </div>
                    <div ref={categoriesScrollRef} className="scroll-x-container pb-2 px-1">
                      {categories.map(c => {
                        const isSel = selectedCat === c.id;
                        return (
                          <button 
                            key={c.id} 
                            onClick={() => {
                              setSelectedCat(c.id);
                              setSelectedOffer(null);
                              setViewingProduct(null);
                              setShowResellerLandingPage(false);
                              setShowShopPage(false);
                              setShowCustProfilePage(false);
                              setShowOnlyFavorites(false);
                              setShowCartPage(false);
                              setShowSupportPage(false);
                            }}
                            className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-2xl min-w-[95px] transition-all bg-white border cursor-pointer ${isSel ? 'border-pink-500 bg-pink-50/40 ring-1 ring-pink-500/20 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-1 border border-slate-100">
                              <img src={getCategoryIcon(c.id)} alt={c.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <span className="text-[10px] font-black tracking-tight text-slate-800 uppercase text-center leading-tight truncate w-[85px]">{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Promo delivery & discount pills */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs">
                      <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] font-black text-orange-950 uppercase tracking-tight">Free Delivery</span>
                        <span className="block text-[8px] text-orange-600/90 font-bold leading-none mt-0.5">Orders above ৳3000</span>
                      </div>
                    </div>
                    <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs">
                      <div className="w-9 h-9 bg-pink-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] font-black text-rose-950 uppercase tracking-tight">Best Discount</span>
                        <span className="block text-[8px] text-pink-600/90 font-bold leading-none mt-0.5">Maximum savings</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flash Promo Box (Inline Display in beautiful Grid) */}
                {!selectedCat && flashProducts.length > 0 && (
                  <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 p-1.5 rounded-3xl shadow-xl">
                    <div className="bg-white rounded-[1.25rem] p-5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            FLASH🔥
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Premium Flash Offers</h4>
                        </div>
                      </div>
                      <div className={`grid grid-cols-2 ${
                        flashProducts.length === 1 ? 'md:grid-cols-1 max-w-sm mx-auto' :
                        flashProducts.length === 2 ? 'md:grid-cols-2 max-w-2xl' :
                        flashProducts.length === 3 ? 'md:grid-cols-3 max-w-4xl' : 'md:grid-cols-4'
                      } gap-4 animate-fade-in`}>
                        {flashProducts.slice(0,4).map(prod => (
                          <div 
                            key={prod.id}
                            onClick={() => viewDetails(prod)}
                            className="bg-slate-50/50 hover:bg-white border border-slate-100 rounded-xl p-3 cursor-pointer select-none transition-all hover:shadow-md card-hover group relative"
                          >
                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const isFav = favorites.includes(prod.id);
                                if (isFav) {
                                  setFavorites(prev => prev.filter(id => id !== prod.id));
                                  showNotif("Removed from Favorites", "success");
                                } else {
                                  setFavorites(prev => [...prev, prod.id]);
                                  showNotif("Added to Favorites", "success");
                                }
                              }}
                              className="absolute top-3 right-3 bg-white/90 p-1.2 rounded-full z-10 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-slate-100"
                            >
                              <Heart className={`w-3 h-3 ${favorites.includes(prod.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                            </button>

                            <div className="aspect-square bg-white rounded-lg flex items-center justify-center p-1 mb-2">
                              <img src={prod.img} alt={prod.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                            </div>
                            <h5 className="font-bold text-slate-800 text-[11px] truncate leading-tight group-hover:text-indigo-600 transition-colors">
                              {prod.name}
                            </h5>

                            {/* Rating and Reviews count */}
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[9px] font-extrabold text-amber-500 flex items-center gap-0.5">
                                ★ {prod.rating}
                              </span>
                              <span className="text-[8px] text-slate-400">({prod.sales})</span>
                            </div>

                            <div className="flex justify-between items-baseline mt-1.5">
                              <span className="text-indigo-600 font-extrabold text-[12px]">৳{prod.discountPrice}</span>
                              {prod.originalPrice > prod.discountPrice && (
                                <span className="text-[10px] text-slate-400 line-through">৳{prod.originalPrice}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                </div>
              </div>

                {/* Primary Card Marketplace */}
                <div id="products-header">
                  <h3 className="font-extrabold text-slate-900 text-lg mb-4 tracking-tight border-b pb-2 flex items-center justify-between">
                    <span>
                      {selectedCat 
                        ? categories.find(c => c.id === selectedCat)?.name 
                        : searchInput 
                          ? `Search result for "${searchInput}"` 
                          : 'Trending Collections'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium font-mono">Showing {displayProducts.length} items</span>
                  </h3>

                  {displayProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-inner">
                      <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h4 className="font-bold text-slate-500">No matching products inside stock</h4>
                      <p className="text-xs text-slate-400 mt-1">Refine your active filters or clear search term</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                      {displayProducts.map(prod => {
                        const sPct = prod.originalPrice > 0 ? Math.round(((prod.originalPrice - prod.discountPrice) / prod.originalPrice) * 100) : 0;
                        return (
                          <div 
                            key={prod.id}
                            onClick={() => viewDetails(prod)}
                            className="bg-white rounded-2xl border border-slate-200/50 hover:shadow-lg hover:border-slate-200 transition-all p-3 flex flex-col group cursor-pointer relative"
                          >
                            {/* Sticker badge */}
                            {sPct > 0 && (
                              <span className="absolute top-3 left-3 bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full z-10 shadow">
                                -{sPct}%
                              </span>
                            )}

                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const isFav = favorites.includes(prod.id);
                                if (isFav) {
                                  setFavorites(prev => prev.filter(id => id !== prod.id));
                                  showNotif("Removed from Favorites", "success");
                                } else {
                                  setFavorites(prev => [...prev, prod.id]);
                                  showNotif("Added to Favorites", "success");
                                }
                              }}
                              className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full z-10 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-slate-100"
                            >
                              <Heart className={`w-3.5 h-3.5 ${favorites.includes(prod.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                            </button>

                            {/* Image aspect wrap */}
                            <div className="aspect-square bg-slate-50 group-hover:bg-slate-100/50 rounded-xl overflow-hidden flex items-center justify-center p-1 sm:p-2 transition-colors">
                              <img 
                                src={prod.img} 
                                alt={prod.name} 
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" 
                              />
                            </div>

                            {/* Content items */}
                            <div className="p-2 flex flex-col flex-1 mt-2">
                              <h4 className="font-extrabold text-slate-800 text-xs md:text-sm leading-tight line-clamp-2 min-h-[32px] group-hover:text-indigo-600 transition-colors">
                                {prod.name}
                              </h4>
                              
                              <div className="flex items-center gap-1 mt-1 mb-2">
                                <span className="text-[10px] font-extrabold text-amber-500 flex items-center gap-0.5">
                                  ★ {prod.rating}
                                </span>
                                <span className="text-[9px] text-slate-400">({prod.sales})</span>
                              </div>

                              <div className="mt-auto flex justify-between items-baseline pt-2 border-t border-slate-100">
                                <span className="text-pink-600 font-extrabold text-sm md:text-base">৳{prod.discountPrice}</span>
                                {sPct > 0 && (
                                  <span className="text-[10px] text-slate-400 line-through">৳{prod.originalPrice}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Section 1: About Us */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                DL
              </div>
              <span className="text-white font-black text-lg">DEALY DISTRIBUTION</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-semibold">
              {footerConfig.aboutUs}
            </p>
          </div>

          {/* Section 2: Join as Reseller */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Become a Partner</h5>
            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              {footerConfig.joinResellerBanner}
            </p>
            <button 
              onClick={openResellerLandingPage} 
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-md mt-1 cursor-pointer"
            >
              Apply as Reseller
            </button>
          </div>

          {/* Section 3: Privacy & Policy Guidance */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Trust & Safety Guidelines</h5>
            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              {footerConfig.privacyPolicy}
            </p>
            <ul className="space-y-1.5 text-xs font-semibold">
              <li onClick={() => { setSelectedTrackingId(''); setShowTrackerModal(true); }} className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-indigo-400" /> Order Tracking Search</li>
              <li className="text-slate-500 cursor-default flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Authorized Carrier Protection</li>
            </ul>
          </div>

          {/* Section 4: Contact Us & Social Links */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Contact & Social Channels</h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-pink-500" />
                <span className="font-mono">{footerConfig.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{footerConfig.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Support Availability: 24/7 Digital Desk</span>
              </li>
            </ul>

            {/* Social Media Link icons */}
            <div className="pt-2 flex items-center gap-3">
              {footerConfig.facebook && (
                <a 
                  href={footerConfig.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all font-bold text-xs"
                  title="Facebook Profile Page"
                >
                  FB
                </a>
              )}
              {footerConfig.youtube && (
                <a 
                  href={footerConfig.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all font-bold text-xs"
                  title="YouTube Channel"
                >
                  YT
                </a>
              )}
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} Dealy Logistics. Authorized partner distribution network Bangladesh.</p>
          <div className="flex gap-4 items-center">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="text-slate-600">|</span>
            <button 
              onClick={openPanelLogin} 
              className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 opacity-60 text-indigo-400" />
              <span>Partner Console</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (Beautifully styled with Orivian's Pink theme) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-pink-500 border-t border-pink-400/45 text-white flex justify-around items-center py-2 px-1 md:hidden shadow-[0_-5px_15px_rgba(219,39,119,0.15)] select-none">
        <button 
          onClick={goHome}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${(!viewingProduct && !selectedCat && !showOnlyFavorites && !showCustProfilePage && !showCartPage && !showSupportPage && !showShopPage) ? 'bg-white/20 font-extrabold text-white scale-[1.05] shadow-xs' : 'opacity-85 hover:opacity-100'}`}
        >
          <Home className="w-4.5 h-4.5" />
          <span className="text-[9.5px] font-black mt-1 uppercase tracking-tight">{t("Home")}</span>
        </button>

        <button 
          onClick={() => {
            setShowShopPage(true);
            setSelectedCat(null);
            setSelectedOffer(null);
            setViewingProduct(null);
            setEditingCustomerOrder(null);
            setShowCustProfilePage(false);
            setShowOnlyFavorites(false);
            setShowCartPage(false);
            setShowSupportPage(false);
            setShowResellerLandingPage(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${showShopPage ? 'bg-white/20 font-extrabold text-white scale-[1.05] shadow-xs' : 'opacity-85 hover:opacity-100'}`}
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          <span className="text-[9.5px] font-black mt-1 uppercase tracking-tight">{t("Shop")}</span>
        </button>

        <button 
          onClick={() => {
            setViewingProduct(null);
            setEditingCustomerOrder(null);
            setShowCustProfilePage(false);
            setShowOnlyFavorites(true);
            setShowCartPage(false);
            setShowSupportPage(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${showOnlyFavorites ? 'bg-white/20 font-extrabold text-white scale-[1.05] shadow-xs' : 'opacity-85 hover:opacity-100'}`}
        >
          <span className="relative">
            <Heart className={`w-4.5 h-4.5 ${favorites.length > 0 ? 'fill-white text-white' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-rose-600 text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-pink-500 shadow-sm">
                {favorites.length}
              </span>
            )}
          </span>
          <span className="text-[9.5px] font-black mt-1 uppercase tracking-tight">{t("Favorite")}</span>
        </button>

        <button 
          onClick={() => {
            setShowCartPage(true);
            setViewingProduct(null);
            setEditingCustomerOrder(null);
            setShowCustProfilePage(false);
            setShowOnlyFavorites(false);
            setShowSupportPage(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${showCartPage ? 'bg-white/25 font-extrabold text-white scale-[1.05]' : 'opacity-85 hover:opacity-100'}`}
        >
          <span className="relative">
            <ShoppingCart className="w-4.5 h-4.5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-pink-600 font-extrabold text-[7.5px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-pink-550">
                {cartItemsCount}
              </span>
            )}
          </span>
          <span className="text-[9.5px] font-black mt-1 uppercase tracking-tight">{t("Cart")}</span>
        </button>

        <button 
          onClick={() => {
            if (loggedCustomer) {
              setShowCustProfilePage(true);
              setViewingProduct(null);
              setEditingCustomerOrder(null);
              setSelectedCat(null);
              setShowOnlyFavorites(false);
              setShowCartPage(false);
              setShowSupportPage(false);
              setShowResellerLandingPage(false);
              setShowMyOrdersPage(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setAuthType('login');
              setShowAuthModal(true);
            }
          }}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${(showCustProfilePage || showMyOrdersPage) ? 'bg-white/20 font-extrabold text-white scale-[1.05] shadow-xs' : 'opacity-85 hover:opacity-100'}`}
        >
          <User className="w-4.5 h-4.5" />
          <span className="text-[9.5px] font-black mt-1 uppercase tracking-tight">{loggedCustomer ? t("Me") : t("Log In")}</span>
        </button>
      </nav>


      {/* === MODALS OVERLAYS RIG === */}

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <div className="fixed inset-0 z-55 flex">
            {/* Backdrop blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-3xs z-50"
            />
            {/* Slideable content body */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-[285px] max-w-[85vw] bg-white h-full shadow-2xl z-55 flex flex-col font-sans text-slate-800"
            >
              {/* Drawer Top Header in Pink theme */}
              <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center font-black text-xs uppercase text-white shadow-inner">
                    D
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wide">DEALY</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-white cursor-pointer active:scale-95 transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Body Area (Scrollable Categories, profiles) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* 1. Quick Info */}
                <div className="bg-slate-50 border rounded-2xl p-3 flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg text-pink-605 text-pink-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    {loggedCustomer ? (
                      <>
                        <h4 className="font-extrabold text-xs text-slate-800 truncate">{loggedCustomer.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold truncate">{loggedCustomer.phone}</p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-extrabold text-xs text-slate-800">Guest Customer</h4>
                        <p className="text-[10px] text-slate-400 font-bold">Sign in for exclusive perks</p>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Navigations */}
                <div className="space-y-1">
                  
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      goHome();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Home className="w-4 h-4 text-pink-500" />
                    <span>{t("Home")}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      openResellerLandingPage();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-pink-100/40 text-pink-600 font-black text-xs flex items-center gap-2.5 transition-colors cursor-pointer border border-pink-100/50 bg-pink-50/50"
                  >
                    <UserCheck className="w-4 h-4 text-pink-600 animate-bounce" />
                    <span className="uppercase">{t("Join Reseller")}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      if (loggedCustomer) {
                        setShowCustProfilePage(true);
                        setViewingProduct(null);
                        setEditingCustomerOrder(null);
                        setSelectedCat(null);
                        setShowOnlyFavorites(false);
                        setShowCartPage(false);
                        setShowSupportPage(false);
                      } else {
                        setAuthType('login');
                        setShowAuthModal(true);
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-pink-500" />
                    <span>{loggedCustomer ? t("My Account") : t("My Account")}</span>
                  </button>
                </div>

                {/* 3. Browse categories */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black tracking-wider text-slate-400 uppercase mb-2 px-1">Browse Categories</p>
                  <div className="grid grid-cols-1 gap-1 max-h-[160px] overflow-y-auto pr-1">
                    <button
                      onClick={() => {
                        setSelectedCat(null);
                        setShowMobileMenu(false);
                        setViewingProduct(null);
                        setShowOnlyFavorites(false);
                        setShowCartPage(false);
                        setShowSupportPage(false);
                        setShowShopPage(true);
                        setShowResellerLandingPage(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${!selectedCat ? 'bg-pink-50/60 text-pink-600' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>All Products</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">{products.length}</span>
                    </button>
                    {categories.map((cat) => {
                      const count = products.filter(p => p.catId === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCat(cat.id);
                            setShowMobileMenu(false);
                            setViewingProduct(null);
                            setShowOnlyFavorites(false);
                            setShowCartPage(false);
                            setShowSupportPage(false);
                            setShowShopPage(false);
                            setShowResellerLandingPage(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${selectedCat === cat.id ? 'bg-pink-50/60 text-pink-600' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.2 rounded-full font-mono">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. More operations */}
                <div className="space-y-1 pt-2 border-t">
                  <p className="text-[9px] font-black tracking-wider text-slate-400 uppercase mb-2 px-1">More Operations</p>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-600">Language / ভাষা</span>
                    <button 
                      type="button"
                      onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-3xs"
                    >
                      <span className={lang === 'en' ? 'text-pink-600 font-black' : 'text-slate-400 font-bold'}>EN</span>
                      <span className="text-slate-350">|</span>
                      <span className={lang === 'bn' ? 'text-pink-600 font-black' : 'text-slate-400 font-bold'}>বাং</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      setShowMobileMenu(false);
                      openPanelLogin();
                    }}
                    className="w-full text-left px-3 py-2 text-[10px] text-slate-500 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer mt-2.5"
                  >
                    Reseller Login
                  </button>
                </div>
              </div>

              {/* Drawer Sticky Footer Sign in / logout button */}
              <div className="p-4 border-t bg-slate-50">
                {loggedCustomer ? (
                  <button 
                    onClick={() => {
                      setShowMobileMenu(false);
                      onCustLogout();
                      showNotif("Logged out successfully.", "success");
                    }}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-200 cursor-pointer active:scale-95 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("Logout Account")}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setShowMobileMenu(false);
                      setAuthType('login');
                      setShowAuthModal(true);
                    }}
                    className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t("Sign In")}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === MODALS OVERLAYS RIG === */}

      {/* 1. Universal Real-time Logistics Tracker Modal */}
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
              className="bg-white rounded-3xl shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 popup-anim border border-slate-100"
            >
              <OrderTracker 
                orders={orders} 
                defaultTrackingId={selectedTrackingId} 
                onTrackClose={() => setShowTrackerModal(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SSLCommerz Secure Sandbox Payment Gateway Overlay */}
      <AnimatePresence>
        {showSslGateway && sslPaymentData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-50 rounded-2xl shadow-2xl border-4 border-slate-305 max-w-lg w-full overflow-hidden flex flex-col font-sans z-55 my-auto max-h-[95vh] sm:max-h-none"
            >
              {/* Top Gateway Secure Banner */}
              <div className="bg-indigo-900 text-white p-4 flex items-center justify-between border-b-2 border-slate-205">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider leading-none">SSLCommerz Secure Payment</h3>
                    <p className="text-[10px] text-indigo-250 mt-1 font-extrabold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" /> 256-Bit SSL Secured Sandbox Gateway
                    </p>
                  </div>
                </div>
                <div className="text-[9px] bg-red-650 bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase font-mono tracking-widest animate-pulse border border-red-500">
                  SANDBOX MODE
                </div>
              </div>

              {/* Amount Info Segment */}
              <div className="bg-gradient-to-r from-slate-100 to-white px-5 py-4 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Merchant Payee</p>
                    <p className="text-xs font-black text-slate-800">Dealy Limited (Dealy Admin)</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">Purpose: <b className="text-pink-505 text-pink-500">{sslPaymentData.title}</b></p>
                  </div>
                  <div className="text-right flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end bg-pink-50/50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider sm:block hidden">Amount Payable</span>
                    <span className="text-xl font-black text-pink-600 font-mono tracking-tight font-sans">৳{sslPaymentData.amount}.00 <span className="text-[10px] text-slate-500">BDT</span></span>
                  </div>
                </div>
              </div>

              {/* Inner Portal state block */}
              <SslPaymentPortal 
                amount={sslPaymentData.amount}
                onCancel={() => {
                  setShowSslGateway(false);
                  showNotif("Payment cancelled through SSLCommerz Gateway.", "error");
                }}
                onComplete={() => {
                  setShowSslGateway(false);
                  sslPaymentData.onSuccess();
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Customer Auth Modals */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full max-w-[420px] p-6 text-slate-800 z-10 overflow-hidden"
            >
              {/* Back & Close Header */}
              <div className="flex justify-between items-center mb-5 pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-pink-600 transition-all uppercase cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-pink-500" /> Back to Store
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                  title="Close login modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
                <button 
                  onClick={() => setAuthType('login')}
                  className={`w-1/2 py-2 rounded-lg font-bold text-xs transition-all ${authType === 'login' ? 'bg-white shadow text-pink-600' : 'text-slate-500'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setAuthType('register')}
                  className={`w-1/2 py-2 rounded-lg font-bold text-xs transition-all ${authType === 'register' ? 'bg-white shadow text-pink-600' : 'text-slate-500'}`}
                >
                  Register
                </button>
              </div>

              {authType === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <h3 className="font-extrabold text-lg text-slate-900 font-display">Sign In Account</h3>
                  <div className="form-group">
                    <label className="form-label">Phone Contact Number</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="📞 e.g. 017XXXXXXXX (11 Digits)" 
                      required
                      value={loginData.phone}
                      onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password Key</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="🔒 ••••••••" 
                      required
                      value={loginData.pass}
                      onChange={(e) => setLoginData({ ...loginData, pass: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors text-xs uppercase tracking-wider">
                    Authorize Entry
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <h3 className="font-extrabold text-lg text-slate-900 font-display">Create Shopper Profile</h3>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="👤 •••••••• ••••••••" 
                      required
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Access Number</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="📞 e.g. 017XXXXXXXX (11 Digits)" 
                      required
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shipping Address</label>
                    <textarea 
                      rows={2}
                      className="form-input" 
                      placeholder="🏠 ••••••••, ••••••••, ••••••••" 
                      required
                      value={regData.address}
                      onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Secured Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="🔒 ••••••••" 
                      required
                      value={regData.pass}
                      onChange={(e) => setRegData({ ...regData, pass: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors text-xs uppercase tracking-wider">
                    Create Profile
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Shopping Cart & Shipping Checkout Modal */}
      <AnimatePresence>
        {showCartModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCartModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative z-10 text-slate-800 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-extrabold text-base flex items-center gap-2 text-slate-900">
                  <ShoppingCart className="w-4 h-4 text-pink-500" /> My Checkout Cart
                </h3>
                <button onClick={() => setShowCartModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 font-bold mb-4">Your cart is empty.</p>
                  <button 
                    onClick={() => setShowCartModal(false)} 
                    className="bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Product rows */}
                  <div className="space-y-2.5 max-h-[25vh] overflow-y-auto p-1 bg-slate-50 rounded-xl">
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex gap-3 bg-white p-3 rounded-lg border border-slate-100 flex-wrap sm:flex-nowrap">
                        <img 
                          src={item.product.img} 
                          className="w-12 h-12 rounded object-contain bg-slate-50 cursor-pointer hover:opacity-80 transition-all" 
                          onClick={() => {
                            setViewingProduct(item.product);
                            setShowCartModal(false);
                            setShowCartPage(false);
                          }}
                          title="View Product Details"
                        />
                        <div className="flex-1 min-w-0">
                          <p 
                            className="font-extrabold text-xs text-slate-900 truncate cursor-pointer hover:text-pink-600 transition-colors"
                            onClick={() => {
                              setViewingProduct(item.product);
                              setShowCartModal(false);
                              setShowCartPage(false);
                            }}
                            title="View Product Details"
                          >
                            {item.product.name}
                          </p>
                          {item.color && (
                            <p className="text-[10px] text-slate-400 mt-0.5">Color: {item.color}</p>
                          )}
                          <p className="text-xs text-pink-500 font-extrabold mt-1">
                            ৳{item.product.discountPrice}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 border rounded-lg h-fit text-sm">
                          <button onClick={() => updateCartQty(item.cartId, item.qty - 1)} className="px-2 py-0.5 hover:bg-slate-200 font-extrabold">-</button>
                          <span className="font-bold w-6 text-center text-xs">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.cartId, item.qty + 1)} className="px-2 py-0.5 hover:bg-slate-200 font-extrabold">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-slate-300 hover:text-red-500 my-auto">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Recipient details form */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-150/80 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2.5 border-slate-100">
                      <MapPin className="w-4 h-4 text-pink-500 shrink-0" /> 
                      {lang === 'en' ? 'Shipping & Delivery Address' : 'শিপিং ও কুরিয়ার ঠিকানা'}
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                            {lang === 'en' ? 'Customer Name' : 'গ্রাহকের নাম'} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="text" 
                              disabled={isProfileMode}
                              className={`w-full font-semibold border rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-400 focus:border-pink-400 focus:outline-none transition-all ${
                                isProfileMode 
                                  ? 'bg-slate-50 text-slate-500 border-slate-205 cursor-not-allowed font-medium' 
                                  : 'bg-white border-slate-250 text-slate-800'
                              }`}
                              placeholder={lang === 'en' ? "Enter recipient name" : "অর্ডার রিসিভারের নাম লিখুন"}
                              value={currentName}
                              onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })}
                            />
                            {isProfileMode && (
                              <span className="absolute right-3 top-3 text-[10px] bg-green-50 text-green-600 border border-green-200/50 rounded-md px-1.5 py-0.5 leading-none font-bold">
                                ✓ Profile
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                            {lang === 'en' ? 'Phone Number' : 'মোবাইল নম্বর'} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="tel" 
                              disabled={isProfileMode}
                              className={`w-full font-semibold border rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-400 focus:border-pink-400 focus:outline-none transition-all ${
                                isProfileMode 
                                  ? 'bg-slate-50 text-slate-500 border-slate-205 cursor-not-allowed font-medium' 
                                  : 'bg-white border-slate-250 text-slate-800'
                              }`}
                              placeholder={lang === 'en' ? "e.g. 017XXXXXXXX" : "যেমন: ০১৭xxxxxxxx"}
                              value={currentPhone}
                              onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                            />
                            {isProfileMode && (
                              <span className="absolute right-3 top-3 text-[10px] bg-green-50 text-green-600 border border-green-200/50 rounded-md px-1.5 py-0.5 leading-none font-bold">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Selecting district auto adds dynamic delivery charge */}
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                          {lang === 'en' ? 'Select Delivery Region/District' : 'ডেলিভারি জেলা/এলাকা নির্বাচন করুন'} <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={checkoutDistrictId}
                          onChange={(e) => setCheckoutDistrictId(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-xl p-2.5 font-bold text-xs text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-pink-400 focus:border-pink-400"
                        >
                          <option value="">{lang === 'en' ? '-- Choose Location --' : '-- জেলা বা অঞ্চল নির্বাচন করুন --'}</option>
                          {deliveryCharges.map(dc => (
                            <option key={dc.id} value={dc.id}>{dc.district} ({lang === 'en' ? 'Delivery Fee' : 'ডেলিভারি চার্জ'}: ৳{dc.charge})</option>
                          ))}
                        </select>

                        {/* Dynamic Charge visualizer badge inside form card */}
                        {checkoutDistrictId ? (
                          <div className="mt-2 flex items-center justify-between text-xs font-bold text-indigo-750 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 animate-fade-in">
                            <span className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              {lang === 'en' ? 'Selected Area Delivery Fee:' : 'আপনার নির্বাচিত এলাকার কুরিয়ার চার্জ:'}
                            </span>
                            <span className="text-sm font-black text-indigo-900">
                              ৳{deliveryCharges.find(dc => dc.id === checkoutDistrictId)?.charge || 0}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[9.5px] text-slate-400 font-bold mt-1 leading-normal italic">
                            {lang === 'en' 
                              ? '* Select district to automatically calculate real-time home delivery fee.' 
                              : '* কুরিয়ার চার্জ হিসাব ও ডেলিভারি সঠিকভাবে নির্ধারণ করতে জেলা নির্বাচন করুন।'}
                          </p>
                        )}
                      </div>

                      {/* Detailed Courier Address */}
                      <div>
                        <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
                          {lang === 'en' ? 'Full Courier Address' : 'বিস্তারিত কুরিয়ার ঠিকানা'} <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          rows={2} 
                          disabled={isProfileMode}
                          className={`w-full font-semibold border rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-400 focus:border-pink-400 focus:outline-none leading-snug transition-all ${
                            isProfileMode 
                              ? 'bg-slate-50 text-slate-500 border-slate-205 cursor-not-allowed font-medium' 
                              : 'bg-white border-slate-250 text-slate-800'
                          }`}
                          placeholder={lang === 'en' 
                            ? "e.g. Area, House No, Road, Ward No, Police Station" 
                            : "যেমন: হাউজ নং, রোড নং, থানা, উপ-জেলা ও জেলা"}
                          value={currentAddress}
                          onChange={(e) => setGuestDetails({ ...guestDetails, address: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Tickbox Options beneath the form */}
                    {loggedCustomer ? (
                      <div className="pt-2 border-t border-slate-100 flex items-center mt-2">
                        <label className="relative flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={useProfileInfo}
                            onChange={(e) => handleToggleUseProfileInfo(e.target.checked)}
                          />
                          <div className="w-4 h-4 rounded border border-slate-300 bg-white peer-checked:bg-pink-500 peer-checked:border-pink-500 flex items-center justify-center transition-all">
                            <svg className="w-2.5 h-2.5 text-white stroke-[3.5] stroke-current" fill="none" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-extrabold text-slate-700 select-none group-hover:text-slate-900 transition-colors">
                            {lang === 'en' ? 'Use my profile information' : 'আমার অ্যাকাউন্ট প্রোফাইলের তথ্য ব্যবহার করুন'}
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                        <Lock className="w-3 h-3 text-slate-300" />
                        {lang === 'en' 
                          ? 'Logging in allows you to autofill checkout details from saved profile.' 
                          : 'লগইন থাকলে আপনার প্রোফাইল থেকে এই ফর্মটি স্বয়ংক্রিয়ভাবে পূরণ হতো।'}
                      </div>
                    )}
                  </div>

                                  {/* Advance Payment Details Section */}
                  {(() => {
                    const matchedDistrict = deliveryCharges.find(dc => dc.id === checkoutDistrictId);
                    const deliveryCostAmount = matchedDistrict ? matchedDistrict.charge : 0;

                    let totalAdvanceRequired = 0;
                    if (advanceConfig && advanceConfig.requireAdvance) {
                      if (advanceConfig.amountType === 'delivery') {
                        totalAdvanceRequired = deliveryCostAmount;
                      } else {
                        totalAdvanceRequired = advanceConfig.fixedAmount || 0;
                      }
                    } else {
                      totalAdvanceRequired = cart.reduce((sum, item) => {
                        if (item.product.requireAdvance) {
                          return sum + (item.product.advanceAmount || 0) * item.qty;
                        }
                        return sum;
                      }, 0);
                    }

                    if (totalAdvanceRequired <= 0) return null;
                    if (!clickedPayToConfirm) return null;

                    // Filter only active channels
                    const activeChannels = advanceConfig.channels ? advanceConfig.channels.filter(c => c.isActive) : [];

                    return (
                      <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/50 space-y-3.5 text-xs">
                        <h4 className="font-extrabold text-xs text-amber-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-amber-200/30 pb-1.5 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 3. Security Advance Required
                        </h4>
                        
                        <div className="bg-amber-100/40 p-2.5 rounded-xl text-amber-900 font-bold leading-relaxed text-[11px]">
                          {advanceConfig.instructionText || `অগ্রিম পেমেন্ট ৳${totalAdvanceRequired} আবশ্যক। নিচে দেয়া যেকোনো একটি মাধ্যমে সেন্ড মানি বা ট্রান্সফার করে ট্রানজেকশন আইডি প্রদান করুন।`}
                          {advanceConfig.amountType === 'delivery' && (
                            <span className="block mt-1 font-extrabold text-rose-700">
                              (অগ্রিম পরিমাণ = আপনার জেলাপাড়া ডেলিভারি চার্জ ৳<b>{totalAdvanceRequired}</b>)
                            </span>
                          )}
                        </div>

                        {activeChannels.length > 0 ? (
                          <>
                            {/* Account detail columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-500 bg-white p-2.5 rounded-xl border border-amber-100 font-medium">
                              {activeChannels.map((chan, idx) => (
                                <div key={chan.id} className={`flex flex-col p-1 ${idx >= 2 ? 'border-t sm:border-t-0 border-slate-100 pt-1.5 sm:pt-1' : ''} ${idx % 2 === 0 ? 'sm:border-r border-slate-100 sm:pr-2' : 'sm:pl-2'}`}>
                                  <span className="font-bold text-slate-900 flex items-center gap-1">
                                    {chan.name} 
                                    <span className="text-[8px] uppercase font-bold text-orange-600 bg-orange-50 px-1 rounded-sm leading-none py-0.5">{chan.methodType}</span>
                                  </span>
                                  <span className="font-mono text-slate-800 font-bold mt-0.5 select-all">{chan.accountNumber}</span>
                                </div>
                              ))}
                            </div>

                            {/* Selection tab pills */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Payment Channel</label>
                              <div className="flex flex-wrap gap-1.5">
                                {activeChannels.map(chan => (
                                  <button
                                    key={chan.id}
                                    type="button"
                                    onClick={() => setCheckoutPaymentMethod(chan.name)}
                                    className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider border cursor-pointer ${
                                      checkoutPaymentMethod === chan.name 
                                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' 
                                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    {chan.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-[10px] text-slate-400 font-semibold text-center border p-4 rounded-xl bg-white">
                            No channels active currently. Please contact administrator for offline confirmation.
                          </div>
                        )}

                        {checkoutPaymentMethod !== 'COD' && (
                          <div className="space-y-1.5 pt-0.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sender's Transaction ID (TxID)</label>
                            <input 
                              type="text"
                              className="form-input text-xs uppercase font-mono tracking-widest placeholder-slate-350"
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
                    const matchedDistrict = deliveryCharges.find(dc => dc.id === checkoutDistrictId);
                    const deliveryCostAmount = matchedDistrict ? matchedDistrict.charge : 0;
                    const finalTotalSum = Math.max(0, cartSubtotal - promoDiscountAmount) + deliveryCostAmount;

                    let totalAdvanceRequired = 0;
                    if (advanceConfig && advanceConfig.requireAdvance) {
                      if (advanceConfig.amountType === 'delivery') {
                        totalAdvanceRequired = deliveryCostAmount;
                      } else {
                        totalAdvanceRequired = advanceConfig.fixedAmount || 0;
                      }
                    } else {
                      totalAdvanceRequired = cart.reduce((sum, item) => {
                        if (item.product.requireAdvance) {
                          return sum + (item.product.advanceAmount || 0) * item.qty;
                        }
                        return sum;
                      }, 0);
                    }

                    const isAdvanceEnabled = totalAdvanceRequired > 0;

                    return (
                      <div className="border-t pt-4 space-y-3 bg-white">
                        {/* Promo Code Apply Section */}
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-2 mb-4 space-y-2 text-xs">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                            {lang === 'en' ? 'Have a Promo Code?' : 'প্রোমো কোড আছে কি?'}
                          </label>
                          {appliedPromo ? (
                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-250 p-2.5 rounded-lg text-xs leading-none animate-fade-in">
                              <span className="font-extrabold text-emerald-800 flex items-center gap-1.5 font-mono">
                                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                                {appliedPromo.code} {lang === 'en' ? 'Applied' : 'প্রযুক্ত হয়েছে'} (-৳{promoDiscountAmount})
                              </span>
                              <button
                                type="button"
                                onClick={handleRemovePromoCode}
                                className="text-red-500 hover:text-red-700 font-extrabold focus:outline-none p-1 cursor-pointer"
                                title={lang === 'en' ? "Remove Code" : "কোড সরান"}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={promoCodeInput}
                                onChange={(e) => setPromoCodeInput(e.target.value)}
                                placeholder={lang === 'en' ? "e.g. FLASH100" : "যেমন: FLASH100"}
                                className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                              />
                              <button
                                type="button"
                                onClick={handleApplyPromoCode}
                                className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer transition-colors"
                              >
                                {lang === 'en' ? 'Apply' : 'প্রয়োগ'}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-500 font-bold">Subtotal</span>
                          <span className="text-[15px] font-bold text-slate-600">৳{cartSubtotal}</span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between items-center text-[11px] text-emerald-600 border-b pb-2 animate-fade-in font-semibold">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5 shrink-0" />
                              Promo Code Discount ({appliedPromo.code})
                            </span>
                            <span className="font-mono font-extrabold text-emerald-700">-৳{promoDiscountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[11px] text-slate-500 border-b pb-2 font-semibold">
                          <span>Delivery Charge ({matchedDistrict ? matchedDistrict.district : 'Not selected'})</span>
                          <span className="text-indigo-600 font-extrabold">৳{deliveryCostAmount}</span>
                        </div>
                        {isAdvanceEnabled && clickedPayToConfirm && (
                          <div className="flex justify-between text-[11px] text-amber-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 font-semibold animate-pulse">
                            <span className="flex items-center gap-1">🔔 Pending Advance Verification</span>
                            <span className="font-black text-amber-900">৳{totalAdvanceRequired}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-xs text-slate-800 font-black uppercase tracking-wider">Total Amount</span>
                          <span className="text-2xl font-black text-indigo-700">৳{finalTotalSum}</span>
                        </div>

                        {isAdvanceEnabled && !clickedPayToConfirm ? (
                          <button 
                            type="button"
                            onClick={() => {
                              if (!checkoutDistrictId) {
                                showNotif("Please select a Delivery District Region first.", "error");
                                return;
                              }
                              setClickedPayToConfirm(true);
                              showNotif("Security advance details loaded below. Please proceed with payment verification.", "success");
                            }}
                            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-extrabold py-3.5 rounded-xl uppercase hover:shadow-lg active:scale-95 text-xs tracking-wider cursor-pointer"
                          >
                            Pay to Confirm
                          </button>
                        ) : (
                          <button 
                            type="button"
                            onClick={handleCheckout}
                            className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold py-3.5 rounded-xl uppercase hover:shadow-lg active:scale-95 text-xs tracking-wider cursor-pointer"
                          >
                            Confirm Order
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Join Reseller Program App Modal */}
      <AnimatePresence>
        {showSellerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowSellerModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full max-w-md p-6 z-10 text-slate-800"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-extrabold text-base flex items-center gap-1 text-slate-900">
                  <UserCheck className="w-5 h-5 text-indigo-600" /> Partnership Application
                </h3>
                <button onClick={() => setShowSellerModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleJoinSellerSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Full Partner Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={sellerData.name}
                    onChange={(e) => setSellerData({ ...sellerData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Mobile Phone Contact</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    required 
                    value={sellerData.phone}
                    onChange={(e) => setSellerData({ ...sellerData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Brief Background (Reseller Experience)</label>
                  <textarea 
                    rows={3} 
                    className="form-input" 
                    placeholder="Provide details about your selling networks or offline reach..."
                    value={sellerData.details}
                    onChange={(e) => setSellerData({ ...sellerData, details: e.target.value })}
                  />
                </div>
                <div className="bg-slate-50 border p-3.5 rounded-xl text-[10px] text-slate-500 flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                  <span>Approved partners unlock specialized dashboard, custom markup pricing tools, KYC portals, and fast wallet payouts.</span>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider">
                  Request Activation Credentials
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Mobile Support Chat Modal Popup */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowSupportModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full max-w-sm overflow-hidden z-10 text-slate-800 font-display"
            >
              {/* Header */}
              <div className="bg-pink-500 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-pink-400 bg-white/10 flex items-center justify-center font-bold">
                    BW
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm leading-none">WhatsApp Support Desk</h4>
                    <p className="text-[10px] text-pink-100 mt-1">Available 24/7 for order updates</p>
                  </div>
                </div>
                <button onClick={() => setShowSupportModal(false)} className="text-white hover:opacity-85 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat area */}
              <div className="p-5 space-y-4 bg-slate-50">
                <div className="bg-pink-50/50 p-4 border border-pink-100 rounded-2xl">
                  <p className="text-xs font-bold text-pink-950">Assalamu Alaikum 🙏</p>
                  <p className="text-xs text-pink-600 mt-1 leading-relaxed">
                    Welcome to <b>DEALY</b>. How can we assist you with your orders or delivery today?
                  </p>
                </div>
                <a 
                  href="https://wa.me/8801735165971" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 active:scale-95 transition-all text-center cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> Message on WhatsApp Direct
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </div>
  );

  function handleBuyNow(prod: Product, q: number, col: string) {
    const cartId = `${prod.id}_${col}`;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.cartId === cartId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + q };
        return next;
      }
      return [...prev, { product: prod, qty: q, color: col, cartId }];
    });
    if (window.innerWidth < 768) {
      setViewingProduct(null);
      setShowCartPage(true);
      setIsCheckingOut(true);
    } else {
      setShowCartModal(true);
    }
  }
}
