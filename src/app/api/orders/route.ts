import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

// GET all orders (for admin)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userEmail = url.searchParams.get("email");

  const supabase = getSupabaseServer();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (userEmail) {
    query = query.eq("user_email", userEmail);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Orders GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseServer();

    const orderId = body.id || `GG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const order = {
      id: orderId,
      user_id: body.userId || null,
      user_email: body.userEmail,
      user_name: body.userName,
      user_phone: body.userPhone,
      items: body.items,
      subtotal: body.subtotal || body.total,
      shipping: body.shipping || 0,
      total: body.total,
      status: "Processing",
      shipping_address: body.shippingAddress,
      payment_method: body.paymentMethod || "razorpay",
      payment_id: body.paymentId || null,
    };

    console.log("Attempting to save order:", orderId);

    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (error) {
      console.error("Order insert failed:", error.message, error.code, error.details);
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details, order },
        { status: 500 }
      );
    }

    console.log("Order saved successfully:", orderId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Order API exception:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
