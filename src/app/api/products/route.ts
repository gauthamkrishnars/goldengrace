import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { dbToProduct, productToDB } from "@/lib/supabase";

const supabase = getSupabaseServer();
import { products as mockProducts } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Supabase query failed, using mock data:", error.message);
      return NextResponse.json(mockProducts);
    }

    if (!data || data.length === 0) {
      console.log("No products in Supabase, using mock data");
      return NextResponse.json(mockProducts);
    }

    return NextResponse.json(data.map(dbToProduct));
  } catch (err) {
    console.log("Supabase connection failed, using mock data:", err);
    return NextResponse.json(mockProducts);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dbData = productToDB(body);

    const { data, error } = await supabase
      .from("products")
      .upsert(dbData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(dbToProduct(data));
  } catch (err: unknown) {
    console.error("Product POST error:", err);
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
