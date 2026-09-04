export type Board = "UAI" | "AI" | "HB" | "BB" | "RO"
export type ContractType = "Garanti" | "Allotment" | "Serbest satış"
export type PmsKind =
  | "ETS Kontrol"
  | "Elektraweb"
  | "Opera Cloud"
  | "Sedna"
  | "HotelRunner"
  | "Yok"
export type Integration = "Çift yönlü" | "Polling" | "Manuel" | "Yerel PMS"
export type HotelKind = "Grup tesisi" | "Kontratlı"
export type ReservationStatus =
  | "Opsiyon"
  | "Konfirmeli"
  | "Check-in"
  | "Check-out"
  | "İptal"
  | "No-show"
export type Channel =
  | "etstur.com"
  | "Etscore"
  | "Odamax"
  | "Çağrı merkezi"
  | "Acente B2B"
  | "Walk-in"
export type HousekeepingStatus = "Temiz" | "Kirli" | "Kontrol" | "Arızalı"
export type HkTaskType = "Çıkış temizliği" | "Stayover" | "VIP setup" | "Arıza"
export type HkTaskStatus = "Açık" | "Devam" | "Tamam"
export type FolioDepartment = "Oda" | "Minibar" | "Çamaşır" | "Restoran" | "Diğer"

export type Hotel = {
  id: string
  name: string
  city: string
  region: string
  stars: number
  roomCount: number
  concept: Board
  kind: HotelKind
  pms: PmsKind
  usesEtsPms: boolean
  contractType: ContractType
  integration: Integration
  status: "Aktif" | "Stop sale" | "Askıda"
}

export type RoomType = {
  id: string
  hotelId: string
  code: string
  name: string
  capacity: number
  physical: number
  allotment: number
}

export type Room = {
  id: string
  hotelId: string
  roomTypeId: string
  number: string
  floor: number
  hkStatus: HousekeepingStatus
  hkAssignee: string | null
  hkNote?: string
}

export type Reservation = {
  id: string
  hotelId: string
  roomTypeId: string
  roomId: string | null
  guest: string
  pax: number
  board: Board
  checkIn: string
  checkOut: string
  status: ReservationStatus
  channel: Channel
  amount: number
  currency: "EUR"
  voucher: string
  note?: string
}

export type AllotmentCell = {
  hotelId: string
  roomTypeId: string
  date: string
  allotted: number
  stopSale: boolean
}

export type RatePlan = {
  id: string
  hotelId: string
  roomTypeId: string
  board: Board
  season: string
  period: string
  doubleRate: number
  extraAdult: number
  child: number
  currency: "EUR"
}

export type HkTask = {
  id: string
  hotelId: string
  roomId: string
  type: HkTaskType
  status: HkTaskStatus
  assignee: string
  due: string
}

export type FolioItem = {
  id: string
  reservationId: string
  department: FolioDepartment
  description: string
  amount: number
}

export type AppState = {
  hotels: Hotel[]
  roomTypes: RoomType[]
  rooms: Room[]
  reservations: Reservation[]
  allotments: AllotmentCell[]
  rates: RatePlan[]
  hkTasks: HkTask[]
  folio: FolioItem[]
}

export type Role = "merkez" | "otel"
export type ViewState = {
  role: Role
  hotelId: string
}

export type ActionResult = { ok: true } | { ok: false; reason: string }
