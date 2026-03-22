"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconArrowsExchange,
  IconMessage,
  IconReport,
  IconSearch,
  IconSettings,
  IconTree,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      roles: ["P"],
    },
    {
      title: "Add Tree",
      url: "/add-tree",
      icon: IconTree,
      roles: ["P"],
    },
    
    {
      title: "Tree Repository",
      url: "/tree-repo",
      icon: IconListDetails,
      roles: ["P"],
    },
    {
      title: "Order Place",
      url: "/order-place",
      icon: IconUsers,
      roles: ["P"],
    },
    {
      title: "Trades",
      url: "/trades",
      icon: IconArrowsExchange,
      roles: ["P"],
    },
    {
      title: "Messages",
      url: "/message",
      icon: IconMessage,
      roles: ["P"],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
      roles: ["A"],
    },
    {
      title: "Tree Validate",
      url: "/tree-validate",
      icon: IconChartBar,
      roles: ["A"],
    },
    {
      title: "My Wallet",
      url: "#",
      icon: IconFolder,
      roles: ["P"],
    },

  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  export function AppSidebar({
    ...props
  }: React.ComponentProps<typeof Sidebar>) {
  
    const [role, setRole] = useState<string | null>(null)
    const [user, setUser] = useState<{
      name: string
      email: string
      avatar: string
    }>({ name: "", email: "", avatar: "" })

    useEffect(() => {
      const storedRole = localStorage.getItem("role")
      const storedEmail = localStorage.getItem("email") ?? ""
      const storedName = localStorage.getItem("userName")?.trim() ?? ""
      setRole(storedRole)

      const displayName =
        storedName ||
        (storedEmail.includes("@")
          ? storedEmail.split("@")[0]
          : storedEmail) ||
        "User"

      setUser({
        name: displayName,
        email: storedEmail,
        avatar: "",
      })
    }, [])

    if (!role) return null

    const navMainItems = data.navMain.filter((item) =>
      item.roles?.includes(role)
    )
  
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">GreenMint</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMainItems} />
          {/* <NavDocuments items={data.documents} /> */}
          {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    );
  }
