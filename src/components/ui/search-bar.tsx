'use client';

import { useAppDispatch } from '@/hooks/redux-hook';
import { setEditData, setSearchTerm } from '@/redux/slices/snippetSlice';
import { Plus, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import AddSnippetDialog from '../add-snippet-dialog';
import { Input } from './input';

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term) => {
    dispatch(setSearchTerm(term.trim()));
  }, 500);

  return (
    <React.Fragment>
      {pathname !== '/account' && (
        <div className="relative flex items-center w-full max-w-xl">
          <Search className="absolute left-3 w-3 h-3" />
          <Input
            className="pl-10 pr-32 py-1 w-full rounded-full bg-background"
            placeholder="Search snippets..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          {pathname !== '/trash' && (
            <button
              className="absolute right-0 text-sm bg-primary rounded-full text-primary-foreground py-1 px-3 flex items-center gap-1"
              onClick={() => {
                dispatch(setEditData({ isEditMode: false, snippet: null }));
                setOpen(true);
              }}
            >
              <Plus className="w-3 h-3" /> Snippet
            </button>
          )}
        </div>
      )}
      <AddSnippetDialog open={open} onOpenChange={setOpen} />
    </React.Fragment>
  );
};

export default SearchBar;
