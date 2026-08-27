import { Product, Category } from "./types";

export const categories: Category[] = [
  {
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop&q=80",
    description: "Discover our exquisite collection of rings, from timeless solitaires to modern designs.",
    productCount: 10,
  },
  {
    name: "Pendants",
    slug: "pendants",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop&q=80",
    description: "Beautiful pendants that add elegance to any outfit.",
    productCount: 10,
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=300&h=300&fit=crop&q=80",
    description: "Stunning earrings crafted with precision and care.",
    productCount: 10,
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=300&h=300&fit=crop&q=80",
    description: "Elegant necklaces to complete your look.",
    productCount: 9,
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop&q=80",
    description: "Delicate bracelets for everyday elegance.",
    productCount: 8,
  },
  {
    name: "Bangles",
    slug: "bangles",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=300&fit=crop&q=80",
    description: "Traditional and contemporary bangles.",
    productCount: 8,
  },
];

// ═══════════════════════════════════════════════════
// CATEGORY-SPECIFIC IMAGE POOLS (verified working)
// ═══════════════════════════════════════════════════

const ringImages = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop&q=80",
];

const pendantImages = [
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&q=80",
];

const earringImages = [
  "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop&q=80",
];

const necklaceImages = [
  "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&q=80",
];

const braceletImages = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&q=80",
];

const bangleImages = [
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=600&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
];

// Helper to pick images from a pool
function pick(pool: string[], count: number, offset = 0): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[(offset + i) % pool.length]);
  }
  return result;
}

