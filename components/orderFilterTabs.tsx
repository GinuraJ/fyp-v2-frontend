"use client"

import { useEffect, useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderTable, type OrderRow } from "@/components/OrdersTable"

import { API_BASE_URL } from "@/lib/config";

type StatusFilter = "A" | "B" | "S" 

export function TabsOrders({ refreshKey = 0 }: { refreshKey?: number }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("A")
  const [data, setData] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      
      try {
        let url = `${API_BASE_URL}/order/Ginura/${statusFilter}`
        console.log(url)

        const res = await fetch(url)
        if (!res.ok) {
          throw new Error("Failed to fetch trees")
        }

        const json = await res.json()

        const mapped: OrderRow[] = (json as any[]).map((order) => ({
          _id: order._id,
          orderId: order.orderId,
          buySell: order.buySell,
          priceMin: order.priceMin,
          priceMax: order.priceMax,
          quantity: order.quantity,
          executeFrom: order.executeFrom,
          executeTo: order.executeTo,
          executeStatus: order.executeStatus,
          balanceQuantity: order.balanceQuantity,
          userId: order.userId,
          enterDate: order.enterDate,
        }))

        setData(mapped)
      } catch (err: any) {
        setError(err.message ?? "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [statusFilter,refreshKey])

  return (
    <div className="flex flex-col gap-4">

      <Tabs
        value={statusFilter}
        onValueChange={(value) => {
          setStatusFilter(value as StatusFilter)
        }}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="A">All</TabsTrigger>
          <TabsTrigger value="B">BUY</TabsTrigger>
          <TabsTrigger value="S">SELL</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading orders...</div>
      )}
      {error && (
        <div className="text-sm text-destructive">Error: {error}</div>
      )}

      {!loading && !error && <OrderTable data={data} />}
    </div>
  )
}
