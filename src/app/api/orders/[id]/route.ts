import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

const supabase = getSupabaseServer();

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("orders")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send status update email (non-blocking)
  if (data && data.user_email) {
    try {
      const statusLabels: Record<string, string> = {
        confirmed: "Your order has been confirmed!",
        processing: "Your order is being prepared.",
        shipped: "Your order has been shipped!",
        delivered: "Your order has been delivered!",
        cancelled: "Your order has been cancelled.",
        pending: "Your order is pending.",
      };

      const message = statusLabels[body.status.toLowerCase()] || `Your order status has been updated to ${body.status}.`;

      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.id,
          customerName: data.user_name || "Customer",
          customerEmail: data.user_email,
          items: data.items || [],
          total: data.total,
          statusUpdate: true,
          statusMessage: message,
          newStatus: body.status,
        }),
      }).catch(() => {});
    } catch {
      // Email failed, but order status was still updated
    }
  }

  return NextResponse.json(data);
}
