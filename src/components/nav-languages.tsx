'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { getLanguageLogoPath } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

export function NavLanguages() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [languages, setLanguages] = React.useState<
    {
      name: string;
      no: number;
    }[]
  >([]);

  React.useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/languages');
        const { data } = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-5 rounded" />
            ))}
          </div>
        ) : (
          languages.slice(0, 6).map((language, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild tooltip={language.name}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={getLanguageLogoPath(language.name)}
                      alt={language.name}
                      width={20}
                      height={20}
                      className="pointer-events-none"
                    />
                    <span className="capitalize">{language.name}</span>
                  </div>
                  <p className="text-xs font-semibold">{language.no}</p>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
