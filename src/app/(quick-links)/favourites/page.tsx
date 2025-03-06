import { Metadata } from 'next';
import Tags from '../tags';
import FavouritesClient from './client';

export const metadata: Metadata = {
  title: 'Favourite Code Snippets - Your Saved Snippets',
  description:
    'Access your favourite code snippets saved across different programming languages and frameworks.',
  keywords: [
    'favourite code snippets',
    'saved snippets',
    'programming',
    'JavaScript',
    'React',
    'Python',
    'Web Development',
    'Backend',
    'Frontend',
    'Best Practices',
  ],
  openGraph: {
    title: 'Favourite Code Snippets - Your Saved Snippets',
    description:
      'Quickly access your saved and favourite code snippets in one place.',
    url: 'https://yourwebsite.com/favourites',
    type: 'website',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Favourite Code Snippets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favourite Code Snippets',
    description:
      'Save and manage your favourite code snippets for quick access.',
    images: ['/preview.png'],
  },
  alternates: {
    canonical: 'https://yourwebsite.com/favourites',
  },
};

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <Tags />
      <FavouritesClient />
    </div>
  );
};

export default page;
