import { NextResponse } from "next/server";

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shippingAddress?: {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  statusUpdate?: boolean;
  statusMessage?: string;
  newStatus?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function buildEmailHtml(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;">
          ${item.name}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px;text-align:right;font-weight:600;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const addr = data.shippingAddress;
  const address = addr ? [
    addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.pincode,
  ]
    .filter(Boolean)
    .join(", ") : "";

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;">
        <!-- Header -->
        <div style="background:#587284;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;margin:0;letter-spacing:2px;">GOLDEN GRACE</h1>
          <p style="color:rgba(255,255,255,0.8);font-size:12px;margin:4px 0 0;letter-spacing:1px;">ORDER CONFIRMATION</p>
        </div>

        <div style="padding:32px;">
          <!-- Success Icon -->
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#d1fae5;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:32px;">✓</span>
            </div>
          </div>

          <h2 style="color:#111827;font-size:20px;text-align:center;margin:0 0 8px;">Order Placed Successfully!</h2>
          <p style="color:#6b7280;font-size:14px;text-align:center;margin:0 0 24px;">
            Thank you, <strong>${data.customerName}</strong>! Your order has been confirmed.
          </p>

          <!-- Order ID -->
          <div style="background:#f9fafb;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
            <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">ORDER ID</p>
            <p style="color:#111827;font-size:18px;font-weight:bold;margin:0;letter-spacing:1px;">#${data.orderId.slice(-8).toUpperCase()}</p>
          </div>

          <!-- Items -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr style="border-bottom:2px solid #e5e7eb;">
                <th style="padding:8px 0;text-align:left;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">Item</th>
                <th style="padding:8px 0;text-align:center;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">Qty</th>
                <th style="padding:8px 0;text-align:right;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Total -->
          <div style="border-top:2px solid #e5e7eb;padding-top:16px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#6b7280;font-size:14px;">Subtotal</span>
              <span style="color:#374151;font-size:14px;">${formatPrice(data.total)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#6b7280;font-size:14px;">Shipping</span>
              <span style="color:#059669;font-size:14px;font-weight:600;">FREE</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid #e5e7eb;">
              <span style="color:#111827;font-size:16px;font-weight:bold;">Total</span>
              <span style="color:#111827;font-size:16px;font-weight:bold;">${formatPrice(data.total)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="color:#6b7280;font-size:12px;margin:0 0 8px;font-weight:600;text-transform:uppercase;">Shipping Address</p>
            <p style="color:#374151;font-size:14px;margin:0;line-height:1.5;">
              ${addr?.fullName || data.customerName}<br/>
              ${address}
            </p>
          </div>

          <!-- Delivery Info -->
          <div style="background:#fdf0f2;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
            <p style="color:#b76e79;font-size:13px;font-weight:600;margin:0;">📦 Estimated delivery: 5-7 business days</p>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://goldengrace.vercel.app/profile" 
               style="display:inline-block;padding:12px 32px;background:#587284;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
              Track Your Order
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#111827;padding:24px 32px;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0 0 8px;letter-spacing:1px;">GOLDEN GRACE</p>
          <p style="color:rgba(255,255,255,0.3);font-size:10px;margin:0;">BIS Hallmarked • IGI Certified • Quality Assured</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildStatusUpdateHtml(data: OrderEmailData): string {
  const statusEmojis: Record<string, string> = {
    confirmed: "✅",
    processing: "⚙️",
    shipped: "🚚",
    delivered: "📦",
    cancelled: "❌",
    pending: "⏳",
  };
  const emoji = statusEmojis[data.newStatus?.toLowerCase() || ""] || "📋";

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:#587284;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;margin:0;letter-spacing:2px;">GOLDEN GRACE</h1>
        </div>
        <div style="padding:32px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">${emoji}</div>
          <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">${data.statusMessage}</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 8px;">Order #${data.orderId.slice(-8).toUpperCase()}</p>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Status: <strong>${data.newStatus}</strong></p>
          <a href="https://goldengrace.vercel.app/profile"
             style="display:inline-block;padding:12px 32px;background:#587284;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
            View Order Details
          </a>
        </div>
        <div style="background:#111827;padding:24px 32px;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0;letter-spacing:1px;">GOLDEN GRACE</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const data: OrderEmailData = await request.json();

    if (!data.customerEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, skipping email");
      return NextResponse.json({ skipped: true, reason: "No API key" });
    }

    const resend = getResend();
    const subject = data.statusUpdate
      ? `${data.statusMessage} - Order #${data.orderId.slice(-8).toUpperCase()}`
      : `Order Confirmed #${data.orderId.slice(-8).toUpperCase()} - Golden Grace`;
    const { error } = await resend.emails.send({
      from: "Golden Grace <orders@goldengrace.com>",
      to: data.customerEmail,
      subject,
      html: data.statusUpdate ? buildStatusUpdateHtml(data) : buildEmailHtml(data),
    });

    if (error) {
      console.error("Email send failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
