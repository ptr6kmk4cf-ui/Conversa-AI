import type { Metadata, Viewport } from 'next';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conversa AI — your multilingual dating assistant',
  description: 'Find compatible matches, write personalised openers and keep conversations flowing in 89 languages.',
  applicationName: 'Conversa AI',
  appleWebApp: { capable: true, title: 'Conversa AI', statusBarStyle: 'black-translucent' },
  icons: { apple: '/icons/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#0f0d17',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
