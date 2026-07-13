# Product Data Validation

Run the development-only product data check before publishing catalog changes:

```powershell
npm.cmd run validate:products
```

The validator reads the normalized local catalog in `data/products.js`. It reports product IDs, derived route slugs, categories, cover images, Gumroad links, descriptions, pricing, preview status, and SEO fields.

The command exits with a non-zero status for critical catalog defects:

- duplicate IDs or derived slugs
- missing route-critical IDs or routes
- missing or invalid Gumroad links on published products
- invalid published USD prices or non-USD currency
- INR-formatted price text
- a `+` suffix on a fixed price
- a featured draft or archived product

Missing previews and optional product facts such as age range or skill level are reported without blocking the command. Products without a valid preview can remain published, but product UI must use the existing preview helper so it does not render a broken preview button.

For CI, run `npm.cmd run validate:products` before `npm.cmd run build`. The current project keeps this separate from the production build because products awaiting verified Gumroad USD prices are intentionally reported as critical catalog work rather than silently assigned a price.
