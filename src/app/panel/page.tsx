"use client"

import Link from "next/link"
import { FillBar, KpiCard, PageHeader } from "@/components/page-chrome"
import { IntegrationBadge, ReservationBadge, StatusBadge } from "@/components/status-badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  arrivalsOn,
  departuresOn,
  hotelAllotmentFill,
  inHouseOn,
  stopSaleCount,
} from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function DashboardPage() {
  const { state, view } = useStore()
  const scopedHotels =
    view.role === "otel"
      ? state.hotels.filter((item) => item.id === view.hotelId)
      : state.hotels
  const hotelIds = new Set(scopedHotels.map((item) => item.id))
  const arrivals = arrivalsOn(state, TODAY).filter((item) => hotelIds.has(item.hotelId))
  const inHouse = inHouseOn(state, TODAY).filter((item) => hotelIds.has(item.hotelId))
  const departures = departuresOn(state, TODAY).filter((item) =>
    hotelIds.has(item.hotelId)
  )
  const fill = scopedHotels.reduce(
    (acc, hotel) => {
      const row = hotelAllotmentFill(state, hotel.id, TODAY)
      acc.allotted += row.allotted
      acc.sold += row.sold
      return acc
    },
    { allotted: 0, sold: 0 }
  )
  const stopSales = scopedHotels.reduce(
    (acc, hotel) => acc + stopSaleCount(state, TODAY, hotel.id),
    0
  )
  const revenue = inHouse.reduce((acc, item) => acc + item.amount, 0)
  const attention = scopedHotels
    .map((hotel) => ({
      hotel,
      fill: hotelAllotmentFill(state, hotel.id, TODAY),
    }))
    .filter(
      (row) =>
        row.hotel.status !== "Aktif" ||
        row.hotel.integration !== "Çift yönlü" ||
        row.fill.fill >= 0.9
    )

  return (
    <div>
      <PageHeader
        title={view.role === "otel" ? "Tesis günlük durum" : "Merkez günlük durum"}
        description="Elektraweb’deki günlük durum ekranının tur operatörü karşılığı: kontenjan, giriş-çıkış ve entegrasyon sağlığı tek bakışta."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Kontratlı tesis"
          value={String(scopedHotels.length)}
          hint={`${scopedHotels.filter((item) => item.status === "Aktif").length} aktif`}
        />
        <KpiCard
          label="ETS kontenjan"
          value={`%${Math.round((fill.allotted ? fill.sold / fill.allotted : 0) * 100)}`}
          hint={`${fill.sold} / ${fill.allotted} oda bugün`}
          tone={fill.sold / Math.max(fill.allotted, 1) > 0.9 ? "warn" : "good"}
        />
        <KpiCard
          label="Bugünkü hareket"
          value={`${arrivals.length} giriş`}
          hint={`${departures.length} çıkış · ${inHouse.length} in-house`}
        />
        <KpiCard
          label="Stop sale hücresi"
          value={String(stopSales)}
          hint="Bugün kapatılmış oda tipi × tarih"
          tone={stopSales > 0 ? "warn" : "default"}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="bg-white shadow-none">
          <CardHeader className="border-b">
            <CardTitle>Dikkat gereken tesisler</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {attention.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">
                Bugün aksiyon gerektiren tesis yok.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tesis</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Entegrasyon</TableHead>
                    <TableHead>Kontenjan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attention.map(({ hotel, fill: row }) => (
                    <TableRow key={hotel.id}>
                      <TableCell>
                        <Link
                          href={`/panel/oteller/${hotel.id}`}
                          className="font-medium hover:underline"
                        >
                          {hotel.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {hotel.city} · {hotel.pms}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={hotel.status} />
                      </TableCell>
                      <TableCell>
                        <IntegrationBadge value={hotel.integration} />
                      </TableCell>
                      <TableCell>
                        <FillBar value={row.fill} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-none">
          <CardHeader className="border-b">
            <CardTitle>Bugünkü girişler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {arrivals.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">Bugün giriş yok.</p>
            ) : (
              arrivals.slice(0, 8).map((item) => {
                const hotel = state.hotels.find((row) => row.id === item.hotelId)
                const type = state.roomTypes.find((row) => row.id === item.roomTypeId)
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.guest}</p>
                      <p className="text-xs text-muted-foreground">
                        {hotel?.name} · {type?.code} · {item.voucher}
                      </p>
                    </div>
                    <ReservationBadge status={item.status} />
                  </div>
                )
              })
            )}
            <p className="text-xs text-muted-foreground">
              In-house ciro (demo): {formatMoney(revenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 bg-white shadow-none">
        <CardHeader className="border-b">
          <CardTitle>Tesis özeti · {formatDay(TODAY)}</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tesis</TableHead>
                <TableHead>Kontrat</TableHead>
                <TableHead>PMS</TableHead>
                <TableHead>Kontenjan</TableHead>
                <TableHead>Giriş</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scopedHotels.map((hotel) => {
                const row = hotelAllotmentFill(state, hotel.id, TODAY)
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
                        {hotel.stars}★ {hotel.city} · {hotel.roomCount} oda
                      </p>
                    </TableCell>
                    <TableCell>{hotel.contractType}</TableCell>
                    <TableCell>{hotel.pms}</TableCell>
                    <TableCell>
                      <FillBar value={row.fill} />
                    </TableCell>
                    <TableCell>
                      {
                        arrivalsOn(state, TODAY, hotel.id).length
                      }
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
