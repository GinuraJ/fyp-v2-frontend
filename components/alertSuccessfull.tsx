import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"

interface AlertSuccessfullProps {
  title: string
  date: Date
}

export function AlertSuccessfull({
  title,
  date,
}: AlertSuccessfullProps) {
    const formattedDate = date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    
  return (
    <Alert className="max-w-md border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-amber-50">
      <CheckCircle2Icon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{formattedDate}</AlertDescription>
    </Alert>
  )
}
