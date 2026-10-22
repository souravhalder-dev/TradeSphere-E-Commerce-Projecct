"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Globe,
  Search,
  ShoppingCart,
  User,
  ShieldCheck,
  FileText,
  Building2,
  ChevronDown,
  Menu,
  X,
  Store,
  Layers,
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [cartCount, setCartCount] = useState(0);

  // Sync cart count from localStorage
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("tradesphere_cart");
        if (stored) {
          const items = JSON.parse(stored);
          const totalQty = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cart_updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart_updated", updateCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner / Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trade Assurance Guarantee: Order Protection from Payment to Delivery
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer hover:text-white"
              >
                <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
                <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
                <option value="BDT" className="bg-slate-900 text-white">BDT (৳)</option>
                <option value="CNY" className="bg-slate-900 text-white">CNY (¥)</option>
              </select>
            </div>

            <span className="text-slate-600">|</span>

            <Link href="/seller" className="hover:text-white transition flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-blue-400" />
              Seller Center
            </Link>

            <span className="text-slate-600">|</span>

            <Link href="/admin" className="hover:text-white transition flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Admin Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Trade<span className="text-blue-600">Sphere</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 tracking-wider uppercase -mt-1">
                Global B2B & B2C Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            action="/products"
            method="GET"
            className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-blue-600 rounded-lg overflow-hidden shadow-sm"
          >
            <div className="relative">
              <select
                name="category"
                aria-label="Category Filter"
                className="bg-slate-50 text-slate-700 text-xs font-medium py-3 px-3 border-r border-slate-200 focus:outline-none cursor-pointer hover:bg-slate-100"
              >
                <option value="">All Categories</option>
                <option value="industrial-machinery">Industrial Machinery</option>
                <option value="electronics-components">Electronics & IoT</option>
                <option value="apparel-textiles">Apparel & Textiles</option>
                <option value="renewable-energy">Renewable Energy</option>
                <option value="packaging-supplies">Packaging Supplies</option>
              </select>
            </div>

            <input
              type="text"
              name="q"
              placeholder="Search products, industrial equipment, OEM suppliers, or specifications..."
              className="flex-1 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-semibold flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Actions & Navigation */}
          <div className="flex items-center gap-4">
            {/* RFQ Quick Link */}
            <Link
              href="/rfq"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-2 rounded-lg transition border border-slate-200"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Request Quotation (RFQ)</span>
            </Link>

            {/* Account Menu */}
            <div className="relative group">
              <button
                aria-label="User Account Menu"
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 text-xs font-medium p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Account</div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    Sign In <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </button>

              {/* Account Dropdown */}
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Welcome to TradeSphere</p>
                  <p className="text-[11px] text-slate-500">Sign in to manage orders & RFQs</p>
                </div>
                <div className="p-1 space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                  >
                    Buyer Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                  >
                    Register New Account
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <Link
                    href="/seller"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Supplier / Seller Dashboard
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    Admin Control Center
                  </Link>
                </div>
              </div>
            </div>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Quick Links Bar */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-200 px-4 sm:px-8 py-2 text-xs font-medium text-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/products" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
              <span>All Products</span>
            </Link>
            <Link href="/products?category=industrial-machinery" className="hover:text-blue-600 transition">
              Industrial Machinery
            </Link>
            <Link href="/products?category=electronics-components" className="hover:text-blue-600 transition">
              Electronics & IoT
            </Link>
            <Link href="/products?category=apparel-textiles" className="hover:text-blue-600 transition">
              Apparel & Textiles
            </Link>
            <Link href="/products?category=renewable-energy" className="hover:text-blue-600 transition">
              Renewable Energy
            </Link>
            <Link href="/products?category=packaging-supplies" className="hover:text-blue-600 transition">
              Packaging Supplies
            </Link>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/rfq" className="hover:text-blue-600 flex items-center gap-1 font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live RFQ Market
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          <form action="/products" method="GET" className="flex border border-slate-300 rounded-lg overflow-hidden">
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 pt-2">
            <Link href="/products" className="block text-sm font-medium text-slate-800 py-1.5">
              Browse All Products
            </Link>
            <Link href="/rfq" className="block text-sm font-medium text-slate-800 py-1.5">
              Post or View RFQs
            </Link>
            <Link href="/seller" className="block text-sm font-medium text-blue-600 py-1.5">
              Seller Dashboard
            </Link>
            <Link href="/admin" className="block text-sm font-medium text-purple-600 py-1.5">
              Admin Control Center
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
