/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { User, Product, Category, Order, Banner, SellerApp, Withdrawal, Customer, SpecialOffer, DeliveryCharge, FooterConfig, PopupImage, ResellerPageConfig, ResellerSubscriptionOption, ResellerFAQ, ResellerBenefitCard, AdvanceConfig, PaymentChannel, PromoCode } from './types';
import { initialUsers, initialProducts, initialCategories, initialBanners, initialOrders, initialSpecialOffers, initialResellerPageConfig, initialResellerSubscriptions, initialResellerBenefits, initialResellerFAQs } from './data';

import CustomerStore from './components/CustomerStore';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';

const initialDeliveryCharges: DeliveryCharge[] = [
  { id: 'dc_1', district: 'Dhaka City', charge: 60 },
  { id: 'dc_2', district: 'Chittagong City', charge: 100 },
  { id: 'dc_3', district: 'Sylhet City', charge: 120 },
  { id: 'dc_4', district: 'Gazipur', charge: 80 },
  { id: 'dc_5', district: 'Narayanganj', charge: 80 },
  { id: 'dc_6', district: 'Suburban / Outer Districts (All Other locations)', charge: 150 }
];

const initialFooterConfig: FooterConfig = {
  aboutUs: "Welcome to Dealy Distribution, Bangladesh's leading standard reselling and wholesale distribution network. We provide curated, high-margin, top-tier products to help our resellers start businesses with zero investment.",
  facebook: "https://facebook.com/dealydistribution",
  youtube: "https://youtube.com/dealydistribution",
  contactEmail: "support@dealy.com",
  contactPhone: "+8801711223344",
  privacyPolicy: "We value customer trust and guarantee safe warehousing, quality checks, and real-time logistics tracking parameters, protecting your business data integrity.",
  joinResellerBanner: "Start your independent reselling journey today. Place orders, track active commission payouts, and boost family earnings with zero stock load.",
  brandLogoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  customLinks: [
    { name: "Official WhatsApp Support Helpline", url: "https://wa.me/8801735165971" },
    { name: "Official Telegram Channel Hub", url: "https://t.me/dealydistribution" },
    { name: "Resellers Facebook Community Group", url: "https://facebook.com/dealydistribution" },
    { name: "YouTube Tutorials & Trainings Channel", url: "https://youtube.com/dealydistribution" }
  ]
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
  // Global Persisted States with lazy initializers for flawless loading
  const [panelRole, setPanelRole] = useState<'admin' | 'user' | null>(() => {
    try {
      const saved = localStorage.getItem('orivian_v4_role');
      return saved ? (JSON.parse(saved) as 'admin' | 'user') : null;
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
      return saved ? JSON.parse(saved) : initialUsers;
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

  useEffect(() => {
    try {
      localStorage.setItem('orivian_v4_promos', JSON.stringify(promoCodes));
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [promoCodes]);



  // Notifications state
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showDirectLogin, setShowDirectLogin] = useState(false);
  const [directEmail, setDirectEmail] = useState('');
  const [directPass, setDirectPass] = useState('');

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
      id: 'c_' + Date.now()
    };
    setCustomers(prev => [...prev, nextCust]);
    setLoggedCustomer(nextCust);
    showNotif('Account Registered. Enjoy pre-filled checkout shipping.', 'success');
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

    setPanelRole(matched.role);
    setCurrentUser(matched);
    setShowDirectLogin(false);
    setDirectEmail('');
    setDirectPass('');
    showNotif(`Logged in successfully as ${matched.name}.`, 'success');
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
            advanceConfig={advanceConfig}
            setAdvanceConfig={setAdvanceConfig}
            promoCodes={promoCodes}
            setPromoCodes={setPromoCodes}
            onLogout={handlePanelLogout}
            showNotif={showNotif}
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
            onLogout={handlePanelLogout}
            showNotif={showNotif}
          />
        ) : (
          <CustomerStore 
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
            showNotif={showNotif}
            openPanelLogin={() => setShowDirectLogin(true)}
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
              className="bg-white rounded-3xl shadow-2xl relative w-full h-auto z-10 p-6 text-slate-800 max-w-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6 pb-2.5 border-b">
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-none">Console Login</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Log in as our reseller partner or administrator</p>
                </div>
                <button onClick={() => setShowDirectLogin(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDirectPanelLogin} className="space-y-4 text-xs font-semibold">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. reseller@panel.com"
                    className="form-input text-xs py-2.5" 
                    required 
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                  />
                  <p className="text-[9px] text-slate-400 mt-1 font-medium select-none flex flex-wrap gap-1">
                    <span>Admin: <b className="text-indigo-600">admin@panel.com</b></span>
                    <span>|</span>
                    <span>Reseller: <b className="text-indigo-600">reseller@panel.com</b></span>
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter password"
                    className="form-input text-xs py-2.5" 
                    required 
                    value={directPass}
                    onChange={(e) => setDirectPass(e.target.value)}
                  />
                  <p className="text-[9px] text-slate-400 mt-1 font-medium select-none">
                    Default password is: <b className="text-indigo-600">123</b>
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors shadow cursor-pointer"
                >
                  Log In
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
