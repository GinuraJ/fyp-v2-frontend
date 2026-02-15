 "use client"

import type React from "react"
import { useState } from "react"
import { AlertSuccessfull } from "@/components/alertSuccessfull"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ExpireType = "T" | "N" | "P"
type OrderType = "B" | "S"

export default function AnalyticsPage() {
  const [maxPrice, setMaxPrice] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [executeStatus, setExecuteStatus] = useState("")
  const [expireType, setExpireType] = useState<ExpireType>("T")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [orderType, setOrderType] = useState<OrderType>("B")

  const [eventSuccess, setEventSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {

        let executeFrom: string;
        let executeTo: string;
    
        const now = new Date();
    
        if (expireType === "T") {
          executeFrom = now.toISOString();
          const endOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59
          );
          executeTo = endOfToday.toISOString();
        } else if (expireType === "N") {
          const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0
          );
          const endOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59
          );
          executeFrom = startOfToday.toISOString();
          executeTo = endOfToday.toISOString();
        } else if (expireType === "P") {
          executeFrom = fromDate ? new Date(fromDate).toISOString() : "";
          executeTo =toDate ? new Date(toDate).toISOString() : "";
        } else {
            executeFrom = "";
            executeTo ="";
        }

      // Map form state to API payload
      const payload = {
        buySell: orderType,
        priceMin: minPrice,
        priceMax: maxPrice,
        quantity: quantity,
        executeFrom,
        executeTo,
        balanceQuantity: "0",
        executeStatus: executeStatus, 
        userId: "Ginura", 
      };

      console.log(payload.buySell);
  
      const response = await fetch("http://localhost:8080/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (data.code === "0000") {
        setEventSuccess(true);
        console.log("Order success:", data.order);
      } else {
        setEventSuccess(false);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      setEventSuccess(false);
      alert("Failed to place order. Check console for details.");
    }
  };
  

  const handleClear = () => {
    setMaxPrice("")
    setMinPrice("")
    setQuantity("")
    setExecuteStatus("")
    setExpireType("T")
    setFromDate("")
    setToDate("")
    setOrderType("B")
    setEventSuccess(false)

  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6 max-w-3xl"
            >
              <Card>
                <CardHeader className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Place your Buy / Sell order here
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="maxPrice">Order type</Label>
                    <Tabs
                    value={orderType}
                    onValueChange={(value) => setOrderType(value as OrderType)}
                    className="w-fit"
                  >
                    <TabsList>
                      <TabsTrigger value="B">Buy order</TabsTrigger>
                      <TabsTrigger value="S">Sell order</TabsTrigger>
                    </TabsList>
                  </Tabs>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxPrice">Max price</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Enter max price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPrice">Min price</Label>
                      <Input
                        id="minPrice"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Enter min price"
                      />
                    </div>

                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Execute status</Label>
                      <Select
                        value={executeStatus}
                        onValueChange={setExecuteStatus}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Single</SelectItem>
                          <SelectItem value="processing">
                            Multiple
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Expire period</Label>
                      <Select
                        value={expireType}
                        onValueChange={(value) =>
                          setExpireType(value as ExpireType)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select expire period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T">Today</SelectItem>
                          <SelectItem value="N">Never expire</SelectItem>
                          <SelectItem value="P">Period</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {expireType === "P" && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>

                        </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromDate">From date</Label>
                        <Input
                          id="fromDate"
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toDate">To date</Label>
                        <Input
                          id="toDate"
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex justify-end gap-3 py-2">
                {eventSuccess && (
                    <AlertSuccessfull
                    title="Order Successful placed"
                    date={new Date}
                  />
                )}
                  <Button
                  size="lg" type="button" variant="secondary" onClick={handleClear}>
                    Clear form
                  </Button>
                  <Button size="lg" type="submit" variant="default">
                    Place order
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

