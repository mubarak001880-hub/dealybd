export interface Product {
  id: string;
  catId: string;
  name: string;
  description: string;
  img: string;
  originalPrice: number;
  discountPrice: number;
  buyRate: number; // Reseller purchase price
  minSellRate: number; // Minimum reseller selling price
  defaultSellRate: number; // Reseller suggested selling price
  rating: number;
  sales: number;
  inStock: boolean;
  isFlash: boolean;
  colors?: string[];
  requireAdvance?: boolean;
  advanceAmount?: number;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
}

export type OrderStatus = 'Pending' | 'Approved' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface TrackingEvent {
  status: OrderStatus;
  date: string;
  description: string;
  isCompleted: boolean;
}

export interface Order {
  id: string;
  trackingId: string; // Dynamic readable unique ID: ORV-XXXXXX-AB
  type: 'reseller' | 'customer' | 'guest';
  userId?: string; // If placed by a reseller, this links to the Reseller's User ID
  productName: string;
  prodImg?: string;
  qty: number;
  color?: string;
  sellRate: number;
  buyRate?: number;
  profit: number; // (sellRate - buyRate) * qty
  amount: number; // Total order value
  custName: string;
  custPhone: string;
  custAddress: string;
  status: OrderStatus;
  date: string;
  timeline: TrackingEvent[];
  advancePaid?: number;
  txId?: string;
  paymentMethod?: string; // e.g. 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'COD'
}

export interface KYCData {
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  nidName?: string;
  nidNumber?: string;
  dob?: string;
  frontImage?: string;
  backImage?: string;
  rejectReason?: string;
  submittedAt?: number;
}

export interface ActivityLog {
  id: string;
  date: string;
  type: 'profit' | 'withdraw';
  desc: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  pass: string; // Simulating hashed password
  role: 'admin' | 'user';
  idCode: string; // e.g. RES-1023
  banned: boolean;
  balance: number;
  kyc: KYCData;
  activities: ActivityLog[];
  avatarUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  pass: string;
  address: string;
  avatarUrl?: string;
}

export interface Banner {
  id: string;
  img: string;
  isActive: boolean;
  link?: string;
}

export interface SellerApp {
  id: string;
  name: string;
  phone: string;
  details?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: string;
  account: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface SpecialOffer {
  id: string;
  badge: string;
  title: string;
  desc: string;
  actionText: string;
  themeColor: string; // e.g. 'cyan', 'orange', 'pink', 'emerald'
  catId: string; // Associated category ID
}

export interface DeliveryCharge {
  id: string;
  district: string;
  charge: number;
}

export interface FooterConfig {
  aboutUs: string;
  facebook: string;
  youtube: string;
  instagram?: string;
  tiktok?: string;
  contactEmail: string;
  contactPhone: string;
  privacyPolicy: string;
  joinResellerBanner: string;
  brandLogoUrl: string;
  address?: string;
  websiteUrl?: string;
  developerName?: string;
  developerUrl?: string;
  customLinks?: { name: string; url: string }[];
}

export interface PopupImage {
  id: string;
  img: string;
  link: string;
  isActive: boolean;
}

export interface ResellerSubscriptionOption {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[]; // comma separated or array of strings
  isActive: boolean;
}

export interface ResellerFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ResellerBenefitCard {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

export interface ResellerPageConfig {
  title: string;
  subtitle: string;
  videoUrl: string;
  registerBtnText: string;
  bannerNotice: string;
  sectionsHeadline: string;
  founderName: string;
  founderTitle: string;
  founderPhoto: string;
  founderMsg: string;
}

export interface PaymentChannel {
  id: string;
  name: string;      // e.g. 'bKash', 'Nagad'
  accountNumber: string; // e.g. '017XXXXXXXX'
  methodType: string; // e.g. 'Send Money', 'Cash Out', 'Bank Transfer'
  isActive: boolean;
}

export interface AdvanceConfig {
  requireAdvance: boolean; // Is advance required at all?
  amountType: 'fixed' | 'delivery'; // Fixed amount or exact delivery charge
  fixedAmount: number; // For 'fixed' amountType
  instructionText: string; // "কিছু পণ্য অর্ডারের জন্য অগ্রিম পেমেন্ট..."
  channels: PaymentChannel[];
}

export interface PromoCode {
  id: string;
  code: string; // The promo code name, uppercase e.g. "ORIVIAN50"
  discountType: 'fixed' | 'percent';
  discountValue: number; // Flat BDT amount or percentage value
  maxUses: number; // Maximum times this code can be used in total
  usedCount: number; // How many times it has been used currently
  isActive: boolean; // Is active or paused
}

export interface FlashOfferSetting {
  id: string;
  name: string;
  type: 'discount' | 'free_delivery' | 'bogo' | 'custom';
  value: string;
  isActive: boolean;
  textColor?: string;
  bgColor?: string;
}