export const products: Product[] = [
  // ═══════════════════════════════════════════════════
  // RINGS (10 products) — all use ringImages
  // ═══════════════════════════════════════════════════
  {
    id: "ring-001", name: "Eternal Diamond Solitaire", slug: "eternal-diamond-solitaire",
    category: "Rings", categorySlug: "rings",
    price: 45999, originalPrice: 52999, discount: 13,
    description: "A breathtaking 1 carat round brilliant diamond set in 18K white gold. Classic prong setting maximizes brilliance and fire.",
    shortDescription: "18K White Gold | 1 Ct Diamond",
    images: pick(ringImages, 3, 0),
    metal: "18K White Gold", metalWeight: "3.2g", stone: "Diamond", stoneWeight: "1.00 Ct",
    sku: "RNG-WGD-001", rating: 4.8, reviewCount: 234, inStock: true, isBestseller: true,
    tags: ["diamond", "solitaire", "engagement", "white gold"],
  },
  {
    id: "ring-002", name: "Rose Elegance Band", slug: "rose-elegance-band",
    category: "Rings", categorySlug: "rings", price: 18499,
    description: "A delicate rose gold band adorned with micro-pavé diamonds. Perfect as a wedding band or everyday accessory.",
    shortDescription: "14K Rose Gold | Pavé Diamonds",
    images: pick(ringImages, 2, 1),
    metal: "14K Rose Gold", metalWeight: "2.8g", stone: "Diamond", stoneWeight: "0.30 Ct",
    sku: "RNG-RGD-002", rating: 4.6, reviewCount: 156, inStock: true,
    tags: ["diamond", "rose gold", "wedding", "band"],
  },
  {
    id: "ring-003", name: "Sapphire Halo Ring", slug: "sapphire-halo-ring",
    category: "Rings", categorySlug: "rings",
    price: 32999, originalPrice: 38999, discount: 15,
    description: "A stunning blue sapphire surrounded by a halo of brilliant diamonds, set in 18K white gold.",
    shortDescription: "18K White Gold | Blue Sapphire",
    images: pick(ringImages, 2, 2),
    metal: "18K White Gold", metalWeight: "4.1g", stone: "Blue Sapphire", stoneWeight: "1.50 Ct",
    sku: "RNG-BSA-003", rating: 4.7, reviewCount: 89, inStock: true, isNew: true,
    tags: ["sapphire", "halo", "blue", "white gold"],
  },
  {
    id: "ring-004", name: "Emerald Three-Stone Ring", slug: "emerald-three-stone-ring",
    category: "Rings", categorySlug: "rings", price: 58999,
    description: "Three vivid Colombian emeralds flanked by baguette diamonds in a vintage-inspired 18K gold setting.",
    shortDescription: "18K Yellow Gold | Colombian Emerald",
    images: pick(ringImages, 2, 3),
    metal: "18K Yellow Gold", metalWeight: "5.5g", stone: "Emerald", stoneWeight: "2.10 Ct Total",
    sku: "RNG-EMG-004", rating: 4.9, reviewCount: 42, inStock: true, isNew: true,
    tags: ["emerald", "three stone", "vintage", "yellow gold"],
  },
  {
    id: "ring-005", name: "Twisted Vine Diamond Ring", slug: "twisted-vine-diamond-ring",
    category: "Rings", categorySlug: "rings",
    price: 28999, originalPrice: 34999, discount: 17,
    description: "An organic, nature-inspired ring with intertwining diamond-studded vines in rose gold.",
    shortDescription: "14K Rose Gold | 0.75 Ct Diamond",
    images: pick(ringImages, 2, 4),
    metal: "14K Rose Gold", metalWeight: "3.0g", stone: "Diamond", stoneWeight: "0.75 Ct",
    sku: "RNG-TVD-005", rating: 4.5, reviewCount: 112, inStock: true,
    tags: ["diamond", "nature", "twisted", "rose gold"],
  },
  {
    id: "ring-006", name: "Ruby Cocktail Ring", slug: "ruby-cocktail-ring",
    category: "Rings", categorySlug: "rings", price: 41999,
    description: "A bold Burmese ruby centerpiece surrounded by a double diamond halo. A show-stopping cocktail ring.",
    shortDescription: "18K White Gold | Burmese Ruby",
    images: pick(ringImages, 2, 0),
    metal: "18K White Gold", metalWeight: "6.2g", stone: "Ruby", stoneWeight: "1.80 Ct",
    sku: "RNG-RBY-006", rating: 4.8, reviewCount: 67, inStock: true,
    tags: ["ruby", "cocktail", "bold", "white gold"],
  },
  {
    id: "ring-007", name: "Platinum Infinity Band", slug: "platinum-infinity-band",
    category: "Rings", categorySlug: "rings", price: 22999,
    description: "A sleek platinum band with an infinity twist design channel-set with diamonds. Modern elegance.",
    shortDescription: "Platinum | 0.40 Ct Diamond",
    images: pick(ringImages, 2, 1),
    metal: "Platinum", metalWeight: "4.0g", stone: "Diamond", stoneWeight: "0.40 Ct",
    sku: "RNG-PLT-007", rating: 4.6, reviewCount: 88, inStock: true,
    tags: ["platinum", "infinity", "modern", "band"],
  },
  {
    id: "ring-008", name: "Gold Temple Ring", slug: "gold-temple-ring",
    category: "Rings", categorySlug: "rings", price: 14999,
    description: "Traditional South Indian temple-inspired gold ring with intricate deity motifs and ruby accents.",
    shortDescription: "22K Yellow Gold | Temple Design",
    images: pick(ringImages, 2, 2),
    metal: "22K Yellow Gold", metalWeight: "6.5g", stone: "Ruby", stoneWeight: "0.20 Ct",
    sku: "RNG-GTR-008", rating: 4.7, reviewCount: 203, inStock: true,
    tags: ["gold", "temple", "traditional", "south indian"],
  },
  {
    id: "ring-009", name: "Cushion Cut Diamond Ring", slug: "cushion-cut-diamond-ring",
    category: "Rings", categorySlug: "rings",
    price: 67999, originalPrice: 79999, discount: 15,
    description: "A 1.5 carat cushion-cut diamond with exceptional clarity, set in a vintage-inspired platinum mount.",
    shortDescription: "Platinum | 1.50 Ct Cushion Cut",
    images: pick(ringImages, 2, 3),
    metal: "Platinum", metalWeight: "5.8g", stone: "Diamond", stoneWeight: "1.50 Ct",
    sku: "RNG-CCD-009", rating: 4.9, reviewCount: 34, inStock: true, isBestseller: true,
    tags: ["diamond", "cushion", "vintage", "platinum"],
  },
  {
    id: "ring-010", name: "Stackable Gold Rings Set", slug: "stackable-gold-rings-set",
    category: "Rings", categorySlug: "rings", price: 12999,
    description: "Set of three delicate 14K gold bands — plain, twisted, and diamond-accented. Wear together or separately.",
    shortDescription: "14K Yellow Gold | Set of 3",
    images: pick(ringImages, 2, 4),
    metal: "14K Yellow Gold", metalWeight: "3.6g", stone: "Diamond", stoneWeight: "0.15 Ct",
    sku: "RNG-SGR-010", rating: 4.4, reviewCount: 278, inStock: true,
    tags: ["gold", "stackable", "set", "minimalist"],
  },

  // ═══════════════════════════════════════════════════
  // PENDANTS (10 products) — all use pendantImages
  // ═══════════════════════════════════════════════════
  {
    id: "pendant-001", name: "Diamond Heart Pendant", slug: "diamond-heart-pendant",
    category: "Pendants", categorySlug: "pendants",
    price: 24999, originalPrice: 29999, discount: 17,
    description: "A charming heart-shaped pendant encrusted with brilliant diamonds on a 14K white gold chain.",
    shortDescription: "14K White Gold | Diamond Heart",
    images: pick(pendantImages, 2, 0),
    metal: "14K White Gold", metalWeight: "2.5g", stone: "Diamond", stoneWeight: "0.50 Ct",
    sku: "PND-DHP-001", rating: 4.9, reviewCount: 312, inStock: true, isBestseller: true,
    tags: ["diamond", "heart", "pendant", "gift"],
  },
  {
    id: "pendant-002", name: "Pearl Drop Pendant", slug: "pearl-drop-pendant",
    category: "Pendants", categorySlug: "pendants", price: 12999,
    description: "A lustrous South Sea pearl suspended from a delicate 14K gold chain. Timeless elegance.",
    shortDescription: "14K Yellow Gold | South Sea Pearl",
    images: pick(pendantImages, 2, 1),
    metal: "14K Yellow Gold", metalWeight: "2.0g", stone: "South Sea Pearl", stoneWeight: "8mm",
    sku: "PND-PDP-002", rating: 4.5, reviewCount: 98, inStock: true,
    tags: ["pearl", "pendant", "gold", "classic"],
  },
  {
    id: "pendant-003", name: "Evil Eye Diamond Pendant", slug: "evil-eye-diamond-pendant",
    category: "Pendants", categorySlug: "pendants", price: 16999,
    description: "A contemporary evil eye pendant set with diamonds and a sapphire center stone. Protective luxury.",
    shortDescription: "14K White Gold | Diamond & Sapphire",
    images: pick(pendantImages, 2, 2),
    metal: "14K White Gold", metalWeight: "2.2g", stone: "Diamond", stoneWeight: "0.35 Ct",
    sku: "PND-EVP-003", rating: 4.7, reviewCount: 145, inStock: true, isNew: true,
    tags: ["evil eye", "diamond", "sapphire", "protective"],
  },
  {
    id: "pendant-004", name: "Gold Om Pendant", slug: "gold-om-pendant",
    category: "Pendants", categorySlug: "pendants", price: 8999,
    description: "A beautifully crafted 22K gold Om symbol pendant. A spiritual and elegant everyday piece.",
    shortDescription: "22K Yellow Gold | Om Symbol",
    images: pick(pendantImages, 2, 3),
    metal: "22K Yellow Gold", metalWeight: "3.8g",
    sku: "PND-GOM-004", rating: 4.6, reviewCount: 267, inStock: true,
    tags: ["gold", "om", "spiritual", "everyday"],
  },
  {
    id: "pendant-005", name: "Ruby & Diamond Floral Pendant", slug: "ruby-diamond-floral-pendant",
    category: "Pendants", categorySlug: "pendants", price: 34999,
    description: "A floral motif pendant with a central ruby surrounded by petal-shaped diamonds on rose gold.",
    shortDescription: "14K Rose Gold | Ruby & Diamond",
    images: pick(pendantImages, 2, 4),
    metal: "14K Rose Gold", metalWeight: "3.5g", stone: "Ruby", stoneWeight: "0.80 Ct",
    sku: "PND-RDF-005", rating: 4.8, reviewCount: 76, inStock: true,
    tags: ["ruby", "diamond", "floral", "rose gold"],
  },
  {
    id: "pendant-006", name: "Mini Cross Pendant", slug: "mini-cross-pendant",
    category: "Pendants", categorySlug: "pendants", price: 6499,
    description: "A delicate diamond-studded cross pendant in 14K white gold. Subtle faith-inspired elegance.",
    shortDescription: "14K White Gold | Diamond Cross",
    images: pick(pendantImages, 2, 0),
    metal: "14K White Gold", metalWeight: "1.5g", stone: "Diamond", stoneWeight: "0.12 Ct",
    sku: "PND-MCP-006", rating: 4.5, reviewCount: 189, inStock: true,
    tags: ["cross", "diamond", "faith", "minimalist"],
  },
  {
    id: "pendant-007", name: "Peacock Gemstone Pendant", slug: "peacock-gemstone-pendant",
    category: "Pendants", categorySlug: "pendants",
    price: 27999, originalPrice: 32999, discount: 15,
    description: "A stunning peacock design featuring emeralds, sapphires, and diamonds in an 18K gold setting.",
    shortDescription: "18K Yellow Gold | Multi-Gem",
    images: pick(pendantImages, 2, 1),
    metal: "18K Yellow Gold", metalWeight: "5.2g", stone: "Emerald & Sapphire", stoneWeight: "1.20 Ct Total",
    sku: "PND-PKP-007", rating: 4.9, reviewCount: 56, inStock: true, isNew: true,
    tags: ["peacock", "emerald", "sapphire", "multi-gem"],
  },
  {
    id: "pendant-008", name: "Diamond Solitaire Pendant", slug: "diamond-solitaire-pendant",
    category: "Pendants", categorySlug: "pendants", price: 19999,
    description: "A single brilliant diamond suspended on a sleek white gold chain. Understated luxury.",
    shortDescription: "18K White Gold | 0.40 Ct Diamond",
    images: pick(pendantImages, 2, 2),
    metal: "18K White Gold", metalWeight: "2.0g", stone: "Diamond", stoneWeight: "0.40 Ct",
    sku: "PND-DSP-008", rating: 4.7, reviewCount: 198, inStock: true, isBestseller: true,
    tags: ["diamond", "solitaire", "minimalist", "elegant"],
  },
  {
    id: "pendant-009", name: "Moonstone Oval Pendant", slug: "moonstone-oval-pendant",
    category: "Pendants", categorySlug: "pendants", price: 11499,
    description: "A mystical rainbow moonstone set in a bezel of 14K rose gold with diamond accents.",
    shortDescription: "14K Rose Gold | Rainbow Moonstone",
    images: pick(pendantImages, 2, 3),
    metal: "14K Rose Gold", metalWeight: "2.8g", stone: "Rainbow Moonstone", stoneWeight: "3.5 Ct",
    sku: "PND-MOP-009", rating: 4.6, reviewCount: 87, inStock: true,
    tags: ["moonstone", "mystical", "rose gold", "oval"],
  },
  {
    id: "pendant-010", name: "Gold Coin Pendant", slug: "gold-coin-pendant",
    category: "Pendants", categorySlug: "pendants", price: 15999,
    description: "A vintage-inspired 22K gold coin pendant with embossed motifs. A nod to classic heritage.",
    shortDescription: "22K Yellow Gold | Coin Design",
    images: pick(pendantImages, 2, 4),
    metal: "22K Yellow Gold", metalWeight: "5.5g",
    sku: "PND-GCP-010", rating: 4.4, reviewCount: 134, inStock: true,
    tags: ["gold", "coin", "vintage", "heritage"],
  },

  // ═══════════════════════════════════════════════════
  // EARRINGS (10 products) — all use earringImages
  // ═══════════════════════════════════════════════════
  {
    id: "earring-001", name: "Diamond Stud Earrings", slug: "diamond-stud-earrings",
    category: "Earrings", categorySlug: "earrings", price: 35999,
    description: "Classic diamond stud earrings featuring two perfectly matched round brilliant diamonds in 18K white gold settings.",
    shortDescription: "18K White Gold | 0.50 Ct Each",
    images: pick(earringImages, 2, 0),
    metal: "18K White Gold", metalWeight: "2.4g", stone: "Diamond", stoneWeight: "1.00 Ct Total",
    sku: "EAR-DSE-001", rating: 4.8, reviewCount: 445, inStock: true, isBestseller: true,
    tags: ["diamond", "studs", "classic", "everyday"],
  },
  {
    id: "earring-002", name: "Gold Jhumka Earrings", slug: "gold-jhumka-earrings",
    category: "Earrings", categorySlug: "earrings",
    price: 15999, originalPrice: 19999, discount: 20,
    description: "Traditional gold jhumka earrings with intricate filigree work and pearl drops.",
    shortDescription: "22K Gold | Pearl Drops",
    images: pick(earringImages, 2, 1),
    metal: "22K Yellow Gold", metalWeight: "8.5g", stone: "Pearl", stoneWeight: "4mm",
    sku: "EAR-GJH-002", rating: 4.7, reviewCount: 178, inStock: true,
    tags: ["gold", "jhumka", "traditional", "filigree"],
  },
  {
    id: "earring-003", name: "Pearl Drop Earrings", slug: "pearl-drop-earrings",
    category: "Earrings", categorySlug: "earrings", price: 9999,
    description: "Elegant freshwater pearl drops on 14K gold leverback settings. Effortless sophistication.",
    shortDescription: "14K Yellow Gold | Freshwater Pearl",
    images: pick(earringImages, 2, 2),
    metal: "14K Yellow Gold", metalWeight: "2.0g", stone: "Freshwater Pearl", stoneWeight: "7mm",
    sku: "EAR-PDE-003", rating: 4.5, reviewCount: 234, inStock: true,
    tags: ["pearl", "drop", "elegant", "leverback"],
  },
  {
    id: "earring-004", name: "Sapphire Halo Studs", slug: "sapphire-halo-studs",
    category: "Earrings", categorySlug: "earrings", price: 28999,
    description: "Blue sapphire centers surrounded by a diamond halo in white gold. Regal elegance.",
    shortDescription: "18K White Gold | Sapphire & Diamond",
    images: pick(earringImages, 2, 3),
    metal: "18K White Gold", metalWeight: "3.0g", stone: "Sapphire", stoneWeight: "1.20 Ct Total",
    sku: "EAR-SHS-004", rating: 4.8, reviewCount: 92, inStock: true, isNew: true,
    tags: ["sapphire", "halo", "diamond", "regal"],
  },
  {
    id: "earring-005", name: "Chandbali Gold Earrings", slug: "chandbali-gold-earrings",
    category: "Earrings", categorySlug: "earrings",
    price: 24999, originalPrice: 29999, discount: 17,
    description: "Elaborate crescent-shaped chandbali earrings in 22K gold with polki diamonds and pearl fringes.",
    shortDescription: "22K Gold | Polki & Pearl",
    images: pick(earringImages, 2, 0),
    metal: "22K Yellow Gold", metalWeight: "12.0g", stone: "Polki Diamond", stoneWeight: "0.80 Ct",
    sku: "EAR-CBE-005", rating: 4.9, reviewCount: 67, inStock: true,
    tags: ["chandbali", "polki", "traditional", "gold"],
  },
  {
    id: "earring-006", name: "Diamond Hoop Earrings", slug: "diamond-hoop-earrings",
    category: "Earrings", categorySlug: "earrings", price: 31999,
    description: "Medium-sized diamond hoop earrings with inside-out diamond setting in 18K white gold.",
    shortDescription: "18K White Gold | 2.00 Ct Total",
    images: pick(earringImages, 2, 1),
    metal: "18K White Gold", metalWeight: "5.5g", stone: "Diamond", stoneWeight: "2.00 Ct Total",
    sku: "EAR-DHE-006", rating: 4.7, reviewCount: 156, inStock: true, isBestseller: true,
    tags: ["diamond", "hoops", "modern", "statement"],
  },
  {
    id: "earring-007", name: "Rose Gold Threader Earrings", slug: "rose-gold-threader-earrings",
    category: "Earrings", categorySlug: "earrings", price: 7999,
    description: "Delicate chain threader earrings with tiny diamond stations in rose gold. Lightweight and modern.",
    shortDescription: "14K Rose Gold | Chain Threader",
    images: pick(earringImages, 2, 2),
    metal: "14K Rose Gold", metalWeight: "1.2g", stone: "Diamond", stoneWeight: "0.08 Ct",
    sku: "EAR-RGT-007", rating: 4.4, reviewCount: 201, inStock: true,
    tags: ["rose gold", "threader", "modern", "lightweight"],
  },
  {
    id: "earring-008", name: "Gold Chandbali Earrings", slug: "gold-chandbali-earrings",
    category: "Earrings", categorySlug: "earrings", price: 18999,
    description: "Traditional gold chandbali earrings with meenakari enamel work and pearl drops. Heritage craft.",
    shortDescription: "22K Yellow Gold | Meenakari",
    images: pick(earringImages, 2, 3),
    metal: "22K Yellow Gold", metalWeight: "9.0g",
    sku: "EAR-GCE-008", rating: 4.6, reviewCount: 143, inStock: true,
    tags: ["gold", "chandbali", "meenakari", "heritage"],
  },
  {
    id: "earring-009", name: "Ruby & Diamond Chandeliers", slug: "ruby-diamond-chandeliers",
    category: "Earrings", categorySlug: "earrings", price: 52999,
    description: "Elaborate chandelier earrings with cascading rubies and diamonds in 18K gold. Red carpet glamour.",
    shortDescription: "18K Yellow Gold | Ruby & Diamond",
    images: pick(earringImages, 2, 0),
    metal: "18K Yellow Gold", metalWeight: "8.5g", stone: "Ruby", stoneWeight: "2.50 Ct Total",
    sku: "EAR-RDC-009", rating: 4.9, reviewCount: 34, inStock: true, isNew: true,
    tags: ["ruby", "chandelier", "glamour", "statement"],
  },
  {
    id: "earring-010", name: "Minimalist Gold Studs", slug: "minimalist-gold-studs",
    category: "Earrings", categorySlug: "earrings", price: 4999,
    description: "Tiny 14K gold ball studs. Perfect for everyday wear or stacking with other earrings.",
    shortDescription: "14K Yellow Gold | Ball Studs",
    images: pick(earringImages, 2, 1),
    metal: "14K Yellow Gold", metalWeight: "0.8g",
    sku: "EAR-MGS-010", rating: 4.3, reviewCount: 389, inStock: true,
    tags: ["gold", "minimalist", "studs", "everyday"],
  },

  // ═══════════════════════════════════════════════════
  // NECKLACES (9 products) — all use necklaceImages
  // ═══════════════════════════════════════════════════
  {
    id: "necklace-001", name: "Diamond Rivière Necklace", slug: "diamond-riviere-necklace",
    category: "Necklaces", categorySlug: "necklaces",
    price: 89999, originalPrice: 109999, discount: 18,
    description: "A spectacular rivière necklace featuring graduated round brilliant diamonds set in 18K white gold.",
    shortDescription: "18K White Gold | 5.00 Ct Total",
    images: pick(necklaceImages, 2, 0),
    metal: "18K White Gold", metalWeight: "12.5g", stone: "Diamond", stoneWeight: "5.00 Ct Total",
    sku: "NKL-DRV-001", rating: 4.9, reviewCount: 67, inStock: true, isNew: true, isBestseller: true,
    tags: ["diamond", "necklace", "luxury", "statement"],
  },
  {
    id: "necklace-002", name: "Gold Chain Necklace", slug: "gold-chain-necklace",
    category: "Necklaces", categorySlug: "necklaces", price: 22999,
    description: "A beautifully crafted 22K gold chain necklace with a classic box chain design.",
    shortDescription: "22K Yellow Gold | 20 Inches",
    images: pick(necklaceImages, 2, 1),
    metal: "22K Yellow Gold", metalWeight: "10.2g",
    sku: "NKL-GCN-002", rating: 4.6, reviewCount: 203, inStock: true,
    tags: ["gold", "chain", "classic", "everyday"],
  },
  {
    id: "necklace-003", name: "Kundan Choker Necklace", slug: "kundan-choker-necklace",
    category: "Necklaces", categorySlug: "necklaces", price: 48999,
    description: "A regal Kundan choker with uncut diamonds, emeralds, and pearls. A masterpiece of Rajasthani craft.",
    shortDescription: "22K Gold | Kundan & Polki",
    images: pick(necklaceImages, 2, 2),
    metal: "22K Yellow Gold", metalWeight: "35.0g", stone: "Polki Diamond", stoneWeight: "8.00 Ct Total",
    sku: "NKL-KCH-003", rating: 4.9, reviewCount: 45, inStock: true,
    tags: ["kundan", "choker", "polki", "bridal"],
  },
  {
    id: "necklace-004", name: "Pearl Mala Necklace", slug: "pearl-mala-necklace",
    category: "Necklaces", categorySlug: "necklaces",
    price: 15999, originalPrice: 19999, discount: 20,
    description: "A classic South Sea pearl mala with a gold pendant. Traditional elegance for festive occasions.",
    shortDescription: "22K Gold | South Sea Pearl",
    images: pick(necklaceImages, 2, 3),
    metal: "22K Yellow Gold", metalWeight: "18.0g", stone: "South Sea Pearl", stoneWeight: "6mm",
    sku: "NKL-PML-004", rating: 4.7, reviewCount: 178, inStock: true,
    tags: ["pearl", "mala", "traditional", "festive"],
  },
  {
    id: "necklace-005", name: "Diamond Tennis Necklace", slug: "diamond-tennis-necklace",
    category: "Necklaces", categorySlug: "necklaces", price: 125999,
    description: "A continuous line of 8 carats of round diamonds in a secure 18K white gold setting. Ultimate luxury.",
    shortDescription: "18K White Gold | 8.00 Ct Total",
    images: pick(necklaceImages, 2, 4),
    metal: "18K White Gold", metalWeight: "18.0g", stone: "Diamond", stoneWeight: "8.00 Ct Total",
    sku: "NKL-DTN-005", rating: 5.0, reviewCount: 23, inStock: true,
    tags: ["diamond", "tennis", "luxury", "statement"],
  },
  {
    id: "necklace-006", name: "Gold Mangalsutra", slug: "gold-mangalsutra",
    category: "Necklaces", categorySlug: "necklaces", price: 18999,
    description: "A traditional gold mangalsutra with black beads and diamond pendant. Sacred and beautiful.",
    shortDescription: "22K Yellow Gold | Diamond & Black Beads",
    images: pick(necklaceImages, 2, 0),
    metal: "22K Yellow Gold", metalWeight: "8.5g", stone: "Diamond", stoneWeight: "0.20 Ct",
    sku: "NKL-GMS-006", rating: 4.6, reviewCount: 234, inStock: true,
    tags: ["mangalsutra", "traditional", "gold", "sacred"],
  },
  {
    id: "necklace-007", name: "Layered Gold Necklace", slug: "layered-gold-necklace",
    category: "Necklaces", categorySlug: "necklaces", price: 27999,
    description: "Three delicate gold chains of varying lengths, each with a tiny diamond station. Effortlessly chic.",
    shortDescription: "14K Yellow Gold | 3-Layer Design",
    images: pick(necklaceImages, 2, 1),
    metal: "14K Yellow Gold", metalWeight: "6.0g", stone: "Diamond", stoneWeight: "0.24 Ct",
    sku: "NKL-GLN-007", rating: 4.5, reviewCount: 145, inStock: true, isNew: true,
    tags: ["layered", "gold", "modern", "chic"],
  },
  {
    id: "necklace-008", name: "Antique Gold Haram", slug: "antique-gold-haram",
    category: "Necklaces", categorySlug: "necklaces",
    price: 65999, originalPrice: 75999, discount: 13,
    description: "A grand antique gold haram with Lakshmi motifs, rubies, and emeralds. Heritage bridal jewellery.",
    shortDescription: "22K Yellow Gold | Antique Finish",
    images: pick(necklaceImages, 2, 2),
    metal: "22K Yellow Gold", metalWeight: "52.0g", stone: "Ruby", stoneWeight: "3.00 Ct",
    sku: "NKL-AGH-008", rating: 4.9, reviewCount: 89, inStock: true,
    tags: ["antique", "haram", "bridal", "heritage"],
  },
  {
    id: "necklace-009", name: "Rose Gold Lariat Necklace", slug: "rose-gold-lariat-necklace",
    category: "Necklaces", categorySlug: "necklaces", price: 14999,
    description: "A modern rose gold lariat necklace with a diamond-dusted drop. Versatile and contemporary.",
    shortDescription: "14K Rose Gold | Lariat Style",
    images: pick(necklaceImages, 2, 3),
    metal: "14K Rose Gold", metalWeight: "4.5g", stone: "Diamond", stoneWeight: "0.18 Ct",
    sku: "NKL-RGL-009", rating: 4.4, reviewCount: 112, inStock: true,
    tags: ["rose gold", "lariat", "modern", "versatile"],
  },

  // ═══════════════════════════════════════════════════
  // BRACELETS (8 products) — all use braceletImages
  // ═══════════════════════════════════════════════════
  {
    id: "bracelet-001", name: "Tennis Bracelet", slug: "tennis-bracelet",
    category: "Bracelets", categorySlug: "bracelets", price: 42999,
    description: "A stunning tennis bracelet featuring a continuous line of brilliant diamonds in 18K white gold.",
    shortDescription: "18K White Gold | 3.50 Ct Total",
    images: pick(braceletImages, 2, 0),
    metal: "18K White Gold", metalWeight: "8.0g", stone: "Diamond", stoneWeight: "3.50 Ct Total",
    sku: "BRC-TBR-001", rating: 4.8, reviewCount: 156, inStock: true, isBestseller: true,
    tags: ["diamond", "bracelet", "tennis", "luxury"],
  },
  {
    id: "bracelet-002", name: "Gold Link Bracelet", slug: "gold-link-bracelet",
    category: "Bracelets", categorySlug: "bracelets",
    price: 19999, originalPrice: 24999, discount: 20,
    description: "A bold yet refined 22K gold link bracelet with a secure clasp.",
    shortDescription: "22K Yellow Gold | 7.5 Inches",
    images: pick(braceletImages, 2, 1),
    metal: "22K Yellow Gold", metalWeight: "15.0g",
    sku: "BRC-GLB-002", rating: 4.5, reviewCount: 89, inStock: true,
    tags: ["gold", "bracelet", "link", "bold"],
  },
  {
    id: "bracelet-003", name: "Diamond Bangle Bracelet", slug: "diamond-bangle-bracelet",
    category: "Bracelets", categorySlug: "bracelets", price: 36999,
    description: "A sleek hinged bangle with channel-set diamonds spanning half the circumference.",
    shortDescription: "18K White Gold | 2.00 Ct Total",
    images: pick(braceletImages, 2, 2),
    metal: "18K White Gold", metalWeight: "10.5g", stone: "Diamond", stoneWeight: "2.00 Ct Total",
    sku: "BRC-DBB-003", rating: 4.7, reviewCount: 78, inStock: true,
    tags: ["diamond", "bangle", "hinged", "channel-set"],
  },
  {
    id: "bracelet-004", name: "Gold Kada Bracelet", slug: "gold-kada-bracelet",
    category: "Bracelets", categorySlug: "bracelets", price: 28999,
    description: "A traditional thick gold kada with engraved floral patterns. A bold statement of heritage.",
    shortDescription: "22K Yellow Gold | Engraved",
    images: pick(braceletImages, 2, 3),
    metal: "22K Yellow Gold", metalWeight: "22.0g",
    sku: "BRC-GKB-004", rating: 4.8, reviewCount: 134, inStock: true,
    tags: ["gold", "kada", "traditional", "engraved"],
  },
  {
    id: "bracelet-005", name: "Pearl Charm Bracelet", slug: "pearl-charm-bracelet",
    category: "Bracelets", categorySlug: "bracelets", price: 11999,
    description: "A delicate 14K gold chain bracelet adorned with freshwater pearl charms and tiny diamonds.",
    shortDescription: "14K Yellow Gold | Pearl Charms",
    images: pick(braceletImages, 2, 0),
    metal: "14K Yellow Gold", metalWeight: "3.5g", stone: "Pearl", stoneWeight: "5mm",
    sku: "BRC-PCB-005", rating: 4.5, reviewCount: 167, inStock: true, isNew: true,
    tags: ["pearl", "charm", "delicate", "feminine"],
  },
  {
    id: "bracelet-006", name: "Emerald Tennis Bracelet", slug: "emerald-tennis-bracelet",
    category: "Bracelets", categorySlug: "bracelets",
    price: 54999, originalPrice: 64999, discount: 15,
    description: "A line of vivid emeralds alternating with diamonds in 18K white gold. Nature's finest.",
    shortDescription: "18K White Gold | Emerald & Diamond",
    images: pick(braceletImages, 2, 1),
    metal: "18K White Gold", metalWeight: "9.0g", stone: "Emerald", stoneWeight: "4.50 Ct Total",
    sku: "BRC-ETB-006", rating: 4.9, reviewCount: 34, inStock: true, isNew: true,
    tags: ["emerald", "tennis", "diamond", "statement"],
  },
  {
    id: "bracelet-007", name: "Gold Chain Bracelet", slug: "gold-chain-bracelet",
    category: "Bracelets", categorySlug: "bracelets", price: 8999,
    description: "A classic 14K gold cable chain bracelet. Simple, timeless, and stackable.",
    shortDescription: "14K Yellow Gold | Cable Chain",
    images: pick(braceletImages, 2, 2),
    metal: "14K Yellow Gold", metalWeight: "3.0g",
    sku: "BRC-GCB-007", rating: 4.4, reviewCount: 234, inStock: true,
    tags: ["gold", "chain", "simple", "stackable"],
  },
  {
    id: "bracelet-008", name: "Rose Gold Cuff Bracelet", slug: "rose-gold-cuff-bracelet",
    category: "Bracelets", categorySlug: "bracelets", price: 16999,
    description: "An open cuff bracelet in rose gold with pavé diamonds at each end. Modern elegance.",
    shortDescription: "14K Rose Gold | Pavé Diamond Ends",
    images: pick(braceletImages, 2, 3),
    metal: "14K Rose Gold", metalWeight: "7.5g", stone: "Diamond", stoneWeight: "0.50 Ct",
    sku: "BRC-RGC-008", rating: 4.6, reviewCount: 98, inStock: true,
    tags: ["rose gold", "cuff", "pavé", "modern"],
  },

  // ═══════════════════════════════════════════════════
  // BANGLES (8 products) — all use bangleImages
  // ═══════════════════════════════════════════════════
  {
    id: "bangle-001", name: "Diamond Cuff Bangle", slug: "diamond-cuff-bangle",
    category: "Bangles", categorySlug: "bangles", price: 56999,
    description: "A statement cuff bangle encrusted with pave diamonds in a contemporary open design.",
    shortDescription: "18K White Gold | 2.80 Ct Total",
    images: pick(bangleImages, 2, 0),
    metal: "18K White Gold", metalWeight: "18.0g", stone: "Diamond", stoneWeight: "2.80 Ct Total",
    sku: "BNG-DCB-001", rating: 4.7, reviewCount: 45, inStock: true, isNew: true,
    tags: ["diamond", "bangle", "cuff", "contemporary"],
  },
  {
    id: "bangle-002", name: "Traditional Gold Bangle Set", slug: "traditional-gold-bangle-set",
    category: "Bangles", categorySlug: "bangles",
    price: 68999, originalPrice: 79999, discount: 14,
    description: "A set of four 22K gold bangles with intricate temple-inspired designs.",
    shortDescription: "22K Yellow Gold | Set of 4",
    images: pick(bangleImages, 2, 1),
    metal: "22K Yellow Gold", metalWeight: "48.0g",
    sku: "BNG-TGB-002", rating: 4.9, reviewCount: 312, inStock: true, isBestseller: true,
    tags: ["gold", "bangle", "traditional", "set"],
  },
  {
    id: "bangle-003", name: "Diamond Swirl Bangle", slug: "diamond-swirl-bangle",
    category: "Bangles", categorySlug: "bangles", price: 44999,
    description: "A mesmerizing swirl design with alternating diamond and ruby stations in white gold.",
    shortDescription: "18K White Gold | Diamond & Ruby",
    images: pick(bangleImages, 2, 2),
    metal: "18K White Gold", metalWeight: "14.0g", stone: "Diamond", stoneWeight: "1.80 Ct",
    sku: "BNG-DSB-003", rating: 4.8, reviewCount: 56, inStock: true,
    tags: ["diamond", "ruby", "swirl", "elegant"],
  },
  {
    id: "bangle-004", name: "Gold Filigree Bangle", slug: "gold-filigree-bangle",
    category: "Bangles", categorySlug: "bangles", price: 21999,
    description: "Delicate gold filigree bangle with a lightweight openwork design. Artisan craftsmanship.",
    shortDescription: "22K Yellow Gold | Filigree Work",
    images: pick(bangleImages, 2, 3),
    metal: "22K Yellow Gold", metalWeight: "12.0g",
    sku: "BNG-GFB-004", rating: 4.6, reviewCount: 145, inStock: true,
    tags: ["gold", "filigree", "artisan", "lightweight"],
  },
  {
    id: "bangle-005", name: "Glass Bangles Set (Green)", slug: "glass-bangles-set-green",
    category: "Bangles", categorySlug: "bangles", price: 2999,
    description: "Set of 12 traditional green glass bangles with gold lace borders. Festive essential.",
    shortDescription: "Glass | Set of 12",
    images: pick(bangleImages, 2, 0),
    metal: "Glass", metalWeight: "60.0g",
    sku: "BNG-GBS-005", rating: 4.2, reviewCount: 456, inStock: true,
    tags: ["glass", "bangles", "traditional", "festive"],
  },
  {
    id: "bangle-006", name: "Diamond Line Bangle", slug: "diamond-line-bangle",
    category: "Bangles", categorySlug: "bangles", price: 38999,
    description: "A sleek bangle with a single line of brilliant diamonds running across the top. Minimalist luxury.",
    shortDescription: "18K White Gold | 1.50 Ct Total",
    images: pick(bangleImages, 2, 1),
    metal: "18K White Gold", metalWeight: "11.0g", stone: "Diamond", stoneWeight: "1.50 Ct Total",
    sku: "BNG-DLB-006", rating: 4.7, reviewCount: 89, inStock: true,
    tags: ["diamond", "line", "minimalist", "luxury"],
  },
  {
    id: "bangle-007", name: "Rose Gold Hammered Bangle", slug: "rose-gold-hammered-bangle",
    category: "Bangles", categorySlug: "bangles", price: 13999,
    description: "A textured hammered rose gold bangle with an organic, artisan feel.",
    shortDescription: "14K Rose Gold | Hammered Finish",
    images: pick(bangleImages, 2, 2),
    metal: "14K Rose Gold", metalWeight: "8.0g",
    sku: "BNG-RGH-007", rating: 4.5, reviewCount: 112, inStock: true,
    tags: ["rose gold", "hammered", "artisan", "textured"],
  },
  {
    id: "bangle-008", name: "Gold Bangle Set (Plain)", slug: "gold-bangle-set-plain",
    category: "Bangles", categorySlug: "bangles",
    price: 34999, originalPrice: 39999, discount: 13,
    description: "Set of 6 plain 22K gold bangles with a polished finish. Timeless everyday wear.",
    shortDescription: "22K Yellow Gold | Set of 6",
    images: pick(bangleImages, 2, 3),
    metal: "22K Yellow Gold", metalWeight: "54.0g",
    sku: "BNG-GBP-008", rating: 4.8, reviewCount: 278, inStock: true,
    tags: ["gold", "plain", "set", "everyday"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.includes(lower)) ||
      p.category.toLowerCase().includes(lower)
  );
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
