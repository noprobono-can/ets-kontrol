"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { RoomBadge } from "@/components/status-badges"
import { roomTypeLabel } from "@/lib/labels"
import { roomsForHotel, usePms } from "@/lib/store"
import type { Room } from "@/lib/types"

export default function RoomsPage() {
  const { hotel, state, markRoomClean, checkIn, checkOut } = usePms()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const rooms = hotel ? roomsForHotel(state.rooms, hotel.id) : []
  const floors = useMemo(() => {
    const map = new Map<number, Room[]>()
    for (const room of rooms) {
      const list = map.get(room.floor) ?? []
      list.push(room)
      map.set(room.floor, list)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [rooms])

  const selected = rooms.find((r) => r.id === selectedId)
  const occupant = selected
    ? state.reservations.find(
        (r) => r.roomId === selected.id && r.status === "iceri"
      )
    : undefined
  const arriving = selected
    ? state.reservations.find(
        (r) => r.roomId === selected.id && r.status === "bekliyor"
      )
    : undefined

  if (!hotel) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <p className="font-medium text-rose-950">Otel bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl">
          Oda rafı
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {hotel.name} · odaya dokunarak giriş, çıkış veya temizlik
        </p>
      </div>

      {floors.length === 0 ? (
        <Card>
          <CardContent>
            <p className="py-8 text-sm text-muted-foreground">
              Bu tesiste tanımlı oda yok.
            </p>
          </CardContent>
        </Card>
      ) : (
        floors.map(([floor, floorRooms]) => (
          <Card key={floor}>
            <CardHeader>
              <CardTitle>{floor}. kat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {floorRooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedId(room.id)}
                    className="rounded-xl border bg-white p-3 text-left transition hover:border-orange-300 hover:shadow-sm"
                  >
                    <p className="font-[family-name:var(--font-heading)] text-lg">
                      {room.number}
                    </p>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {roomTypeLabel[room.type]}
                    </p>
                    <RoomBadge status={room.status} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="p-4">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>Oda {selected.number}</SheetTitle>
                <SheetDescription>
                  {roomTypeLabel[selected.type]} · {selected.floor}. kat
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <RoomBadge status={selected.status} />
                {occupant ? (
                  <p className="text-sm">
                    İçeride: <span className="font-medium">{occupant.guestName}</span>
                  </p>
                ) : arriving ? (
                  <p className="text-sm">
                    Beklenen: <span className="font-medium">{arriving.guestName}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Bu odada aktif konaklama yok.</p>
                )}
                <div className="flex flex-col gap-2">
                  {arriving ? (
                    <Button onClick={() => checkIn(arriving.id)}>Giriş al</Button>
                  ) : null}
                  {occupant ? (
                    <Button variant="outline" onClick={() => checkOut(occupant.id)}>
                      Çıkış al
                    </Button>
                  ) : null}
                  {selected.status === "kirli" || selected.status === "arizali" ? (
                    <Button variant="secondary" onClick={() => markRoomClean(selected.id)}>
                      Temizle / satışa aç
                    </Button>
                  ) : null}
                </div>
                {selected.status === "kirli" ? (
                  <p className="text-xs text-amber-800">
                    Kirli odaya giriş kapalıdır. Kat hizmeti temizledikten sonra
                    beklenen misafir içeri alınır.
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
