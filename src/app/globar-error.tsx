'use client';

import { Button } from '@/components/ui/button';

// Error boundaries must be Client Components

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-lg">Something went wrong!</p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
