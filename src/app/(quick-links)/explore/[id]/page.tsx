import SnippetClient from './client';

import connectDB from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  const snippet = await Snippet.findOne({ shareId: id });

  if (!snippet) {
    return {
      title: 'Snippet Not Found | SnippetHub',
      description: 'The snippet you are looking for does not exist.',
      openGraph: {
        title: 'Snippet Not Found | SnippetHub',
        description: 'The snippet you are looking for does not exist.',
      },
    };
  }

  return {
    title: `${snippet.title} | SnippetHub`,
    description:
      snippet.description || 'Explore this code snippet on SnippetHub.',
    openGraph: {
      title: `${snippet.title} | SnippetHub`,
      description:
        snippet.description || 'Explore this code snippet on SnippetHub.',
      url: `https://snippet-hub-kohl/explore/${id}`,
      type: 'article',
      images: [
        {
          url: 'https://snippet-hub-kohl/preview.png',
          width: 800,
          height: 400,
          alt: 'Snippet preview',
        },
      ],
    },
  };
}

const page = () => {
  return <SnippetClient />;
};

export default page;
