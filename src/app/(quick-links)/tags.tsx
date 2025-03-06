'use client';

import { Tag } from '@/@types';
import AddTagDialog from '@/components/add-tag';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch } from '@/hooks/redux-hook';
import { setSelectedTags } from '@/redux/slices/snippetSlice';
import { RootState } from '@/redux/store';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const Tags = () => {
  const { selectedTags } = useSelector((state: RootState) => state.snippets);

  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([{ _id: 'all', name: 'All' }]);

  const handleTagClick = (tag: string) => {
    let newTags: string[];

    if (tag === 'all') {
      newTags = ['all'];
    } else {
      const newSelected = selectedTags.filter((t) => t !== 'all');
      if (newSelected.includes(tag)) {
        newTags = newSelected.filter((t) => t !== tag);
      } else {
        newTags = newSelected.length < 3 ? [...newSelected, tag] : newSelected;
      }
    }

    dispatch(setSelectedTags(newTags));
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tags');
        if (!response.ok) {
          toast.error('Failed to fetch tags');
        }
        const data = await response.json();
        setTags([{ _id: 'all', name: 'All' }, ...data.data]);
        setIsLoading(false);
      } catch (error) {
        toast.error(`Error fetching tags ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <React.Fragment>
      <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded-md/50 rounded">
        {/* Swipable Categories */}
        {isLoading ? (
          <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-2 px-2 snap-x snap-mandatory scroll-smooth w-full max-w-[21rem] md:max-w-3xl lg:max-w-3xl">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-20" />
            ))}
          </div>
        ) : (
          <div
            className="flex gap-2 overflow-x-auto scrollbar-none -mx-2 px-2 snap-x snap-mandatory scroll-smooth w-full max-w-[21rem] md:max-w-3xl lg:max-w-3xl"
            style={{
              msOverflowStyle: 'none' /* IE and Edge */,
              scrollbarWidth: 'none' /* Firefox */,
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x', // Enable swipe gestures
            }}
          >
            {tags.slice(0, 10).map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag.name.toLowerCase())}
                className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-4 text-xs transition-colors capitalize ${
                  selectedTags.includes(tag.name.toLowerCase())
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border hover:bg-muted/50'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {/* Add Tag Button */}
        <button
          className="inline-flex h-6 items-center rounded-full border px-4 text-xs transition-colors bg-primary text-primary-foreground"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-3 h-3" /> Tag
        </button>
      </div>
      <AddTagDialog open={open} onOpenChange={setOpen} />
    </React.Fragment>
  );
};

export default Tags;
