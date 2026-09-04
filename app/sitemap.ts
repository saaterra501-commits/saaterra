import type { MetadataRoute } from 'next';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackdeal.in';

  let dealRoutes: MetadataRoute.Sitemap = [];

  try {
    const conn = await dbConnect();
    if (conn) {
      const deals = await Deal.find({
        $or: [{ status: 'Active' }, { status: { $exists: false } }]
      }).select('slug updatedAt createdAt').lean();

      if (deals && deals.length > 0) {
        dealRoutes = deals.map((d: any) => ({
          url: `${baseUrl}/deals/${d.slug}`,
          lastModified: d.updatedAt || d.createdAt || new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.9,
        }));
      }
    }
  } catch (err) {
    console.warn('Sitemap dynamic deal fetch warning:', err);
  }

  // Fallback defaults if database is not reachable at build time
  if (dealRoutes.length === 0) {
    const fallbackSlugs = [
      'chat-chacha',
      'mailblaze-pro',
      'scrapeking-ai',
      'rankrocket-geo',
      'omnicrm-suite',
      'funnelmax-pro',
      'flowpilot-automate',
      'docuseal-india'
    ];
    dealRoutes = fallbackSlugs.map((slug) => ({
      url: `${baseUrl}/deals/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/appsumo-alternative-india`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/plus`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/badges`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/redeem`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...dealRoutes];
}
