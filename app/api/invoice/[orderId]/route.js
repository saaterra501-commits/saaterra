import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { orderId } = await params;

  const subtotal = 1694.07;
  const gstAmount = 304.93;
  const totalAmount = 1999.00;

  const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GST Tax Invoice — StackDeal Marketplace</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0F1729; margin: 0; padding: 40px; background: #fff; }
    .invoice-card { max-width: 800px; margin: 0 auto; border: 2px solid #E8EBF3; border-radius: 16px; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F0F2F8; padding-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 900; color: #1E1E2F; }
    .logo span { color: #FF5429; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { margin: 0; font-size: 20px; font-weight: 900; color: #2475FF; }
    .invoice-title p { margin: 4px 0 0; font-size: 12px; color: #64748B; font-weight: 700; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 32px 0; }
    .section-title { font-size: 11px; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .info-box { font-size: 13px; line-height: 1.6; color: #334155; }
    .info-box strong { color: #0F1729; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { background: #F8FAFC; text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 900; color: #475569; text-transform: uppercase; border-bottom: 2px solid #E2E8F0; }
    td { padding: 14px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; font-weight: 600; }
    .total-box { margin-left: auto; width: 300px; padding: 16px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; color: #475569; }
    .total-row.grand { font-size: 16px; font-weight: 900; color: #0F1729; border-top: 2px solid #CBD5E1; padding-top: 12px; margin-top: 6px; }
    .badge { display: inline-block; background: #DEF7EC; color: #03543F; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; margin-top: 12px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; font-weight: 600; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">Stack<span>Deal</span></div>
        <p style="font-size: 11px; color: #64748B; margin: 4px 0 0; font-weight: 700;">India's #1 B2B SaaS 5-Year Pass Marketplace</p>
      </div>
      <div class="invoice-title">
        <h1>TAX INVOICE</h1>
        <p>INVOICE NO: INV-2026-${orderId || '1088'}</p>
        <p>DATE: ${new Date().toLocaleDateString('en-IN')}</p>
        <span class="badge">PAID VIA RAZORPAY UPI</span>
      </div>
    </div>
    <div class="details-grid">
      <div>
        <div class="section-title">Seller Details</div>
        <div class="info-box">
          <strong>StackDeal Technologies Pvt Ltd</strong><br>
          GSTIN: 07AAAAA0000A1Z5<br>
          PAN: AAAAA0000A<br>
          SAC Code: 998313 (Information Technology Services)<br>
          New Delhi, India — 110001
        </div>
      </div>
      <div>
        <div class="section-title">B2B Buyer Details</div>
        <div class="info-box">
          <strong>Indian Agency Partner</strong><br>
          Buyer GSTIN: 07AAAAA9999B1Z2<br>
          Email: agency@stackdeal.in<br>
          Payment Mode: Razorpay UPI (PhonePe / GPay)<br>
          Transaction Ref: pay_${orderId || 'rzp_9901'}
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th>SAC Code</th>
          <th>Access Period</th>
          <th>Qty</th>
          <th>Rate (₹)</th>
          <th>Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Chat Chacha — WhatsApp AI Marketing & Automation</strong><br>
            <span style="font-size: 11px; color: #64748B;">Tier 1 Starter Pass (1 User / 2,500 Credits/mo)</span>
          </td>
          <td>998313</td>
          <td>5 Years (60 Mos)</td>
          <td>1</td>
          <td>₹1,694.07</td>
          <td>₹1,694.07</td>
        </tr>
      </tbody>
    </table>
    <div class="total-box">
      <div class="total-row">
        <span>Taxable Value:</span>
        <span>₹${subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>CGST (9%):</span>
        <span>₹${(gstAmount / 2).toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>SGST (9%):</span>
        <span>₹${(gstAmount / 2).toFixed(2)}</span>
      </div>
      <div class="total-row grand">
        <span>Total Payable:</span>
        <span style="color: #2475FF;">₹${totalAmount.toFixed(2)}</span>
      </div>
    </div>
    <div class="footer">
      This is a computer-generated tax invoice eligible for 100% B2B Input Tax Credit (ITC) under GST Law India.<br>
      © 2026 StackDeal Marketplace. All rights reserved. Support: support@stackdeal.in
    </div>
  </div>
  <script>
    if (window.location.search.includes('print=true')) {
      window.print();
    }
  </script>
</body>
</html>
  `;

  return new NextResponse(invoiceHTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
