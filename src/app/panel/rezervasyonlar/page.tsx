"use client"

import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-chrome"
import { ReservationDialog } from "@/components/reservation-dialog"
import { ChannelBadge, ReservationBadge } from "@/components/status-badges"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDay, formatMoney } from "@/lib/dates"
import { roomById, roomTypeById } from "@/lib/selectors"
import { useStore } from "@/lib/store"
import type { ReservationStatus } from "@/lib/types"

const STATUSES: Array<ReservationStatus | "all"> = [
  "all",
  "Opsiyon",
  "Konfirmeli",
  "Check-in",
  "Check-out",
  "İptal",
]

export default function ReservationsPage() {
  const { state, view } = useStore()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ReservationStatus | "all">("all")
  const [open, setOpen] = useState(false)

  const rows = useMemo(() => {
    return state.reservations.filter((item) => {
      if (view.role === "otel" && item.hotelId !== view.hotelId) return false
      if (status !== "all" && item.status !== status) return false
      const hotel = state.hotels.find((row) => row.id === item.hotelId)
      const hay = `${item.guest} ${item.voucher} ${hotel?.name ?? ""}`.toLowerCase()
      return hay.includes(query.toLowerCase())
    })
  }, [query, state, status, view])

  return (
    <div>
      <PageHeader
        title="Rezervasyonlar"
        description="etstur.com, Etscore, Odamax, çağrı merkezi ve B2B acente kayıtları tek listede. Voucher ile arayın, durum filtreleyin."
        actions={
          <Button onClick={() => setOpen(true)}>Yeni rezervasyon</Button>
        }
      />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Misafir, voucher veya tesis"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:max-w-xs"
        />
        <select
          className="h-8 rounded-lg border border-input bg-white px-2 text-sm"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as ReservationStatus | "all")
          }
        >
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "Tüm durumlar" : item}
            </option>
          ))}
        </select>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-sm text-muted-foreground ring-1 ring-foreground/10">
          Eşleşen rezervasyon yok.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher</TableHead>
                <TableHead>Misafir</TableHead>
                <TableHead>Tesis</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Oda</TableHead>
                <TableHead>Kanal</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tutar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => {
                const hotel = state.hotels.find((row) => row.id === item.hotelId)
                const type = roomTypeById(state, item.roomTypeId)
                const room = roomById(state, item.roomId)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.voucher}</TableCell>
                    <TableCell>
                      {item.guest}
                      <p className="text-xs text-muted-foreground">
                        {item.pax} kişi · {item.board}
                      </p>
                    </TableCell>
                    <TableCell>{hotel?.name}</TableCell>
                    <TableCell>
                      {formatDay(item.checkIn)} – {formatDay(item.checkOut)}
                    </TableCell>
                    <TableCell>
                      {type?.code}
                      {room ? ` · ${room.number}` : " · atanmadı"}
                    </TableCell>
                    <TableCell>
                      <ChannelBadge channel={item.channel} />
                    </TableCell>
                    <TableCell>
                      <ReservationBadge status={item.status} />
                    </TableCell>
                    <TableCell>{formatMoney(item.amount)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
      <ReservationDialog
        open={open}
        onOpenChange={setOpen}
        hotelId={view.hotelId}
      />
    </div>
  )
}
