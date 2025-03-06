'use client';

import PaginationComponent from '@/components/pagination-component';
import SnippetGrid from '@/components/SnippetGrid';
import SnippetCardSkeleton from '@/components/ui/snippet-skeleton';
import { useAppSelector } from '@/hooks/redux-hook';
import { fetchSnippets } from '@/lib/utils';
import {
  clearStateByFilter,
  updateSnippetsData,
} from '@/redux/slices/snippetSlice';
import { SparklesIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const ExploreSnippets = () => {
  const {
    searchTerm,
    selectedTags,
    snippets,
    currentPage: page,
  } = useAppSelector((state) => state.snippets);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  // ✅ Memoized function to prevent unnecessary recreation
  const loadSnippets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    dispatch(clearStateByFilter('all'));

    try {
      const data = await fetchSnippets(searchTerm, selectedTags, page, 'all');
      dispatch(
        updateSnippetsData({
          snippets: data.data,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedTags, page]);

  // ✅ Load snippets on mount
  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  return (
    <React.Fragment>
      {isLoading ? ( // Show skeleton while loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <SnippetCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? ( // Show error if there's one
        <div className="flex flex-col items-center justify-center h-screen">
          <SparklesIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-center text-muted-foreground">Error: {error}</p>
        </div>
      ) : snippets.length > 0 ? ( // Show snippets if available
        <>
          <SnippetGrid snippets={snippets} />
          <PaginationComponent />
        </>
      ) : (
        // Show empty state only if there's no data and not loading
        <div className="flex flex-col items-center justify-center h-screen">
          <SparklesIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No snippets to explore.
          </p>
        </div>
      )}
    </React.Fragment>
  );
};

export default ExploreSnippets;
