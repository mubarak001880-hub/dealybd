import { Product, Category, User, Banner, Order, SpecialOffer, ResellerPageConfig, ResellerSubscriptionOption, ResellerFAQ, ResellerBenefitCard, FlashOfferSetting } from './types';


export const initialCategories: Category[] = [
  { id: 'cat1', name: 'SMART CLOCKS' },
  { id: 'cat2', name: 'AURORA LAMPS' },
  { id: 'cat3', name: 'LUXE HOME DECOR' },
  { id: 'cat4', name: 'MINIMALIST SOUND' },
  { id: 'cat_eid', name: 'EID SPECIAL SELECTIONS' },
  { id: 'cat_free', name: 'ZERO COST EXPRESS DEALS' },
  { id: 'cat_flash', name: 'HOT FLASH DEALS' }
];

export const initialProducts: Product[] = [
  {
    id: 'p1',
    catId: 'cat1',
    name: 'CASIFY G3 Mini Ambient Smart Light & Alarm',
    description: 'A luxurious multi-function smart clock and bedside light. Customize RGB sleep cycles, play high-fidelity nature ambient noise, and power quick Qi wireless charges simultaneously.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    originalPrice: 2400,
    discountPrice: 1999,
    buyRate: 1400,
    minSellRate: 1800,
    defaultSellRate: 2100,
    rating: 4.8,
    sales: 1142,
    inStock: true,
    isFlash: true,
    colors: ['Pearl White', 'Matte Black', 'Lotus Pink']
  },
  {
    id: 'p2',
    catId: 'cat2',
    name: 'Ducky Glow Soft Silicon Bedroom Night Light',
    description: 'Charming duck-shaped warm LED night light made from safe, BPA-free soft silicone. Features tap-to-dim controls and long-lasting 1200mAh battery life for serene overnight glow.',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    originalPrice: 1200,
    discountPrice: 899,
    buyRate: 500,
    minSellRate: 750,
    defaultSellRate: 950,
    rating: 4.9,
    sales: 832,
    inStock: true,
    isFlash: false,
    colors: ['Butter Yellow', 'Blush Apricot']
  },
  {
    id: 'p3',
    catId: 'cat3',
    name: 'Dealy Glass Prism Hourglass Pendant Decor',
    description: 'An elegant architectural handblown glass sculpture filled with fine golden metallic stardust. Watch time flow through cascading orbits, creating a sophisticated desktop centerpiece.',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
    originalPrice: 3800,
    discountPrice: 2850,
    buyRate: 1900,
    minSellRate: 2400,
    defaultSellRate: 3100,
    rating: 4.7,
    sales: 420,
    inStock: true,
    isFlash: false,
    colors: ['Champagne Gold', 'Cosmic Silver']
  },
  {
    id: 'p4',
    catId: 'cat4',
    name: 'Sleek Wood Block Wireless Induction Speaker',
    description: 'Crafted from a single contiguous block of dark premium walnut wood, this luxury induction speaker amplifies mobile sound natively with zero bluetooth pairing or physical wires needed.',
    img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    originalPrice: 4200,
    discountPrice: 3500,
    buyRate: 2600,
    minSellRate: 3100,
    defaultSellRate: 3800,
    rating: 4.6,
    sales: 310,
    inStock: true,
    isFlash: true,
    colors: ['Walnut', 'Oak Wood']
  },
  {
    id: 'p_eid_1',
    catId: 'cat_eid',
    name: 'Dealy Royal Gilded Rose Table Lamp',
    description: 'An exquisite gold-gilded metallic rose encrusted within premium tempered glass. Projects shimmering floral light patterns across bedrooms, ideal for festive celebrations.',
    img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
    originalPrice: 3200,
    discountPrice: 2499,
    buyRate: 1500,
    minSellRate: 1900,
    defaultSellRate: 2300,
    rating: 4.9,
    sales: 45,
    inStock: true,
    isFlash: false,
    colors: ['Gilded Rose', 'Amber Gold']
  },
  {
    id: 'p_free_1',
    catId: 'cat_free',
    name: 'Dealy Floating Magnetic Moon Lamp Hub',
    description: 'A levitating 3D printed moon replica rotating seamlessly above a dark solid walnut wood dock. Features wireless inductive power Transfer technology.',
    img: 'https://images.unsplash.com/photo-1532926381893-754475a7ef25?w=500&q=80',
    originalPrice: 4800,
    discountPrice: 4100,
    buyRate: 3000,
    minSellRate: 3500,
    defaultSellRate: 3950,
    rating: 4.7,
    sales: 120,
    inStock: true,
    isFlash: false,
    colors: ['Warm Yellow', 'Lunar White']
  },
  {
    id: 'p_flash_1',
    catId: 'cat_flash',
    name: 'Dealy Retro Wood Cabinet Desk Radio Clock',
    description: 'Premium mini desk clock with Bluetooth radio functionality, wrapped inside vintage solid birchwood cabinet panels. Experience raw authentic acoustic soundscapes.',
    img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&q=80',
    originalPrice: 3600,
    discountPrice: 2200,
    buyRate: 1400,
    minSellRate: 1800,
    defaultSellRate: 2150,
    rating: 4.8,
    sales: 195,
    inStock: true,
    isFlash: false,
    colors: ['Birch Wood', 'Piano Black']
  }
];

