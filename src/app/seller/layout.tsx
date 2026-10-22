import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  DollarSign,
  Settings,
  ShieldCheck,
  Building2,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row">
      {/* Seller Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Seller Portal Header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Seller Center</span>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                  Apex Industrial Corp
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            <Link
              href="/seller"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-slate-800 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Overview & Metrics</span>
            </Link>

            <Link
              href="/seller/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:text-white hover:bg-slate-800 transition"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Products & Inventory</span>
            </Link>

            <Link
              href="/seller/products/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:text-white hover:bg-slate-800 transition pl-7 text-slate-400"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Add New Product</span>
            </Link>

            <Link
              href="/seller/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:text-white hover:bg-slate-800 transition"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Orders & Fulfillment</span>
            </Link>

            <Link
              href="/seller/finance"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:text-white hover:bg-slate-800 transition"
            >
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span>Financial Ledger & Payouts</span>
            </Link>

            <Link
              href="/rfq"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:text-white hover:bg-slate-800 transition"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>RFQ Tender Bids</span>
            </Link>
          </nav>
        </div>

        {/* Storefront Link Footer */}
        <div className="p-4 border-t border-slate-800 text-xs">
          <Link
            href="/sellers/apex-industrial"
            className="flex items-center justify-between text-slate-400 hover:text-white transition py-1"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Supplier Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
