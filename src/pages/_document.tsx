import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark scroll-smooth">
      <Head>
        {/* Custom font and analytics placeholders */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body className="antialiased bg-[#0A0A0F] text-[#F4F4F9] min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
