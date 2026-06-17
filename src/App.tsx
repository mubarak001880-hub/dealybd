/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, Clock, Lock, Eye, EyeOff } from 'lucide-react';
import { User, Product, Category, Order, Banner, SellerApp, Withdrawal, Customer, SpecialOffer, DeliveryCharge, FooterConfig, PopupImage, ResellerPageConfig, ResellerSubscriptionOption, ResellerFAQ, ResellerBenefitCard, AdvanceConfig, PaymentChannel, PromoCode, FlashOfferSetting, AffiliateTask, AffiliateSubmission, AffiliateAccount, AffiliateWithdrawal, AffiliateClickLog } from './types';
import { initialUsers, initialProducts, initialCategories, initialBanners, initialResellerBanners, initialOrders, initialSpecialOffers, initialResellerPageConfig, initialResellerSubscriptions, initialResellerBenefits, initialResellerFAQs, initialFlashOfferSettings } from './data';

import CustomerStore from './components/CustomerStore';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import SellerPanel from './components/SellerPanel';
import { getDhakaDate, formatToDhakaTime, formatToDhakaDateOnly } from './dateUtils';

const initialDeliveryCharges: DeliveryCharge[] = [
  { id: 'dc_1', district: 'Dhaka City', charge: 60 },
  { id: 'dc_2', district: 'Chittagong City', charge: 100 },
  { id: 'dc_3', district: 'Sylhet City', charge: 120 },
  { id: 'dc_4', district: 'Gazipur', charge: 80 },
  { id: 'dc_5', district: 'Narayanganj', charge: 80 },
  { id: 'dc_6', district: 'Suburban / Outer Districts (All Other locations)', charge: 150 }
];

const initialFooterConfig: FooterConfig = {
  aboutUs: "Badhon's World - Your Trusted Hub for Unique Products & Home Décor. Delivering quality, reliability & happiness straight to your doorstep. Customer-first approach | Fast delivery | Trusted by thousands nationwide.",
  facebook: "https://facebook.com/dealydistribution",
  youtube: "https://youtube.com/dealydistribution",
  instagram: "https://instagram.com/dealydistribution",
  tiktok: "https://tiktok.com/@dealydistribution",
  contactEmail: "support@dealy.com",
  contactPhone: "+8801711223344",
  privacyPolicy: "We value customer trust and guarantee safe warehousing, quality checks, and real-time logistics tracking parameters, protecting your business data integrity.",
  joinResellerBanner: "Start your independent reselling journey today. Place orders, track active commission payouts, and boost family earnings with zero stock load.",
  brandLogoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  address: "Dokkhin Mugda, Bazar Mosjid, Hamid Tower Dhaka, Bangladesh.",
  websiteUrl: "https://badhonsworld.com",
  developerName: "Mubarak",
  developerUrl: "https://github.com",
  customLinks: [
    { name: "Official WhatsApp Support Helpline", url: "https://wa.me/8801735165971" },
    { name: "Official Telegram Channel Hub", url: "https://t.me/dealydistribution" },
    { name: "Resellers Facebook Community Group", url: "https://facebook.com/dealydistribution" },
    { name: "YouTube Tutorials & Trainings Channel", url: "https://youtube.com/dealydistribution" }
  ],
  privacyPolicyFullText: "<h3>Privacy & Safety Policy (প্রাইভেসি এবং নিরাপত্তা পলিসি)</h3><p>স্বাগতম Dealy স্টোরে। আমাদের অ্যাপ ব্যবহারকারীদের ব্যক্তিগত তথ্য এবং তথ্যের নিরাপত্তা বজায় রাখতে আমরা প্রতিশ্রুতিবদ্ধ।</p><h4>১. তথ্য সংগ্রহ ও ব্যবহার</h4><p>আমরা শুধুমাত্র অর্ডার নিশ্চিতকরণ, ডেলিভারি ট্র্যাকিং এবং পেমেন্ট ভ্যালিডেশনের জন্য প্রয়োজনীয় তথ্য (যেমন: নাম, ফোন নম্বর, ঠিকানা এবং পেমেন্ট স্ক্রিনশট) সংগ্রহ করে থাকি।</p><h4>২. তথ্য সুরক্ষা</h4><p>আপনার প্রদত্ত প্রতিটি ফাইল ও ডকুমেন্ট অত্যন্ত নিরাপদ সার্ভারে জমা থাকে। কোনো অবস্থাতেই অনুমতি ছাড়া এই তথ্য কোনো ৩য় পক্ষের নিকট বিক্রয় বা শেয়ার করা হয় না।</p><h4>৩. নির্ভরযোগ্যতা এবং নিরাপত্তা</h4><p>একজন গ্রাহক বা রিসেলার হিসেবে আপনার একাউন্টের গোপনীয়তা রক্ষার দায়িত্ব আমাদের। আপনার যে কোনো প্রয়োজনে বা তথ্যের সংশোধনে সরাসরি আমাদের ওয়ান-স্টপ সাপোর্ট লাইনে যোগাযোগ করুন। ধন্যবাদ।</p>",
  termsConditionsFullText: "<h3>Terms & Conditions (শর্তাবলী এবং নিয়মাবলী)</h3><p>Dealy সিস্টেমে যেকোনো পণ্য ক্রয়, অর্ডার সাবমিশন অথবা রিসেলার কর্মকান্ড পরিচালনার ক্ষেত্রে নিম্নলিখিত শর্তাবলী প্রযোজ্য হবেঃ</p><h4>১. নির্ভরযোগ্য প্রোডাক্ট সোর্সিং</h4><p>স্টোরে প্রদর্শিত সকল পণ্য আমাদের নিজস্ব টিম এবং ভেরিফাইড মার্চেন্টদের দ্বারা সোর্স করা। পণ্যের বিবরণ এবং স্টক সংক্রান্ত কন্ডিশন রিয়েল-টাইমে আপডেট করা হয়।</p><h4>২. পেমেন্ট ভেরিফিকেশন এবং ট্রানজেকশন কন্ডিশন</h4><p>অর্ডার কনফার্ম করার জন্য প্রয়োজনীয় সিকিউরিটি অ্যাডভান্স পেমেন্ট প্রদানপূর্বক সঠিক ট্রানজেকশন আইডি এবং পেমেন্ট প্রুফ স্ক্রিনশট সাবমিট করা বাধ্যতামূলক। কোনো জাল ট্রানজেকশন প্রমানিত হলে ওই অর্ডার বাতিল বলে গণ্য হবে এবং আইডি রিজেক্ট হতে পারে।</p><h4>৩. ডেলিভারি এবং রিটার্ন পলিসি</h4><p>ডেলিভারিম্যানের সামনে পণ্য চেক করে বুজে নেওয়ার জন্য অনুরোধ রইল। কোনো ওজর-আপত্তি বা ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে তাত্ক্ষণিকভাবে রিটার্ন করতে হবে। পরবর্তীতে কোনো স্ক্র্যাচ বা ক্ষতিগ্রস্থ প্রোডাক্টের জন্য Dealy দায়ী থাকবে না।</p><h4>৪. রিসেলার চুক্তি ও কমিশন</h4><p>প্রত্যেক রিসেলার নির্দিষ্ট পণ্যের মার্জিনের ভিত্তিতে তার কমিশন একাউন্টে জমাকৃত দেখতে পাবেন এবং উইথড্র রিকুয়েস্টের সর্বোচ্চ ২৪ থেকে ৪৮ ঘন্টার মধ্যে পেমেন্ট সম্পন্ন করা হবে।</p>",
  sellerPayEnabled: false,
  sellerPayAmount: 500,
  sellerPayValidity: "১ বছর",
  sellerPayNumberBKash: "01735165971",
  sellerPayNumberNagad: "01735165971",
  sellerPayNumberRocket: "01735165971"
};

