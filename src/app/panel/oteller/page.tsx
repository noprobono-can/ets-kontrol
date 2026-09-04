"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { PageHeader, FillBar } from "@/components/page-chrome"
import { IntegrationBadge, StatusBadge } from "@/components/status-badges"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TODAY } from "@/lib/dates"
import { hotelAllotmentFill } from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function HotelsPage() {
  const { state, view } = useStore()
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState("all")
  const [pms, setPms] = useState("all")

  const regions = useMemo(
    () => Array.from(new Set(state.hotels.map((item) => item.region))),
    [state.hotels]
  )
  const pmsList = useMemo(
    () => Array.from(new Set(state.hotels.map((item) => item.pms))),
    [state.hotels]
  )

  const rows = state.hotels.filter((hotel) => {
    if (view.role === "otel" && hotel.id !== view.hotelId) return false
    if (region !== "all" && hotel.region !== region) return false
    if (pms !== "all" && hotel.pms !== pms) return false
    const hay = `${hotel.name} ${hotel.city} ${hotel.region}`.toLowerCase()
    return hay.includes(query.toLowerCase())
  })

  return (
    <div>
      <PageHeader
        title="Tesis portföyü"
        description="ETS’nin çalıştığı oteller: grup tesisleri ve kontratlı partnerler. Elektraweb tek otelin PMS’i iken burada portföyün tamamı yönetilir."
      />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Tesis veya şehir ara"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:max-w-xs"
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        >
          <option value="all">Tüm bölgeler</option>
          {regions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={pms}
          onChange={(event) => setPms(event.target.value)}
        >
          <option value="all">Tüm PMS’ler</option>
          {pmsList.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-sm text-muted-foreground ring-1 ring-foreground/10">
          Bu filtrelere uyan tesis yok. Aramayı veya bölgeyi genişletin.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tesis</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Kontrat</TableHead>
                <TableHead>PMS</TableHead>
                <TableHead>Entegrasyon</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Bugün</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((hotel) => {
                const fill = hotelAllotmentFill(state, hotel.id, TODAY)
                return (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <Link
                        href={`/panel/oteller/${hotel.id}`}
                        className="font-medium hover:underline"
                      >
                        {hotel.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {hotel.stars}★ {hotel.city} · {hotel.roomCount} oda ·{" "}
                        {hotel.concept}
                      </p>
                    </TableCell>
                    <TableCell>{hotel.kind}</TableCell>
                    <TableCell>{hotel.contractType}</TableCell>
                    <TableCell>{hotel.pms}</TableCell>
                    <TableCell>
                      <IntegrationBadge value={hotel.integration} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={hotel.status} />
                    </TableCell>
                    <TableCell>
                      <FillBar value={fill.fill} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
