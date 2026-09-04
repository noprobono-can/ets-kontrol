import type { ReactNode } from "react"
import { StoreProvider } from "@/lib/store"
import { AppShell } from "@/components/app-shell"

export default function PanelLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  )
}
