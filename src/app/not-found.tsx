import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | SnippetHub',
  description:
    "Oops! The page you are looking for doesn't exist. Organize, save, and share your code snippets effortlessly with a seamless developer-friendly experience at SnippetHub.",
  robots: 'noindex, follow',
  openGraph: {
    title: '404 - Page Not Found | SnippetHub',
    description: 'Oops! The page you are looking for does not exist.',
    url: 'https://snippethub.com/not-found',
    siteName: 'SnippetHub',
    images: [
      {
        url: 'https://snippethub.com/images/404-error.jpg',
        width: 1200,
        height: 630,
        alt: '404 Page Not Found - SnippetHub',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '404 - Page Not Found | SnippetHub',
    description: 'Oops! The page you are looking for does not exist.',
    images: ['https://snippethub.com/images/404-error.jpg'],
  },
};

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-6 flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-primary" />
        <h1 className="text-xl font-bold mt-4">404 - Page Not Found</h1>
        <p className="mt-2 text-center">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href={'/'}>
          <Button className="mt-6">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
