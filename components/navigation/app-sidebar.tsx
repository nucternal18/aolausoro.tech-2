'use client'

import * as React from 'react'
import { Bot, Bug, Calendar1, Command, Home, Images, Mail, UserCircle } from 'lucide-react'

// Components
import { NavMain } from '@components/navigation/nav-main'
import { NavUser } from '@components/navigation/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from 'components/ui/sidebar'
import Image from 'next/image'

// This is sample data.
const data = {
  user: {
    name: '',
    email: '',
    avatar: '',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: Home,
    },
    {
      title: 'Jobs',
      url: '/admin/jobs',
      icon: Calendar1,
    },
    {
      title: 'Projects',
      url: '/admin/projects',
      icon: UserCircle,
    },
    {
      url: '/admin/messages',
      title: 'Messages',
      icon: Mail,
    },
    {
      title: 'Issues',
      url: '/admin/issues',
      icon: Bug,
    },
    {
      title: 'Scrap Book',
      url: '/admin/wiki',
      icon: Images,
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground relative flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={'/android-chrome-192x192.png'}
                    alt="logo"
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    style={{
                      objectFit: 'cover', // cover, contain, none
                    }}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Aolausoro.tech</span>
                  <span className="truncate text-xs">Portfolio</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
