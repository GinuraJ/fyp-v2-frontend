import { Alert, AlertTitle } from "@/components/ui/alert"
import {
    CheckCircle2Icon,
    AlertTriangleIcon,
    XCircleIcon,
    RulerDimensionLine,
  } from "lucide-react"

type AlertVariant = "success" | "warning" | "error"

interface AlertDetectionProps {
  heading: string
  description1?: string
  description2?: string
  description3?: string
  description4?: string
  description5?: string
  description6?: string
  variant?: AlertVariant
}

export function AlertMessageDetection({
  heading,
  description1,
  description2,
  description3,
  description4,
  description5,
  description6,

  variant = "success",
}: AlertDetectionProps) {

  const styles = {
    success:
      "border-green-200 bg-green-50 text-green-900",
    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-900",
    error:
      "border-red-200 bg-red-50 text-red-900",
  }

  const icons = {
    success: <CheckCircle2Icon size={18} />,
    warning: <AlertTriangleIcon size={18} />,
    error: <XCircleIcon size={18} />,
  }

  return (
    <Alert className={`w-full flex flex-col gap-2 p-4 ${styles[variant]}`}>
      
        <div className="flex items-center gap-2 font-semibold">
            {icons[variant]}
            <AlertTitle>{heading}</AlertTitle>
        </div>

        <div className="text-sm space-y-1 whitespace-pre-wrap break-words">
            {description1 && <p>{description1}</p>}
            {description2 && <p>{description2}</p>}
            {description3 && <p>{description3}</p>}
            {description4 && <p>{description4}</p>}
            {description5 && <p>{description5}</p>}
            {description6 && <p>{description6}</p>}
        </div>
    </Alert>
  )
}