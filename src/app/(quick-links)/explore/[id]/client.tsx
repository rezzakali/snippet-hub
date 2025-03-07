'use client';

import { CodeSnippet } from '@/@types';
import { Badge } from '@/components/ui/badge';
import SnippetCardSkeleton from '@/components/ui/snippet-skeleton';
import { useTheme } from '@/components/ui/theme-provider';
import { copyHandler } from '@/lib/copy-handler';
import { getLanguageLogoPath } from '@/lib/utils';
import { Copy, Globe, SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const SnippetClient = () => {
  const params = useParams();
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();

  useEffect(() => {
    if (!params.id) return;

    const fetchSnippet = async () => {
      try {
        const response = await fetch(`/api/snippets/share/${params.id}`);
        if (!response.ok) throw new Error('Snippet not found');
        const data = await response.json();
        setSnippet(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [params.id]);

  return (
    <React.Fragment>
      {loading ? (
        <SnippetCardSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <SparklesIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-center text-muted-foreground">Error: {error}</p>
        </div>
      ) : (
        snippet && (
          <div
            className={`rounded p-4 bg-muted/50 space-y-2 w-full md:w-2/3 mx-auto relative mt-4`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />

                <h2 className="text-sm font-semibold">{snippet.title}</h2>
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2">
              {snippet.tags.length > 0 &&
                snippet.tags.map((tag) => (
                  <Badge
                    key={tag._id}
                    className="text-[0.6rem] rounded-full mt-1 capitalize"
                    variant={'default'}
                  >
                    {tag.name}
                  </Badge>
                ))}
            </div>

            {/* Description */}
            <p className="text-xs mt-2">{snippet.description}</p>

            {/* Code Block */}
            <div className="mt-3 rounded text-xs relative">
              <div className="max-h-36 overflow-auto relative">
                <button
                  onClick={() => copyHandler(snippet.code)}
                  className="absolute top-2 right-2 p-1 rounded bg-background/80 hover:bg-background text-xs"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <SyntaxHighlighter
                  language={snippet.language}
                  style={theme === 'dark' ? a11yDark : a11yLight}
                  wrapLongLines
                  wrapLines
                  customStyle={{
                    fontFamily: 'font-mono',
                    fontSize: '0.7rem',
                    margin: 0,
                    borderRadius: 5,
                  }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Language and Delete */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Image
                  src={getLanguageLogoPath(snippet.language)}
                  alt={snippet.language}
                  width={20}
                  height={20}
                  className="pointer-events-none"
                />
                <span className="text-xs text-muted-foreground">
                  {snippet.language}
                </span>
              </div>
            </div>
          </div>
        )
      )}
    </React.Fragment>
  );
};

export default SnippetClient;
