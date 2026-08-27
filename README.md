# Golden Grace — Premium Fine Jewellery E-Commerce

A full-featured e-commerce website for fine jewellery built with Next.js, Supabase, and Razorpay.

**Live URL:** https://goldengrace.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Payments | Razorpay (UPI, Cards, Net Banking) + COD |
| Email | Resend |
| Hosting | Vercel |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Fonts | Inter + Playfair Display (Google Fonts) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Auth/Cart/Wishlist providers
│   ├── page.tsx                # Homepage (hero, categories, bestsellers, carousel)
│   ├── loading.tsx             # Global loading spinner
│   ├── not-found.tsx           # Custom 404 page
│   ├── opengraph-image.tsx     # OG image for social media sharing
│   ├── robots.ts               # SEO: robots.txt
│   ├── sitemap.ts              # SEO: dynamic sitemap.xml
│   ├── auth/
│   │   ├── login/page.tsx      # Login with forgot password modal
│   │   └── signup/page.tsx     # Signup with password strength checker
│   ├── profile/page.tsx        # User profile, orders, addresses, settings
│   ├── cart/page.tsx           # Shopping cart
│   ├── checkout/page.tsx       # Multi-step checkout (address → payment → confirm)
│   ├── orders/page.tsx         # Order tracking with timeline
│   ├── wishlist/page.tsx       # Saved items
│   ├── search/page.tsx         # Product search with filters
│   ├── category/[slug]/page.tsx # Category browsing with sort/filter
│   ├── product/[id]/page.tsx   # Product detail with reviews, related items
│   ├── admin/page.tsx          # Admin dashboard (password protected)
│   ├── policies/               # Legal pages (terms, privacy, shipping, returns)
│   └── api/
│       ├── orders/route.ts     # Create/get orders
│       ├── orders/[id]/route.ts # Update order status + send email
│       ├── products/route.ts   # Get/create products
│       ├── products/[id]/route.ts # Update/delete products
│       ├── upload/route.ts     # Image upload to Supabase Storage
│       ├── seed/route.ts       # Seed 55 products to database
│       ├── create-order/route.ts # Razorpay order creation
│       └── send-order-confirmation/route.ts # Order confirmation emails
├── components/
│   ├── GlobalNav.tsx           # Navigation with mobile drawer
│   ├── Footer.tsx              # Site footer with links
│   ├── HeroSection.tsx         # Homepage hero image
│   ├── CategoryGrid.tsx        # Category browsing cards
│   ├── CuratedCollections.tsx  # Collection highlights
│   ├── Trendspotting.tsx       # Trending items
│   ├── GoldMineBanner.tsx      # Auto-sliding carousel with swipe
│   ├── FloatingButton.tsx      # Removed (was floating chat bubble)
│   ├── SearchInput.tsx         # Homepage search bar
│   ├── product/ProductCard.tsx # Product card component
│   └── reviews/ProductReviews.tsx # Product reviews component
├── context/
│   ├── AuthContext.tsx          # Auth state, login/signup/logout, profile, orders
│   ├── CartContext.tsx          # Cart with Supabase persistence + localStorage fallback
│   └── WishlistContext.tsx      # Wishlist with Supabase persistence + localStorage fallback
├── data/
│   ├── products.ts             # 55 products across 6 categories + helpers
│   └── types.ts                # TypeScript interfaces
└── lib/
    ├── supabase.ts             # Client-side Supabase client + type helpers
    ├── supabase-server.ts      # Server-side client with service role key
    ├── api.ts                  # API helpers
    └── utils.ts                # Utility functions
```

---

## Supabase Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `user_profiles` | User name, phone (linked to auth.users) | ✅ Users can only see/edit own |
| `products` | Product catalog (55 items) | ❌ Public read |
| `orders` | Customer orders | ✅ Open (insert/select/update/delete) |
| `cart_items` | Persistent shopping cart per user | ✅ Users can only see/edit own |
| `wishlist_items` | Persistent wishlist per user | ✅ Users can only see/edit own |
| `addresses` | Saved shipping addresses per user | ✅ Users can only see/edit own |

**Storage bucket:** `product-images` (public read, authenticated upload/delete)

---

## Environment Variables

### Required (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Critical! See below
NEXT_PUBLIC_SITE_URL=https://goldengrace.vercel.app
```

### Optional

