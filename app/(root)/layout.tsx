import { AuthGuard } from "@/components/auth-guard"

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