const initialAdvanceConfig: AdvanceConfig = {
  requireAdvance: true,
  amountType: 'fixed',
  fixedAmount: 100,
  instructionText: "কিছু পণ্য অর্ডারের জন্য অগ্রিম পেমেন্ট আবশ্যক। নিচে দেয় যেকোনো একটি মাধ্যমে সেন্ড মানি বা ট্রান্সফার করে ট্রানজেকশন আইডি প্রদান করুন।",
  channels: [
    { id: 'ch_1', name: 'bKash', accountNumber: '017XXXXXXXX', methodType: 'Send Money', isActive: true },
    { id: 'ch_2', name: 'Nagad', accountNumber: '017XXXXXXXX', methodType: 'Send Money', isActive: true },
    { id: 'ch_3', name: 'Rocket', accountNumber: '017XXXXXXXX-*', methodType: 'Send Money', isActive: true },
    { id: 'ch_4', name: 'Bank Transfer', accountNumber: 'DBBL (AC: XXXX)', methodType: 'Bank', isActive: true }
  ]
};

const initialPromoCodes: PromoCode[] = [
  { id: 'p_1', code: 'DEALY50', discountType: 'fixed', discountValue: 50, maxUses: 100, usedCount: 15, isActive: true },
  { id: 'p_2', code: 'EID2026', discountType: 'percent', discountValue: 10, maxUses: 50, usedCount: 8, isActive: true }
];


