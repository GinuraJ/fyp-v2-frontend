"use client"

import { useEffect, useMemo, useState } from "react"

import { MessagesTable, type MessageRow } from "@/components/MessagesTable"
import { AlertMessage } from "@/components/alertPost"
import { API_BASE_URL } from "@/lib/config"

function filterPending(messages: MessageRow[]): MessageRow[] {
  return messages.filter((m) => String(m.status) === "1")
}

export function MessagesPanel() {
  const [allMessages, setAllMessages] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const email = localStorage.getItem("email")?.trim() ?? ""
    if (!email) {
      setLoading(false)
      setError("Not logged in. Please sign in again.")
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${API_BASE_URL}/messages/userWise/${encodeURIComponent(email)}`
        )
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json?.message || "Failed to load messages")
        }
        if (json.code !== "0000") {
          throw new Error(json?.message || "Failed to load messages")
        }

        const list = Array.isArray(json.data) ? json.data : []
        const mapped: MessageRow[] = list.map((m: any) => ({
          _id: String(m._id),
          messageId: m.messageId ?? "",
          userId: m.userId ?? "",
          messageSubject: m.messageSubject ?? "",
          messageContent: m.messageContent ?? "",
          type: m.type ?? "",
          status: String(m.status ?? ""),
          enterDate: m.enterDate ?? "",
          messageType: m.messageType ?? "",
          messageAttachment: m.messageAttachment ?? "",
        }))
        setAllMessages(mapped)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load messages"
        setError(msg)
        setAllMessages([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const pending = useMemo(
    () => filterPending(allMessages),
    [allMessages]
  )

  return (
    <div className="flex w-full max-w-6xl flex-col gap-4">
      {loading && (
        <p className="text-sm text-muted-foreground">Loading messages…</p>
      )}
      {!loading && error && <AlertMessage title={error} variant="error" />}
      {!loading && !error && pending.length === 0 && (
        <AlertMessage title="No pending messages" variant="warning" />
      )}
      {!loading && !error && pending.length > 0 && (
        <MessagesTable data={pending} />
      )}
    </div>
  )
}