```
RESEND_API_KEY=re_xxxxx          # For order confirmation emails
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_xxxxx  # For real Razorpay payments
RAZORPAY_KEY_SECRET=xxxxx        # For real Razorpay payments
```

### How to get SUPABASE_SERVICE_ROLE_KEY

1. Go to Supabase Dashboard → your project → Settings (gear icon) → API
2. Copy the `service_role` key (starts with `eyJ...`)
3. Add it to Vercel → Settings → Environment Variables

**⚠️ Without this key, orders won't save.** All API routes use the server-side client which needs this key to bypass RLS.

---

## Database Schema

Run the full `supabase-schema.sql` in Supabase SQL Editor to create all tables. Key points:

- **Trigger:** `handle_new_user()` auto-creates a `user_profiles` row on signup (wrapped in EXCEPTION block so signup never fails)
- **RLS policies** on user_profiles, cart_items, wishlist_items, addresses
- **Orders** has open RLS (anyone can insert/select/update/delete)
- **Products** has no RLS (public read)
- **Storage** policies for product-images bucket

---

## Features

### Customer-Facing
- [x] Browse 55 products across 6 categories (Rings, Pendants, Earrings, Necklaces, Bracelets, Bangles)
- [x] Product search with tag-based filtering
- [x] Category pages with sort (Featured, Price, Newest, Rating) and metal type filter
- [x] Product detail with image gallery, reviews, related items
- [x] Shopping cart (persistent across sessions)
- [x] Wishlist (persistent across sessions)
- [x] Multi-step checkout with address validation
- [x] Payment via Razorpay (UPI, Cards, Net Banking) or Cash on Delivery
- [x] Order confirmation email (via Resend)
- [x] Order tracking with 5-step timeline
- [x] User profile with editable name/phone
- [x] Address management (add, edit, delete, set default)
- [x] Forgot password via Supabase email
- [x] Mobile responsive with hamburger menu and swipe carousel

### Admin
- [x] Password-protected admin panel (`/admin`, password: `goldengrace`)
- [x] Dashboard with stats (products, orders, revenue, stock)
- [x] Product CRUD (create, edit, delete with image upload)
- [x] Order management with status dropdown (pending → confirmed → processing → shipped → delivered)
- [x] Status change sends email notification to customer
- [x] Seed 55 products to Supabase with one click

### SEO
- [x] Dynamic sitemap.xml with all products and categories
- [x] robots.txt (blocks /admin and /api)
- [x] Open Graph + Twitter cards with branded OG image
- [x] JSON-LD structured data on product pages
- [x] Custom 404 page
- [x] Global loading spinner

---

## Key Fixes Applied (This Session)

1. **Signup "Database error saving new user"** — Made trigger robust with EXCEPTION block, added try/catch to all Supabase operations
2. **Orders not saving** — Created `supabase-server.ts` with service role key, updated all API routes to use it
3. **Stale closure bugs** — Fixed AuthContext using `useRef` for `supabaseUser` and `user`
4. **Render-time redirects** — Login/signup now use `useEffect` instead of calling `router.push` during render
5. **Broken import path** — Fixed `@/@/data/products` → `@/data/products` in profile page
6. **Cart/Wishlist silent failures** — Added try/catch to all Supabase operations with localStorage fallback
7. **Checkout showing false success** — API now returns proper errors, checkout shows them
8. **OG image not showing** — Used absolute URLs required by WhatsApp/Instagram
9. **Build failure on Vercel** — Lazy-initialized Resend client (was failing at module load time)
10. **Missing /orders page** — Created full order tracking page with timeline

---

## Common Issues

### Orders not saving
→ Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel env vars
→ Run the orders RLS policies SQL (see schema file)

### OG image not showing on WhatsApp
→ Ensure `NEXT_PUBLIC_SITE_URL` is set to `https://goldengrace.vercel.app`
→ Use Facebook Sharing Debugger to force re-fetch

### Build failing on Vercel
→ Check that `RESEND_API_KEY` is set (or the lazy init will handle it)
→ Check Vercel build logs for the specific error

### Signup fails with "Database error"
→ Run the full `supabase-schema.sql` to create the `user_profiles` table and trigger

---

## Running Locally

```bash
npm install
npm run dev
```

Requires `.env.local` with Supabase credentials.

---

## Deployment

Push to `main` branch → Vercel auto-deploys.

---

*Last updated: August 27, 2026*
