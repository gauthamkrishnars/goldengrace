import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay credentials are configured, create a real order
    if (razorpayKeyId && razorpayKeySecret) {
      const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects paise
          currency: currency || "INR",
          receipt: `order_${Date.now()}`,
        }),
      });

      const order = await response.json();

      if (order.error) {
        return NextResponse.json({ error: order.error.description }, { status: 400 });
      }

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: razorpayKeyId,
      });
    }

    // Demo mode: return mock order data
    return NextResponse.json({
      orderId: `order_demo_${Date.now()}`,
      amount: amount * 100,
      currency: currency || "INR",
      key: "",
      demo: true,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
