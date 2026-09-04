"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-chrome"
import { ReservationDialog } from "@/components/reservation-dialog"
import { ReservationBadge } from "@/components/status-badges"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { addDays, TODAY, dateRange, formatDay, formatWeekday, staysOn } from "@/lib/dates"
import { activeReservations, roomsOf, roomTypeById } from "@/lib/selectors"
import { useStore } from "@/lib/store"
import type { Reservation } from "@/lib/types"
import { cn } from "@/lib/utils"

const DAYS = 10

export default function RackPage() {
  const { state, view, setHotel, assignRoom, setReservationStatus, checkIn, checkOut } = useStore()
  const hotelId = view.hotelId
  const [start] = useState(addDays(TODAY, -1))
  const days = dateRange(start, DAYS)
  const rooms = roomsOf(state, hotelId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [preset, setPreset] = useState<{ date?: string; roomTypeId?: string; roomId?: string }>()
  const [selected, setSelected] = useState<Reservation | null>(null)

  const hotel = state.hotels.find((item) => item.id === hotelId)
  const grouped = useMemo(() => {
    const map = new Map<string, typeof rooms>()
    for (const room of rooms) {
      const list = map.get(room.roomTypeId) ?? []
      list.push(room)
      map.set(room.roomTypeId, list)
    }
    return Array.from(map.entries())
  }, [rooms])

  function reservationOn(roomId: string, day: string) {
    return activeReservations(state.reservations).find(
      (item) => item.roomId === roomId && staysOn(item.checkIn, item.checkOut, day)
    )
  }

  function unassigned() {
    return activeReservations(state.reservations).filter(
      (item) => item.hotelId === hotelId && !item.roomId
    )
  }

  return (
    <div>
      <PageHeader
        title="Blokaj / oda rack"
        description="Ön büro rack: oda atama, check-in / check-out. Kirli veya arızalı odaya giriş yapılmaz; çıkış odayı kat hizmetine düşürür."
        actions={
          <div className="flex flex-wrap gap-2">
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
            <Button
              onClick={() => {
                setPreset({ date: TODAY })
                setDialogOpen(true)
              }}
            >
              Yeni rezervasyon
            </Button>
          </div>
        }
      />

      {unassigned().length > 0 ? (
        <div className="mb-4 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
          <p className="mb-2 text-xs font-medium text-amber-900">
            Oda atanmamış rezervasyonlar — tıklayıp bir odaya yerleştirin
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned().map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="rounded-md bg-white px-2 py-1 text-xs ring-1 ring-amber-300 hover:bg-amber-100"
              >
                {item.guest} · {roomTypeById(state, item.roomTypeId)?.code} ·{" "}
                {formatDay(item.checkIn)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="overflow-auto rounded-xl bg-white ring-1 ring-foreground/10">
        <table className="min-w-max border-collapse text-xs">
          <thead>
            <tr className="bg-[#0b1f36] text-white">
              <th className="sticky left-0 z-10 bg-[#0b1f36] px-3 py-2 text-left font-medium">
                {hotel?.name}
              </th>
              {days.map((day) => (
                <th key={day} className="min-w-24 px-2 py-2 text-center font-medium">
                  <div className="capitalize">{formatWeekday(day)}</div>
                  <div className={cn(day === TODAY && "text-teal-200")}>
                    {formatDay(day)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grouped.flatMap(([typeId, typeRooms]) => {
              const type = roomTypeById(state, typeId)
              return typeRooms.map((room, index) => (
                <tr key={room.id} className="border-t border-slate-100">
                  {index === 0 ? (
                    <td
                      className="sticky left-0 z-10 border-r bg-slate-50 px-3 py-1 font-medium align-top"
                      rowSpan={typeRooms.length}
                    >
                      <div>{type?.code}</div>
                      <div className="text-[10px] font-normal text-muted-foreground">
                        {type?.name}
                      </div>
                    </td>
                  ) : null}
                  {days.map((day) => {
                    const reservation = reservationOn(room.id, day)
                    const isStart = reservation?.checkIn === day
                    return (
                      <td key={day} className="border-l border-slate-100 p-0.5">
                        {reservation ? (
                          isStart ? (
                            <button
                              type="button"
                              onClick={() => setSelected(reservation)}
                              className="flex h-10 w-full flex-col justify-center rounded-md bg-teal-800 px-1.5 text-left text-[10px] leading-tight text-white hover:bg-teal-700"
                            >
                              <span className="truncate font-medium">
                                {room.number} · {reservation.guest}
                              </span>
                              <span className="truncate text-white/70">
                                {reservation.voucher}
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelected(reservation)}
                              className="h-10 w-full rounded-md bg-teal-800/20 text-[10px] text-teal-900"
                            >
                              {room.number}
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            className="flex h-10 w-full items-center justify-center rounded-md text-[10px] text-slate-400 hover:bg-teal-50 hover:text-teal-800"
                            onClick={() => {
                              setPreset({
                                date: day,
                                roomTypeId: room.roomTypeId,
                                roomId: room.id,
                              })
                              setDialogOpen(true)
                            }}
                          >
                            {room.number}
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Boş hücredeki oda numarasına tıklayarak o odaya rezervasyon açın. Demo
        rack {rooms.length} oda gösterir; tesisin toplamı {hotel?.roomCount} oda.
      </p>

      <ReservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        hotelId={hotelId}
        preset={preset}
      />

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.guest}</SheetTitle>
                <SheetDescription>
                  {selected.voucher} · {formatDay(selected.checkIn)} –{" "}
                  {formatDay(selected.checkOut)}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-3 px-4 text-sm">
                <ReservationBadge status={selected.status} />
                <p>Kanal: {selected.channel}</p>
                <p>Pansiyon: {selected.board} · {selected.pax} kişi</p>
                <div className="grid gap-1.5">
                  <label className="text-xs text-muted-foreground">Oda ata</label>
                  <select
                    className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                    value={selected.roomId ?? ""}
                    onChange={(event) => {
                      const roomId = event.target.value || null
                      assignRoom(selected.id, roomId)
                      setSelected({ ...selected, roomId })
                      toast.success("Oda atandı")
                    }}
                  >
                    <option value="">Atanmamış</option>
                    {rooms
                      .filter((room) => room.roomTypeId === selected.roomTypeId)
                      .map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.number}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <SheetFooter>
                {selected.status === "Konfirmeli" || selected.status === "Opsiyon" ? (
                  <Button
                    onClick={() => {
                      const result = checkIn(selected.id)
                      if (!result.ok) toast.error(result.reason)
                      else {
                        toast.success("Check-in yapıldı")
                        setSelected(null)
                      }
                    }}
                  >
                    Check-in
                  </Button>
                ) : null}
                {selected.status === "Check-in" ? (
                  <Button
                    onClick={() => {
                      const result = checkOut(selected.id)
                      if (!result.ok) toast.error(result.reason)
                      else {
                        toast.success("Check-out · oda kirliye alındı")
                        setSelected(null)
                      }
                    }}
                  >
                    Check-out
                  </Button>
                ) : null}
                <Button
                  variant="destructive"
                  onClick={() => {
                    setReservationStatus(selected.id, "İptal")
                    toast.message("Rezervasyon iptal edildi")
                    setSelected(null)
                  }}
                >
                  İptal et
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
