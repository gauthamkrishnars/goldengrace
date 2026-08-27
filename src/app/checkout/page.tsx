"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, CreditCard, MapPin, Package, ArrowLeft, ArrowRight, Shield, Loader2, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";

type Step = "address" | "payment" | "confirmation";

const steps: { id: Step; label: string; icon: typeof MapPin }[] = [
  { id: "address", label: "Address", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmation", label: "Confirmation", icon: Package },
];

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, isLoggedIn, login, refreshOrders } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("address");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Login form for checkout
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPassword, setCheckoutPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  // Pre-fill address from saved addresses
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const fetchDefaultAddress = async () => {
      try {
        const { data } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .single();
        if (data) {
          setAddress({
            fullName: data.full_name,
            phone: data.phone,
            addressLine1: data.address_line1,
            addressLine2: data.address_line2 || "",
            city: data.city,
            state: data.state,
            pincode: data.pincode,
          });
        }
      } catch {
        // No default address
      }
    };
    fetchDefaultAddress();
  }, [isLoggedIn, user]);

  const handleCheckoutLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(false);
    const result = await login(checkoutEmail, checkoutPassword);
    if (result.error) {
      setLoginError(true);
    }
    setLoginLoading(false);
  };

  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = "Name is required";
    if (!address.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(address.phone)) errs.phone = "Invalid 10-digit phone";
    if (!address.addressLine1.trim()) errs.addressLine1 = "Address is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.state.trim()) errs.state = "State is required";
    if (!address.pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode)) errs.pincode = "Invalid 6-digit pincode";
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === "address") {
      if (validateAddress()) setCurrentStep("payment");
    } else if (currentStep === "payment") handlePayment();
  };

  const handleBack = () => {
    if (currentStep === "payment") setCurrentStep("address");
  };

  const handlePayment = async () => {
    setProcessing(true);
    const orderItems = items.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
    }));

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, currency: "INR" }),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.key) {
          // Real Razorpay
          const options: RazorpayOptions = {
            key: data.key,
            amount: data.amount || totalPrice * 100,
            currency: data.currency || "INR",
            name: "Golden Grace",
            description: `Order - ${totalItems} items`,              handler: async (response: RazorpayResponse) => {
              const newOrderId = response.razorpay_payment_id || `GG-${Date.now().toString(36).toUpperCase()}`;
              const saved = await saveOrder(newOrderId, orderItems, response.razorpay_payment_id);
              if (saved) {
                await refreshOrders();
                setOrderId(newOrderId);
                setOrderPlaced(true);
                setCurrentStep("confirmation");
                clearCart();
              }
              setProcessing(false);
            },
            prefill: {
              name: user?.name || address.fullName,
              email: user?.email || "",
              contact: address.phone,
            },
            theme: { color: "#587284" },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", () => {
            setProcessing(false);
            alert("Payment failed. Please try again.");
          });
          rzp.open();
          return;
        }
      }
    } catch {
      // API not available
    }

    // Demo mode
    const newOrderId = `GG-${Date.now().toString(36).toUpperCase()}`;
    const saved = await saveOrder(newOrderId, orderItems, null);
    if (saved) {
      await refreshOrders();
      setTimeout(() => {
        setOrderId(newOrderId);
        setOrderPlaced(true);
        setCurrentStep("confirmation");
        clearCart();
        setProcessing(false);
      }, 1500);
    } else {
      setProcessing(false);
    }
  };

  const [orderError, setOrderError] = useState("");

  const saveOrder = async (id: string, orderItems: Record<string, unknown>[], paymentId: string | null): Promise<boolean> => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          userId: user?.id || "",
          userEmail: user?.email || checkoutEmail,
          userName: user?.name || checkoutEmail.split("@")[0],
          userPhone: address.phone,
          items: orderItems,
          subtotal: totalPrice,
          shipping: 0,
          total: totalPrice,
          shippingAddress: address,
          paymentMethod,
          paymentId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Order save failed:", result.error);
        setOrderError(result.error || "Failed to save order. Please try again.");
        return false;
      }

      // Send confirmation email (non-blocking)
      fetch("/api/send-order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          customerName: user?.name || checkoutEmail.split("@")[0],
          customerEmail: user?.email || checkoutEmail,
          items: orderItems,
          total: totalPrice,
          shippingAddress: address,
        }),
      }).catch(() => {});

      return true;
    } catch (err) {
      console.error("Failed to save order:", err);
      setOrderError("Network error. Please try again.");
      return false;
    }
  };

  // Not logged in — show login gate
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold text-gray-800">GOLDEN GRACE</Link>
            <h1 className="text-sm font-semibold text-gray-600">Checkout</h1>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogIn className="h-7 w-7 text-brand" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Login Required</h2>
              <p className="text-sm text-gray-500 mt-1">Please login to proceed with checkout and track your orders</p>
            </div>

            <form onSubmit={handleCheckoutLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={checkoutEmail} onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={checkoutPassword} onChange={(e) => setCheckoutPassword(e.target.value)}
                  placeholder="Min 6 characters" required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              {loginError && <p className="text-xs text-red-500">Please enter a valid email and password (min 6 chars)</p>}
              <button type="submit" disabled={loginLoading}
                className="w-full py-3 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loginLoading ? "Logging in..." : "Login & Continue to Checkout"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-100" />
            </div>

            <Link href="/auth/signup" className="block w-full py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg text-center hover:bg-gray-50 transition-colors">
              Create New Account
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link href="/cart" className="hover:text-brand">&larr; Back to Cart</Link>
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">No items to checkout</h1>
          <p className="text-sm text-gray-500 mb-6">Add some items to your cart first</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-gray-800">GOLDEN GRACE</Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{user?.email}</span>
            <h1 className="text-sm font-semibold text-gray-600">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= stepIndex;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isCurrent ? "bg-brand text-white" : isActive ? "bg-brand/10 text-brand" : "bg-gray-100 text-gray-400"
                }`}>
                  {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < stepIndex ? "bg-brand" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentStep === "address" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.fullName ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-brand/20"}`} />
                      {addressErrors.fullName && <p className="text-xs text-red-500 mt-1">{addressErrors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.phone ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-brand/20"}`} />
                      {addressErrors.phone && <p className="text-xs text-red-500 mt-1">{addressErrors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input type="text" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      placeholder="House/Flat No., Building Name"
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.addressLine1 ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-brand/20"}`} />
                    {addressErrors.addressLine1 && <p className="text-xs text-red-500 mt-1">{addressErrors.addressLine1}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                    <input type="text" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                      placeholder="Street, Landmark"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.city ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-brand/20"}`} />
                      {addressErrors.city && <p className="text-xs text-red-500 mt-1">{addressErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.state ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-brand/20"}`} />
                      {addressErrors.state && <p className="text-xs text-red-500 mt-1">{addressErrors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${addressErrors.pincode ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-brand/20"}`} />
                      {addressErrors.pincode && <p className="text-xs text-red-500 mt-1">{addressErrors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                {orderError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                    <span className="text-red-500 text-sm">{orderError}</span>
                  </div>
                )}
                <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: "razorpay", label: "Razorpay (UPI / Cards / Net Banking / Wallets)", icon: "R" },
                    { id: "cod", label: "Cash on Delivery", icon: "C" },
                  ].map((method) => (
                    <label key={method.id}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === method.id ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)} className="text-brand focus:ring-brand" />
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{method.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-700 flex items-center gap-1.5">
                    <Shield className="h-4 w-4" /> Razorpay processes payments securely. No card details stored on our servers.
                  </p>
                </div>
              </div>
            )}

            {currentStep === "confirmation" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                <p className="text-sm text-gray-500 mb-1">Order ID: #{orderId}</p>
                <p className="text-sm text-gray-500 mb-6">You will receive a confirmation email and SMS with tracking details.</p>
                <div className="bg-accent-pink rounded-xl p-4 mb-6 max-w-sm mx-auto">
                  <p className="text-xs text-accent-rose-gold font-semibold">Estimated delivery: 5-7 business days</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/" className="px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors">
                    Continue Shopping
                  </Link>
                  <Link href="/profile" className="px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    Track Order
                  </Link>
                </div>
              </div>
            )}
          </div>

          {currentStep !== "confirmation" && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        <Image src={item.product.images[0]} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal ({totalItems} items)</span><span>{formatPrice(totalPrice)}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-600 font-medium">FREE</span></div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
                </div>
                <div className="flex gap-3 mt-5">
                  {currentStep === "payment" && (
                    <button onClick={handleBack} className="px-4 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={handleNext} disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50">
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {processing ? "Processing..." : currentStep === "payment" ? "Pay Now" : "Continue"}
                    {!processing && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
