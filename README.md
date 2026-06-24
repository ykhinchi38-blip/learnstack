# LearnStack Web

A professional frontend-only LearnStack website built with Next.js, TypeScript, and CSS.

## Included pages

- Homepage
- All products page
- Individual product detail pages
- Category pages
- Free resources page
- About page
- Contact page
- Coupon page
- Bundle marketing page
- Learning paths page
- Reviews / trust page
- Dynamic sitemap
- Robots file

## Design direction

This version uses a clean professional neo-brutalism style:

- Strong black/navy borders
- Clean logo-matching blue accents
- Off-white/paper background
- No neon colors
- Futuristic product console sections
- Trust-first layout and marketing-focused pages

## Run locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Deploy on Vercel

Push the folder to GitHub and import the project into Vercel.

Add this environment variable in Vercel:

```txt
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

After buying a domain, change it to:

```txt
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Add or edit products

Open:

```txt
lib/products.ts
```

Add a new product object. If it is live on Gumroad, set:

```ts
status: "available",
gumroadUrl: "https://learnstacks.gumroad.com/l/your-product"
```

If it is not live yet, set:

```ts
status: "coming-soon"
```

## Add coupons

Open:

```txt
lib/coupons.ts
```

Add coupon data. Important: create the same code inside Gumroad first.

Example:

```ts
{
  code: "LAUNCH20",
  title: "Launch discount",
  description: "Discount for launch week.",
  discount: "20% OFF",
  validFor: "Selected handbooks",
  productSlug: "python-handbook",
  isFeatured: true,
  isActive: true
}
```

The site creates product-specific Gumroad discount links using this format:

```txt
https://learnstacks.gumroad.com/l/product-slug/COUPONCODE
```

## Replace placeholder trust content

When you get real reviews, update:

```txt
app/reviews/page.tsx
```

## Logo

Your LearnStack logo is stored here:

```txt
public/learnstack-logo.png
```
