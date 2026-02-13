"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const addTreeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  location: z.string().min(1, "Location is required"),
  file: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "File is required")
    .refine(
      (files) => !files[0] || files[0].size <= 5 * 1024 * 1024,
      "Max file size is 5MB"
    ),
})

type AddTreeFormValues = z.infer<typeof addTreeSchema>

export default function AddTreePage() {
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const form = useForm<AddTreeFormValues>({
    resolver: zodResolver(addTreeSchema),
    defaultValues: {
      name: "",
      species: "",
      location: "",
      file: undefined,
    },
  })

  const onSubmit = (data: AddTreeFormValues) => {
    console.log(data)
    // Handle form submission
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList) => void
  ) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onChange(files)
      setFileName(files[0].name)
      if (files[0].type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(files[0]))
      } else {
        setFilePreview(null)
      }
    }
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
              <div className="px-4 lg:px-6">
                <Card className="max-w-2xl">
                  <CardHeader>
                    <CardTitle>Measure Tree Height</CardTitle>
                    <CardDescription>
                      Enter tree details and upload an image or document.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter tree name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="species"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Species</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter species"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter location"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="file"
                          render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                              <FormLabel>File Upload</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*,.pdf,.doc,.docx"
                                  onChange={(e) => handleFileChange(e, onChange)}
                                  {...field}
                                />
                              </FormControl>
                              {(filePreview || fileName) && (
                                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                                  {filePreview ? (
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">
                                        Preview:
                                      </p>
                                      <img
                                        src={filePreview}
                                        alt="File preview"
                                        className="max-h-48 rounded-md object-contain border"
                                      />
                                    </div>
                                  ) : null}
                                  {fileName && (
                                    <p className="text-sm text-muted-foreground">
                                      Selected file: {fileName}
                                    </p>
                                  )}
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Add Tree</Button>
                      </form>
                    </Form>
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
