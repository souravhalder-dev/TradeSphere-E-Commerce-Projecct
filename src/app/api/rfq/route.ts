import { NextRequest, NextResponse } from "next/server";
import { rfqCreateSchema } from "@/lib/validations/rfq.schema";
import { repository } from "@/lib/data/repository";

export async function GET() {
  try {
    const rfqs = await repository.getRFQs();
    return NextResponse.json({ success: true, rfqs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = rfqCreateSchema.parse(body);

    const categories = await repository.getCategories();
    const cat = categories.find((c) => c.id === validated.categoryId) || categories[0];

    const newRfq = await repository.createRFQ({
      buyerId: "usr-buyer-acme",
      buyerName: "Sarah Jenkins",
      buyerCompany: "Acme Global Procurement Inc",
      title: validated.title,
      categoryId: validated.categoryId,
      categoryName: cat ? cat.name : "Industrial Sourcing",
      quantity: validated.quantity,
      targetPrice: validated.targetPrice || undefined,
      destinationCountry: validated.destinationCountry,
      specifications: validated.specifications,
      deliveryDate: validated.deliveryDate || undefined,
    });

    return NextResponse.json({
      success: true,
      rfq: newRfq,
      message: "RFQ published to verified manufacturers successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit RFQ" },
      { status: 400 }
    );
  }
}
