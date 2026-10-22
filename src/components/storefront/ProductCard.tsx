import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Star, Clock, Factory } from "lucide-react";
import { MockProduct } from "@/lib/data/mock-data";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: MockProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  // Determine pricing display (range if multiple tiers exist)
  const hasTiers = product.priceTiers && product.priceTiers.length > 0;
  const lowestPrice = hasTiers
    ? Math.min(...product.priceTiers.map((t) => t.unitPrice))
    : product.basePrice;
  const highestPrice = product.basePrice;

  const priceDisplay =
    lowestPrice < highestPrice
      ? `${formatCurrency(lowestPrice)} - ${formatCurrency(highestPrice)}`
      : formatCurrency(highestPrice);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80";

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 transition flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
          />

          {/* MOQ Badge */}
          <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
            MOQ: {product.moq} {product.moq === 1 ? "unit" : "units"}
          </div>

          {/* Sample Badge */}
          {product.sampleAvailable && (
            <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Sample Ready
            </div>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-4">
          {/* Price Range */}
          <div className="mb-1.5">
            <span className="text-lg font-bold text-slate-900">{priceDisplay}</span>
            <span className="text-xs text-slate-500 font-normal ml-1">/ unit</span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 transition min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-semibold text-slate-800">{product.ratingAverage.toFixed(1)}</span>
            <span className="text-slate-400">({product.reviewCount} reviews)</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{product.salesCount} sold</span>
          </div>

          {/* Supplier Info */}
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-700 truncate max-w-[160px] flex items-center gap-1">
                <Factory className="w-3 h-3 text-slate-400 flex-shrink-0" />
                {product.sellerStoreName}
              </span>
              <span className="text-slate-500 font-medium">{product.countryOfOrigin}</span>
            </div>

            {product.sellerVerified && (
              <div className="flex items-center gap-1 text-[11px] text-blue-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Supplier</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 pb-4 pt-1">
        <Link
          href={`/products/${product.slug}`}
          className="w-full block text-center bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-transparent text-slate-700 text-xs font-semibold py-2 rounded-lg transition"
        >
          View Specs & Wholesale Tiers
        </Link>
      </div>
    </div>
  );
}
