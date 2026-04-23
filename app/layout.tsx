import type { Metadata } from 'next';
import Script from 'next/script';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Physician-Owned Detox & Residential Treatment | Healthy Living',
  description: 'Same-day admissions 24/7. Physician-owned detox and residential treatment in the hills of Santa Clarita. Couples welcome. Pet-friendly. Most PPO insurance accepted.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
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
    <html lang="en" className={montserrat.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <Script id="gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PBT5NBL6');
        `}</Script>
        <Script
          id="ctm-formreactor"
          src="https://206076.tctm.co/formreactor.js"
          strategy="afterInteractive"
        />
        {/* Bridge CTM iframe form submissions → GTM dataLayer for Google Ads conversion */}
        <Script id="ctm-gtm-bridge" strategy="afterInteractive">{`
(function(){
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.addEventListener('message', function(e){
    var origin = e.origin || '';
    if (origin.indexOf('tctm.co') === -1 && origin.indexOf('calltrackingmetrics') === -1) return;
    var data = e.data || {};
    var type = (typeof data === 'string' ? data : (data.type || data.event || '')) + '';
    if (/submit|conversion|formsubmit|form_submit|leadcaptured/i.test(type)) {
      window.dataLayer.push({
        event: 'ctm_form_submit',
        form_id: 'FRT472ABB2C5B9B141A0D34850A59FA6661E0D33A5F99CB4151874B16424968667C',
        form_name: 'insurance_verification',
        ctm_origin: origin,
        ctm_payload: data
      });
    }
  });
})();
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
