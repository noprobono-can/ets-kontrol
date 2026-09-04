"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addDays, TODAY } from "@/lib/dates"
import { nextVoucher, roomTypesOf } from "@/lib/selectors"
import { useStore } from "@/lib/store"
import type { Board, Channel, Reservation } from "@/lib/types"

const CHANNELS: Channel[] = [
  "etstur.com",
  "Etscore",
  "Odamax",
  "Çağrı merkezi",
  "Acente B2B",
]
const BOARDS: Board[] = ["UAI", "AI", "HB", "BB", "RO"]

export function ReservationDialog({
  open,
  onOpenChange,
  hotelId,
  preset,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  hotelId: string
  preset?: { date?: string; roomTypeId?: string; roomId?: string }
}) {
  const { state, upsertReservation } = useStore()
  const types = roomTypesOf(state, hotelId)
  const hotel = state.hotels.find((item) => item.id === hotelId)
  const [guest, setGuest] = useState("")
  const [roomTypeId, setRoomTypeId] = useState(preset?.roomTypeId ?? types[0]?.id ?? "")
  const [checkIn, setCheckIn] = useState(preset?.date ?? TODAY)
  const [nights, setNights] = useState("4")
  const [pax, setPax] = useState("2")
  const [board, setBoard] = useState<Board>(hotel?.concept ?? "AI")
  const [channel, setChannel] = useState<Channel>("etstur.com")
  const [amount, setAmount] = useState("720")

  const canSave = guest.trim().length > 2 && roomTypeId && Number(nights) > 0

  function submit() {
    const reservation: Reservation = {
      id: `r-${Date.now()}`,
      hotelId,
      roomTypeId,
      roomId: preset?.roomId ?? null,
      guest: guest.trim(),
      pax: Number(pax) || 2,
      board,
      checkIn,
      checkOut: addDays(checkIn, Number(nights) || 1),
      status: "Konfirmeli",
      channel,
      amount: Number(amount) || 0,
      currency: "EUR",
      voucher: nextVoucher(state),
    }
    upsertReservation(reservation)
    toast.success(`${reservation.voucher} konfirme edildi`)
    onOpenChange(false)
    setGuest("")
  }

  const fields = useMemo(
    () => [
      { id: "guest", label: "Misafir" },
    ],
    []
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni rezervasyon</DialogTitle>
          <DialogDescription>
            {hotel?.name} kontenjanına ETS kaydı oluşturur. PMS eşlemesi demo
            ortamında anında işlenir.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor={fields[0].id}>Misafir adı</Label>
            <Input
              id="guest"
              value={guest}
              onChange={(event) => setGuest(event.target.value)}
              placeholder="Ad Soyad"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Oda tipi</Label>
              <select
                className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                value={roomTypeId}
                onChange={(event) => setRoomTypeId(event.target.value)}
              >
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.code} · {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Kanal</Label>
              <select
                className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                value={channel}
                onChange={(event) => setChannel(event.target.value as Channel)}
              >
                {CHANNELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label>Giriş</Label>
              <Input
                type="date"
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Gece</Label>
              <Input
                type="number"
                min={1}
                value={nights}
                onChange={(event) => setNights(event.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Pax</Label>
              <Input
                type="number"
                min={1}
                value={pax}
                onChange={(event) => setPax(event.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Pansiyon</Label>
              <select
                className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
                value={board}
                onChange={(event) => setBoard(event.target.value as Board)}
              >
                {BOARDS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Tutar (EUR)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button disabled={!canSave} onClick={submit}>
            Konfirme et
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
