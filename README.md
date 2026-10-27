# Sahu Marts — demo e-commerce website

**Everything You Love. All in One Place.**

A complete sample store for showing a client: sarees, jewellery, ethnic wear, menswear, fabrics by the metre, luggage, home and everyday essentials. There is no backend — accounts, bag, wishlist, addresses and orders are stored in the browser's localStorage, and no real payment is ever processed.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build
npm run lint         # ESLint
npm run check:images # verify every product image URL loads
npm run format       # Prettier
```

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Radix UI (shadcn-style components in `src/components/ui`) · React Router 7 · Zustand · react-hook-form + zod · motion · sonner · lucide-react

## Where things live

| Path | What |
| --- | --- |
| `src/data/` | Products (73), categories, collections, budgets, coupons, sample reviews, Indian states, images |
| `src/lib/catalog.ts` | Product lookups (by slug, category, price range, related, bestsellers, new arrivals) |
| `src/lib/pricing.ts` | **All** money rules: coupons, shipping (free ≥ ₹999, else ₹79; express ₹149), totals |
| `src/lib/search.ts` | Search parsing ("under 2000", "between 1000 and 3000", colours, synonyms, "did you mean") |
| `src/lib/filters.ts` | URL-driven filters, facets with counts, sorting |
| `src/lib/tracking.ts` | Simulated order timeline |
| `src/store/` | Zustand stores persisted to localStorage (cart, wishlist, auth, addresses, orders, preferences) |
| `src/components/brand/` | SVG logo, monogram and animated loading mark |

## Demo-only behaviour

- Accounts save only name, email and phone. **Passwords are never stored.**
- Payment options (COD, UPI, Card/Net Banking) are labelled demo and never ask for card details.
- Orders get IDs like `SM-DEMO-48213`; tracking progresses with time since ordering.
- Reviews are labelled "Sample reviews (demo)". Contact details are `[placeholders]`.
- Jewellery is described honestly as imitation / gold-tone / oxidised.
- Product photos come from Unsplash.
