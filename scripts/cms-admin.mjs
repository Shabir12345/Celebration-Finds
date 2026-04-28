/**
 * Celebration Finds — CMS Admin CLI
 *
 * Claude runs this script to manage all website content via Sanity.
 * Usage: node scripts/cms-admin.mjs <command> [options as JSON]
 *
 * Commands:
 *   list-products
 *   list-blog-posts
 *   list-categories
 *   list-portfolio
 *   list-blog-categories
 *   seo-audit
 *   create-blog-post     '{"title":"...", "excerpt":"...", "body":[...], "metaTitle":"...", "metaDescription":"...", "categoryIds":["..."]}'
 *   update-blog-post     '{"id":"...", "title":"...", "excerpt":"...", "metaTitle":"...", "metaDescription":"..."}'
 *   delete-blog-post     '{"id":"..."}'
 *   create-product       '{"name":"...", "description":"...", "priceBase":12, "categoryId":"...", "minQuantity":25}'
 *   update-product       '{"id":"...", "name":"...", "description":"...", "priceBase":12}'
 *   create-portfolio     '{"title":"...", "description":"...", "category":"wedding", "clientType":"bride", "completionDate":"2025-06-01"}'
 *   update-seo           '{"type":"blogPost|product", "id":"...", "metaTitle":"...", "metaDescription":"..."}'
 *   upload-image         '{"filePath":"/tmp/img.jpg", "filename":"custom-candle-favor-wedding.jpg", "contentType":"image/jpeg"}'
 *   add-product-image    '{"productId":"...", "assetId":"image-xxx-jpg", "altText":"..."}'
 *   set-product-images   '{"productId":"...", "images":[{"assetId":"image-xxx-jpg","altText":"..."}]}'
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

// Load .env manually
let env = {};
try {
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
} catch {
  // fall through to process.env
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vae4tg27';
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error('ERROR: SANITY_API_WRITE_TOKEN not found in .env');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-03-24', useCdn: false, token });

const siteUrl = env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.celebrationfinds.com';

// Calls the production revalidation endpoint so pages go live immediately.
async function revalidateLive(slugs = [], types = []) {
  const { default: https } = await import('https');
  const targets = slugs.length ? slugs : [''];
  for (const slug of targets) {
    const body = JSON.stringify({ _type: types[0] || 'product', slug: { current: slug } });
    await new Promise(resolve => {
      function attempt(url) {
        const u = new URL('/api/revalidate', url);
        const opts = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } };
        const req = https.request(u, opts, res => {
          if (res.statusCode === 307 || res.statusCode === 301 || res.statusCode === 302) {
            const loc = res.headers.location;
            attempt(loc.startsWith('http') ? new URL(loc).origin : url);
            return;
          }
          res.resume();
          resolve();
        });
        req.on('error', () => resolve());
        req.write(body);
        req.end();
      }
      attempt(siteUrl);
    });
  }
}

const [,, command, argStr] = process.argv;
const args = argStr ? JSON.parse(argStr) : {};

// Processed images tracker
const trackerPath = resolve(__dirname, 'processed-images.json');
function loadTracker() {
  if (!existsSync(trackerPath)) return {};
  try { return JSON.parse(readFileSync(trackerPath, 'utf8')); } catch { return {}; }
}
function saveTracker(data) {
  writeFileSync(trackerPath, JSON.stringify(data, null, 2));
}

async function run() {
  switch (command) {

    case 'list-products': {
      const items = await client.fetch(`*[_type == "product"] {
        _id, name, "slug": slug.current, priceBase, isActive, isFeatured,
        "category": category->name, description,
        "imageCount": count(images), metaTitle, metaDescription
      } | order(_createdAt desc)`);
      console.log(JSON.stringify(items, null, 2));
      break;
    }

    case 'list-blog-posts': {
      const items = await client.fetch(`*[_type == "blogPost"] {
        _id, title, "slug": slug.current, publishedAt, excerpt,
        metaTitle, metaDescription,
        "categories": categories[]->title
      } | order(publishedAt desc)`);
      console.log(JSON.stringify(items, null, 2));
      break;
    }

    case 'list-categories': {
      const items = await client.fetch(`*[_type == "category"] { _id, name, "slug": slug.current, description }`);
      console.log(JSON.stringify(items, null, 2));
      break;
    }

    case 'list-blog-categories': {
      const items = await client.fetch(`*[_type == "blogCategory"] { _id, title, "slug": slug.current, description }`);
      console.log(JSON.stringify(items, null, 2));
      break;
    }

    case 'list-portfolio': {
      const items = await client.fetch(`*[_type == "portfolioEntry"] {
        _id, title, "slug": slug.current, category, clientType,
        "completionDate": completionDate, description
      } | order(completionDate desc)`);
      console.log(JSON.stringify(items, null, 2));
      break;
    }

    case 'seo-audit': {
      const [products, posts] = await Promise.all([
        client.fetch(`*[_type == "product"] { _id, name, "slug": slug.current, metaTitle, metaDescription, description }`),
        client.fetch(`*[_type == "blogPost"] { _id, title, "slug": slug.current, metaTitle, metaDescription, excerpt }`),
      ]);
      const report = {
        products_missing_seo: products.filter(p => !p.metaTitle || !p.metaDescription),
        posts_missing_seo: posts.filter(p => !p.metaTitle || !p.metaDescription),
        products_missing_description: products.filter(p => !p.description),
        total_products: products.length,
        total_posts: posts.length,
      };
      console.log(JSON.stringify(report, null, 2));
      break;
    }

    case 'create-blog-post': {
      const { title, excerpt, body, metaTitle, metaDescription, categoryIds, publishedAt } = args;
      if (!title) throw new Error('title is required');
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const doc = {
        _type: 'blogPost',
        title,
        slug: { _type: 'slug', current: slug },
        excerpt: excerpt || '',
        publishedAt: publishedAt || new Date().toISOString(),
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || '',
        body: body || [{ _type: 'block', _key: 'intro', style: 'normal', children: [{ _type: 'span', _key: 's1', text: excerpt || '' }] }],
        categories: (categoryIds || []).map(id => ({ _type: 'reference', _ref: id, _key: id })),
      };
      const result = await client.create(doc);
      await revalidateLive([slug, ''], ['blogPost']);
      console.log(JSON.stringify({ success: true, id: result._id, slug, live: true }, null, 2));
      break;
    }

    case 'update-blog-post': {
      const { id, ...fields } = args;
      if (!id) throw new Error('id is required');
      const patch = {};
      if (fields.title) { patch.title = fields.title; }
      if (fields.slug) { patch.slug = { _type: 'slug', current: fields.slug }; }
      if (fields.excerpt !== undefined) { patch.excerpt = fields.excerpt; }
      if (fields.metaTitle !== undefined) { patch.metaTitle = fields.metaTitle; }
      if (fields.metaDescription !== undefined) { patch.metaDescription = fields.metaDescription; }
      if (fields.body !== undefined) { patch.body = fields.body; }
      if (fields.publishedAt) { patch.publishedAt = fields.publishedAt; }
      await client.patch(id).set(patch).commit();
      const updatedBlog = await client.fetch(`*[_id == $id][0]{ "slug": slug.current }`, { id });
      if (updatedBlog?.slug) await revalidateLive([updatedBlog.slug, ''], ['blogPost']);
      console.log(JSON.stringify({ success: true, live: true }));
      break;
    }

    case 'delete-blog-post': {
      if (!args.id) throw new Error('id is required');
      await client.delete(args.id);
      console.log(JSON.stringify({ success: true }));
      break;
    }

    case 'create-product': {
      const { name, description, priceBase, categoryId, minQuantity, isFeatured } = args;
      if (!name || !priceBase || !categoryId) throw new Error('name, priceBase, categoryId required');
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const result = await client.create({
        _type: 'product',
        name,
        slug: { _type: 'slug', current: slug },
        description: description || '',
        priceBase,
        minQuantity: minQuantity || 25,
        category: { _type: 'reference', _ref: categoryId },
        isActive: true,
        isFeatured: isFeatured || false,
        images: [],
      });
      await revalidateLive([slug, ''], ['product']);
      console.log(JSON.stringify({ success: true, id: result._id, slug, live: true }, null, 2));
      break;
    }

    case 'update-product': {
      const { id, ...fields } = args;
      if (!id) throw new Error('id is required');
      const patch = {};
      if (fields.name !== undefined) patch.name = fields.name;
      if (fields.description !== undefined) patch.description = fields.description;
      if (fields.priceBase !== undefined) patch.priceBase = fields.priceBase;
      if (fields.minQuantity !== undefined) patch.minQuantity = fields.minQuantity;
      if (fields.isActive !== undefined) patch.isActive = fields.isActive;
      if (fields.isFeatured !== undefined) patch.isFeatured = fields.isFeatured;
      if (fields.metaTitle !== undefined) patch.metaTitle = fields.metaTitle;
      if (fields.metaDescription !== undefined) patch.metaDescription = fields.metaDescription;
      await client.patch(id).set(patch).commit();
      // Fetch slug to revalidate the right product page
      const updated = await client.fetch(`*[_id == $id][0]{ "slug": slug.current }`, { id });
      if (updated?.slug) await revalidateLive([updated.slug, ''], ['product']);
      console.log(JSON.stringify({ success: true, live: true }));
      break;
    }

    case 'create-portfolio': {
      const { title, description, category, clientType, completionDate } = args;
      if (!title) throw new Error('title is required');
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const result = await client.create({
        _type: 'portfolioEntry',
        title,
        slug: { _type: 'slug', current: slug },
        description: description || '',
        category: category || 'wedding',
        clientType: clientType || 'bride',
        completionDate: completionDate || new Date().toISOString().split('T')[0],
        images: [],
      });
      console.log(JSON.stringify({ success: true, id: result._id, slug }, null, 2));
      break;
    }

    case 'update-seo': {
      const { id, metaTitle, metaDescription } = args;
      if (!id) throw new Error('id is required');
      const patch = {};
      if (metaTitle !== undefined) patch.metaTitle = metaTitle;
      if (metaDescription !== undefined) patch.metaDescription = metaDescription;
      await client.patch(id).set(patch).commit();
      console.log(JSON.stringify({ success: true }));
      break;
    }

    case 'bulk-update-seo': {
      const { updates } = args;
      if (!Array.isArray(updates)) throw new Error('updates array required');
      const tx = client.transaction();
      for (const u of updates) {
        const patch = {};
        if (u.metaTitle) patch.metaTitle = u.metaTitle;
        if (u.metaDescription) patch.metaDescription = u.metaDescription;
        tx.patch(u.id, p => p.set(patch));
      }
      await tx.commit();
      console.log(JSON.stringify({ success: true, count: updates.length }));
      break;
    }

    // ─── Image management ────────────────────────────────────────────────────

    case 'upload-image': {
      // Uploads a local image file to Sanity and returns the asset ID.
      // args: { filePath, filename, contentType }
      const { filePath, filename, contentType } = args;
      if (!filePath) throw new Error('filePath is required');
      if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
      const buffer = readFileSync(filePath);
      const resolvedFilename = filename || basename(filePath);
      const resolvedContentType = contentType || (
        resolvedFilename.endsWith('.png') ? 'image/png' :
        resolvedFilename.endsWith('.webp') ? 'image/webp' :
        'image/jpeg'
      );
      const asset = await client.assets.upload('image', buffer, {
        filename: resolvedFilename,
        contentType: resolvedContentType,
      });
      console.log(JSON.stringify({
        success: true,
        assetId: asset._id,
        url: asset.url,
        filename: resolvedFilename,
      }, null, 2));
      break;
    }

    case 'add-product-image': {
      const { productId, assetId, altText } = args;
      if (!productId || !assetId) throw new Error('productId and assetId are required');
      const imageObj = {
        _type: 'image',
        _key: `img_${Date.now()}`,
        asset: { _type: 'reference', _ref: assetId },
      };
      await client.patch(productId)
        .setIfMissing({ images: [] })
        .append('images', [imageObj])
        .commit();
      const p = await client.fetch(`*[_id == $id][0]{ "slug": slug.current }`, { id: productId });
      if (p?.slug) await revalidateLive([p.slug, ''], ['product']);
      console.log(JSON.stringify({ success: true, altText, live: true }));
      break;
    }

    case 'set-product-images': {
      const { productId, images } = args;
      if (!productId || !Array.isArray(images)) throw new Error('productId and images array required');
      const imageObjs = images.map((img, i) => ({
        _type: 'image',
        _key: `img_${Date.now()}_${i}`,
        asset: { _type: 'reference', _ref: img.assetId },
      }));
      await client.patch(productId).set({ images: imageObjs }).commit();
      const p2 = await client.fetch(`*[_id == $id][0]{ "slug": slug.current }`, { id: productId });
      if (p2?.slug) await revalidateLive([p2.slug, ''], ['product']);
      console.log(JSON.stringify({ success: true, count: imageObjs.length, live: true }));
      break;
    }

    case 'mark-drive-processed': {
      // Records a Google Drive file ID as processed so it won't be re-uploaded.
      // args: { driveFileId, productId, productName, assetId }
      const tracker = loadTracker();
      tracker[args.driveFileId] = {
        processedAt: new Date().toISOString(),
        productId: args.productId,
        productName: args.productName,
        assetId: args.assetId,
      };
      saveTracker(tracker);
      console.log(JSON.stringify({ success: true, tracked: args.driveFileId }));
      break;
    }

    case 'list-processed-drive-files': {
      const tracker = loadTracker();
      console.log(JSON.stringify(tracker, null, 2));
      break;
    }

    case 'is-drive-processed': {
      // Returns whether a Drive file ID has already been processed.
      // args: { driveFileId }
      const tracker = loadTracker();
      const result = tracker[args.driveFileId] || null;
      console.log(JSON.stringify({ processed: !!result, record: result }));
      break;
    }

    default:
      console.log(`
Celebration Finds CMS Admin CLI

CONTENT COMMANDS:
  list-products              List all products with SEO status
  list-blog-posts            List all blog posts
  list-categories            List product categories (get IDs for create)
  list-blog-categories       List blog categories
  list-portfolio             List portfolio entries
  seo-audit                  Find all content missing SEO metadata
  create-blog-post           Publish a new blog post (JSON args)
  update-blog-post           Edit a blog post by ID
  delete-blog-post           Delete a blog post by ID
  create-product             Add a new product
  update-product             Edit a product (price, description, SEO...)
  create-portfolio           Add a portfolio/lookbook entry
  update-seo                 Fix SEO on any document by ID
  bulk-update-seo            Batch SEO update across many documents

IMAGE COMMANDS:
  upload-image               Upload a local image file to Sanity CDN
  add-product-image          Append one image to a product
  set-product-images         Replace all images on a product
  mark-drive-processed       Record a Drive file ID as done (prevents re-upload)
  list-processed-drive-files Show all Drive files already uploaded
  is-drive-processed         Check if a Drive file ID was already processed

Example:
  node scripts/cms-admin.mjs upload-image '{"filePath":"/tmp/candle.jpg","filename":"custom-wedding-candle-favor.jpg"}'
  node scripts/cms-admin.mjs add-product-image '{"productId":"abc123","assetId":"image-xxx-jpg","altText":"Custom gold foil candle wedding favor"}'
      `);
  }
}

run().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
