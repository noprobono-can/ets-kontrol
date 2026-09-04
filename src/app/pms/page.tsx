"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReservationBadge, RoomBadge } from "@/components/status-badges"
import { formatLong, formatShort, TODAY } from "@/lib/dates"
import { roomTypeLabel } from "@/lib/labels"
import {
  arrivalsToday,
  departuresToday,
  inHouse,
  occupancy,
  pendingArrivals,
} from "@/lib/selectors"
import { reservationsForHotel, roomsForHotel, usePms } from "@/lib/store"

export default function DailyBoardPage() {
  const { hotel, state, view, checkIn, checkOut } = usePms()

  if (!hotel) {
    return <HotelMissing />
  }

  const rooms = roomsForHotel(state.rooms, hotel.id)
  const reservations = reservationsForHotel(state.reservations, hotel.id)
  const occ = occupancy(rooms)
  const pending = pendingArrivals(reservations)
  const departing = departuresToday(reservations).filter((r) => r.status === "iceri")
  const staying = inHouse(reservations)
  const dirty = rooms.filter((r) => r.status === "kirli")
  const allArrivals = arrivalsToday(reservations)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-orange-700 uppercase">
          {view.role === "merkez" ? "ETS Merkez görünümü" : "Otel resepsiyon"}
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl">
          {hotel.name} · günlük pano
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{formatLong(TODAY)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Doluluk" value={`%${occ.pct}`} hint={`${occ.occupied}/${occ.sellable} satılabilir oda`} />
        <Kpi label="Beklenen giriş" value={String(pending.length)} hint="Bugün henüz içeri alınmadı" />
        <Kpi label="Bugün çıkış" value={String(departing.length)} hint="Hâlâ odada" />
        <Kpi label="İçeride" value={String(staying.length)} hint={`${dirty.length} kirli oda`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Bugünkü girişler</CardTitle>
            <Button variant="outline" size="sm" render={<Link href="/pms/rezervasyonlar" />}>
              Tümü
            </Button>
          </CardHeader>
          <CardContent>
            {allArrivals.length === 0 ? (
              <Empty>Bugün beklenen giriş yok.</Empty>
            ) : (
              <ul className="divide-y">
                {allArrivals.map((r) => {
                  const room = state.rooms.find((room) => room.id === r.roomId)
                  return (
                    <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{r.guestName}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.confirmationNo} · {r.guestCount} kişi · oda {room?.number ?? "—"} ·{" "}
                          {roomTypeLabel[r.roomType]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReservationBadge status={r.status} />
                        {r.status === "bekliyor" ? (
                          <Button size="sm" onClick={() => checkIn(r.id)}>
                            Giriş
                          </Button>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Bugünkü çıkışlar</CardTitle>
            <Button variant="outline" size="sm" render={<Link href="/pms/misafirler" />}>
              Konaklayanlar
            </Button>
          </CardHeader>
          <CardContent>
            {departing.length === 0 ? (
              <Empty>Bugün çıkış beklenen misafir yok.</Empty>
            ) : (
              <ul className="divide-y">
                {departing.map((r) => {
                  const room = state.rooms.find((room) => room.id === r.roomId)
                  return (
                    <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{r.guestName}</p>
                        <p className="text-xs text-muted-foreground">
                          Oda {room?.number ?? "—"} · {formatShort(r.checkIn)}–{formatShort(r.checkOut)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => checkOut(r.id)}>
                        Çıkış al
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oda uyarısı</CardTitle>
        </CardHeader>
        <CardContent>
          {dirty.length === 0 && rooms.filter((r) => r.status === "arizali").length === 0 ? (
            <Empty>Satışı kapatan kirli veya arızalı oda yok.</Empty>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {rooms
                .filter((r) => r.status === "kirli" || r.status === "arizali")
                .map((r) => (
                  <li key={r.id} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
                    <span className="font-medium">{r.number}</span>
                    <RoomBadge status={r.status} />
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-[family-name:var(--font-heading)] text-2xl">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardHeader>
    </Card>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-sm text-muted-foreground">{children}</p>
}

function HotelMissing() {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
      <p className="font-medium text-rose-950">Otel bulunamadı</p>
      <p className="mt-1 text-sm text-rose-800">
        Seçilen tesis demo verisinde yok. Üstteki listeden bir ETS oteli seçin.
      </p>
    </div>
  )
}
