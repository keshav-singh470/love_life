import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apna Pal — Your Personal Digital Keepsake',
  description:
    'Create a beautiful, private web page for someone you love — a letter, a countdown, your memories, all in one place. Share the link with anyone, anywhere.',
  keywords: ['love letter', 'digital keepsake', 'personal page', 'countdown', 'memories', 'gift'],
  openGraph: {
    title: 'Apna Pal',
    description: 'A little corner of the internet, made just for them.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Petit+Formal+Script&family=Karla:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'Karla, sans-serif',
              background: '#fffaf6',
              color: '#3a1f2b',
              border: '1px solid rgba(138,47,76,0.2)',
              borderRadius: '12px',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
