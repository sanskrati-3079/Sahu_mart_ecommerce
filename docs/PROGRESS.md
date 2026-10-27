# Sahu Marts — Build Progress

Demo e-commerce site (Vite + React 19 + TypeScript + Tailwind v4 + Radix/shadcn-style UI).
No backend: login, cart, wishlist, addresses and orders live in localStorage.

## Steps
- [x] 1. Design system, logo, types, data, catalog helpers, image check
- [x] 2. Routes, header, mega menu, mobile menu, footer
- [x] 3. Product card and the full homepage
- [x] 4. Shop / category / search pages with filters and sorting
- [x] 5. Product detail page
- [x] 6. Wishlist, cart drawer, cart page, coupons
- [x] 7. Login, signup, account, addresses
- [x] 8. Checkout, order confirmation, orders, tracking
- [x] 9. About, contact and policy pages
- [x] 10. Full quality check, fix everything, final build

## Notes / decisions
- The project folder was empty at start, so it was scaffolded with `create-vite` (react-ts) and Tailwind v4 (`@tailwindcss/vite`). shadcn-style primitives live in `src/components/ui` built on Radix.
- Theme tokens are in `src/index.css` (`@theme`). `muted` is #6E6E6E (one step darker than the #777777 spec) to pass WCAG AA on ivory.
- Products: 73 items in `src/data/products.ts`, generated via a small builder (variants = colours × sizes, deterministic stock).
- Images: all Unsplash photos were hand-picked from Unsplash search results and visually checked. `npm run check:images` verifies every ID loads.
- Search parsing lives in `src/lib/search.ts` (price phrases, colour words, synonyms, "did you mean").
- Filters/sort live in `src/lib/filters.ts` and are serialised to the URL.
- All money rules live in `src/lib/pricing.ts`.

## Quality check (step 10)
- Link crawler visited every internal link (146 pages, signed in): no 404s, console errors, overflow or lorem ipsum.
- Responsive sweep at 375 / 768 / 1440 on 21 key pages: no horizontal scroll, no broken images, every image has alt text.
- axe-core (WCAG 2 A/AA) on 13 key pages: clean after darkening `muted` and `gold-dark` tokens (remaining hits were mid-animation captures).
- Keyboard: mega menu (ArrowDown into panel, Escape back to trigger), drawers/dialogs trap focus and return it on close.
- Fixed during QA: facet counts for budget/rating/discount, unstable Zustand selectors (infinite render loop), mega-menu budget links that led to empty results, header overflow at 1024px, mobile drawer header scrolling away.
- `npm run build` and `npm run lint` pass with 0 errors and 0 warnings.

## Ideas for later (not required)
- Product images per colour variant.
- Real backend (auth, orders, payments) to replace localStorage.
