import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand">Home</Link> / <span className="text-gray-700">Terms of Service</span>
        </nav>
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: August 27, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p>Welcome to Golden Grace. By accessing or using our website, you agree to be bound by these Terms of Service.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Products and Pricing</h2>
          <p>All product images are for illustration purposes only. Actual products may vary slightly in color and appearance. Prices are in Indian Rupees (₹) and are inclusive of all applicable taxes unless stated otherwise.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Orders and Payment</h2>
          <p>Orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment is processed securely through Razorpay. We accept UPI, credit/debit cards, net banking, and EMI options.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Shipping and Delivery</h2>
          <p>We offer free shipping on all orders. Estimated delivery is 5-7 business days. Delivery times may vary based on location and product availability.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Returns and Exchanges</h2>
          <p>We offer a 30-day return policy for unused items in original packaging. Lifetime exchange is available on all BIS hallmarked gold jewellery. Diamond jewellery comes with a 30-day money-back guarantee.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Gold Mine 10+1 Plan</h2>
          <p>The Gold Mine 10+1 installment plan allows you to pay in 10 equal monthly installments with a 100% discount on the 11th month. Enrollment is voluntary and subject to terms communicated at the time of signup.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Limitation of Liability</h2>
          <p>Golden Grace shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Contact</h2>
          <p>For questions about these Terms, contact us at support@goldengrace.com.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
