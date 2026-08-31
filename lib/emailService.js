import nodemailer from 'nodemailer';

export async function sendContactNotification({
  ticketId,
  name,
  email,
  phone,
  category,
  subject,
  message,
}) {
  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const destinationEmail = process.env.ADMIN_NOTIFY_EMAIL || 'hello@stackdeal.in';

  if (!smtpUser || !smtpPass) {
    console.warn(
      `[Email Service] SMTP not configured in environment variables. Message safely stored in MongoDB (Ticket ID: ${ticketId}).`
    );
    return { success: false, reason: 'SMTP_NOT_CONFIGURED' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const categoryLabels = {
      vendor_listing: '🤝 SaaS Founder Listing Proposal',
      order_billing: '💳 Order & GST Invoice Inquiry',
      refund_request: '🛡️ 60-Day Refund Request',
      technical_issue: '🐛 Technical Bug Report',
      general: '❓ General Agency Question',
    };

    const categoryText = categoryLabels[category] || category;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#070B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:20px auto;background-color:#0D1527;border:1px solid #1E293B;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Top Header -->
    <div style="background:linear-gradient(135deg,#FF6B35,#FFD519);padding:24px;text-align:center;">
      <h1 style="margin:0;color:#070B14;font-size:22px;font-weight:900;letter-spacing:-0.5px;">⚡ New Support & Listing Ticket</h1>
      <p style="margin:4px 0 0;color:#070B14;font-size:13px;font-weight:bold;">Ticket ID: ${ticketId}</p>
    </div>

    <!-- Ticket Meta Info -->
    <div style="padding:24px;border-bottom:1px solid #1E293B;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;width:35%;">Sender Name:</td>
          <td style="padding:8px 0;color:#FFFFFF;font-weight:bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;">Work Email:</td>
          <td style="padding:8px 0;color:#38BDF8;font-weight:bold;"><a href="mailto:${email}" style="color:#38BDF8;text-decoration:none;">${email}</a></td>
        </tr>
        ${
          phone
            ? `<tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;">WhatsApp / Phone:</td>
          <td style="padding:8px 0;color:#34D399;font-weight:bold;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color:#34D399;text-decoration:none;">${phone} (Chat on WhatsApp)</a></td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;">Category:</td>
          <td style="padding:8px 0;color:#FBBF24;font-weight:bold;">${categoryText}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;">Subject:</td>
          <td style="padding:8px 0;color:#FFFFFF;font-weight:bold;">${subject}</td>
        </tr>
      </table>
    </div>

    <!-- Message Body -->
    <div style="padding:24px;">
      <h3 style="margin:0 0 12px;color:#F8FAFC;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Message Details:</h3>
      <div style="background-color:#070B14;border:1px solid #1E293B;border-radius:12px;padding:16px;color:#E2E8F0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</div>
    </div>

    <!-- Quick Reply CTA -->
    <div style="padding:0 24px 24px;text-align:center;">
      <a href="mailto:${email}?subject=Re: [Ticket ${ticketId}] ${encodeURIComponent(subject)}&body=Hi ${encodeURIComponent(name)},%0D%0A%0D%0AThank you for reaching out to StackDeal.%0D%0A%0D%0A" style="display:inline-block;background-color:#2475FF;color:#ffffff;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;box-shadow:0 4px 12px rgba(36,117,255,0.3);">
        ✉️ Click to Direct Reply to ${name}
      </a>
    </div>

    <!-- Footer -->
    <div style="background-color:#070B14;padding:16px;text-align:center;border-top:1px solid #1E293B;font-size:11px;color:#64748B;">
      StackDeal India · Super Admin Ops Vault Dispatcher<br>
      Automated notifications generated for hello@stackdeal.in
    </div>

  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"StackDeal Helpdesk" <${smtpUser}>`,
      to: destinationEmail,
      replyTo: email,
      subject: `⚡ [Ticket ${ticketId}] ${name}: ${subject}`,
      html: htmlContent,
    });

    return { success: true };
  } catch (err) {
    console.error('[Email Service] Error sending notification email:', err);
    return { success: false, error: err.message };
  }
}

