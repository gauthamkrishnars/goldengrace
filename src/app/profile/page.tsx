"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, Settings, LogOut, ChevronRight, MapPin, CreditCard, Bell, Loader2, Plus, Trash2, Edit3, Check, X, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import { supabase } from "@/lib/supabase";
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

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const emptyAddress = { full_name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pincode: "" };

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, logout, updateProfile, orders, refreshOrders, supabaseUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "settings">("orders");
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [savingAddress, setSavingAddress] = useState(false);

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

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    if (!supabaseUser) return;
    setAddressLoading(true);
    try {
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
      if (data) setAddresses(data);
    } catch {
      // Table might not exist
    }
    setAddressLoading(false);
  }, [supabaseUser]);

  useEffect(() => {
    if (activeTab === "addresses") fetchAddresses();
  }, [activeTab, fetchAddresses]);

  const validateAddressForm = () => {
    const errs: Record<string, string> = {};
    if (!addressForm.full_name.trim()) errs.full_name = "Name is required";
    if (!addressForm.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(addressForm.phone)) errs.phone = "Invalid 10-digit phone";
    if (!addressForm.address_line1.trim()) errs.address_line1 = "Address is required";
    if (!addressForm.city.trim()) errs.city = "City is required";
    if (!addressForm.state.trim()) errs.state = "State is required";
    if (!addressForm.pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(addressForm.pincode)) errs.pincode = "Invalid 6-digit pincode";
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddressForm() || !supabaseUser) return;
    setSavingAddress(true);

    try {
      // If setting as default, unset other defaults first
      if (!editingAddress || addresses.length === 0) {
        await supabase
          .from("addresses")
          .update({ is_default: false, updated_at: new Date().toISOString() })
          .eq("user_id", supabaseUser.id)
          .eq("is_default", true);
      }

      const addressData = {
        user_id: supabaseUser.id,
        full_name: addressForm.full_name,
        phone: addressForm.phone,
        address_line1: addressForm.address_line1,
        address_line2: addressForm.address_line2,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        is_default: addresses.length === 0, // First address is default
        updated_at: new Date().toISOString(),
      };

      if (editingAddress) {
        await supabase.from("addresses").update(addressData).eq("id", editingAddress);
      } else {
        await supabase.from("addresses").insert(addressData);
      }

      await fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm(emptyAddress);
    } catch {
      // Table might not exist
    }
    setSavingAddress(false);
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr.id);
    setAddressForm({
      full_name: addr.full_name,
      phone: addr.phone,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await supabase.from("addresses").delete().eq("id", id);
      await fetchAddresses();
    } catch {
      // ignore
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!supabaseUser) return;
    try {
      await supabase.from("addresses").update({ is_default: false, updated_at: new Date().toISOString() }).eq("user_id", supabaseUser.id);
      await supabase.from("addresses").update({ is_default: true, updated_at: new Date().toISOString() }).eq("id", id);
      await fetchAddresses();
    } catch {
      // ignore
    }
  };

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
            {/* ORDERS TAB */}
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
                            <span className="text-gray-600">{item.name} x {item.quantity}</span>
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

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-bold text-gray-800">Personal Information</h2>
                  {!editMode && (
                    <button onClick={() => { setProfileForm({ name: user.name, email: user.email, phone: user.phone }); setEditMode(true); }} className="text-sm text-brand font-medium hover:underline">
                      Edit
                    </button>
                  )}
                </div>
                {editMode ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={profileForm.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">Save Changes</button>
                      <button type="button" onClick={() => setEditMode(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
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

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-gray-800">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button onClick={() => { setShowAddressForm(true); setEditingAddress(null); setAddressForm(user ? { ...emptyAddress, full_name: user.name, phone: user.phone } : emptyAddress); }} className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">
                      <Plus className="h-4 w-4" /> Add Address
                    </button>
                  )}
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <input type="text" value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.full_name ? "border-red-300" : "border-gray-200 focus:ring-brand/20"}`} />
                          {addressErrors.full_name && <p className="text-xs text-red-500 mt-1">{addressErrors.full_name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                          <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.phone ? "border-red-300" : "border-gray-200 focus:ring-brand/20"}`} />
                          {addressErrors.phone && <p className="text-xs text-red-500 mt-1">{addressErrors.phone}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" value={addressForm.address_line1} onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })} placeholder="House/Flat No., Building Name" className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.address_line1 ? "border-red-300" : "border-gray-200 focus:ring-brand/20"}`} />
                        {addressErrors.address_line1 && <p className="text-xs text-red-500 mt-1">{addressErrors.address_line1}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input type="text" value={addressForm.address_line2} onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })} placeholder="Street, Landmark (optional)" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.city ? "border-red-300" : "border-gray-200 focus:ring-brand/20"}`} />
                          {addressErrors.city && <p className="text-xs text-red-500 mt-1">{addressErrors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                          <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.state ? "border-red-300" : "border-gray-200 focus:ring-brand/20"}`} />
                          {addressErrors.state && <p className="text-xs text-red-500 mt-1">{addressErrors.state}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                          <input type="text" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.pincode ? "border-red-300" : "border-gray-200 focus:ring-brand/20"}`} />
                          {addressErrors.pincode && <p className="text-xs text-red-500 mt-1">{addressErrors.pincode}</p>}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={savingAddress} className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50">
                          {savingAddress && <Loader2 className="h-4 w-4 animate-spin" />}
                          {savingAddress ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                        </button>
                        <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); setAddressForm(emptyAddress); setAddressErrors({}); }} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address List */}
                {addressLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 text-brand animate-spin" />
                  </div>
                ) : addresses.length === 0 && !showAddressForm ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-3">No saved addresses yet</p>
                    <p className="text-xs text-gray-400">Add an address to use during checkout</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`bg-white rounded-2xl border p-5 transition-all ${addr.is_default ? "border-brand ring-1 ring-brand/20" : "border-gray-100"}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-800">{addr.full_name}</span>
                            {addr.is_default && (
                              <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">Default</span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-0.5 mb-4">
                          <p>{addr.address_line1}</p>
                          {addr.address_line2 && <p>{addr.address_line2}</p>}
                          <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-gray-400">Phone: {addr.phone}</p>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                          {!addr.is_default && (
                            <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-brand font-medium hover:underline">
                              Set as Default
                            </button>
                          )}
                          <button onClick={() => handleEditAddress(addr)} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" title="Edit">
                            <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 rounded-md hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
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
