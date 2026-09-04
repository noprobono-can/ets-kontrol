"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ReservationBadge } from "@/components/status-badges"
import { formatShort, nightsBetween } from "@/lib/dates"
import { inHouse } from "@/lib/selectors"
import { reservationsForHotel, usePms } from "@/lib/store"

export default function GuestsPage() {
  const { hotel, state, checkOut } = usePms()
  const [query, setQuery] = useState("")

  const staying = hotel
    ? inHouse(reservationsForHotel(state.reservations, hotel.id))
    : []

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr")
    if (!q) return staying
    return staying.filter((r) => r.guestName.toLocaleLowerCase("tr").includes(q))
  }, [query, staying])

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
          Konaklayan misafirler
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {hotel.name} · şu anda odada olanlar
        </p>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Misafir ara"
        className="max-w-md bg-white"
      />

      <Card>
        <CardHeader>
          <CardTitle>{filtered.length} misafir grubu</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">
              {staying.length === 0
                ? "Şu anda içeride misafir yok. Giriş aldığınızda bu liste dolar."
                : "Aramanızla eşleşen misafir yok."}
            </p>
          ) : (
            <ul className="divide-y">
              {filtered.map((r) => {
                const room = state.rooms.find((room) => room.id === r.roomId)
                return (
                  <li
                    key={r.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{r.guestName}</p>
                      <p className="text-sm text-muted-foreground">
                        Oda {room?.number ?? "—"} · {r.guestCount} kişi ·{" "}
                        {formatShort(r.checkIn)}–{formatShort(r.checkOut)} ·{" "}
                        {nightsBetween(r.checkIn, r.checkOut)} gece
                      </p>
                      <div className="mt-2">
                        <ReservationBadge status={r.status} />
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => checkOut(r.id)}>
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
  )
}
