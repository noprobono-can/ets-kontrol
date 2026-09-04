"use client"

import { PmsProvider, usePms } from "@/lib/store"
import { AppShell } from "@/components/app-shell"

function Gate({ children }: { children: React.ReactNode }) {
  const { ready } = usePms()
  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f6f3ee] px-6">
        <div className="w-full max-w-sm rounded-xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium">ETS Kontrol yükleniyor</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo otel verisi tarayıcıda açılıyor.
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-orange-500" />
          </div>
        </div>
      </div>
    )
  }
  return <AppShell>{children}</AppShell>
}

export default function PmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PmsProvider>
      <Gate>{children}</Gate>
    </PmsProvider>
  )
}
