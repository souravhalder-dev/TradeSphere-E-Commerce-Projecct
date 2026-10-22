import { NextRequest, NextResponse } from "next/server";
import { quotationSubmitSchema } from "@/lib/validations/rfq.schema";
import { repository } from "@/lib/data/repository";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validated = quotationSubmitSchema.parse(body);

    const rfq = await repository.getRFQById(params.id);
    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    const updatedRfq = await repository.submitQuotation(params.id, {
      sellerId: "seller-apex",
      sellerName: "Apex Industrial Technologies",
      unitPrice: validated.unitPrice,
      minQuantity: validated.minQuantity,
      leadTimeDays: validated.leadTimeDays,
      validDays: validated.validDays,
      terms: validated.terms,
    });

    return NextResponse.json({
      success: true,
      rfq: updatedRfq,
      message: "Formal quotation submitted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit quotation" },
      { status: 400 }
    );
  }
}
