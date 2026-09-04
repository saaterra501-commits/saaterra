import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import DealDetailClient from '@/components/DealDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.['deal-slug'];

  if (!slug) {
    return {
      title: 'SaaS Deals India | StackDeal',
      description: 'Exclusive 5-Year B2B SaaS access passes for Indian digital agencies.',
    };
  }

  let deal = null;
  try {
    await dbConnect();
    deal = await Deal.findOne({ slug }).lean();
  } catch (err) {
    console.warn('Metadata deal fetch error:', err);
  }

  if (!deal) {
    // Human-readable title fallback from slug
    const cleanTitle = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      title: `${cleanTitle} 5-Year Pass | StackDeal India`,
      description: `Get exclusive 5-Year access on ${cleanTitle}. Instant UPI payment, official 18% GST B2B tax invoice & 60-day money-back guarantee.`,
    };
  }

  const primaryTier = deal.pricingTiers?.[0];
  const priceFormatted = primaryTier?.price ? `₹${primaryTier.price.toLocaleString('en-IN')}` : '₹4,999';
  const originalPriceFormatted = primaryTier?.originalPrice ? `₹${primaryTier.originalPrice.toLocaleString('en-IN')}` : '₹49,999';

  const title = `${deal.title} 5-Year Pass: ${priceFormatted} (Save 90%+) | StackDeal India`;
  const description = `${deal.tagline || deal.description || ''} Save 90%+ with 5-Year access (${priceFormatted} vs ${originalPriceFormatted}). Instant UPI payment, 18% GST B2B invoice & 60-day guarantee.`.slice(0, 160);

  const ogImage = deal.screenshots?.[0] || deal.vendorLogo || 'https://www.stackdeal.in/stackdeal-logo.png';

  return {
    title,
    description,
    keywords: [
      deal.title,
      `${deal.title} lifetime deal`,
      `${deal.title} 5-year pass`,
      `${deal.title} review India`,
      `${deal.title} coupon code`,
      `${deal.category} deals India`,
      'AppSumo India alternative',
      'StackDeal India',
    ],
    openGraph: {
      title,
      description,
      url: `https://www.stackdeal.in/deals/${slug}`,
      siteName: 'StackDeal',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${deal.title} on StackDeal India`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://www.stackdeal.in/deals/${slug}`,
    },
  };
}

export default async function DealPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.['deal-slug'];

  let deal = null;
  try {
    await dbConnect();
    const dealDoc = await Deal.findOne({ slug }).lean();
    if (dealDoc) {
      deal = JSON.parse(JSON.stringify(dealDoc));
    }
  } catch (err) {
    console.error('Server-side deal fetch error:', err);
  }

  // Schema.org Product & AggregateOffer JSON-LD
  let jsonLd = null;
  if (deal) {
    const lowestPrice = deal.pricingTiers?.[0]?.price || 4999;
    const highestPrice = deal.pricingTiers?.[deal.pricingTiers.length - 1]?.price || lowestPrice;
    const reviewCount = (deal.reviews?.length || 0) + 14;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${deal.title} - 5-Year SaaS Access Pass`,
      image: deal.screenshots?.[0] || deal.vendorLogo || 'https://www.stackdeal.in/stackdeal-logo.png',
      description: deal.tagline || deal.description,
      brand: {
        '@type': 'Brand',
        name: deal.vendorName || deal.title,
      },
      sku: `STACKDEAL-${deal.slug.toUpperCase()}`,
      category: deal.category || 'B2B Software',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: lowestPrice,
        highPrice: highestPrice,
        offerCount: deal.pricingTiers?.length || 1,
        offers: (deal.pricingTiers || []).map((tier) => ({
          '@type': 'Offer',
          name: tier.tierName || '5-Year Access Pass',
          price: tier.price || lowestPrice,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `https://www.stackdeal.in/deals/${slug}`,
          seller: {
            '@type': 'Organization',
            name: 'StackDeal India',
            url: 'https://www.stackdeal.in',
          },
        })),
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <DealDetailClient initialDeal={deal} dealSlug={slug} params={resolvedParams} />
    </>
  );
}