export const initialSpecialOffers: SpecialOffer[] = [
  {
    id: 'so1',
    badge: 'CAMPAIGN',
    title: 'EID SPECIAL',
    desc: 'Direct shipping cuts',
    actionText: 'EID OFFER',
    themeColor: 'cyan',
    catId: 'cat_eid'
  },
  {
    id: 'so2',
    badge: 'ACTIVE',
    title: 'ZERO COST EXPRESS',
    desc: 'Prepaid reward gift',
    actionText: 'FREE DELIVERY',
    themeColor: 'orange',
    catId: 'cat_free'
  },
  {
    id: 'so3',
    badge: 'HOT',
    title: 'FLASH CLEARANCE',
    desc: 'Direct 40% margin',
    actionText: 'HOT DEALS',
    themeColor: 'pink',
    catId: 'cat_flash'
  }
];


export const initialBanners: Banner[] = [
  {
    id: 'b1',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    isActive: true
  }
];

export const initialResellerBanners: Banner[] = [
  {
    id: 'rb1',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    isActive: true,
    link: 'https://wa.me/8801735165971'
  }
];

export const initialUsers: User[] = [
  {
    id: 'admin1',
    name: 'Dealy Executive Partner',
    email: 'mubarak06199@gmail.com',
    pass: 'HRidoy009@@', // Will be hashed via simple password check or compared directly
    role: 'admin',
    idCode: 'ADMIN-001',
    banned: false,
    balance: 85200,
    kyc: { status: 'verified' },
    activities: []
  },
  {
    id: 'reseller1',
    name: 'Tasnim Ahmed',
    email: 'reseller@panel.com',
    pass: '123',
    role: 'user',
    idCode: 'RES-8326',
    banned: false,
    balance: 4500,
    kyc: {
      status: 'verified',
      nidName: 'Tasnim Ahmed',
      nidNumber: '8274631245',
      dob: '1995-10-14',
      frontImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'
    },
    subscriptionExpiresAt: '2026-08-07',
    activities: [
      {
        id: 'act1',
        date: '2026-05-19 14:32',
        type: 'profit',
        desc: 'Delivered: Sound Block Speaker to Riad Hasan',
        amount: 700
      },
      {
        id: 'act2',
        date: '2026-05-20 09:12',
        type: 'withdraw',
        desc: 'Withdrawal to bKash Approved',
        amount: 1500
      }
    ]
  },
  {
    id: 'reseller2',
    name: 'Sabbir Hossain',
    email: 'sabbir@panel.com',
    pass: '123',
    role: 'user',
    idCode: 'RES-9014',
    banned: false,
    balance: 0,
    kyc: { status: 'pending', nidName: 'Sabbir Hossain', nidNumber: '9218374623', dob: '1998-04-20', frontImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', backImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
    subscriptionExpiresAt: '2026-06-30',
    activities: []
  }
];

export const generateTrackingId = (): string => {
  const num = Math.floor(100000 + Math.random() * 900000);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const last = chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
  return `DLY-${num}-${last}`;
};

export const createInitialTimeline = (dateStr: string): any[] => {
  return [
    { status: 'Pending', date: dateStr, description: 'Order created successfully. Awaiting seller processing.', isCompleted: true },
    { status: 'Approved', date: '', description: 'Order reviewed and confirmed by Dealy partner.', isCompleted: false },
    { status: 'Processing', date: '', description: 'Package is wrapped, quality-verified, and sorted in hub.', isCompleted: false },
    { status: 'Shipped', date: '', description: 'Dispatched with local express service. Tracking code active.', isCompleted: false },
    { status: 'Delivered', date: '', description: 'Parcel delivered successfully to custom destination.', isCompleted: false }
  ];
};

export const initialOrders: Order[] = [
  {
    id: 'o_demo1',
    trackingId: 'DLY-723519-TX',
    type: 'reseller',
    userId: 'reseller1',
    productName: 'CASIFY G3 Mini Ambient Smart Light & Alarm (x1)',
    prodImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    qty: 1,
    color: 'Pearl White',
    sellRate: 2100,
    buyRate: 1400,
    profit: 700,
    amount: 2100,
    custName: 'Kamal Uddin',
    custPhone: '01712345678',
    custAddress: 'House 12, Road 4, Sector 7, Uttara, Dhaka',
    status: 'Delivered',
    date: '2026-05-18 10:20',
    timeline: [
      { status: 'Pending', date: '2026-05-18 10:20', description: 'Order created successfully. Awaiting seller processing.', isCompleted: true },
      { status: 'Approved', date: '2026-05-18 13:45', description: 'Order reviewed and confirmed by Dealy partner.', isCompleted: true },
      { status: 'Processing', date: '2026-05-18 16:30', description: 'Package is wrapped, quality-verified, and sorted in hub.', isCompleted: true },
      { status: 'Shipped', date: '2026-05-19 09:00', description: 'Dispatched with local DHL Express. Tracking code: DHL-DLY-3914.', isCompleted: true },
      { status: 'Delivered', date: '2026-05-19 14:30', description: 'Parcel delivered successfully to Kamal Uddin.', isCompleted: true }
    ]
  },
  {
    id: 'o_demo2',
    trackingId: 'DLY-891024-AQ',
    type: 'customer',
    productName: 'Sleek Wood Block Wireless Induction Speaker (x1)',
    prodImg: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    qty: 1,
    color: 'Walnut',
    sellRate: 3500,
    profit: 0,
    amount: 3500,
    custName: 'Sharmin Ara',
    custPhone: '01898765432',
    custAddress: 'Plot 4, Banani Block E, Road 11, Dhaka',
    status: 'Shipped',
    date: '2026-05-20 15:45',
    timeline: [
      { status: 'Pending', date: '2026-05-20 15:45', description: 'Order created successfully. Awaiting verification.', isCompleted: true },
      { status: 'Approved', date: '2026-05-20 18:20', description: 'Order reviewed and approved.', isCompleted: true },
      { status: 'Processing', date: '2026-05-21 08:30', description: 'Package wrapped and quality checks complete.', isCompleted: true },
      { status: 'Shipped', date: '2026-05-21 10:10', description: 'Package transferred to Pathao Courier. Delivery in transit.', isCompleted: true },
      { status: 'Delivered', date: '', description: 'Parcel delivered successfully to custom destination.', isCompleted: false }
    ]
  },
  {
    id: 'o_demo3',
    trackingId: 'DLY-401923-LM',
    type: 'reseller',
    userId: 'reseller1',
    productName: 'Ducky Glow Soft Silicon Bedroom Night Light (x2)',
    prodImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    qty: 2,
    color: 'Butter Yellow',
    sellRate: 950,
    buyRate: 500,
    profit: 900, // 2 * (950 - 500)
    amount: 1900,
    custName: 'Tanvir Rahman',
    custPhone: '01511223344',
    custAddress: 'Miah Bari Road, Nasirabad, Chattogram',
    status: 'Pending',
    date: '2026-05-21 11:20',
    timeline: [
      { status: 'Pending', date: '2026-05-21 11:20', description: 'Order created successfully. Awaiting seller processing.', isCompleted: true },
      { status: 'Approved', date: '', description: 'Order reviewed and confirmed by Dealy partner.', isCompleted: false },
      { status: 'Processing', date: '', description: 'Package is wrapped, quality-verified, and sorted in hub.', isCompleted: false },
      { status: 'Shipped', date: '', description: 'Dispatched with local express service. Tracking code active.', isCompleted: false },
      { status: 'Delivered', date: '', description: 'Parcel delivered successfully to custom destination.', isCompleted: false }
    ]
  }
];

export const initialResellerPageConfig: ResellerPageConfig = {
  title: 'বিনা পুঁজিতে ব্যবসা শুরু হোক MayonsBd এর সাথে।',
  subtitle: 'একটি ইন্টারনেট কানেক্টেড ডিভাইস আপনার হাতের মোবাইল ফোন দিয়ে ব্যবসা শুরু করতে পারবেন বাংলাদেশের সেরা রিসেলিং প্লাটফর্ম MayonsBd এর সাথে।',
  videoUrl: 'https://www.youtube.com/embed/Mce9Wsh4uAw',
  registerBtnText: 'এখনি রেজিস্ট্রেশন করুন ➔',
  bannerNotice: '২৮০০+ রিসেলার ইতিমধ্যে আমাদের সাথে পথচলা শুরু করেছে।',
  sectionsHeadline: 'কেন আমাদের সাথে রি-সেল করবেন?',
  founderName: 'Saiful Islam Badhon',
  founderTitle: 'Founder Of Radhon\'s World & MayonsBd',
  founderPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
  founderMsg: 'আমি সাইফুল ইসলাম বাঁধন, Radhon\'s World এবং MayonsBd এর প্রতিষ্ঠাতা। একজন ই-কমার্স উদ্যোক্তা হিসেবে আমি নতুন রিসেলার ও উদ্যোক্তাদের পাশে থাকার প্রত্যয় নিয়ে কাজ করছি। বিগত বছরগুলোতে আমি বহু তরুণ উদ্যোক্তাকে সফল করার পথে সহায়তা দিয়েছি।'
};

export const initialResellerSubscriptions: ResellerSubscriptionOption[] = [
  {
    id: 'sub1',
    name: 'Advance Business Booster',
    price: '3000',
    duration: '2 YEARS',
    features: [
      '২ বছরের মেন্টর এভেইলিবিলিটি প্রোগ্রাম',
      'প্রিমিয়াম ড্রপশিপিং সায়েন্স',
      'রিসেলার টু বিজনেস ট্রান্সফরমেশন',
      'মিডিয়াম রেভেণ্যু বাজেট',
      'সার্টিফিকেট + কাস্টম ব্রান্ডিং',
      'পার্টনারশিপ এক্সেস',
      'এফিলিয়েট সিস্টেম ফ্রি',
      'সাথে থাকছে Package 1 এর সব সুবিধা'
    ],
    isActive: true
  },
  {
    id: 'sub2',
    name: 'Premium',
    price: '2000',
    duration: '1 YEAR',
    features: [
      'রিসেলিং গাইডলাইন',
      'এক্সক্লুসিভ HD ভিডিও ও রিসোর্স',
      '২৪ ঘণ্টা সাপোর্ট সিস্টেম',
      '১২ মাসের এক্সেস',
      'কাস্টম পেজ',
      'সুবিধা ও অফার রুটিন (বিকাশ, রকেট)',
      'লাইভ চ্যাটিং সাপোর্ট',
      'কমিউনিটি মেম্বারশিপ',
      'বোনাস ও অফার',
      'প্রতি মাসে ৩টা লাইভ ক্লাস'
    ],
    isActive: true
  }
];

export const initialResellerBenefits: ResellerBenefitCard[] = [
  {
    id: 'b1',
    title: 'রেজিস্ট্রেশন করুন',
    desc: 'রেজিস্ট্রেশন ফি প্রদান করে একজন প্রফেশনাল রিসেলার হিসেবে পথ চলা শুরু করবেন কাস্টম এক্সেসের মাধ্যমে।',
    iconName: 'UserCheck'
  },
  {
    id: 'b2',
    title: 'নিজস্ব ব্র্যান্ড তৈরি করুন',
    desc: 'আপনার নিজস্ব ব্র্যান্ড লোগো এবং আলাদা সোশ্যাল মিডিয়া একাউন্টস ক্রিয়েট করে সহজে মার্কেটিং করুন।',
    iconName: 'Award'
  },
  {
    id: 'b3',
    title: 'ক্রিয়েটিং এবং ১০০০+ প্রোডাক্টের এক্সেস নিন',
    desc: 'প্রতি সপ্তাহে ২/৩ টি লাইভ এবং মেম্বারদের জন্য এক্সক্লুসিভ এইচডি ক্যাটাগরির ভিডিও দেওয়া হবে।',
    iconName: 'Layers'
  },
  {
    id: 'b4',
    title: 'অর্ডার সংগ্রহ করুন',
    desc: 'কাস্টমারদের কাছ থেকে অর্ডার নিন এবং আমাদের তথ্য দিয়ে bdfrontworld-এ অর্ডার প্লেস করবেন।',
    iconName: 'ShoppingBag'
  },
  {
    id: 'b5',
    title: 'ডেলিভারি এবং ইনভয়েসিং',
    desc: 'আমাদের কাস্টম নাম, লোগো ও ইনফরমেশন ছাড়াই পণ্য পৌঁছে যাবে আপনার কাস্টমারের দ্বারে।',
    iconName: 'Truck'
  },
  {
    id: 'b6',
    title: 'কমিশন অর্জন করুন',
    desc: 'প্রতিটি সফল ডেলিভারির পর আপনার প্রফিট বা কমিশন যুক্ত হয়ে যাবে আপনার ওয়ালেটে।',
    iconName: 'DollarSign'
  }
];

export const initialResellerFAQs: ResellerFAQ[] = [
  {
    id: 'f1',
    question: 'রেজিস্ট্রেশন করতে কি কোনো ফি লাগবে?',
    answer: 'হ্যাঁ, আমাদের সিকিউর এবং প্রিমিয়াম রিসেলার প্লাটফর্মে জয়েন করতে যেকোনো একটি প্যাকেজ সাবস্ক্রাইব করতে হবে।'
  },
  {
    id: 'f2',
    question: 'পণ্য আমি নিজে ডেলিভারি করব নাকি আপনারা?',
    answer: 'ডেলিভারির সম্পূর্ণ ঝক্কি-ঝামেলা আমাদের। আপনি শুধু অর্ডার প্লেস করবেন, পণ্য কাস্টমারের হাতে পৌঁছে দিয়ে পেমেন্ট নেওয়ার পর আপনার কমিশন ওয়ালেটে পাঠিয়ে দেওয়া হবে।'
  },
  {
    id: 'f3',
    question: 'আমাদের নিজস্ব কোন ব্র্যান্ড কাস্টমার দেখতে পাবে?',
    answer: 'না, কাস্টমার আমাদের নাম বা লোগো দেখবে না। আমরা কাস্টম ইনভয়েসে আপনার ব্র্যান্ড বা আপনার নাম ব্যবহার করতে পারি।'
  },
  {
    id: 'f4',
    question: 'কমিশন কত শতাংশ?',
    answer: 'প্রতিটি পণ্যের রিসেলার বায়িং রেট নির্ধারণ করা থাকে। আপনি এই রেটের চেয়ে বেশি মূল্যে কাস্টমার-এর কাছে বিক্রি করে পুরো লাভটি কমিশন হিসেবে রাখতে পারবেন।'
  },
  {
    id: 'f5',
    question: 'কিভাবে টাকা উত্তোলন করব?',
    answer: 'আপনার অ্যাকাউন্ট ব্যালেন্স থেকে বিকাশ, রকেট বা যেকোনো পেমেন্ট মেথড সিলেক্ট করে উইথড্রয়াল রিকোয়েস্ট পাঠাতে পারবেন।'
  }
];

export const initialFlashOfferSettings: FlashOfferSetting[] = [
  {
    id: 'f_disc',
    name: 'Flash Discount Banner',
    type: 'discount',
    value: '-23% OFF',
    isActive: true,
    textColor: '#1a1a1a',
    bgColor: '#fbbf24'
  },
  {
    id: 'f_deliv',
    name: 'Free Delivery Tag',
    type: 'free_delivery',
    value: 'FREE DELIVERY',
    isActive: true,
    textColor: '#ffffff',
    bgColor: '#10b981'
  },
  {
    id: 'f_bogo',
    name: 'Buy One Get One Deal',
    type: 'bogo',
    value: 'BOGO (Buy 1 Get 1)',
    isActive: false,
    textColor: '#ffffff',
    bgColor: '#ec4899'
  }
];


