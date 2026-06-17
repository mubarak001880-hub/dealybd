import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Box, Layers, Bolt, Images, Truck, DollarSign, Users, ShieldCheck, LogOut, Plus, Trash2, 
  Edit, Ban, FileText, Check, X, ShieldAlert, CheckCircle, Clock, Calendar, Edit3, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Tag,
  ShoppingBag, Upload, UserCheck, Award, HelpCircle
} from 'lucide-react';
import { TinyInvoiceDetails } from './TinyInvoiceDetails';
import { User, Product, Category, Order, Banner, SellerApp, Withdrawal, OrderStatus, TrackingEvent, SpecialOffer, DeliveryCharge, FooterConfig, PopupImage, ResellerPageConfig, ResellerSubscriptionOption, ResellerFAQ, ResellerBenefitCard, AdvanceConfig, PaymentChannel, PromoCode, FlashOfferSetting, AffiliateTask, AffiliateSubmission, AffiliateAccount } from '../types';
import { formatResellerId, formatSellerId } from '../idUtils';
import { getDhakaDate, formatToDhakaTime, formatToDhakaDateOnly } from '../dateUtils';

interface AdminPanelProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  resellerBanners?: Banner[];
  setResellerBanners?: React.Dispatch<React.SetStateAction<Banner[]>>;
  popupImages?: PopupImage[];
  setPopupImages?: React.Dispatch<React.SetStateAction<PopupImage[]>>;
  bannerHeight: string;
  setBannerHeight: React.Dispatch<React.SetStateAction<string>>;
  sellerApps: SellerApp[];
  setSellerApps: React.Dispatch<React.SetStateAction<SellerApp[]>>;
  withdrawals: Withdrawal[];
  setWithdrawals: React.Dispatch<React.SetStateAction<Withdrawal[]>>;
  specialOffers: SpecialOffer[];
  setSpecialOffers: React.Dispatch<React.SetStateAction<SpecialOffer[]>>;
  deliveryCharges: DeliveryCharge[];
  setDeliveryCharges: React.Dispatch<React.SetStateAction<DeliveryCharge[]>>;
  footerConfig: FooterConfig;
  setFooterConfig: React.Dispatch<React.SetStateAction<FooterConfig>>;
  resellerPageConfig?: ResellerPageConfig;
  setResellerPageConfig?: React.Dispatch<React.SetStateAction<ResellerPageConfig>>;
  resellerSubscriptions?: ResellerSubscriptionOption[];
  setResellerSubscriptions?: React.Dispatch<React.SetStateAction<ResellerSubscriptionOption[]>>;
  resellerBenefits?: ResellerBenefitCard[];
  setResellerBenefits?: React.Dispatch<React.SetStateAction<ResellerBenefitCard[]>>;
  resellerFAQs?: ResellerFAQ[];
  setResellerFAQs?: React.Dispatch<React.SetStateAction<ResellerFAQ[]>>;
  advanceConfig: AdvanceConfig;
  setAdvanceConfig: React.Dispatch<React.SetStateAction<AdvanceConfig>>;
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  flashOfferSettings?: FlashOfferSetting[];
  setFlashOfferSettings?: React.Dispatch<React.SetStateAction<FlashOfferSetting[]>>;
  onLogout: () => void;
  showNotif: (msg: string, type: 'success' | 'error') => void;

  affiliateRatePerClick: number;
  setAffiliateRatePerClick: React.Dispatch<React.SetStateAction<number>>;
  affiliateMinWithdrawal: number;
  setAffiliateMinWithdrawal: React.Dispatch<React.SetStateAction<number>>;
  affiliateTasks: AffiliateTask[];
  setAffiliateTasks: React.Dispatch<React.SetStateAction<AffiliateTask[]>>;
  affiliateSubmissions: AffiliateSubmission[];
  setAffiliateSubmissions: React.Dispatch<React.SetStateAction<AffiliateSubmission[]>>;
  affiliateAccounts: AffiliateAccount[];
  setAffiliateAccounts: React.Dispatch<React.SetStateAction<AffiliateAccount[]>>;
  resellerReferralReward?: number;
  setResellerReferralReward?: React.Dispatch<React.SetStateAction<number>>;
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

const compressImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024, quality = 0.65, keepTransparency = false): Promise<string> => {
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
        if (!keepTransparency) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          // Preserve transparency and use png format
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
        }
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

