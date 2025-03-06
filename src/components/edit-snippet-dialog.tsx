'use client';

import { Button } from '@/components/ui/button';
import { formSchema } from '@/lib/utils';
import { setEditData, updateSnippet } from '@/redux/slices/snippetSlice';
import { RootState } from '@/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditSnippetDialog = ({ open, onOpenChange }: DialogProps) => {
  const { editData } = useSelector((state: RootState) => state.snippets);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      code: '',
      tags: '',
      language: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/snippets/${editData.snippet?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        toast.error(`Failed to update snippet: ${response.status}`);
      }

      const data = await response.json();
      dispatch(updateSnippet(data.data));
      dispatch(setEditData({ isEditMode: false, snippet: null }));
      onOpenChange(false);

      toast.success(`Snippet updated successfully`);
    } catch (error) {
      toast.error(`Failed to edit snippet`, {
        description:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update form values when editData changes
  useEffect(() => {
    if (editData.isEditMode && editData.snippet) {
      form.reset({
        title: editData.snippet.title,
        description: editData.snippet.description,
        code: editData.snippet.code,
        tags: editData.snippet.tags.map((tag) => tag.name).join(', '),
        language: editData.snippet.language,
      });
    }
  }, [editData.isEditMode, editData.snippet, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-scroll max-h-[90vh] sm:max-h-[80vh] w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw]">
        <DialogHeader>
          <DialogTitle>
            {editData.isEditMode ? 'Edit' : 'Add'} Code Snippet
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      theme="vs-dark"
                      height="40vh"
                      language={form.watch('language') || 'javascript'}
                      value={field.value}
                      onChange={field.onChange}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: 'on',
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Language" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Tags (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? 'Loading...'
                  : editData.isEditMode
                  ? 'Edit Snippet'
                  : 'Add Snippet'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSnippetDialog;
