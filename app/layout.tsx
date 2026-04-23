import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Physician-Owned Detox & Residential Treatment | Healthy Living',
  description: 'Same-day admissions 24/7. Physician-owned detox and residential treatment in the hills of Santa Clarita. Couples welcome. Pet-friendly. Most PPO insurance accepted.',
  openGraph: {
    title: 'Healthy Living Residential Program',
    description: 'Physician-owned detox & residential treatment. Santa Clarita, CA.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://healthylivingresidential.com/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PBT5NBL6');
        `}</Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PBT5NBL6"
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
