import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Building2,
  Printer,
  ArrowLeft,
  Clock,
  ExternalLink,
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const order = await repository.getOrderById(params.id);
  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Return to Products Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Sourcing</span>
        </Link>

        <button
          onClick={() => {}}
          className="text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print Purchase Order (PO)</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Order Confirmed: {order.orderNumber}
            </h1>
            <p className="text-xs text-emerald-800 mt-0.5">
              Trade Assurance escrow is active. Supplier has been notified to begin manufacturing and dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 px-3 py-1 rounded-full">
            Payment: {order.paymentStatus}
          </span>
          <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
            {order.status}
          </span>
        </div>
      </div>

      {/* Logistics & Tracking Card */}
      {order.trackingNumber && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Freight Shipment & Carrier Tracking
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Carrier: <strong className="text-slate-800">{order.carrier}</strong>
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500">Waybill / Bill of Lading Tracking #:</span>
              <div className="font-mono font-bold text-sm text-blue-600 mt-0.5">
                {order.trackingNumber}
              </div>
            </div>
            <a
              href={`https://tracking.tradesphere.local/track/${order.trackingNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
            >
              <span>Live Carrier Tracking</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Order Item Details Snapshot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Purchased Line Items</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fulfilled by: <strong>{order.sellerStoreName}</strong>
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Placed on: {formatDateTime(order.createdAt)}
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{item.productName}</div>
                    <div className="font-mono text-[11px] text-slate-500">SKU: {item.sku}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {item.quantity} units
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Consignee Address & Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-slate-900 mb-1">Consignee Shipping Address</h4>
            <p className="text-slate-800 font-medium">{order.shippingAddress.fullName}</p>
            {order.shippingAddress.companyName && (
              <p className="text-slate-600">{order.shippingAddress.companyName}</p>
            )}
            <p className="text-slate-600">{order.shippingAddress.street}</p>
            <p className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-slate-600 font-medium">{order.shippingAddress.country}</p>
            <p className="text-slate-500 mt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-2 text-xs text-right sm:pl-8">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Volume Promotion Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Priority Freight Shipping:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Customs & Tariff:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(order.tax)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
              <span className="font-bold text-slate-900">Grand Total Paid:</span>
              <span className="font-extrabold text-blue-600 text-lg">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Assurance Guarantee Footer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-sm block">Trade Assurance Escrow Active</span>
            <span className="text-slate-300">
              Funds will not be credited to {order.sellerStoreName} until cargo delivery confirmation is validated.
            </span>
          </div>
        </div>

        <Link
          href="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex-shrink-0"
        >
          Explore More Products
        </Link>
      </div>
    </div>
  );
}
