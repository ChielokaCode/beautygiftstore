# Handcrafted Wrist Bead Stack Landing Page

A one-page Next.js + Tailwind CSS sales landing page for the handcrafted wrist bead stack offer.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## WhatsApp

All primary order CTAs route to:

- `+2349061815992`

The links use `wa.me` with pre-filled order messages.

## Replacing image placeholders

The page currently uses labelled image placeholder DIVs for:

- Hero wrist bead stack image
- Product lifestyle image
- Frozen stack
- Dark Royal stack
- Rose Crush stack
- Crystal Tide stack
- Customer testimonial photos
- WhatsApp screenshot testimonials

When the final images are supplied, replace the corresponding `<ImagePlaceholder />` components in `app/page.tsx` with Next.js `<Image />` components and place files in `/public`.
