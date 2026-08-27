import { NextResponse } from "next/server";
import { supabase, productToDB } from "@/lib/supabase";
import { products } from "@/data/products";

export async function POST() {
  try {
    // Convert all products to DB format
    const dbProducts = products.map((p) => productToDB(p as unknown as Record<string, unknown>));

    // Upsert all products (insert or update if exists)
    const { data, error } = await supabase
      .from("products")
      .upsert(dbProducts, { onConflict: "id" })
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message, hint: "Make sure you ran the SQL schema in Supabase SQL Editor first." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length || 0} products into Supabase`,
      count: data?.length || 0,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
