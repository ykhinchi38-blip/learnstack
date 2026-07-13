# LearnStack Conversion Analytics Setup

LearnStack uses the existing Google Analytics integration from `@next/third-parties/google`. No analytics package needs to be installed.

## Local development

Add one measurement ID to `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Restart the Next.js server after changing environment variables. The older `NEXT_PUBLIC_GA_ID` remains supported as a fallback, but new deployments should use `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

When neither variable is set, the analytics helper intentionally does nothing. This keeps local development and preview environments free of event delivery unless they are explicitly configured.

## Vercel

1. Open the LearnStack project in Vercel.
2. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` under Project Settings, Environment Variables.
3. Set it for the desired environments, normally Production and Preview.
4. Redeploy the project.

## Privacy boundary

The tracking helper accepts only conversion-safe properties: product identifiers and titles, category, USD price and currency, CTA location, page path, source, audience preference, catalog, and partnership type.

Never add email addresses, names, phone numbers, message text, organization details, social profiles, order details, or other private form values to tracking calls.

## Events

- `homepage_viewed`, `catalog_viewed`, `product_viewed`, `bundle_viewed`, `partner_page_viewed`
- `preview_opened`, `sample_downloaded`, `free_sample_cta_clicked`
- `gumroad_buy_clicked`, `bundle_buy_clicked`
- `partnership_form_started`, `partnership_form_submitted`, `educator_copy_requested`, `newsletter_submitted`
