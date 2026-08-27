"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, Settings, LogOut, ChevronRight, MapPin, CreditCard, Bell, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

const statusColors: Record<string, string> = {
  delivered: "bg-green-50 text-green-600",
  shipped: "bg-blue-50 text-blue-600",
  processing: "bg-amber-50 text-amber-600",
  confirmed: "bg-indigo-50 text-indigo-600",
  pending: "bg-yellow-50 text-yellow-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, logout, updateProfile, orders, refreshOrders } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "settings">("orders");
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email, phone: user.phone });
    }
  }, [user]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalNav />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileForm);
    setEditMode(false);
  };

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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center">
              <span className="text-brand font-bold text-xl">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Hello, {user.name?.split(" ")[0] || "there"}!
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={async () => { await logout(); router.push("/"); }}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

            <div className="bg-white rounded-2xl border border-gray-100 mt-4 overflow-hidden">
              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Heart className="h-4 w-4" />
                My Wishlist
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </Link>
              <button onClick={() => { setActiveTab("orders"); refreshOrders(); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left">
                <Package className="h-4 w-4" />
                Track Orders
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </button>
              <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Package className="h-4 w-4" />
                Shopping Cart
                <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-gray-800">Order History</h2>
                  <button onClick={refreshOrders} className="text-xs text-brand hover:underline">Refresh</button>
                </div>
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
                          <p className="text-sm font-semibold text-gray-800">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Placed on {order.date}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status.toLowerCase()] || statusColors.pending}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="text-gray-800 font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm font-bold text-gray-800">Total: {formatPrice(order.total)}</span>
                        <button onClick={() => setActiveTab("orders")} className="text-xs text-brand font-medium hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-bold text-gray-800">Personal Information</h2>
                  {!editMode && (
                    <button
                      onClick={() => { setProfileForm({ name: user.name, email: user.email, phone: user.phone }); setEditMode(true); }}
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
                      <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={profileForm.email} disabled
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">
                        Save Changes
                      </button>
                      <button type="button" onClick={() => setEditMode(false)}
                        className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="text-sm font-medium text-gray-800">{user.name || "Not set"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium text-gray-800">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium text-gray-800">{user.phone || "Not set"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Saved Addresses</h2>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-3">No saved addresses yet</p>
                  <p className="text-xs text-gray-400">Addresses are saved during checkout</p>
                </div>
              </div>
            )}

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
                        <input type="checkbox" defaultChecked={pref.checked} className="rounded border-gray-300 text-brand focus:ring-brand" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">Payment Methods</h2>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">No saved payment methods</p>
                    <p className="text-xs text-gray-400">Payments are processed securely via Razorpay</p>
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
