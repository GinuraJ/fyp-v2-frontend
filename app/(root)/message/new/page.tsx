"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertMessage } from "@/components/alertPost"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/lib/config"

type AlertVariant = "success" | "warning" | "error"

const DEFAULT_TYPE = "Q"
const DEFAULT_STATUS = "1"

export default function NewMessagePage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messageType, setMessageType] = useState("Trade Issue")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [alert, setAlert] = useState<{
    show: boolean
    title: string
    variant: AlertVariant
  } | null>(null)

  useEffect(() => {
    setRole(localStorage.getItem("role"))
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userId = localStorage.getItem("email")?.trim() ?? ""
    if (!userId) {
      setAlert({
        show: true,
        title: "Not logged in",
        variant: "error",
      })
      return
    }

    const formData = new FormData(e.currentTarget)
    const messageSubjectVal = String(formData.get("messageSubject") ?? "").trim()
    const messageContentVal = String(formData.get("messageContent") ?? "").trim()
    const messageTypeVal = String(formData.get("messageType") ?? "").trim()

    if (!messageSubjectVal || !messageContentVal) {
      setAlert({
        show: true,
        title: "Please fill subject and message content",
        variant: "warning",
      })
      return
    }

    setSubmitting(true)
    setAlert(null)

    try {
      formData.set("userId", userId)
      formData.set("type", DEFAULT_TYPE)
      formData.set("status", DEFAULT_STATUS)

      const fileField = formData.get("attachment")
      const hasAttachment =
        fileField instanceof File && fileField.size > 0

      const res = hasAttachment
        ? await fetch(`${API_BASE_URL}/messages`, {
            method: "POST",
            body: formData,
          })
        : await fetch(`${API_BASE_URL}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              messageSubject: messageSubjectVal,
              messageContent: messageContentVal,
              messageType: messageTypeVal,
              type: DEFAULT_TYPE,
              status: DEFAULT_STATUS,
            }),
          })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(
          typeof data?.message === "string" ? data.message : "Failed to send message"
        )
      }
      if (data.code && data.code !== "0000") {
        throw new Error(data.message || "Failed to send message")
      }

      setAlert({
        show: true,
        title: "Message created successfully",
        variant: "success",
      })
      setTimeout(() => router.push("/message"), 800)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setAlert({ show: true, title: msg, variant: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    setMessageSubject("")
    setMessageContent("")
    setMessageType("Trade Issue")
    if (fileInputRef.current) fileInputRef.current.value = ""
    setAlert(null)
  }

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
        <div className="flex flex-1 flex-col">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6"
          >
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-fit -ml-2" asChild>
                <Link href="/message">← Back to messages</Link>
              </Button>
            </div>

            <Card className="w-full max-w-5xl">
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2 md:items-stretch md:gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="messageSubject">Subject</Label>
                      <Input
                        id="messageSubject"
                        name="messageSubject"
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        placeholder="Short subject"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="messageContent">Message</Label>
                      <textarea
                        id="messageContent"
                        name="messageContent"
                        required
                        rows={10}
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Describe your issue…"
                        className={cn(
                          "border-input placeholder:text-muted-foreground flex min-h-[200px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                          "dark:bg-input/30"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col gap-4 md:h-full">
                    <div className="space-y-2">
                      <Label>Message category</Label>
                      <input
                        type="hidden"
                        name="messageType"
                        value={messageType}
                        readOnly
                        aria-hidden
                      />
                      <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Trade Issue">Trade Issue</SelectItem>
                          <SelectItem value="Account">Account</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attachment">Attachment (optional)</Label>
                      <Input
                        ref={fileInputRef}
                        id="attachment"
                        name="attachment"
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        className="cursor-pointer"
                      />
                      <p className="text-muted-foreground text-xs">
                        Choose a document or image, or leave empty.
                      </p>
                    </div>

                    <div className="mt-auto flex w-full flex-col gap-3 pt-2">
                      {alert?.show && (
                        <div className="w-full">
                          <AlertMessage
                            title={alert.title}
                            date={new Date()}
                            variant={alert.variant}
                          />
                        </div>
                      )}
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          size="lg"
                          type="button"
                          variant="secondary"
                          onClick={handleClear}
                          className="w-full sm:w-auto"
                        >
                          Clear form
                        </Button>
                        <Button
                          size="lg"
                          type="submit"
                          disabled={submitting}
                          className="w-full sm:w-auto"
                        >
                          {submitting ? "Sending…" : "Send message"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
