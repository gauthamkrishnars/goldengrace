"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Package, Heart, Settings, LogOut, ChevronRight, MapPin, CreditCard, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

const statusColors: Record<string, string> = {
  Delivered: "bg-green-50 text-green-600",
  "In Transit": "bg-blue-50 text-blue-600",
  Processing: "bg-amber-50 text-amber-600",
  Cancelled: "bg-red-50 text-red-600",
};

export default function ProfilePage() {
  const { user, isLoggedIn, login, logout, updateProfile, orders } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "settings">("orders");
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginForm.email, loginForm.password);
    setProfileForm({
      name: loginForm.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: loginForm.email,
      phone: "9876543210",
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setEditMode(false);
  };

  // Not logged in - show login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalNav />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h1 className="text-xl font-bold text-gray-800">My Account</h1>
              <p className="text-sm text-gray-500 mt-1">Sign in to view your orders and profile</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-brand font-medium hover:underline">Create one</Link>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Logged in - show profile dashboard
  const tabs = [
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "addresses" as const, label: "Addresses", icon: MapPin },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalNav />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center">
              <span className="text-brand font-bold text-xl">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Hello, {user?.name.split(" ")[0]}!</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
                      activeTab === tab.id
                        ? "bg-brand/5 text-brand border-l-2 border-brand"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-gray-100 mt-4 overflow-hidden">
              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Heart className="h-4 w-4" />
                My Wishlist
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </Link>
              <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Package className="h-4 w-4" />
                Shopping Cart
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-gray-800">Order History</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders yet</p>
                    <Link href="/" className="mt-3 inline-block text-brand text-sm font-medium hover:underline">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Order #{order.id}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Placed on {order.date}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="text-gray-800 font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm font-bold text-gray-800">Total: {formatPrice(order.total)}</span>
                        <button className="text-xs text-brand font-medium hover:underline">Track Order</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-bold text-gray-800">Personal Information</h2>
                  {!editMode && (
                    <button
                      onClick={() => {
                        setProfileForm({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
                        setEditMode(true);
                      }}
                      className="text-sm text-brand font-medium hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="text-sm font-medium text-gray-800">{user?.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium text-gray-800">{user?.email}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium text-gray-800">{user?.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Saved Addresses</h2>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-3">No saved addresses yet</p>
                  <button className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">
                    Add Address
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Order updates via email", icon: Bell, checked: true },
                      { label: "Promotional offers", icon: Bell, checked: false },
                      { label: "New collection alerts", icon: Bell, checked: true },
                      { label: "Price drop notifications", icon: Bell, checked: true },
                    ].map((pref) => (
                      <label key={pref.label} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <pref.icon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{pref.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={pref.checked}
                          className="rounded border-gray-300 text-brand focus:ring-brand"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Payment Methods</h2>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">No saved payment methods</p>
                    <button className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">
                      Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
