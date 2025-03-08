'use client';

import { Tag } from '@/@types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@clerk/nextjs';
import { Loader2, Pencil, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';

export default function TagsModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);

  const user = useUser();

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      setIsAdding(true);
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTag.toLowerCase() }),
      });

      const data = await response.json();

      if (data.success) {
        setTags([...tags, data.data]);
        setNewTag('');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(`Failed to add tag: ${error}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditTag = async (index: number) => {
    if (editingIndex === index) {
      try {
        const response = await fetch(`/api/tags/${tags[index]._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newTag.toLowerCase() }),
        });

        const data = await response.json();

        if (data.success) {
          const updatedTags = [...tags];
          updatedTags[index] = data.data;
          setTags(updatedTags);
          setNewTag('');
          setEditingIndex(null);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(`Failed to update tag: ${error}`);
      }
    } else {
      setNewTag(tags[index].name);
      setEditingIndex(index);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      setDeletingTagId(id);
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        const updatedTags = tags.filter((tag) => tag._id !== id);
        setTags(updatedTags);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(`Failed to delete tag: ${error}`);
    } finally {
      setDeletingTagId(null);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tags');
        const data = await response.json();
        setTags(data.data);
      } catch (error) {
        toast.error(`Failed to fetch tags: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Create and organize your tags to better categorize your snippets.
          </DialogDescription>
        </DialogHeader>

        {/* Input Field for New Tag */}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Enter a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            required
          />
          <Button
            onClick={
              editingIndex !== null
                ? () => handleEditTag(editingIndex)
                : handleAddTag
            }
            variant="default"
            size={'sm'}
            disabled={isAdding}
          >
            {editingIndex !== null ? (
              <>
                Edit
                <Pencil className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                {isAdding ? 'Adding...' : 'Add'}
                <Plus className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col gap-2 items-center justify-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-5" />
            ))}
          </div>
        )}

        {/* Search Input */}
        {tags.length > 0 && (
          <Input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {/* Scrollable List of Tags */}
        {tags.length > 0 ? (
          <ScrollArea className="h-72 overflow-y-auto border rounded-md p-2">
            <div className="space-y-2">
              {filteredTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 bg-muted/50 rounded-md px-3"
                >
                  <span className="text-sm capitalize">{tag.name}</span>
                  {tag.createdBy === user?.user?.id && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTag(index)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTag(tag._id)}
                        disabled={deletingTagId === tag._id}
                      >
                        {deletingTagId === tag._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash className="w-3 h-3 text-red-500" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground">No tags</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
