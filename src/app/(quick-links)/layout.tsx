import { AppSidebar } from '@/components/app-sidebar';
import SearchBar from '@/components/ui/search-bar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/toggle-mode';

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center w-full justify-between shrink-0 border-b px-4 bg-muted/50 gap-8">
          <SidebarTrigger className="-ml-1" />
          <SearchBar />
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
