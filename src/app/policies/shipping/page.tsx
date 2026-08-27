import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand">Home</Link> / <span className="text-gray-700">Shipping Policy</span>
        </nav>
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">Shipping Policy</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: August 27, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-600 leading-relaxed">
          <h2 className="font-serif text-xl font-bold text-gray-800">Free Shipping</h2>
          <p>Golden Grace offers free shipping on all orders across India. No minimum order value is required.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Delivery Timeline</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Metro Cities:</strong> 3-5 business days</li>
            <li><strong>Tier 2 Cities:</strong> 5-7 business days</li>
            <li><strong>Remote Areas:</strong> 7-10 business days</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-gray-800">Order Tracking</h2>
          <p>Once your order is shipped, you will receive an SMS and email with the tracking ID. You can track your order from your account dashboard or using the courier partner&apos;s website.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Secure Packaging</h2>
          <p>All jewellery is shipped in tamper-proof, insulated packaging with insurance coverage. Our delivery partners are trained to handle high-value shipments with care.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Cash on Delivery</h2>
          <p>COD is not available for orders above ₹50,000. For high-value orders, full online payment is required.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">International Shipping</h2>
          <p>Currently, we ship only within India. International shipping will be available soon.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
