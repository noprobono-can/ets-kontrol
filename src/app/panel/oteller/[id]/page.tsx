"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { FillBar, KpiCard, PageHeader } from "@/components/page-chrome"
import {
  IntegrationBadge,
  ReservationBadge,
  StatusBadge,
} from "@/components/status-badges"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TODAY, formatMoney } from "@/lib/dates"
import {
  arrivalsOn,
  hotelAllotmentFill,
  inHouseOn,
  roomTypesOf,
} from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function HotelDetailPage() {
  const params = useParams<{ id: string }>()
  const { state } = useStore()
  const hotel = state.hotels.find((item) => item.id === params.id)
  const types = roomTypesOf(state, params.id)
  const fill = hotelAllotmentFill(state, params.id, TODAY)
  const arrivals = arrivalsOn(state, TODAY, params.id)
  const inHouse = inHouseOn(state, TODAY, params.id)
  const rates = useMemo(
    () =>
      state.rates.filter(
        (item) => item.hotelId === params.id && item.season === "Yaz yüksek"
      ),
    [params.id, state.rates]
  )

  if (!hotel) {
    return (
      <p className="rounded-xl bg-white p-8 text-sm text-muted-foreground ring-1 ring-foreground/10">
        Tesis bulunamadı.
      </p>
    )
  }

  return (
    <div>
      <PageHeader
        title={hotel.name}
        description={`${hotel.stars} yıldız · ${hotel.city}, ${hotel.region} · ${hotel.roomCount} oda · ${hotel.concept}`}
        actions={
          <div className="flex gap-2">
            <Link
              href="/panel/blokaj"
              className={buttonVariants({ variant: "outline" })}
            >
              Blokaj
            </Link>
            <Link href="/panel/kontenjan" className={buttonVariants()}>
              Kontenjan
            </Link>
          </div>
        }
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <StatusBadge status={hotel.status} />
        <IntegrationBadge value={hotel.integration} />
        <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-foreground/10">
          {hotel.kind}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-foreground/10">
          {hotel.contractType}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs ring-1 ring-foreground/10">
          PMS: {hotel.pms}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard
          label="ETS kontenjan"
          value={`${fill.sold}/${fill.allotted}`}
          hint="Bugünkü satılan / ayrılan oda"
        />
        <KpiCard label="Bugünkü giriş" value={String(arrivals.length)} />
        <KpiCard label="In-house" value={String(inHouse.length)} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card className="bg-white shadow-none">
          <CardHeader className="border-b">
            <CardTitle>Oda tipleri ve kontenjan</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tip</TableHead>
                  <TableHead>Fiziksel</TableHead>
                  <TableHead>Allotment</TableHead>
                  <TableHead>Bugün</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((type) => {
                  const sold = inHouse.filter((item) => item.roomTypeId === type.id)
                    .length
                  return (
                    <TableRow key={type.id}>
                      <TableCell>
                        <span className="font-medium">{type.code}</span>
                        <span className="text-muted-foreground"> · {type.name}</span>
                      </TableCell>
                      <TableCell>{type.physical}</TableCell>
                      <TableCell>{type.allotment}</TableCell>
                      <TableCell>
                        <FillBar
                          value={type.allotment === 0 ? 0 : sold / type.allotment}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-none">
          <CardHeader className="border-b">
            <CardTitle>Yaz yüksek sezon fiyatı</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Oda</TableHead>
                  <TableHead>Pansiyon</TableHead>
                  <TableHead>Dbl</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.map((rate) => {
                  const type = types.find((item) => item.id === rate.roomTypeId)
                  return (
                    <TableRow key={rate.id}>
                      <TableCell>{type?.code}</TableCell>
                      <TableCell>{rate.board}</TableCell>
                      <TableCell>{formatMoney(rate.doubleRate)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 bg-white shadow-none">
        <CardHeader className="border-b">
          <CardTitle>Bugünkü girişler</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {arrivals.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground">
              Bu tesiste bugün giriş yok.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Misafir</TableHead>
                  <TableHead>Voucher</TableHead>
                  <TableHead>Oda</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arrivals.map((item) => {
                  const type = types.find((row) => row.id === item.roomTypeId)
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.guest}</TableCell>
                      <TableCell>{item.voucher}</TableCell>
                      <TableCell>{type?.code}</TableCell>
                      <TableCell>
                        <ReservationBadge status={item.status} />
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
