import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Star,
  Factory,
  Globe,
  Clock,
  CheckCircle2,
  Package,
  Layers,
  FileText,
  Building2,
  Mail,
  ChevronRight,
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { ProductPurchasingCard } from "@/components/pdp/ProductPurchasingCard";
import { formatCurrency } from "@/lib/utils";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await repository.getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const seller = await repository.getSellerById(product.sellerId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/products?category=${product.categorySlug}`} className="hover:text-blue-600">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 font-medium truncate max-w-sm">{product.name}</span>
      </nav>

      {/* Product Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery & Highlights (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Primary Image */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative">
            <img
              src={product.images[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.customizationAvailable && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                Custom OEM / Private Label Available
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-600 flex-shrink-0 cursor-pointer bg-white"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Supplier Trust Card */}
          {seller && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={seller.logoUrl}
                    alt={seller.storeName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/sellers/${seller.storeSlug}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition"
                      >
                        {seller.storeName}
                      </Link>
                      {seller.verificationStatus === "VERIFIED" && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          Verified Supplier
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {seller.country} • Est. {seller.establishedYear} • On-Time Delivery: 99.1%
                    </p>
                  </div>
                </div>

                <Link
                  href={`/sellers/${seller.storeSlug}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                >
                  View Profile
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 py-2 border-y border-slate-100 text-center text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Factory Location</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{seller.country}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Response Speed</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{seller.responseRate}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Production Capacity</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{product.productionCapacity}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Business Registration & ISO Quality Audits on File
                </span>
                <Link
                  href="/rfq"
                  className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Request Custom Quote
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Title, Ratings & Purchasing Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {product.categoryName}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Origin: {product.countryOfOrigin}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Social Proof */}
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-slate-900 ml-1">{product.ratingAverage.toFixed(2)}</span>
              </div>
              <span className="text-slate-400">({product.reviewCount} verified buyer reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-700">{product.salesCount} units ordered</span>
            </div>
          </div>

          {/* Interactive Purchasing Card (Tiered volume selector, MOQ, Add to cart) */}
          <ProductPurchasingCard product={product} />
        </div>
      </div>

      {/* Tabs / Specifications & In-Depth Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Technical Specifications & Engineering Details</h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-200">
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}>
                    <td className="py-3 px-4 font-semibold text-slate-700 w-1/3 border-r border-slate-200">
                      {key}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-medium">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Product Description */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Product Description & Application Scope</h2>
          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
            {product.description}
          </p>
        </div>

        {/* Packaging & Logistics Details */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-base font-bold text-slate-900 mb-3">Packaging & Export Delivery Parameters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Standard Dispatch Lead Time</span>
              <p className="text-base font-bold text-slate-900 mt-1">{product.leadTimeDays} Business Days</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Monthly Production Volume</span>
              <p className="text-base font-bold text-slate-900 mt-1">{product.productionCapacity}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Customization Services</span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {product.customizationAvailable ? "Logo, Custom Firmware & Packaging" : "Standard Factory Spec"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
