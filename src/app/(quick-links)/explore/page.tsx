import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Tags from '../tags';
import ExploreSnippets from './client';

export const metadata: Metadata = {
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

const page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in'); // Redirect to sign-in if not logged in
  }

  return (
    <div className="flex flex-col gap-4">
      <Tags />
      <ExploreSnippets />
    </div>
  );
};

export default page;
