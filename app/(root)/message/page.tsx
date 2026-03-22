"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { MessagesPanel } from "@/components/messagesPanel"

export default function MessagePage() {
  const [role, setRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setRole(localStorage.getItem("role"))
    setMounted(true)
  }, [])

  if (!mounted || !role) return null

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as import("react").CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
              <p className="text-muted-foreground max-w-2xl text-sm">
                View pending support messages and create a new message when you need
                help.
              </p>
            </div>
            <Button asChild className="shrink-0 sm:mt-0">
              <Link href="/message/new">Create message</Link>
            </Button>
          </div>

          <MessagesPanel />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
