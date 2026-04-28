<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Celebration Finds — Claude Website Manager Context

Claude has full management access to this website. Read this file before taking any action on the codebase or CMS.

---

## The Business

**Celebration Finds** is a luxury custom party favor company based in Toronto, Ontario.
- Female-founded, eco-conscious, "quiet luxury" brand aesthetic
- Products: handmade custom candles, gift boxes, ribbons, foil-printed favors
- Customization: customers personalize colors, scents, ribbon, foil text via the GiftBuilder wizard
- Customers: brides, event planners, corporate gifting managers, baby shower hosts
- Price point: $5–$25 per unit, minimum order typically 25–50 pieces
- Positioning: "Gifts You Will Never Forget." — premium, emotional, handmade

**Brand voice:** Warm, feminine, elegant, joyful. Copy is written in second person ("you"). Sentences are short and clear. Words feel luxurious but approachable. Never clinical or corporate. Key phrases: "quiet luxury", "made by hand", "earth-friendly", "foil", "keepsake", "unboxing moment".

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router), React 19, TypeScript |
| CMS | Sanity v5 (project: `vae4tg27`, dataset: `production`) |
| Database | Supabase (orders, user accounts) |
| Payments | Stripe |
| Styling | Tailwind CSS v4, Framer Motion |
| Analytics | Vercel Analytics |
| Hosting | Vercel |

---

## Content Model (Sanity CMS)

### `product`
Fields: `name`, `slug`, `description`, `category` (ref), `priceBase`, `minQuantity`, `images[]`, `customizationSchema` (ref), `isFeatured`, `isActive`
SEO fields: `metaTitle`, `metaDescription` (add via `update-product` command if missing)

### `category`
Fields: `name`, `slug`, `description`

### `blogPost`
Fields: `title`, `slug`, `mainImage`, `categories[]` (ref to blogCategory), `publishedAt`, `excerpt` (max 200 chars), `body` (Portable Text), `metaTitle`, `metaDescription` (max 200 chars)

### `blogCategory`
Fields: `title`, `slug`, `description`

### `portfolioEntry`
Fields: `title`, `slug`, `images[]`, `category`, `clientType`, `completionDate`, `description`

### `customizationSchema`
Defines the GiftBuilder wizard steps: ribbon color, scent, foil text, etc.

---

## CMS Admin Script

Claude can manage ALL content by running:

```bash
node scripts/cms-admin.mjs <command> [JSON args]
```

### Available commands

| Command | What it does |
|---------|-------------|
| `list-products` | List all products with SEO status |
| `list-blog-posts` | List all blog posts with SEO status |
| `list-categories` | List product categories (get IDs for create) |
| `list-blog-categories` | List blog categories |
| `list-portfolio` | List portfolio/lookbook entries |
| `seo-audit` | Find all content missing metaTitle or metaDescription |
| `create-blog-post` | Publish a new blog post |
| `update-blog-post` | Edit an existing blog post |
| `delete-blog-post` | Remove a blog post |
| `create-product` | Add a new product to the shop |
| `update-product` | Edit a product (price, description, SEO, etc.) |
| `create-portfolio` | Add a portfolio/lookbook entry |
| `update-seo` | Fix SEO fields on any document |
| `bulk-update-seo` | Batch SEO fix across many documents |

### Portable Text format (for blog post body)

```json
[
  { "_type": "block", "_key": "h1", "style": "h2", "children": [{ "_type": "span", "_key": "s", "text": "Section Title" }] },
  { "_type": "block", "_key": "p1", "style": "normal", "children": [{ "_type": "span", "_key": "s", "text": "Paragraph text here." }] }
]
```

---

## File Structure

```
src/
  app/
    (public)/        # Customer-facing pages
      page.tsx       # Homepage
      shop/          # Product listing + individual product pages
      blog/          # Blog listing + individual post pages
      portfolio/     # Lookbook / gallery
      about/         # Brand story
      wholesale/     # Partner / wholesale inquiry
      checkout/      # Cart + checkout
      account/       # Customer account
    admin/
      dashboard/     # Admin dashboard (analytics, blog, products, orders, portfolio)
      studio/        # Embedded Sanity Studio
  lib/
    actions/         # Server actions (blog.ts, checkout.ts, orders.ts, inquiries.ts)
    queries.ts       # GROQ queries
    sanity-server.ts # Sanity write client
    sanity.ts        # Sanity read client
    supabase.ts      # Supabase client
    stripe.ts        # Stripe client
  sanity/
    schemas/         # product.ts, blogPost.ts, category.ts, portfolioEntry.ts, etc.
```

---

## SEO Guidelines

Claude follows these rules for all SEO metadata:
- **metaTitle**: 50–60 characters. Format: `[Product/Topic] | Celebration Finds`
- **metaDescription**: 120–155 characters. Include a benefit, a keyword, and a CTA. Match brand voice.
- **Blog slugs**: lowercase, hyphen-separated, keyword-first (e.g., `wedding-favor-ideas-2025`)
- **Primary keywords**: "custom party favors", "wedding favors", "luxury gift boxes", "personalized candles", "custom candles Toronto", "baby shower favors", "bridal shower favors"
- **Blog content strategy**: Seasonal events (spring weddings, holiday parties), how-to styling guides, real wedding features, gift trend roundups

---

## Claude's Management Permissions

Claude is authorized to autonomously:
- Run `seo-audit` and fix all missing SEO fields
- Write and publish blog posts on gifting, events, styling, and brand topics
- Update product descriptions to match brand voice
- Add portfolio entries for completed events
- Update meta titles and descriptions

Claude should NOT without asking:
- Delete products or blog posts
- Change product prices
- Modify the customization schema structure
- Push code changes to production

---

## Google Drive Image Pipeline

Product photos are uploaded to Google Drive and processed by Claude automatically.

| Folder | ID |
|--------|----|
| Queue (upload images here) | `15b35xPC0oSVtNZLu2UMDTUlY4Ry810nT` |
| Done (processed images) | `1BEl1EePF2jHkmQpv_0nGZ9f9TnOKE7X8` |

**Workflow:** Shabir drops product photos in the Queue folder → Claude runs `/upload-website-images` → analyzes each image, uploads to Sanity with SEO-optimized filename and alt text, attaches to the product, copies to Done folder, records the file ID in `scripts/processed-images.json`.

**Image SEO rules:**
- Filename format: `[product-type]-[color]-[occasion]-celebration-finds.jpg`
- Alt text: 100–125 chars — describes the product, occasion, and brand. Optimized for Google Images AND AI search engines (ChatGPT, Perplexity, Google SGE).
- AI search tip: AI engines read alt text, filenames, and product descriptions. Every image alt text should answer: "What is this? Who is it for? Where can I get it?"

The skill `upload-website-images` (at `~/.claude/skills/upload-website-images/SKILL.md`) has the full step-by-step workflow.

---

## Current Site Status (as of April 2026)

- Products in CMS: 1 (Perfume, $5, Wedding category — description and SEO fixed)
- Blog posts: 0 — needs content
- Site URL: https://celebrationfinds.com
- Sanity project ID: vae4tg27

## Immediate Priorities

1. Upload product images via the Drive pipeline
2. Create first 3 blog posts for organic traffic
3. Optimize all product pages for local SEO (Toronto, custom favors)
