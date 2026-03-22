import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  email: string | null
  role: string | null
}

import { API_BASE_URL } from "@/lib/config";


export function SectionCards({ email, role }: SectionCardsProps) {
  const [cashBalance, setCashBalance] = useState(0)
  const [creditBalance, setCreditBalance] = useState(0)
  const [totalTrees, setTotalTrees] = useState(0)
  const [totalOpenOrders, setTotalOpenOrders] = useState(0)

  useEffect(() => {
    if (!email || !role) return

    // Fetch Cash Balance
    fetch(`${API_BASE_URL}/cash/${email}`)
      .then((res) => res.json())
      .then((data) => setCashBalance(data?.data?.totalBalance || 0))
      .catch((err) => console.error("Cash API error:", err))

    // Fetch Credit Balance
    fetch(`${API_BASE_URL}/creditLedger/${email}`)
      .then((res) => res.json())
      .then((data) => setCreditBalance(data?.data?.totalBalance || 0))
      .catch((err) => console.error("Credit API error:", err))

    // Fetch Total Trees (use role as enterUser)
    fetch(`${API_BASE_URL}/trees/total/${email}`)
      .then((res) => res.json())
      .then((data) => setTotalTrees(data?.data?.totalTrees || 0))
      .catch((err) => console.error("Trees API error:", err))

    // Fetch Total Open Orders
    fetch(`${API_BASE_URL}/order/find/totalOpen/${email}`)
      .then((res) => res.json())
      .then((data) => setTotalOpenOrders(data?.data?.totalOpenOrders || 0))
      .catch((err) => console.error("Orders API error:", err))
  }, [email, role])       

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Cash Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${cashBalance.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Credit Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {creditBalance.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tree Count</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalTrees.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceeds targets</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pending Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOpenOrders.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}