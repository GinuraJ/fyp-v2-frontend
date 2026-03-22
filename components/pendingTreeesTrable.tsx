"use client"

import { useEffect, useState } from "react"
import { PendingTableDemo, type TreeRow } from "@/components/TreeTable"
import { API_BASE_URL } from "@/lib/config"

export function TablePendingTrees() {

  const [data, setData] = useState<TreeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    const fetchPendingTrees = async () => {
      setLoading(true)
      setError(null)

      try {

        const url = `${API_BASE_URL}/trees/find/P`

        const res = await fetch(url)

        if (!res.ok) {
          throw new Error("No pending trees found")
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

    fetchPendingTrees()

  }, [])

  return (
    <div className="flex flex-col gap-4">

      {loading && (
        <div className="text-sm text-muted-foreground">
          Loading pending trees...
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive">
          Error: {error}
        </div>
      )}

      {!loading && !error && <PendingTableDemo data={data} />}

    </div>
  )
}