export default function App() {
  // Sync state loaded from Express backend database (db.json)
  const [isSyncInitDone, setIsSyncInitDone] = useState(false);

  const syncToServer = async (key: string, data: any) => {
    if (!isSyncInitDone) return;
    try {
      await fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      });
    } catch (err) {
      console.error(`Syncing error for key ${key}:`, err);
    }
  };

  // Global Persisted States with lazy initializers for flawless loading
  const [panelRole, setPanelRole] = useState<'admin' | 'user' | 'seller' | null>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_role');
      return saved ? (JSON.parse(saved) as 'admin' | 'user' | 'seller') : null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_users');
      let loadedUsers: User[] = saved ? JSON.parse(saved) : initialUsers;
      const adminIdx = loadedUsers.findIndex(u => u.role === 'admin' || u.id === 'admin1');
      if (adminIdx !== -1) {
        loadedUsers[adminIdx].email = 'mubarak06199@gmail.com';
        loadedUsers[adminIdx].pass = 'HRidoy009@@';
      } else {
        loadedUsers.push({
          id: 'admin1',
          name: 'Dealy Executive Partner',
          email: 'mubarak06199@gmail.com',
          pass: 'HRidoy009@@',
          role: 'admin',
          idCode: 'ADMIN-001',
          banned: false,
          balance: 85200,
          kyc: { status: 'verified' },
          activities: []
        });
      }
      return loadedUsers;
    } catch {
      return initialUsers;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_custs');
      return saved ? JSON.parse(saved) : [
        { id: 'c_1', name: 'Tasnim Alam', phone: '01711223344', pass: '1234', address: 'Dhanmondi, Dhaka' }
      ];
    } catch {
      return [];
    }
  });

  const [loggedCustomer, setLoggedCustomer] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_loggedCust');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_prods');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_cats');
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_ords');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_bans');
      return saved ? JSON.parse(saved) : initialBanners;
    } catch {
      return initialBanners;
    }
  });

  const [resellerBanners, setResellerBanners] = useState<Banner[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_reseller_bans');
      return saved ? JSON.parse(saved) : initialResellerBanners;
    } catch {
      return initialResellerBanners;
    }
  });

  const [popupImages, setPopupImages] = useState<PopupImage[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_popup_images');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sellerApps, setSellerApps] = useState<SellerApp[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_apps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_wd');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_special_offers');
      return saved ? JSON.parse(saved) : initialSpecialOffers;
    } catch {
      return initialSpecialOffers;
    }
  });

  const [deliveryCharges, setDeliveryCharges] = useState<DeliveryCharge[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_delivery_charges');
      return saved ? JSON.parse(saved) : initialDeliveryCharges;
    } catch {
      return initialDeliveryCharges;
    }
  });

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_footer_config');
      return saved ? JSON.parse(saved) : initialFooterConfig;
    } catch {
      return initialFooterConfig;
    }
  });

  const [bannerHeight, setBannerHeight] = useState<string>(() => {
    return localStorage.getItem('orivian_banner_h') || 'medium';
  });

  const [resellerPageConfig, setResellerPageConfig] = useState<ResellerPageConfig>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_reseller_config');
      return saved ? JSON.parse(saved) : initialResellerPageConfig;
    } catch {
      return initialResellerPageConfig;
    }
  });

  const [resellerSubscriptions, setResellerSubscriptions] = useState<ResellerSubscriptionOption[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_reseller_subs');
      return saved ? JSON.parse(saved) : initialResellerSubscriptions;
    } catch {
      return initialResellerSubscriptions;
    }
  });

  const [resellerBenefits, setResellerBenefits] = useState<ResellerBenefitCard[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_reseller_benefits');
      return saved ? JSON.parse(saved) : initialResellerBenefits;
    } catch {
      return initialResellerBenefits;
    }
  });

  const [resellerFAQs, setResellerFAQs] = useState<ResellerFAQ[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_reseller_faqs');
      return saved ? JSON.parse(saved) : initialResellerFAQs;
    } catch {
      return initialResellerFAQs;
    }
  });

  const [advanceConfig, setAdvanceConfig] = useState<AdvanceConfig>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_advance_config');
      return saved ? JSON.parse(saved) : initialAdvanceConfig;
    } catch {
      return initialAdvanceConfig;
    }
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_promos');
      return saved ? JSON.parse(saved) : initialPromoCodes;
    } catch {
      return initialPromoCodes;
    }
  });

  const [flashOfferSettings, setFlashOfferSettings] = useState<FlashOfferSetting[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_flash_offers');
      return saved ? JSON.parse(saved) : initialFlashOfferSettings;
    } catch {
      return initialFlashOfferSettings;
    }
  });

  const [affiliateRatePerClick, setAffiliateRatePerClick] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_aff_rate');
      return saved ? Number(saved) : 2;
    } catch {
      return 2;
    }
  });

  const [affiliateMinWithdrawal, setAffiliateMinWithdrawal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_aff_min_wd');
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  const [affiliateTasks, setAffiliateTasks] = useState<AffiliateTask[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_aff_tasks');
      return saved ? JSON.parse(saved) : [
        { id: 'at_1', title: 'Share Referral Link in Facebook Reselling Groups', desc: 'Copy your referral link and share it on active Facebook Reselling Groups. Provide your post link and group name as proof.', reward: 15, status: 'active', platform: 'Facebook' },
        { id: 'at_2', title: 'Subscribe & Comment on Youtube Video', desc: 'Subscribe to our Official YouTube Channel, and comment on the latest reseller training video. Provide your Youtube channel URL or comment screenshot info.', reward: 10, status: 'active', platform: 'YouTube' },
        { id: 'at_3', title: 'Join our Main Telegram Channel', desc: 'Join Badhon\'s World Official Telegram channel. Provide your Telegram Username (@username) as proof.', reward: 10, status: 'active', platform: 'Telegram' },
        { id: 'at_4', title: 'Introduce a new Active Seller', desc: 'Introduce an active reseller. Give their active phone number and contact details so our team can verify and approve.', reward: 50, status: 'active', platform: 'Custom' }
      ];
    } catch {
      return [];
    }
  });

  const [affiliateSubmissions, setAffiliateSubmissions] = useState<AffiliateSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_aff_subs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [affiliateAccounts, setAffiliateAccounts] = useState<AffiliateAccount[]>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_aff_accs');
      if (saved) {
        const parsed = JSON.parse(saved) as AffiliateAccount[];
        const unique: AffiliateAccount[] = [];
        const seen = new Set<string>();
        for (const item of parsed) {
          if (item && item.phone) {
            const cleanPhone = item.phone.trim();
            if (!seen.has(cleanPhone)) {
              seen.add(cleanPhone);
              unique.push({ ...item, phone: cleanPhone });
            }
          }
        }
        return unique;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [resellerReferralReward, setResellerReferralReward] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_reseller_ref_reward');
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  // Load initial database state from Express server on boot
  useEffect(() => {
    const loadServerData = async () => {
      try {
        const res = await fetch("/api/db/get");
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON but received: ${contentType}`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          const db = json.data;
          
          if (db.users) setUsers(db.users);
          if (db.customers) setCustomers(db.customers);
          if (db.products) setProducts(db.products);
          if (db.categories) setCategories(db.categories);
          if (db.orders) setOrders(db.orders);
          if (db.banners) setBanners(db.banners);
          if (db.resellerBanners) setResellerBanners(db.resellerBanners);
          if (db.popupImages) setPopupImages(db.popupImages);
          if (db.sellerApps) setSellerApps(db.sellerApps);
          if (db.withdrawals) setWithdrawals(db.withdrawals);
          if (db.specialOffers) setSpecialOffers(db.specialOffers);
          if (db.deliveryCharges) setDeliveryCharges(db.deliveryCharges);
          if (db.footerConfig) setFooterConfig(db.footerConfig);
          if (db.bannerHeight) setBannerHeight(db.bannerHeight);
          if (db.resellerPageConfig) setResellerPageConfig(db.resellerPageConfig);
          if (db.resellerSubscriptions) setResellerSubscriptions(db.resellerSubscriptions);
          if (db.resellerBenefits) setResellerBenefits(db.resellerBenefits);
          if (db.resellerFAQs) setResellerFAQs(db.resellerFAQs);
          if (db.advanceConfig) setAdvanceConfig(db.advanceConfig);
          if (db.promoCodes) setPromoCodes(db.promoCodes);
          if (db.flashOfferSettings) setFlashOfferSettings(db.flashOfferSettings);
          if (db.affiliateRatePerClick !== undefined) setAffiliateRatePerClick(db.affiliateRatePerClick);
          if (db.affiliateMinWithdrawal !== undefined) setAffiliateMinWithdrawal(db.affiliateMinWithdrawal);
          if (db.affiliateTasks) setAffiliateTasks(db.affiliateTasks);
          if (db.affiliateSubmissions) setAffiliateSubmissions(db.affiliateSubmissions);
          if (db.affiliateAccounts) setAffiliateAccounts(db.affiliateAccounts);
          if (db.resellerReferralReward !== undefined) setResellerReferralReward(db.resellerReferralReward);
          
          // Seed back to server if database is currently empty
          const hasKeys = Object.keys(db).length > 0;
          if (!hasKeys) {
            const initialPayload = {
              users: db.users || initialUsers,
              customers,
              products,
              categories,
              orders,
              banners,
              resellerBanners,
              popupImages,
              sellerApps,
              withdrawals,
              specialOffers,
              deliveryCharges,
              footerConfig,
              bannerHeight,
              resellerPageConfig,
              resellerSubscriptions,
              resellerBenefits,
              resellerFAQs,
              advanceConfig,
              promoCodes,
              flashOfferSettings,
              affiliateRatePerClick,
              affiliateMinWithdrawal,
              affiliateTasks,
              affiliateSubmissions,
              affiliateAccounts,
              resellerReferralReward,
            };
            await fetch("/api/db/save-bulk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ payload: initialPayload })
            });
          }
        }
      } catch (err) {
        console.error("Error loading server data:", err);
      } finally {
        setIsSyncInitDone(true);
      }
    };
    
    loadServerData();
  }, []);

  // Debounced bulk state persistence to avoid hitting server concurrently on interactive edits or slider actions
  useEffect(() => {
    if (!isSyncInitDone) return;
    
    const saveAllToServer = async () => {
      const payload = {
        users,
        customers,
        products,
        categories,
        orders,
        banners,
        resellerBanners,
        popupImages,
        sellerApps,
        withdrawals,
        specialOffers,
        deliveryCharges,
        footerConfig,
        bannerHeight,
        resellerPageConfig,
        resellerSubscriptions,
        resellerBenefits,
        resellerFAQs,
        advanceConfig,
        promoCodes,
        flashOfferSettings,
        affiliateRatePerClick,
        affiliateMinWithdrawal,
        affiliateTasks,
        affiliateSubmissions,
        affiliateAccounts,
        resellerReferralReward,
      };
      
      try {
        await fetch("/api/db/save-bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload })
        });
      } catch (err) {
        console.error("Failed to auto-save bulk updates to server:", err);
      }
    };

    const timer = setTimeout(saveAllToServer, 1000);
    return () => clearTimeout(timer);
  }, [
    isSyncInitDone,
    users,
    customers,
    products,
    categories,
    orders,
    banners,
    resellerBanners,
    popupImages,
    sellerApps,
    withdrawals,
    specialOffers,
    deliveryCharges,
    footerConfig,
    bannerHeight,
    resellerPageConfig,
    resellerSubscriptions,
    resellerBenefits,
    resellerFAQs,
    advanceConfig,
    promoCodes,
    flashOfferSettings,
    affiliateRatePerClick,
    affiliateMinWithdrawal,
    affiliateTasks,
    affiliateSubmissions,
    affiliateAccounts,
    resellerReferralReward
  ]);

  // Periodic background polling to sync modifications done in another browser automatically in real-time
  useEffect(() => {
    if (!isSyncInitDone) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/db/get");
        if (!res.ok) return; // Ignore failure when server momentarily restarts
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return; // Skip parsing if it's not JSON (e.g. gateway HTML backup)
        }
        const json = await res.json();
        if (json.success && json.data) {
          const db = json.data;
          
          if (db.users && JSON.stringify(db.users) !== JSON.stringify(users)) {
            setUsers(db.users);
            if (currentUser) {
              const refreshed = db.users.find((u: any) => u.id === currentUser.id);
              if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(currentUser)) {
                setCurrentUser(refreshed);
              }
            }
          }
          if (db.customers && JSON.stringify(db.customers) !== JSON.stringify(customers)) {
            setCustomers(db.customers);
            if (loggedCustomer) {
              const refreshed = db.customers.find((c: any) => c.id === loggedCustomer.id);
              if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(loggedCustomer)) {
                setLoggedCustomer(refreshed);
              }
            }
          }
          if (db.products && JSON.stringify(db.products) !== JSON.stringify(products)) setProducts(db.products);
          if (db.categories && JSON.stringify(db.categories) !== JSON.stringify(categories)) setCategories(db.categories);
          if (db.orders && JSON.stringify(db.orders) !== JSON.stringify(orders)) setOrders(db.orders);
          if (db.banners && JSON.stringify(db.banners) !== JSON.stringify(banners)) setBanners(db.banners);
          if (db.resellerBanners && JSON.stringify(db.resellerBanners) !== JSON.stringify(resellerBanners)) setResellerBanners(db.resellerBanners);
          if (db.popupImages && JSON.stringify(db.popupImages) !== JSON.stringify(popupImages)) setPopupImages(db.popupImages);
          if (db.sellerApps && JSON.stringify(db.sellerApps) !== JSON.stringify(sellerApps)) setSellerApps(db.sellerApps);
          if (db.withdrawals && JSON.stringify(db.withdrawals) !== JSON.stringify(withdrawals)) setWithdrawals(db.withdrawals);
          if (db.specialOffers && JSON.stringify(db.specialOffers) !== JSON.stringify(specialOffers)) setSpecialOffers(db.specialOffers);
          if (db.deliveryCharges && JSON.stringify(db.deliveryCharges) !== JSON.stringify(deliveryCharges)) setDeliveryCharges(db.deliveryCharges);
          if (db.footerConfig && JSON.stringify(db.footerConfig) !== JSON.stringify(footerConfig)) setFooterConfig(db.footerConfig);
          if (db.bannerHeight && db.bannerHeight !== bannerHeight) setBannerHeight(db.bannerHeight);
          if (db.resellerPageConfig && JSON.stringify(db.resellerPageConfig) !== JSON.stringify(resellerPageConfig)) setResellerPageConfig(db.resellerPageConfig);
          if (db.resellerSubscriptions && JSON.stringify(db.resellerSubscriptions) !== JSON.stringify(resellerSubscriptions)) setResellerSubscriptions(db.resellerSubscriptions);
          if (db.resellerBenefits && JSON.stringify(db.resellerBenefits) !== JSON.stringify(resellerBenefits)) setResellerBenefits(db.resellerBenefits);
          if (db.resellerFAQs && JSON.stringify(db.resellerFAQs) !== JSON.stringify(resellerFAQs)) setResellerFAQs(db.resellerFAQs);
          if (db.advanceConfig && JSON.stringify(db.advanceConfig) !== JSON.stringify(advanceConfig)) setAdvanceConfig(db.advanceConfig);
          if (db.promoCodes && JSON.stringify(db.promoCodes) !== JSON.stringify(promoCodes)) setPromoCodes(db.promoCodes);
          if (db.flashOfferSettings && JSON.stringify(db.flashOfferSettings) !== JSON.stringify(flashOfferSettings)) setFlashOfferSettings(db.flashOfferSettings);
          if (db.affiliateRatePerClick !== undefined && db.affiliateRatePerClick !== affiliateRatePerClick) setAffiliateRatePerClick(db.affiliateRatePerClick);
          if (db.affiliateMinWithdrawal !== undefined && db.affiliateMinWithdrawal !== affiliateMinWithdrawal) setAffiliateMinWithdrawal(db.affiliateMinWithdrawal);
          if (db.affiliateTasks && JSON.stringify(db.affiliateTasks) !== JSON.stringify(affiliateTasks)) setAffiliateTasks(db.affiliateTasks);
          if (db.affiliateSubmissions && JSON.stringify(db.affiliateSubmissions) !== JSON.stringify(affiliateSubmissions)) setAffiliateSubmissions(db.affiliateSubmissions);
          if (db.affiliateAccounts && JSON.stringify(db.affiliateAccounts) !== JSON.stringify(affiliateAccounts)) setAffiliateAccounts(db.affiliateAccounts);
          if (db.resellerReferralReward !== undefined && db.resellerReferralReward !== resellerReferralReward) setResellerReferralReward(db.resellerReferralReward);
        }
      } catch (err) {
        console.error("Error polling server updates:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [
    isSyncInitDone,
    users,
    customers,
    products,
    categories,
    orders,
    banners,
    resellerBanners,
    popupImages,
    sellerApps,
    withdrawals,
    specialOffers,
    deliveryCharges,
    footerConfig,
    bannerHeight,
    resellerPageConfig,
    resellerSubscriptions,
    resellerBenefits,
    resellerFAQs,
    advanceConfig,
    promoCodes,
    flashOfferSettings,
    affiliateRatePerClick,
    affiliateMinWithdrawal,
    affiliateTasks,
    affiliateSubmissions,
    affiliateAccounts,
    resellerReferralReward,
    currentUser,
    loggedCustomer
  ]);

  useEffect(() => {
    localStorage.setItem('orivian_v4_reseller_ref_reward', resellerReferralReward.toString());
  }, [resellerReferralReward]);


  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_promos', JSON.stringify(promoCodes));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [promoCodes]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_flash_offers', JSON.stringify(flashOfferSettings));
    } catch (e) {
      console.error("Storage of flash offers failed:", e);
    }
  }, [flashOfferSettings]);



  // Notifications state
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showDirectLogin, setShowDirectLogin] = useState(false);
  const [directEmail, setDirectEmail] = useState('');
  const [directPass, setDirectPass] = useState('');
  const [showDirectPass, setShowDirectPass] = useState(false);
  const [showSellerRegPass, setShowSellerRegPass] = useState(false);
  const [panelDirectAction, setPanelDirectAction] = useState<'login' | 'register_seller'>('login');
  const [sellerRegSuccess, setSellerRegSuccess] = useState(false);
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [sellerRegStep, setSellerRegStep] = useState<'form' | 'payment' | 'done'>('form');
  const [sellerRegFields, setSellerRegFields] = useState({
    name: '',
    email: '',
    phone: '',
    pass: '',
    details: '',
    businessPageLink: '',
    profileUrl: ''
  });
  const [sellerRegPaymentInfo, setSellerRegPaymentInfo] = useState({
    method: 'bKash',
    senderPhone: '',
    trxId: '',
    message: ''
  });

  // LocalStorage Sync effects
  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_special_offers', JSON.stringify(specialOffers));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [specialOffers]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_delivery_charges', JSON.stringify(deliveryCharges));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [deliveryCharges]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_footer_config', JSON.stringify(footerConfig));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [footerConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_banner_h', bannerHeight);
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [bannerHeight]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_role', JSON.stringify(panelRole));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [panelRole]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_users', JSON.stringify(users));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_custs', JSON.stringify(customers));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_loggedCust', JSON.stringify(loggedCustomer));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [loggedCustomer]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_prods', JSON.stringify(products));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_cats', JSON.stringify(categories));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_ords', JSON.stringify(orders));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_bans', JSON.stringify(banners));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_reseller_bans', JSON.stringify(resellerBanners));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [resellerBanners]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_popup_images', JSON.stringify(popupImages));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [popupImages]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_advance_config', JSON.stringify(advanceConfig));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [advanceConfig]);


  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_apps', JSON.stringify(sellerApps));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [sellerApps]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_wd', JSON.stringify(withdrawals));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [withdrawals]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_aff_rate', String(affiliateRatePerClick));
    } catch (e) {
      console.error(e);
    }
  }, [affiliateRatePerClick]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_aff_min_wd', String(affiliateMinWithdrawal));
    } catch (e) {
      console.error(e);
    }
  }, [affiliateMinWithdrawal]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_aff_tasks', JSON.stringify(affiliateTasks));
    } catch (e) {
      console.error(e);
    }
  }, [affiliateTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_aff_subs', JSON.stringify(affiliateSubmissions));
    } catch (e) {
      console.error(e);
    }
  }, [affiliateSubmissions]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_aff_accs', JSON.stringify(affiliateAccounts));
    } catch (e) {
      console.error(e);
    }
  }, [affiliateAccounts]);

  // Referral URL tracking
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        const refPhone = ref.trim();
        localStorage.setItem('dealy_referrer_phone', refPhone);
        const sessionKey = `orivian_v4_ref_clicked_${refPhone}`;
        const alreadyClicked = sessionStorage.getItem(sessionKey);
        if (!alreadyClicked) {
          sessionStorage.setItem(sessionKey, 'true');
          
          setAffiliateAccounts(prev => {
            const copy = [...prev];
            const idx = copy.findIndex(a => a.phone === refPhone);
            const simIp = '103.' + Math.floor(Math.random() * 250) + '.' + Math.floor(Math.random() * 250) + '.' + Math.floor(Math.random() * 250);
            const clickLog = {
              ip: simIp,
              date: formatToDhakaTime(),
              reward: affiliateRatePerClick
            };

            if (idx !== -1) {
              const account = copy[idx];
              return [
                ...copy.slice(0, idx),
                {
                  ...account,
                  balance: account.balance + affiliateRatePerClick,
                  clicksCount: account.clicksCount + 1,
                  clicksList: [clickLog, ...account.clicksList]
                },
                ...copy.slice(idx + 1)
              ];
            } else {
              return [
                ...copy,
                {
                  phone: refPhone,
                  name: 'Affiliate Partner',
                  balance: affiliateRatePerClick,
                  clicksCount: 1,
                  clicksList: [clickLog],
                  withdrawals: []
                }
              ];
            }
          });
          showNotif(`Referred by partner: ${refPhone}`, 'success');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [affiliateRatePerClick]);



  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_reseller_config', JSON.stringify(resellerPageConfig));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [resellerPageConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_reseller_subs', JSON.stringify(resellerSubscriptions));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [resellerSubscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_reseller_benefits', JSON.stringify(resellerBenefits));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [resellerBenefits]);

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_reseller_faqs', JSON.stringify(resellerFAQs));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [resellerFAQs]);


  // Global triggers
  const showNotif = (msg: string, type: 'success' | 'error') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  };

  const handleCustomerLogin = (phone: string, pass: string): boolean => {
    const cust = customers.find(c => c.phone === phone && c.pass === pass);
    if (cust) {
      setLoggedCustomer(cust);
      showNotif(`Successfully welcome back, ${cust.name.split(' ')[0]}.`, 'success');
      return true;
    }
    showNotif('Invalid login access digits. Verify and try again.', 'error');
    return false;
  };

  const handleCustomerRegister = (data: Omit<Customer, 'id'>): boolean => {
    if (customers.some(c => c.phone === data.phone)) {
      showNotif('A registered shopper profile already links to this phone.', 'error');
      return false;
    }
    const nextCust: Customer = {
      ...data,
      id: 'c_18200' + (customers.length + 1)
    };
    setCustomers(prev => [...prev, nextCust]);
    setLoggedCustomer(nextCust);
    showNotif('Account Registered. Enjoy pre-filled checkout shipping.', 'success');

    try {
      const referrerPhone = localStorage.getItem('dealy_referrer_phone');
      if (referrerPhone) {
        setAffiliateAccounts(prev => prev.map(acc => {
          if (acc.phone === referrerPhone) {
            const joinedDate = new Date().toLocaleDateString('bn-BD', { timeZone: 'Asia/Dhaka', year: 'numeric', month: 'long', day: 'numeric' });
            const newMember = {
              name: data.name,
              phone: data.phone,
              joinedDate: joinedDate
            };
            const updatedTeam = [...(acc.team || []), newMember];
            return {
              ...acc,
              team: updatedTeam
            };
          }
          return acc;
        }));
        localStorage.removeItem('dealy_referrer_phone');
      }
    } catch (e) {
      console.error("Referral registration failed:", e);
    }

    return true;
  };

  const handleUpdateCustomer = (updated: Customer) => {
    setLoggedCustomer(updated);
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    showNotif(' shopper profile updated successfully!', 'success');
  };

  const handleDirectPanelLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const queryEmail = directEmail.trim().toLowerCase();
    const queryPass = directPass.trim();

    const matched = users.find(u => u.email.toLowerCase() === queryEmail && u.pass === queryPass);
    if (!matched) {
      showNotif("Incorrect credentials provided. Verify your log email or password.", "error");
      return;
    }

    if (matched.banned) {
      showNotif("Your reseller account has been administrative restricted.", "error");
      return;
    }

    if (matched.role === 'user' && matched.status === 'pending') {
      showNotif(
        lang === 'en'
          ? "Your reseller account is pending admin approval. It will be activated after subscription payment verification."
          : "আপনার রিসেলার অ্যাকাউন্টটি এডমিন অনুমোদনের অপেক্ষায় রয়েছে। সাবস্ক্রিপশন পেমেন্ট রিভিউ শেষ হলে এটি সচল হবে।",
        "error"
      );
      return;
    }

    if (matched.role === 'seller' && matched.kyc?.status === 'pending') {
      showNotif(
        lang === 'en'
          ? "Your seller account is pending admin approval. Please contact support to activate your account."
          : "আপনার সেলার অ্যাকাউন্টটি এডমিন অনুমোদনের অপেক্ষায় রয়েছে। অনুগ্রহ করে এডমিনের সাথে যোগাযোগ করুন।",
        "error"
      );
      return;
    }

    setPanelRole(matched.role);
    setCurrentUser(matched);
    setShowDirectLogin(false);
    setDirectEmail('');
    setDirectPass('');
    showNotif(`Logged in successfully as ${matched.name}.`, 'success');
  };

  const handleSellerRegisterDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryEmail = sellerRegFields.email.trim().toLowerCase();
    const queryPhone = sellerRegFields.phone.trim();
    
    if (!sellerRegFields.name.trim() || !queryEmail || !queryPhone || !sellerRegFields.pass) {
      showNotif("Please fill in all required merchant details.", "error");
      return;
    }

    const duplicate = users.some(u => u.email.toLowerCase() === queryEmail || (u.phone && u.phone === queryPhone));
    if (duplicate) {
      showNotif("An account with this email/phone already exists. Please login.", "error");
      return;
    }

    if (footerConfig.sellerPayEnabled) {
      setSellerRegStep('payment');
      showNotif("Merchant details saved! Please complete onboarding payment registration.", "success");
    } else {
      const numericCode = users.filter(u => u.role === 'seller').length + 1;
      const newSeller: User = {
        id: 'seller_' + Date.now(),
        name: sellerRegFields.name.trim(),
        email: queryEmail,
        phone: queryPhone,
        pass: sellerRegFields.pass,
        role: 'seller',
        idCode: `#180${numericCode}`,
        banned: false,
        balance: 0,
        businessPageLink: sellerRegFields.businessPageLink ? sellerRegFields.businessPageLink.trim() : "",
        profileUrl: sellerRegFields.profileUrl ? sellerRegFields.profileUrl.trim() : "",
        sellerMessage: sellerRegFields.details ? sellerRegFields.details.trim() : "Direct registration (no extra message)",
        kyc: { 
          status: 'pending',
          nidName: sellerRegFields.details.trim() || "Authentic verified store partner." 
        },
        activities: []
      };

      setUsers(prev => [newSeller, ...prev]);
      setSellerRegSuccess(true);
      setSellerRegStep('done');
      setSellerRegFields({ name: '', email: '', phone: '', pass: '', details: '', businessPageLink: '', profileUrl: '' });
      setSellerRegPaymentInfo({ method: 'bKash', senderPhone: '', trxId: '', message: '' });
      showNotif(`Shop account registered and is now pending admin manual approval!`, "success");
    }
  };

  const handleSellerPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryEmail = sellerRegFields.email.trim().toLowerCase();
    const queryPhone = sellerRegFields.phone.trim();
    
    if (!sellerRegPaymentInfo.senderPhone.trim() || !sellerRegPaymentInfo.trxId.trim()) {
      showNotif("Please provide payment transaction ID and sender number.", "error");
      return;
    }

    const numericCode = users.filter(u => u.role === 'seller').length + 1;
    const newSeller: User = {
      id: 'seller_' + Date.now(),
      name: sellerRegFields.name.trim(),
      email: queryEmail,
      phone: queryPhone,
      pass: sellerRegFields.pass,
      role: 'seller',
      idCode: `#180${numericCode}`,
      banned: false,
      balance: 0,
      businessPageLink: sellerRegFields.businessPageLink ? sellerRegFields.businessPageLink.trim() : "",
      profileUrl: sellerRegFields.profileUrl ? sellerRegFields.profileUrl.trim() : "",
      sellerMessage: sellerRegPaymentInfo.message ? sellerRegPaymentInfo.message.trim() : "",
      sellerRegPayment: {
        method: sellerRegPaymentInfo.method,
        amount: footerConfig.sellerPayAmount || 500,
        senderPhone: sellerRegPaymentInfo.senderPhone.trim(),
        trxId: sellerRegPaymentInfo.trxId.trim(),
        submittedAt: formatToDhakaTime()
      },
      kyc: { 
        status: 'pending',
        nidName: sellerRegFields.details.trim() || "Authentic verified store partner." 
      },
      activities: []
    };

    setUsers(prev => [newSeller, ...prev]);
    setSellerRegSuccess(true);
    setSellerRegStep('done');
    setSellerRegFields({ name: '', email: '', phone: '', pass: '', details: '', businessPageLink: '', profileUrl: '' });
    setSellerRegPaymentInfo({ method: 'bKash', senderPhone: '', trxId: '', message: '' });
    showNotif(`Registration & Onboarding fee submitted successfully! Pending approval.`, "success");
  };

  const handlePanelLogout = () => {
    setPanelRole(null);
    setCurrentUser(null);
    showNotif('Logged out of platform cockpit.', 'success');
  };

  return (
    <div className="relative font-sans overflow-x-hidden w-full h-full">
      {/* Toast Alert pop notification banner */}
      <AnimatePresence>
        {notif && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs w-[90%] sm:w-auto max-w-sm border border-white/15 backdrop-blur-md"
            style={{ 
              backgroundColor: notif.type === 'success' ? '#10b981' : '#ef4444', 
              color: '#ffffff' 
            }}
          >
            {notif.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
            )}
            <span className="font-extrabold flex-1 leading-snug">{notif.msg}</span>
            <button onClick={() => setNotif(null)} className="hover:opacity-80 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD SWITCH LOG ROUTINES */}
      <div className="w-full h-full">
        {panelRole === 'admin' ? (
          <AdminPanel 
            users={users} 
            setUsers={setUsers}
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            orders={orders}
            setOrders={setOrders}
            banners={banners}
            setBanners={setBanners}
            resellerBanners={resellerBanners}
            setResellerBanners={setResellerBanners}
            popupImages={popupImages}
            setPopupImages={setPopupImages}
            bannerHeight={bannerHeight}
            setBannerHeight={setBannerHeight}
            sellerApps={sellerApps}
            setSellerApps={setSellerApps}
            withdrawals={withdrawals}
            setWithdrawals={setWithdrawals}
            specialOffers={specialOffers}
            setSpecialOffers={setSpecialOffers}
            deliveryCharges={deliveryCharges}
            setDeliveryCharges={setDeliveryCharges}
            footerConfig={footerConfig}
            setFooterConfig={setFooterConfig}
            resellerPageConfig={resellerPageConfig}
            setResellerPageConfig={setResellerPageConfig}
            resellerSubscriptions={resellerSubscriptions}
            setResellerSubscriptions={setResellerSubscriptions}
            resellerBenefits={resellerBenefits}
            setResellerBenefits={setResellerBenefits}
            resellerFAQs={resellerFAQs}
            setResellerFAQs={setResellerFAQs}
            onLogout={handlePanelLogout}
            showNotif={showNotif}
            affiliateRatePerClick={affiliateRatePerClick}
            setAffiliateRatePerClick={setAffiliateRatePerClick}
            affiliateMinWithdrawal={affiliateMinWithdrawal}
            setAffiliateMinWithdrawal={setAffiliateMinWithdrawal}
            affiliateTasks={affiliateTasks}
            setAffiliateTasks={setAffiliateTasks}
            affiliateSubmissions={affiliateSubmissions}
            setAffiliateSubmissions={setAffiliateSubmissions}
            affiliateAccounts={affiliateAccounts}
            setAffiliateAccounts={setAffiliateAccounts}
            resellerReferralReward={resellerReferralReward}
            setResellerReferralReward={setResellerReferralReward}
            advanceConfig={advanceConfig}
            setAdvanceConfig={setAdvanceConfig}
            promoCodes={promoCodes}
            setPromoCodes={setPromoCodes}
            flashOfferSettings={flashOfferSettings}
            setFlashOfferSettings={setFlashOfferSettings}
          />
        ) : panelRole === 'user' && currentUser ? (
          <UserPanel 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            users={users}
            setUsers={setUsers}
            products={products}
            categories={categories}
            orders={orders}
            setOrders={setOrders}
            withdrawals={withdrawals}
            setWithdrawals={setWithdrawals}
            deliveryCharges={deliveryCharges}
            footerConfig={footerConfig}
            resellerBanners={resellerBanners}
            onLogout={handlePanelLogout}
            showNotif={showNotif}
          />
        ) : panelRole === 'seller' && currentUser ? (
          <SellerPanel 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            users={users}
            setUsers={setUsers}
            products={products}
            setProducts={setProducts}
            categories={categories}
            orders={orders}
            setOrders={setOrders}
            onLogout={handlePanelLogout}
            showNotif={showNotif}
          />
        ) : (
          <CustomerStore 
            users={users}
            setUsers={setUsers}
            products={products}
            categories={categories}
            orders={orders}
            setOrders={setOrders}
            banners={banners}
            popupImages={popupImages}
            bannerHeight={bannerHeight}
            sellerApps={sellerApps}
            setSellerApps={setSellerApps}
            specialOffers={specialOffers}
            deliveryCharges={deliveryCharges}
            footerConfig={footerConfig}
            loggedCustomer={loggedCustomer}
            resellerPageConfig={resellerPageConfig}
            resellerSubscriptions={resellerSubscriptions}
            resellerBenefits={resellerBenefits}
            resellerFAQs={resellerFAQs}
            onCustLogin={handleCustomerLogin}
            onCustRegister={handleCustomerRegister}
            onCustLogout={() => { setLoggedCustomer(null); showNotif(' Shopper logged out.', 'success'); }}
            onUpdateCustomer={handleUpdateCustomer}
            advanceConfig={advanceConfig}
            setAdvanceConfig={setAdvanceConfig}
            promoCodes={promoCodes}
            setPromoCodes={setPromoCodes}
            flashOfferSettings={flashOfferSettings}
            setFlashOfferSettings={setFlashOfferSettings}
            showNotif={showNotif}
            lang={lang}
            setLang={setLang}
            openPanelLogin={() => setShowDirectLogin(true)}
            affiliateRatePerClick={affiliateRatePerClick}
            affiliateMinWithdrawal={affiliateMinWithdrawal}
            affiliateTasks={affiliateTasks}
            affiliateSubmissions={affiliateSubmissions}
            setAffiliateSubmissions={setAffiliateSubmissions}
            affiliateAccounts={affiliateAccounts}
            setAffiliateAccounts={setAffiliateAccounts}
          />
        )}
      </div>

      {/* POPUP BACKSTAGE CONTROLLER LOGIN SHEET */}
      <AnimatePresence>
        {showDirectLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowDirectLogin(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.96 }}
              className={`bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 ${panelDirectAction === 'register_seller' && !sellerRegSuccess ? 'max-w-md' : 'max-w-sm'} border border-slate-100 transition-all`}
            >
              {sellerRegSuccess ? (
                <div className="text-center py-4 space-y-4 font-sans animate-fade-in">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100 animate-pulse">
                    <Clock className="w-8 h-8 animate-spin-slow" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg uppercase tracking-wider">
                    {lang === 'en' ? "Registration Submitted!" : "রেজিস্ট্রেশন জমা হয়েছে!"}
                  </h3>
                  <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl text-[11px] leading-relaxed text-slate-600 font-bold">
                    <p className="text-amber-800 font-black mb-1.5 uppercase text-[9.5px] flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> {lang === 'en' ? "Pending Approval" : "অনুমোদনের অপেক্ষায়"}
                    </p>
                    {lang === 'en' 
                      ? "Your merchant store account registration has been successfully received. Under security protocol rules, all new stores are set to PENDING status and must be manually verified by the site administrator." 
                      : "আপনার সেলার শপ অ্যাকাউন্টটি সফলভাবে রেকর্ড করা হয়েছে! আমাদের সাইট নিরাপত্তা নীতিমালার জন্য অ্যাকাউন্টটি বর্তমানে অনুমোদনের অপেক্ষায় (Pending) রাখা হয়েছে এবং এডমিনের পর্যালোচনার পর সচল হবে।"}
                    <p className="mt-2 text-[10px] text-slate-500 font-semibold">
                      {lang === 'en'
                        ? "Once approved by our staff admin, you will be able to log in to your dashboard console using your email & password details."
                        : "এডমিন অনুমোদন সম্পন্ন হওয়ার সাথে সাথে আপনি আপনার কনসোল ড্যাশবোর্ডে ইমেল এবং পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSellerRegSuccess(false);
                      setSellerRegStep('form');
                      setPanelDirectAction('login');
                    }}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-[11px] transition-colors cursor-pointer border-none"
                  >
                    {lang === 'en' ? "Okay, Go to Login" : "ঠিক আছে, লগইনে যান"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6 pb-2.5 border-b">
                    <div>
                      <h3 className="font-black text-slate-900 text-base leading-none">
                        {panelDirectAction === 'login' ? "Console Login" : "Seller Registration"}
                      </h3>
                      <p className="text-[10px] text-slate-450 mt-1">
                        {panelDirectAction === 'login' ? "Log in as our reseller partner, seller or admin" : "Register your merchant shop and join our marketplace"}
                      </p>
                    </div>
                    <button onClick={() => { setShowDirectLogin(false); setSellerRegStep('form'); setPanelDirectAction('login'); }} className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer bg-transparent border-none">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
      
                  {/* Toggler between Login vs Register Seller */}
                  <div className="flex mb-5 bg-slate-100 rounded-xl p-1 text-xs font-bold font-sans">
                    <button 
                      onClick={() => setPanelDirectAction('login')}
                      className={`w-1/2 py-2 rounded-lg transition-all cursor-pointer border-none bg-transparent ${panelDirectAction === 'login' ? 'bg-white shadow text-pink-600' : 'text-slate-500'}`}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setPanelDirectAction('register_seller')}
                      className={`w-1/2 py-2 rounded-lg transition-all cursor-pointer border-none bg-transparent ${panelDirectAction === 'register_seller' ? 'bg-white shadow text-pink-600' : 'text-slate-500'}`}
                    >
                      Become a Seller
                    </button>
                  </div>
    
                  {panelDirectAction === 'login' ? (
                    <form onSubmit={handleDirectPanelLogin} className="space-y-4 text-xs font-semibold">
                      <div className="form-group pb-1">
                        <label className="form-label text-slate-600 mb-1 block">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="e.g. reseller@panel.com"
                          className="form-input text-xs py-2.5 w-full border border-slate-250 rounded-xl p-3 focus:outline-pink-500 font-medium" 
                          required 
                          value={directEmail}
                          onChange={(e) => setDirectEmail(e.target.value)}
                        />
                      </div>
      
                      <div className="form-group pb-1">
                        <label className="form-label text-slate-600 mb-1 block">Password</label>
                        <div className="relative">
                          <input 
                            type={showDirectPass ? "text" : "password"} 
                            placeholder="Enter password"
                            className="form-input text-xs py-2.5 w-full border border-slate-250 rounded-xl pl-3 pr-10 focus:outline-pink-500 font-medium" 
                            required 
                            value={directPass}
                            onChange={(e) => setDirectPass(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowDirectPass(!showDirectPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-450 hover:text-slate-600 flex items-center bg-transparent border-none cursor-pointer"
                          >
                            {showDirectPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
      
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-[11px] transition-colors shadow cursor-pointer border-none"
                      >
                        Log In
                      </button>

                      <div className="text-center mt-4 pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-450 font-bold mb-1.5">
                          {lang === 'en' ? "Want to sell products on our shop?" : "আমাদের সাইটে পণ্য বিক্রি করতে চান?"}
                        </p>
                        <button 
                          type="button"
                          onClick={() => setPanelDirectAction('register_seller')}
                          className="text-pink-600 hover:text-pink-700 font-extrabold text-[11px] underline bg-transparent border-none cursor-pointer"
                        >
                          {lang === 'en' ? "Register / Become a Seller" : "রেজিস্ট্রেশন করুন / সেলার হোন"}
                        </button>
                      </div>
                    </form>
                  ) : sellerRegStep === 'payment' ? (
                    <div className="space-y-4 text-xs font-semibold text-left p-1 animate-fade-in">
                      <div className="p-3 bg-pink-50 border border-pink-100 rounded-2xl text-[10px] leading-relaxed text-slate-700">
                        <p className="font-black text-pink-600 block mb-1">
                          📢 {lang === 'en' ? "Onboarding Setup Fee Required" : "অনবোর্ডিং পেমেন্ট নির্দেশনা"}
                        </p>
                        {lang === 'en' 
                          ? `To list your products and obtain vendor privileges, copy our account number, send BDT ${footerConfig.sellerPayAmount || 500} (${footerConfig.sellerPayValidity || '১ বছর'}), and submit the sender details below.`
                          : `সেলার অ্যাকাউন্ট সক্রিয় করতে অনুগ্রহ করে বিডিটি ${footerConfig.sellerPayAmount || 500} টাকা (${footerConfig.sellerPayValidity || '১ বছর'}) পেমেন্ট সম্পন্ন করে নিচের ফর্মটি পূরণ করুন White.`}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border space-y-1.5 font-mono text-[10px]">
                        <p className="font-extrabold text-[9px] text-slate-450 uppercase tracking-wide">
                          {lang === 'en' ? "Send Money account numbers" : "পেমেন্ট পাঠানোর অ্যাকাউন্ট সমূহ"}
                        </p>
                        {footerConfig.sellerPayNumberBKash && (
                          <div className="flex justify-between items-center"><span className="font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>bKash:</span> <span className="font-black text-slate-800 select-all">{footerConfig.sellerPayNumberBKash}</span></div>
                        )}
                        {footerConfig.sellerPayNumberNagad && (
                          <div className="flex justify-between items-center"><span className="font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>Nagad:</span> <span className="font-black text-slate-800 select-all">{footerConfig.sellerPayNumberNagad}</span></div>
                        )}
                        {footerConfig.sellerPayNumberRocket && (
                          <div className="flex justify-between items-center"><span className="font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>Rocket:</span> <span className="font-black text-slate-800 select-all">{footerConfig.sellerPayNumberRocket}</span></div>
                        )}
                        {!footerConfig.sellerPayNumberBKash && !footerConfig.sellerPayNumberNagad && !footerConfig.sellerPayNumberRocket && (
                          <p className="text-slate-400 italic font-sans">{lang === 'en' ? "Contact Admin for account number." : "অ্যাকাউন্ট নম্বরের জন্য এডমিনের সাথে যোগাযোগ করুন।"}</p>
                        )}
                      </div>

                      <form onSubmit={handleSellerPaymentSubmit} className="space-y-4">
                        <div className="form-group font-sans">
                          <label className="form-label text-slate-600 mb-1 block">{lang === 'en' ? "Payment Method" : "পেমেন্ট মাধ্যম"}</label>
                          <select 
                            className="form-input text-xs py-2 w-full border border-slate-250 bg-white rounded-xl px-3 outline-none font-bold"
                            value={sellerRegPaymentInfo.method}
                            onChange={(e) => setSellerRegPaymentInfo({ ...sellerRegPaymentInfo, method: e.target.value })}
                          >
                            <option value="bKash">bKash (বিকাশ) </option>
                            <option value="Nagad">Nagad (নগদ) </option>
                            <option value="Rocket">Rocket (রকেট) </option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="form-group font-sans">
                            <label className="form-label text-slate-600 mb-1 block">{lang === 'en' ? "Sender Phone" : "প্রেরক নাম্বার"}</label>
                            <input 
                              type="tel"
                              placeholder="017xxxxxxxx"
                              required
                              className="form-input text-xs tracking-wider font-mono py-2 w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-bold"
                              value={sellerRegPaymentInfo.senderPhone}
                              onChange={(e) => setSellerRegPaymentInfo({ ...sellerRegPaymentInfo, senderPhone: e.target.value })}
                            />
                          </div>

                          <div className="form-group font-sans">
                            <label className="form-label text-slate-600 mb-1 block">{lang === 'en' ? "Transaction ID" : "ট্রানজেকশন আইডি"}</label>
                            <input 
                              type="text"
                              placeholder="e.g. 9X29A8K2"
                              required
                              className="form-input text-xs tracking-wider uppercase font-mono py-2 w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-black select-all"
                              value={sellerRegPaymentInfo.trxId}
                              onChange={(e) => setSellerRegPaymentInfo({ ...sellerRegPaymentInfo, trxId: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-group font-sans">
                          <label className="form-label text-slate-600 mb-1 block">{lang === 'en' ? "Message to Admin" : "মেসেজ / নোট"}</label>
                          <textarea 
                            placeholder={lang === 'en' ? "Tell us any details or request..." : "পেমেন্ট সম্পর্কিত কোনো তথ্য বা নোট লিখুন..."}
                            className="form-input text-xs py-2 h-[55px] resize-none w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-semibold"
                            value={sellerRegPaymentInfo.message}
                            onChange={(e) => setSellerRegPaymentInfo({ ...sellerRegPaymentInfo, message: e.target.value })}
                          />
                        </div>

                        <div className="flex gap-2.5 font-sans">
                          <button
                            type="button"
                            onClick={() => {
                              setSellerRegStep('form');
                            }}
                            className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-xl uppercase tracking-wider text-[10px] transition-colors cursor-pointer border-none"
                          >
                            {lang === 'en' ? "Back" : "ফিরে যান"}
                          </button>
                          <button
                            type="submit"
                            className="w-2/3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-[10px] transition-colors shadow cursor-pointer border-none"
                          >
                            {lang === 'en' ? "Confirm & Submit" : "নিশ্চিত করুন"}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <form onSubmit={handleSellerRegisterDirectSubmit} className="space-y-3.5 text-xs font-semibold text-left">
                      <div className="form-group font-sans">
                        <label className="form-label text-slate-600 mb-1 block">Shop / Company Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Mubarak Electronics"
                          className="form-input text-xs py-2.5 font-bold w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-black" 
                          required 
                          value={sellerRegFields.name}
                          onChange={(e) => setSellerRegFields({ ...sellerRegFields, name: e.target.value })}
                        />
                      </div>
    
                      <div className="grid grid-cols-2 gap-3">
                        <div className="form-group font-sans">
                          <label className="form-label text-slate-600 mb-1 block">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="seller@example.com"
                            className="form-input text-xs py-2.5 w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-medium" 
                            required 
                            value={sellerRegFields.email}
                            onChange={(e) => setSellerRegFields({ ...sellerRegFields, email: e.target.value })}
                          />
                        </div>
    
                        <div className="form-group font-sans">
                          <label className="form-label text-slate-600 mb-1 block">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="017xxxxxxxx"
                            className="form-input text-xs py-2.5 w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-medium" 
                            required 
                            value={sellerRegFields.phone}
                            onChange={(e) => setSellerRegFields({ ...sellerRegFields, phone: e.target.value })}
                          />
                        </div>
                      </div>
    
                      <div className="form-group font-sans">
                        <label className="form-label text-slate-600 mb-1 block">Password Code</label>
                        <div className="relative">
                          <input 
                            type={showSellerRegPass ? "text" : "password"} 
                            placeholder="Create security password"
                            className="form-input text-xs py-2.5 w-full border border-slate-255 rounded-xl pl-3 pr-10 focus:outline-pink-505 font-bold" 
                            required 
                            value={sellerRegFields.pass}
                            onChange={(e) => setSellerRegFields({ ...sellerRegFields, pass: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSellerRegPass(!showSellerRegPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-450 hover:text-slate-600 flex items-center bg-transparent border-none cursor-pointer"
                          >
                            {showSellerRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 font-sans">
                        <div>
                          <label className="form-label text-slate-600 mb-1 block">Business Link</label>
                          <input 
                            type="text" 
                            placeholder="e.g. facebook.com/shop"
                            className="form-input text-xs py-2.5 w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-medium" 
                            value={sellerRegFields.businessPageLink || ""}
                            onChange={(e) => setSellerRegFields({ ...sellerRegFields, businessPageLink: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="form-label text-slate-600 mb-1 block">Profile URL</label>
                          <input 
                            type="text" 
                            placeholder="e.g. facebook.com/user"
                            className="form-input text-xs py-2.5 w-full border border-slate-250 rounded-xl px-3 focus:outline-pink-500 font-medium" 
                            value={sellerRegFields.profileUrl || ""}
                            onChange={(e) => setSellerRegFields({ ...sellerRegFields, profileUrl: e.target.value })}
                          />
                        </div>
                      </div>
    
                      <div className="form-group font-sans">
                        <label className="form-label text-slate-600 mb-1 block">Shop Description / Bio</label>
                        <textarea 
                          placeholder="Describe your wares..."
                          className="form-input text-xs py-2 h-[55px] resize-none w-full border border-slate-255 rounded-xl px-3 focus:outline-pink-505 font-medium" 
                          value={sellerRegFields.details}
                          onChange={(e) => setSellerRegFields({ ...sellerRegFields, details: e.target.value })}
                        />
                      </div>
    
                      <button 
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors shadow cursor-pointer border-none"
                      >
                        {lang === 'en' ? "Register Shop Account" : "শপ অ্যাকাউন্ট রেজিস্ট্রেশন করুন"}
                      </button>

                      <div className="text-center mt-4 pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-450 font-bold mb-1.5">
                          {lang === 'en' ? "Already have a merchant shop account?" : "ইতিমধ্যেই সেলার শপ অ্যাকাউন্ট রয়েছে?"}
                        </p>
                        <button 
                          type="button"
                          onClick={() => setPanelDirectAction('login')}
                          className="text-slate-600 hover:text-slate-700 font-extrabold text-[11px] underline bg-transparent border-none cursor-pointer"
                        >
                          {lang === 'en' ? "Log In Here" : "এখানে লগইন করুন"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
