import { getLanguageLogoPath } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { Skeleton } from './ui/skeleton';

const AllLanguages = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem onClick={() => setOpen(true)}>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <AllLanguagesModal isModalOpen={open} setIsModalOpen={setOpen} />
    </>
  );
};

export default AllLanguages;

const AllLanguagesModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [languages, setLanguages] = React.useState<
    {
      name: string;
      no: number;
    }[]
  >([]);

  const filteredLanguages = languages.filter((language) =>
    language.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTitle></DialogTitle>
      {/* Modal Content */}
      <DialogContent>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          All Languages
        </h2>
        <p className="text-sm text-muted-foreground">
          This is a list of all the languages that are available in the
          database.
        </p>
        {isLoading && (
          <div className="flex flex-col gap-2 items-center justify-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-5" />
            ))}
          </div>
        )}

        {!isLoading && (
          <Input
            placeholder="Search for a language"
            className="mb-4"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {/* Scrollable List of Tags */}
        {languages.length > 0 ? (
          <ScrollArea className="h-72 overflow-y-auto border rounded-md p-2">
            <div className="space-y-2">
              {filteredLanguages.map((language, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 bg-muted/50 rounded-md px-3"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={getLanguageLogoPath(language.name)}
                      alt={language.name}
                      width={20}
                      height={20}
                    />
                    <span className="text-sm capitalize">{language.name}</span>
                  </div>
                  <span className="text-sm">{language.no}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground">No languages</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
