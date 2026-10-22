import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || undefined;
    const searchQuery = searchParams.get("q") || undefined;
    const sellerId = searchParams.get("sellerId") || undefined;

    const products = await repository.getProducts({
      categorySlug,
      searchQuery,
      sellerId,
    });

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.basePrice) {
      return NextResponse.json(
        { error: "Product name and base price are required" },
        { status: 400 }
      );
    }

    const newProduct = await repository.createProduct({
      name: body.name,
      basePrice: parseFloat(body.basePrice),
      moq: parseInt(body.moq) || 1,
      leadTimeDays: parseInt(body.leadTimeDays) || 3,
      countryOfOrigin: body.countryOfOrigin || "US",
      description: body.description || "",
      productionCapacity: body.productionCapacity || "5,000 units / month",
      sampleAvailable: Boolean(body.sampleAvailable),
      samplePrice: body.samplePrice ? parseFloat(body.samplePrice) : undefined,
      customizationAvailable: Boolean(body.customizationAvailable),
      categoryId: body.categoryId || "cat-machinery",
      categoryName: body.categoryName || "Industrial Machinery & Automation",
      categorySlug: body.categorySlug || "industrial-machinery",
      sellerId: "seller-apex",
      sellerStoreName: "Apex Industrial Technologies",
      sellerSlug: "apex-industrial",
      images: body.images && body.images.length > 0
        ? body.images
        : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"],
      priceTiers: body.priceTiers || [],
      variants: body.variants || [],
      specifications: body.specifications || {},
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Product created and published successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
