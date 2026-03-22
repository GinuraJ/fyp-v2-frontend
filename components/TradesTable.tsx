"use client"

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
import { Badge } from "@/components/ui/badge"

export type TradeRow = {
  _id: string
  tradeId: string
  buyOrderId: string
  sellOrderId: string
  price: number
  quantity: number
  tradeDate: string
  userSide: string
}

type TradesTableProps = {
  data: TradeRow[]
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

export function TradesTable({ data }: TradesTableProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your trades</CardTitle>
        <CardDescription>
          Matched buy/sell orders for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trade ID</TableHead>
              <TableHead>Buy order</TableHead>
              <TableHead>Sell order</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Trade date</TableHead>
              <TableHead>Side</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={`${row._id}-${row.tradeDate}-${index}`}>
                <TableCell className="font-mono text-xs max-w-[140px] truncate">
                  {row.tradeId}
                </TableCell>
                <TableCell className="font-mono text-xs">{row.buyOrderId}</TableCell>
                <TableCell className="font-mono text-xs">{row.sellOrderId}</TableCell>
                <TableCell className="text-right tabular-nums">{row.price}</TableCell>
                <TableCell className="text-right tabular-nums">{row.quantity}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDateTime(row.tradeDate)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      row.userSide?.toLowerCase() === "buy"
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {row.userSide ?? "—"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
