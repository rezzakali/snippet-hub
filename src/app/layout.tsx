import { JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import Providers from './providers';

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetBrainsMono',
});

export const metadata = {
  title: 'Explore Code Snippets - Improve Your Coding Efficiency',
  description:
    'Discover a collection of useful code snippets across various programming languages and frameworks.',
  keywords: [
    'code snippets',
    'programming',
    'JavaScript',
    'React',
    'Python',
    'Web Development',
    'Backend',
    'Frontend',
    'Optimization',
    'Best Practices',
  ],
  openGraph: {
    title: 'Explore Code Snippets - Improve Your Coding Efficiency',
    description:
      'Find and share high-quality code snippets for JavaScript, Python, React, and more.',
    url: 'https://snippet-hub-kohl.vercel.app/explore',
    type: 'website',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Explore Code Snippets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Code Snippets',
    description: 'Find and share coding snippets to boost your productivity.',
    images: ['/preview.png'],
  },
  alternates: {
    canonical: 'https://snippet-hub-kohl.vercel.app/explore',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetBrainsMono.variable} antialiased`}
        style={{ fontFamily: jetBrainsMono.style.fontFamily }}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
