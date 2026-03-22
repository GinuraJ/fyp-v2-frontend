"use client"

import { useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { TradesPanel } from "@/components/tradesPanel"

export default function TradesPage() {
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
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <TradesPanel />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
