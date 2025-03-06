'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';

export function ModeToggle() {
  const [isClient, setIsClient] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <React.Fragment>
      {isClient ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative h-7 w-7 rounded"
        >
          <Sun
            className={`h-3 w-3 transition-all ${
              theme === 'dark' ? 'rotate-0 scale-0' : 'rotate-90 scale-100'
            }`}
          />
          <Moon
            className={`absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transition-all ${
              theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      ) : null}
    </React.Fragment>
  );
}
