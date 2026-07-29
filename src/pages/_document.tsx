import { Html, Head, Main, NextScript } from 'next/document';

const GA_ID = 'G-L69Q08KSR9';

export default function Document() {
  return (
    <Html lang="en" className="dark scroll-smooth">
      <Head>
        {/* Custom font and analytics placeholders */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { page_path: window.location.pathname });`,
          }}
        />
      </Head>
      <body className="antialiased bg-[#0A0A0F] text-[#F4F4F9] min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
