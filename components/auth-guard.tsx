"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Protects routes under app/(root). Requires `role` + `email` in localStorage
 * (same keys as login). Unauthenticated users are sent to /user-logging.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    const email = localStorage.getItem("email")
    if (!role || !email) {
      router.replace("/user-logging")
      return
    }
    setAllowed(true)
  }, [router])

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}
