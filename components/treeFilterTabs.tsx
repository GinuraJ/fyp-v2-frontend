"use client"

import { useEffect, useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableDemo, type TreeRow } from "@/components/TreeTable"
import { AlertMessage } from "@/components/alertPost"

import { API_BASE_URL } from "@/lib/config";

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
        // let url = `https://greenmin-apis.onrender.com/api/trees`
        let url = `${API_BASE_URL}/trees/find/userwise/ADMIN`
        console.log(url)

        if (statusFilter === "P") {
          // url = "https://greenmin-apis.onrender.com/api/trees/find/P"
          url = `${API_BASE_URL}/trees/find/userWise/ADMIN/P`
        } else if (statusFilter === "A") {
          // url = "https://greenmin-apis.onrender.com/api/trees/find/A"
          url = `${API_BASE_URL}/trees/find/userWise/ADMIN/A`

        } else if (statusFilter === "E") {
          // url = "https://greenmin-apis.onrender.com/api/trees/find/E"
          url = `${API_BASE_URL}/trees/find/userWise/ADMIN/E`
        }

        const res = await fetch(url)

        // Many tree endpoints return 404 when the list is empty — treat as no data, not an error
        if (res.status === 404) {
          setData([])
          return
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(
            typeof body?.message === "string"
              ? body.message
              : "Failed to fetch trees"
          )
        }

        const json = await res.json()
        const list = Array.isArray(json) ? json : []

        const mapped: TreeRow[] = list.map((tree: any) => ({
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
      {!loading && error && (
        <AlertMessage title={error} variant="error" />
      )}

      {!loading && !error && data.length === 0 && (
        <AlertMessage title="No trees found" variant="warning" />
      )}

      {!loading && !error && data.length > 0 && <TableDemo data={data} />}
    </div>
  )
}


