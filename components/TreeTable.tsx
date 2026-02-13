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


type TreeStatus = "P" | "A" | "E"

export type TreeRow = {
  _id: string
  treeId: number
  species: string
  image: string
  name: string
  status: TreeStatus
  age: number | string
  diameter: number | string
  height: number | string
  geoLocation: string
  enterUser: string
  enterDate: string
}

type TreeTableProps = {
  data: TreeRow[]
  onView?: (row: TreeRow) => void
}

function getStatusLabel(status: TreeStatus) {
  switch (status) {
    case "P":
      // Pending - yellow
      return {
        label: "Pending",
        className:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      }
    case "A":
      // Approved - blue
      return {
        label: "Approved",
        className:
          "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      }
    case "E":
      // Proceed / Processed - green
      return {
        label: "Proceed",
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

export function TableDemo({ data, onView }: TreeTableProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tree Repository</CardTitle>
        <CardDescription>
          A list of your recently added trees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your trees.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Diameter</TableHead>
              <TableHead>Height</TableHead>
              <TableHead>GeoLocation</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              const { label, className } = getStatusLabel(row.status)
              return (
                <TableRow key={row.name + index}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Badge className={className}>{label}</Badge>
                  </TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.diameter}</TableCell>
                  <TableCell>{row.height}</TableCell>
                  <TableCell>{row.geoLocation}</TableCell>
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
