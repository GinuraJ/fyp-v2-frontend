"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/add-tree": "Add Tree",
  "/tree-repo": "Tree Repository",
  "/order-place": "Order Place",
  "/trades": "Trades",
  "/message": "Messages",
  "/message/new": "Create message",
  "/analytics": "Analytics",
  "/tree-validate": "Tree Validate",
}

function getPageTitle(pathname: string): string {
  const path = pathname.replace(/\/$/, "") || "/"
  if (PAGE_TITLES[path]) return PAGE_TITLES[path]
  if (path.startsWith("/tree-details/")) return "Tree Details"
  if (path.startsWith("/tree-details-validate/")) return "Tree Validation"
  const last = path.split("/").filter(Boolean).pop() ?? ""
  if (!last) return "GreenMint"
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function displayNameFromStorage(): string {
  if (typeof window === "undefined") return ""
  const storedName = localStorage.getItem("userName")?.trim() ?? ""
  const email = localStorage.getItem("email") ?? ""
  if (storedName) return storedName
  if (email.includes("@")) return email.split("@")[0]
  return email || "User"
}

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname])
  const [userName, setUserName] = useState("")

  useEffect(() => {
    setUserName(displayNameFromStorage())
  }, [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline text-sm font-medium text-foreground">
            Hi {userName || "…"}
          </span>
        </div>
      </div>
    </header>
  )
}
