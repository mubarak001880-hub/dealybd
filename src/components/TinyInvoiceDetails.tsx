import React from 'react';
import { Download, Printer } from 'lucide-react';
import { getDhakaDate, formatToDhakaTime, formatToDhakaDateOnly } from '../dateUtils';

interface TinyInvoiceDetailsProps {
  order: {
    id: string;
    trackingId: string;
    productName: string;
    qty: number;
    color?: string;
    amount: number;
    custName: string;
    custPhone: string;
    custAddress: string;
    status: string;
    date: string;
    paymentMethod?: string;
    txId?: string;
    sellerName?: string;
    originalPrice?: number;
    promoDiscountApplied?: number;
    promoCodeUsed?: string;
    affiliateDiscountApplied?: number;
    shippingChargeApplied?: number;
  };
}

export const TinyInvoiceDetails: React.FC<TinyInvoiceDetailsProps> = ({ order }) => {
  const originalPrice = order.originalPrice || (order.amount + (order.promoDiscountApplied || 0) + (order.affiliateDiscountApplied || 0) - (order.shippingChargeApplied || 0));
  const hasDetails = !!(order.promoDiscountApplied || order.affiliateDiscountApplied || order.shippingChargeApplied);

  const triggerDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const trackingId = order.trackingId || 'N/A';
    const custName = order.custName || 'Valued Customer';
    const custPhone = order.custPhone || 'N/A';
    const custAddress = order.custAddress || 'N/A';
    const paymentMethod = order.paymentMethod || 'COD';
    const txId = order.txId || '';
    const dateStr = order.date || formatToDhakaDateOnly();
    const productName = order.productName || 'Product Item';
    const qty = order.qty || 1;
    const colorSelected = order.color || '';
    const sellerStore = order.sellerName || '';
    const statusLabel = order.status || 'Pending';

    const baseItemPrice = originalPrice - (order.shippingChargeApplied || 0) + (order.promoDiscountApplied || 0) + (order.affiliateDiscountApplied || 0);

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice - ${trackingId}</title>
<style>
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #1e293b;
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
  }
  .actions-bar {
    max-width: 800px;
    margin: 20px auto 0 auto;
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;
  }
  .btn-print {
    background-color: #f43f5e;
    color: #ffffff;
    border: none;
    padding: 10px 22px;
    font-size: 13.5px;
    font-weight: 800;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.25);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }
  .btn-print:hover {
    background-color: #e11d48;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(244, 63, 94, 0.35);
  }
  .invoice-card {
    max-width: 800px;
    margin: 20px auto 40px auto;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
    padding: 40px;
    box-sizing: border-box;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 24px;
    margin-bottom: 30px;
  }
  .company-title {
    font-size: 26px;
    font-weight: 800;
    color: #f43f5e;
    margin: 0 0 6px 0;
    letter-spacing: -0.03em;
  }
  .invoice-label {
    font-size: 30px;
    font-weight: 900;
    color: #0f172a;
    text-transform: uppercase;
    margin: 0;
    letter-spacing: 0.05em;
    text-align: right;
  }
  .stamp {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 805;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-top: 10px;
  }
  .stamp-pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
  .stamp-approved { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .stamp-processing { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
  .stamp-shipped { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
  .stamp-delivered { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .stamp-cancelled { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
  .stamp-returned { background: #f9fafb; color: #374151; border: 1px solid #e5e7eb; }

  .meta-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 30px;
    margin-bottom: 35px;
  }
  .section-title {
    font-size: 11px;
    font-weight: 900;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 10px 0;
    border-bottom: 2.5px solid #f1f5f9;
    padding-bottom: 6px;
  }
  .detail-block p {
    margin: 0 0 6px 0;
    font-size: 13.5px;
    line-height: 1.45;
  }
  .detail-label {
    color: #64748b;
    font-weight: 600;
  }
  .detail-value {
    color: #0f172a;
    font-weight: 700;
  }
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 35px;
  }
  .items-table th {
    background: #f8fafc;
    color: #475569;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
    padding: 14px 16px;
    border-bottom: 2.5px solid #e2e8f0;
  }
  .items-table td {
    padding: 16px;
    border-bottom: 1.5px solid #f1f5f9;
    font-size: 14px;
    color: #334155;
  }
  .totals-container {
    max-width: 340px;
    margin-left: auto;
    font-size: 13.5px;
    background: #fafafa;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    padding: 16px;
    box-sizing: border-box;
  }
  .totals-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
  }
  .totals-row.grand-total {
    border-top: 2px dashed #cbd5e1;
    margin-top: 10px;
    padding-top: 12px;
    font-size: 19px;
    font-weight: 900;
    color: #0f172a;
  }
  .foot-notes {
    text-align: center;
    font-size: 11px;
    color: #94a3b8;
    margin-top: 60px;
    border-top: 2px solid #f1f5f9;
    padding-top: 24px;
    line-height: 1.5;
  }

  @media (max-width: 600px) {
    .invoice-card {
      padding: 24px;
      margin: 10px;
    }
    .meta-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .invoice-label {
      font-size: 24px;
    }
  }

  @media print {
    body {
      background: #ffffff;
      padding: 0;
    }
    .invoice-card {
      border: none;
      box-shadow: none;
      padding: 0;
      margin: 0;
      max-width: 100%;
    }
    .actions-bar {
      display: none;
    }
  }
</style>
</head>
<body>
  <div class="actions-bar">
    <button class="btn-print" onclick="window.print()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><polygon points="6 9 6 2 18 2 18 9"></polygon><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      Print / Save PDF (প্রিন্ট করুন)
    </button>
  </div>
  <div class="invoice-card">
    <div class="header-container">
      <div>
        <h1 class="company-title">ORIVIAN GLOBAL</h1>
        <p style="font-size: 12.5px; color: #64748b; margin: 0; font-weight: 500;">Premium Reliable Retail Hub</p>
        <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0; font-weight: bold; text-transform: uppercase; tracking-wider">Official Dispatch Invoice</p>
      </div>
      <div style="text-align: right;">
        <h2 class="invoice-label">Invoice</h2>
        <p style="font-size: 12px; font-weight: 850; color: #64748b; margin: 4px 0 0 0; font-family: monospace; font-weight: bold;">ID: ${trackingId}</p>
        <span class="stamp stamp-${statusLabel.toLowerCase()}">${statusLabel}</span>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <h3 class="section-title">Billing Recipient</h3>
        <div class="detail-block">
          <p><span class="detail-label">Name: </span><span class="detail-value">${custName}</span></p>
          <p><span class="detail-label">Phone: </span><span class="detail-value">${custPhone}</span></p>
          <p style="margin:0;"><span class="detail-label">Address: </span><span class="detail-value" style="font-weight: 500; color: #334155;">${custAddress}</span></p>
        </div>
      </div>
      <div>
        <h3 class="section-title">Billing & Shipping</h3>
        <div class="detail-block">
          <p><span class="detail-label">Order Date: </span><span class="detail-value" style="font-weight: 600;">${dateStr}</span></p>
          <p><span class="detail-label">Method: </span><span class="detail-value" style="color: #0284c7;">${paymentMethod}</span></p>
          ${txId ? `<p style="margin:0;"><span class="detail-label">Trx ID: </span><span class="detail-value" style="font-family: monospace; font-size: 13px; color:#c026d3;">${txId}</span></p>` : ''}
          ${sellerStore ? `<p style="margin-top:6px;"><span class="detail-label">Seller: </span><span class="detail-value" style="color: #6d28d9;">${sellerStore}</span></p>` : ''}
        </div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Particular Particulars</th>
          <th style="width: 130px; text-align: right;">Unit Rate</th>
          <th style="width: 80px; text-align: center;">Qty</th>
          <th style="width: 140px; text-align: right;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div style="font-weight: 800; color: #0f172a; font-size: 14.5px;">${productName}</div>
            ${colorSelected ? `<div style="font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 700;">Color Variant: <span style="color:#0f172a;">${colorSelected}</span></div>` : ''}
          </td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">৳${baseItemPrice.toFixed(0)}</td>
          <td style="text-align: center; font-weight: bold; font-family: monospace; font-size: 14.5px;">${qty}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 800; color: #010101;">৳${(baseItemPrice * qty).toFixed(0)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals-container">
      <div class="totals-row">
        <span style="color: #64748b; font-weight: 600;">Subtotal Gross:</span>
        <span style="font-family: monospace; font-weight: 800; color:#334155;">৳${originalPrice.toFixed(0)}</span>
      </div>
      
      ${order.promoDiscountApplied ? `
      <div class="totals-row" style="color: #16a34a; font-weight: 700;">
        <span>Coupon Code (${order.promoCodeUsed || 'Discount'}):</span>
        <span style="font-family: monospace;">-৳${order.promoDiscountApplied.toFixed(0)}</span>
      </div>
      ` : ''}

      ${order.affiliateDiscountApplied ? `
      <div class="totals-row" style="color: #db2777; font-weight: 700;">
        <span>Affiliate Bonus Applied:</span>
        <span style="font-family: monospace;">-৳${order.affiliateDiscountApplied.toFixed(0)}</span>
      </div>
      ` : ''}

      ${order.shippingChargeApplied ? `
      <div class="totals-row" style="color: #4f46e5; font-weight: 700;">
        <span>Courier Charge:</span>
        <span style="font-family: monospace;">+৳${order.shippingChargeApplied.toFixed(0)}</span>
      </div>
      ` : ''}

      <div class="totals-row grand-total">
        <span>Payable Net Total:</span>
        <span style="font-family: monospace; color: #e11d48;">৳${order.amount.toFixed(0)}</span>
      </div>
    </div>

    <div class="foot-notes">
      <p style="margin: 0; font-weight: 800; color: #475569; font-size: 13px;">Thank you for your order!</p>
      <p style="margin: 4px 0 0 0; font-weight: 500;">Should you have any inquiries, reference your Invoice ID shown above.</p>
      <p style="margin: 2px 0 0 0; font-size: 9.5px; opacity:0.85;">This is an officially certified computer-generated invoice. No manual signature required.</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${trackingId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hasDetails) {
    return (
      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mt-2 font-mono text-[10px] text-slate-500 max-w-xs space-y-2">
        <p className="font-extrabold text-[8.5px] uppercase tracking-wider text-slate-400 mb-1">Billing Details</p>
        <div className="flex justify-between items-center">
          <span>Net Total:</span>
          <span className="font-black text-slate-800">৳{order.amount}</span>
        </div>
        <button
          type="button"
          onClick={triggerDownload}
          className="w-full flex items-center justify-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 py-1.5 px-2.5 rounded-lg text-[9.5px] font-black tracking-wide transition-all mt-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          DOWNLOAD INVOICE
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 mt-2 font-mono text-[10px] text-zinc-600 shadow-3xs max-w-xs space-y-1">
      <p className="font-extrabold text-[8.5px] uppercase tracking-wider text-zinc-400 mb-1 border-b pb-1 border-dashed border-zinc-250 flex items-center gap-1">
        📄 Invoice Details
      </p>
      
      <div className="flex justify-between items-center">
        <span>Base Total Price:</span>
        <span className="font-bold text-zinc-700">৳{originalPrice}</span>
      </div>

      {order.promoDiscountApplied !== undefined && order.promoDiscountApplied > 0 && (
        <div className="flex justify-between items-center text-emerald-600 font-bold">
          <span>✂️ Coupon ({order.promoCodeUsed || 'N/A'}):</span>
          <span>-৳{order.promoDiscountApplied}</span>
        </div>
      )}

      {order.affiliateDiscountApplied !== undefined && order.affiliateDiscountApplied > 0 && (
        <div className="flex justify-between items-center text-pink-650 font-bold">
          <span>🤝 Affiliate Spent:</span>
          <span>-৳{order.affiliateDiscountApplied}</span>
        </div>
      )}

      {order.shippingChargeApplied !== undefined && order.shippingChargeApplied > 0 && (
        <div className="flex justify-between items-center text-indigo-600 font-bold">
          <span>🚚 Courier Charge:</span>
          <span>+৳{order.shippingChargeApplied}</span>
        </div>
      )}

      <div className="border-t border-dashed border-zinc-250 pt-1.5 flex justify-between items-center text-zinc-900 font-extrabold text-[10.5px]">
        <span>Payable Total:</span>
        <span>৳{order.amount}</span>
      </div>

      <button
        type="button"
        onClick={triggerDownload}
        className="w-full flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white py-1.5 px-2.5 rounded-lg text-[9.5px] font-extrabold tracking-wide transition-all mt-2.5 cursor-pointer shadow-3xs shadow-rose-200"
      >
        <Printer className="w-3.5 h-3.5" />
        DOWNLOAD & PRINT INVOICE
      </button>
    </div>
  );
};