export default function AdminPanel({
  users,
  setUsers,
  products,
  setProducts,
  categories,
  setCategories,
  orders,
  setOrders,
  banners,
  setBanners,
  resellerBanners = [],
  setResellerBanners,
  popupImages = [],
  setPopupImages,
  bannerHeight,
  setBannerHeight,
  sellerApps,
  setSellerApps,
  withdrawals,
  setWithdrawals,
  specialOffers,
  setSpecialOffers,
  deliveryCharges,
  setDeliveryCharges,
  footerConfig,
  setFooterConfig,
  resellerPageConfig,
  setResellerPageConfig,
  resellerSubscriptions = [],
  setResellerSubscriptions,
  resellerBenefits = [],
  setResellerBenefits,
  resellerFAQs = [],
  setResellerFAQs,
  advanceConfig,
  setAdvanceConfig,
  promoCodes,
  setPromoCodes,
  flashOfferSettings = [],
  setFlashOfferSettings,
  onLogout,
  showNotif,
  affiliateRatePerClick,
  setAffiliateRatePerClick,
  affiliateMinWithdrawal,
  setAffiliateMinWithdrawal,
  affiliateTasks,
  setAffiliateTasks,
  affiliateSubmissions,
  setAffiliateSubmissions,
  affiliateAccounts,
  setAffiliateAccounts,
  resellerReferralReward = 100,
  setResellerReferralReward
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'flash' | 'banners' | 'popup_images' | 'orders' | 'reseller_orders' | 'withdrawals' | 'users' | 'apps' | 'offers' | 'delivery_charges' | 'footer_customize' | 'reseller_page' | 'advance_payment' | 'promo_codes' | 'flash_offers_settings' | 'affiliate' | 'manage_sellers' | 'seller_product_reviews' | 'seller_orders'>('dashboard');
  const [bannerSubTab, setBannerSubTab] = useState<'customer' | 'reseller'>('customer');

  // Customer Direct Orders & Reseller Orders sub-status filters
  const [custOrderFilter, setCustOrderFilter] = useState<'all' | 'Pending' | 'Approved' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'>('all');
  const [resellerOrderFilter, setResellerOrderFilter] = useState<'all' | 'Pending' | 'Approved' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'>('all');
  const [sellerOrderFilter, setSellerOrderFilter] = useState<'all' | 'Pending' | 'Approved' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'>('all');
  const [resellerFilter, setResellerFilter] = useState<'all' | 'approved' | 'pending' | 'verified' | 'unverified'>('all');
  const [adminOrderToCancel, setAdminOrderToCancel] = useState<string | null>(null);

  // Creation State managers
  const [newProd, setNewProd] = useState<Omit<Product, 'id'>>({
    catId: '', name: '', description: '', img: '', originalPrice: 0, discountPrice: 0,
    buyRate: 0, minSellRate: 0, defaultSellRate: 0, rating: 5.0, sales: 0, inStock: true, isFlash: false, colors: [],
    requireAdvance: false, advanceAmount: 0
  });
  const [newCat, setNewCat] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', pass: '' });
  const [showNewUserPass, setShowNewUserPass] = useState(false);
  const [colorTag, setColorTag] = useState('');

  // Affiliate task creation/editing states
  const [affTaskTitle, setAffTaskTitle] = useState('');
  const [affTaskDesc, setAffTaskDesc] = useState('');
  const [affTaskReward, setAffTaskReward] = useState<number>(10);
  const [affTaskPlatform, setAffTaskPlatform] = useState<'Facebook' | 'YouTube' | 'Telegram' | 'TikTok' | 'Google' | 'Custom'>('Facebook');
  const [editingAffTaskId, setEditingAffTaskId] = useState<string | null>(null);
  const [affTaskProofType, setAffTaskProofType] = useState<'link' | 'screenshot' | 'both'>('both');

  // Special Offer creation states
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerBadge, setOfferBadge] = useState('');
  const [offerAction, setOfferAction] = useState('');
  const [offerCat, setOfferCat] = useState('');
  const [offerTheme, setOfferTheme] = useState<'cyan' | 'orange' | 'pink' | 'emerald' | 'purple'>('pink');

  // Editing State overrides
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUserKyc, setViewingUserKyc] = useState<User | null>(null);
  const [editingSellerForStats, setEditingSellerForStats] = useState<User | null>(null);
  const [editSellerRating, setEditSellerRating] = useState<number>(92);
  const [editSellerFollowers, setEditSellerFollowers] = useState<string>('2.5k');
  const [editSellerShipOnTime, setEditSellerShipOnTime] = useState<number>(95);
  const [editSellerChatResponse, setEditSellerChatResponse] = useState<number>(90);

  // Seller registration payment configuration states
  const [sellPayOn, setSellPayOn] = useState(footerConfig.sellerPayEnabled ?? false);
  const [sellPayAmt, setSellPayAmt] = useState(footerConfig.sellerPayAmount ?? 500);
  const [sellPayTerm, setSellPayTerm] = useState(footerConfig.sellerPayValidity ?? "১ বছর");
  const [sellPayBKash, setSellPayBKash] = useState(footerConfig.sellerPayNumberBKash ?? "");
  const [sellPayNagad, setSellPayNagad] = useState(footerConfig.sellerPayNumberNagad ?? "");
  const [sellPayRocket, setSellPayRocket] = useState(footerConfig.sellerPayNumberRocket ?? "");
  const [expandedSellerId, setExpandedSellerId] = useState<string | null>(null);

  // Active Logistics Tracking Stage manager state
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [trackingNote, setTrackingNote] = useState('');
  const [trackingStage, setTrackingStage] = useState<OrderStatus>('Pending');

  // KYC Reject Notes
  const [kycRejectNote, setKycRejectNote] = useState('');
  const [showKycRejectInput, setShowKycRejectInput] = useState(false);

  // Dynamic Reseller Customizer States
  const [resellerSubTab, setResellerSubTab] = useState<'content' | 'subscriptions' | 'faqs' | 'benefits' | 'referrals'>('content');

  // Subscription Sub-tab States
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subFormName, setSubFormName] = useState('');
  const [subFormPrice, setSubFormPrice] = useState('');
  const [subFormDuration, setSubFormDuration] = useState('');
  const [subFormFeatures, setSubFormFeatures] = useState('');
  const [subFormActive, setSubFormActive] = useState(true);

  // Promo Code States
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoFormCode, setPromoFormCode] = useState('');
  const [promoFormDiscountType, setPromoFormDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [promoFormDiscountValue, setPromoFormDiscountValue] = useState<number>(0);
  const [promoFormMaxUses, setPromoFormMaxUses] = useState<number>(100);
  const [promoFormIsActive, setPromoFormIsActive] = useState(true);

  // FAQ Sub-tab States
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqFormQuest, setFAQFormQuest] = useState('');
  const [faqFormAns, setFAQFormAns] = useState('');

  // Advance Payment Channels & config state managers
  const [editingChanId, setEditingChanId] = useState<string | null>(null);
  const [chanName, setChanName] = useState('');
  const [chanNumber, setChanNumber] = useState('');
  const [chanMethod, setChanMethod] = useState('Send Money');
  const [chanActive, setChanActive] = useState(true);


  // Benefit Sub-tab States
  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);
  const [benefitFormTitle, setBenefitFormTitle] = useState('');
  const [benefitFormDesc, setBenefitFormDesc] = useState('');
  const [benefitFormIcon, setBenefitFormIcon] = useState('UserCheck');


  // Campaign-specific product quick-add states
  const [campSelectedOfferId, setCampSelectedOfferId] = useState('');
  const [campProdName, setCampProdName] = useState('');
  const [campProdDesc, setCampProdDesc] = useState('');
  const [campOriginalPrice, setCampOriginalPrice] = useState<number>(0);
  const [campDiscountPrice, setCampDiscountPrice] = useState<number>(0);
  const [campBuyRate, setCampBuyRate] = useState<number>(0);
  const [campMinSellRate, setCampMinSellRate] = useState<number>(0);
  const [campDefaultSellRate, setCampDefaultSellRate] = useState<number>(0);
  const [campProdImg, setCampProdImg] = useState('');
  const [campColorsText, setCampColorsText] = useState('');

  // Delivery Charges Config States
  const [dcDistrictInput, setDcDistrictInput] = useState('');
  const [dcChargeInput, setDcChargeInput] = useState<number>(60);
  const [dcEditingId, setDcEditingId] = useState<string | null>(null);

  // Stats Calculations
  const platformRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const platformResellProfits = orders.reduce((s, o) => s + (o.profit || 0), 0);
  const activeResellersCount = users.filter(u => u.role === 'user').length;

  const handleCategoryImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 400, 0.7);
        setNewCatImg(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCategoryImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingCategory) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 400, 0.7);
        setEditingCategory({ ...editingCategory, image: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImgUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 800, 800, 0.7);
        if (isEdit && editingProduct) {
          setEditingProduct({ ...editingProduct, img: compressed });
        } else {
          setNewProd({ ...newProd, img: compressed });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductExtraImgsUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const pFiles = Array.from(files) as File[];
      const loadedImages: string[] = [];
      let processed = 0;
      
      pFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string, 800, 800, 0.7);
          loadedImages.push(compressed);
          processed++;
          if (processed === pFiles.length) {
            if (isEdit && editingProduct) {
              const currentList = editingProduct.images || [];
              setEditingProduct({ ...editingProduct, images: [...currentList, ...loadedImages] });
            } else {
              const currentList = newProd.images || [];
              setNewProd({ ...newProd, images: [...currentList, ...loadedImages] });
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeProductExtraImg = (index: number, isEdit: boolean) => {
    if (isEdit && editingProduct) {
      const list = (editingProduct.images || []).filter((_, idx) => idx !== index);
      setEditingProduct({ ...editingProduct, images: list });
    } else {
      const list = (newProd.images || []).filter((_, idx) => idx !== index);
      setNewProd({ ...newProd, images: list });
    }
  };

  const handleCampProductImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 800, 800, 0.7);
        setCampProdImg(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Banners should maintain high width but compressed
        const compressed = await compressImage(reader.result as string, 1200, 500, 0.65);
        const newBan: Banner = {
          id: 'b_' + Date.now(),
          img: compressed,
          isActive: true
        };
        setBanners(prev => [...prev, newBan]);
        showNotif("E-commerce carousel banner added.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResellerBannerImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setResellerBanners) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 1200, 500, 0.65);
        const newBan: Banner = {
          id: 'rb_' + Date.now(),
          img: compressed,
          isActive: true
        };
        setResellerBanners(prev => [...prev, newBan]);
        showNotif("Reseller marketing banner added successfully.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePopupImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setPopupImages) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Popups are usually square or portrait, compressible
        const compressed = await compressImage(reader.result as string, 600, 1000, 0.7);
        const newPopup: PopupImage = {
          id: 'p_' + Date.now(),
          img: compressed,
          link: '',
          isActive: true
        };
        setPopupImages(prev => [...prev, newPopup]);
        showNotif("Promotional popup image added.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Reseller Customizer Mutation Handles
  const updateResellerPageValue = (key: keyof ResellerPageConfig, val: string) => {
    if (setResellerPageConfig && resellerPageConfig) {
      setResellerPageConfig({
        ...resellerPageConfig,
        [key]: val
      });
    }
  };

  const saveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setResellerSubscriptions) return;

    const parsedFeatures = subFormFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (editingSubId) {
      // Edit mode
      setResellerSubscriptions(prev =>
        prev.map(s => s.id === editingSubId
          ? { ...s, name: subFormName, price: subFormPrice, duration: subFormDuration, features: parsedFeatures, isActive: subFormActive }
          : s
        )
      );
      showNotif("Subscription Package altered successfully", "success");
    } else {
      // Create mode
      const newSub: ResellerSubscriptionOption = {
        id: 'sub_' + Date.now(),
        name: subFormName,
        price: subFormPrice,
        duration: subFormDuration,
        features: parsedFeatures,
        isActive: subFormActive
      };
      setResellerSubscriptions(prev => [...prev, newSub]);
      showNotif("Subscription Package created successfully", "success");
    }

    // Reset Form
    setEditingSubId(null);
    setSubFormName('');
    setSubFormPrice('');
    setSubFormDuration('');
    setSubFormFeatures('');
    setSubFormActive(true);
  };

  const deleteSubscription = (id: string) => {
    if (!setResellerSubscriptions) return;
    setResellerSubscriptions(prev => prev.filter(s => s.id !== id));
    showNotif("Subscription Package deleted", "error");
  };

  const editSubscriptionInitiate = (sub: ResellerSubscriptionOption) => {
    setEditingSubId(sub.id);
    setSubFormName(sub.name);
    setSubFormPrice(sub.price);
    setSubFormDuration(sub.duration);
    setSubFormFeatures(sub.features.join('\n'));
    setSubFormActive(sub.isActive);
  };

  const toggleSubscriptionActive = (id: string) => {
    if (!setResellerSubscriptions) return;
    setResellerSubscriptions(prev =>
      prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    );
    showNotif("Subscription active status toggled", "success");
  };

  // Promo Code CRUD Operations
  const savePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoFormCode.trim().toUpperCase();
    if (!cleanCode) {
      showNotif("Please enter a valid promo code title.", "error");
      return;
    }
    if (promoFormDiscountValue <= 0) {
      showNotif("Discount value must be greater than 0.", "error");
      return;
    }
    if (promoFormDiscountType === 'percent' && promoFormDiscountValue > 100) {
      showNotif("Percentage discount value cannot exceed 100%.", "error");
      return;
    }
    if (promoFormMaxUses <= 0) {
      showNotif("Maximum uses must be greater than 0.", "error");
      return;
    }

    if (editingPromoId) {
      // Edit Mode
      setPromoCodes(prev =>
        prev.map(p => p.id === editingPromoId
          ? {
              ...p,
              code: cleanCode,
              discountType: promoFormDiscountType,
              discountValue: promoFormDiscountValue,
              maxUses: promoFormMaxUses,
              isActive: promoFormIsActive
            }
          : p
        )
      );
      showNotif(`Promo Code "${cleanCode}" updated successfully!`, "success");
    } else {
      // Check duplicate
      if (promoCodes.some(p => p.code === cleanCode)) {
        showNotif(`Promo Code "${cleanCode}" already exists!`, "error");
        return;
      }
      // Create Mode
      const newPromo: PromoCode = {
        id: 'promo_' + Date.now(),
        code: cleanCode,
        discountType: promoFormDiscountType,
        discountValue: promoFormDiscountValue,
        maxUses: promoFormMaxUses,
        usedCount: 0,
        isActive: promoFormIsActive
      };
      setPromoCodes(prev => [...prev, newPromo]);
      showNotif(`Promo Code "${cleanCode}" created successfully!`, "success");
    }

    // Reset Form
    setEditingPromoId(null);
    setPromoFormCode('');
    setPromoFormDiscountType('fixed');
    setPromoFormDiscountValue(0);
    setPromoFormMaxUses(100);
    setPromoFormIsActive(true);
  };

  const deletePromoCode = (id: string) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      setPromoCodes(prev => prev.filter(p => p.id !== id));
      showNotif("Promo Code deleted successfully.", "success");
    }
  };

  const editPromoCodeInitiate = (promo: PromoCode) => {
    setEditingPromoId(promo.id);
    setPromoFormCode(promo.code);
    setPromoFormDiscountType(promo.discountType);
    setPromoFormDiscountValue(promo.discountValue);
    setPromoFormMaxUses(promo.maxUses);
    setPromoFormIsActive(promo.isActive);
  };

  const togglePromoCodeActive = (id: string) => {
    setPromoCodes(prev =>
      prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p)
    );
    showNotif("Promo code state updated.", "success");
  };

  // FAQ CRUD Handle operations
  const saveFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setResellerFAQs) return;

    if (editingFaqId) {
      setResellerFAQs(prev =>
        prev.map(f => f.id === editingFaqId
          ? { ...f, question: faqFormQuest, answer: faqFormAns }
          : f
        )
      );
      showNotif("FAQ updated successfully", "success");
    } else {
      const newFaq: ResellerFAQ = {
        id: 'faq_' + Date.now(),
        question: faqFormQuest,
        answer: faqFormAns
      };
      setResellerFAQs(prev => [...prev, newFaq]);
      showNotif("New FAQ added", "success");
    }

    setEditingFaqId(null);
    setFAQFormQuest('');
    setFAQFormAns('');
  };

  const deleteFAQ = (id: string) => {
    if (!setResellerFAQs) return;
    setResellerFAQs(prev => prev.filter(f => f.id !== id));
    showNotif("FAQ removed", "error");
  };

  const initiateFAQEdit = (faq: ResellerFAQ) => {
    setEditingFaqId(faq.id);
    setFAQFormQuest(faq.question);
    setFAQFormAns(faq.answer);
  };

  // Benefit step edit
  const saveBenefit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setResellerBenefits || !editingBenefitId) return;

    setResellerBenefits(prev =>
      prev.map(b => b.id === editingBenefitId
        ? { ...b, title: benefitFormTitle, desc: benefitFormDesc, iconName: benefitFormIcon }
        : b
      )
    );
    showNotif("Benefit card configured", "success");
    setEditingBenefitId(null);
    setBenefitFormTitle('');
    setBenefitFormDesc('');
    setBenefitFormIcon('UserCheck');
  };

  const initiateBenefitEdit = (benefit: ResellerBenefitCard) => {
    setEditingBenefitId(benefit.id);
    setBenefitFormTitle(benefit.title);
    setBenefitFormDesc(benefit.desc);
    setBenefitFormIcon(benefit.iconName);
  };


  // Color Variant selectors helper
  const addColorVariant = (isEdit: boolean) => {
    const term = colorTag.trim();
    if (!term) return;
    if (isEdit && editingProduct) {
      const colors = [...(editingProduct.colors || [])];
      if (!colors.includes(term)) colors.push(term);
      setEditingProduct({ ...editingProduct, colors });
    } else {
      const colors = [...(newProd.colors || [])];
      if (!colors.includes(term)) colors.push(term);
      setNewProd({ ...newProd, colors });
    }
    setColorTag('');
  };

  const removeColorVariant = (term: string, isEdit: boolean) => {
    if (isEdit && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        colors: (editingProduct.colors || []).filter(c => c !== term)
      });
    } else {
      setNewProd({
        ...newProd,
        colors: (newProd.colors || []).filter(c => c !== term)
      });
    }
  };

  // CRUD ops
  const createProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.catId || !newProd.img) {
      showNotif("Complete title, categories and imagery blocks.", "error");
      return;
    }
    const finalProd: Product = {
      ...newProd,
      id: 'p_' + Date.now()
    };
    setProducts(prev => [finalProd, ...prev]);
    setNewProd({
      catId: '', name: '', description: '', img: '', originalPrice: 0, discountPrice: 0,
      buyRate: 0, minSellRate: 0, defaultSellRate: 0, rating: 5.0, sales: 0, inStock: true, isFlash: false, colors: [],
      requireAdvance: false, advanceAmount: 0
    });
    showNotif("Product catalog model compiled successfully.", "success");
  };

  const updateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    showNotif("Product updated.", "success");
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotif("Product model shredded.", "error");
  };

  const createCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const str = newCat.trim().toUpperCase();
    if (!str) return;
    const cat: Category = { id: 'cat_' + Date.now(), name: str, image: newCatImg || undefined };
    setCategories(prev => [cat, ...prev]);
    setNewCat('');
    setNewCatImg('');
    showNotif("Retail Category listed.", "success");
  };

  const updateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: editingCategory.name.toUpperCase(), image: editingCategory.image } : c));
    setEditingCategory(null);
    showNotif("Category altered successfully.", "success");
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showNotif("Category deleted.", "error");
  };

  const createReseller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.pass || !newUser.name) {
      showNotif("Fill partner details.", "error");
      return;
    }
    const reseller: User = {
      id: 'u_' + Date.now(),
      name: newUser.name,
      email: newUser.email,
      pass: newUser.pass,
      role: 'user',
      idCode: '#' + String(users.filter(u => u.role === 'user').length + 1).padStart(3, '0'),
      banned: false,
      balance: 0,
      kyc: { status: 'unverified' },
      activities: [],
      status: 'approved'
    };
    setUsers(prev => [...prev, reseller]);
    setNewUser({ name: '', email: '', pass: '' });
    showNotif("Reseller listed onto active database logs.", "success");
  };

  const updateReseller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    showNotif("User profile updated.", "success");
  };

  const toggleUserBanned = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, banned: !u.banned } : u));
    const target = users.find(u => u.id === id);
    showNotif(target?.banned ? "User unbanned." : "User restricted.", target?.banned ? "success" : "error");
  };

  // === DYNAMIC TRACKING TIMELINE WRITER ===
  const triggerLogisticsEditor = (order: Order) => {
    setSelectedOrderForTracking(order);
    setTrackingStage(order.status);
    
    // Find active milestone note
    const activeEv = order.timeline.find(e => e.status === order.status);
    setTrackingNote(activeEv?.description || '');
  };

  const commitTrackingChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForTracking) return;

    const oId = selectedOrderForTracking.id;
    const notesInput = trackingNote.trim() || `Milestone reached: ${trackingStage}`;
    const timestampStr = formatToDhakaTime();

    // Map timeline updates up to the selected stage
    const updatedOrders = orders.map((o) => {
      if (o.id !== oId) return o;

      const newTimeline: TrackingEvent[] = o.timeline.map((event) => {
        // Mark previous and current selected events as completed
        const stagesSeq: OrderStatus[] = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
        const selectedIdx = stagesSeq.indexOf(trackingStage);
        const thisIdx = stagesSeq.indexOf(event.status);

        if (thisIdx <= selectedIdx) {
          return {
            ...event,
            isCompleted: true,
            date: event.date || timestampStr,
            description: event.status === trackingStage ? notesInput : event.description
          };
        } else {
          return {
            ...event,
            isCompleted: false,
            date: ''
          };
        }
      });

      return {
        ...o,
        status: trackingStage,
        timeline: newTimeline
      };
    });

    setOrders(updatedOrders);

    // If marked as DELEVERED for a Reseller, credit commissions immediately
    if (trackingStage === 'Delivered' && selectedOrderForTracking.status !== 'Delivered') {
      if (selectedOrderForTracking.type === 'reseller' && selectedOrderForTracking.userId) {
        const pMargin = selectedOrderForTracking.profit || 0;
        if (pMargin > 0) {
          setUsers(prev => prev.map(u => {
            if (u.id === selectedOrderForTracking.userId) {
              const newBal = u.balance + pMargin;
              return {
                ...u,
                balance: newBal,
                activities: [
                  {
                    id: 'act_' + Date.now(),
                    date: timestampStr,
                    type: 'profit',
                    desc: `Delivered: ${selectedOrderForTracking.productName} + commission credited.`,
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
      showNotif(`Stage logs updated for tracking ID: ${selectedOrderForTracking.trackingId}`, "success");
    }

    setSelectedOrderForTracking(null);
  };

  const handleAdminCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled',
          timeline: [
            ...o.timeline,
            { status: 'Cancelled', date: formatToDhakaTime(), description: 'Order cancelled by Admin.', isCompleted: true }
          ]
        };
      }
      return o;
    }));
    showNotif("Order cancelled successfully.", "success");
  };

  const handleSaveSellerPayConfig = () => {
    setFooterConfig((prev) => ({
      ...prev,
      sellerPayEnabled: sellPayOn,
      sellerPayAmount: Number(sellPayAmt),
      sellerPayValidity: sellPayTerm,
      sellerPayNumberBKash: sellPayBKash,
      sellerPayNumberNagad: sellPayNagad,
      sellerPayNumberRocket: sellPayRocket
    }));
    showNotif("Merchant onboarding payment configuration updated successfully!", "success");
  };

  // Withdrawals Action Hub
  const approveWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved' } : w));
    showNotif("Payout approved. Funds dispatched.", "success");
  };

  const rejectWithdrawal = (id: string) => {
    const wd = withdrawals.find(w => w.id === id);
    if (!wd) return;

    // Refund standard balance to the user
    setUsers(prev => prev.map(u => {
      if (u.id === wd.userId) {
        return {
          ...u,
          balance: u.balance + wd.amount,
          activities: [
            {
              id: 'act_' + Date.now(),
              date: formatToDhakaTime(),
              type: 'profit', // Treated as credit adjust
              desc: `Payout extraction rejected. ৳${wd.amount} returned to cleared ledger.`,
              amount: wd.amount
            },
            ...(u.activities || [])
          ]
        };
      }
      return u;
    }));

    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected' } : w));
    showNotif("Payout rejected. Ledger holds refunded.", "error");
  };

  // KYC pipeline review
  const approveKyc = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      kyc: { status: 'verified', nidName: u.kyc.nidName, nidNumber: u.kyc.nidNumber, dob: u.kyc.dob }
    } : u));
    setViewingUserKyc(null);
    showNotif("Partner Identity Verification (KYC) approved.", "success");
  };

  const approveResellerSubscription = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        let expiryDate = '';
        const dur = u.pendingSubscription?.duration || '1 YEAR';
        const now = getDhakaDate(new Date());
        const normalized = dur.trim().toUpperCase();
        const match = normalized.match(/^(\d+)\s*(YEAR|YEARS|MONTH|MONTHS|DAY|DAYS)$/);
        
        if (match) {
          const val = parseInt(match[1], 10);
          const unit = match[2];
          if (unit.startsWith('YEAR')) {
            now.setFullYear(now.getFullYear() + val);
          } else if (unit.startsWith('MONTH')) {
            now.setMonth(now.getMonth() + val);
          } else if (unit.startsWith('DAY')) {
            now.setDate(now.getDate() + val);
          }
        } else {
          now.setFullYear(now.getFullYear() + 1);
        }
        
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        expiryDate = `${y}-${m}-${d}`;

        const updatedActivities = [
          {
            id: `act_${Date.now()}`,
            title: 'Subscription Activated',
            desc: `Subscription activated by admin for ${u.pendingSubscription?.packageName || 'Plan'}. Validity till ${expiryDate}.`,
            date: formatToDhakaDateOnly()
          },
          ...(u.activities || [])
        ];

        return {
          ...u,
          status: 'approved',
          subscriptionExpiresAt: expiryDate,
          activities: updatedActivities
        } as User;
      }
      return u;
    }));
    showNotif("Reseller account approved and subscription activated starting today!", "success");
  };

  const rejectKyc = (userId: string) => {
    const term = kycRejectNote.trim();
    if (!term) {
      showNotif("Please specify the document deficiency reason.", "error");
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      kyc: { status: 'rejected', rejectReason: term }
    } : u));
    setViewingUserKyc(null);
    setKycRejectNote('');
    setShowKycRejectInput(false);
    showNotif("KYC credentials marked deficient. Reseller notified.", "error");
  };

  const triggerKycReview = (usr: User) => {
    setViewingUserKyc(usr);
    setShowKycRejectInput(false);
    setKycRejectNote('');
  };

  // Applications
  const approvePartnerApp = (appId: string) => {
    const app = sellerApps.find(a => a.id === appId);
    if (!app) return;

    const rCode = '#' + String(users.filter(u => u.role === 'user').length + 1).padStart(3, '0');
    let updatedUsersList = [...users];
    let debugMessage = `Partner application approved! Logged code is: ${rCode}`;
    const parentCode = app.referredByCode ? app.referredByCode.trim().toUpperCase() : '';
    let foundParentId: string | null = null;

    if (parentCode) {
      const parentUserIndex = updatedUsersList.findIndex(u => 
        u.idCode.toUpperCase() === parentCode || 
        (u.phone && u.phone === parentCode)
      );

      if (parentUserIndex !== -1) {
        const parentUser = updatedUsersList[parentUserIndex];
        foundParentId = parentUser.idCode;
        const rewardAmount = resellerReferralReward ?? 100;
        const newAct = {
          id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          date: formatToDhakaDateOnly(),
          type: 'profit' as const,
          desc: `Referral Commission for approved reseller (${app.name})`,
          amount: rewardAmount
        };

        updatedUsersList[parentUserIndex] = {
          ...parentUser,
          balance: parentUser.balance + rewardAmount,
          activities: [newAct, ...(parentUser.activities || [])]
        };

        debugMessage += ` | Payout of ৳${rewardAmount} credited to ${parentUser.name} (${parentUser.idCode})`;
      }
    }

    const mockReseller: User = {
      id: 'u_' + Date.now(),
      name: app.name,
      phone: app.phone,
      email: `${app.phone}@dealy.com`, // Quick placeholder email
      pass: '123',
      role: 'user',
      idCode: rCode,
      referredBy: foundParentId || undefined,
      banned: false,
      balance: 0,
      kyc: { status: 'unverified' },
      activities: []
    };

    setUsers([...updatedUsersList, mockReseller]);
    setSellerApps(prev => prev.filter(a => a.id !== appId));
    showNotif(debugMessage, "success");
  };

  const getPendingCount = (tabId: string) => {
    switch (tabId) {
      case 'orders':
        return orders.filter(o => o.type !== 'reseller' && o.status === 'Pending').length;
      case 'reseller_orders':
        return orders.filter(o => o.type === 'reseller' && o.status === 'Pending').length;
      case 'withdrawals':
        return withdrawals.filter(w => w.status === 'pending').length;
      case 'apps':
        return sellerApps.length;
      case 'affiliate':
        return affiliateSubmissions.filter(s => s.status === 'pending').length;
      case 'users':
        return users.filter(u => u.kyc?.status === 'pending').length;
      case 'seller_product_reviews':
        return products.filter(p => p.approvalStatus === 'pending').length;
      case 'seller_orders':
        return orders.filter(o => o.sellerId && o.status === 'Pending').length;
      default:
        return 0;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* SIDEBAR CONTAINER */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col z-10 shadow-xl overflow-y-auto w-full max-w-[280px]">
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="w-9 h-9 bg-pink-500 rounded-lg flex items-center justify-center font-black">DL</div>
          <span className="font-extrabold text-lg flex flex-col leading-none">DEALY <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-widest">Global Admin</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Console Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'products', label: 'E-commerce Catalog', icon: <Box className="w-4 h-4" /> },
            { id: 'categories', label: 'Taxonomy Categories', icon: <Layers className="w-4 h-4" /> },
            { id: 'offers', label: 'Special Offers & Tags', icon: <Tag className="w-4 h-4" /> },
            { id: 'flash', label: 'Flash Campaign', icon: <Bolt className="w-4 h-4" /> },
            { id: 'flash_offers_settings', label: 'Flash Sale Config Settings', icon: <Bolt className="w-4 h-4 text-amber-500 font-bold animate-pulse" /> },
            { id: 'banners', label: 'Distributor Carousel', icon: <Images className="w-4 h-4" /> },
            { id: 'popup_images', label: 'Popup Images', icon: <Images className="w-4 h-4 text-pink-400" /> },
            { id: 'orders', label: 'Customer Orders', icon: <Truck className="w-4 h-4" /> },
            { id: 'reseller_orders', label: 'Reseller Orders', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'delivery_charges', label: 'Delivery Charges Set', icon: <Truck className="w-4 h-4 text-emerald-400" /> },
            { id: 'advance_payment', label: 'Advance Payment Config', icon: <Bolt className="w-4 h-4 text-orange-400 font-bold" /> },
            { id: 'promo_codes', label: 'Promo Codes Settings', icon: <Tag className="w-4 h-4 text-yellow-400 font-bold" /> },
            { id: 'footer_customize', label: 'Reseller Support & Links', icon: <FileText className="w-4 h-4 text-pink-400 animate-pulse font-bold" /> },
            { id: 'withdrawals', label: 'ledger Withdrawals', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'users', label: 'Registered Resellers', icon: <Users className="w-4 h-4" /> },
            { id: 'apps', label: 'Partner Applications', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'manage_sellers', label: 'Manage Sellers', icon: <Users className="w-4 h-4 text-pink-400 font-bold" /> },
            { id: 'seller_product_reviews', label: 'Seller Products Review', icon: <ShieldCheck className="w-4 h-4 text-amber-500 animate-pulse font-bold" /> },
            { id: 'seller_orders', label: 'Seller Orders', icon: <ShoppingBag className="w-4 h-4 text-sky-400 font-bold animate-pulse" /> },
            { id: 'reseller_page', label: 'Reseller Page Options', icon: <UserCheck className="w-4 h-4 text-emerald-400" /> },
            { id: 'affiliate', label: 'Affiliate Program Settings', icon: <Award className="w-4 h-4 text-pink-400 font-bold" /> },
          ].map(menu => {
            const pendingCount = getPendingCount(menu.id);
            return (
              <button
                key={menu.id}
                onClick={() => setActiveTab(menu.id as any)}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${activeTab === menu.id ? 'bg-pink-650 bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="shrink-0">{menu.icon}</div>
                  <span className="truncate">{menu.label}</span>
                </div>
                {pendingCount > 0 && (
                  <span className={`shrink-0 ml-1.5 px-2 py-0.5 text-[9.5px] font-black rounded-full font-mono transition-colors leading-none ${activeTab === menu.id ? 'bg-white text-pink-600' : 'bg-pink-500 text-white'}`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-500 hover:text-white font-bold flex items-center justify-center gap-2 transition-all text-xs border border-red-500/20"
          >
            <LogOut className="w-4 h-4" /> Log Out Admin Panel
          </button>
        </div>
      </aside>

      {/* ADMIN WORKSPACE CONTAINER */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 text-slate-800">
        
        {/* 1. ADMIN CONSOLE SUMMARY DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Business Admin Dashboard</h2>

            {/* Quick counters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Revenue', val: `৳${platformRevenue}`, d: 'Total from all orders', icon: <DollarSign className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100' },
                { title: 'Total Commissions', val: `৳${platformResellProfits}`, d: 'Earned by our resellers', icon: <ArrowUpRight className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
                { title: 'Active Products', val: products.length, d: 'Total products on catalog', icon: <Box className="w-5 h-5 text-pink-600" />, bg: 'bg-pink-50 border-pink-100' },
                { title: 'Registered Resellers', val: activeResellersCount, d: 'Total sub-seller accounts', icon: <Users className="w-5 h-5 text-sky-600" />, bg: 'bg-sky-50 border-sky-100' },
              ].map((stat, idx) => (
                <div key={idx} className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between bg-white ${stat.bg}`}>
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{stat.title}</p>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{stat.val}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{stat.d}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-xs">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Platform historical ledger items */}
            <div className="bg-white border rounded-3xl p-5 md:p-6 shadow-sm">
              <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 text-slate-800">Direct Live Shipments</h3>
              {orders.length === 0 ? (
                <p className="text-slate-400 text-xs py-8 text-center font-bold">No active shipments in routing channels.</p>
              ) : (
                <div className="space-y-3.5 max-h-[35vh] overflow-y-auto pr-1">
                  {orders.slice(-5).reverse().map(o => (
                    <div key={o.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap justify-between items-center gap-3 text-xs">
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-800 truncate">{o.productName}</p>
                        <p className="text-[10px] text-slate-400">Recipient: {o.custName} ({o.custPhone}) • {o.trackingId}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-indigo-600">৳{o.amount}</span>
                        <p className="text-[10px] text-slate-300 tracking-wide mt-0.5">Status: <b>{o.status}</b></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 2. MANAGE PRODUCT MODELS */}
        {activeTab === 'products' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm uppercase mb-4 text-slate-900">Add New Product</h3>
              
              <form onSubmit={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="form-group">
                  <label className="form-label">Product Name / Title</label>
                  <input 
                    type="text" 
                    className="form-input text-xs py-2.5" 
                    placeholder="Enter brand name and product title" 
                    required 
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Category</label>
                  <select 
                    className="form-input text-xs py-2.5"
                    required
                    value={newProd.catId}
                    onChange={(e) => setNewProd({ ...newProd, catId: e.target.value })}
                  >
                    <option value="">Select a Category</option>
                    {categories.map(c => {
                      const offer = specialOffers.find(so => so.catId === c.id);
                      const displayName = offer 
                        ? `🎁 [CAMPAIGN: ${offer.title}] - ${c.name}` 
                        : c.name;
                      return <option key={c.id} value={c.id}>{displayName}</option>;
                    })}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 form-group">
                  <label className="form-label">Product Description & Features</label>
                  <textarea 
                    rows={2} 
                    className="form-input text-xs" 
                    placeholder="Describe product details, sizes, performance specs..."
                    required
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image File</label>
                  <input type="file" accept="image/*" className="form-input text-xs py-1.5" onChange={(e) => handleProductImgUpload(e, false)} />
                  {newProd.img && (
                    <img src={newProd.img} className="h-14 mt-2 rounded border p-1 object-contain bg-slate-50" />
                  )}
                </div>

                <div className="form-group pb-1">
                  <label className="form-label text-indigo-700 font-bold">Extra Product Images (Optional, 5-6+ images)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="form-input text-xs py-1.5 border-dashed border-indigo-300 bg-indigo-50/10 focus:bg-white" 
                    onChange={(e) => handleProductExtraImgsUpload(e, false)} 
                  />
                  {newProd.images && newProd.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl max-h-24 overflow-y-auto">
                      {newProd.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group w-11 h-11 border rounded bg-white flex items-center justify-center p-0.5">
                          <img src={imgUrl} className="max-w-full max-h-full object-contain" />
                          <button 
                            type="button" 
                            onClick={() => removeProductExtraImg(idx, false)}
                            className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-0 flex items-center justify-center font-bold"
                            style={{ width: '15px', height: '15px', fontSize: '9px', lineHeight: '1' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-indigo-500 font-medium mt-1">Hold Shift/Ctrl to select 5-6 or more images together.</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Color Variants (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Red, Blue, Black" 
                      className="form-input text-xs py-2 flex-1"
                      value={colorTag}
                      onChange={(e) => setColorTag(e.target.value)}
                    />
                    <button type="button" onClick={() => addColorVariant(false)} className="bg-slate-200 hover:bg-slate-300 font-bold px-3 rounded-xl">
                      Add
                    </button>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {(newProd.colors || []).map(val => (
                      <span key={val} className="text-[10px] bg-slate-100 hover:bg-red-50 text-slate-700 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        {val}
                        <X className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer" onClick={() => removeColorVariant(val, false)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing rules matrix */}
                <div className="col-span-1 md:col-span-2 bg-indigo-50/50 rounded-2xl border border-indigo-100/80 p-5 grid grid-cols-2 md:grid-cols-5 gap-3.5">
                  <div className="col-span-2 md:col-span-5 pb-2 border-b border-indigo-100/60 flex justify-between items-center">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-indigo-900">Wholesale & Market Pricing (৳)</span>
                  </div>
                  <div>
                    <label className="form-label">Market Regular Price</label>
                    <input type="number" className="form-input text-xs" value={newProd.originalPrice} onChange={(e) => setNewProd({ ...newProd, originalPrice: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Our Selling Price</label>
                    <input type="number" className="form-input text-xs" value={newProd.discountPrice} onChange={(e) => setNewProd({ ...newProd, discountPrice: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Partner Buying Rate</label>
                    <input type="number" className="form-input text-xs font-bold text-indigo-700" value={newProd.buyRate} onChange={(e) => setNewProd({ ...newProd, buyRate: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Min Resell Price Limit</label>
                    <input type="number" className="form-input text-xs font-bold text-rose-700" value={newProd.minSellRate} onChange={(e) => setNewProd({ ...newProd, minSellRate: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Recommended Retail Price</label>
                    <input type="number" className="form-input text-xs" value={newProd.defaultSellRate} onChange={(e) => setNewProd({ ...newProd, defaultSellRate: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>

                {/* Advance Configuration */}
                <div className="col-span-1 md:col-span-2 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2 pb-1 border-b border-emerald-100/60 flex justify-between items-center">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-900">COD vs Advance Payment Rules</span>
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Payment Authorization Mode</label>
                    <select 
                      className="form-input text-xs py-2 mt-1 bg-white border" 
                      value={newProd.requireAdvance ? "advance" : "cod"}
                      onChange={(e) => {
                        const val = e.target.value === "advance";
                        setNewProd({ ...newProd, requireAdvance: val, advanceAmount: val ? (newProd.advanceAmount || 100) : 0 });
                      }}
                    >
                      <option value="cod">Allow full Cash on Delivery (COD)</option>
                      <option value="advance">Require Advance Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Advance Amount (৳)</label>
                    <input 
                      type="number" 
                      disabled={!newProd.requireAdvance}
                      className="form-input text-xs py-2 mt-1 bg-white border disabled:bg-slate-150 disabled:text-slate-400" 
                      placeholder="e.g. 100 or 150"
                      value={newProd.advanceAmount || ''} 
                      onChange={(e) => setNewProd({ ...newProd, advanceAmount: Math.max(0, parseInt(e.target.value) || 0) })} 
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Users must pay this amount as advance using bKash, Nagad, Rocket, or Bank to place order.</p>
                  </div>
                </div>

                {/* Social Proof ratings and sales */}
                <div className="col-span-1 md:col-span-2 bg-amber-50/50 rounded-2xl border border-amber-100/80 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2 pb-1 border-b border-amber-100/60 flex justify-between items-center">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-amber-900">Rating & Reviews (Social Proof)</span>
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Star Rating (0.0 - 5.0)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="5"
                      className="form-input text-xs py-2 mt-1 bg-white border" 
                      placeholder="e.g. 4.8"
                      value={newProd.rating} 
                      onChange={(e) => setNewProd({ ...newProd, rating: parseFloat(e.target.value) || 0 })} 
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Total Sales / Reviews Count</label>
                    <input 
                      type="number" 
                      min="0"
                      className="form-input text-xs py-2 mt-1 bg-white border" 
                      placeholder="e.g. 150"
                      value={newProd.sales} 
                      onChange={(e) => setNewProd({ ...newProd, sales: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-slate-900 text-white font-extrabold py-3 px-8 rounded-xl hover:bg-slate-800 shadow">
                    Add Product Model
                  </button>
                </div>
              </form>
            </div>

            {/* List existing */}
            <div className="space-y-3.5">
              <h3 className="font-extrabold text-sm uppercase text-slate-700">Enlisted Models Inventory</h3>
              {products.map(p => (
                <div key={p.id} className="bg-white border rounded-2xl shadow-sm p-4 flex gap-4 items-center flex-wrap sm:flex-nowrap">
                  <img src={p.img} alt={p.name} className="w-14 h-14 object-contain rounded bg-slate-50 border p-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-800 truncate" title={p.name}>{p.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      Direct: ৳{p.discountPrice} | Partner Buy: ৳{p.buyRate} | Margin Limit: ৳{p.minSellRate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(p)} className="p-2 border border-slate-200/80 hover:bg-slate-50 rounded-xl text-slate-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 border border-red-100 hover:bg-red-50 rounded-xl text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3. MANAGE CATEGORIES */}
        {activeTab === 'categories' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 border rounded-3xl shadow-sm max-w-xl">
              <h3 className="font-extrabold text-sm uppercase mb-4 text-slate-900">Form New Department Category</h3>
              <form onSubmit={createCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. LUXURY SOUND" 
                      className="form-input text-xs py-2.5 w-full font-bold uppercase"
                      required
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload Photo (Image)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleCategoryImgUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-pink-50 file:text-pink-655 hover:file:bg-pink-100 cursor-pointer"
                    />
                  </div>
                </div>

                {newCatImg && (
                  <div className="mt-2 p-2 border rounded-2xl inline-block bg-slate-50 relative">
                    <img src={newCatImg} alt="Preview" className="w-16 h-16 object-cover rounded-xl border" />
                    <button 
                      type="button" 
                      onClick={() => setNewCatImg('')}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full hover:bg-red-650 transition-colors shadow-sm cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl uppercase tracking-wider block">
                  Enforce List Category
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-700">Listed Categories</h3>
              {categories.map(c => (
                <div key={c.id} className="bg-white border rounded-2xl p-4 flex justify-between items-center max-w-xl shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-105 flex items-center justify-center p-0.5 border border-slate-200 shrink-0">
                      <img src={c.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80'} alt={c.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">{c.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingCategory(c)} className="p-1.5 border hover:bg-slate-50 text-slate-600 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteCategory(c.id)} className="p-1.5 border border-red-500/10 hover:bg-red-50 text-red-500 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. FLASH PROMOTIONS CAMPAIGN */}
        {activeTab === 'flash' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Flash Sale Adjustments</h2>
            <p className="text-xs text-slate-400">Toggle "Flash Sale" campaigns natively over live listed products.</p>

            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border p-4 flex justify-between items-center shadow-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.img} alt={p.name} className="w-10 h-10 object-contain rounded bg-slate-50 border p-1" />
                    <span className="font-extrabold text-xs text-slate-800 max-w-sm truncate">{p.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, isFlash: !item.isFlash } : item));
                    }}
                    className={`font-black text-[10px] px-4 py-2.5 rounded-xl uppercase transition-all shadow-sm ${p.isFlash ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {p.isFlash ? 'Campaign active 🔥' : 'Trigger camp'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 5. DISTRIBUTOR CAROUSEAL BANNER */}
        {activeTab === 'banners' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Toggle sub-tabs */}
            <div className="flex border-b border-slate-150 mb-6 gap-6">
              <button
                type="button"
                onClick={() => setBannerSubTab('customer')}
                className={`pb-3 font-black text-xs uppercase tracking-wider relative cursor-pointer transition-colors ${bannerSubTab === 'customer' ? 'text-pink-650 text-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Customer Store Banners
                {bannerSubTab === 'customer' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full" />}
              </button>
              <button
                type="button"
                onClick={() => setBannerSubTab('reseller')}
                className={`pb-3 font-black text-xs uppercase tracking-wider relative cursor-pointer transition-colors ${bannerSubTab === 'reseller' ? 'text-pink-650 text-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Reseller Dashboard Banners
                {bannerSubTab === 'reseller' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full" />}
              </button>
            </div>

            {bannerSubTab === 'customer' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-3">
                    <h3 className="font-extrabold text-sm uppercase text-slate-900">Upload New Promotional Banner</h3>
                    <input type="file" accept="image/*" className="form-input text-xs py-2" onChange={handleBannerImgUpload} />
                    <p className="text-[9px] text-slate-400">Recommended graphic width is 1200px or larger. Upload to add automatic rotation loop.</p>
                  </div>

                  {/* Banner Height Custom Adjustment Controls */}
                  <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-3">
                    <div>
                      <h3 className="font-extrabold text-sm uppercase text-slate-900 leading-none">Banner Size & Height Adjuster</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Coordinate slider heights to perfectly match your left categories sidebar.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { value: 'small', label: 'Compact', desc: 'Short height row' },
                        { value: 'medium', label: 'Standard', desc: 'Best sidebar match' },
                        { value: 'large', label: 'Expanded', desc: 'High visibility banner' }
                      ].map(item => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setBannerHeight(item.value);
                            showNotif(`Storefront banner height modified to: ${item.label}`, 'success');
                          }}
                          className={`p-2.5 border rounded-2xl text-left cursor-pointer transition-all ${bannerHeight === item.value ? 'border-pink-500 bg-pink-50/50 shadow-sm ring-1 ring-pink-500/20' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                          <span className={`block text-[10px] font-black uppercase tracking-wider ${bannerHeight === item.value ? 'text-pink-600' : 'text-slate-800'}`}>{item.label}</span>
                          <span className="block text-[8px] text-slate-400 mt-0.5 font-medium leading-tight">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  {banners.map(ban => (
                    <div key={ban.id} className="border bg-white rounded-2xl overflow-hidden relative group shadow-sm flex flex-col justify-between">
                      <div className="relative">
                        <img src={ban.img} className={`w-full object-cover ${bannerHeight === 'small' ? 'h-[90px] sm:h-[120px]' : bannerHeight === 'large' ? 'h-[140px] sm:h-[180px]' : 'h-[115px] sm:h-[150px]'}`} alt="Campaign Banner" />
                        <button 
                          type="button"
                          onClick={() => setBanners(prev => prev.filter(b => b.id !== ban.id))}
                          className="absolute top-2 right-2 bg-red-650 hover:bg-red-750 bg-red-600 font-bold text-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-3 bg-slate-50 border-t border-slate-100">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Banner Redirection Link</label>
                        <input 
                          type="text" 
                          className="w-full text-xs font-semibold p-2 border border-slate-250 bg-white rounded-lg focus:border-pink-400 focus:outline-none"
                          placeholder="e.g. https://domain.com/category or #cat_free"
                          value={ban.link || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBanners(prev => prev.map(b => b.id === ban.id ? { ...b, link: val } : b));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-3">
                  <h3 className="font-extrabold text-sm uppercase text-slate-900">Upload New Reseller Banner</h3>
                  <input type="file" accept="image/*" className="form-input text-xs py-2" onChange={handleResellerBannerImgUpload} />
                  <p className="text-[9px] text-slate-400">These banners will display inside the Reseller Dashboard to highlight target points, support channels, or group coordinates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  {resellerBanners.map(ban => (
                    <div key={ban.id} className="border bg-white rounded-2xl overflow-hidden relative group shadow-sm flex flex-col justify-between">
                      <div className="relative">
                        <img src={ban.img} className="w-full object-cover h-[115px] sm:h-[150px]" alt="Reseller Activity Banner" />
                        <button 
                          type="button"
                          onClick={() => {
                            if (setResellerBanners) {
                              setResellerBanners(prev => prev.filter(b => b.id !== ban.id));
                              showNotif("Reseller marketing banner deleted.", "error");
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-650 hover:bg-red-750 bg-red-600 font-bold text-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-3 bg-slate-50 border-t border-slate-100">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Redirection Link (রিডাইরেক্ট লিংক)</label>
                        <input 
                          type="text" 
                          className="w-full text-xs font-semibold p-2 border border-slate-250 bg-white rounded-lg focus:border-pink-400 focus:outline-none"
                          placeholder="e.g. https://wa.me/... or custom support URL"
                          value={ban.link || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (setResellerBanners) {
                              setResellerBanners(prev => prev.map(b => b.id === ban.id ? { ...b, link: val } : b));
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {resellerBanners.length === 0 && (
                    <div className="col-span-full border border-dashed border-slate-250 py-12 rounded-3xl text-center text-slate-400 bg-slate-50/50">
                      <p className="font-extrabold text-sm">No reseller banners uploaded yet.</p>
                      <p className="text-xs mt-1">Configure Reseller-specific promo announcements or official WhatsApp updates here.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* 5.1 POPUP IMAGES SETTING TAB PANEL */}
        {activeTab === 'popup_images' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm uppercase text-slate-900">Upload New Promotional Popup Image</h3>
              <p className="text-xs text-slate-400">These promotional popups are displayed as custom dialogs on website landing. Click them to trigger the assigned destination link.</p>
              <input type="file" accept="image/*" className="form-input text-xs py-2" onChange={handlePopupImgUpload} />
              <p className="text-[9px] text-slate-400">Recommended size: Portrait/Square 600px width. You can configure multiple active popup images representing distinct active promotions or discount offers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {(!popupImages || popupImages.length === 0) ? (
                <div className="sm:col-span-2 md:col-span-3 text-center py-12 text-slate-400 border border-dashed rounded-3xl bg-slate-50/50">
                  <p className="font-bold text-sm">No promotional popups uploaded yet.</p>
                  <p className="text-xs mt-1">Add popup images to advertise flash sales, new arrivals, or exclusive reseller coupons on website open.</p>
                </div>
              ) : (
                popupImages.map(popup => (
                  <div key={popup.id} className="border bg-white rounded-2xl overflow-hidden relative group shadow-sm flex flex-col justify-between">
                    <div className="p-1.5 bg-slate-50 border-b flex justify-between items-center">
                      <span className="text-[9px] font-extrabold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full uppercase">
                        POPUP PROMO
                      </span>
                      <button 
                        type="button"
                        onClick={() => setPopupImages && setPopupImages(prev => prev.filter(p => p.id !== popup.id))}
                        className="bg-red-50 hover:bg-red-105 text-red-650 hover:text-red-700 p-1 px-2 text-[10px] rounded-md font-bold transition-all border border-red-200/50 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    <div className="relative bg-slate-100 flex items-center justify-center p-2 min-h-[140px] max-h-[180px] overflow-hidden">
                      <img src={popup.img} className="max-h-full rounded-lg object-contain border bg-white" alt="Promotion" />
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2.5">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-0.5">Clickable Redirection Link</label>
                        <input 
                          type="text" 
                          className="w-full text-xs font-semibold p-1.5 border border-slate-250 bg-white rounded-lg focus:border-pink-400 focus:outline-none"
                          placeholder="e.g. https://shop.com/prod1 or #campaign"
                          value={popup.link || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPopupImages && setPopupImages(prev => prev.map(p => p.id === popup.id ? { ...p, link: val } : p));
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <span className="text-[10px] text-slate-500 font-bold">Show on website:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPopupImages && setPopupImages(prev => prev.map(p => p.id === popup.id ? { ...p, isActive: !p.isActive } : p));
                          }}
                          className={`px-3 py-1 text-[9px] uppercase font-black rounded-full tracking-wider cursor-pointer border transition-all ${
                            popup.isActive 
                              ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600' 
                              : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          {popup.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'offers' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 border rounded-3xl shadow-xs">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Special & Limited Offers Manager</h2>
              <p className="text-xs text-slate-400 mt-1">Configure click-to-open Special Offers that appear on the storefront. These offers map to dedicated categories, keeping them hidden from the standard home catalog.</p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!offerTitle || !offerDesc || !offerBadge || !offerAction || !offerCat) {
                    showNotif('Please write all offer properties and pick a catalog category!', 'error');
                    return;
                  }
                  const newOffer: SpecialOffer = {
                    id: 'offer_' + Date.now(),
                    title: offerTitle.trim().toUpperCase(),
                    desc: offerDesc.trim(),
                    badge: offerBadge.trim().toUpperCase(),
                    actionText: offerAction.trim().toUpperCase(),
                    catId: offerCat,
                    themeColor: offerTheme
                  };
                  setSpecialOffers(prev => [...prev, newOffer]);
                  showNotif(`Success! Added ${newOffer.title} special offer.`, 'success');
                  // Reset form
                  setOfferTitle('');
                  setOfferDesc('');
                  setOfferBadge('');
                  setOfferAction('');
                  setOfferCat('');
                  setOfferTheme('pink');
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 border-t pt-6"
              >
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Offer Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EID SPECIAL SELECTIONS" 
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Subtitle Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Limited 40% Discount" 
                    value={offerDesc}
                    onChange={(e) => setOfferDesc(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Corner Badge Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Campaign OR Hot OR Active" 
                    value={offerBadge}
                    onChange={(e) => setOfferBadge(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Action Button Label</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EID OFFER OR GET ITEMS" 
                    value={offerAction}
                    onChange={(e) => setOfferAction(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Exclusive Category</label>
                  <select 
                    value={offerCat}
                    onChange={(e) => setOfferCat(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50/50"
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Visual Theme Color</label>
                  <div className="flex gap-2 pt-1 h-12 items-center">
                    {(['pink', 'cyan', 'orange', 'emerald', 'purple'] as const).map(color => {
                      const colorMap = {
                        pink: 'bg-pink-500 ring-pink-500',
                        cyan: 'bg-cyan-500 ring-cyan-500',
                        orange: 'bg-orange-500 ring-orange-500',
                        emerald: 'bg-emerald-500 ring-emerald-500',
                        purple: 'bg-purple-500 ring-purple-500'
                      };
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setOfferTheme(color)}
                          className={`w-6 h-6 rounded-full ${colorMap[color]} transition-transform ${offerTheme === color ? 'scale-125 ring-2 ring-offset-2' : 'hover:scale-110 active:scale-95'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-3 pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-md cursor-pointer transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Special Offer card
                  </button>
                </div>
              </form>
            </div>

            {/* Existing offers card grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Active Special Offers List</h3>
              
              {specialOffers.length === 0 ? (
                <div className="bg-white border rounded-3xl p-10 text-center text-slate-400 shadow-sm">
                  No active special campaigns found underneath the workspace.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {specialOffers.map(offer => {
                    // style colors matching our themeColor configuration
                    const getThemeStyle = (tc: string) => {
                      switch (tc) {
                        case 'cyan': return 'from-indigo-50/50 to-cyan-50/50 border-cyan-300 ring-cyan-300';
                        case 'orange': return 'from-orange-50/50 to-yellow-50/50 border-orange-300 ring-orange-300';
                        case 'emerald': return 'from-teal-50/50 to-emerald-50/50 border-emerald-300 ring-emerald-300';
                        case 'purple': return 'from-indigo-50/50 to-purple-50/50 border-purple-300 ring-purple-300';
                        case 'pink':
                        default: return 'from-pink-50/50 to-rose-50/50 border-pink-300 ring-pink-300';
                      }
                    };
                    const getThemeBadge = (tc: string) => {
                      switch (tc) {
                        case 'cyan': return 'bg-cyan-500';
                        case 'orange': return 'bg-orange-500';
                        case 'emerald': return 'bg-emerald-500';
                        case 'purple': return 'bg-purple-500';
                        case 'pink':
                        default: return 'bg-pink-500';
                      }
                    };
                    const getThemeText = (tc: string) => {
                      switch (tc) {
                        case 'cyan': return 'text-indigo-950';
                        case 'orange': return 'text-orange-950';
                        case 'emerald': return 'text-emerald-950';
                        case 'purple': return 'text-purple-950';
                        case 'pink':
                        default: return 'text-pink-950';
                      }
                    };
                    const getThemeSubtext = (tc: string) => {
                      switch (tc) {
                        case 'cyan': return 'text-indigo-600';
                        case 'orange': return 'text-orange-600';
                        case 'emerald': return 'text-emerald-600';
                        case 'purple': return 'text-purple-600';
                        case 'pink':
                        default: return 'text-pink-600';
                      }
                    };
                    
                    const catName = categories.find(c => c.id === offer.catId)?.name || 'Unknown Category';
                    const offerProductsCount = products.filter(p => p.catId === offer.catId).length;
                    
                    return (
                      <div 
                        key={offer.id} 
                        className={`bg-gradient-to-br border-2 rounded-2xl p-4 flex flex-col justify-between h-[195px] shadow-sm relative overflow-hidden transition-all hover:scale-[1.02] ${getThemeStyle(offer.themeColor)}`}
                      >
                        <button 
                          onClick={() => {
                            setSpecialOffers(prev => prev.filter(o => o.id !== offer.id));
                            showNotif('Removed special offer config.', 'success');
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm z-10 hover:scale-110 active:scale-[0.9]"
                          title="Delete special offer campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <span className={`text-[8px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider block w-fit ${getThemeBadge(offer.themeColor)}`}>
                            {offer.badge}
                          </span>
                          <h4 className={`font-black uppercase tracking-tight text-sm mt-1 leading-tight ${getThemeText(offer.themeColor)}`}>
                            {offer.title}
                          </h4>
                          <p className={`text-[9px] font-semibold mt-0.5 line-clamp-1 ${getThemeSubtext(offer.themeColor)}`}>
                            {offer.desc}
                          </p>
                          <p className="text-[8px] text-slate-400 mt-1 font-mono">
                            Category: <span className="font-bold text-slate-600 uppercase text-[8px]">{catName}</span>
                          </p>
                          <span className="inline-flex items-center gap-1 mt-1 text-[8px] bg-white/60 backdrop-blur-xs rounded-lg px-2 py-0.5 font-bold text-slate-700 border border-slate-200/50">
                            📦 {offerProductsCount} Products in Stock
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setCampSelectedOfferId(offer.id);
                            showNotif(`Selected ${offer.title} Campaign products catalog!`, 'success');
                          }}
                          className={`w-full text-white font-black text-[10px] uppercase tracking-widest text-center py-2 rounded-xl border border-white/20 hover:brightness-105 active:scale-95 transition-all text-center cursor-pointer ${getThemeBadge(offer.themeColor)}`}
                        >
                          Manage Products ({offerProductsCount})
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Campaign-specific product quick-assignment & Stock Loader section */}
            <div className="bg-slate-50 p-6 border rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Tag className="w-5 h-5 text-indigo-600" /> Active Campaign Product Loader
                  </h3>
                  <p className="text-xs text-slate-400">Instantly add, view, or remove products assigned to a live special campaign.</p>
                </div>

                <div className="w-full sm:w-64">
                  <select 
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    value={campSelectedOfferId}
                    onChange={(e) => setCampSelectedOfferId(e.target.value)}
                  >
                    <option value="">-- Choose Campaign --</option>
                    {specialOffers.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                if (!campSelectedOfferId) {
                  return (
                    <div className="bg-white border rounded-2xl p-8 text-center text-xs font-bold text-slate-400">
                      💡 Select a Special Offer campaign from the dropdown above to manage its active catalog products or add new exclusive items.
                    </div>
                  );
                }

                const activeCamp = specialOffers.find(o => o.id === campSelectedOfferId);
                if (!activeCamp) return null;
                const activeCatId = activeCamp.catId;
                const activeCampName = activeCamp.title;
                const activeCampProducts = products.filter(p => p.catId === activeCatId);

                return (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
                    {/* Grid list of existing campaign products */}
                    <div className="xl:col-span-2 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                        <span>Items currently in {activeCampName} Campaign</span>
                        <span className="text-indigo-600 font-extrabold bg-indigo-50 px-2.5 py-1 rounded-lg">({activeCampProducts.length} items)</span>
                      </h4>

                      {activeCampProducts.length === 0 ? (
                        <div className="bg-white border rounded-2xl p-10 text-center text-xs text-slate-400 font-bold">
                          No products found specifically inside this category! Use the right-hand panel form to add your first campaign product now.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                          {activeCampProducts.map(p => {
                            const pct = p.originalPrice > 0 ? Math.round(((p.originalPrice - p.discountPrice) / p.originalPrice) * 100) : 0;
                            return (
                              <div key={p.id} className="bg-white border p-3 rounded-2xl flex gap-3 items-center justify-between shadow-xs relative group hover:ring-1 hover:ring-indigo-100">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden border">
                                    <img src={p.img} alt={p.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-black text-slate-800 truncate" title={p.name}>{p.name}</h5>
                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                                      ৳{p.discountPrice} <span className="line-through text-slate-400 text-[9px]">৳{p.originalPrice}</span>
                                    </p>
                                    {pct > 0 && (
                                      <span className="inline-block mt-0.5 text-[8px] bg-rose-50 text-rose-600 font-black px-1.5 py-0.25 rounded">
                                        -{pct}% Off
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <button 
                                  onClick={() => {
                                    setProducts(prev => prev.filter(item => item.id !== p.id));
                                    showNotif(`Deleted ${p.name} from the campaign network.`, 'error');
                                  }}
                                  className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                                  title="Delete product model from system"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Quick Add Form Section */}
                    <div className="bg-white border rounded-2xl p-4 space-y-4 shadow-sm border-slate-200">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1 border-b pb-2">
                        <Plus className="w-4 h-4 text-emerald-500" /> New Product inside Campaign
                      </h4>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!campProdName || !campDiscountPrice) {
                            showNotif('Write product name and pricing discount rates!', 'error');
                            return;
                          }
                          const finalImg = campProdImg.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80';
                          const colorsArr = campColorsText ? campColorsText.split(',').map(s => s.trim()).filter(Boolean) : ['Standard Edition'];
                          const newProductObj: Product = {
                            id: 'p_camp_' + Date.now(),
                            catId: activeCatId,
                            name: campProdName.trim(),
                            description: campProdDesc.trim() || 'Exclusive high-quality campaign selections loaded.',
                            img: finalImg,
                            originalPrice: campOriginalPrice || Math.round(campDiscountPrice * 1.25),
                            discountPrice: campDiscountPrice,
                            buyRate: campBuyRate || Math.round(campDiscountPrice * 0.70),
                            minSellRate: campMinSellRate || Math.round(campDiscountPrice * 0.85),
                            defaultSellRate: campDefaultSellRate || Math.round(campDiscountPrice * 0.95),
                            rating: parseFloat((4.7 + Math.random() * 0.3).toFixed(1)),
                            sales: Math.floor(10 + Math.random() * 90),
                            inStock: true,
                            colors: colorsArr,
                            isFlash: false
                          };
                          setProducts(prev => [newProductObj, ...prev]);
                          showNotif(`Successfully assigned ${newProductObj.name} to ${activeCampName}!`, 'success');
                          
                          // Reset form inputs
                          setCampProdName('');
                          setCampProdDesc('');
                          setCampOriginalPrice(0);
                          setCampDiscountPrice(0);
                          setCampBuyRate(0);
                          setCampMinSellRate(0);
                          setCampDefaultSellRate(0);
                          setCampProdImg('');
                          setCampColorsText('');
                        }}
                        className="space-y-3 text-[11px] text-slate-700"
                      >
                        <div className="space-y-0.5">
                          <label className="block font-bold text-slate-500 uppercase text-[9px]">Title / Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Eid Royal Salwar Kameez"
                            value={campProdName}
                            onChange={(e) => setCampProdName(e.target.value)}
                            className="w-full font-bold border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="block font-bold text-slate-500 uppercase text-[9px]">Description</label>
                          <textarea 
                            rows={2}
                            placeholder="Brief product attributes, size..."
                            value={campProdDesc}
                            onChange={(e) => setCampProdDesc(e.target.value)}
                            className="w-full font-semibold border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-[10px]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <label className="block font-bold text-slate-500 uppercase text-[9px]">Original Price (৳)</label>
                            <input 
                              type="number" 
                              required
                              placeholder="3200"
                              value={campOriginalPrice || ''}
                              onChange={(e) => setCampOriginalPrice(parseInt(e.target.value) || 0)}
                              className="w-full font-bold border border-slate-200 rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <label className="block font-bold text-slate-500 uppercase text-[9px]">Campaign Price (৳)</label>
                            <input 
                              type="number" 
                              required
                              placeholder="1999"
                              value={campDiscountPrice || ''}
                              onChange={(e) => setCampDiscountPrice(parseInt(e.target.value) || 0)}
                              className="w-full font-bold border border-emerald-500 rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-pink-600 font-extrabold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="space-y-0.5">
                            <label className="block font-bold text-slate-400 uppercase text-[8px]">Buy Rate (৳)</label>
                            <input 
                              type="number"
                              placeholder="1200"
                              value={campBuyRate || ''}
                              onChange={(e) => setCampBuyRate(parseInt(e.target.value) || 0)}
                              className="w-full border border-slate-200 rounded-xl p-1.5 focus:outline-none text-[10px] font-semibold"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="block font-bold text-slate-400 uppercase text-[8px]">Min Sell (৳)</label>
                            <input 
                              type="number"
                              placeholder="1500"
                              value={campMinSellRate || ''}
                              onChange={(e) => setCampMinSellRate(parseInt(e.target.value) || 0)}
                              className="w-full border border-slate-200 rounded-xl p-1.5 focus:outline-none text-[10px] font-semibold"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="block font-bold text-slate-400 uppercase text-[8px]">Def Sell (৳)</label>
                            <input 
                              type="number"
                              placeholder="1800"
                              value={campDefaultSellRate || ''}
                              onChange={(e) => setCampDefaultSellRate(parseInt(e.target.value) || 0)}
                              className="w-full border border-slate-200 rounded-xl p-1.5 focus:outline-none text-[10px] font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <label className="block font-bold text-slate-500 uppercase text-[9px]">Available Colors / Items</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Red, Blue, Green, Peach"
                            value={campColorsText}
                            onChange={(e) => setCampColorsText(e.target.value)}
                            className="w-full font-semibold border border-slate-200 rounded-xl p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1 pt-1">
                          <label className="block font-bold text-slate-500 uppercase text-[9px]">Product Image File</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleCampProductImgUpload}
                            className="w-full text-[10px] border border-slate-100 rounded-xl p-1 cursor-pointer"
                          />
                          {campProdImg && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Loaded</span>
                              <img src={campProdImg} alt="Preview" className="h-8 w-8 rounded border object-contain bg-slate-50" />
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-center flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Inject Product to Campaign
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* 6. PLATFORM ORDERS & TRACKING TIMELINE MANAGER (CRITICAL TARGET) */}
        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {(() => {
              const customerOrders = orders
                .filter(o => o.type !== 'reseller')
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
              const filteredOrders = customerOrders.filter(
                o => custOrderFilter === 'all' || o.status === custOrderFilter
              );
              return (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Customer Direct Orders</h2>
                      <p className="text-xs text-slate-400 mt-0.5 font-semibold">Control web store customer tracking, shipping phases, and delivery timelines</p>
                    </div>
                    <span className="text-xs bg-white py-1 px-2.5 rounded-full border text-slate-500 font-bold shadow-xs">
                      {customerOrders.length} customer order{customerOrders.length === 1 ? '' : 's'} total
                    </span>
                  </div>

                  {customerOrders.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl text-xs font-bold border border-slate-200">
                      {[
                        { id: 'all', label: 'All Orders', count: customerOrders.length },
                        { id: 'Pending', label: 'Pending Review', count: customerOrders.filter(o => o.status === 'Pending').length },
                        { id: 'Approved', label: 'Approved & Confirmed', count: customerOrders.filter(o => o.status === 'Approved').length },
                        { id: 'Processing', label: 'Warehouse Packaging', count: customerOrders.filter(o => o.status === 'Processing').length },
                        { id: 'Shipped', label: 'Dispatched In Transit', count: customerOrders.filter(o => o.status === 'Shipped').length },
                        { id: 'Delivered', label: 'Delivered Successfully', count: customerOrders.filter(o => o.status === 'Delivered').length },
                        { id: 'Cancelled', label: 'Cancelled', count: customerOrders.filter(o => o.status === 'Cancelled').length },
                        { id: 'Returned', label: 'Returned', count: customerOrders.filter(o => o.status === 'Returned').length }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setCustOrderFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border leading-none ${
                            custOrderFilter === tab.id 
                              ? 'bg-indigo-600 text-white font-extrabold border-indigo-700 shadow-sm scale-[1.02]' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                          }`}
                        >
                          <span>{tab.label}</span>
                          {tab.count > 0 && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${custOrderFilter === tab.id ? 'bg-white text-indigo-600' : 'bg-slate-150 text-slate-700'}`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {customerOrders.length === 0 ? (
                    <p className="py-12 text-slate-400 text-center font-bold bg-white border rounded-2xl shadow-sm">No direct customer orders recorded in the system.</p>
                  ) : filteredOrders.length === 0 ? (
                    <div className="py-12 bg-white border rounded-2xl shadow-sm text-center">
                      <p className="text-slate-400 font-bold">No orders found matching status "{custOrderFilter}".</p>
                      <button onClick={() => setCustOrderFilter('all')} className="mt-2 text-indigo-600 hover:underline font-extrabold text-xs">Show all orders</button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {filteredOrders.map(o => {
                        const subColor = {
                          Pending: 'bg-amber-100 text-amber-700 border-amber-200',
                          Approved: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                          Processing: 'bg-pink-100 text-pink-700 border-pink-200',
                          Shipped: 'bg-sky-100 text-sky-700 border-sky-200',
                          Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                          Cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
                        }[o.status] || 'bg-slate-100 text-slate-700 border-slate-200';

                        return (
                          <div key={o.id} className="bg-white border rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-4 text-xs">
                            {/* Meta header */}
                            <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-zinc-100">
                              <div>
                                <p className="text-[10px] text-zinc-400 font-bold">DEALY TRACKING REF</p>
                                <h4 className="font-extrabold text-sm text-slate-800 font-mono">
                                  {o.trackingId}
                                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black border ml-2 ${subColor}`}>
                                    {o.status.toUpperCase()}
                                  </span>
                                  <span className="text-[9px] px-2.5 py-0.5 rounded-full font-black bg-zinc-100 text-zinc-700 border border-zinc-200 ml-1">
                                    CUSTOMER ORDER
                                  </span>
                                </h4>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold">AMOUNT PAID</p>
                                <span className="font-mono font-extrabold text-slate-900 text-sm">
                                  ৳{o.amount}
                                </span>
                              </div>
                            </div>

                             {/* Customer dispatch details */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-xl border">
                              <div>
                                <p className="text-[9px] text-zinc-400 font-bold">CARRIER ITEM</p>
                                <p className="font-bold text-slate-800 mt-0.5 truncate">{o.productName}</p>
                                {o.color && <p className="text-[9px] text-slate-400 mt-0.5">Finish: {o.color}</p>}
                                <p className="text-[9px] text-slate-400 mt-0.5 font-semibold text-indigo-600">Quantity: {o.qty} pcs</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-zinc-400 font-bold">CUSTOMER DETAILS</p>
                                <p className="font-extrabold text-slate-800 mt-0.5">{o.custName}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{o.custPhone}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-zinc-400 font-bold">SHIPPING ADDRESS</p>
                                <p className="font-medium text-slate-500 mt-0.5 leading-snug line-clamp-2 truncate" title={o.custAddress}>{o.custAddress}</p>
                              </div>
                              <div className="md:border-l md:pl-4 border-slate-150">
                                <TinyInvoiceDetails order={o} />
                              </div>
                            </div>

                            {/* Advance Payment Details */}
                            {o.paymentMethod && o.paymentMethod !== 'COD' ? (
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
                                <div className="text-left">
                                  <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Advance Payment
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    Channel: <strong className="text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded text-[10px] uppercase">{o.paymentMethod}</strong>
                                    {o.txId && <> • TxID: <strong className="text-slate-800 font-mono select-all bg-white px-2 py-0.5 border rounded text-[11px]">{o.txId}</strong></>}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] text-emerald-700 font-bold">ADVANCE AMOUNT PAID</p>
                                  <span className="font-mono font-extrabold text-emerald-700 text-xs bg-emerald-100/40 px-2 py-0.5 rounded">
                                    ৳{o.advancePaid || 0}
                                  </span>
                                </div>
                              </div>
                            ) : o.advancePaid && o.advancePaid > 0 ? (
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
                                <div className="text-left">
                                  <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Advance Payment
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    {o.paymentMethod && <>Channel: <strong className="text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded text-[10px] uppercase">{o.paymentMethod}</strong> • </>}
                                    {o.txId && <>TxID: <strong className="text-slate-800 font-mono select-all bg-white px-2 py-0.5 border rounded text-[11px]">{o.txId}</strong></>}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] text-emerald-700 font-bold">ADVANCE AMOUNT PAID</p>
                                  <span className="font-mono font-extrabold text-emerald-700 text-xs bg-emerald-100/40 px-2 py-0.5 rounded">
                                    ৳{o.advancePaid || 0}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-50 text-slate-500 border border-slate-100/80 p-2.5 rounded-xl text-[10px] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                <span>No advance requirements requested. Standard Cash on Delivery (COD) order.</span>
                              </div>
                            )}

                            {/* Interactive Logistics update controller panel */}
                            <div className="flex flex-wrap justify-between items-center gap-3 pt-1">
                              <span className="text-[10px] text-slate-400 pr-5">Dispatched calendar: {o.date}</span>
                              <div className="flex gap-2 flex-wrap pb-1">
                                {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                                  adminOrderToCancel === o.id ? (
                                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 p-1.5 rounded-xl text-xs font-bold">
                                      <span className="text-red-700 animate-pulse text-[11px]">Confirm Cancel?</span>
                                      <button
                                        onClick={() => {
                                          handleAdminCancelOrder(o.id);
                                          setAdminOrderToCancel(null);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg cursor-pointer text-[10px] uppercase font-black"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={() => setAdminOrderToCancel(null)}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg cursor-pointer text-[10px]"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setAdminOrderToCancel(o.id)}
                                      className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all border border-red-200 text-xs cursor-pointer active:scale-95"
                                      title="Cancel Order"
                                    >
                                      <X className="w-3.5 h-3.5 text-red-500" /> Cancel Order
                                    </button>
                                  )
                                )}
                                <button 
                                  onClick={() => triggerLogisticsEditor(o)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow shadow-indigo-600/10 text-xs cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Adjust Shipping Timeline Phase
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}

        {/* 6.2 RESELLER SPECIFIC ORDERS & TRANSACTION TRACKER */}
        {activeTab === 'reseller_orders' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {(() => {
              const resellerOrders = orders
                .filter(o => o.type === 'reseller')
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
              const filteredOrders = resellerOrders.filter(
                o => resellerOrderFilter === 'all' || o.status === resellerOrderFilter
              );
              return (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Reseller Network Orders</h2>
                      <p className="text-xs text-slate-400 mt-0.5 font-semibold">Track shipping milestones for reseller network sales, identify resellers, and view commission records</p>
                    </div>
                    <span className="text-xs text-white bg-pink-600 py-1 px-2.5 rounded-full border border-pink-500 font-bold shadow-xs">
                      {resellerOrders.length} reseller order{resellerOrders.length === 1 ? '' : 's'} total
                    </span>
                  </div>

                  {resellerOrders.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl text-xs font-bold border border-slate-200">
                      {[
                        { id: 'all', label: 'All Orders', count: resellerOrders.length },
                        { id: 'Pending', label: 'Pending Review', count: resellerOrders.filter(o => o.status === 'Pending').length },
                        { id: 'Approved', label: 'Approved & Confirmed', count: resellerOrders.filter(o => o.status === 'Approved').length },
                        { id: 'Processing', label: 'Warehouse Packaging', count: resellerOrders.filter(o => o.status === 'Processing').length },
                        { id: 'Shipped', label: 'Dispatched In Transit', count: resellerOrders.filter(o => o.status === 'Shipped').length },
                        { id: 'Delivered', label: 'Delivered Successfully', count: resellerOrders.filter(o => o.status === 'Delivered').length },
                        { id: 'Cancelled', label: 'Cancelled', count: resellerOrders.filter(o => o.status === 'Cancelled').length },
                        { id: 'Returned', label: 'Returned', count: resellerOrders.filter(o => o.status === 'Returned').length }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setResellerOrderFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border leading-none ${
                            resellerOrderFilter === tab.id 
                              ? 'bg-pink-650 bg-pink-600 text-white font-extrabold border-pink-700 shadow-sm scale-[1.02]' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                          }`}
                        >
                          <span>{tab.label}</span>
                          {tab.count > 0 && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${resellerOrderFilter === tab.id ? 'bg-white text-pink-650 text-pink-600' : 'bg-slate-150 text-slate-700'}`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {resellerOrders.length === 0 ? (
                    <p className="py-12 text-slate-400 text-center font-bold bg-white border rounded-2xl shadow-sm">No reseller orders recorded in the system.</p>
                  ) : filteredOrders.length === 0 ? (
                    <div className="py-12 bg-white border rounded-2xl shadow-sm text-center">
                      <p className="text-slate-400 font-bold">No reseller orders found matching status "{resellerOrderFilter}".</p>
                      <button onClick={() => setResellerOrderFilter('all')} className="mt-2 text-pink-600 hover:underline font-extrabold text-xs">Show all orders</button>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {filteredOrders.map(o => {
                        const subColor = {
                          Pending: 'bg-amber-100 text-amber-700 border-amber-200',
                          Approved: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                          Processing: 'bg-pink-100 text-pink-700 border-pink-200',
                          Shipped: 'bg-sky-100 text-sky-700 border-sky-200',
                          Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                          Cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
                        }[o.status] || 'bg-slate-100 text-slate-700 border-slate-200';

                        // Find Reseller User context details
                        const reseller = users.find(u => u.id === o.userId);

                        return (
                          <div key={o.id} className="bg-white border rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-4 text-xs">
                            {/* Meta header */}
                            <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-zinc-100">
                              <div>
                                <p className="text-[10px] text-zinc-400 font-bold">RESELLER TRACKING REF</p>
                                <h4 className="font-extrabold text-sm text-slate-800 font-mono">
                                  {o.trackingId}
                                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black border ml-2 ${subColor}`}>
                                    {o.status.toUpperCase()}
                                  </span>
                                  <span className="text-[9px] px-2.5 py-0.5 rounded-full font-black bg-pink-100 text-pink-700 border border-pink-200 ml-1">
                                    RESELLER SALE
                                  </span>
                                </h4>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold">TOTAL PROFITMARGIN / COMMISSION</p>
                                <span className="font-mono font-black text-rose-600 text-sm">
                                  ৳{o.profit}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold block">
                                  Sell: ৳{o.sellRate} • Cost: ৳{o.buyRate || 0}
                                </span>
                              </div>
                            </div>

                            {/* Reseller Info section */}
                            <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div>
                                <p className="text-[9px] text-pink-500 font-bold uppercase tracking-wider">Placed By Reseller</p>
                                <span className="font-extrabold text-slate-800 text-xs">
                                  {reseller ? reseller.name : 'Unknown Partner'}
                                </span>
                                <span className="ml-2 px-2 py-0.5 bg-slate-950 text-white rounded-md text-[9px] font-mono">
                                  {reseller ? reseller.idCode : 'N/A'}
                                </span>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="text-[9px] text-pink-500 font-bold uppercase tracking-wider">Reseller email contact</p>
                                <p className="font-semibold text-slate-600 text-xs truncate">
                                  {reseller ? reseller.email : 'N/A'}
                                </p>
                              </div>
                            </div>

                            {/* Customer dispatch details */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-3 rounded-xl border">
                              <div>
                                <p className="text-[9px] text-zinc-400 font-bold">CARRIER ITEM</p>
                                <p className="font-bold text-slate-800 mt-0.5 truncate">{o.productName}</p>
                                {o.color && <p className="text-[9px] text-slate-400 mt-0.5">Finish: {o.color}</p>}
                                <p className="text-[9px] text-slate-400 mt-0.5">Quantity: {o.qty} pcs</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-zinc-400 font-bold">END-CUSTOMER DETAILS</p>
                                <p className="font-extrabold text-slate-800 mt-0.5">{o.custName}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{o.custPhone}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-zinc-400 font-bold">SHIPPING ADDRESS</p>
                                <p className="font-medium text-slate-500 mt-0.5 leading-snug leading-tight truncate" title={o.custAddress}>{o.custAddress}</p>
                              </div>
                              <div className="md:border-l md:pl-4 border-slate-150">
                                <TinyInvoiceDetails order={o} />
                              </div>
                            </div>

                            {/* Advance Payment Details */}
                            {o.paymentMethod && o.paymentMethod !== 'COD' ? (
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
                                <div className="text-left">
                                  <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Advance Payment
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    Channel: <strong className="text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded text-[10px] uppercase">{o.paymentMethod}</strong>
                                    {o.txId && <> • TxID: <strong className="text-slate-800 font-mono select-all bg-white px-2 py-0.5 border rounded text-[11px]">{o.txId}</strong></>}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] text-emerald-700 font-bold">ADVANCE AMOUNT PAID</p>
                                  <span className="font-mono font-extrabold text-emerald-700 text-xs bg-emerald-100/40 px-2 py-0.5 rounded">
                                    ৳{o.advancePaid || 0}
                                  </span>
                                </div>
                              </div>
                            ) : o.advancePaid && o.advancePaid > 0 ? (
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
                                <div className="text-left">
                                  <p className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Advance Payment
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-1">
                                    {o.paymentMethod && <>Channel: <strong className="text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded text-[10px] uppercase">{o.paymentMethod}</strong> • </>}
                                    {o.txId && <>TxID: <strong className="text-slate-800 font-mono select-all bg-white px-2 py-0.5 border rounded text-[11px]">{o.txId}</strong></>}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] text-emerald-700 font-bold">ADVANCE AMOUNT PAID</p>
                                  <span className="font-mono font-extrabold text-emerald-700 text-xs bg-emerald-100/40 px-2 py-0.5 rounded">
                                    ৳{o.advancePaid || 0}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-50 text-slate-500 border border-slate-100/80 p-2.5 rounded-xl text-[10px] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                <span>No advance requirements requested. Standard Cash on Delivery (COD) order.</span>
                              </div>
                            )}

                            {/* Interactive Logistics update controller panel */}
                            <div className="flex flex-wrap justify-between items-center gap-3 pt-1 border-t border-slate-100 mt-1">
                              <span className="text-[10px] text-slate-450 pr-5">Dispatched calendar: {o.date}</span>
                              <div className="flex gap-2 flex-wrap pb-1">
                                {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                                  adminOrderToCancel === o.id ? (
                                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 p-1.5 rounded-xl text-xs font-bold">
                                      <span className="text-red-700 animate-pulse text-[11px]">Confirm Cancel?</span>
                                      <button
                                        onClick={() => {
                                          handleAdminCancelOrder(o.id);
                                          setAdminOrderToCancel(null);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg cursor-pointer text-[10px] uppercase font-black"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={() => setAdminOrderToCancel(null)}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-lg cursor-pointer text-[10px]"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setAdminOrderToCancel(o.id)}
                                      className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all border border-red-200 text-xs cursor-pointer active:scale-95"
                                      title="Cancel Order"
                                    >
                                      <X className="w-3.5 h-3.5 text-red-500" /> Cancel Order
                                    </button>
                                  )
                                )}
                                <button 
                                  onClick={() => triggerLogisticsEditor(o)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow shadow-indigo-600/10 text-xs cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Adjust Shipping Timeline Phase
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}

        {/* 6.3 DISTRICT DELIVERY CHARGES CONFIGURATION */}
        {activeTab === 'delivery_charges' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" /> District-Wise Delivery Charge Configuration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Define custom delivery charges for specific cities or districts. Shoppers will see these rates applied automatically during checkout based on their shipping address match.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Form to add/edit district charge */}
              <div className="bg-white border rounded-3xl p-5 shadow-sm h-fit">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b">
                  Configure District Rate
                </h3>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!dcDistrictInput.trim()) {
                      showNotif('Write a valid district or location name!', 'error');
                      return;
                    }
                    if (dcEditingId) {
                      setDeliveryCharges(prev => prev.map(dc => dc.id === dcEditingId ? { ...dc, district: dcDistrictInput.trim(), charge: dcChargeInput } : dc));
                      showNotif(`Updated delivery rate for ${dcDistrictInput}!`, 'success');
                      setDcEditingId(null);
                    } else {
                      const newDc = {
                        id: 'dc_' + Date.now(),
                        district: dcDistrictInput.trim(),
                        charge: dcChargeInput
                      };
                      setDeliveryCharges(prev => [...prev, newDc]);
                      showNotif(`Added delivery rate for ${dcDistrictInput}!`, 'success');
                    }
                    setDcDistrictInput('');
                    setDcChargeInput(60);
                  }} 
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      District / Region Name
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Dhaka, Chittagong, Outside Dhaka"
                      value={dcDistrictInput}
                      onChange={(e) => setDcDistrictInput(e.target.value)}
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Make matches simple (e.g. "Dhaka", "Chittagong") for matching address checking.</p>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                      Delivery Charge (৳)
                    </label>
                    <input 
                      type="number"
                      required
                      min={0}
                      value={dcChargeInput || 0}
                      onChange={(e) => setDcChargeInput(parseInt(e.target.value) || 0)}
                      className="w-full font-mono font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-indigo-700"
                    />
                  </div>

                  <div className="flex gap-2">
                    {dcEditingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setDcEditingId(null);
                          setDcDistrictInput('');
                          setDcChargeInput(60);
                        }}
                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold py-3 rounded-xl uppercase active:scale-95 transition-all text-center cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl uppercase active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> {dcEditingId ? 'Update Rate' : 'Add Rate'}
                    </button>
                  </div>

                  {/* Info warning */}
                  <p className="text-[10px] text-zinc-400 bg-amber-50 p-3 rounded-xl border border-amber-100 leading-relaxed font-semibold">
                    ⚠️ District delivery rates will be evaluated matches against customer typed shipping Address values during direct store purchases.
                  </p>
                </form>
              </div>

              {/* Grid list of district charges */}
              <div className="xl:col-span-2 space-y-4">
                <div className="bg-white border rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                      Active Charges Registry
                    </h3>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100 font-mono">
                      {deliveryCharges.length} Configurations
                    </span>
                  </div>

                  {deliveryCharges.length === 0 ? (
                    <div className="text-center py-10 font-bold text-slate-400 text-xs">
                      No customized rates configured. The checkout defaults to FREE Delivery.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                      {deliveryCharges.map(dc => (
                        <div key={dc.id} className="bg-slate-50 border p-4 rounded-2xl flex items-center justify-between hover:ring-1 hover:ring-emerald-200/50 transition-all">
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="font-extrabold text-slate-800 text-xs truncate uppercase tracking-tight" title={dc.district}>{dc.district}</h4>
                            <p className="font-mono text-emerald-600 font-bold text-[11px] mt-1 bg-white border border-emerald-100 px-2 py-0.5 rounded-lg w-fit">
                              ৳{dc.charge} Delivery
                            </p>
                          </div>
                          
                          <div className="flex gap-1.5 shrink-0">
                            <button 
                              onClick={() => {
                                setDcDistrictInput(dc.district);
                                setDcChargeInput(dc.charge);
                                setDcEditingId(dc.id);
                                showNotif(`Loaded ${dc.district} to edit form!`, 'success');
                              }}
                              className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all cursor-pointer"
                              title="Edit rate"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                setDeliveryCharges(prev => prev.filter(item => item.id !== dc.id));
                                showNotif(`Deleted configuration for ${dc.district}.`, 'success');
                              }}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                              title="Delete rate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 6.4 BRAND FOOTER CUSTOMIZER MANAGER */}
        {activeTab === 'footer_customize' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-500 animate-pulse" /> Reseller Support & Storefront Branding Desk
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-bold uppercase tracking-wide">
                Configure immediate contact numbers, support emails, social networks, and live messenger group chat links that display on the Reseller Help Panel.
              </p>
            </div>

            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight border-b pb-2 mb-4">
                Footer Content Settings
              </h3>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  showNotif('Footer settings preserved and synced!', 'success');
                }}
                className="space-y-4 text-xs font-semibold text-slate-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">About Us Brief Paragraph</label>
                    <textarea 
                      rows={3}
                      className="w-full font-semibold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-xs text-slate-800"
                      value={footerConfig.aboutUs}
                      onChange={(e) => setFooterConfig({ ...footerConfig, aboutUs: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Reselling Banner Callout</label>
                    <textarea 
                      rows={3}
                      className="w-full font-semibold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-xs text-slate-800"
                      value={footerConfig.joinResellerBanner}
                      onChange={(e) => setFooterConfig({ ...footerConfig, joinResellerBanner: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Support Email Address</label>
                    <input 
                      type="email"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-xs"
                      value={footerConfig.contactEmail}
                      onChange={(e) => setFooterConfig({ ...footerConfig, contactEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Support Phone Contact</label>
                    <input 
                      type="text"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-xs"
                      value={footerConfig.contactPhone}
                      onChange={(e) => setFooterConfig({ ...footerConfig, contactPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Privacy Policy brief note</label>
                    <input 
                      type="text"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-xs"
                      value={footerConfig.privacyPolicy}
                      onChange={(e) => setFooterConfig({ ...footerConfig, privacyPolicy: e.target.value })}
                    />
                  </div>
                </div>

                {/* INTERACTIVE FULL PAGE DOCUMENT EDITORS */}
                <div className="bg-rose-50/50 border border-pink-100/50 rounded-2xl p-4 sm:p-5 mt-4 space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                    Interactive Customer Full-Page Document Editor
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Write beautiful raw text or complete custom HTML templates (headings, paragraphs, line breaks) below. When shoppers click on these Footer Quick Links, they will load as a stunning bespoke full-screen page with proper native styling instead of mini popups.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-slate-600 font-extrabold uppercase text-[9px] tracking-wider">Privacy Policy Full Page (HTML/Text Content)</label>
                      <textarea 
                        rows={10}
                        className="w-full font-mono font-semibold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-xs text-slate-800"
                        placeholder="<h1>Privacy Policy</h1><p>Our guidelines...</p>"
                        value={footerConfig.privacyPolicyFullText || ''}
                        onChange={(e) => setFooterConfig({ ...footerConfig, privacyPolicyFullText: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-slate-600 font-extrabold uppercase text-[9px] tracking-wider">Terms & Conditions Full Page (HTML/Text Content)</label>
                      <textarea 
                        rows={10}
                        className="w-full font-mono font-semibold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-xs text-slate-800"
                        placeholder="<h1>Terms & Conditions</h1><p>Our specifications...</p>"
                        value={footerConfig.termsConditionsFullText || ''}
                        onChange={(e) => setFooterConfig({ ...footerConfig, termsConditionsFullText: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Facebook Social Link URL</label>
                    <input 
                      type="url"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-indigo-700 text-xs"
                      value={footerConfig.facebook}
                      onChange={(e) => setFooterConfig({ ...footerConfig, facebook: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">YouTube Social Link URL</label>
                    <input 
                      type="url"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-indigo-700 text-xs"
                      value={footerConfig.youtube}
                      onChange={(e) => setFooterConfig({ ...footerConfig, youtube: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Instagram Social Link URL</label>
                    <input 
                      type="url"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-indigo-700 text-xs"
                      value={footerConfig.instagram || ''}
                      onChange={(e) => setFooterConfig({ ...footerConfig, instagram: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">TikTok Social Link URL</label>
                    <input 
                      type="url"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-indigo-700 text-xs"
                      value={footerConfig.tiktok || ''}
                      onChange={(e) => setFooterConfig({ ...footerConfig, tiktok: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Physical Location / Address</label>
                    <input 
                      type="text"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-xs"
                      value={footerConfig.address || ''}
                      placeholder="e.g. Dokkhin Mugda, Bazar Mosjid, Hamid Tower Dhaka, Bangladesh."
                      onChange={(e) => setFooterConfig({ ...footerConfig, address: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px]">Shop Website link (URL)</label>
                    <input 
                      type="url"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-indigo-700 text-xs"
                      value={footerConfig.websiteUrl || ''}
                      placeholder="e.g. https://badhonsworld.com"
                      onChange={(e) => setFooterConfig({ ...footerConfig, websiteUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-505 font-bold uppercase text-[9px] text-[#e21b70] tracking-wider">
                      Custom Brand Logo URL (কাস্টম লোগো ইউআরএল)
                    </label>
                    <p className="text-[9px] text-slate-400 font-semibold leading-none mb-1">
                      If set, this logo image replaces the "DEALY" text name and side avatar in both header and footer.
                    </p>
                    <input 
                      type="text"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-slate-50 text-pink-600 text-xs"
                      placeholder="https://yourdomain.com/logo.png"
                      value={footerConfig.brandLogoUrl || ''}
                      onChange={(e) => setFooterConfig({ ...footerConfig, brandLogoUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px] text-indigo-600">Developed By (Developer Name)</label>
                    <input 
                      type="text"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-xs"
                      value={footerConfig.developerName || ''}
                      placeholder="e.g. Mubarak"
                      onChange={(e) => setFooterConfig({ ...footerConfig, developerName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px] text-indigo-600">Developer Profile URL Link</label>
                    <input 
                      type="url"
                      className="w-full font-bold border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-indigo-700 text-xs"
                      value={footerConfig.developerUrl || ''}
                      placeholder="e.g. https://github.com/..."
                      onChange={(e) => setFooterConfig({ ...footerConfig, developerUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold uppercase text-[9px] text-pink-600">Upload Header/Footer Custom Brand Logo File</label>
                    <p className="text-[9px] text-slate-400 font-semibold leading-none mb-1">
                      Upload your custom logo (keeps text transparent if png). Will automatically scale.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-pink-500 bg-slate-50 hover:bg-pink-50/25 p-3 rounded-xl cursor-pointer transition-all">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-extrabold text-slate-500 mt-1">Upload brand logo file (png/jpg)</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                showNotif("Logo file size must be less than 2MB", "error");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const compressed = await compressImage(reader.result as string, 800, 300, 0.85, true);
                                setFooterConfig({ ...footerConfig, brandLogoUrl: compressed });
                                showNotif("Brand logo uploaded and updated successfully!", "success");
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {footerConfig.brandLogoUrl && (
                        <div className="h-14 max-w-[200px] border-2 border-slate-200 bg-slate-100 p-1.5 rounded-xl shrink-0 flex items-center justify-center">
                          <img src={footerConfig.brandLogoUrl} className="max-h-full max-w-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase py-3.5 rounded-xl cursor-pointer text-center text-xs tracking-wider"
                  >
                    Save & Apply Brand Footer Customizations
                  </button>
                </div>
              </form>
            </div>

            {/* Dynamic Social/Contact Link List Configurator */}
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                  Reseller Partner Help & Social Links Configurator
                </h3>
                <p className="text-[10px] text-slate-400 font-bold">Configure active channels for WhatsApp, Instagram, Telegram, etc.</p>
              </div>

              <div className="space-y-4">
                {/* Existing links table or list */}
                {(!footerConfig.customLinks || footerConfig.customLinks.length === 0) ? (
                  <p className="text-slate-400 py-4 text-center text-xs">No custom resources/social links currently configured. Click add to register a support link!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {footerConfig.customLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl hover:border-pink-300 transition-colors">
                        <div className="space-y-0.5 truncate pr-2">
                          <span className="font-extrabold text-slate-800 text-xs block">{link.name}</span>
                          <a href={link.url} target="_blank" rel="noreferrer" className="text-indigo-600 font-mono text-[10px] truncate block max-w-xs hover:underline">
                            {link.url}
                          </a>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const updatedLinks = [...(footerConfig.customLinks || [])];
                            updatedLinks.splice(idx, 1);
                            setFooterConfig({ ...footerConfig, customLinks: updatedLinks });
                            showNotif(`Link "${link.name}" deleted. Please save configurations.`, 'success');
                          }}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form block to add new links inline */}
                <div className="border-t border-slate-100 pt-4 mt-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-extrabold text-slate-700 text-xs mb-3 flex items-center gap-1">
                    <Plus className="w-4 h-4 text-pink-500" /> Create Custom Connection Link (WhatsApp, Telegram, etc.)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-400 font-bold uppercase text-[8px] mb-1">Platform / Channel Name</label>
                      <input 
                        type="text" 
                        id="new-link-name"
                        placeholder="e.g. Reseller Help WhatsApp, Telegram Hub"
                        className="w-full font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold uppercase text-[8px] mb-1">Redirection Link URL</label>
                      <input 
                        type="url" 
                        id="new-link-url"
                        placeholder="e.g. https://wa.me/880..."
                        className="w-full font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white text-xs text-slate-800"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nameInput = document.getElementById('new-link-name') as HTMLInputElement | null;
                      const urlInput = document.getElementById('new-link-url') as HTMLInputElement | null;
                      if (nameInput && urlInput) {
                        const name = nameInput.value.trim();
                        const url = urlInput.value.trim();
                        if (!name || !url) {
                          showNotif('Provide both channel description name and target URL.', 'error');
                          return;
                        }
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                          showNotif('URL must start with http:// or https://', 'error');
                          return;
                        }
                        
                        const currentLinks = footerConfig.customLinks ? [...footerConfig.customLinks] : [];
                        currentLinks.push({ name, url });
                        setFooterConfig({ ...footerConfig, customLinks: currentLinks });
                        
                        // Clear inputs
                        nameInput.value = '';
                        urlInput.value = '';
                        showNotif(`Registered support Link for "${name}"! Click save to apply changes.`, 'success');
                      }
                    }}
                    className="mt-3.5 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-extrabold px-6 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow shadow-pink-500/10 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Register Connection Link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 7. WITHDRAWALS TRANSFERS */}
        {activeTab === 'withdrawals' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Withdrawal Requests Ledger</h2>
            <p className="text-xs text-slate-400">Authorize or reject payout extraction requests submitted by network partners.</p>

            {withdrawals.length === 0 ? (
              <p className="py-12 text-slate-400 text-center font-bold bg-white border rounded-2xl shadow-sm">No ledger payouts requested currently.</p>
            ) : (
              <div className="space-y-4">
                {withdrawals.map(w => {
                  const owner = users.find(u => u.id === w.userId);
                  return (
                    <div key={w.id} className="bg-white p-5 border rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-pink-600 font-extrabold text-sm">{owner?.name || 'Affiliate'}</span>
                          <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 rounded">
                            {owner?.idCode || 'N/A'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px] mt-0.5">{owner?.email} • Created : {w.date}</p>
                        
                        <div className="bg-slate-50 p-2.5 rounded-xl border mt-3 flex gap-4 text-slate-600 font-bold text-[10px]">
                          <span>Ledger Gateway: <b className="text-slate-800">{w.method}</b></span>
                          <span>Account: <b className="text-slate-800 font-mono">{w.account}</b></span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2 text-xs">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold">WITHDRAW VALUE</p>
                          <span className="text-lg font-black text-slate-900">৳{w.amount}</span>
                        </div>

                        {w.status === 'pending' ? (
                          <div className="flex gap-2.5 mt-1">
                            <button 
                              onClick={() => approveWithdrawal(w.id)}
                              className="bg-emerald-600 font-bold text-white text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => rejectWithdrawal(w.id)}
                              className="bg-red-500 font-bold text-white text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${w.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {w.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* 8. REGISTERED RESELLERS (KYC ASSIGNMENT OVERLAY) */}
        {activeTab === 'users' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Create Reseller profile */}
            <div className="bg-white p-6 border rounded-3xl shadow-sm text-xs">
              <h3 className="font-extrabold text-sm uppercase mb-4 text-slate-900">Create Shopper Partner account manually</h3>
              <form onSubmit={createReseller} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input text-xs" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Log Address</label>
                  <input type="email" className="form-input text-xs" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                </div>
                <div className="form-group pb-1">
                  <label className="form-label">Password Key</label>
                  <div className="relative">
                    <input 
                      type={showNewUserPass ? "text" : "password"} 
                      className="form-input text-xs pr-10 w-full" 
                      required 
                      value={newUser.pass} 
                      onChange={(e) => setNewUser({ ...newUser, pass: e.target.value })} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewUserPass(!showNewUserPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-450 hover:text-slate-600 flex items-center bg-transparent border-none cursor-pointer"
                    >
                      {showNewUserPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-3 flex justify-end">
                  <button type="submit" className="bg-slate-900 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer">
                    Create Reseller Profile
                  </button>
                </div>
              </form>
            </div>

            {/* List active partners */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <h3 className="font-extrabold text-sm text-slate-800">Database Affiliates & Resellers</h3>
                
                {/* Filter Sub-Tabs for Resellers/Affiliates */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All', count: users.filter(u => u.role === 'user').length },
                    { id: 'approved', label: 'Approved', count: users.filter(u => u.role === 'user' && u.status === 'approved').length },
                    { id: 'pending', label: 'Pending', count: users.filter(u => u.role === 'user' && u.status === 'pending').length },
                    { id: 'verified', label: 'Verified', count: users.filter(u => u.role === 'user' && u.kyc?.status === 'verified').length },
                    { id: 'unverified', label: 'Unverified', count: users.filter(u => u.role === 'user' && u.kyc?.status !== 'verified').length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setResellerFilter(tab.id as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        resellerFilter === tab.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1 py-0.2 rounded text-[9px] font-extrabold font-mono ${resellerFilter === tab.id ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-500'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {users.filter(u => {
                if (u.role !== 'user') return false;
                if (resellerFilter === 'approved') return u.status === 'approved';
                if (resellerFilter === 'pending') return u.status === 'pending';
                if (resellerFilter === 'verified') return u.kyc?.status === 'verified';
                if (resellerFilter === 'unverified') return u.kyc?.status !== 'verified';
                return true;
              }).map(usr => (
                <div key={usr.id} className="bg-white rounded-2xl border p-4.5 space-y-3.5 shadow-xs">
                  <div className="flex gap-4 justify-between items-center flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-4.5">
                      <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-full font-black text-indigo-600 flex items-center justify-center shrink-0">
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="font-extrabold text-slate-900 text-sm">{usr.name}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-slate-500">{formatResellerId(usr, users)}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                            usr.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : usr.status === 'pending' 
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {usr.status || 'approved'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{usr.email} | Balance : <b>৳{usr.balance}</b></p>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-center flex-wrap shrink-0">
                      {/* Subscription Badge */}
                      <span className={`inline-flex py-1 px-2.5 rounded-full font-sans text-[9px] font-bold border uppercase ${getSubscriptionCountdown(usr.subscriptionExpiresAt) === 'Expired' ? 'bg-red-50 text-red-700 border-red-200' : getSubscriptionCountdown(usr.subscriptionExpiresAt) === 'No active subscription' ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-pink-50 text-pink-700 border-pink-200'}`}>
                        Sub: {getSubscriptionCountdown(usr.subscriptionExpiresAt)}
                      </span>

                      {/* KYC Badge state */}
                      <span className={`inline-flex py-1 px-2.5 rounded-full font-mono text-[9px] font-bold border uppercase ${usr.kyc?.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : usr.kyc?.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                        KYC: {usr.kyc?.status || 'unverified'}
                      </span>

                      {usr.kyc?.status === 'pending' && (
                        <button 
                          onClick={() => triggerKycReview(usr)}
                          className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review Document
                        </button>
                      )}

                      <button 
                        onClick={() => setEditingUser(usr)}
                        className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-slate-500" />
                      </button>

                      <button 
                        onClick={() => toggleUserBanned(usr.id)}
                        className={`p-1.5 rounded-xl cursor-pointer ${usr.banned ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* PENDING RESELLER REGISTRATION PAYMENT BOX */}
                  {usr.status === 'pending' && usr.pendingSubscription && (
                    <div className="bg-amber-50/50 border border-dashed border-amber-200 rounded-2xl p-4.5 space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                        <span>Subscription Request Details:</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px] tracking-normal font-sans">Payment Pending Approval</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px] text-slate-705 font-semibold">
                        <div><span className="text-slate-400">Business Name:</span> <strong className="text-slate-800">{usr.businessName || 'N/A'}</strong></div>
                        <div><span className="text-slate-400">Address:</span> <strong className="text-slate-800">{usr.address || 'N/A'}</strong></div>
                        <div><span className="text-slate-400">Phone:</span> <strong className="text-slate-800">{usr.phone || 'N/A'}</strong></div>
                        <div><span className="text-slate-400">Package Title:</span> <strong className="text-indigo-600 uppercase font-bold">{usr.pendingSubscription.packageName}</strong></div>
                        <div><span className="text-slate-400">Validity Period:</span> <strong className="text-slate-800">{usr.pendingSubscription.duration}</strong></div>
                        <div><span className="text-slate-400">Fee Paid:</span> <strong className="text-rose-600">৳{usr.pendingSubscription.price}</strong></div>
                        <div><span className="text-slate-400">Gateway:</span> <strong className="text-indigo-600">{usr.pendingSubscription.paymentMethod}</strong></div>
                        <div><span className="text-slate-400">Transaction ID:</span> <span className="bg-white px-1.5 py-0.5 border rounded font-mono text-xs text-slate-900 font-bold">{usr.pendingSubscription.trxId}</span></div>
                        <div><span className="text-slate-400">Request Date:</span> <strong className="text-slate-500 font-mono">{new Date(usr.pendingSubscription.date).toLocaleString()}</strong></div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => approveResellerSubscription(usr.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-600/10"
                        >
                          ✓ Approve Reseller & Activate Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 9. PARTNER ENLISTMENT APPLICATIONS */}
        {activeTab === 'apps' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Distributor Requests</h2>
            <p className="text-xs text-slate-400">Approve micro-distributor partner applications generated from store landing forms.</p>

            {sellerApps.length === 0 ? (
              <p className="py-12 text-slate-400 text-center font-bold bg-white border rounded-2xl shadow-sm">No applicant enlists found.</p>
            ) : (
              <div className="space-y-4 text-xs text-slate-700">
                {sellerApps.map(app => (
                  <div key={app.id} className="bg-white p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">{app.name}</h4>
                      <p className="font-mono text-xs text-indigo-600 mt-1">{app.phone}</p>
                      {app.details && (
                        <p className="bg-slate-50 p-2.5 rounded-xl border mt-3 text-[11px] text-slate-500 leading-relaxed font-semibold">
                          Remarks: {app.details}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => approvePartnerApp(app.id)}
                      className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Approve Partner Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* MANAGE MERCHANT SELLERS DIRECTORY */}
        {activeTab === 'manage_sellers' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800"
          >
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xs animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-500" />
                  Merchant Multi-Vendor Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Manage and monitor your marketplace sellers, view their shop profiles, and administer restriction bans.
                </p>
              </div>
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Merchant Stores</span>
                <span className="font-extrabold text-xl font-black text-slate-800">
                  {users.filter(u => u.role === 'seller').length}
                </span>
              </div>
            </div>

            {/* SELLER REGISTRATION & PAYMENT ONBOARDING SETTINGS */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Bolt className="w-5 h-5 text-pink-500 animate-spin-slow" />
                  Seller Registration Payment & Account Settings
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">
                  Configure whether new merchant registrations require a setup fee payment, specify the payment numbers, fee cost, and validity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Config Toggles */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-2">
                      Seller Registration Fee Status
                    </label>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-48 text-xs font-bold font-sans">
                      <button 
                        type="button"
                        onClick={() => setSellPayOn(true)}
                        className={`w-1/2 py-2 rounded-lg transition-all cursor-pointer border-none bg-transparent ${sellPayOn ? 'bg-white shadow text-pink-600' : 'text-slate-500'}`}
                      >
                        Enabled
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSellPayOn(false)}
                        className={`w-1/2 py-2 rounded-lg transition-all cursor-pointer border-none bg-transparent ${!sellPayOn ? 'bg-white shadow text-pink-600' : 'text-slate-500'}`}
                      >
                        Disabled
                      </button>
                    </div>
                    <p className="text-[9.5px] text-slate-400 mt-2 font-medium">
                      If enabled, sellers must input bKash/Nagad/Rocket transaction parameters to complete their registration. If disabled, they can register instantly.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">
                        Registration Fee (BDT)
                      </label>
                      <input 
                        type="number"
                        value={sellPayAmt}
                        onChange={(e) => setSellPayAmt(Number(e.target.value))}
                        disabled={!sellPayOn}
                        placeholder="e.g. 500"
                        className="w-full text-xs font-bold border border-slate-205 hover:border-slate-350 focus:border-pink-500 bg-slate-50/20 rounded-xl px-4 py-2.5 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-1">
                        Validity Period (মেয়াদ)
                      </label>
                      <input 
                        type="text"
                        value={sellPayTerm}
                        onChange={(e) => setSellPayTerm(e.target.value)}
                        disabled={!sellPayOn}
                        placeholder="e.g. 1 Year / Lifetime"
                        className="w-full text-xs font-bold border border-slate-205 hover:border-slate-350 focus:border-pink-500 bg-slate-50/20 rounded-xl px-4 py-2.5 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Account Numbers */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10.5px] text-slate-500 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span> bKash Merchant/Personal Number
                      </label>
                      <input 
                        type="text"
                        value={sellPayBKash}
                        onChange={(e) => setSellPayBKash(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX"
                        className="w-full text-xs font-bold border border-slate-205 hover:border-slate-300 bg-slate-50/10 rounded-xl px-4 py-2.5 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] text-slate-500 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span> Nagad Merchant/Personal Number
                      </label>
                      <input 
                        type="text"
                        value={sellPayNagad}
                        onChange={(e) => setSellPayNagad(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX"
                        className="w-full text-xs font-bold border border-slate-205 hover:border-slate-300 bg-slate-50/10 rounded-xl px-4 py-2.5 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10.5px] text-slate-500 font-extrabold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span> Rocket Number (with wallet digit)
                      </label>
                      <input 
                        type="text"
                        value={sellPayRocket}
                        onChange={(e) => setSellPayRocket(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX-X"
                        className="w-full text-xs font-bold border border-slate-205 hover:border-slate-300 bg-slate-50/10 rounded-xl px-4 py-2.5 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSellerPayConfig}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-sm border-none flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Save Onboarding Settings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Registered Shop Accounts</h3>
              </div>
              
              {users.filter(u => u.role === 'seller').length === 0 ? (
                <div className="py-16 text-center text-slate-400 bg-white">
                  <p className="font-black text-slate-500 mb-1">No seller partners found.</p>
                  <p className="text-[10.5px] text-slate-400">Stores will appear once vendors register through the Merchant Console.</p>
                </div>
              ) : (
                <div className="overflow-x-auto text-xs text-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100">
                        <th className="p-4 uppercase tracking-wider text-[10px]">Shop Name</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Merchant Email</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Contact Phone</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Shop Rating & Stats</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Code</th>
                        <th className="p-4 uppercase tracking-wider text-[10px] text-center">Status</th>
                        <th className="p-4 uppercase tracking-wider text-[10px] text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.filter(u => u.role === 'seller').map(sel => {
                        // Calculate stats with potential custom ones taking precedence
                        const sellerName = sel.name || 'Orivian Official Store';
                        let hash = 0;
                        for (let i = 0; i < sellerName.length; i++) {
                          hash = sellerName.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        const rawRating = 82 + Math.abs(hash % 16); 
                        const defaultRating = Math.min(rawRating, 98);
                        const defaultShipOnTime = 92 + Math.abs((hash >> 2) % 9); 
                        const defaultChatResponse = 85 + Math.abs((hash >> 4) % 15); 
                        const followersVal = ((10 + Math.abs((hash >> 1) % 45)) / 10); 
                        const defaultFollowersStr = followersVal.toFixed(1) + 'k';

                        const currentRating = sel.sellerRating !== undefined ? sel.sellerRating : defaultRating;
                        const currentShipOnTime = sel.sellerShipOnTime !== undefined ? sel.sellerShipOnTime : defaultShipOnTime;
                        const currentChatResponse = sel.sellerChatResponse !== undefined ? sel.sellerChatResponse : defaultChatResponse;
                        const currentFollowers = sel.sellerFollowersCount !== undefined ? sel.sellerFollowersCount : defaultFollowersStr;

                        return (
                          <React.Fragment key={sel.id}>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-extrabold text-slate-900 flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black shrink-0">
                                {sel.name ? sel.name.charAt(0).toUpperCase() : 'S'}
                              </span>
                              <div>
                                <span>{sel.name}</span>
                                <span className="block text-[9.5px] font-bold text-emerald-500 font-mono mt-0.5">ID: {sel.id}</span>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-slate-600">{sel.email}</td>
                            <td className="p-4 font-mono text-slate-600 font-bold">{sel.phone || 'N/A'}</td>
                            <td className="p-4">
                              <div className="bg-slate-50/80 rounded-xl p-2 md:p-2.5 border border-slate-100 text-[10.5px] space-y-1 w-44 leading-tight">
                                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">Rating:</span> <span className="font-extrabold text-pink-600 font-mono">{currentRating}%</span></div>
                                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">Followers:</span> <span className="font-extrabold text-slate-700 font-mono">{currentFollowers}</span></div>
                                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">On-Time:</span> <span className="font-extrabold text-emerald-600 font-mono">{currentShipOnTime}%</span></div>
                              </div>
                            </td>
                            <td className="p-4 font-mono font-black text-slate-500">{formatSellerId(sel, users)}</td>
                            <td className="p-4 text-center">
                              {sel.kyc?.status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-black animate-pulse">
                                  ⌛ PENDING
                                </span>
                              ) : sel.banned ? (
                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-black">
                                  <X className="w-3 h-3" /> RESTRICTED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black">
                                  <Check className="w-3 h-3" /> ACTIVE
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right flex items-center justify-end gap-2 h-16">
                              <button
                                onClick={() => setExpandedSellerId(expandedSellerId === sel.id ? null : sel.id)}
                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition-all border border-indigo-100 cursor-pointer shrink-0"
                              >
                                {expandedSellerId === sel.id ? "Hide Details" : "Details"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSellerForStats(sel);
                                  setEditSellerRating(currentRating);
                                  setEditSellerFollowers(currentFollowers);
                                  setEditSellerShipOnTime(currentShipOnTime);
                                  setEditSellerChatResponse(currentChatResponse);
                                }}
                                className="bg-pink-100 hover:bg-pink-200 text-pink-600 font-black text-[11px] px-3 py-1.5 rounded-xl transition-all border border-pink-200 cursor-pointer shrink-0"
                              >
                                Edit Stats
                              </button>
                              {sel.kyc?.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    setUsers(prev => prev.map(u => u.id === sel.id ? { 
                                      ...u, 
                                      kyc: { ...u.kyc, status: 'verified' } 
                                    } : u));
                                    showNotif(`Seller account "${sel.name}" approved successfully! They can now log in.`, "success");
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] px-3 py-1.5 rounded-xl transition-all shadow-sm border-none cursor-pointer shrink-0"
                                >
                                  Approve Shop
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setUsers(prev => prev.map(u => u.id === sel.id ? { ...u, banned: !u.banned } : u));
                                  showNotif(sel.banned ? `Seller "${sel.name}" has been reinstated.` : `Seller "${sel.name}" has been banned/restricted.`, "success");
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer border-none shrink-0 ${sel.banned ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                              >
                                {sel.banned ? "Reactivate" : "Block"}
                              </button>
                            </td>
                          </tr>
                          {expandedSellerId === sel.id && (
                            <tr key={`${sel.id}-details`} className="bg-slate-50/70">
                              <td colSpan={7} className="p-5 border-t border-b border-dashed border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed">
                                  <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs">
                                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide border-b pb-1">
                                      Merchant Shop Links & Socials
                                    </h4>
                                    <div className="space-y-1.5">
                                      <p className="flex items-center gap-1.5">
                                        <span className="text-slate-400 font-bold">Business Page Link:</span>
                                        {sel.businessPageLink ? (
                                          <a 
                                            href={sel.businessPageLink.startsWith('http') ? sel.businessPageLink : `https://${sel.businessPageLink}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-pink-600 font-black hover:underline inline-flex items-center gap-0.5"
                                          >
                                            {sel.businessPageLink} <ArrowUpRight className="w-3 h-3" />
                                          </a>
                                        ) : (
                                          <span className="text-slate-400 italic">None provided</span>
                                        )}
                                      </p>
                                      <p className="flex items-center gap-1.5">
                                        <span className="text-slate-400 font-bold">Personal Profile URL:</span>
                                        {sel.profileUrl ? (
                                          <a 
                                            href={sel.profileUrl.startsWith('http') ? sel.profileUrl : `https://${sel.profileUrl}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 font-black hover:underline inline-flex items-center gap-0.5"
                                          >
                                            {sel.profileUrl} <ArrowUpRight className="w-3 h-3" />
                                          </a>
                                        ) : (
                                          <span className="text-slate-400 italic">None provided</span>
                                        )}
                                      </p>
                                      <p className="mt-1">
                                        <span className="text-slate-400 font-bold block mb-0.5">Bio / Remarks:</span>
                                        <span className="text-slate-700 font-semibold bg-slate-50 p-2 rounded-lg block border">
                                          {sel.kyc?.nidName || "No extra bio parameters."}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs">
                                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide border-b pb-1">
                                      Onboarding Payment & Support Message
                                    </h4>
                                    
                                    {sel.sellerRegPayment ? (
                                      <div className="space-y-1">
                                        <p className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded inline-block text-[9.5px]">
                                          💰 REGISTRATION FEE PAID
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 mt-2 font-semibold">
                                          <p><span className="text-slate-400">Method:</span> <span className="font-extrabold text-slate-800">{sel.sellerRegPayment.method}</span></p>
                                          <p><span className="text-slate-400">Paid Amount:</span> <span className="font-extrabold text-pink-600 font-mono">৳{sel.sellerRegPayment.amount}</span></p>
                                          <p className="col-span-2"><span className="text-slate-400 font-bold">Sender Number:</span> <span className="font-mono font-bold text-slate-700">{sel.sellerRegPayment.senderPhone}</span></p>
                                          <p className="col-span-2"><span className="text-slate-400 font-bold">Transaction ID:</span> <span className="font-mono bg-slate-100 border px-1.5 py-0.5 rounded font-black text-indigo-700 select-all">{sel.sellerRegPayment.trxId}</span></p>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-slate-400 font-semibold mt-1 italic text-[10px]">
                                        No upfront registration payment submitted (either registered free or payment was disabled).
                                      </p>
                                    )}

                                    <div className="mt-2.5">
                                      <span className="text-slate-400 font-bold block mb-0.5">Note/Support Message to Admin:</span>
                                      <span className="text-slate-800 font-extrabold bg-pink-50/50 p-2 rounded-lg block border border-pink-100">
                                        {sel.sellerMessage || "N/A (No additional message sent yet)"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* REVIEW SELLER SUBMITTED PRODUCTS */}
        {activeTab === 'seller_product_reviews' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs animate-fade-in animate-once">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-pink-500" />
                  Seller Products Administration Node
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Approve or disapprove products loaded by sellers. Approved products instantly load in client shops.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending reviews</span>
                  <span className="font-extrabold text-lg font-black text-amber-500 font-mono">
                    {products.filter(p => p.approvalStatus === 'pending').length}
                  </span>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Vendor Wares</span>
                  <span className="font-extrabold text-lg font-black text-slate-800 font-mono">
                    {products.filter(p => p.sellerId).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Filters: All, Pending, Approved, Rejected */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Product Approvals</h3>
              </div>

              {products.filter(p => p.sellerId).length === 0 ? (
                <div className="py-20 text-center text-slate-400 bg-white">
                  <p className="font-black text-slate-500 mb-1">No seller actions detected.</p>
                  <p className="text-xs text-slate-400">Sellers have not posted or modified any items yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto text-xs text-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 font-sans">
                        <th className="p-4 uppercase tracking-wider text-[10px]">Product Information</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Merchant Seller</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Catalog Price</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Stock Condition</th>
                        <th className="p-4 uppercase tracking-wider text-[10px]">Current Status</th>
                        <th className="p-4 uppercase tracking-wider text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {products.filter(p => p.sellerId).map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img 
                              src={prod.img || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300"} 
                              alt={prod.name} 
                              className="w-12 h-12 rounded-xl object-contain bg-slate-50 border p-1"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm">{prod.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">ID: {prod.id}</p>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">
                            <span className="block text-slate-800 font-bold">{prod.sellerName || "Merchant Store"}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">SEL_ID: {prod.sellerId}</span>
                          </td>
                          <td className="p-4">
                            <div className="font-extrabold text-slate-900">৳{prod.discountPrice}</div>
                            {prod.originalPrice > prod.discountPrice && (
                              <div className="text-[10px] text-slate-400 line-through font-medium">৳{prod.originalPrice}</div>
                            )}
                          </td>
                          <td className="p-4">
                            {prod.inStock ? (
                              <span className="text-emerald-600 font-bold">In Stock</span>
                            ) : (
                              <span className="text-red-500 font-bold">Out of Stock</span>
                            )}
                          </td>
                          <td className="p-4">
                            {prod.approvalStatus === 'approved' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black">
                                <Check className="w-3 h-3" /> APPROVED
                              </span>
                            ) : prod.approvalStatus === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-black">
                                <X className="w-3 h-3" /> REJECTED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full text-[10px] font-black animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-amber-500" /> PENDING
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {prod.approvalStatus !== 'approved' && (
                                <button
                                  onClick={() => {
                                    setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, approvalStatus: 'approved' } : p));
                                    showNotif(`Vendor product "${prod.name}" approved successfully. It is now live!`, "success");
                                  }}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-black px-3.5 py-1.5 rounded-xl cursor-pointer transition-all border-none"
                                >
                                  Approve
                                </button>
                              )}
                              {prod.approvalStatus !== 'rejected' && (
                                <button
                                  onClick={() => {
                                    setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, approvalStatus: 'rejected' } : p));
                                    showNotif(`Vendor product "${prod.name}" has been rejected.`, "success");
                                  }}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 font-black px-3.5 py-1.5 rounded-xl cursor-pointer transition-all border-none"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW SELLER SPECIFIC ORDERS IN ADMIN PANEL */}
        {activeTab === 'seller_orders' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs animate-fade-in animate-once">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-sky-500" />
                  Vendor Seller Orders Dispatch Log
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Overview of customer and reseller orders that were routed to registered seller stores. Sellers handle their own fulfillment and tracking steps.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Seller Orders</span>
                  <span className="font-extrabold text-lg font-black text-slate-800 font-mono">
                    {orders.filter(o => o.sellerId).length}
                  </span>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending Dispatch</span>
                  <span className="font-extrabold text-lg font-black text-amber-500 font-mono">
                    {orders.filter(o => o.sellerId && o.status === 'Pending').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Filters: All, Pending, Approved, Processing, Shipped, Delivered, Cancelled */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'] as const).map(f => {
                    const count = f === 'all' 
                      ? orders.filter(o => o.sellerId).length
                      : orders.filter(o => o.sellerId && o.status === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setSellerOrderFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all border-none cursor-pointer ${
                          sellerOrderFilter === f 
                            ? 'bg-sky-500 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f === 'all' ? 'All Orders' : f} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {(() => {
                const sellerOrdersList = orders
                  .filter(o => o.sellerId && (sellerOrderFilter === 'all' || o.status === sellerOrderFilter))
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

                return sellerOrdersList.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 bg-white">
                    <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="font-black text-slate-500 mb-1">No seller orders found.</p>
                    <p className="text-xs text-slate-400">Orders for vendor items will show up here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto text-xs text-slate-800">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100">
                          <th className="p-4 uppercase tracking-wider text-[10px]">Order tracking ID</th>
                          <th className="p-4 uppercase tracking-wider text-[10px]">Seller Store</th>
                          <th className="p-4 uppercase tracking-wider text-[10px]">Contact Info</th>
                          <th className="p-4 uppercase tracking-wider text-[10px]">Ordered Wares</th>
                          <th className="p-4 uppercase tracking-wider text-[10px]">Total Bill</th>
                          <th className="p-4 uppercase tracking-wider text-[10px] text-center">Status</th>
                          <th className="p-4 uppercase tracking-wider text-[10px] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {sellerOrdersList.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <span className="font-extrabold text-slate-900 block font-mono">{ord.trackingId}</span>
                            <span className="block text-[10px] text-slate-400 mt-1 font-semibold">{ord.date}</span>
                            <span className="inline-block bg-slate-100 text-[9px] text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase mt-1">
                              Via: {ord.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-slate-800 block">{ord.sellerName || 'Merchant Store'}</span>
                            <span className="text-[10px] text-slate-450 font-mono">ID: {ord.sellerId}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-slate-900 block">{ord.custName}</span>
                            <span className="text-[10.5px] text-slate-500 font-mono block mt-0.5">{ord.custPhone}</span>
                            <span className="text-[10px] text-slate-400 block max-w-xs truncate" title={ord.custAddress}>{ord.custAddress}</span>
                          </td>
                          <td className="p-4 flex items-center gap-2.5">
                            {ord.prodImg && (
                              <img 
                                src={ord.prodImg} 
                                alt={ord.productName} 
                                className="w-10 h-10 rounded-xl object-contain bg-slate-50 border p-1 shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
                              <span className="font-bold text-slate-900 block">{ord.productName}</span>
                              {ord.color && <span className="text-[9.5px] text-slate-400 font-bold">Color: {ord.color}</span>}
                            </div>
                          </td>
                          <td className="p-4 font-mono">
                            <span className="font-black text-slate-900 block">৳{ord.amount}</span>
                            <span className="text-[10px] text-slate-450 block font-normal text-[9.5px]">Method: {ord.paymentMethod || 'COD'}</span>
                            <div className="mt-1">
                              <TinyInvoiceDetails order={ord} />
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[9.5px] font-black uppercase tracking-widest ${
                              ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              ord.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' :
                              'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to cancel Order ${ord.trackingId}?`)) {
                                  const updatedTimeline = [
                                    ...ord.timeline,
                                    {
                                      status: 'Cancelled' as OrderStatus,
                                      date: formatToDhakaTime(),
                                      description: 'Cancelled by Administrative Overlay.',
                                      isCompleted: true
                                    }
                                  ];
                                  setOrders(prev => prev.map(o => o.id === ord.id ? { ...o, status: 'Cancelled', timeline: updatedTimeline } : o));
                                  showNotif(`Order ${ord.trackingId} has been cancelled by Admin.`, "success");
                                }
                              }}
                              disabled={ord.status === 'Cancelled' || ord.status === 'Delivered'}
                              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black transition-all cursor-pointer border-none ${
                                ord.status === 'Cancelled' || ord.status === 'Delivered'
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              }`}
                            >
                              Cancel Order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ); })()}
            </div>
          </motion.div>
        )}

        {activeTab === 'reseller_page' && resellerPageConfig && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" /> Reseller Landing Page Customizer
              </h2>
              <p className="text-xs text-slate-400">Manage titles, promotion video embed paths, subscription packages, benefit cards, and FAQs in real-time.</p>
            </div>

            {/* Sub-tab pills */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1.5 w-fit border border-slate-200 flex-wrap">
              {(['content', 'subscriptions', 'faqs', 'benefits', 'referrals'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setResellerSubTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all cursor-pointer ${resellerSubTab === tab ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {tab === 'content' && 'Page Content & Video'}
                  {tab === 'subscriptions' && 'Subscription Packages'}
                  {tab === 'faqs' && 'FAQ List Management'}
                  {tab === 'benefits' && 'Benefits Cards'}
                  {tab === 'referrals' && 'Referral Rewards System ✨'}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Base Content */}
            {resellerSubTab === 'content' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                <div className="border-b pb-3 mb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase">General Heading Text & Video Url</h3>
                  <p className="text-[10px] text-slate-400">A to Z modifications of the landing section</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Display Hero Big Heading (Bangla)</label>
                    <input 
                      type="text" 
                      className="form-input text-xs font-bold" 
                      value={resellerPageConfig.title} 
                      onChange={(e) => updateResellerPageValue('title', e.target.value)} 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Register Button Call To Action</label>
                    <input 
                      type="text" 
                      className="form-input text-xs font-bold" 
                      value={resellerPageConfig.registerBtnText} 
                      onChange={(e) => updateResellerPageValue('registerBtnText', e.target.value)} 
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-slate-700">Hero Subtitle Paragraph</label>
                    <textarea 
                      rows={2} 
                      className="form-input text-xs" 
                      value={resellerPageConfig.subtitle} 
                      onChange={(e) => updateResellerPageValue('subtitle', e.target.value)} 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Embedded Video URL (YouTube embed compatible, e.g. https://www.youtube.com/embed/...)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://www.youtube.com/embed/Mce9Wsh4uAw" 
                      className="form-input text-xs font-mono" 
                      value={resellerPageConfig.videoUrl} 
                      onChange={(e) => updateResellerPageValue('videoUrl', e.target.value)} 
                    />
                    <p className="text-[9px] text-slate-400">Make sure to provide the embedded format URL to bypass browser iframe sandbox protections.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Social Proof Count Notice Label</label>
                    <input 
                      type="text" 
                      className="form-input text-xs" 
                      value={resellerPageConfig.bannerNotice} 
                      onChange={(e) => updateResellerPageValue('bannerNotice', e.target.value)} 
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-slate-700">Benefits Grid Headline Title</label>
                    <input 
                      type="text" 
                      className="form-input text-xs" 
                      value={resellerPageConfig.sectionsHeadline} 
                      onChange={(e) => updateResellerPageValue('sectionsHeadline', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="border-t pt-5 mt-4 border-slate-150">
                  <div className="pb-3 mb-2">
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase">Founder Section Info</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Configure credentials of the founder motivation block</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Founder Full Name</label>
                      <input 
                        type="text" 
                        className="form-input text-xs font-bold" 
                        value={resellerPageConfig.founderName} 
                        onChange={(e) => updateResellerPageValue('founderName', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Founder Title / Subtitle</label>
                      <input 
                        type="text" 
                        className="form-input text-xs font-medium" 
                        value={resellerPageConfig.founderTitle} 
                        onChange={(e) => updateResellerPageValue('founderTitle', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Founder Photo Image Source URL</label>
                      <input 
                        type="text" 
                        className="form-input text-xs font-mono" 
                        value={resellerPageConfig.founderPhoto} 
                        onChange={(e) => updateResellerPageValue('founderPhoto', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Founder Message</label>
                      <textarea 
                        rows={3} 
                        className="form-input text-xs" 
                        value={resellerPageConfig.founderMsg} 
                        onChange={(e) => updateResellerPageValue('founderMsg', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 border border-pink-100 p-3 rounded-2xl flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <p className="text-[10px] font-bold text-pink-700">These edits persist immediately with modern React context mapping. Changes can be verified instantly by opening the reseller path in the store context!</p>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Subscriptions Crud */}
            {resellerSubTab === 'subscriptions' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Editor */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 h-fit space-y-4 shadow-2xs">
                  <div className="border-b pb-2 mb-1">
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase">
                      {editingSubId ? 'Edit Sub Package' : 'Create New Subscription'}
                    </h3>
                    <p className="text-[9.5px] text-slate-400">Configure cost model and premium parameters</p>
                  </div>

                  <form onSubmit={saveSubscription} className="space-y-3.5 text-xs text-slate-700">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-605">Package Title</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Premium Business Booster" 
                        className="form-input text-xs"
                        value={subFormName}
                        onChange={(e) => setSubFormName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-605">Price In BDT (৳)</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. 3000" 
                          className="form-input text-xs"
                          value={subFormPrice}
                          onChange={(e) => setSubFormPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-605">Valid Duration</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. 2 YEARS" 
                          className="form-input text-xs"
                          value={subFormDuration}
                          onChange={(e) => setSubFormDuration(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-605">Bullets Feature list (line-for-line)</label>
                      <textarea 
                        rows={6}
                        required
                        placeholder="২ বছরের মেন্টর এভেইলিবিলিটি&#10;এক্সক্লুসিভ HD ভিডিও&#10;২৪ ঘণ্টা সাপোর্ট সিস্টেম" 
                        className="form-input text-xs font-medium"
                        value={subFormFeatures}
                        onChange={(e) => setSubFormFeatures(e.target.value)}
                      />
                      <p className="text-[9px] text-slate-400">Put every premium perk statement on an individual newline line.</p>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input 
                        type="checkbox" 
                        id="subActive"
                        className="rounded border-slate-300 text-pink-500 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                        checked={subFormActive}
                        onChange={(e) => setSubFormActive(e.target.checked)}
                      />
                      <label htmlFor="subActive" className="font-bold text-slate-700 cursor-pointer select-none">Active Visibility on store</label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="submit" 
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-[10px] cursor-pointer"
                      >
                        {editingSubId ? 'Modify Plan' : 'Add Solution'}
                      </button>
                      {editingSubId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingSubId(null);
                            setSubFormName('');
                            setSubFormPrice('');
                            setSubFormDuration('');
                            setSubFormFeatures('');
                            setSubFormActive(true);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 text-[10px] rounded-xl uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Subscriptions Grid list */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-50 border p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-800">Currently Listed Plans</h4>
                      <p className="text-[10px] text-slate-400">Active options available for subscription on store page</p>
                    </div>
                    <span className="bg-slate-250 text-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                      Total: {resellerSubscriptions.length}
                    </span>
                  </div>

                  {resellerSubscriptions.length === 0 ? (
                    <div className="bg-white p-12 text-center text-slate-400 font-bold border rounded-3xl">
                      No subscription plans found. Add one on the left panel!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resellerSubscriptions.map(sub => (
                        <div 
                          key={sub.id} 
                          className={`bg-white p-5 rounded-3xl border flex flex-col justify-between transition-all shadow-xs relative ${!sub.isActive ? 'opacity-65 border-slate-300' : 'border-indigo-100 hover:border-indigo-350'}`}
                        >
                          {!sub.isActive && (
                            <span className="absolute top-3.5 right-3.5 bg-slate-200 text-slate-600 font-black text-[8px] uppercase tracking-wide px-2 py-0.5 rounded">
                              Inactive / Draft
                            </span>
                          )}

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{sub.name}</h4>
                            </div>
                            <div className="mt-2 flex items-baseline gap-1">
                              <span className="text-xl font-black text-pink-600">৳{sub.price}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-bold">/ {sub.duration}</span>
                            </div>

                            <ul className="mt-4 space-y-1 border-t pt-3.5 border-slate-100 text-[11px] text-slate-600 space-y-1">
                              {sub.features.map((feat, index) => (
                                <li key={index} className="flex gap-1.5 leading-snug">
                                  <span className="text-pink-500 font-extrabold">•</span>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-5 border-t pt-3 flex items-center justify-between gap-2">
                            <button 
                              type="button"
                              onClick={() => toggleSubscriptionActive(sub.id)}
                              className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-lg uppercase cursor-pointer ${sub.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700'}`}
                            >
                              {sub.isActive ? 'Active' : 'Draft'}
                            </button>

                            <div className="flex items-center gap-2">
                              <button 
                                type="button"
                                onClick={() => editSubscriptionInitiate(sub)}
                                className="text-slate-500 hover:text-indigo-600 p-1 bg-slate-50 hover:bg-slate-100 border rounded-lg cursor-pointer transition-colors"
                                title="Edit coordinates"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this subscription plan permanently?")) {
                                    deleteSubscription(sub.id);
                                  }
                                }}
                                className="text-slate-300 hover:text-red-500 p-1 bg-slate-50 hover:bg-slate-100 border rounded-lg cursor-pointer transition-colors"
                                title="Delete plan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 3: FAQs Management */}
            {resellerSubTab === 'faqs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Editor */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 h-fit space-y-4 shadow-2xs">
                  <div className="border-b pb-2 mb-1">
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase">
                      {editingFaqId ? 'Modify FAQ Component' : 'Add New FAQ'}
                    </h3>
                    <p className="text-[9.5px] text-slate-400">Add common queries with informative answers</p>
                  </div>

                  <form onSubmit={saveFAQ} className="space-y-4 text-xs text-slate-700">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-655">Question (Bangla or English)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. কমিশন কিভাবে পাব?" 
                        className="form-input text-xs" 
                        value={faqFormQuest}
                        onChange={(e) => setFAQFormQuest(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-655">Explanatory Answer</label>
                      <textarea 
                        rows={5} 
                        required
                        placeholder="e.g. প্রতিটা প্রোডাক্ট ডেলিভারি পর কমিশন যোগ হবে..." 
                        className="form-input text-xs leading-relaxed" 
                        value={faqFormAns}
                        onChange={(e) => setFAQFormAns(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="submit" 
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl uppercase text-[10px] cursor-pointer"
                      >
                        {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                      </button>
                      {editingFaqId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingFaqId(null);
                            setFAQFormQuest('');
                            setFAQFormAns('');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 text-[10px] rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* FAQ Entries Cards */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-50 border p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs uppercase text-slate-800">FAQs Collection</h4>
                      <p className="text-[10px] text-slate-400">Total FAQs on Reseller landing page</p>
                    </div>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                      Total: {resellerFAQs.length}
                    </span>
                  </div>

                  {resellerFAQs.length === 0 ? (
                    <div className="bg-white p-12 text-center text-slate-400 font-bold border rounded-3xl">
                      No FAQs indexed. Get started on the left editor!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resellerFAQs.map(faq => (
                        <div key={faq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-start gap-3">
                          <div className="space-y-1.5 flex-1 select-text">
                            <h4 className="font-extrabold text-slate-900 text-xs text-slate-850">Q: {faq.question}</h4>
                            <p className="text-slate-500 font-medium text-[11px] leading-relaxed">A: {faq.answer}</p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button 
                              type="button" 
                              onClick={() => initiateFAQEdit(faq)}
                              className="text-slate-400 hover:text-indigo-600 p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 border cursor-pointer transition-colors"
                              title="Edit item"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => {
                                if (confirm("Remove this FAQ permanently?")) {
                                  deleteFAQ(faq.id);
                                }
                              }}
                              className="text-slate-300 hover:text-red-500 p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 border cursor-pointer transition-colors"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 4: Benefits Grid customization */}
            {resellerSubTab === 'benefits' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Editor */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 h-fit space-y-4 shadow-2xs">
                  <div className="border-b pb-2 mb-1">
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase">
                      Configure Benefit Card
                    </h3>
                    <p className="text-[9.5px] text-slate-400">Tailor the informational value blocks</p>
                  </div>

                  {editingBenefitId ? (
                    <form onSubmit={saveBenefit} className="space-y-4 text-xs text-slate-700">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">Card Heading</label>
                        <input 
                          type="text" 
                          required 
                          className="form-input text-xs" 
                          value={benefitFormTitle}
                          onChange={(e) => setBenefitFormTitle(e.target.value)} 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">Description Guidelines Text</label>
                        <textarea 
                          rows={4} 
                          required 
                          className="form-input text-xs leading-relaxed" 
                          value={benefitFormDesc}
                          onChange={(e) => setBenefitFormDesc(e.target.value)} 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600">Select Visual Badge Icon</label>
                        <select 
                          className="form-input text-xs cursor-pointer bg-white"
                          value={benefitFormIcon}
                          onChange={(e) => setBenefitFormIcon(e.target.value)}
                        >
                          <option value="UserCheck">User / Register (UserCheck)</option>
                          <option value="Award">Certification Badge (Award)</option>
                          <option value="Layers">Products Level (Layers)</option>
                          <option value="ShoppingBag">Cart shopping bag (ShoppingBag)</option>
                          <option value="Truck">Logistics Courier (Truck)</option>
                          <option value="DollarSign">Profits Ledger (DollarSign)</option>
                          <option value="HelpCircle">Informative Support (HelpCircle)</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          type="submit" 
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl uppercase text-[10px] cursor-pointer"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingBenefitId(null);
                            setBenefitFormTitle('');
                            setBenefitFormDesc('');
                            setBenefitFormIcon('UserCheck');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 text-[10px] rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-slate-50 border p-4 rounded-2xl text-slate-500 font-medium text-center text-xs leading-relaxed">
                      Select one of the 6 benefit blocks on the right grid to adjust titles or custom descriptions!
                    </div>
                  )}
                </div>

                {/* Benefits List cards */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-50 border p-4 rounded-2xl">
                    <h4 className="font-bold text-xs uppercase text-slate-800">Aesthetic Steps Pathway blocks</h4>
                    <p className="text-[10px] text-slate-400">These cards are displayed in the 6-grid core section</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resellerBenefits.map(benefit => (
                      <div 
                        key={benefit.id} 
                        className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between ${editingBenefitId === benefit.id ? 'border-pink-500 bg-pink-50/5 ring-1 ring-pink-500/30' : 'border-slate-200 hover:border-slate-350'}`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-pink-100 text-pink-700 text-[10px] font-black w-7 h-7 rounded-xl flex items-center justify-center">
                              {benefit.iconName === 'UserCheck' && <UserCheck className="w-3.5 h-3.5" />}
                              {benefit.iconName === 'Award' && <Award className="w-3.5 h-3.5" />}
                              {benefit.iconName === 'Layers' && <Layers className="w-3.5 h-3.5" />}
                              {benefit.iconName === 'ShoppingBag' && <ShoppingBag className="w-3.5 h-3.5" />}
                              {benefit.iconName === 'Truck' && <Truck className="w-3.5 h-3.5" />}
                              {benefit.iconName === 'DollarSign' && <DollarSign className="w-3.5 h-3.5" />}
                              {benefit.iconName === 'HelpCircle' && <HelpCircle className="w-3.5 h-3.5" />}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-xs leading-tight">{benefit.title}</h4>
                          </div>
                          <p className="text-slate-500 font-semibold text-[10px] leading-relaxed mt-1">{benefit.desc}</p>
                        </div>

                        <div className="mt-4 border-t pt-2.5 flex justify-end">
                          <button 
                            type="button"
                            onClick={() => initiateBenefitEdit(benefit)}
                            className="bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-indigo-600 border px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" /> Adjust Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 5: Referral Settings & Team Commissions */}
            {resellerSubTab === 'referrals' && (
              <div id="referrals-payout-setup" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="border-b pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase">Referral Commissions & Referral Program Controls</h3>
                    <p className="text-[10px] text-slate-400 font-bold">রিসেলারদের রেফারেল কমিশন সেট করুন এবং টিম আয়ের হিসেব দেখুন</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider border border-emerald-200/50">
                    Active System
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                  {/* Referral Rate config */}
                  <div className="bg-slate-50 border rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 font-extrabold">
                        ৳
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">Approval Referral Reward Amount</h4>
                        <p className="text-[9px] text-zinc-400">প্রতিটি রিজেক্ট না হওয়া, অ্যাপ্রুভড রিসেলারের জন্য রেফারার কত পাবে</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-sm">৳</span>
                        <input 
                          type="number" 
                          className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-12 py-3 text-sm font-black font-mono text-slate-800 focus:outline-none"
                          value={resellerReferralReward} 
                          onChange={(e) => setResellerReferralReward && setResellerReferralReward(Number(e.target.value))} 
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-black">BDT</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal">
                      When a new partner registers with a valid RES Code and the admin approves their application, this exact BDT amount is credited directly into the referrer's wallet.
                    </p>
                  </div>

                  {/* Highlights statistics card */}
                  <div className="bg-slate-50 border rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-3">Referrals Summary Indicator</h4>
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center bg-white border px-3 py-2 rounded-xl text-[11px]">
                          <span className="text-slate-500 font-medium">Referred Resellers Count:</span>
                          <span className="font-black font-mono text-slate-800">
                            {users.filter(u => u.referredBy).length} user(s)
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-white border px-3 py-2 rounded-xl text-[11px]">
                          <span className="text-slate-500 font-medium font-bold font-sans">Accumulated Referral Commissions Paid:</span>
                          <span className="font-black font-mono text-pink-650">
                            ৳{users.reduce((sum, u) => {
                              const refBonus = (u.activities || [])
                                .filter(act => act.type === 'profit' && act.desc.toLowerCase().includes('referral'))
                                .reduce((s, act) => s + act.amount, 0);
                              return sum + refBonus;
                            }, 0)} BDT
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed mt-4 font-sans">
                      Referral commissions are calculated on successful approved partner signups.
                    </p>
                  </div>
                </div>

                {/* Listing of users and their referred partners */}
                <div className="border rounded-2xl overflow-hidden text-xs">
                  <div className="bg-slate-50 border-b px-4 py-3">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Top Referral Team Builders</h4>
                  </div>
                  <div className="divide-y">
                    {users.filter(u => users.some(sub => sub.referredBy === u.idCode)).length === 0 ? (
                      <p className="text-slate-400 py-8 text-center font-semibold">No team builders/referrers logged yet.</p>
                    ) : (
                      users.filter(u => users.some(sub => sub.referredBy === u.idCode)).map(usr => {
                        const myTeam = users.filter(sub => sub.referredBy === usr.idCode);
                        const cumulativeEarning = (usr.activities || [])
                          .filter(act => act.type === 'profit' && act.desc.toLowerCase().includes('referral'))
                          .reduce((s, act) => s + act.amount, 0);

                        return (
                          <div key={usr.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-black">
                                {usr.name.substring(0, 1).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 text-sm block">{usr.name}</span>
                                <span className="text-[10px] text-slate-450 font-bold font-mono uppercase mt-0.5 block">{usr.idCode} • {usr.phone || 'No phone'}</span>
                              </div>
                            </div>
                            <div className="flex gap-4 items-center self-end sm:self-auto font-mono text-[11px]">
                              <span className="bg-slate-100 text-slate-705 font-bold text-slate-700 px-3 py-1 rounded-lg border">
                                Team: {myTeam.length} partner(s)
                              </span>
                              <span className="bg-pink-50 text-pink-705 font-black text-pink-700 px-3 py-1 rounded-lg border border-pink-100">
                                Earned: ৳{cumulativeEarning}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'advance_payment' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Bolt className="w-5 h-5 text-orange-500" /> Security Advance Payment Configuration
              </h2>
              <p className="text-xs text-slate-400">Manage global checkout requirements, billing calculation types (fixed amounts vs. Delivery charges), guidelines text, and active checkout channels.</p>
            </div>

            {/* General Policy Setting Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase">Global Advance Requirement Settings</h3>
                  <p className="text-[10px] text-slate-400">Configure how and when security margins trigger</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdvanceConfig({ ...advanceConfig, requireAdvance: !advanceConfig.requireAdvance })}
                  className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${advanceConfig.requireAdvance ? 'bg-orange-500 text-white shadow' : 'bg-slate-200 text-slate-500'}`}
                >
                  {advanceConfig.requireAdvance ? 'Active / Required' : 'Inactive / Disabled'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Mode Selector */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700">Advance Billing Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAdvanceConfig({ ...advanceConfig, amountType: 'fixed' })}
                      className={`py-3 rounded-2xl font-extrabold uppercase border text-center transition-all ${advanceConfig.amountType === 'fixed' ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-2xs' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                    >
                      Fixed Amount
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdvanceConfig({ ...advanceConfig, amountType: 'delivery' })}
                      className={`py-3 rounded-2xl font-extrabold uppercase border text-center transition-all ${advanceConfig.amountType === 'delivery' ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-2xs' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                    >
                      Match Delivery Charge
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {advanceConfig.amountType === 'fixed' 
                      ? "A constant uniform advance amount is enforced at the shopping bag checkout page for all transactions." 
                      : "Enforces the customer region's specific dynamic delivery charge (e.g. ৳60 or ৳150) as their mandatory security advance payment."}
                  </p>
                </div>

                {/* Amount field (Only active if 'fixed') */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-705">Base Fixed Advance Amount (৳)</label>
                  <input 
                    type="number"
                    disabled={advanceConfig.amountType !== 'fixed'}
                    className="form-input text-xs font-bold leading-relaxed disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="e.g. 100"
                    value={advanceConfig.fixedAmount}
                    onChange={(e) => setAdvanceConfig({ ...advanceConfig, fixedAmount: Math.max(0, parseInt(e.target.value) || 0) })}
                  />
                  <p className="text-[10px] text-slate-400">Specify fallback advance cost amount in Taka currency unit.</p>
                </div>

                {/* Instructions Text area */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-bold text-slate-700">User Instructions Notice (Bengali)</label>
                  <textarea
                    rows={2}
                    className="form-input text-xs leading-relaxed"
                    placeholder="e.g. কিছু পণ্য অর্ডারের জন্য অগ্রিম পেমেন্ট..."
                    value={advanceConfig.instructionText}
                    onChange={(e) => setAdvanceConfig({ ...advanceConfig, instructionText: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400">This banner instruction notice appears directly above client payment choice selectors.</p>
                </div>
              </div>
            </div>

            {/* Channels Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Block */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs h-fit">
                <div className="border-b pb-3 mb-4">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase">
                    {editingChanId ? 'Modify Payment Channel' : 'Create Payment Channel'}
                  </h3>
                  <p className="text-[10px] text-slate-400">Define account details for public customer contributions</p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!chanName.trim() || !chanNumber.trim()) {
                    showNotif("Please enter channel name and address/number.", "error");
                    return;
                  }
                  if (editingChanId) {
                    const uChannels = advanceConfig.channels.map(c => 
                      c.id === editingChanId ? { ...c, name: chanName, accountNumber: chanNumber, methodType: chanMethod, isActive: chanActive } : c
                    );
                    setAdvanceConfig({ ...advanceConfig, channels: uChannels });
                    showNotif("Updated channel successfully.", "success");
                    setEditingChanId(null);
                  } else {
                    const nChannel: PaymentChannel = {
                      id: 'ch_' + Date.now(),
                      name: chanName,
                      accountNumber: chanNumber,
                      methodType: chanMethod,
                      isActive: chanActive
                    };
                    setAdvanceConfig({ ...advanceConfig, channels: [...advanceConfig.channels, nChannel] });
                    showNotif("Added new channel successfully.", "success");
                  }
                  setChanName('');
                  setChanNumber('');
                  setChanMethod('Send Money');
                  setChanActive(true);
                }} className="space-y-4 text-xs">
                  
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Financial Brand Logo Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. bKash, Nagad, Rocket, DBBL"
                      className="form-input text-xs font-bold" 
                      value={chanName}
                      onChange={(e) => setChanName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Method Guide Tag</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Send Money, Personal, Bank Transfer"
                      className="form-input text-xs font-bold" 
                      value={chanMethod}
                      onChange={(e) => setChanMethod(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Phone Number / Account Address</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 017XXXXXXXX or DBBL (A/C: XXXX)"
                      className="form-input text-xs font-mono font-bold" 
                      value={chanNumber}
                      onChange={(e) => setChanNumber(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input 
                      type="checkbox" 
                      id="chanActiveChk"
                      className="rounded border-slate-300 text-pink-600 accent-pink-600 w-4 h-4 cursor-pointer"
                      checked={chanActive}
                      onChange={(e) => setChanActive(e.target.checked)}
                    />
                    <label htmlFor="chanActiveChk" className="font-bold text-slate-700 cursor-pointer select-none">Show on checkout payments list</label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-[10px] cursor-pointer"
                    >
                      {editingChanId ? 'Modify Channel' : 'Register Channel'}
                    </button>
                    {editingChanId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingChanId(null);
                          setChanName('');
                          setChanNumber('');
                          setChanMethod('Send Money');
                          setChanActive(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 text-[10px] rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List grid */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-50 border p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase text-slate-800">Listed Payment gateways</h4>
                    <p className="text-[10px] text-slate-400">Active gateways shown during shopper advance security step</p>
                  </div>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                    Total: {advanceConfig.channels.length}
                  </span>
                </div>

                {advanceConfig.channels.length === 0 ? (
                  <div className="bg-white p-12 text-center text-slate-400 font-bold border rounded-3xl">
                    No active channels defined yet. Configure your first gate in the left form!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advanceConfig.channels.map(chan => (
                      <div 
                        key={chan.id} 
                        className={`bg-white p-4 rounded-3xl border flex flex-col justify-between transition-all shadow-xs relative ${!chan.isActive ? 'opacity-65 border-slate-300' : 'border-orange-100 hover:border-orange-200'}`}
                      >
                        {!chan.isActive && (
                          <span className="absolute top-3.5 right-3.5 bg-slate-200 text-slate-600 font-black text-[8px] uppercase tracking-wide px-2 py-0.5 rounded">
                            Inactive / Draft
                          </span>
                        )}

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <span className="font-extrabold text-xs text-slate-900">{chan.name}</span>
                            <span className="bg-orange-55 bg-orange-50 text-orange-700 text-[8.5px] font-bold px-2 py-0.5 rounded capitalize">
                              {chan.methodType}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-mono font-black text-slate-800 select-all tracking-wide bg-slate-50 p-2 rounded-xl border border-dashed text-center">
                            {chan.accountNumber}
                          </p>
                        </div>

                        <div className="mt-4 border-t pt-2.5 flex items-center justify-between gap-2">
                          <button 
                            type="button"
                            onClick={() => {
                              const updated = advanceConfig.channels.map(c => 
                                c.id === chan.id ? { ...c, isActive: !c.isActive } : c
                              );
                              setAdvanceConfig({ ...advanceConfig, channels: updated });
                            }}
                            className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-lg uppercase cursor-pointer ${chan.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {chan.isActive ? 'Online' : 'Offline'}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button 
                              type="button"
                              onClick={() => {
                                setEditingChanId(chan.id);
                                setChanName(chan.name);
                                setChanNumber(chan.accountNumber);
                                setChanMethod(chan.methodType);
                                setChanActive(chan.isActive);
                              }}
                              className="text-slate-500 hover:text-orange-600 p-1.5 bg-slate-50 hover:bg-slate-100 border rounded-lg cursor-pointer transition-colors"
                              title="Edit coordinates"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${chan.name}?`)) {
                                  const filtered = advanceConfig.channels.filter(c => c.id !== chan.id);
                                  setAdvanceConfig({ ...advanceConfig, channels: filtered });
                                  showNotif(`Removed ${chan.name} gateway.`, "success");
                                }
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 bg-slate-50 hover:bg-slate-100 border rounded-lg cursor-pointer transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'promo_codes' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Tag className="w-5 h-5 text-pink-500" /> Promo Codes Configuration Panel
              </h2>
              <p className="text-xs text-slate-400">Add, alter, delete, and configure promotional codes that customers can apply on checkout to receive discounts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Form panel card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                    {editingPromoId ? 'Modify Selected Promo' : 'Generate New Promo'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Configure code text and discount limits.</p>
                </div>

                <form onSubmit={savePromoCode} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="text-[10px] font-black text-slate-450 uppercase block mb-1">Promo Code Text</label>
                    <input 
                      type="text"
                      className="w-full font-bold border border-slate-250 bg-white rounded-lg p-2.5 text-xs text-slate-800 uppercase placeholder-slate-350 focus:border-pink-400 focus:outline-none"
                      placeholder="e.g. FLASH100"
                      required
                      value={promoFormCode}
                      onChange={(e) => setPromoFormCode(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-slate-450 uppercase block mb-1">Discount Type</label>
                      <select
                        className="w-full bg-white border border-slate-250 rounded-lg p-2.5 font-bold text-xs text-slate-800 outline-none focus:border-pink-400"
                        value={promoFormDiscountType}
                        onChange={(e) => setPromoFormDiscountType(e.target.value as 'fixed' | 'percent')}
                      >
                        <option value="fixed">Fixed Taka (৳)</option>
                        <option value="percent">Percentage (%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-450 uppercase block mb-1">
                        {promoFormDiscountType === 'fixed' ? 'Discount (৳)' : 'Discount (%)'}
                      </label>
                      <input 
                        type="number"
                        className="w-full font-bold border border-slate-250 bg-white rounded-lg p-2.5 text-xs text-slate-800 focus:border-pink-400 focus:outline-none"
                        placeholder="0"
                        min="1"
                        required
                        value={promoFormDiscountValue || ''}
                        onChange={(e) => setPromoFormDiscountValue(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-450 uppercase block mb-1">Usage Limit (Koyjon use korte parbe)</label>
                    <input 
                      type="number"
                      className="w-full font-bold border border-slate-250 bg-white rounded-lg p-2.5 text-xs text-slate-800 focus:border-pink-400 focus:outline-none"
                      placeholder="e.g. 50"
                      min="1"
                      required
                      value={promoFormMaxUses || ''}
                      onChange={(e) => setPromoFormMaxUses(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox"
                      id="promoActiveChk"
                      className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500 cursor-pointer"
                      checked={promoFormIsActive}
                      onChange={(e) => setPromoFormIsActive(e.target.checked)}
                    />
                    <label htmlFor="promoActiveChk" className="font-bold text-slate-700 cursor-pointer select-none">Set is active (enabled for checkouts)</label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-extrabold py-2.5 rounded-xl uppercase tracking-wider text-[10px] cursor-pointer shadow-md shadow-pink-600/10 leading-none"
                    >
                      {editingPromoId ? 'Apply Modifications' : 'Create Promo Code'}
                    </button>
                    {editingPromoId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingPromoId(null);
                          setPromoFormCode('');
                          setPromoFormDiscountType('fixed');
                          setPromoFormDiscountValue(0);
                          setPromoFormMaxUses(100);
                          setPromoFormIsActive(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 text-[10px] rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List panel grid */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-50 border p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase text-slate-800">Available Promo Codes</h4>
                    <p className="text-[10px] text-slate-400">Manage rules, active limits, and deletion vectors.</p>
                  </div>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                    Total: {promoCodes.length}
                  </span>
                </div>

                {promoCodes.length === 0 ? (
                  <div className="bg-white p-12 text-center text-slate-450 font-bold border rounded-3xl">
                    No promo codes registered yet. Configure your first one on the left!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promoCodes.map(promo => {
                      const isExpired = promo.usedCount >= promo.maxUses;
                      return (
                        <div 
                          key={promo.id} 
                          className={`bg-white p-5 rounded-3xl border flex flex-col justify-between transition-all shadow-xs relative ${!promo.isActive ? 'opacity-65 border-slate-300' : isExpired ? 'border-amber-100 bg-amber-50/20' : 'border-indigo-100 hover:border-indigo-200'}`}
                        >
                          <div className="absolute top-4 right-4 flex items-center gap-1.5 font-sans">
                            {!promo.isActive && (
                              <span className="bg-slate-200 text-slate-600 font-black text-[8px] uppercase tracking-wide px-2 py-0.5 rounded">
                                Draft
                              </span>
                            )}
                            {isExpired && (
                              <span className="bg-amber-100 text-amber-700 font-black text-[8px] uppercase tracking-wide px-2 py-0.5 rounded">
                                Fully Used
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                              <span className="font-black text-sm text-slate-900 font-mono tracking-wider select-all">{promo.code}</span>
                              <span className="bg-pink-50 text-pink-700 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase font-sans">
                                {promo.discountType === 'percent' ? `${promo.discountValue}% OFF` : `৳${promo.discountValue} OFF`}
                              </span>
                            </div>

                            {/* Usage Progress details */}
                            <div className="mt-4 space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                <span>Uses Progress:</span>
                                <span className={isExpired ? 'text-amber-700' : 'text-slate-800'}>
                                  {promo.usedCount} / {promo.maxUses} uses
                                </span>
                              </div>
                              {/* progress bar */}
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${isExpired ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                                  style={{ width: `${Math.min(100, (promo.usedCount / promo.maxUses) * 105)}%` }}
                                ></div>
                              </div>
                              <p className="text-[9px] text-slate-400 font-semibold italic">
                                * Available for {promo.maxUses - promo.usedCount} more customers.
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 border-t pt-2.5 flex items-center justify-between gap-2">
                            <button 
                              type="button"
                              onClick={() => togglePromoCodeActive(promo.id)}
                              className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-lg uppercase cursor-pointer ${promo.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600'}`}
                            >
                              {promo.isActive ? 'Active' : 'Paused'}
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button 
                                type="button"
                                onClick={() => editPromoCodeInitiate(promo)}
                                className="text-slate-500 hover:text-pink-600 p-1.5 bg-slate-50 hover:bg-slate-100 border rounded-lg cursor-pointer transition-colors"
                                title="Edit details"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => deletePromoCode(promo.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 bg-slate-50 hover:bg-slate-100 border rounded-lg cursor-pointer transition-colors"
                                title="Delete promo code"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'flash_offers_settings' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800 animate-fade-in"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Bolt className="w-5 h-5 text-indigo-500" /> Flash Offer Global Settings (ফ্ল্যাশ অফার সেটিংস)
              </h2>
              <p className="text-xs text-slate-400 mt-1">Configure global product tag settings, and promotional parameters displayed instantly under shop interfaces.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-6">
              <div className="border-b pb-4">
                <span className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Global Rules Configuration
                </span>
                <p className="text-xs text-slate-450 mt-2">Activate/Deactivate, configure values and badges like Free Delivery, BOGO, or special discount percentages shown over product grids.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {flashOfferSettings.map((item, index) => (
                  <div key={item.id} className="border border-slate-200/80 rounded-2.5xl p-5 bg-slate-50/50 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.name}</span>
                        <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {/* Visual preview pill */}
                      <div className="pt-2">
                        <div className="text-[10px] uppercase font-black tracking-wide text-slate-400 mb-1.5">Live Badge preview:</div>
                        <span 
                          className="inline-block px-3 py-1 text-[11px] font-black tracking-wide rounded-md uppercase shadow-4xs"
                          style={{ backgroundColor: item.bgColor || '#e2e8f0', color: item.textColor || '#1e293b' }}
                        >
                          {item.value}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-200/50 text-xs text-slate-800">
                      {/* Inputs */}
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Badge offer text</label>
                        <input 
                          type="text" 
                          value={item.value}
                          onChange={(e) => {
                            const updated = [...flashOfferSettings];
                            updated[index] = { ...updated[index], value: e.target.value };
                            if (setFlashOfferSettings) setFlashOfferSettings(updated);
                          }}
                          className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-bold text-slate-800 focus:border-indigo-400 focus:outline-none"
                        />
                      </div>

                      {/* Color selections */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9.5px] font-bold text-slate-400 block mb-1">BG HEX Color</label>
                          <input 
                            type="color" 
                            value={item.bgColor || '#000000'}
                            onChange={(e) => {
                              const updated = [...flashOfferSettings];
                              updated[index] = { ...updated[index], bgColor: e.target.value };
                              if (setFlashOfferSettings) setFlashOfferSettings(updated);
                            }}
                            className="w-full bg-white border rounded cursor-pointer h-7"
                          />
                        </div>
                        <div>
                          <label className="text-[9.5px] font-bold text-slate-400 block mb-1">Text HEX</label>
                          <input 
                            type="color" 
                            value={item.textColor || '#ffffff'}
                            onChange={(e) => {
                              const updated = [...flashOfferSettings];
                              updated[index] = { ...updated[index], textColor: e.target.value };
                              if (setFlashOfferSettings) setFlashOfferSettings(updated);
                            }}
                            className="w-full bg-white border rounded cursor-pointer h-7"
                          />
                        </div>
                      </div>

                      {/* Toggle Active status */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...flashOfferSettings];
                            updated[index] = { ...updated[index], isActive: !updated[index].isActive };
                            if (setFlashOfferSettings) setFlashOfferSettings(updated);
                          }}
                          className={`w-full py-2 px-3 rounded-xl transition-all cursor-pointer font-extrabold text-[11px] uppercase text-center border ${item.isActive ? 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700 shadow-sm font-bold' : 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-255 font-bold'}`}
                        >
                          {item.isActive ? 'Turn Off (Deactivate)' : 'Turn On (Activate)'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'affiliate' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6 text-slate-800 animate-fade-in"
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-600" /> Affiliate Program Dashboard & Settings (অ্যাফিলিয়েট প্রোগ্রাম সেটিংস)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize referral commission rates, manage affiliate tasks, approve user earnings proof, and supervise payouts.
              </p>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="admin_aff_stats">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs" id="admin_stat_click_rate">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Per Click Reward Rate</p>
                <h3 className="text-2xl font-black text-pink-650 mt-1">৳ {affiliateRatePerClick}</h3>
                <p className="text-[10px] text-slate-450 mt-1">Current dynamic rate per unique click</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs" id="admin_stat_total_accounts">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Affiliate Accounts</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{affiliateAccounts.length}</h3>
                <p className="text-[10px] text-slate-450 mt-1">Users/customers registered in system</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs" id="admin_stat_pending_tasks">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Pending Task Proofs</p>
                <h3 className="text-2xl font-black text-amber-600 mt-1">
                  {affiliateSubmissions.filter(s => s.status === 'pending').length}
                </h3>
                <p className="text-[10px] text-slate-450 mt-1">Requires supervisor manual review</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs" id="admin_stat_total_clicks">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Referral Clicks Captured</p>
                <h3 className="text-2xl font-black text-indigo-650 mt-1">
                  {affiliateAccounts.reduce((sum, current) => sum + current.clicksCount, 0)}
                </h3>
                <p className="text-[10px] text-slate-450 mt-1">Simulated or real distinct click events</p>
              </div>
            </div>

            {/* Quick Configurations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs" id="admin_aff_global_rules">
              <h3 className="text-sm font-extrabold text-slate-900 border-b pb-3 flex items-center gap-1.5 mb-5">
                <Bolt className="w-4 h-4 text-pink-500" /> Global Rules & Payout Constraints (নিয়ম ও উইথড্র সেটিংস)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    Commission Rate per Valid Click (৳ - Taka)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      min="0.1" 
                      step="0.1"
                      value={affiliateRatePerClick}
                      onChange={(e) => setAffiliateRatePerClick(Number(e.target.value))}
                      className="max-w-[200px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-extrabold focus:ring-2 focus:ring-pink-500/10 focus:outline-none"
                    />
                    <span className="flex items-center text-xs font-bold text-slate-400">BDT Taka</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Amount directly credited as earnings when a referred client clicks any tracking link from a unique IP address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    Minimum Allowed Earnings to Request Withdrawal (৳)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      min="10" 
                      step="10"
                      value={affiliateMinWithdrawal}
                      onChange={(e) => setAffiliateMinWithdrawal(Number(e.target.value))}
                      className="max-w-[200px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-extrabold focus:ring-2 focus:ring-pink-500/10 focus:outline-none"
                    />
                    <span className="flex items-center text-xs font-bold text-slate-400">BDT Taka</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Affiliates cannot submit secure cash-out withdrawal applications until their wallet meets this threshold.
                  </p>
                </div>
              </div>
            </div>

            {/* Task list and creator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="admin_tasks_grid">
              {/* Form to create/edit Task */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 border-b pb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-pink-500" />
                  {editingAffTaskId ? 'Edit Affiliate Task (টাস্ক এডিট করুন)' : 'Create New Affiliate Task (টাস্ক যোগ করুন)'}
                </h3>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Target Platform</label>
                    <select 
                      value={affTaskPlatform}
                      onChange={(e: any) => setAffTaskPlatform(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Telegram">Telegram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Google">Google Maps/Review</option>
                      <option value="Custom">Custom Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Required Proof Type (প্রুফের মাধ্যম)</label>
                    <select 
                      value={affTaskProofType}
                      onChange={(e: any) => setAffTaskProofType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                      <option value="link">Link Only (শুধু লিংক)</option>
                      <option value="screenshot">Screenshot Only (শুধু স্ক্রিনশট)</option>
                      <option value="both">Both Link & Screenshot (লিংক ও স্ক্রিনশট উভয়ই)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Task Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. Subscribe to our YouTube channel"
                      value={affTaskTitle}
                      onChange={(e) => setAffTaskTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Task Description / Instructions</label>
                    <textarea 
                      placeholder="e.g. Go to URL, subscribe & snapshot. Verify with channel name."
                      value={affTaskDesc}
                      onChange={(e) => setAffTaskDesc(e.target.value)}
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Reward Prize (৳ - BDT)</label>
                    <input 
                      type="number"
                      value={affTaskReward}
                      onChange={(e) => setAffTaskReward(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (!affTaskTitle.trim() || !affTaskDesc.trim() || affTaskReward <= 0) {
                          showNotif('Please fill in task title, description and positive prize amount', 'error');
                          return;
                        }

                        if (editingAffTaskId) {
                          setAffiliateTasks(prev => prev.map(t => t.id === editingAffTaskId ? {
                            ...t,
                            title: affTaskTitle,
                            desc: affTaskDesc,
                            reward: affTaskReward,
                            platform: affTaskPlatform,
                            requiredProofType: affTaskProofType
                          } : t));
                          showNotif('Affiliate task modified successfully!', 'success');
                          setEditingAffTaskId(null);
                        } else {
                          const nextTask: AffiliateTask = {
                            id: 'at_' + Date.now(),
                            title: affTaskTitle,
                            desc: affTaskDesc,
                            reward: affTaskReward,
                            status: 'active',
                            platform: affTaskPlatform,
                            requiredProofType: affTaskProofType
                          };
                          setAffiliateTasks(prev => [...prev, nextTask]);
                          showNotif('New affiliate task created successfully!', 'success');
                        }

                        // Clear inputs
                        setAffTaskTitle('');
                        setAffTaskDesc('');
                        setAffTaskReward(10);
                        setAffTaskPlatform('Facebook');
                        setAffTaskProofType('both');
                      }}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-black text-xs p-3 rounded-xl transition-all shadow-sm cursor-pointer select-none"
                      id="save_aff_task_btn"
                    >
                      {editingAffTaskId ? 'Update Task' : 'Save Task'}
                    </button>
                    {editingAffTaskId && (
                      <button
                        onClick={() => {
                          setEditingAffTaskId(null);
                          setAffTaskTitle('');
                          setAffTaskDesc('');
                          setAffTaskReward(10);
                          setAffTaskPlatform('Facebook');
                          setAffTaskProofType('both');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-4 lg:col-span-2">
                <h3 className="text-sm font-extrabold text-slate-900 border-b pb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-500" /> Manage Affiliate Micro Tasks (টাস্ক লিস্ট)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Count: {affiliateTasks.length}</span>
                </h3>

                {affiliateTasks.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-10">No affiliate tasks defined. Create one to allow users to earn.</p>
                ) : (
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {affiliateTasks.map(task => (
                      <div key={task.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1 select-none">
                          <div className="flex items-center gap-2">
                            <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 tracking-wider">
                              {task.platform}
                            </span>
                            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${task.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                              {task.status === 'active' ? 'Active' : 'Paused'}
                            </span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900">{task.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-normal">{task.desc}</p>
                          <div className="flex flex-wrap gap-2 items-center mt-1">
                            <span className="text-[11px] font-bold text-pink-600">Earning prize: ৳ {task.reward}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                              Proof: {task.requiredProofType === 'link' ? 'Link Only' : task.requiredProofType === 'screenshot' ? 'Screenshot Only' : 'Both (Link & Screenshot)'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 border-l pl-3 py-1">
                          <button
                            onClick={() => {
                              setEditingAffTaskId(task.id);
                              setAffTaskTitle(task.title);
                              setAffTaskDesc(task.desc);
                              setAffTaskReward(task.reward);
                              setAffTaskPlatform(task.platform);
                              setAffTaskProofType(task.requiredProofType || 'both');
                            }}
                            className="p-1.5 text-slate-500 hover:text-indigo-650 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit task parameters"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Toggle status
                              setAffiliateTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t));
                              showNotif(`Task status updated!`, 'success');
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Toggle active status"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this affiliate task?')) {
                                setAffiliateTasks(prev => prev.filter(t => t.id !== task.id));
                                showNotif('Affiliate task deleted from catalog.', 'success');
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Delete task option"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Proof Submissions Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-4" id="admin_proof_reviews">
              <h3 className="text-sm font-extrabold text-slate-900 border-b pb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Pending Task Submissions Review (টাস্ক প্রুফ যাচাইকরণ)
                </span>
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-slate-550">
                  Pending: {affiliateSubmissions.filter(s => s.status === 'pending').length}
                </span>
              </h3>

              {affiliateSubmissions.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10" id="no_subs_msg">No users have submitted task proofs yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b">
                        <th className="p-3">User Partner Info</th>
                        <th className="p-3">E-commerce Task Details</th>
                        <th className="p-3">Reward</th>
                        <th className="p-3">Submitted Proof Details</th>
                        <th className="p-3">Requested Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {affiliateSubmissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <div className="font-extrabold text-slate-900">{sub.userName}</div>
                            <div className="text-[10px] font-mono text-slate-450">{sub.userPhone}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-[10.5px] font-extrabold text-slate-800">{sub.taskTitle}</span>
                          </td>
                          <td className="p-3 font-extrabold text-pink-600">৳{sub.reward}</td>
                          <td className="p-3 max-w-[280px]">
                            {sub.submissionLink || sub.submissionScreenshot ? (
                              <div className="space-y-1 text-[11px]">
                                {sub.submissionLink && (
                                  <div>
                                    <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-pink-50 text-pink-650 mr-1.5">Link:</span>
                                    <a 
                                      href={sub.submissionLink.startsWith('http') ? sub.submissionLink : `https://${sub.submissionLink}`} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-pink-600 font-bold hover:underline select-text break-all"
                                    >
                                      {sub.submissionLink}
                                    </a>
                                  </div>
                                )}
                                {sub.submissionScreenshot && (
                                  <div className="pt-1">
                                    <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-650 mr-1.5">Screenshot:</span>
                                    {sub.submissionScreenshot.startsWith('data:image/') ? (
                                      <div className="mt-1.5">
                                        <div 
                                          className="relative group inline-block w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 cursor-zoom-in shadow-2xs" 
                                          onClick={() => {
                                            const w = window.open('about:blank');
                                            setTimeout(() => {
                                              if (w) {
                                                w.document.body.innerHTML = `<body style="margin:0; background:#0f172a; display:flex; justify-content:center; align-items:center; min-height:100vh;"><img src="${sub.submissionScreenshot}" style="max-width:100%; max-height:100%; object-fit:contain; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);" /></body>`;
                                              }
                                            }, 50);
                                          }}
                                        >
                                          <img src={sub.submissionScreenshot} className="w-full h-full object-cover" alt="Proof" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-[9px] font-bold">
                                            🔍 CLICK TO VIEW
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <a 
                                        href={sub.submissionScreenshot.startsWith('http') ? sub.submissionScreenshot : `https://${sub.submissionScreenshot}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-indigo-600 font-bold hover:underline select-text break-all"
                                      >
                                        {sub.submissionScreenshot}
                                      </a>
                                    )}
                                  </div>
                                )}
                                {sub.proof && (
                                  <p className="text-[10px] text-slate-400 mt-1 italic select-text">Note: {sub.proof}</p>
                                )}
                              </div>
                            ) : (
                              <b className="text-[10.5px] text-slate-600 tracking-wide font-medium select-text">{sub.proof}</b>
                            )}
                          </td>
                          <td className="p-3 font-mono text-[10.5px] text-slate-500">{sub.date}</td>
                          <td className="p-3">
                            <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                              sub.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                              sub.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {sub.status === 'pending' ? (
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => {
                                    setAffiliateSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'approved' } : s));
                                    setAffiliateAccounts(prevAccs => {
                                      const existing = prevAccs.find(a => a.phone === sub.userPhone);
                                      if (existing) {
                                        return prevAccs.map(acc => {
                                          if (acc.phone === sub.userPhone) {
                                            return { ...acc, balance: acc.balance + sub.reward };
                                          }
                                          return acc;
                                        });
                                      } else {
                                        return [
                                          ...prevAccs,
                                          {
                                            phone: sub.userPhone,
                                            name: sub.userName || 'Affiliate Partner',
                                            balance: sub.reward,
                                            clicksCount: 0,
                                            clicksList: [],
                                            withdrawals: []
                                          }
                                        ];
                                      }
                                    });
                                    showNotif(`Task approved! ৳${sub.reward} BDT directly credited to user: ${sub.userPhone}`, 'success');
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-extrabold text-[10px] uppercase transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                                <button 
                                  onClick={() => {
                                    setAffiliateSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'rejected' } : s));
                                    showNotif(`Task submission declined for user: ${sub.userPhone}.`, 'error');
                                  }}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-lg font-extrabold text-[10px] uppercase transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3 h-3" /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No Action Needed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Affiliate Payouts Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-4" id="admin_aff_cashouts">
              <h3 className="text-sm font-extrabold text-slate-900 border-b pb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-pink-500" /> Affiliate Cash-Out Requests (অ্যাফিলিয়েট উইথড্র রিকোয়েস্ট)
                </span>
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-slate-550">
                  Requests count: {affiliateAccounts.reduce((sum, current) => sum + (current.withdrawals?.length || 0), 0)}
                </span>
              </h3>

              {affiliateAccounts.every(acc => !acc.withdrawals || acc.withdrawals.length === 0) ? (
                <p className="text-center text-xs text-slate-400 py-10">No withdrawal requests submitted recently.</p>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                        <th className="p-3">User Mobile</th>
                        <th className="p-3">Withdrawal Amount</th>
                        <th className="p-3">Payment Provider</th>
                        <th className="p-3">Receiver Account Number</th>
                        <th className="p-3">Submission Time</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {affiliateAccounts.flatMap(acc => 
                        (acc.withdrawals || []).map(wd => (
                          <tr key={wd.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-extrabold text-slate-900 flex flex-col">
                              <span>{acc.name}</span>
                              <span className="text-[10px] text-slate-450 font-mono italic">{acc.phone}</span>
                            </td>
                            <td className="p-3 font-extrabold text-indigo-700">৳ {wd.amount}</td>
                            <td className="p-3 font-black text-rose-500 uppercase">{wd.method}</td>
                            <td className="p-3 font-mono font-bold text-slate-800">{wd.accountNo}</td>
                            <td className="p-3 font-mono text-[10px] text-slate-400">{wd.date}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                                wd.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                wd.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {wd.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {wd.status === 'pending' ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setAffiliateAccounts(prev => prev.map(a => {
                                        if (a.phone === acc.phone) {
                                          return {
                                            ...a,
                                            withdrawals: a.withdrawals.map(w => w.id === wd.id ? { ...w, status: 'approved' } : w)
                                          };
                                        }
                                        return a;
                                      }));
                                      showNotif(`Affiliate withdrawal approved. Pay to ${wd.method}: ${wd.accountNo} amount ৳${wd.amount}`, 'success');
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9.5px] uppercase tracking-wide px-2 py-1 rounded-md cursor-pointer"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => {
                                      setAffiliateAccounts(prev => prev.map(a => {
                                        if (a.phone === acc.phone) {
                                          return {
                                            ...a,
                                            balance: a.balance + wd.amount,
                                            withdrawals: a.withdrawals.map(w => w.id === wd.id ? { ...w, status: 'rejected' } : w)
                                          };
                                        }
                                        return a;
                                      }));
                                      showNotif(`Declined. Returned BDT ৳${wd.amount} back to ${acc.phone}'s balance.`, 'error');
                                    }}
                                    className="bg-red-100 text-red-650 hover:bg-red-200 font-extrabold text-[9.5px] px-2 py-1 rounded-md cursor-pointer"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Settled</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Registered affiliate partners listing */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-4" id="admin_partners_logs">
              <h3 className="text-sm font-extrabold text-slate-900 border-b pb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-pink-500 font-bold" /> Affiliate Partners Directory Logs (রেজিস্টার্ড অংশীদারদের তালিকা)
              </h3>
              
              {affiliateAccounts.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10">No affiliate accounts registered or auto-created yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {affiliateAccounts.map(acc => (
                    <div key={acc.phone} className="p-4 border border-slate-200 rounded-2.5xl bg-slate-50/50 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-slate-900">{acc.name}</h4>
                          <span className="font-mono text-xs font-black text-indigo-750">৳ {acc.balance.toFixed(2)}</span>
                        </div>
                        <p className="text-[9.5px] font-mono text-slate-400 mt-0.5">Phone ID: {acc.phone}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t pt-2.5 text-[10px] text-slate-500 font-medium">
                        <div>Clicks: <b className="text-slate-850 font-black">{acc.clicksCount}</b></div>
                        <div>Withdrawals: <b className="text-slate-850 font-black">{acc.withdrawals?.filter(w => w.status==='approved').length || 0} approved</b></div>
                      </div>

                      {acc.clicksList?.length > 0 && (
                        <div className="text-[9px] text-slate-400 bg-slate-100 p-2 rounded-xl mt-1 space-y-1">
                          <div className="font-extrabold text-[8.5px] uppercase text-slate-500 tracking-wider">Latest tracked clicks:</div>
                          {acc.clicksList.slice(0, 2).map((clk, cIdx) => (
                            <div key={cIdx} className="flex justify-between">
                              <span className="font-mono">{clk.ip}</span>
                              <span className="truncate">{clk.date.split(',')[1] || clk.date}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

      </main>

      {/* === MODALS OVERLAY DECK === */}

      {/* 1. Track stage status timeline visual manager */}
      <AnimatePresence>
        {selectedOrderForTracking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForTracking(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full max-w-md p-6 z-10 text-slate-800"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" /> Dispatch Timeline phase
                </h3>
                <button onClick={() => setSelectedOrderForTracking(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs">
                <p className="font-bold text-slate-700">Active Order: {selectedOrderForTracking.trackingId}</p>
                <p className="text-slate-500 font-medium mt-1 truncate">Product: {selectedOrderForTracking.productName}</p>
              </div>

              <form onSubmit={commitTrackingChange} className="space-y-4 text-xs">
                
                <div className="form-group">
                  <label className="form-label">Milestone shipping phase</label>
                  <select 
                    className="form-input text-xs py-2.5 font-bold text-indigo-700"
                    value={trackingStage}
                    onChange={(e) => setTrackingStage(e.target.value as OrderStatus)}
                  >
                    <option value="Pending">1. Pending Review</option>
                    <option value="Approved">2. Approved & Confirmed</option>
                    <option value="Processing">3. Warehouse Packaging Completed</option>
                    <option value="Shipped">4. Shipped / Dispatch In Transit</option>
                    <option value="Delivered">5. Delivered Successfully</option>
                    <option value="Cancelled">6. Cancelled</option>
                    <option value="Returned">7. Returned</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Realtime status logs details <span className="text-rose-500">*</span></label>
                  <textarea 
                    rows={3} 
                    className="form-input text-xs py-2" 
                    placeholder="Enter dispatch Courier Details ID codes e.g. Pack handed to Pathao, ID code: PTH-912..."
                    required
                    value={trackingNote}
                    onChange={(e) => setTrackingNote(e.target.value)}
                  />
                </div>

                {trackingStage === 'Delivered' && (
                  <div className="bg-emerald-55 border bg-emerald-50 border-emerald-100 rounded-xl p-3 text-[10px] text-emerald-800 leading-normal flex gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Deliver transition automatically clears escrow profit margins directly to Reseller's cash Ledger balance.</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-3 rounded-xl uppercase text-xs tracking-wider transition-colors shadow"
                >
                  Conclude milestone update
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. KYC review document sheet */}
      <AnimatePresence>
        {viewingUserKyc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setViewingUserKyc(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-850 max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-extrabold text-base flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Review Submitted KYC Information
                </h3>
                <button onClick={() => setViewingUserKyc(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 border rounded-2xl p-4 text-xs font-bold text-slate-700">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Reseller Name</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{viewingUserKyc.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Affiliate Code</p>
                  <p className="text-sm font-mono text-indigo-600 mt-0.5">{viewingUserKyc.idCode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">NID Holder name match</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{viewingUserKyc.kyc.nidName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">NID Identity Registry ID</p>
                  <p className="text-sm font-mono text-slate-800 mt-0.5">{viewingUserKyc.kyc.nidNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Date of Birth</p>
                  <p className="text-sm text-slate-800 mt-0.5">{viewingUserKyc.kyc.dob}</p>
                </div>
              </div>

              {/* Photos row */}
              <div className="grid grid-cols-2 gap-4 my-5">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase text-center">NID DOCUMENT CARD FRONT</p>
                  <img src={viewingUserKyc.kyc.frontImage} className="w-full aspect-video object-cover rounded-xl border" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase text-center">NID DOCUMENT CARD BACK</p>
                  <img src={viewingUserKyc.kyc.backImage} className="w-full aspect-video object-cover rounded-xl border" />
                </div>
              </div>

              {/* Decisions flow */}
              {!showKycRejectInput ? (
                <div className="flex gap-3 text-xs font-bold pt-3 border-t">
                  <button 
                    onClick={() => approveKyc(viewingUserKyc.id)}
                    className="flex-1 bg-emerald-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-emerald-700 transition"
                  >
                    Approve KYC Legitimacy
                  </button>
                  <button 
                    onClick={() => setShowKycRejectInput(true)}
                    className="flex-1 bg-red-500 text-white font-extrabold py-3.5 rounded-xl hover:bg-red-650 transition"
                  >
                    Mark deficient Deficiency
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4.5 space-y-3.5 text-xs">
                  <label className="block font-bold text-red-800">Specify reason for deficiency rejection</label>
                  <textarea 
                    rows={2} 
                    className="form-input text-xs" 
                    placeholder="e.g. Blurred text front photo, or NID holder name mismatch..." 
                    required 
                    value={kycRejectNote}
                    onChange={(e) => setKycRejectNote(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowKycRejectInput(false)} className="flex-1 bg-white border font-bold rounded-lg text-[11px] py-2">
                      Cancel
                    </button>
                    <button type="button" onClick={() => rejectKyc(viewingUserKyc.id)} className="flex-1 bg-red-600 text-white font-bold rounded-lg text-[11px] py-2 hover:bg-red-700">
                      Enforce Reject
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CRUD dialog updates for Products models */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 className="font-extrabold text-base flex items-center gap-1.5 text-slate-900">
                  <Edit className="w-5 h-5 text-indigo-500" /> Edit Product Details
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={updateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-700">
                <div className="form-group">
                  <label className="form-label">Product Name / Title</label>
                  <input 
                    type="text" 
                    className="form-input text-xs py-2.5" 
                    required 
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Category</label>
                  <select 
                    className="form-input text-xs py-2.5"
                    required
                    value={editingProduct.catId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, catId: e.target.value })}
                  >
                    {categories.map(c => {
                      const offer = specialOffers.find(so => so.catId === c.id);
                      const displayName = offer 
                        ? `🎁 [CAMPAIGN: ${offer.title}] - ${c.name}` 
                        : c.name;
                      return <option key={c.id} value={c.id}>{displayName}</option>;
                    })}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 form-group">
                  <label className="form-label">Product Description & Features</label>
                  <textarea 
                    rows={2} 
                    className="form-input text-xs" 
                    required 
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image File</label>
                  <input type="file" accept="image/*" className="form-input text-xs py-1.5" onChange={(e) => handleProductImgUpload(e, true)} />
                  {editingProduct.img && (
                    <img src={editingProduct.img} className="h-14 mt-2 rounded border p-1 object-contain bg-slate-50" />
                  )}
                </div>

                <div className="form-group pb-1">
                  <label className="form-label text-indigo-700 font-bold">Extra Product Images (Optional, 5-6+ images)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="form-input text-xs py-1.5 border-dashed border-indigo-300 bg-indigo-50/10 focus:bg-white" 
                    onChange={(e) => handleProductExtraImgsUpload(e, true)} 
                  />
                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 border rounded-xl max-h-24 overflow-y-auto">
                      {editingProduct.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group w-11 h-11 border rounded bg-white flex items-center justify-center p-0.5">
                          <img src={imgUrl} className="max-w-full max-h-full object-contain" />
                          <button 
                            type="button" 
                            onClick={() => removeProductExtraImg(idx, true)}
                            className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-0 flex items-center justify-center font-bold"
                            style={{ width: '15px', height: '15px', fontSize: '9px', lineHeight: '1' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-indigo-500 font-medium mt-1">Hold Shift/Ctrl to select 5-6 or more images together.</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Color Variants (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Matte Silver" 
                      className="form-input text-xs py-2 flex-1"
                      value={colorTag}
                      onChange={(e) => setColorTag(e.target.value)}
                    />
                    <button type="button" onClick={() => addColorVariant(true)} className="bg-slate-200 hover:bg-slate-300 font-bold px-3 rounded-xl">
                      Add
                    </button>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {(editingProduct.colors || []).map(val => (
                      <span key={val} className="text-[10px] bg-slate-100 hover:bg-red-50 text-slate-700 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        {val}
                        <X className="w-3 h-3 text-slate-400 hover:text-red-500 cursor-pointer" onClick={() => removeColorVariant(val, true)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Edit pricing */}
                <div className="col-span-1 md:col-span-2 bg-indigo-50/50 rounded-2xl border border-indigo-100/80 p-5 grid grid-cols-2 md:grid-cols-5 gap-3.5">
                  <div className="col-span-2 md:col-span-5 pb-2 border-b border-indigo-100/60 flex justify-between items-center">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-indigo-900">Wholesale & Market Pricing (৳)</span>
                  </div>
                  <div>
                    <label className="form-label">Market Regular Price</label>
                    <input type="number" className="form-input text-xs" value={editingProduct.originalPrice} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Our Selling Price</label>
                    <input type="number" className="form-input text-xs" value={editingProduct.discountPrice} onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Partner Buying Rate</label>
                    <input type="number" className="form-input text-xs font-bold text-indigo-700" value={editingProduct.buyRate} onChange={(e) => setEditingProduct({ ...editingProduct, buyRate: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Min Resell Price Limit</label>
                    <input type="number" className="form-input text-xs font-bold text-rose-700" value={editingProduct.minSellRate} onChange={(e) => setEditingProduct({ ...editingProduct, minSellRate: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="form-label">Recommended Retail Price</label>
                    <input type="number" className="form-input text-xs" value={editingProduct.defaultSellRate} onChange={(e) => setEditingProduct({ ...editingProduct, defaultSellRate: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>

                {/* Edit Advance Configuration */}
                <div className="col-span-1 md:col-span-2 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2 pb-1 border-b border-emerald-100/60 flex justify-between items-center">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-900">COD vs Advance Payment Rules</span>
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Payment Authorization Mode</label>
                    <select 
                      className="form-input text-xs py-2 mt-1 bg-white border" 
                      value={editingProduct.requireAdvance ? "advance" : "cod"}
                      onChange={(e) => {
                        const val = e.target.value === "advance";
                        setEditingProduct({ ...editingProduct, requireAdvance: val, advanceAmount: val ? (editingProduct.advanceAmount || 100) : 0 });
                      }}
                    >
                      <option value="cod">Allow full Cash on Delivery (COD)</option>
                      <option value="advance">Require Advance Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Advance Amount (৳)</label>
                    <input 
                      type="number" 
                      disabled={!editingProduct.requireAdvance}
                      className="form-input text-xs py-2 mt-1 bg-white border disabled:bg-slate-150 disabled:text-slate-400" 
                      placeholder="e.g. 100 or 150"
                      value={editingProduct.advanceAmount || ''} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, advanceAmount: Math.max(0, parseInt(e.target.value) || 0) })} 
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Users must pay this amount as advance using bKash, Nagad, Rocket, or Bank to place order.</p>
                  </div>
                </div>

                {/* Social Proof ratings and sales */}
                <div className="col-span-1 md:col-span-2 bg-amber-50/50 rounded-2xl border border-amber-100/80 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2 pb-1 border-b border-amber-100/60 flex justify-between items-center">
                    <span className="font-extrabold text-[10px] uppercase tracking-wider text-amber-900">Rating & Reviews (Social Proof)</span>
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Star Rating (0.0 - 5.0)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="5"
                      className="form-input text-xs py-2 mt-1 bg-white border" 
                      placeholder="e.g. 4.8"
                      value={editingProduct.rating} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, rating: parseFloat(e.target.value) || 0 })} 
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold text-slate-700">Total Sales / Reviews Count</label>
                    <input 
                      type="number" 
                      min="0"
                      className="form-input text-xs py-2 mt-1 bg-white border" 
                      placeholder="e.g. 150"
                      value={editingProduct.sales} 
                      onChange={(e) => setEditingProduct({ ...editingProduct, sales: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-2 text-xs">
                  <button type="button" onClick={() => setEditingProduct(null)} className="bg-slate-100 hover:bg-slate-200 border px-6 py-2.5 rounded-xl font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="bg-slate-900 text-white font-extrabold px-8 py-2.5 rounded-xl hover:bg-slate-800 shadow">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. CRUD updates for Categories list */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEditingCategory(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-sm"
            >
              <h3 className="font-extrabold text-sm uppercase mb-4 text-slate-900">Alter Department category taxonomy</h3>
              <form onSubmit={updateCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category Name</label>
                  <input 
                    type="text" 
                    className="form-input text-xs py-2.5 w-full font-bold" 
                    required 
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload New Photo (Image)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleEditCategoryImgUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-pink-50 file:text-pink-650 hover:file:bg-pink-100 cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 items-center p-2 bg-slate-50 rounded-2xl border">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center p-0.5">
                    <img src={editingCategory.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80'} alt="Current" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400">CURRENT IMAGE PREVIEW</span>
                    <span className="text-[9px] text-slate-350">Updates immediately on file select</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl uppercase">
                  Consolidate Alteration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CRUD updates for Users manual details balance adjustments */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-sm"
            >
              <h3 className="font-extrabold text-sm uppercase mb-4 text-slate-900">Manually regulate balance coordinates</h3>
              <form onSubmit={updateReseller} className="space-y-4 text-xs text-slate-700">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input text-xs" required value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Access</label>
                  <input type="email" className="form-input text-xs" required value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Manually Override Ledger Balance (৳)</label>
                  <input type="number" className="form-input text-xs font-mono font-bold text-indigo-700" required value={editingUser.balance} onChange={(e) => setEditingUser({ ...editingUser, balance: parseInt(e.target.value) || 0 })} />
                </div>
                
                <div className="form-group border-t border-slate-100 pt-3">
                  <label className="form-label font-bold text-slate-800">Subscription Expiration Date (Meyad)</label>
                  <p className="text-[9px] text-slate-400 mb-1 leading-none">Determine the premium reseller access ending timeline.</p>
                  <input 
                    type="date" 
                    className="form-input text-xs font-mono font-bold w-full p-2 border rounded-xl bg-slate-50 border-slate-200 mt-1"
                    value={editingUser.subscriptionExpiresAt ? editingUser.subscriptionExpiresAt.slice(0, 10) : ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, subscriptionExpiresAt: e.target.value })} 
                  />
                  
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {[
                      { label: '+1m', m: 1 },
                      { label: '+3m', m: 3 },
                      { label: '+6m', m: 6 },
                      { label: '+1y', m: 12 }
                    ].map(pres => (
                      <button
                        key={pres.label}
                        type="button"
                        onClick={() => {
                          const base = editingUser.subscriptionExpiresAt ? getDhakaDate(editingUser.subscriptionExpiresAt) : getDhakaDate(new Date());
                          const current = getDhakaDate(new Date());
                          const reference = base.getTime() < current.getTime() ? current : base;
                          reference.setMonth(reference.getMonth() + pres.m);
                          const y = reference.getFullYear();
                          const month = String(reference.getMonth() + 1).padStart(2, '0');
                          const d = String(reference.getDate()).padStart(2, '0');
                          setEditingUser({ ...editingUser, subscriptionExpiresAt: `${y}-${month}-${d}` });
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-[9px] font-extrabold text-slate-700 py-1 rounded-lg transition-colors cursor-pointer text-center border border-slate-200"
                      >
                        {pres.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-slate-905 bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 uppercase shadow text-[10px] tracking-wide">
                  Enforce Balance overrides
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Custom Seller Store Stats Editor Modal */}
      <AnimatePresence>
        {editingSellerForStats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEditingSellerForStats(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-sm max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-xs uppercase flex items-center gap-1.5 text-slate-900">
                  <ShoppingBag className="w-4 h-4 text-pink-500" /> Edit Store Stats: {editingSellerForStats.name}
                </h3>
                <button onClick={() => setEditingSellerForStats(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Positive Ratings (%)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100"
                    placeholder="e.g. 96"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 outline-none" 
                    value={editSellerRating}
                    onChange={(e) => setEditSellerRating(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-slate-400 leading-none">Positive buyer recommendations score (1% to 100%)</p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Store Followers Count</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 4.2k or 12k or 850"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 outline-none" 
                    value={editSellerFollowers}
                    onChange={(e) => setEditSellerFollowers(e.target.value)}
                  />
                  <p className="text-[9px] text-slate-400 leading-none">Displays on shop profile, e.g., 2.5k, 10k, 500</p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Ship on Time Rate (%)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100"
                    placeholder="e.g. 95"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 outline-none" 
                    value={editSellerShipOnTime}
                    onChange={(e) => setEditSellerShipOnTime(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-slate-400 leading-none">Average shipping speed satisfaction metric (1% to 100%)</p>
                </div>

                 <div className="space-y-1.5 text-left">
                  <p className="text-[9.5px] text-slate-450 italic">Note: Chat Response metrics configured here are hidden in the current customer interface.</p>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUsers(prev => prev.map(u => u.id === editingSellerForStats.id ? {
                        ...u,
                        sellerRating: editSellerRating,
                        sellerFollowersCount: editSellerFollowers,
                        sellerShipOnTime: editSellerShipOnTime,
                        sellerChatResponse: editSellerChatResponse
                      } : u));
                      showNotif(`Successfully updated custom stats for "${editingSellerForStats.name}"!`, "success");
                      setEditingSellerForStats(null);
                    }}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center border-none"
                  >
                    Save Custom Stats
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsers(prev => prev.map(u => {
                        if (u.id === editingSellerForStats.id) {
                          const updated = { ...u };
                          delete updated.sellerRating;
                          delete updated.sellerFollowersCount;
                          delete updated.sellerShipOnTime;
                          delete updated.sellerChatResponse;
                          return updated;
                        }
                        return u;
                      }));
                      showNotif(`Reset statistics for "${editingSellerForStats.name}" to automatic defaults!`, "success");
                      setEditingSellerForStats(null);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer border-none"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
