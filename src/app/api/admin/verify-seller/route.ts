import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, status } = body;

    if (!sellerId || !status) {
      return NextResponse.json({ error: "Seller ID and status are required" }, { status: 400 });
    }

    const updated = await repository.updateSellerVerification(sellerId, status);
    if (!updated) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      seller: updated,
      message: `Seller verification status updated to ${status}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
