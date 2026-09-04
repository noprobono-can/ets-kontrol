"use client"

import { useState } from "react"
import { toast } from "sonner"
import { KpiCard, PageHeader } from "@/components/page-chrome"
import { HousekeepingBadge } from "@/components/status-badges"
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
import { TODAY, formatDay, formatMoney } from "@/lib/dates"
import {
  folioOf,
  folioTotal,
  inHouseOn,
  roomById,
  roomTypeById,
} from "@/lib/selectors"
import { useStore } from "@/lib/store"
import type { FolioDepartment } from "@/lib/types"

const DEPARTMENTS: FolioDepartment[] = [
  "Minibar",
  "Çamaşır",
  "Restoran",
  "Diğer",
]

export default function InHousePage() {
  const { state, view, setHotel, addFolio, checkOut } = useStore()
  const hotelId = view.hotelId
  const rows = inHouseOn(state, TODAY, hotelId)
  const [extraId, setExtraId] = useState<string | null>(null)
  const [desc, setDesc] = useState("Minibar")
  const [amount, setAmount] = useState("25")
  const [department, setDepartment] = useState<FolioDepartment>("Minibar")

  const hotel = state.hotels.find((item) => item.id === hotelId)

  return (
    <div>
      <PageHeader
        title="Konaklayanlar ve folyo"
        description="In-house misafir, oda hesabı, ekstra posting. Check-out folyoyu kapatır ve odayı kat hizmetine kirli düşürür."
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
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <KpiCard label="In-house" value={String(rows.length)} />
        <KpiCard
          label="Açık folyo"
          value={formatMoney(
            rows.reduce((acc, item) => acc + folioTotal(state, item.id), 0)
          )}
        />
        <KpiCard label="Tesis" value={`${hotel?.stars}★`} hint={hotel?.city} />
      </div>
      {rows.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-sm text-muted-foreground ring-1 ring-foreground/10">
          Bu tesiste şu an konaklayan yok.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Misafir</TableHead>
                <TableHead>Oda</TableHead>
                <TableHead>Çıkış</TableHead>
                <TableHead>HK</TableHead>
                <TableHead>Folyo</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => {
                const room = roomById(state, item.roomId)
                const type = roomTypeById(state, item.roomTypeId)
                const total = folioTotal(state, item.id)
                const lines = folioOf(state, item.id)
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.guest}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.voucher} · {item.pax} kişi · {item.board}
                      </p>
                    </TableCell>
                    <TableCell>
                      {room?.number ?? "Atanmadı"}{" "}
                      <span className="text-muted-foreground">{type?.code}</span>
                    </TableCell>
                    <TableCell>{formatDay(item.checkOut)}</TableCell>
                    <TableCell>
                      {room ? (
                        <HousekeepingBadge status={room.hkStatus} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatMoney(total)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {lines.map((line) => line.department).join(" · ") || "Kalem yok"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setExtraId(item.id)
                            setDesc("Minibar")
                            setAmount("25")
                          }}
                        >
                          Ekstra
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const result = checkOut(item.id)
                            if (!result.ok) toast.error(result.reason)
                            else toast.success("Check-out · oda kirliye alındı")
                          }}
                        >
                          Check-out
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {extraId ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg">
            <p className="font-medium">Folyo kalemi</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {rows.find((item) => item.id === extraId)?.guest}
            </p>
            <label className="mt-3 block text-xs text-muted-foreground">Departman</label>
            <select
              className="mt-1 h-8 w-full rounded-lg border px-2 text-sm"
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value as FolioDepartment)
              }
            >
              {DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label className="mt-3 block text-xs text-muted-foreground">Açıklama</label>
            <Input
              className="mt-1"
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
            />
            <label className="mt-3 block text-xs text-muted-foreground">Tutar EUR</label>
            <Input
              className="mt-1"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  addFolio(extraId, {
                    department,
                    description: desc.trim() || department,
                    amount: Number(amount) || 0,
                  })
                  toast.success("Folyo güncellendi")
                  setExtraId(null)
                }}
              >
                Post et
              </Button>
              <Button variant="ghost" onClick={() => setExtraId(null)}>
                Vazgeç
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
