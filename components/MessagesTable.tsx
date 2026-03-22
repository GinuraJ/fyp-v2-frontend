"use client"

import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export type MessageRow = {
  _id: string
  messageId: string
  userId: string
  messageSubject: string
  messageContent: string
  type: string
  status: string
  enterDate: string
  messageType: string
  messageAttachment: string
}

type MessagesTableProps = {
  data: MessageRow[]
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

export function MessagesTable({ data }: MessagesTableProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<MessageRow | null>(null)

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Pending messages</CardTitle>
          <CardDescription>
            Messages with status open
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={`${row._id}-${index}`}>
                  <TableCell className="font-mono text-xs">{row.messageId}</TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    {row.messageSubject}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.messageType}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(row.enterDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActive(row)
                        setOpen(true)
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{active?.messageSubject ?? "Message"}</SheetTitle>
            <SheetDescription>
              {active ? `${active.messageId} · ${formatDate(active.enterDate)}` : ""}
            </SheetDescription>
          </SheetHeader>
          {active && (
            <div className="flex flex-col gap-4 px-4 pb-6 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-medium">Content</p>
                <p className="mt-1 whitespace-pre-wrap">{active.messageContent}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Type: {active.type}</Badge>
                <Badge variant="secondary">Status: {active.status}</Badge>
                <Badge variant="outline">{active.messageType}</Badge>
              </div>
              {active.messageAttachment ? (
                <div>
                  <p className="text-muted-foreground text-xs font-medium">Attachment</p>
                  <a
                    href={active.messageAttachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary mt-1 inline-block text-sm underline"
                  >
                    Open attachment
                  </a>
                  {/\.(png|jpe?g|gif|webp)$/i.test(active.messageAttachment) && (
                    <img
                      src={active.messageAttachment}
                      alt=""
                      className="mt-2 max-h-48 w-full rounded-md border object-contain"
                    />
                  )}
                </div>
              ) : null}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
