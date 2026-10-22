import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { simulatorShippingAdapter } from "@/lib/adapters/shipping/simulator-shipping.adapter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, carrier } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await repository.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Dispatch via shipping abstraction
    const dispatchResult = await simulatorShippingAdapter.dispatchShipment({
      orderId: order.orderNumber,
      carrier: carrier || "DHL Express Freight",
      destinationAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
    });

    const updated = await repository.updateOrderStatus(orderId, "SHIPPED", {
      carrier: dispatchResult.carrier,
      trackingNumber: dispatchResult.trackingNumber,
    });

    return NextResponse.json({
      success: true,
      order: updated,
      trackingNumber: dispatchResult.trackingNumber,
      message: "Order dispatched and tracking number assigned successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
