import { Metadata } from 'next';
import Tags from '../tags';
import TrashClient from './client';
export const metadata: Metadata = {
  title: 'Deleted Code Snippets | Trash',
  description:
    'View and restore your deleted code snippets. Recover accidentally removed snippets and manage your trash.',
  keywords: [
    'deleted code snippets',
    'trash snippets',
    'recover code',
    'restore snippets',
    'code management',
    'programming',
    'JavaScript',
    'React',
    'Python',
    'Web Development',
  ],
  openGraph: {
    title: 'Trash - Deleted Code Snippets',
    description:
      'Manage your deleted code snippets. Restore or permanently delete removed snippets.',
    url: 'https://yourwebsite.com/trash',
    type: 'website',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Deleted Code Snippets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trash - Deleted Code Snippets',
    description:
      'Recover or permanently remove deleted code snippets from your trash.',
    images: ['/preview.png'],
  },
  alternates: {
    canonical: 'https://yourwebsite.com/trash',
  },
};

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <Tags />
      <TrashClient />
    </div>
  );
};

export default page;
