# Golden Grace — Premium Fine Jewellery E-Commerce

A full-featured, production-ready e-commerce website for fine jewellery. Built with Next.js 16, Supabase, and Razorpay.

**Live:** [goldengrace.vercel.app](https://goldengrace.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password, forgot password) |
| Payments | Razorpay (UPI, Cards, Net Banking) + Cash on Delivery |
| Email | Resend (order confirmations + status updates) |
| Hosting | Vercel (auto-deploy from main) |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Fonts | Inter + Playfair Display (Google Fonts) |

---

## Features

### Shopping Experience
- **55 products** across 6 categories (Rings, Pendants, Earrings, Necklaces, Bracelets, Bangles)
- Full-text **product search** with tag-based filtering
- **Category browsing** with sort (Featured, Price, Newest, Rating) and metal type filter
- **Product detail** pages with image gallery, reviews, and related items
- Auto-sliding **carousel** with touch swipe support

### Cart & Wishlist
- **Persistent cart** — saves to Supabase when logged in, localStorage when guest
- **Persistent wishlist** — same behavior as cart
- **Auto-merge** — local items merge into Supabase on login
- **Race condition safe** — all Supabase syncs happen after local state is committed

### Checkout & Orders
- **Multi-step checkout:** Address → Payment → Confirmation
- **Address validation** — all fields validated before proceeding
- **Saved addresses** — pre-fills checkout with your default address
- **Payment:** Razorpay (real) or Cash on Delivery
- **Order IDs** — unique even under concurrent load (random suffix)
- **Order tracking** — 5-step timeline with progress bar
- **Confirmation email** — sent automatically via Resend
- **Status update emails** — customer gets emailed when admin changes status

### User Account
- **Signup** with password strength checker (8+ chars, uppercase, number, special)
- **Login** with forgot password (Supabase email reset)
- **Profile** — edit name and phone
- **Address management** — add, edit, delete, set default
- **Order history** — view all past orders with status

### Admin Dashboard (`/admin`)
- Password-protected (password: `goldengrace`)
- **Dashboard stats** — total products, total orders, revenue, stock count
- **Product CRUD** — create, edit, delete products with image upload to Supabase Storage
- **Order management** — view all orders, change status (pending → confirmed → processing → shipped → delivered)
- **One-click seed** — insert all 55 products into Supabase
- **Status change triggers email** — customer notified automatically

### SEO & Social
- **Dynamic sitemap.xml** — all products, categories, and pages
- **robots.txt** — blocks /admin and /api
- **Open Graph + Twitter cards** — branded OG image for WhatsApp, Instagram, Facebook, LinkedIn
- **JSON-LD structured data** — product pages show rich snippets in Google
- **Dynamic page titles** — per-product titles
- **Custom 404 page** — branded with navigation

### Mobile & Responsive
- Fully responsive on all screen sizes
- Hamburger menu drawer on mobile
- Touch swipe on carousel
- Responsive grids (2 cols mobile → 4 cols desktop)
- Always-visible action buttons on mobile (no hover-only)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, providers, SEO metadata
│   ├── page.tsx                # Homepage
│   ├── loading.tsx             # Global loading spinner
│   ├── not-found.tsx           # Custom 404 page
│   ├── opengraph-image.tsx     # OG image for social sharing
│   ├── robots.ts               # SEO: robots.txt
│   ├── sitemap.ts              # SEO: sitemap.xml
│   ├── auth/
│   │   ├── login/page.tsx      # Login with forgot password
│   │   └── signup/page.tsx     # Signup with password strength
│   ├── profile/page.tsx        # Profile, orders, addresses, settings
│   ├── cart/page.tsx           # Shopping cart
│   ├── checkout/page.tsx       # Multi-step checkout
│   ├── orders/page.tsx         # Order tracking with timeline
│   ├── wishlist/page.tsx       # Saved items
│   ├── search/page.tsx         # Product search
│   ├── category/[slug]/page.tsx # Category browsing
│   ├── product/[id]/page.tsx   # Product detail + reviews
│   ├── admin/page.tsx          # Admin dashboard
│   ├── policies/               # Terms, privacy, shipping, returns
│   └── api/
│       ├── orders/route.ts     # Create/get orders
│       ├── orders/[id]/route.ts # Update status + send email
│       ├── products/route.ts   # Get/create products
│       ├── products/[id]/route.ts # Update/delete products
│       ├── upload/route.ts     # Image upload to Supabase Storage
│       ├── seed/route.ts       # Seed 55 products
│       ├── create-order/route.ts # Razorpay order creation
│       └── send-order-confirmation/route.ts # Confirmation + status emails
├── components/
│   ├── GlobalNav.tsx           # Navigation with mobile drawer
│   ├── Footer.tsx              # Site footer
│   ├── HeroSection.tsx         # Hero image
│   ├── CategoryGrid.tsx        # Category cards
│   ├── CuratedCollections.tsx  # Collection highlights
│   ├── Trendspotting.tsx       # Trending items
│   ├── GoldMineBanner.tsx      # Auto-sliding carousel
│   ├── SearchInput.tsx         # Search bar (navigates to /search)
│   ├── product/ProductCard.tsx # Product card
│   └── reviews/ProductReviews.tsx # Reviews component
├── context/
│   ├── AuthContext.tsx          # Auth, profile, orders
│   ├── CartContext.tsx          # Cart with Supabase + localStorage
│   └── WishlistContext.tsx      # Wishlist with Supabase + localStorage
├── data/
│   ├── products.ts             # 55 products + helpers
│   └── types.ts                # TypeScript interfaces
└── lib/
    ├── supabase.ts             # Client-side Supabase + type helpers
    ├── supabase-server.ts      # Server-side client (service role)
    ├── api.ts                  # API helpers
    └── utils.ts                # Utility functions
```

---

## Database

### Tables (6 total)

| Table | Purpose | RLS |
|-------|---------|-----|
| `user_profiles` | User name, phone (auto-created on signup) | ✅ Users see/edit own only |
| `products` | Product catalog (55 items) | ✅ Open (public browse + admin CRUD) |
| `orders` | Customer orders | ✅ Open (anyone can insert/select/update/delete) |
| `cart_items` | Persistent cart per user | ✅ Users see/edit own only |
| `wishlist_items` | Persistent wishlist per user | ✅ Users see/edit own only |
| `addresses` | Saved shipping addresses per user | ✅ Users see/edit/delete own only |

### Storage
- **Bucket:** `product-images` (public read, authenticated upload/delete)

### Key Schema Details
- **Trigger:** `handle_new_user()` auto-creates a `user_profiles` row on signup
- The trigger has an `EXCEPTION` block so signup never fails even if the table is missing
- All tables use `CREATE TABLE IF NOT EXISTS` — safe to run multiple times

---

## Setup

### 1. Environment Variables

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=https://goldengrace.vercel.app
```

**Optional:**
```
RESEND_API_KEY=re_xxxxx              # Order confirmation emails
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_xxxxx # Real Razorpay payments
RAZORPAY_KEY_SECRET=xxxxx            # Real Razorpay payments
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the entire `supabase-schema.sql` → click **Run**
3. Go to **Settings → API** → copy `service_role` key → add to Vercel
4. Go to **Authentication → Providers → Email** → **turn OFF** "Confirm email" (for testing)

### 3. Get the Service Role Key

1. Supabase Dashboard → your project → **Settings** (gear icon) → **API**
2. Copy the `service_role` key (starts with `eyJ...`)
3. Vercel → your project → **Settings** → **Environment Variables**
4. Add `SUPABASE_SERVICE_ROLE_KEY` = the key
5. **Redeploy**

**⚠️ Without this key:** API routes fall back to anon key, which hits RLS. Orders won't save. Admin can't create/edit/delete products.

### 4. Run Locally

```bash
npm install
cp .env.example .env.local    # Add your Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy

Push to `main` branch → Vercel auto-deploys.

---

## Testing Checklist

### Before Demo
- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- [ ] Turn OFF email confirmation in Supabase Auth settings
- [ ] Backfill existing users' profiles (see SQL below)

### Feature Flow
1. **Browse** → Homepage shows carousel, bestsellers, categories
2. **Search** → Type "diamond" to find products
3. **Product** → Full details, image gallery, add to cart
4. **Cart** → Persistent (saves across sessions)
5. **Signup** → Real Supabase auth with password validation
6. **Login** → Session persists, profile loads
7. **Address** → Add/edit/delete saved addresses
8. **Checkout** → Address validation → Razorpay/COD → Order placed
9. **Order tracking** → 5-step timeline with progress bar
10. **Admin** → Dashboard stats, product CRUD, order management
11. **Mobile** → Fully responsive on all screen sizes

---

## Backfill SQL (Run Once)

If users signed up before the trigger was created, run this to create their profiles:

```sql
INSERT INTO user_profiles (id, full_name, phone)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'phone', '')
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;
```

---

## Stress Testing Notes

The site is safe for concurrent users:
- **Order IDs** use random suffixes — no collisions under concurrent load
- **Cart/Wishlist sync** — all Supabase writes happen after local state is committed (no race conditions)
- **Double-click protection** — checkout button disables during processing
- **RLS** — each user can only see/edit their own cart, wishlist, and addresses

---

## Bug Fixes Applied

| Fix | What was wrong |
|-----|---------------|
| Signup "Database error" | Trigger had no error handling, missing `user_profiles` table |
| Orders not saving | API routes used anon key, hit RLS. Created server client with service role |
| Cart/Wishlist silent failures | Added try/catch with localStorage fallback |
| Checkout false success | API errors weren't returned to frontend |
| OG image not showing | WhatsApp/Instagram need absolute URLs, not relative |
| Build failure on Vercel | Resend client initialized at module load (before env vars available) |
| Missing /orders page | Track Orders linked to non-existent page |
| Mobile header overlap | Brand title used absolute positioning, overlapped with icons |
| Product CRUD failing | POST route sent camelCase to snake_case DB without mapping |
| Order ID collisions | Date.now() alone collides for concurrent users |
| Cart/Wishlist race conditions | Async Supabase sync inside setState callback |
| EMI/Exchange references | Removed all mentions (was dead feature) |

---

## License

Private — Golden Grace / DevCore Studio
