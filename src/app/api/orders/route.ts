import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId") || undefined;
    const buyerId = searchParams.get("buyerId") || undefined;

    const orders = await repository.getOrders({ sellerId, buyerId });
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
