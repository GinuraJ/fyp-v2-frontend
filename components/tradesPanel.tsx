"use client"

import { useEffect, useMemo, useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TradesTable, type TradeRow } from "@/components/TradesTable"
import { AlertMessage } from "@/components/alertPost"
import { API_BASE_URL } from "@/lib/config"

export type TradeRange = "7d" | "month" | "year"

function getUserIdForTradesApi(): string {
  return localStorage.getItem("email")?.trim() ?? ""
}

function filterTradesByRange(trades: TradeRow[], range: TradeRange): TradeRow[] {
  const cutoff = new Date()
  if (range === "7d") {
    cutoff.setDate(cutoff.getDate() - 7)
  } else if (range === "month") {
    cutoff.setDate(cutoff.getDate() - 30)
  } else {
    cutoff.setFullYear(cutoff.getFullYear() - 1)
  }
  cutoff.setHours(0, 0, 0, 0)

  return trades.filter((t) => {
    const d = new Date(t.tradeDate)
    return !Number.isNaN(d.getTime()) && d >= cutoff
  })
}

export function TradesPanel() {
  const [range, setRange] = useState<TradeRange>("7d")
  const [allTrades, setAllTrades] = useState<TradeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = getUserIdForTradesApi()
    if (!userId) {
      setLoading(false)
      setError("Not logged in. Please sign in again.")
      return
    }

    const fetchTrades = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${API_BASE_URL}/trades/user/${encodeURIComponent(userId)}`
        )
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json?.message || "Failed to load trades")
        }

        if (json.code !== "0000") {
          throw new Error(json?.message || "Failed to load trades")
        }

        const list = Array.isArray(json.trades) ? json.trades : []
        const mapped: TradeRow[] = list.map((t: any) => ({
          _id: String(t._id),
          tradeId: t.tradeId ?? "",
          buyOrderId: t.buyOrderId ?? "",
          sellOrderId: t.sellOrderId ?? "",
          price: Number(t.price),
          quantity: Number(t.quantity),
          tradeDate: t.tradeDate ?? "",
          userSide: t.userSide ?? "",
        }))
        setAllTrades(mapped)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load trades"
        setError(msg)
        setAllTrades([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const filtered = useMemo(
    () => filterTradesByRange(allTrades, range),
    [allTrades, range]
  )

  return (
    <div className="flex w-full max-w-6xl flex-col gap-4">
      <Tabs
        value={range}
        onValueChange={(v) => setRange(v as TradeRange)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="7d">Last 7 days</TabsTrigger>
          <TabsTrigger value="month">Last Month</TabsTrigger>
          <TabsTrigger value="year">Last Year</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading trades…</p>
      )}
      {!loading && error && (
        <AlertMessage title={error} variant="error" />
      )}
      {!loading && !error && filtered.length === 0 && (
        <AlertMessage
          title="No trades in this period"
          variant="warning"
        />
      )}
      {!loading && !error && filtered.length > 0 && (
        <TradesTable data={filtered} />
      )}
    </div>
  )
}
