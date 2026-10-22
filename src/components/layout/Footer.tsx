import Link from "next/link";
import { Globe, ShieldCheck, Truck, RefreshCw, CreditCard, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm">
      {/* Trust Highlights Section */}
      <div className="border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Trade Assurance</h4>
              <p className="text-xs text-slate-400 mt-1">
                End-to-end payment escrow protection, dispute mediation, and verified product specifications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-900/30 text-emerald-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Verified Manufacturers</h4>
              <p className="text-xs text-slate-400 mt-1">
                On-site audited factory inspections, ISO quality certifications, and production capacity audits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-900/30 text-amber-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Global Logistics</h4>
              <p className="text-xs text-slate-400 mt-1">
                Multimodal freight (Ocean, Air Cargo, Express) with customs clearance and real-time container tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-purple-900/30 text-purple-400 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">B2B Negotiation (RFQ)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Direct factory counteroffers, volume discount pricing tiers, and customized purchase orders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Globe className="w-4 h-4" />
            </div>
            <span>TradeSphere</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
            The premier global marketplace connecting institutional buyers, wholesale importers, and certified manufacturers across 180+ countries.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Base Currency: <strong>USD ($)</strong></span>
            <span>•</span>
            <span>Platform Status: <strong className="text-emerald-400">Operational</strong></span>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">For Buyers</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products" className="hover:text-white transition">Product Catalog</Link></li>
            <li><Link href="/rfq" className="hover:text-white transition">Submit RFQ</Link></li>
            <li><Link href="/categories" className="hover:text-white transition">All Categories</Link></li>
            <li><Link href="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
            <li><Link href="/orders" className="hover:text-white transition">Track My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">For Suppliers</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/seller" className="hover:text-white transition">Seller Center</Link></li>
            <li><Link href="/seller/products/new" className="hover:text-white transition">List Wholesale Product</Link></li>
            <li><Link href="/seller/onboarding" className="hover:text-white transition">Supplier Verification</Link></li>
            <li><Link href="/rfq" className="hover:text-white transition">Browse Open RFQs</Link></li>
            <li><Link href="/seller/orders" className="hover:text-white transition">Order Fulfillment</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Governance & Trust</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin" className="hover:text-white transition">Admin Portal</Link></li>
            <li><span className="hover:text-white cursor-pointer transition">Trade Assurance Rules</span></li>
            <li><span className="hover:text-white cursor-pointer transition">Dispute Resolution</span></li>
            <li><span className="hover:text-white cursor-pointer transition">Privacy & Compliance</span></li>
            <li><span className="hover:text-white cursor-pointer transition">Terms of Service</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© 2026 TradeSphere Inc. All rights reserved. Enterprise B2B & B2C Global Trading Infrastructure.</p>
      </div>
    </footer>
  );
}
