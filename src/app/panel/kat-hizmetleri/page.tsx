"use client"

import { useState } from "react"
import { toast } from "sonner"
import { FillBar, KpiCard, PageHeader } from "@/components/page-chrome"
import { HousekeepingBadge } from "@/components/status-badges"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { hkSummary, occupiedRoomIds, roomsOf, roomTypeById } from "@/lib/selectors"
import { useStore } from "@/lib/store"
import type { HousekeepingStatus, Room } from "@/lib/types"
import { cn } from "@/lib/utils"

const FILTERS: Array<{ id: "all" | HousekeepingStatus; label: string }> = [
  { id: "all", label: "Tümü" },
  { id: "Kirli", label: "Kirli" },
  { id: "Kontrol", label: "Kontrol" },
  { id: "Temiz", label: "Temiz" },
  { id: "Arızalı", label: "Arızalı" },
]

const ASSIGNEES = ["Fatma Yıldız", "Emine Korkmaz", "Ayşe Çelik", "Hatice Demir"]

export default function HousekeepingPage() {
  const { state, view, setHotel, updateRoomHk } = useStore()
  const hotelId = view.hotelId
  const rooms = roomsOf(state, hotelId)
  const occupied = occupiedRoomIds(state, hotelId)
  const summary = hkSummary(rooms)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("Kirli")
  const [selected, setSelected] = useState<Room | null>(null)
  const hotel = state.hotels.find((item) => item.id === hotelId)
  const visible = rooms.filter((room) =>
    filter === "all" ? true : room.hkStatus === filter
  )
  const floorMap = new Map<number, Room[]>()
  for (const room of visible) {
    const list = floorMap.get(room.floor) ?? []
    list.push(room)
    floorMap.set(room.floor, list)
  }
  const floors = Array.from(floorMap.entries()).sort((a, b) => a[0] - b[0])

  if (hotel && !hotel.usesEtsPms) {
    return (
      <div>
        <PageHeader
          title="Kat hizmetleri"
          description="Bu tesis kendi PMS’ini kullanıyor. ETS Kontrol kat hizmeti, yazılımı bizden alan 5 yıldız ve altı oteller içindir."
        />
        <p className="rounded-xl bg-white p-8 text-sm text-muted-foreground ring-1 ring-foreground/10">
          {hotel.name} şu an {hotel.pms} ile çalışıyor. Soldan ETS Kontrol kullanan
          bir tesise geçin — örneğin Fethiye Hillside veya Alanya Coral Bay.
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Kat hizmetleri"
        description="Oda temiz / kirli / kontrol / arıza. Check-out odayı kirliye çeker; kirli odaya check-in olmaz."
        actions={
          <select
            className="h-8 rounded-lg border border-input bg-white px-2 text-sm"
            value={hotelId}
            onChange={(event) => setHotel(event.target.value)}
          >
            {state.hotels.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <KpiCard label="Kirli" value={String(summary.dirty)} tone="warn" />
        <KpiCard label="Kontrol" value={String(summary.inspect)} />
        <KpiCard label="Temiz" value={String(summary.clean)} tone="good" />
        <KpiCard label="Arızalı" value={String(summary.ooo)} tone={summary.ooo ? "warn" : "default"} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium ring-1",
              filter === item.id
                ? "bg-slate-900 text-white ring-slate-900"
                : "bg-white text-slate-700 ring-foreground/10"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-4 rounded-xl bg-white p-8 text-sm text-muted-foreground ring-1 ring-foreground/10">
          Bu filtrede oda yok.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {floors.map(([floor, floorRooms]) => (
            <section key={floor}>
              <h2 className="mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Kat {floor}
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {floorRooms.map((room) => {
                  const busy = occupied.has(room.id)
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelected(room)}
                      className={cn(
                        "rounded-xl p-3 text-left ring-1 transition-colors",
                        room.hkStatus === "Kirli" && "bg-amber-50 ring-amber-200",
                        room.hkStatus === "Temiz" && "bg-teal-50 ring-teal-200",
                        room.hkStatus === "Kontrol" && "bg-sky-50 ring-sky-200",
                        room.hkStatus === "Arızalı" && "bg-red-50 ring-red-200"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{room.number}</span>
                        <HousekeepingBadge status={room.hkStatus} />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600">
                        {roomTypeById(state, room.roomTypeId)?.code} ·{" "}
                        {busy ? "Dolu" : "Boş"}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {room.hkAssignee ?? "Atanmamış"}
                      </p>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Demo rack {rooms.length} oda. Tesis toplamı {hotel?.roomCount} oda.
      </p>
      <div className="mt-3 max-w-sm">
        <FillBar
          value={rooms.length ? summary.clean / rooms.length : 0}
        />
        <p className="mt-1 text-xs text-muted-foreground">Temiz oda oranı</p>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>Oda {selected.number}</SheetTitle>
                <SheetDescription>
                  {occupied.has(selected.id) ? "Dolu" : "Boş"} ·{" "}
                  {roomTypeById(state, selected.roomTypeId)?.name}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-3 px-4">
                <div className="flex flex-wrap gap-2">
                  {(["Temiz", "Kirli", "Kontrol", "Arızalı"] as HousekeepingStatus[]).map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selected.hkStatus === status ? "default" : "outline"}
                        onClick={() => {
                          updateRoomHk(selected.id, { hkStatus: status })
                          setSelected({ ...selected, hkStatus: status })
                          toast.success(`Oda ${status.toLowerCase()}`)
                        }}
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>
                <label className="block text-xs text-muted-foreground">Görevli</label>
                <select
                  className="h-8 w-full rounded-lg border border-input px-2 text-sm"
                  value={selected.hkAssignee ?? ""}
                  onChange={(event) => {
                    const hkAssignee = event.target.value || null
                    updateRoomHk(selected.id, { hkAssignee })
                    setSelected({ ...selected, hkAssignee })
                  }}
                >
                  <option value="">Atanmamış</option>
                  {ASSIGNEES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {selected.hkNote ? (
                  <p className="text-sm text-slate-600">{selected.hkNote}</p>
                ) : null}
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Kapat
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
