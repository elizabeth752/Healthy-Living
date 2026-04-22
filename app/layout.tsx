import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Physician-Owned Detox & Residential Treatment | Healthy Living',
  description: 'Same-day admissions 24/7. Physician-owned detox and residential treatment in the hills of Santa Clarita. Couples welcome. Pet-friendly. Most PPO insurance accepted.',
  openGraph: {
    title: 'Healthy Living Residential Program',
    description: 'Physician-owned detox & residential treatment. Santa Clarita, CA.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
