import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon, AlertTriangleIcon, XCircleIcon } from "lucide-react"

type AlertVariant = "success" | "warning" | "error"

interface AlertMessageProps {
  title: string
  date?: Date
  variant?: AlertVariant
}

export function AlertMessage({
  title,
  date,
  variant = "success",
}: AlertMessageProps) {

  const formattedDate = date
    ? date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null

  const styles = {
    success:
      "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100",
    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
    error:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
  }

  const icons = {
    success: <CheckCircle2Icon />,
    warning: <AlertTriangleIcon />,
    error: <XCircleIcon />,
  }

  return (
    <Alert className={`w-full rounded-lg border p-4 ${styles[variant]}`}>
      {icons[variant]}
      <AlertTitle>{title}</AlertTitle>
      {formattedDate && (
        <AlertDescription>{formattedDate}</AlertDescription>
      )}
    </Alert>
  )

}

