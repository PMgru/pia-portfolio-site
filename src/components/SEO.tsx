import { useEffect, useState } from 'react';
import Head from 'next/head';

interface SeoProps {
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackKeywords?: string;
  ogImage?: string;
  ogType?: string;
  schema?: any;
  canonicalPath?: string;
  // Optional SSR-pre-fetched data to skip the client fetch when available
  ssrMeta?: {
    meta_title?: string;
    meta_description?: string;
    focus_keyword?: string;
    og_image?: string;
  };
}

export default function SEO({
  slug,
  fallbackTitle,
  fallbackDescription,
  fallbackKeywords = 'Pial Mahmud, Digital Marketing Expert, SEO Expert, GEO, AEO, Technical SEO, Next.js Development',
  ogImage = '/images/og-home.jpg',
  ogType = 'website',
  schema,
  canonicalPath,
  ssrMeta,
}: SeoProps) {
  const [metaTitle, setMetaTitle] = useState(ssrMeta?.meta_title || fallbackTitle);
  const [metaDescription, setMetaDescription] = useState(ssrMeta?.meta_description || fallbackDescription);
  const [focusKeyword, setFocusKeyword] = useState(ssrMeta?.focus_keyword || fallbackKeywords);
  const [currentOgImage, setCurrentOgImage] = useState(ssrMeta?.og_image || ogImage);
  const [siteName, setSiteName] = useState('Pial Mahmud');
  const [imageAltText, setImageAltText] = useState('Pial Mahmud — Digital Marketing & SEO Expert');

  useEffect(() => {
    let active = true;

    // If ssrMeta was provided (from getServerSideProps), skip client-side fetch for page data
    if (slug && !ssrMeta) {
      fetch(`/api/pages?slug=${slug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((pageData) => {
          if (!active || !pageData) return;
          if (pageData.meta_title) setMetaTitle(pageData.meta_title);
          if (pageData.meta_description) setMetaDescription(pageData.meta_description);
          if (pageData.focus_keyword) setFocusKeyword(pageData.focus_keyword);
          if (pageData.og_image) setCurrentOgImage(pageData.og_image);
        })
        .catch(() => {});
    }

    // Always fetch global settings (site name, profile image alt, og_image override)
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((settings) => {
        if (!active || !settings) return;
        if (settings.site_name) setSiteName(settings.site_name);
        if (settings.profile_image_alt_text) setImageAltText(settings.profile_image_alt_text);
        // Use profile image as og:image for homepage if no specific og_image is set
        if (settings.profile_image && slug === 'home' && !ssrMeta?.og_image) {
          setCurrentOgImage(settings.profile_image);
        }
        // Allow admin to override og_image globally via settings
        if (settings.og_image_override) {
          setCurrentOgImage(settings.og_image_override);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [slug, ssrMeta]);

  const fullCanonicalUrl = `https://pialmahmud.com${canonicalPath || (slug === 'home' ? '' : `/${slug}`)}`;
  const finalOgImage = currentOgImage.startsWith('http') ? currentOgImage : `https://pialmahmud.com${currentOgImage}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={focusKeyword} />
      <meta name="author" content="Pial Mahmud" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:alt" content={imageAltText} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:image:alt" content={imageAltText} />
      <meta name="twitter:creator" content="@pialmahmud" />

      {/* Schema Injection */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
