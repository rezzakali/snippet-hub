'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Heart, Sparkles, SquareTerminal, Tags, Trash } from 'lucide-react';
import AllLanguages from './all-languages';
import { NavLanguages } from './nav-languages';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
const data = {
  navMain: [
    {
      title: 'Explore',
      url: '/explore',
      icon: Sparkles,
      isActive: true,
    },
    {
      title: 'Favourites',
      url: '/favourites',
      icon: Heart,
    },
    {
      title: 'Trash',
      url: '/trash',
      icon: Trash,
    },

    {
      title: 'Tags',
      url: '/tags',
      icon: Tags,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <React.Fragment>
      <Sidebar {...props} collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-transparent active:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-primary text-sidebar-primary-foreground">
                    <SquareTerminal className="size-4" />
                  </div>
                  <div className="flex text-left text-sm">
                    <span className="font-bold text-primary">Snippet</span> Hub
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quick links</SidebarGroupLabel>
            <NavMain items={data.navMain} />
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Languages</SidebarGroupLabel>
            <NavLanguages />
          </SidebarGroup>
          <SidebarGroup>
            <AllLanguages />
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <NavUser />
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </React.Fragment>
  );
}
