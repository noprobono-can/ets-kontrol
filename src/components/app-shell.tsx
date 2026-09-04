"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BedDouble,
  Building2,
  CalendarDays,
  LayoutDashboard,
  Menu,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { usePms } from "@/lib/store"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/pms", label: "Günlük pano", icon: LayoutDashboard },
  { href: "/pms/odalar", label: "Odalar", icon: BedDouble },
  { href: "/pms/rezervasyonlar", label: "Rezervasyonlar", icon: CalendarDays },
  { href: "/pms/misafirler", label: "Misafirler", icon: Users },
  { href: "/pms/oteller", label: "ETS otelleri", icon: Building2 },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/pms"
            ? pathname === "/pms"
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-white/15 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { view, state, hotel, setRole, setHotelId, resetDemo } = usePms()

  return (
    <div className="flex min-h-dvh bg-[#f6f3ee]">
      <aside className="hidden w-60 shrink-0 flex-col bg-[#1b2a4a] p-4 text-white lg:flex">
        <Link href="/" className="mb-6 block">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-orange-300 uppercase">
            ETSTUR
          </p>
          <p className="font-[family-name:var(--font-heading)] text-xl leading-tight">
            ETS Kontrol
          </p>
          <p className="mt-1 text-xs text-white/55">Otel PMS · yalnızca ETS otelleri</p>
        </Link>
        <NavLinks />
        <div className="mt-auto space-y-2 pt-6">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
            onClick={resetDemo}
          >
            Demo verisini sıfırla
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-[#1b2a4a] px-3 py-2 text-white lg:bg-[#f6f3ee] lg:px-6 lg:py-3 lg:text-slate-900">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-white/10"
                />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Menü</span>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 border-none bg-[#1b2a4a] p-4 text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-white">ETS Kontrol</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold">
              {hotel?.name ?? "Otel seçin"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatLongHeader()} · {view.role === "merkez" ? "ETS Merkez" : "Otel resepsiyon"}
            </p>
          </div>

          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 lg:flex-none">
            <div className="flex rounded-lg bg-white/10 p-0.5 lg:bg-slate-200/70">
              <Button
                size="xs"
                variant={view.role === "otel" ? "default" : "ghost"}
                className={cn(
                  "h-7 px-2.5",
                  view.role !== "otel" &&
                    "text-white lg:text-slate-700 hover:bg-white/10 lg:hover:bg-white/60"
                )}
                onClick={() => setRole("otel")}
              >
                Otel
              </Button>
              <Button
                size="xs"
                variant={view.role === "merkez" ? "default" : "ghost"}
                className={cn(
                  "h-7 px-2.5",
                  view.role !== "merkez" &&
                    "text-white lg:text-slate-700 hover:bg-white/10 lg:hover:bg-white/60"
                )}
                onClick={() => setRole("merkez")}
              >
                ETS Merkez
              </Button>
            </div>
            <Select
              value={view.hotelId}
              onValueChange={(value) => {
                if (value) setHotelId(value)
              }}
            >
              <SelectTrigger
                size="sm"
                className="max-w-[11rem] border-white/20 bg-white/10 text-white sm:max-w-[16rem] lg:border-border lg:bg-white lg:text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {state.hotels.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                    {h.newReservationsClosed ? " · durduruldu" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {hotel?.newReservationsClosed ? (
          <div className="border-b border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-950 lg:px-6">
            <Badge className="mr-2 bg-orange-600 text-white">ETS Merkez</Badge>
            {hotel.name} için yeni rezervasyon durduruldu. Beklenen girişler ve
            çıkışlar işlenmeye devam eder.
          </div>
        ) : null}

        <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  )
}

function formatLongHeader() {
  return new Date(2026, 8, 4).toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}
