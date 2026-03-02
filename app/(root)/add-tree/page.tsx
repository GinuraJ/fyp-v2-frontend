"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { IconUpload } from "@tabler/icons-react"
import {
  CheckCircle2Icon,
  AlertTriangleIcon,
  XCircleIcon,
  RulerDimensionLine,
} from "lucide-react"
import { AlertMessage } from "@/components/alertPost"
import { AlertMessageDetection } from "@/components/alertDetection"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const addTreeSchema = z.object({
  file: z
    .custom<FileList>()
    .refine(
      (files) => files instanceof FileList && files.length > 0,
      "Please upload an image first"
    )
    .refine(
      (files) =>
        files instanceof FileList &&
        files[0] &&
        files[0].size <= 10 * 1024 * 1024,
      "Max file size is 10MB"
    ),
})

type AddTreeFormValues = z.infer<typeof addTreeSchema>

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function AddTreePage() {
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputId = "file-upload-add-tree"

  const [isDetecting, setIsDetecting] = useState(false)

  const [isMeasured, setIsMeasured] = useState(false)

  const [detectionResultVarient, setDetectionResultVarient] = useState<AlertVariant>("success");
  const [treeCountDescription, setTreeCountDescription] = useState("");
  const [humanCountDescription, setHumanCountDescription] = useState("");
  const [nearestTreeHeightDescription, setNearestTreeHeightDescription] = useState("");
  const [humanHeightDescription, setHumanHeightDescription] = useState("");



  type AlertVariant = "success" | "warning" | "error"

  const [alert, setAlert] = useState<{
    show: boolean
    title: string
    variant: AlertVariant
  } | null>(null)

  const form = useForm<AddTreeFormValues>({
    resolver: zodResolver(addTreeSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const onSubmit = async (data: AddTreeFormValues) => {
    setIsDetecting(true);
    setIsMeasured(false);
    setAlert(null); 

    try {
      const imageFile = data.file?.[0];
  
      const formData = new FormData();
      formData.append("file", imageFile);
  
      const response = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setAlert({
          show: true,
          title: "Detection failed",
          variant: "error",
        });
        return;
      }else{

        if(result.treeCount >= 1 && result.humanCount >=1){
          setDetectionResultVarient("success");
        }else{
          setDetectionResultVarient("warning");
        }

        if (result.treeCount == 0) {
          setTreeCountDescription("No tree detected from the image");
        } else if (result.treeCount == 1) {
          setTreeCountDescription("Tree identified successfully.");
        } else {
          setTreeCountDescription(`${result.treeCount} trees identified from image`);
        }

        if (result.humanCount == 0) {
          setHumanCountDescription("No reference object detected from the image");
        } else if (result.humanCount == 1) {
          setHumanCountDescription("Human reference objects identified successfully.");
        } else {
          setHumanCountDescription(`${result.humanCount} reference object identified from image`);
        }

        if(result.nearestTreeHeight != null){
          setNearestTreeHeightDescription(`Nearest tree height in pixel is ${Number(result.nearestTreeHeight.toFixed(2))}`);
        }else if(result.nearestTreeHeight == null){
          setNearestTreeHeightDescription("Tree height in pixel cannot find due to no tree found");
        }else{
          setNearestTreeHeightDescription("Test");
        }

        if(result.tallestHumanHeight != null){
          setHumanHeightDescription(`Human reference object height in pixel is ${Number(result.tallestHumanHeight.toFixed(2))}`);
        }else if(result.tallestHumanHeight == null){
          setHumanHeightDescription("Reference object height in pixel cannot find due to no object found");
        }else{
          setHumanHeightDescription("Test");
        }

        setDetectionResult(result);
        setIsMeasured(true);

      }
  
    } catch (error) {
      setAlert({
        show: true,
        title: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSaveTree = () => {
    setAlert({
      show: true,
      title: "Tree saved successfully",
      variant: "success",
    })
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
                <Card className="min-h-[475px] md:col-start-1">
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
                        {/* <Button type="submit">Measure</Button> */}
                        <Button type="submit" disabled={isDetecting}>
                          {isDetecting ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>
                                    Measuring...
                                </>
                            ) : (
                                <>
                                    <RulerDimensionLine className="w-5 h-5 mr-3" />
                                    <span>Measure</span>
                                </>
                            )}
                        </Button>

                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <div className="flex flex-col h-[475px] gap-4 md:col-start-2">

                  {/* Tree Details Section */}
                  <Card className="flex-1">
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

                  {/* Button Section */}
                  <Card>
                    <CardContent className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        Please complete required fields: Photo, Name and Species and click Save button.
                      </p>

                      <div className="flex gap-2">
                        <Button size="lg" onClick={handleSaveTree}>
                          Save Tree
                        </Button>

                        <Button size="lg" variant="secondary">
                          Clear form
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                <Card className="md:col-start-1">
                  <CardContent className="flex flex-col gap-4">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="shipping"
                    className="max-w-lg"
                  >
                    <AccordionItem value="shipping">
                      <AccordionTrigger>What are your shipping options?</AccordionTrigger>
                      <AccordionContent>
                        We offer standard (5-7 days), express (2-3 days), and overnight
                        shipping. Free shipping on international orders.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="returns">
                      <AccordionTrigger>What is your return policy?</AccordionTrigger>
                      <AccordionContent>
                        Returns accepted within 30 days. Items must be unused and in original
                        packaging. Refunds processed within 5-7 business days.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="support">
                      <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
                      <AccordionContent>
                        Reach us via email, live chat, or phone. We respond within 24 hours
                        during business days.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  </CardContent>
                </Card>

                {alert?.show && (
                  <Card className="md:col-start-2 place-self-start w-full max-w-none">
                    <CardContent className="flex flex-col gap-4 w-full">
                      <AlertMessage
                        title={alert.title}
                        date={new Date()}
                        variant={alert.variant}
                      />
                    </CardContent>
                  </Card>
                )}
                {isMeasured && (
                  <Card className="md:col-start-2 place-self-start w-full max-w-none">
                    <CardContent className="flex flex-col gap-4 w-full">

                      <AlertMessageDetection
                        heading="Detection Result"
                        variant={detectionResultVarient}
                        description1={treeCountDescription}
                        description2={humanCountDescription}
                        description3={nearestTreeHeightDescription}
                        description4={humanHeightDescription}
                        description5={`Nearest Tree Bottom Bounding Box Line Y-axis number: ${detectionResult.nearestTreeBottomBoundingBoxLineYaxixNumber ?? "N/A"}`}
                        description6={`Tallest Human Bottom Bounding Box Line Y-axis number: ${detectionResult.tallestHumanBottomBoundingBoxLineYaxixNumber ?? "N/A"}`}
                      />

                    </CardContent>
                  </Card>
                )}

              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
