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
import { HeartIcon, SparklesIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const FavouritesClient = () => {
  const {
    searchTerm,
    selectedTags,
    snippets,
    currentPage: page,
  } = useAppSelector((state) => state.snippets);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const loadSnippets = useCallback(async () => {
    dispatch(clearStateByFilter('favourite'));
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchSnippets(
        searchTerm,
        selectedTags,
        page,
        'favourite'
      );

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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <SnippetCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <SparklesIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-center text-muted-foreground">Error: {error}</p>
        </div>
      ) : snippets.length > 0 ? (
        <>
          <SnippetGrid snippets={snippets} />
          <PaginationComponent />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <HeartIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No favourites yet.
          </p>
        </div>
      )}
    </React.Fragment>
  );
};

export default FavouritesClient;
