import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand">Home</Link> / <span className="text-gray-700">Returns & Refunds</span>
        </nav>
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">Returns & Refunds Policy</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: August 27, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-600 leading-relaxed">
          <h2 className="font-serif text-xl font-bold text-gray-800">30-Day Return Policy</h2>
          <p>We offer a hassle-free 30-day return policy from the date of delivery. Items must be unused, in original packaging, with all tags and certificates intact.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Diamond Money-Back Guarantee</h2>
          <p>Diamond jewellery can be returned within 30 days for a full refund, no questions asked. The diamond must be accompanied by its original certificate.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Log in to your account and go to Order History</li>
            <li>Select the order and click &quot;Return Item&quot;</li>
            <li>Choose your reason and preferred resolution</li>
            <li>Schedule a free pickup from your address</li>
            <li>Refund will be processed within 5-7 business days</li>
          </ol>

          <h2 className="font-serif text-xl font-bold text-gray-800">Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customized or personalized jewellery</li>
            <li>Items without original packaging or certificates</li>
            <li>Products damaged due to customer misuse</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-gray-800">Refund Process</h2>
          <p>Refunds are processed to the original payment method. For COD orders, refunds are transferred to your bank account via NEFT within 7 business days.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
