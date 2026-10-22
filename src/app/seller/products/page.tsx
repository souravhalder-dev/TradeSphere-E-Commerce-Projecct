import Link from "next/link";
import { Package, PlusCircle, Search, Edit, ExternalLink, ShieldCheck } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { formatCurrency } from "@/lib/utils";

export default async function SellerProductsPage() {
  const seller = await repository.getSellerBySlug("apex-industrial");
  const products = await repository.getProducts({ sellerId: seller?.id });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products & Inventory Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage wholesale specifications, MOQ thresholds, and volume price tiers
          </p>
        </div>

        <Link
          href="/seller/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">MOQ</th>
                <th className="py-3 px-4">Wholesale Tiers</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={p.images[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-slate-500">Origin: {p.countryOfOrigin}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {p.categoryName}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrency(p.basePrice)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {p.moq} {p.moq === 1 ? "unit" : "units"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {p.priceTiers.length} Price Tiers
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/products/${p.slug}`}
                      className="font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
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
