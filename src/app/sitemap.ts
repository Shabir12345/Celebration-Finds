import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';
import { ALL_PRODUCTS_QUERY, PORTFOLIO_ENTRIES_QUERY } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://celebrationfinds.com';
  
  // Static routes
  const staticRoutes = [
    '',
    '/shop',
    '/portfolio',
    '/wholesale',
    '/about',
  ].map(route => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Product routes
    const products = await client.fetch(`*[_type == "product"]{ "slug": slug.current, _updatedAt }`);
    const productRoutes = products.map((product: any) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Higher priority for products
    }));

    // Dynamic Portfolio routes
    const portfolio = await client.fetch(`*[_type == "portfolioEntry"]{ "slug": slug.current, _updatedAt }`);
    const portfolioRoutes = portfolio.map((entry: any) => ({
      url: `${siteUrl}/portfolio/${entry.slug}`,
      lastModified: new Date(entry._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...portfolioRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