export async function sendFounderQuestionEmail({
  founderEmail,
  founderName = 'Founder',
  dealTitle = 'SaaS Deal',
  dealSlug,
  userName,
  userEmail,
  userPhone,
  question,
}) {
  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const recipient = founderEmail || process.env.ADMIN_NOTIFY_EMAIL || 'ujjawal@stackdeal.in';

  console.log(`[Founder Email Dispatch] Preparing email to ${recipient} (${founderName}) for question about "${dealTitle}" from ${userName} (${userEmail})`);

  if (!smtpUser || !smtpPass) {
    console.warn(`[Founder Email Dispatch] SMTP not configured in environment variables. Question safely logged and stored in MongoDB.`);
    return { success: true, simulated: true, recipient };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#070B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:20px auto;background-color:#0D1527;border:1px solid #1E293B;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Top Header -->
    <div style="background:linear-gradient(135deg,#FF6B35,#2475FF);padding:24px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">💬 Customer Question for ${founderName}</h1>
      <p style="margin:4px 0 0;color:#E0E7FF;font-size:13px;font-weight:bold;">Software: ${dealTitle}</p>
    </div>

    <!-- Question Meta Info -->
    <div style="padding:24px;border-bottom:1px solid #1E293B;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;width:35%;">Buyer / Agency Name:</td>
          <td style="padding:8px 0;color:#FFFFFF;font-weight:bold;">${userName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;">Buyer Email:</td>
          <td style="padding:8px 0;color:#38BDF8;font-weight:bold;"><a href="mailto:${userEmail}" style="color:#38BDF8;text-decoration:none;">${userEmail}</a></td>
        </tr>
        ${userPhone ? `<tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;">Phone / WhatsApp:</td>
          <td style="padding:8px 0;color:#34D399;font-weight:bold;">${userPhone}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:8px 0;color:#94A3B8;font-weight:bold;">Deal Page:</td>
          <td style="padding:8px 0;color:#FF6B35;font-weight:bold;"><a href="https://stackdeal.in/deals/${dealSlug}" style="color:#FF6B35;text-decoration:none;">View Deal Page ➔</a></td>
        </tr>
      </table>
    </div>

    <!-- Question Message Body -->
    <div style="padding:24px;">
      <h3 style="margin:0 0 12px;color:#F8FAFC;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Question Details:</h3>
      <div style="background-color:#070B14;border:1px solid #1E293B;border-radius:12px;padding:16px;color:#E2E8F0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${question}</div>
    </div>

    <!-- Quick 1-Click Direct Reply CTA -->
    <div style="padding:0 24px 24px;text-align:center;">
      <a href="mailto:${userEmail}?subject=Re: Question about ${encodeURIComponent(dealTitle)} on StackDeal&body=Hi ${encodeURIComponent(userName)},%0D%0A%0D%0AThank you for your question about ${encodeURIComponent(dealTitle)} on StackDeal!%0D%0A%0D%0A" style="display:inline-block;background-color:#FF6B35;color:#ffffff;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;box-shadow:0 4px 12px rgba(255,107,53,0.3);">
        ✉️ Click to Direct Reply to ${userName} (${userEmail})
      </a>
    </div>

    <!-- Footer -->
    <div style="background-color:#070B14;padding:16px;text-align:center;border-top:1px solid #1E293B;font-size:11px;color:#64748B;">
      StackDeal Founder Direct Connect · Community Question Dispatcher<br>
      Delivered directly to SaaS Founder Inbox
    </div>

  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"StackDeal Founder Connect" <${smtpUser}>`,
      to: recipient,
      replyTo: userEmail,
      subject: `💬 [New Question] ${userName} asked about ${dealTitle}`,
      html: htmlContent,
    });

    return { success: true, recipient };
  } catch (err) {
    console.error('[Founder Email Dispatch] Error sending email:', err);
    return { success: false, error: err.message };
  }
}

