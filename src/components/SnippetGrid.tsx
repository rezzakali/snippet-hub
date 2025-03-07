'use client';

import { CodeSnippet } from '@/@types';
import { useTheme } from '@/components/ui/theme-provider';
import { useAppSelector } from '@/hooks/redux-hook';
import { copyHandler } from '@/lib/copy-handler';
import { getLanguageLogoPath } from '@/lib/utils';
import {
  archiveSnippetOptimistically,
  deleteSnippet,
  restoreSnippet,
  restoreSnippetOptimistically,
  rollbackSnippet,
  setEditData,
  setSelectedSnippet,
  toggleFavourite,
} from '@/redux/slices/snippetSlice';
import { useUser } from '@clerk/nextjs';
import {
  ArchiveRestore,
  ArchiveX,
  ArrowLeft,
  Copy,
  Globe,
  Heart,
  Pencil,
  Share2,
  TrashIcon,
  X,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'sonner';
import ConfirmationDialog from './confirmation-dialog';
import EditSnippetDialog from './edit-snippet-dialog';
import SnippetShareDialog from './snippet-share-dialog';
import { Badge } from './ui/badge';

export default function SnippetGrid({ snippets }: { snippets: CodeSnippet[] }) {
  const { selectedSnippet } = useAppSelector((state) => state.snippets);

  const [editSnippetDialogOpen, setEditDialogOpen] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const user = useUser();
  const { theme } = useTheme();

  const handleDelete = async () => {
    // ✅ Optimistically remove snippet from UI
    dispatch(deleteSnippet(snippet!._id));

    try {
      setIsLoading(true);
      const response = await fetch(`/api/snippets/${snippet!._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error(`Failed to delete snippet: ${response.status}`);
      }

      toast.success('Snippet deleted successfully!');
      setIsLoading(false);
      setDeleteDialog(false);
    } catch (error) {
      // ❌ Rollback if API call fails
      dispatch(restoreSnippet(snippet!));
      toast.error(`Failed to delete snippet: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavouriteHandler = async (id: string) => {
    if (!user?.user?.id) {
      toast.error('You must be logged in to favorite snippets');
      return;
    }

    dispatch(toggleFavourite({ snippetId: id, userId: user.user.id }));

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ snippetId: id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle favourite: ${response.status}`);
      }

      const data = await response.json();

      toast.success(
        `Snippet ${data.isFavourite ? 'added to' : 'removed from'} favourites`
      );
    } catch (error) {
      dispatch(toggleFavourite({ snippetId: id, userId: user.user.id }));
      toast.error(`Failed to toggle favourite: ${error}`);
    }
  };

  const moveToTrash = async (snippetId: string) => {
    try {
      dispatch(archiveSnippetOptimistically(snippetId));
      setIsLoading(true);
      const response = await fetch(`/api/snippets/trash/${snippetId}`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (!response.ok) toast.error(data.message || 'Failed to move to trash');

      setDeleteDialog(false);
      toast.success('Snippet moved to trash');
    } catch (error) {
      dispatch(rollbackSnippet(snippetId));
      toast.error(`Failed to move to trash: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (snippetId: string) => {
    try {
      const response = await fetch(`/api/snippets/trash/restore/${snippetId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        toast.error(`Failed to restore snippet: ${response.status}`);
      }

      const data = await response.json();
      if (!response.ok)
        toast.error(data.message || 'Failed to restore snippet');

      dispatch(restoreSnippetOptimistically(snippetId));

      toast.success('Snippet restored successfully!');
    } catch (error) {
      toast.error(`Failed to restore snippet: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3.5">
          {/* Snippet Grid */}
          <div
            className={`transition-all ${
              selectedSnippet ? 'hidden md:block md:w-2/3' : 'w-full'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {snippets.map((snippet) => {
                return (
                  <div
                    key={snippet._id}
                    className={`rounded p-4 bg-muted/50 space-y-2 relative`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />

                        <h2 className="text-sm font-semibold">
                          {snippet.title}
                        </h2>
                      </div>
                      <button className="transition">
                        <Heart
                          className={`w-3 h-3 text-primary`}
                          fill={
                            snippet.favouriteBy.includes(user?.user?.id ?? '')
                              ? 'currentColor'
                              : 'none'
                          }
                          onClick={() => toggleFavouriteHandler(snippet._id)}
                        />
                      </button>
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

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => {
                          dispatch(setSelectedSnippet(snippet));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs text-primary hover:underline capitalize"
                      >
                        view details
                      </button>
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
                      {user?.user?.id === snippet.createdBy && (
                        <div className="flex items-center gap-2 mt-2">
                          {/* Edit Button */}
                          <button
                            className="transition hover:text-primary"
                            onClick={() => {
                              dispatch(
                                setEditData({ isEditMode: true, snippet })
                              );
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>

                          {/* Restore & Delete Button */}
                          <div className="flex items-center gap-2">
                            {snippet.isArchived ? (
                              <>
                                {/* Restore Snippet */}
                                <button
                                  className="transition hover:text-green-500"
                                  onClick={() => handleRestore(snippet._id)}
                                  title="Restore Snippet"
                                >
                                  <ArchiveRestore className="w-3 h-3" />
                                </button>

                                {/* Permanently Delete Snippet */}
                                <button
                                  className="transition hover:text-destructive"
                                  onClick={() => {
                                    setSnippet(snippet);
                                    setDeleteDialog(true);
                                  }}
                                  title="Permanently Delete"
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </button>
                              </>
                            ) : (
                              /* Move to Trash */
                              <button
                                className="transition hover:text-destructive"
                                onClick={() => {
                                  setSnippet(snippet);
                                  setDeleteDialog(true);
                                }}
                                title="Move to Trash"
                              >
                                <ArchiveX className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-start !mt-4">
                      <Share2
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                          setSnippet(snippet);
                          setShareDialogOpen(true);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Snippet Details */}
          {selectedSnippet && (
            <div className="w-full md:w-1/3 bg-muted/50 rounded p-4 relative h-[85vh]">
              <div className="flex">
                <div className="flex items-center gap-2 my-4">
                  <Globe className="w-3 h-3" />

                  <h2 className="text-sm font-semibold">
                    {selectedSnippet.title}
                  </h2>
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-center gap-2">
                {selectedSnippet.tags.length > 0 &&
                  selectedSnippet.tags.map((tag) => (
                    <Badge
                      key={tag._id}
                      className="text-[0.6rem] rounded-full mt-1 capitalize"
                      variant={'default'}
                    >
                      {tag.name}
                    </Badge>
                  ))}
              </div>

              <p className="text-sm mt-2">{selectedSnippet.description}</p>

              <div className="mt-4 max-h-[300px] overflow-auto relative">
                <button
                  onClick={() => copyHandler(selectedSnippet.code)}
                  className="absolute top-2 right-2 p-1 rounded bg-background/80 hover:bg-background/60 transition-colors"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <SyntaxHighlighter
                  language={selectedSnippet.language}
                  style={theme === 'dark' ? a11yDark : a11yLight}
                  wrapLongLines
                  wrapLines
                  customStyle={{
                    fontFamily: 'font-mono',
                    fontSize: '0.7rem',
                    borderRadius: 5,
                  }}
                >
                  {selectedSnippet.code}
                </SyntaxHighlighter>
              </div>
              {/* Language and Delete */}
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                  <Image
                    src={getLanguageLogoPath(selectedSnippet.language)}
                    alt={selectedSnippet.language}
                    width={20}
                    height={20}
                    className="pointer-events-none"
                  />
                  <span className="text-xs text-muted-foreground">
                    {selectedSnippet.language}
                  </span>
                </div>
                <Heart
                  className={`w-3 h-3 text-primary cursor-pointer`}
                  fill={
                    selectedSnippet.favouriteBy.includes(user?.user?.id ?? '')
                      ? 'currentColor'
                      : 'none'
                  }
                  onClick={() => toggleFavouriteHandler(selectedSnippet._id)}
                />
                {user?.user?.id === selectedSnippet.createdBy && (
                  <div className="flex items-center gap-2">
                    {/* Edit Button */}
                    <button
                      className="transition hover:text-primary"
                      onClick={() => {
                        dispatch(
                          setEditData({
                            isEditMode: true,
                            snippet: selectedSnippet,
                          })
                        );
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>

                    {/* Restore & Delete Button */}
                    <div className="flex items-center gap-2">
                      {selectedSnippet.isArchived ? (
                        <>
                          {/* Restore Snippet */}
                          <button
                            className="transition hover:text-green-500"
                            onClick={() => handleRestore(selectedSnippet._id)}
                            title="Restore Snippet"
                          >
                            <ArchiveRestore className="w-3 h-3" />
                          </button>

                          {/* Permanently Delete Snippet */}
                          <button
                            className="transition hover:text-destructive"
                            onClick={() => {
                              setSnippet(selectedSnippet);
                              setDeleteDialog(true);
                            }}
                            title="Permanently Delete"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        /* Move to Trash */
                        <button
                          className="transition hover:text-destructive"
                          onClick={() => {
                            setSnippet(selectedSnippet);
                            setDeleteDialog(true);
                          }}
                          title="Move to Trash"
                        >
                          <ArchiveX className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-start !mt-4">
                <Share2
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setSnippet(selectedSnippet);
                    setShareDialogOpen(true);
                  }}
                />
              </div>

              <button
                className="md:hidden flex items-center gap-2 text-sm text-primary absolute top-1 left-2"
                onClick={() => dispatch(setSelectedSnippet(null))}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <X
                className="absolute top-1 right-2 cursor-pointer"
                onClick={() => dispatch(setSelectedSnippet(null))}
              />
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        loading={isLoading}
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title={
          snippet?.isArchived
            ? 'Permanently Delete Snippet'
            : 'Move Snippet to Trash'
        }
        description={
          snippet?.isArchived
            ? 'This action is irreversible. Are you sure you want to permanently delete this snippet?'
            : 'Are you sure you want to move this snippet to trash? You can restore it later.'
        }
        onConfirm={() => {
          if (snippet?.isArchived) {
            handleDelete();
          } else {
            moveToTrash(snippet!._id);
          }
        }}
      />

      <EditSnippetDialog
        open={editSnippetDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <SnippetShareDialog
        open={shareDialogOpen}
        setOpen={setShareDialogOpen}
        snippet={snippet!}
      />
    </React.Fragment>
  );
}
