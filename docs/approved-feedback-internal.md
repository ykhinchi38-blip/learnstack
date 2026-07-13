# Approved Feedback: Internal Publishing Guide

This file is for LearnStack's owner and collaborators. It is not a public submission form.

## Before adding any feedback

1. Keep the original message, purchase confirmation, or evaluation-copy record in a private owner-controlled location.
2. Ask for explicit permission to publish the person's name, role, organization, country, feedback text, and image when applicable.
3. Confirm whether the feedback comes from a verified purchase or a complimentary evaluation copy. Do not mark both unless both facts are true.
4. Confirm the product identifier against the current product `id` or `slug`.
5. Remove personal contact details, learner names, order numbers, and any information the contributor did not approve for publication.

## Add a record

Add an object to `data/testimonials.js` only after the checks above are complete:

```js
{
  id: "unique-stable-id",
  name: "Approved public name",
  role: "Teacher",
  organization: "Optional approved organization",
  country: "Optional approved country",
  productId: "current-product-id-or-slug",
  feedback: "Approved feedback text, kept faithful to the contributor's meaning.",
  source: "educator evaluation",
  verifiedPurchase: false,
  complimentaryEvaluationCopy: true,
  permissionGranted: true,
  published: true,
  date: "2026-07-13",
  image: ""
}
```

`permissionGranted` and `published` must both be `true` before a record can render publicly. Set either value to `false` to hide feedback immediately without deleting the audit record.

## Publication rules

- Never add ratings, stars, purchase counts, or claims that are not documented.
- Use `Verified purchase` only when the purchase is confirmed.
- Keep complimentary evaluation-copy feedback clearly labelled; do not imply it was a paid purchase.
- Do not publish a contributor image without explicit image permission. Use a local public image path or an approved hosted image only.
- Do not add feedback through a public unmoderated form. Review and approve it manually before adding it here.
- Run `npm.cmd run build` after changes to verify the approved records render safely.
