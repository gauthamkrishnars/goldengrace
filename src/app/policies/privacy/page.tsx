import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand">Home</Link> / <span className="text-gray-700">Privacy Policy</span>
        </nav>
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: August 27, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p>Golden Grace (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the goldengrace.vercel.app website. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our service.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Information We Collect</h2>
          <p>We collect information you provide directly to us, including: name, email address, phone number, shipping address, payment information, and purchase history.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfill your orders</li>
            <li>To send order confirmations and tracking updates</li>
            <li>To provide customer support</li>
            <li>To send promotional communications (with your consent)</li>
            <li>To improve our website and services</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-gray-800">Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information. Payment processing is handled securely through Razorpay, and we do not store complete credit card details on our servers.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Third-Party Services</h2>
          <p>We use Supabase for database management and Razorpay for payment processing. Both services have their own privacy policies governing the use of your information.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at support@goldengrace.com.</p>

          <h2 className="font-serif text-xl font-bold text-gray-800">Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at support@goldengrace.com.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
