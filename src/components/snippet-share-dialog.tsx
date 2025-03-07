import { CodeSnippet } from '@/@types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import React, { useState } from 'react';

export default function SnippetShareDialog({
  open,
  setOpen,
  snippet,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  snippet: CodeSnippet;
}) {
  const shareableLink = `${window.location.origin}/explore/${snippet?.shareId}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Snippet</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Copy and share your code snippet with ease.
        </p>
        <div className="flex items-center gap-2">
          <Input value={shareableLink} readOnly className="flex-1" />
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? (
              <ClipboardCheck className="w-5 h-5 text-green-500" />
            ) : (
              <Clipboard className="w-5 h-5" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
