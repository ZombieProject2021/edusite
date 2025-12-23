import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'SEO-Master CMS',
    template: '%s | SEO-Master CMS',
  },
  description: 'Современная система управления контентом с полной SEO-оптимизацией',
  keywords: ['CMS', 'SEO', 'Content Management', 'оптимизация'],
  authors: [{ name: 'SEO-Master' }],
  openGraph: {
    type: 'website',
    siteName: 'SEO-Master CMS',
    title: 'SEO-Master CMS',
    description: 'Современная система управления контентом с полной SEO-оптимизацией',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO-Master CMS',
    description: 'Современная система управления контентом с полной SEO-оптимизацией',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
