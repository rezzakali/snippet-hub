import LandingPageHeader from '@/components/home-header';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { Metadata } from 'next';
import PreviewImage from './preview-image';

export const metadata: Metadata = {
  title: 'SnippetHub - Your Go-To Code Snippet Manager',
  description:
    'SnippetHub helps developers store, manage, and share code snippets efficiently. Organize your code with tags, search functionality, and more.',
  keywords: [
    'code snippets',
    'developer tools',
    'snippet manager',
    'coding',
    'programming',
    'Next.js',
  ],
  authors: [{ name: 'Rezzak', url: 'https://snippet-hub-kohl.vercel.app' }],
  creator: 'SnippetHub Team',
  openGraph: {
    title: 'SnippetHub - Your Go-To Code Snippet Manager',
    description:
      'Store, manage, and share code snippets easily with SnippetHub. Organize your code snippets and access them anytime.',
    url: 'https://snippet-hub-kohl.vercel.app',
    siteName: 'SnippetHub',
    images: [
      {
        url: 'https://snippet-hub-kohl.vercel.app/preview.png',
        width: 1200,
        height: 630,
        alt: 'SnippetHub preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnippetHub - Your Go-To Code Snippet Manager',
    description:
      'Organize, manage, and share your favorite code snippets with SnippetHub.',
    images: ['https://snippet-hub-kohl.vercel.app/preview.png'],
  },
  metadataBase: new URL('https://snippet-hub-kohl.vercel.app'),
};

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background text-text px-6 py-12">
      <LandingPageHeader />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mt-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-primary">SnippetHub</span> your go-to code
          snippet manager
        </h1>
        <p className="mt-4 text-md text-muted-foreground">
          Organize, save, and share your code snippets effortlessly with a
          seamless developer-friendly experience.
        </p>
      </div>

      {/* CTA Image Section */}
      <div className="mt-12 w-full max-w-4xl text-center">
        <PreviewImage />
        <p className="mt-6 text-lg font-medium">
          Start organizing your snippets today!
        </p>
        <SignInButton mode="modal">
          <Button className="mt-4 px-6 py-3 text-md">Try SnippetHub</Button>
        </SignInButton>
      </div>
    </div>
  );
}
