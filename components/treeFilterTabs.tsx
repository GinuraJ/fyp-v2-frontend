"use client"

import { useEffect, useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableDemo, type TreeRow } from "@/components/TreeTable"

type StatusFilter = "all" | "P" | "A" | "E"

export function TabsDemo() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [data, setData] = useState<TreeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrees = async () => {
      setLoading(true)
      setError(null)

      try {
        let url = "https://greenmin-apis.onrender.com/api/trees"

        if (statusFilter === "P") {
          url = "https://greenmin-apis.onrender.com/api/trees/find/P"
        } else if (statusFilter === "A") {
          url = "https://greenmin-apis.onrender.com/api/trees/find/A"
        } else if (statusFilter === "E") {
          url = "https://greenmin-apis.onrender.com/api/trees/find/E"
        }

        const res = await fetch(url)
        if (!res.ok) {
          throw new Error("Failed to fetch trees")
        }

        const json = await res.json()

        const mapped: TreeRow[] = (json as any[]).map((tree) => ({
          _id: tree._id,
          treeId: tree.treeId,
          species: tree.species,
          image: tree.image,
          name: tree.name,
          status: tree.status,
          age: tree.age,
          diameter: tree.diameter,
          height: tree.height,
          geoLocation: tree.geoLocation,
          enterUser: tree.enterUser,
          enterDate: tree.enterDate,
        }))

        setData(mapped)
      } catch (err: any) {
        setError(err.message ?? "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchTrees()
  }, [statusFilter])

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={statusFilter === "all" ? "all" : statusFilter}
        onValueChange={(value) => {
          if (value === "all") {
            setStatusFilter("all")
          } else if (value === "P" || value === "A" || value === "E") {
            setStatusFilter(value)
          }
        }}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="P">Pending</TabsTrigger>
          <TabsTrigger value="A">Approved</TabsTrigger>
          <TabsTrigger value="E">Processed</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading trees...</div>
      )}
      {error && (
        <div className="text-sm text-destructive">Error: {error}</div>
      )}

      {!loading && !error && <TableDemo data={data} />}
    </div>
  )
}
