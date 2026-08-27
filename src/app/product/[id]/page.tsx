"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Truck, Shield, RotateCcw, ChevronRight, Star, Minus, Plus, Check, Loader2 } from "lucide-react";
import { formatPrice } from "@/data/products";
import { Product } from "@/data/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";
import ProductReviews from "@/components/reviews/ProductReviews";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    // Fetch all products from API, then find this one
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setAllProducts(data);
        const found = data.find((p) => p.id === id);
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const relatedProducts = product
    ? allProducts.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4)
    : [];

  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (inWishlist) removeWishlist(product.id);
    else addWishlist(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNav />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-brand animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalNav />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
            <p className="text-gray-500 mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="mt-4 inline-block text-brand font-medium hover:underline">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />

      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="text-xs text-gray-400 flex items-center flex-wrap">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <Link href={`/category/${product.categorySlug}`} className="hover:text-brand">{product.category}</Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-gray-700">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw" priority />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isNew && <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>}
                {product.isBestseller && <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">BESTSELLER</span>}
                {product.discount && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{product.discount}% OFF</span>}
              </div>
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-brand" : "border-gray-100 hover:border-gray-200"}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{product.shortDescription}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm text-green-600 font-semibold">Save {product.discount}%</span>
                </>
              )}
            </div>

            <div className="bg-accent-pink rounded-xl p-3">
              <p className="text-xs text-accent-rose-gold font-semibold">
                🚚 Free shipping on all orders • 💎 BIS Hallmarked • 🔄 Lifetime exchange
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50 transition-colors" aria-label="Decrease">
                  <Minus className="h-4 w-4 text-gray-500" />
                </button>
                <span className="px-4 text-sm font-semibold text-gray-800 min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-50 transition-colors" aria-label="Increase">
                  <Plus className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <button onClick={handleAddToCart} disabled={addedToCart}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${addedToCart ? "bg-green-500 text-white" : "bg-brand text-white hover:bg-brand/90"}`}>
                {addedToCart ? <span className="flex items-center justify-center gap-1.5"><Check className="h-4 w-4" /> Added to Cart</span> : "Add to Cart"}
              </button>
              <button onClick={toggleWishlist}
                className={`p-3 border rounded-xl transition-colors ${inWishlist ? "border-red-200 bg-red-50" : "border-gray-200 hover:bg-gray-50"}`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                <Heart className={`h-5 w-5 transition-colors ${inWishlist ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center"><Truck className="h-5 w-5 text-brand mx-auto mb-1" /><p className="text-[10px] text-gray-500">Free Shipping</p></div>
              <div className="text-center"><Shield className="h-5 w-5 text-brand mx-auto mb-1" /><p className="text-[10px] text-gray-500">Lifetime Exchange</p></div>
              <div className="text-center"><RotateCcw className="h-5 w-5 text-brand mx-auto mb-1" /><p className="text-[10px] text-gray-500">30-Day Returns</p></div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Product Details</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between py-1.5 bg-gray-50 px-2 rounded"><span className="text-gray-500">Metal</span><span className="text-gray-700 font-medium">{product.metal}</span></div>
                <div className="flex justify-between py-1.5 bg-gray-50 px-2 rounded"><span className="text-gray-500">Metal Weight</span><span className="text-gray-700 font-medium">{product.metalWeight}</span></div>
                {product.stone && <div className="flex justify-between py-1.5 bg-gray-50 px-2 rounded"><span className="text-gray-500">Stone</span><span className="text-gray-700 font-medium">{product.stone}</span></div>}
                {product.stoneWeight && <div className="flex justify-between py-1.5 bg-gray-50 px-2 rounded"><span className="text-gray-500">Stone Weight</span><span className="text-gray-700 font-medium">{product.stoneWeight}</span></div>}
                <div className="flex justify-between py-1.5 bg-gray-50 px-2 rounded col-span-2"><span className="text-gray-500">SKU</span><span className="text-gray-700 font-medium">{product.sku}</span></div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-3xl">
          <ProductReviews productId={product.id} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-800 mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
