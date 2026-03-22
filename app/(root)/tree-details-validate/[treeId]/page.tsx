"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type React from "react"
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
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertMessageDetection } from "@/components/alertDetection"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle2Icon,
  AlertTriangleIcon,
  XCircleIcon,
  RulerDimensionLine,
} from "lucide-react"
import { API_BASE_URL } from "@/lib/config";
import { calculateCarbonCredits } from "@/lib/carbon"

export default function TreeDetailsValidate() {

  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusAlert, setStatusAlert] = useState<{
    variant: "success" | "error"
    title: string
    description?: string
  } | null>(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    const storedRole = localStorage.getItem("role")
    setEmail(storedEmail)
    setRole(storedRole)
    setMounted(true)
  }, [])


  const params = useParams()
  const treeId = params?.treeId

  const [tree, setTree] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [diameter, setDiameter] = useState("")

  const carbon = tree
    ? calculateCarbonCredits({
        woodDensity: Number(tree.woodDensity),
        diameterCm: Number(tree.diameter),
        heightM: Number(tree.height),
        ageYears: Number(tree.age),
      })
    : null

  useEffect(() => {

    if (!treeId) return

    const fetchTree = async () => {
      try {

        const res = await fetch(
          `${API_BASE_URL}/trees/find/id/${treeId}`
        )
        const data = await res.json()
        setTree(data)

      } catch (error) {
        console.error("Tree fetch error", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTree()

  }, [treeId])

  const updateTreeStatus = async (newStatus: "A" | "R") => {
    const id = Array.isArray(treeId) ? treeId[0] : treeId
    if (!id) return

    try {
      setIsUpdatingStatus(true)
      setStatusAlert(null)

      const res = await fetch(`${API_BASE_URL}/trees/update/${id}/${newStatus}`, {
        method: "POST",
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || "Failed to update tree status")
      }

      setTree((prev: any) => (prev ? { ...prev, status: newStatus } : prev))
      setStatusAlert({
        variant: "success",
        title: newStatus === "A" ? "Successfully approved" : "Successfully rejected",
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update tree status"
      setStatusAlert({
        variant: "error",
        title: "Action failed",
        description: message,
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (loading) return <p>Loading...</p>

  if (!mounted || !role) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset"/>

      <SidebarInset>
        <SiteHeader />

        <div className="p-6">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            <div className="md:col-span-1 md:row-span-2">
              <Card className="shadow-md rounded-2xl h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Tree Image</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="w-full h-full min-h-[300px] bg-muted rounded-xl flex items-center justify-center">
                  {tree?.image ? (
                    <img
                      src={tree.image}
                      alt={tree.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      No Image Available
                    </span>
)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Basic Tree Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <CardContent className="text-sm">
                    <div className="space-y-4">

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Tree Name</p>
                          <p className="font-semibold">{tree.name}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Species</p>
                          <p className="font-semibold">{tree.species}</p>
                        </div>
                      </div>

                      <Separator className="bg-muted-foreground/20" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Age</p>
                          <p className="font-semibold">{tree.age} Years</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Height</p>
                          <p className="font-semibold text-green-600">{tree.height} cm</p>
                        </div>
                      </div>

                      <Separator className="bg-muted-foreground/20" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Trunk Diameter</p>
                          <p className="font-semibold">{tree.diameter} cm</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Enter Date</p>
                          <p className="font-medium">{tree.enterDate}</p>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Carbon Credit Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground">
                          Above-ground biomass (AGB)
                        </p>
                        <p className="font-semibold text-green-600">
                          {(carbon?.agbKg ?? 0).toFixed(2)} kg
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          Estimated CO₂ Absorption
                        </p>
                        <p className="font-semibold text-green-600">
                          {(carbon?.yearlyCo2Kg ?? 0).toFixed(2)} kg / year
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-muted-foreground/20" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground">
                          Total Lifetime CO₂
                        </p>
                        <p className="font-semibold text-green-600">
                          {((carbon?.totalCo2Kg ?? 0) / 1000).toFixed(3)} tons
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          Generated credits
                        </p>
                        <p className="font-semibold text-green-600">
                          {(carbon?.creditsPerYear ?? 0).toFixed(4)} / year
                        </p>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-start-2 md:col-span-2">
              <Card className="shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Validation Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusAlert && (
                    <div className="mb-4">
                      <Alert
                        variant={statusAlert.variant === "error" ? "destructive" : "default"}
                        className={
                          statusAlert.variant === "success"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : undefined
                        }
                      >
                        {statusAlert.variant === "success" ? (
                          <CheckCircle2Icon />
                        ) : (
                          <XCircleIcon />
                        )}
                        <AlertTitle>{statusAlert.title}</AlertTitle>
                        {statusAlert.description && (
                          <AlertDescription>{statusAlert.description}</AlertDescription>
                        )}
                      </Alert>
                    </div>
                  )}
                  {statusAlert?.variant !== "success" && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                      <Button
                        className="sm:w-auto w-full"
                        onClick={() => updateTreeStatus("A")}
                        disabled={isUpdatingStatus}
                      >
                        {isUpdatingStatus ? "Updating..." : "Approve"}
                      </Button>
                      <Button
                        variant="destructive"
                        className="sm:w-auto w-full"
                        onClick={() => updateTreeStatus("R")}
                        disabled={isUpdatingStatus}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}