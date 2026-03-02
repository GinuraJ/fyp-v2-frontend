"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


type buySellStatus = "B" | "S" 

export type OrderRow = {
  orderId: string
  buySell: buySellStatus
  priceMin: number
  priceMax: number
  quantity: number
  executeFrom:string
  executeTo:string
  executeStatus:string
  balanceQuantity: number
  enterDate: string
}

type OrderTableProps = {
  data: OrderRow[]
  onView?: (row: OrderRow) => void
}

function getStatusLabel(status: buySellStatus) {
  switch (status) {
    case "B":
      // Pending - yellow
      return {
        label: "Buy",
        className:
          "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      }
    case "S":
      // Approved - blue
      return {
        label: "Sell",
        className:
          "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      }
    default:
      return {
        label: status,
        className:
          "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
      }
  }
}

export function OrderTable({ data, onView }: OrderTableProps) {

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-CA")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          A list of your recently placed orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {/* <TableCaption>A list of your orders.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Order ID</TableHead>
              <TableHead>Flag</TableHead>
              <TableHead>Minumum Price</TableHead>
              <TableHead>Maximum Price</TableHead>
              <TableHead>Quatity</TableHead>
              <TableHead>Balance Quantity</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Execute Status</TableHead>
              <TableHead>Enter Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              const { label, className } = getStatusLabel(row.buySell)
              return (
                <TableRow key={row.orderId + index}>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>
                    <Badge className={className}>{label}</Badge>
                  </TableCell>
                  <TableCell>{row.priceMin}</TableCell>
                  <TableCell>{row.priceMax}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.balanceQuantity}</TableCell>
                  <TableCell>{formatDate(row.executeFrom)}</TableCell>
                  <TableCell>{formatDate(row.executeTo)}</TableCell>
                  <TableCell>{row.executeStatus}</TableCell>
                  <TableCell>{formatDate(row.enterDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView?.(row)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex-col gap-2" />
    </Card>
  )
}
