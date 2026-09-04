"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-chrome"
import { Button } from "@/components/ui/button"
import { addDays, TODAY, dateRange, formatDay, formatWeekday } from "@/lib/dates"
import { allotmentCell, roomTypesOf, soldOn } from "@/lib/selectors"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function AllotmentPage() {
  const { state, view, setHotel, updateAllotment } = useStore()
  const hotelId = view.hotelId
  const days = dateRange(TODAY, 14)
  const types = roomTypesOf(state, hotelId)
  const hotel = state.hotels.find((item) => item.id === hotelId)
  const [editing, setEditing] = useState<{
    roomTypeId: string
    date: string
  } | null>(null)
  const [value, setValue] = useState("0")

  return (
    <div>
      <PageHeader
        title="Kontenjan ve stop sale"
        description="Tur operatörü işinin kalbi: oda tipi × tarih bazında allotment, satılan adet ve satış kapatma. Elektraweb bunu otel tarafında tutar; ETS Kontrol merkezden yönetir."
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
      <div className="mb-3 flex flex-wrap gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-teal-700/20 ring-1 ring-teal-700/30" />
          Rahat
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-amber-400/40 ring-1 ring-amber-500/40" />
          %80+ dolu
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-red-600/20 ring-1 ring-red-600/30" />
          Dolu / stop sale
        </span>
      </div>
      <div className="overflow-auto rounded-xl bg-white ring-1 ring-foreground/10">
        <table className="min-w-max border-collapse text-xs">
          <thead>
            <tr className="bg-[#0b1f36] text-white">
              <th className="sticky left-0 z-10 bg-[#0b1f36] px-3 py-2 text-left">
                {hotel?.name}
              </th>
              {days.map((day) => (
                <th key={day} className="min-w-[4.5rem] px-2 py-2 text-center">
                  <div className="capitalize">{formatWeekday(day)}</div>
                  <div className={cn(day === TODAY && "text-teal-200")}>
                    {formatDay(day)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id} className="border-t">
                <td className="sticky left-0 z-10 bg-white px-3 py-2">
                  <div className="font-medium">{type.code}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {type.name} · baz {type.allotment}
                  </div>
                </td>
                {days.map((day) => {
                  const cell = allotmentCell(state, hotelId, type.id, day)
                  const sold = soldOn(state, hotelId, type.id, day)
                  const allotted = cell?.allotted ?? type.allotment
                  const fill = allotted === 0 ? 1 : sold / allotted
                  const closed = cell?.stopSale
                  return (
                    <td key={day} className="border-l p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing({ roomTypeId: type.id, date: day })
                          setValue(String(allotted))
                        }}
                        className={cn(
                          "flex h-14 w-full flex-col items-center justify-center rounded-md ring-1",
                          closed
                            ? "bg-red-600/15 text-red-800 ring-red-600/30"
                            : fill >= 1
                              ? "bg-red-600/10 text-red-800 ring-red-600/20"
                              : fill >= 0.8
                                ? "bg-amber-400/25 text-amber-900 ring-amber-500/30"
                                : "bg-teal-700/10 text-teal-900 ring-teal-700/15"
                        )}
                      >
                        <span className="text-sm font-semibold tabular-nums">
                          {sold}/{allotted}
                        </span>
                        <span className="text-[10px]">
                          {closed ? "STOP" : "açık"}
                        </span>
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Hücreye tıklayınca kontenjanı değiştirir veya stop sale açıp kapatırsınız.
        Değişiklik etstur.com / Etscore / Odamax stokuna yansıyacak şekilde
        kurgulanmıştır (demo, yerel durum).
      </p>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg">
            <p className="font-medium">Kontenjanı güncelle</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {roomTypesOf(state, hotelId).find((item) => item.id === editing.roomTypeId)?.code}{" "}
              · {formatDay(editing.date)} · {addDays(editing.date, 0)}
            </p>
            <label className="mt-3 block text-xs text-muted-foreground">
              Ayrılan oda
            </label>
            <input
              className="mt-1 h-8 w-full rounded-lg border border-input px-2 text-sm"
              type="number"
              min={0}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  updateAllotment(hotelId, editing.roomTypeId, editing.date, {
                    allotted: Number(value) || 0,
                  })
                  toast.success("Kontenjan güncellendi")
                  setEditing(null)
                }}
              >
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const cell = allotmentCell(
                    state,
                    hotelId,
                    editing.roomTypeId,
                    editing.date
                  )
                  updateAllotment(hotelId, editing.roomTypeId, editing.date, {
                    stopSale: !cell?.stopSale,
                  })
                  toast.message(
                    cell?.stopSale ? "Stop sale kaldırıldı" : "Stop sale açıldı"
                  )
                  setEditing(null)
                }}
              >
                Stop sale değiştir
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Kapat
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
