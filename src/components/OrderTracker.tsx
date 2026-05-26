import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Clock, CheckCircle, Package, Truck, MapPin, AlertCircle, X, ChevronRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerProps {
  orders: Order[];
  onTrackClose?: () => void;
  defaultTrackingId?: string;
  embedded?: boolean;
}

export default function OrderTracker({ orders, onTrackClose, defaultTrackingId = '', embedded = false }: OrderTrackerProps) {
  const [searchId, setSearchId] = useState(defaultTrackingId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    defaultTrackingId ? orders.find(o => o.trackingId.toLowerCase() === defaultTrackingId.toLowerCase()) || null : null
  );
  const [errorMess, setErrorMess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setErrorMess('');
    
    // Simulate a premium database/warehouse API search lookup
    setTimeout(() => {
      const found = orders.find(
        o => o.trackingId.trim().toUpperCase() === searchId.trim().toUpperCase() ||
             o.id.trim().toUpperCase() === searchId.trim().toUpperCase() ||
             o.custPhone.trim() === searchId.trim()
      );
      
      setIsLoading(false);
      if (found) {
        setSearchedOrder(found);
      } else {
        setSearchedOrder(null);
        setErrorMess('No record found for this tracking ID, order ID, or phone number. Verify your details and try again.');
      }
    }, 600);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-indigo-500" />;
      case 'Processing':
        return <Package className="w-5 h-5 text-pink-500" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-sky-500" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Approved': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Processing': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Shipped': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getTimelineStepIcon = (status: OrderStatus, completed: boolean) => {
    const cls = completed ? "w-8 h-8 rounded-full flex items-center justify-center text-white" : "w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 border border-slate-200";
    
    let bg = "bg-slate-300";
    if (completed) {
      if (status === 'Pending') bg = "bg-amber-500 shadow-md shadow-amber-500/20";
      else if (status === 'Approved') bg = "bg-indigo-500 shadow-md shadow-indigo-500/20";
      else if (status === 'Processing') bg = "bg-pink-500 shadow-md shadow-pink-500/20";
      else if (status === 'Shipped') bg = "bg-sky-500 shadow-md shadow-sky-500/20";
      else if (status === 'Delivered') bg = "bg-emerald-500 shadow-md shadow-emerald-500/20";
    }

    switch (status) {
      case 'Pending': return <div className={`${cls} ${bg}`}><Clock className="w-4 h-4" /></div>;
      case 'Approved': return <div className={`${cls} ${bg}`}><CheckCircle className="w-4 h-4" /></div>;
      case 'Processing': return <div className={`${cls} ${bg}`}><Package className="w-4 h-4" /></div>;
      case 'Shipped': return <div className={`${cls} ${bg}`}><Truck className="w-4 h-4" /></div>;
      case 'Delivered': return <div className={`${cls} ${bg}`}><CheckCircle className="w-4 h-4" /></div>;
    }
  };

  const getEstimatedArrival = (order: Order) => {
    if (order.status === 'Delivered') return 'Package Delivered';
    if (order.status === 'Shipped') return 'Estimated Arrival: 1-2 Days';
    if (order.status === 'Processing') return 'Estimated Dispatch: Tomorrow';
    return 'Estimated Delivery: 3-5 Business Days';
  };

  const containerContent = (
    <div className="w-full">
      {!embedded && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Dealy Logistics Tracker</h2>
            <p className="text-xs text-slate-400">Scan real-time warehousing and delivery status instantly</p>
          </div>
          {onTrackClose && (
            <button 
              onClick={onTrackClose} 
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleTrackSubmit} className="mb-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Enter Tracking ID, Order ID, or Phone Number
        </label>
        <div className="relative flex">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            placeholder="e.g. ORV-723519-TX or 01712345678"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !searchId.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center shadow"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
        {errorMess && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-3 flex gap-2 items-start bg-red-50 text-red-700 px-3.5 py-2.5 rounded-xl border border-red-100 text-xs"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMess}</span>
          </motion.div>
        )}
      </form>

      {/* Lookup Result Panel */}
      <AnimatePresence mode="wait">
        {searchedOrder ? (
          <motion.div
            key={searchedOrder.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-md"
          >
            {/* Header Badge Row */}
            <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">SECURE ORDER DETAILS</span>
                <h3 className="font-extrabold text-lg tracking-tight flex items-center gap-2">
                  {searchedOrder.trackingId}
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white/95 font-semibold">
                    {searchedOrder.type.toUpperCase()}
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(searchedOrder.status)}`}>
                  {searchedOrder.status}
                </span>
                <p className="text-[10px] text-slate-300 mt-1">{getEstimatedArrival(searchedOrder)}</p>
              </div>
            </div>

            {/* Product Meta Row */}
            <div className="p-5 border-b border-slate-50 flex gap-4 bg-slate-50/50">
              {searchedOrder.prodImg && (
                <img 
                  src={searchedOrder.prodImg} 
                  alt={searchedOrder.productName} 
                  className="w-14 h-14 rounded-lg object-contain bg-white border p-1"
                />
              )}
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                  {searchedOrder.productName}
                </h4>
                {searchedOrder.color && (
                  <p className="text-xs text-slate-400 font-medium">Color: {searchedOrder.color}</p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Retail Price: <b className="text-indigo-600">৳{searchedOrder.sellRate}</b>
                  </span>
                  <span className="text-[10px] text-slate-400">Placed: {searchedOrder.date}</span>
                </div>
              </div>
            </div>

            {/* Customer Delivery Details */}
            <div className="p-5 border-b border-slate-50 bg-white grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-slate-700">Delivery Recipient</h5>
                  <p className="text-slate-600 font-medium mt-0.5">{searchedOrder.custName}</p>
                  <p className="text-slate-400 font-mono mt-0.5">{searchedOrder.custPhone}</p>
                </div>
              </div>
              <div>
                <h5 className="font-bold text-slate-700">Shipping Destination Address</h5>
                <p className="text-slate-500 mt-0.5 font-medium leading-relaxed">
                  {searchedOrder.custAddress}
                </p>
              </div>
            </div>

            {/* Advance payment secure signals */}
            {searchedOrder.advancePaid && searchedOrder.advancePaid > 0 ? (
              <div className="px-5 py-3 border-b border-emerald-100 bg-emerald-50/40 flex items-center justify-between text-xs text-emerald-800 font-medium">
                <span className="font-extrabold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Advance Authenticated
                </span>
                <span className="font-black font-mono">
                  ৳{searchedOrder.advancePaid} via <b className="uppercase bg-emerald-100/60 px-1 py-0.5 rounded text-[10px]">{searchedOrder.paymentMethod || 'Channel'}</b> {searchedOrder.txId && `(TxID: ${searchedOrder.txId})`}
                </span>
              </div>
            ) : null}

            {/* Timeline Progress */}
            <div className="p-5 bg-white">
              <h5 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">Milestone Progress Log</h5>
              
              <div className="relative pl-1">
                {/* Connecting track line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-100 z-0"></div>
                
                {/* Timeline events */}
                <div className="space-y-6 relative z-10">
                  {searchedOrder.timeline.map((event, idx) => {
                    const isLast = idx === searchedOrder.timeline.length - 1;
                    return (
                      <div key={idx} className="flex gap-4 items-start group">
                        {/* Status Ball */}
                        {getTimelineStepIcon(event.status, event.isCompleted)}

                        {/* Content text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap justify-between items-baseline gap-1.5">
                            <h6 className={`font-bold text-sm ${event.isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                              {event.status}
                            </h6>
                            {event.date && (
                              <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                                {event.date}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${event.isCompleted ? 'text-slate-500 font-medium' : 'text-slate-400/80 line-clamp-1'}`}>
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          !errorMess && !isLoading && (
            <div className="text-center py-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">Awaiting Tracking Identifier</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Enter your order ID or phone number above to pull deep shipment records from our centralized system.
              </p>
            </div>
          )
        )}
      </AnimatePresence>
    </div>
  );

  if (embedded) {
    return containerContent;
  }

  // Regular dashboard modal popup
  return (
    <div className="p-6 max-h-[85vh] overflow-y-auto">
      {containerContent}
    </div>
  );
}
