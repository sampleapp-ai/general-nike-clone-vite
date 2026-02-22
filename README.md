# Fresh Market - Grocery Store (Vite + React)

A complete e-commerce grocery store built with Vite, React, TypeScript, and Stripe Checkout integration.

## Features

- **Modern Stack**: Vite + React 19 + TypeScript
- **Real Stripe Integration**: Uses Stripe Checkout with real checkout.confirm() flow
- **Cart Persistence**: localStorage with "grocery-store-cart" key
- **Hydration-Safe**: Cart page waits for hydration before showing empty state
- **No Size Selection Required**: Products add to cart with "default" size
- **Server-Side API**: Vite plugin handles API routes for Stripe
- **Tailwind CSS v3.4**: For responsive styling
- **React Router**: Client-side routing
- **Framer Motion**: Smooth animations on checkout confirmation
- **Lucide Icons**: Modern icon library

## Project Structure

```
vite/
├── server/
│   └── api.ts              # Server-side API handlers for Stripe
├── src/
│   ├── components/
│   │   ├── HeroBanner.tsx
│   │   ├── StoreFooter.tsx
│   │   ├── StoreHeader.tsx
│   │   ├── StoreNavigation.tsx
│   │   └── TopBar.tsx
│   ├── context/
│   │   └── cart-context.tsx  # Cart state with localStorage
│   ├── lib/
│   │   └── constants.ts      # Store config and product data
│   ├── pages/
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── CheckoutSuccess.tsx
│   │   ├── Home.tsx
│   │   ├── Product.tsx
│   │   └── StripeCheckout.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Stripe keys**:
   - Copy `.env.example` to `.env`
   - Add your Stripe secret key to `STRIPE_SECRET_KEY`
   - (Optional) Update `VITE_STRIPE_PUBLISHABLE_KEY` if needed

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## API Routes

The Vite server plugin handles API routes in development:

- **POST /api/create-checkout-session**: Creates Stripe Checkout session
- **POST /api/session-status**: Retrieves Stripe session status

## Key Differences from Next.js

1. **Router**: Uses `react-router-dom` instead of Next.js router
   - `Link` from `react-router-dom`
   - `useNavigate()` instead of `useRouter()`
   - `useSearchParams()` from `react-router-dom`

2. **Images**: Uses standard `<img>` tags (no next/image)

3. **API Routes**: Handled via Vite plugin in `vite.config.ts` that loads `server/api.ts`

4. **Client Directives**: No "use client" directives needed

5. **Environment Variables**: Use `import.meta.env.VITE_*` instead of `process.env.NEXT_PUBLIC_*`

## Important Constraints Met

- ✅ ZERO console.log/console.error/console.warn anywhere
- ✅ Cart persists in localStorage with key "grocery-store-cart"
- ✅ Cart survives page refreshes
- ✅ Cart page waits for hydration with isLoaded pattern
- ✅ Product page adds to cart with "default" size (no size selection required)
- ✅ Stripe checkout uses real checkout.confirm() (NOT mock)
- ✅ All API routes handled through Vite server plugin
- ✅ Uses Tailwind CSS v3.4 with postcss
- ✅ Uses react-router-dom for routing
- ✅ Uses lucide-react for icons
- ✅ Uses framer-motion for checkout confirmation animations

## Pages

- `/` - Home page with products and categories
- `/product` - Featured product detail page
- `/cart` - Shopping cart
- `/checkout` - Order confirmation page
- `/checkout/stripe` - Stripe payment form
- `/checkout/success` - Payment success/failure status

## License

Demo project - All rights reserved
