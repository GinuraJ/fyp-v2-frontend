import { cn } from "@/lib/utils"

export function Empty({ children, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6", className)}>
      {children}
    </div>
  )
}

export function EmptyHeader({ children }) {
  return <div className="space-y-2 text-center">{children}</div>
}

export function EmptyMedia({ children }) {
  return <div className="flex justify-center">{children}</div>
}

export function EmptyTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

export function EmptyDescription({ children }) {
  return (
    <p className="text-sm text-muted-foreground max-w-sm">{children}</p>
  )
}

export function EmptyContent({ children }) {
  return <div className="mt-4">{children}</div>
}