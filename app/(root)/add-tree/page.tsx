"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { IconUpload } from "@tabler/icons-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const addTreeSchema = z.object({
  file: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "File is required")
    .refine(
      (files) => !files[0] || files[0].size <= 5 * 1024 * 1024,
      "Max file size is 5MB"
    ),
})

type AddTreeFormValues = z.infer<typeof addTreeSchema>

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function AddTreePage() {
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputId = "file-upload-add-tree"

  const form = useForm<AddTreeFormValues>({
    resolver: zodResolver(addTreeSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const onSubmit = (data: AddTreeFormValues) => {
    console.log(data)
  }

  const processFiles = (files: FileList | null, onChange: (value: FileList) => void) => {
    if (files && files.length > 0) {
      onChange(files)
      setFileName(files[0].name)
      setFileSize(files[0].size)
      if (files[0].type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(files[0]))
      } else {
        setFilePreview(null)
      }
    }
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList) => void
  ) => {
    processFiles(e.target.files, onChange)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (
    e: React.DragEvent,
    onChange: (value: FileList) => void
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    processFiles(e.dataTransfer.files, onChange)
  }

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-[2fr_3fr] lg:px-6">
                <Card className="min-h-[200px] md:col-start-1">
                  <CardHeader>
                    <CardTitle>Measure Tree Height</CardTitle>
                    <CardDescription>
                      Upload a photo of a tree to measure its height
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="file"
                          render={({
                            field: { onChange, value, ...field },
                          }) => (
                            <FormItem>
                              <FormControl>
                                <label
                                  htmlFor={fileInputId}
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, onChange)}
                                  className={cn(
                                    "flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors",
                                    isDragging
                                      ? "border-primary bg-primary/5"
                                      : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
                                  )}
                                >
                                  <Input
                                    id={fileInputId}
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleFileChange(e, onChange)
                                    }
                                    {...field}
                                  />
                                  <IconUpload className="size-8 text-muted-foreground" />
                                  <p className="text-center text-sm text-muted-foreground">
                                    {isDragging
                                      ? "Drop file here"
                                      : "Drag and drop or click to upload"}
                                  </p>
                                </label>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {(filePreview || fileName) && (
                          <div className="flex gap-4 rounded-lg border bg-muted/50 p-4">
                            {filePreview && (
                              <img
                                src={filePreview}
                                alt="File preview"
                                className="h-24 w-24 shrink-0 rounded-md border object-cover"
                              />
                            )}
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                              {fileName && (
                                <p className="truncate text-sm font-medium">
                                  {fileName}
                                </p>
                              )}
                              {fileSize !== null && (
                                <p className="text-xs text-muted-foreground">
                                  Size: {formatFileSize(fileSize)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        <Button type="submit">Measure</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                <Card className="min-h-[200px] md:col-start-2">
                  <CardHeader>
                    <CardTitle>Tree Details</CardTitle>
                    <CardDescription>
                      Sample form for tree information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="tree-name"
                        >
                          Name
                        </label>
                        <Input
                          id="tree-name"
                          placeholder="Enter tree name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Tree species
                        </label>
                        <Select defaultValue="oak">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select species" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oak">Oak</SelectItem>
                            <SelectItem value="pine">Pine</SelectItem>
                            <SelectItem value="maple">Maple</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="tree-diameter"
                        >
                          Diameter (cm)
                        </label>
                        <Input
                          id="tree-diameter"
                          type="number"
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="tree-height"
                        >
                          Height (m)
                        </label>
                        <Input
                          id="tree-height"
                          type="number"
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="tree-age"
                        >
                          Age (years)
                        </label>
                        <Input
                          id="tree-age"
                          type="number"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="tree-location"
                        >
                          Geo location
                        </label>
                        <Input
                          id="tree-location"
                          placeholder="Latitude, Longitude"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="md:col-start-2">
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                    Please complete required fields: Photo, Name and Species and click Save button.
                    </p>
                    <div className="flex gap-2">
                      <Button size="lg">Save</Button>
                      <Button size="lg" variant="secondary">Clear</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
