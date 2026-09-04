"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-chrome"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatMoney } from "@/lib/dates"
import { roomTypeById } from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function RatesPage() {
  const { state, view, setHotel, updateRate } = useStore()
  const hotelId = view.role === "otel" ? view.hotelId : view.hotelId
  const [season, setSeason] = useState("Yaz yüksek")
  const seasons = useMemo(
    () => Array.from(new Set(state.rates.map((item) => item.season))),
    [state.rates]
  )
  const rows = state.rates.filter(
    (item) => item.hotelId === hotelId && item.season === season
  )

  return (
    <div>
      <PageHeader
        title="Kontrat fiyatları"
        description="Sezon, oda tipi ve pansiyon bazında net acente fiyatı. Elektraweb’deki kontrat sihirbazının ETS merkez karşılığı."
        actions={
          <div className="flex gap-2">
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
            <select
              className="h-8 rounded-lg border border-input bg-white px-2 text-sm"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
            >
              {seasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Oda tipi</TableHead>
              <TableHead>Pansiyon</TableHead>
              <TableHead>Dönem</TableHead>
              <TableHead>Dbl EUR</TableHead>
              <TableHead>Ek yetişkin</TableHead>
              <TableHead>Çocuk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((rate) => {
              const type = roomTypeById(state, rate.roomTypeId)
              return (
                <TableRow key={rate.id}>
                  <TableCell>
                    {type?.code} · {type?.name}
                  </TableCell>
                  <TableCell>{rate.board}</TableCell>
                  <TableCell>{rate.period}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="h-7 w-24"
                      defaultValue={rate.doubleRate}
                      onBlur={(event) => {
                        const next = Number(event.target.value)
                        if (!Number.isFinite(next) || next === rate.doubleRate) return
                        updateRate(rate.id, next)
                        toast.success("Fiyat güncellendi")
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatMoney(rate.extraAdult)}</TableCell>
                  <TableCell>{formatMoney(rate.child)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Dbl fiyatı blur olduğunda kaydedilir. Canlı sistemde bu değişiklik Royal
        API ve kanal stokuna yayınlanır.
      </p>
    </div>
  )
}
