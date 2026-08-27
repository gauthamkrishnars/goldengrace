import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET all orders (for admin)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userEmail = url.searchParams.get("email");

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (userEmail) {
    query = query.eq("user_email", userEmail);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST new order
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = {
      id: body.id || `GG-${Date.now().toString(36).toUpperCase()}`,
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

    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (error) {
      console.error("Order save failed:", error.message);
      // Still return success with the order data for demo
      return NextResponse.json({ ...order, demo: true });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
