import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Golden Grace - Premium Fine Jewellery | BIS Hallmarked Diamonds & Gold",
    template: "%s | Golden Grace",
  },
  description: "Discover exquisite fine jewellery at Golden Grace. BIS hallmarked diamonds, gold, and gemstone jewellery with lifetime exchange guarantee. Shop rings, necklaces, earrings, bangles and more.",
  keywords: ["fine jewellery", "diamond jewellery", "gold jewellery", "BIS hallmarked", "rings", "necklaces", "earrings", "bangles", "pendants", "wedding jewellery"],
  authors: [{ name: "Golden Grace" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://goldengrace.com",
    siteName: "Golden Grace",
    title: "Golden Grace - Premium Fine Jewellery",
    description: "BIS hallmarked diamonds, gold, and gemstone jewellery with lifetime exchange guarantee.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Golden Grace Fine Jewellery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Grace - Premium Fine Jewellery",
    description: "BIS hallmarked diamonds, gold, and gemstone jewellery with lifetime exchange guarantee.",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=630&fit=crop&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://goldengrace.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
