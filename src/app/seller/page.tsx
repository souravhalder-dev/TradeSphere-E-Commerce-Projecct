import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Clock,
  Truck,
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function SellerOverviewPage() {
  const seller = await repository.getSellerBySlug("apex-industrial");
  const products = await repository.getProducts({ sellerId: seller?.id });
  const orders = await repository.getOrders({ sellerId: seller?.id });

  const totalGMV = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {seller?.storeName || "Supplier"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global Trade Operations & Order Management Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/seller/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            + Create New Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Revenue (GMV)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(totalGMV || 11750)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from last month
          </span>
        </div>

        {/* Available Balance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Available for Payout</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatCurrency(seller?.availableBalance || 24500)}
          </div>
          <span className="text-[11px] text-slate-500">Ready for automated wire transfer</span>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Trade Assurance Escrow</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatCurrency(seller?.pendingBalance || 8200)}
          </div>
          <span className="text-[11px] text-slate-500">Releases upon delivery verification</span>
        </div>

        {/* Active Catalog */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Published Catalog</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{products.length} Products</div>
          <span className="text-[11px] text-slate-500">All products approved & live</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Purchase Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Orders requiring manufacturing, packaging, or carrier dispatch</p>
          </div>
          <Link
            href="/seller/orders"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Consignee Buyer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {o.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {o.buyerName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {o.items.length} {o.items.length === 1 ? "line item" : "line items"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrency(o.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/seller/orders`}
                      className="font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-md transition"
                    >
                      Fulfill Order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
