"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReservationBadge } from "@/components/status-badges"
import { formatShort, nightsBetween } from "@/lib/dates"
import { sourceLabel } from "@/lib/labels"
import { reservationsForHotel, roomsForHotel, usePms } from "@/lib/store"

export default function ReservationsPage() {
  const { hotel, state, checkIn, checkOut, markNoShow, createWalkIn } = usePms()
  const [query, setQuery] = useState("")
  const [walkOpen, setWalkOpen] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [guestCount, setGuestCount] = useState("2")
  const [nights, setNights] = useState("3")
  const [roomId, setRoomId] = useState("")

  const reservations = hotel
    ? reservationsForHotel(state.reservations, hotel.id)
    : []
  const rooms = hotel ? roomsForHotel(state.rooms, hotel.id) : []
  const vacant = rooms.filter((r) => r.status === "bos")

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr")
    const list = [...reservations].sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    if (!q) return list
    return list.filter(
      (r) =>
        r.guestName.toLocaleLowerCase("tr").includes(q) ||
        r.confirmationNo.toLocaleLowerCase("tr").includes(q)
    )
  }, [query, reservations])

  if (!hotel) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <p className="font-medium text-rose-950">Otel bulunamadı</p>
      </div>
    )
  }

  function submitWalkIn() {
    if (!guestName.trim() || !roomId) return
    createWalkIn({
      guestName,
      guestCount: Number(guestCount) || 1,
      nights: Number(nights) || 1,
      roomId,
    })
    setWalkOpen(false)
    setGuestName("")
    setRoomId("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl">
            Rezervasyonlar
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{hotel.name}</p>
        </div>
        <Dialog open={walkOpen} onOpenChange={setWalkOpen}>
          <DialogTrigger render={<Button disabled={hotel.newReservationsClosed} />}>
            Walk-in
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Resepsiyon walk-in</DialogTitle>
              <DialogDescription>
                Bugün girişli kayıt açar. Girişi oda rafından veya listeden alın.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="guest">Misafir</Label>
                <Input
                  id="guest"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ad soyad"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="pax">Kişi</Label>
                  <Input
                    id="pax"
                    type="number"
                    min={1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nights">Gece</Label>
                  <Input
                    id="nights"
                    type="number"
                    min={1}
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Boş oda</Label>
                {vacant.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Boş oda yok.</p>
                ) : (
                  <Select
                    value={roomId || undefined}
                    onValueChange={(value) => setRoomId(value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Oda seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {vacant.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submitWalkIn} disabled={!guestName.trim() || !roomId}>
                Kaydı aç
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="İsim veya konfirmasyon ara"
        className="max-w-md bg-white"
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {filtered.length} kayıt
            {query ? ` · “${query}”` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {filtered.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">
              {reservations.length === 0
                ? "Bu otelde rezervasyon yok."
                : "Aramanızla eşleşen rezervasyon yok. Sorguyu silin veya başka bir isim deneyin."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Konfirmasyon</TableHead>
                  <TableHead>Misafir</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Oda</TableHead>
                  <TableHead>Kaynak</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const room = state.rooms.find((room) => room.id === r.roomId)
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">
                        {r.confirmationNo}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{r.guestName}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.guestCount} kişi · {r.nationality}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs">
                        {formatShort(r.checkIn)}–{formatShort(r.checkOut)}
                        <span className="text-muted-foreground">
                          {" "}
                          · {nightsBetween(r.checkIn, r.checkOut)} gece
                        </span>
                      </TableCell>
                      <TableCell>{room?.number ?? "—"}</TableCell>
                      <TableCell className="text-xs">{sourceLabel[r.source]}</TableCell>
                      <TableCell>
                        <ReservationBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {r.status === "bekliyor" ? (
                            <>
                              <Button size="xs" onClick={() => checkIn(r.id)}>
                                Giriş
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => markNoShow(r.id)}
                              >
                                Gelmedi
                              </Button>
                            </>
                          ) : null}
                          {r.status === "iceri" ? (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => checkOut(r.id)}
                            >
                              Çıkış
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
