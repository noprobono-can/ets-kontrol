"use client"

import { useMemo, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BedDouble,
  Building2,
  CalendarRange,
  LayoutDashboard,
  Map,
  Menu,
  RotateCcw,
  Sparkles,
  Ticket,
  Users,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TODAY, formatLong } from "@/lib/dates"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/panel", label: "Günlük durum", icon: LayoutDashboard },
  { href: "/panel/blokaj", label: "Blokaj", icon: BedDouble },
  { href: "/panel/rezervasyonlar", label: "Rezervasyonlar", icon: Ticket },
  { href: "/panel/kat-hizmetleri", label: "Kat hizmetleri", icon: Sparkles },
  { href: "/panel/konaklayanlar", label: "Konaklayanlar", icon: Users },
  { href: "/panel/kontenjan", label: "Kontenjan", icon: CalendarRange },
  { href: "/panel/fiyatlar", label: "Fiyatlar", icon: Wallet },
  { href: "/panel/oteller", label: "Tesisler", icon: Building2 },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active =
          item.href === "/panel"
            ? pathname === "/panel"
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
              active
                ? "bg-white/12 text-white"
                : "text-white/70 hover:bg-white/8 hover:text-white"
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

function RoleSwitch() {
  const { state, view, setRole, setHotel } = useStore()
  return (
    <div className="space-y-2 rounded-xl bg-white/6 p-3 ring-1 ring-white/10">
      <p className="text-[11px] font-medium tracking-wide text-white/50 uppercase">
        Görünüm
      </p>
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-black/20 p-1">
        <button
          type="button"
          onClick={() => setRole("merkez")}
          className={cn(
            "rounded-md px-2 py-1.5 text-xs font-medium",
            view.role === "merkez" ? "bg-white text-slate-900" : "text-white/70"
          )}
        >
          ETS merkez
        </button>
        <button
          type="button"
          onClick={() => setRole("otel")}
          className={cn(
            "rounded-md px-2 py-1.5 text-xs font-medium",
            view.role === "otel" ? "bg-white text-slate-900" : "text-white/70"
          )}
        >
          Otel
        </button>
      </div>
      <label className="block text-[11px] text-white/50">Aktif tesis</label>
      <select
        value={view.hotelId}
        onChange={(event) => setHotel(event.target.value)}
        className="h-8 w-full rounded-md border border-white/15 bg-black/20 px-2 text-xs text-white outline-none"
      >
        {state.hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id} className="text-slate-900">
            {hotel.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { reset } = useStore()
  return (
    <div className="flex h-full flex-col gap-6">
      <Link href="/" onClick={onNavigate} className="px-1">
        <p className="text-[11px] tracking-[0.18em] text-teal-200/80 uppercase">
          Etsgroup
        </p>
        <p className="font-heading text-lg font-semibold text-white">ETS Kontrol</p>
        <p className="text-xs text-white/55">5 yıldız ve altı otel PMS’i</p>
      </Link>
      <RoleSwitch />
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto space-y-3">
        <Link
          href="/yol-haritasi"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-white/70 hover:bg-white/8 hover:text-white"
        >
          <Map className="size-4" />
          Yol haritası
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:bg-white/8 hover:text-white"
          onClick={() => {
            reset()
            toast.success("Demo verisi sıfırlandı")
          }}
        >
          <RotateCcw data-icon="inline-start" />
          Veriyi sıfırla
        </Button>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, view } = useStore()
  const hotel = useMemo(
    () => state.hotels.find((item) => item.id === view.hotelId),
    [state.hotels, view.hotelId]
  )

  return (
    <div className="flex min-h-svh bg-[#f4f1ea]">
      <aside className="hidden w-64 shrink-0 bg-[#0b1f36] p-4 text-white lg:flex lg:flex-col">
        <SidebarBody />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-[#f4f1ea]/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" size="icon" className="lg:hidden" />
                }
              >
                <Menu />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 border-0 bg-[#0b1f36] p-4 text-white"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Menü</SheetTitle>
                </SheetHeader>
                <SidebarBody />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {view.role === "merkez" ? "Merkez operasyon" : hotel?.name}
              </p>
              <p className="text-xs text-slate-500">{formatLong(TODAY)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">
              {state.hotels.length} tesis · {state.reservations.length} rezervasyon
            </span>
            <Separator orientation="vertical" className="hidden h-4 sm:block" />
            <span className="rounded-full bg-teal-700/10 px-2 py-1 font-medium text-teal-800">
              Demo
            </span>
          </div>
        </header>
        <main className="flex-1 px-4 py-5 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
