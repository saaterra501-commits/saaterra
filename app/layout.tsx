import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LegalBetaDisclaimer from "@/components/LegalBetaDisclaimer";
import GuestAuthNudge from "@/components/GuestAuthNudge";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.stackdeal.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StackDeal — India's #1 B2B SaaS 5-Year Deal Marketplace",
    template: "%s | StackDeal India",
  },
  description:
    "India's premier B2B software discovery marketplace. Get exclusive 5-Year Access Passes on WhatsApp automation, AI & GEO SEO, CRM, and Lead Scrapers. Save 90%+ with instant UPI checkout & GST invoices.",
  keywords: [
    "StackDeal",
    "stackdeal.in",
    "Stack Deal",
    "SaaS deals India",
    "B2B software lifetime deals",
    "AppSumo India alternative",
    "AppSumo alternative",
    "5-Year SaaS access passes",
    "5 year software deals",
    "WhatsApp Meta Cloud API marketing software",
    "GEO SEO generative engine optimization tools",
    "AI SEO software India",
    "Google Maps lead scraper software",
    "Indian agency tech stack discounts",
    "GST invoice B2B software",
    "Razorpay UPI SaaS checkout",
  ],
  authors: [{ name: "StackDeal India", url: siteUrl }],
  creator: "StackDeal Marketplace",
  publisher: "StackDeal Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon", sizes: "48x48", type: "image/png" },
      { url: "/stackdeal-icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "tjrhKK8lic4LxbLxJmyjnemqrwbHQh61k9zbqNeg5O0",
  },
  openGraph: {
    title: "StackDeal — India's #1 B2B SaaS 5-Year Deal Marketplace",
    description:
      "Save 90%+ on top software tools for Indian digital agencies. Pay once in INR via UPI, use for 5 full years. 60-day money back guarantee & GST tax invoices.",
    url: siteUrl,
    siteName: "StackDeal",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/stackdeal-logo.png",
        width: 1200,
        height: 630,
        alt: "StackDeal India B2B SaaS Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackDeal — 5-Year SaaS Passes for Indian Agencies",
    description:
      "Stop paying monthly subscriptions. Get 5-Year software passes with instant UPI checkout and GST invoices.",
    creator: "@stackdealIN",
    images: ["/stackdeal-logo.png"],
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India, Delhi, Mumbai, Bengaluru, Hyderabad, Pune, Ahmedabad",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StackDeal",
  "alternateName": "StackDeal India",
  "url": siteUrl,
  "logo": {
    "@type": "ImageObject",
    "url": `${siteUrl}/stackdeal-logo.png`,
    "width": 389,
    "height": 132,
    "caption": "StackDeal — India's #1 B2B SaaS 5-Year Deal Marketplace Logo"
  },
  "image": `${siteUrl}/stackdeal-logo.png`,
  "description": "India's premier B2B SaaS discovery marketplace offering 5-Year Access Passes for digital agencies, SMBs, and solopreneurs.",
  "foundingLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  },
  "sameAs": [
    "https://x.com/stackdealIN",
    "https://www.linkedin.com/company/stack-deal-/",
    "https://www.instagram.com/stackdeal.in/",
    "https://www.producthunt.com/products/stackdeal-2",
    "https://peerlist.io/stackdeal30"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@stackdeal.in",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi"]
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "StackDeal",
  "url": siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${siteUrl}/deals?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full overflow-x-hidden w-full max-w-full" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="tjrhKK8lic4LxbLxJmyjnemqrwbHQh61k9zbqNeg5O0" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon" />
        <link rel="icon" type="image/png" sizes="192x192" href="/stackdeal-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Google Analytics GA4 Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y59B5WRHRG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y59B5WRHRG', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google Fonts — Fraunces & Inter (New Kansas Web Pairing) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Organization JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* WebSite SearchAction JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased overflow-x-hidden w-full max-w-full"
        style={{ fontFamily: "'New Kansas', 'newKansas', 'Fraunces', 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <LegalBetaDisclaimer />
        <GuestAuthNudge />
        {children}
      </body>
    </html>
  );
}
