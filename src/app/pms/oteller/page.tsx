"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { hotelSummary } from "@/lib/selectors"
import { usePms } from "@/lib/store"

export default function HotelsPage() {
  const { state, view, setHotelId, setRole, setNewReservationsClosed } = usePms()
  const rows = state.hotels.map((hotel) =>
    hotelSummary(hotel, state.rooms, state.reservations)
  )
  const canControl = view.role === "merkez"

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-orange-700 uppercase">
          ETSTUR ağı · 8 demo tesis
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl">
          ETS otelleri
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Bu liste yalnızca ETSTUR ile çalışan otellerdir. Merkez rolünde yeni
          rezervasyonu durdurabilirsiniz; resepsiyon mevcut giriş-çıkışı
          işlemeye devam eder.
        </p>
      </div>

      {!canControl ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
          Denetim için üstten <strong>ETS Merkez</strong> rolünü seçin. Şu an
          otel resepsiyonundasınız.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Canlı doluluk</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {rows.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">
              Kayıtlı ETS oteli yok.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Otel</TableHead>
                  <TableHead>Doluluk</TableHead>
                  <TableHead>Giriş</TableHead>
                  <TableHead>Çıkış</TableHead>
                  <TableHead>İçeride</TableHead>
                  <TableHead>Satış</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.hotel.id}>
                    <TableCell>
                      <button
                        type="button"
                        className="text-left"
                        onClick={() => setHotelId(row.hotel.id)}
                      >
                        <p className="font-medium">{row.hotel.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.hotel.stars}★ · {row.hotel.city} · {row.hotel.phone}
                        </p>
                      </button>
                    </TableCell>
                    <TableCell>%{row.pct}</TableCell>
                    <TableCell>{row.arrivals}</TableCell>
                    <TableCell>{row.departures}</TableCell>
                    <TableCell>{row.inHouse}</TableCell>
                    <TableCell>
                      {row.hotel.newReservationsClosed ? (
                        <Badge className="bg-orange-600 text-white">Durduruldu</Badge>
                      ) : (
                        <Badge variant="outline">Açık</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setHotelId(row.hotel.id)
                            setRole("otel")
                          }}
                        >
                          Resepsiyon
                        </Button>
                        {canControl ? (
                          <Button
                            size="xs"
                            variant={
                              row.hotel.newReservationsClosed ? "secondary" : "default"
                            }
                            onClick={() =>
                              setNewReservationsClosed(
                                row.hotel.id,
                                !row.hotel.newReservationsClosed
                              )
                            }
                          >
                            {row.hotel.newReservationsClosed
                              ? "Yeniden aç"
                              : "Yeni rezervasyonu durdur"}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
