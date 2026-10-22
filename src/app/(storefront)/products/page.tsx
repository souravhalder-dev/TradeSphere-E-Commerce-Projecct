import Link from "next/link";
import { Search, Filter, SlidersHorizontal, CheckSquare, ShieldCheck } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { ProductCard } from "@/components/storefront/ProductCard";

interface ProductsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    moqMax?: string;
    verifiedOnly?: string;
    country?: string;
    sort?: "relevance" | "price_asc" | "price_desc" | "rating" | "moq";
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [categories, products] = await Promise.all([
    repository.getCategories(),
    repository.getProducts({
      searchQuery: searchParams.q,
      categorySlug: searchParams.category,
      minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
      moqMax: searchParams.moqMax ? parseInt(searchParams.moqMax) : undefined,
      verifiedOnly: searchParams.verifiedOnly === "true",
      country: searchParams.country,
      sortBy: searchParams.sort || "relevance",
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === searchParams.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 font-semibold text-slate-800">
          Products
        </Link>
        {activeCategory && (
          <>
            <span>/</span>
            <span className="text-slate-800 font-medium">{activeCategory.name}</span>
          </>
        )}
      </nav>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {activeCategory ? activeCategory.name : searchParams.q ? `Search Results for "${searchParams.q}"` : "Wholesale Sourcing Catalog"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{products.length}</strong> products matching your sourcing criteria
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 font-medium">Sort By:</label>
          <form method="GET" action="/products" className="inline">
            {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
            {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
            <select
              name="sort"
              aria-label="Sort products by"
              defaultValue={searchParams.sort || "relevance"}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Supplier Rating</option>
              <option value="moq">Lowest MOQ</option>
            </select>
          </form>
        </div>
      </div>

      {/* Layout Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <form method="GET" action="/products" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Refine Search
              </span>
              <Link href="/products" className="text-xs text-blue-600 hover:underline">
                Reset
              </Link>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keywords</label>
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q || ""}
                placeholder="Product or SKU..."
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
              <select
                name="category"
                aria-label="Category Selection"
                defaultValue={searchParams.category || ""}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Price Range ($)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={searchParams.minPrice || ""}
                  placeholder="Min"
                  className="w-1/2 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={searchParams.maxPrice || ""}
                  placeholder="Max"
                  className="w-1/2 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                />
              </div>
            </div>

            {/* MOQ Max */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Max MOQ (Units)</label>
              <input
                type="number"
                name="moqMax"
                defaultValue={searchParams.moqMax || ""}
                placeholder="e.g. 50"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
              />
            </div>

            {/* Supplier Type */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Supplier Credentials</label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="verifiedOnly"
                  value="true"
                  defaultChecked={searchParams.verifiedOnly === "true"}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Verified Suppliers Only
                </span>
              </label>
            </div>

            {/* Country of Origin */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country / Region</label>
              <select
                name="country"
                aria-label="Country of Origin"
                defaultValue={searchParams.country || ""}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Countries</option>
                <option value="US">United States (US)</option>
                <option value="CN">China (CN)</option>
                <option value="DE">Germany (DE)</option>
                <option value="BD">Bangladesh (BD)</option>
                <option value="JP">Japan (JP)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg transition"
            >
              Apply Sourcing Filters
            </button>
          </form>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-6">
          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your price range, clearing filters, or submit a custom RFQ to request quotes from our global network of manufacturers.
              </p>
              <div className="pt-2">
                <Link
                  href="/rfq"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit a Custom RFQ
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
