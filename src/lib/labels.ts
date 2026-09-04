import type { BookingSource, ReservationStatus, RoomStatus, RoomType } from "./types"

export const roomTypeLabel: Record<RoomType, string> = {
  standart: "Standart",
  deniz: "Deniz manzaralı",
  suit: "Suit",
}

export const roomStatusLabel: Record<RoomStatus, string> = {
  bos: "Boş",
  dolu: "Dolu",
  kirli: "Kirli",
  arizali: "Arızalı",
}

export const reservationStatusLabel: Record<ReservationStatus, string> = {
  bekliyor: "Beklenen",
  iceri: "İçeride",
  cikti: "Çıkış yaptı",
  iptal: "İptal",
  "no-show": "Gelmedi",
}

export const sourceLabel: Record<BookingSource, string> = {
  "etstur.com": "etstur.com",
  resepsiyon: "Resepsiyon",
  "ets-merkez": "ETS Merkez",
}
