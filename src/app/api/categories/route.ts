import { NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function GET() {
  try {
    const categories = await repository.getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
