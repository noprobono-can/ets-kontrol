export type Role = "otel" | "merkez"

export type RoomType = "standart" | "deniz" | "suit"

export type RoomStatus = "bos" | "dolu" | "kirli" | "arizali"

export type ReservationStatus =
  | "bekliyor"
  | "iceri"
  | "cikti"
  | "iptal"
  | "no-show"

export type BookingSource = "etstur.com" | "resepsiyon" | "ets-merkez"

export type Hotel = {
  id: string
  name: string
  city: string
  region: string
  stars: 3 | 4 | 5
  phone: string
  newReservationsClosed: boolean
}

export type Room = {
  id: string
  hotelId: string
  number: string
  type: RoomType
  floor: number
  status: RoomStatus
}

export type Reservation = {
  id: string
  hotelId: string
  confirmationNo: string
  guestName: string
  guestCount: number
  nationality: string
  checkIn: string
  checkOut: string
  roomId: string | null
  roomType: RoomType
  source: BookingSource
  status: ReservationStatus
  note?: string
}

export type PmsState = {
  hotels: Hotel[]
  rooms: Room[]
  reservations: Reservation[]
}

export type ViewState = {
  role: Role
  hotelId: string
}
