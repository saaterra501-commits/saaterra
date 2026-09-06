import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LTDOrder from '@/models/LTDOrder';
import Deal from '@/models/Deal';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const orderId = resolvedParams?.orderId;

    let order = null;
    if (orderId) {
      order = await LTDOrder.findOne({
        $or: [
          { orderId },
          { paymentId: orderId },
          { licenseCode: orderId },
        ],
      });
    }

    const totalAmount = order?.amountPaid || 1999.00;
    // 18% GST calculation
    const subtotal = Math.round((totalAmount / 1.18) * 100) / 100;
    const gstAmount = Math.round((totalAmount - subtotal) * 100) / 100;
    const cgst = Math.round((gstAmount / 2) * 100) / 100;
    const sgst = Math.round((gstAmount / 2) * 100) / 100;

    const dealTitle = order?.dealTitle || 'Verified SaaS 5-Year Pass';
    const tierName = order?.tier || 'Starter Pass (5-Year Access)';
    const buyerName = order?.userName || 'Verified Agency Buyer';
    const buyerEmail = order?.userEmail || 'founder@agency.in';
    const buyerGst = order?.gstNumber || 'Not Provided (B2C)';
    const paymentId = order?.paymentId || `pay_${Date.now()}`;
    const licenseCode = order?.licenseCode || 'SD-PASS-ACTIVE';
    const purchaseDate = order?.purchasedAt
      ? new Date(order.purchasedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GST Tax Invoice — StackDeal Marketplace</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F1729; margin: 0; padding: 40px 20px; background: #f8fafc; }
    .invoice-card { max-width: 820px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 16px; padding: 40px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F1F5F9; padding-bottom: 24px; }
    .logo { font-size: 26px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
    .logo span { color: #059669; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { margin: 0; font-size: 22px; font-weight: 900; color: #059669; }
    .invoice-title p { margin: 4px 0 0; font-size: 12px; color: #64748B; font-weight: 700; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 32px 0; }
    .section-title { font-size: 11px; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .info-box { font-size: 13px; line-height: 1.6; color: #334155; }
    .info-box strong { color: #0F1729; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { background: #F8FAFC; text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 900; color: #475569; text-transform: uppercase; border-bottom: 2px solid #E2E8F0; }
    td { padding: 14px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; font-weight: 600; }
    .total-box { margin-left: auto; width: 320px; padding: 18px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; color: #475569; }
    .total-row.grand { font-size: 16px; font-weight: 900; color: #059669; border-top: 2px solid #CBD5E1; padding-top: 10px; margin-top: 6px; }
    .badge { display: inline-block; background: #DEF7EC; color: #03543F; font-size: 10px; font-weight: 900; padding: 5px 12px; border-radius: 999px; text-transform: uppercase; margin-top: 10px; border: 1px solid rgba(5,150,105,0.2); }
    .license-banner { background: #ecfdf5; border: 1px dashed #059669; border-radius: 8px; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #065f46; display: flex; justify-content: space-between; align-items: center; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; font-weight: 600; }
    .print-btn { background: #059669; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 12px; }
    @media print {
      body { background: #fff; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">Stack<span>Deal</span></div>
        <p style="font-size: 11px; color: #64748B; margin: 4px 0 0; font-weight: 700;">Curated SaaS 5-Year Passes for Indian Founders</p>
      </div>
      <div class="invoice-title">
        <h1>TAX INVOICE</h1>
        <p>INVOICE NO: INV-${orderId?.substring(0, 16).toUpperCase() || 'SD-1088'}</p>
        <p>DATE: ${purchaseDate}</p>
        <span class="badge">PAID VIA RAZORPAY</span>
      </div>
    </div>

    <div class="details-grid">
      <div>
        <div class="section-title">Seller Details</div>
        <div class="info-box">
          <strong>StackDeal Technologies</strong><br>
          GSTIN: 07AAACS1234F1Z9<br>
          PAN: AAACS1234F<br>
          SAC Code: 998313 (Software & Cloud Services)<br>
          New Delhi, India — 110001<br>
          Email: support@stackdeal.in
        </div>
      </div>
      <div>
        <div class="section-title">B2B Buyer Details</div>
        <div class="info-box">
          <strong>${buyerName}</strong><br>
          Buyer GSTIN: <strong>${buyerGst}</strong><br>
          Email: ${buyerEmail}<br>
          Payment Gateway: Razorpay<br>
          Payment Ref ID: <code style="font-size: 11px; color: #059669;">${paymentId}</code>
        </div>
      </div>
    </div>

    <div class="license-banner">
      <div>
        <strong>Official License Pass Key:</strong> 
        <code style="background: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 800; color: #059669; margin-left: 6px; border: 1px solid #a7f3d0;">${licenseCode}</code>
      </div>
      <span style="font-size: 11px; font-weight: 700; color: #047857;">60-Day Guarantee Active</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th>SAC Code</th>
          <th>Access Duration</th>
          <th>Qty</th>
          <th>Taxable Value (₹)</th>
          <th>Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${dealTitle}</strong><br>
            <span style="font-size: 11px; color: #64748B;">Plan: ${tierName}</span>
          </td>
          <td>998313</td>
          <td>5 Years (60 Months)</td>
          <td>1</td>
          <td>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-box">
      <div class="total-row">
        <span>Taxable Subtotal:</span>
        <span>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row">
        <span>CGST (9%):</span>
        <span>₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row">
        <span>SGST (9%):</span>
        <span>₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row grand">
        <span>Total Amount Paid:</span>
        <span>₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>

    <div style="margin-top: 24px; text-align: right;" class="no-print">
      <button onclick="window.print()" class="print-btn">🖨️ Print / Save as PDF</button>
    </div>

    <div class="footer">
      <p>This is a computer-generated tax invoice compliant with the Indian GST Act. No physical signature is required.</p>
      <p>&copy; ${new Date().getFullYear()} StackDeal Platform · Registered B2B Technology Service Provider</p>
    </div>
  </div>
</body>
</html>
    `;

    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
