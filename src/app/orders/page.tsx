"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, ArrowLeft, Loader2, Clock, CheckCircle, Truck, MapPin, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const statusColors: Record<string, string> = {
  delivered: "bg-green-50 text-green-600 border-green-200",
  shipped: "bg-blue-50 text-blue-600 border-blue-200",
  processing: "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-indigo-50 text-indigo-600 border-indigo-200",
  pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const { user, isLoggedIn, loading, orders, refreshOrders } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [loading, isLoggedIn, router]);

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

  const getStepIndex = (status: string) => {
    const idx = statusSteps.findIndex((s) => s.key === status.toLowerCase());
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalNav />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">My Orders</h1>
            <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancelled = order.status.toLowerCase() === "cancelled";
              const isHighlighted = highlightId === order.id;

              return (
                <div
                  key={order.id}
                  id={`order-${order.id}`}
                  className={`bg-white rounded-2xl border p-6 transition-all ${
                    isHighlighted ? "border-brand shadow-md ring-2 ring-brand/20" : "border-gray-100"
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed on {order.date}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[order.status.toLowerCase()] || statusColors.pending}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Tracking Timeline */}
                  {!isCancelled && (
                    <div className="mb-6 px-2">
                      <div className="flex items-center justify-between">
                        {statusSteps.map((step, i) => {
                          const Icon = step.icon;
                          const isComplete = i <= currentStep;
                          const isCurrent = i === currentStep;
                          return (
                            <div key={step.key} className="flex flex-col items-center flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isCurrent ? "bg-brand text-white ring-4 ring-brand/20" :
                                isComplete ? "bg-brand text-white" :
                                "bg-gray-100 text-gray-400"
                              }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <p className={`text-[10px] mt-1.5 text-center font-medium hidden sm:block ${
                                isComplete ? "text-gray-800" : "text-gray-400"
                              }`}>
                                {step.label}
                              </p>
                              {i < statusSteps.length - 1 && (
                                <div className={`absolute h-0.5 w-full ${
                                  i < currentStep ? "bg-brand" : "bg-gray-200"
                                }`} style={{ display: "none" }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand rounded-full transition-all duration-500"
                          style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="mb-6 p-3 bg-red-50 rounded-xl flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <p className="text-xs text-red-600">This order has been cancelled</p>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image && (
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-gray-800 font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-bold text-gray-800">Total: {formatPrice(order.total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
