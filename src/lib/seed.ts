import { addDays, dateRange, TODAY } from "./dates"
import type {
  AllotmentCell,
  AppState,
  Board,
  Channel,
  Hotel,
  RatePlan,
  Reservation,
  ReservationStatus,
  Room,
  RoomType,
} from "./types"

const HOTELS: Hotel[] = [
  {
    id: "maxx-belek",
    name: "Maxx Royal Belek",
    city: "Belek",
    region: "Antalya",
    stars: 5,
    roomCount: 470,
    concept: "UAI",
    kind: "Grup tesisi",
    pms: "Opera Cloud",
    contractType: "Garanti",
    integration: "Çift yönlü",
    status: "Aktif",
  },
  {
    id: "voyage-belek",
    name: "Voyage Belek Golf & Spa",
    city: "Belek",
    region: "Antalya",
    stars: 5,
    roomCount: 687,
    concept: "UAI",
    kind: "Grup tesisi",
    pms: "Elektraweb",
    contractType: "Garanti",
    integration: "Çift yönlü",
    status: "Aktif",
  },
  {
    id: "caja-kemer",
    name: "Caja by Maxx Royal",
    city: "Kemer",
    region: "Antalya",
    stars: 5,
    roomCount: 210,
    concept: "UAI",
    kind: "Grup tesisi",
    pms: "Elektraweb",
    contractType: "Garanti",
    integration: "Çift yönlü",
    status: "Aktif",
  },
  {
    id: "lara-palmea",
    name: "Lara Palmea Resort",
    city: "Lara",
    region: "Antalya",
    stars: 5,
    roomCount: 412,
    concept: "AI",
    kind: "Kontratlı",
    pms: "Elektraweb",
    contractType: "Allotment",
    integration: "Polling",
    status: "Aktif",
  },
  {
    id: "kemer-blue",
    name: "Kemer Blue Coast",
    city: "Kemer",
    region: "Antalya",
    stars: 4,
    roomCount: 286,
    concept: "AI",
    kind: "Kontratlı",
    pms: "Sedna",
    contractType: "Allotment",
    integration: "Çift yönlü",
    status: "Aktif",
  },
  {
    id: "side-starlight",
    name: "Side Starlight",
    city: "Side",
    region: "Antalya",
    stars: 5,
    roomCount: 538,
    concept: "UAI",
    kind: "Kontratlı",
    pms: "Elektraweb",
    contractType: "Allotment",
    integration: "Polling",
    status: "Stop sale",
  },
  {
    id: "alanya-coral",
    name: "Alanya Coral Bay",
    city: "Alanya",
    region: "Antalya",
    stars: 4,
    roomCount: 194,
    concept: "AI",
    kind: "Kontratlı",
    pms: "HotelRunner",
    contractType: "Serbest satış",
    integration: "Çift yönlü",
    status: "Aktif",
  },
  {
    id: "bodrum-palmea",
    name: "Bodrum Palmea",
    city: "Bodrum",
    region: "Muğla",
    stars: 5,
    roomCount: 248,
    concept: "HB",
    kind: "Kontratlı",
    pms: "Opera Cloud",
    contractType: "Allotment",
    integration: "Çift yönlü",
    status: "Aktif",
  },
  {
    id: "fethiye-hill",
    name: "Fethiye Hillside",
    city: "Fethiye",
    region: "Muğla",
    stars: 4,
    roomCount: 156,
    concept: "AI",
    kind: "Kontratlı",
    pms: "Elektraweb",
    contractType: "Allotment",
    integration: "Manuel",
    status: "Aktif",
  },
  {
    id: "cesme-marina",
    name: "Çeşme Marina Hotel",
    city: "Çeşme",
    region: "İzmir",
    stars: 5,
    roomCount: 132,
    concept: "BB",
    kind: "Kontratlı",
    pms: "HotelRunner",
    contractType: "Serbest satış",
    integration: "Çift yönlü",
    status: "Aktif",
  },
  {
    id: "pera-suites",
    name: "İstanbul Pera Suites",
    city: "Beyoğlu",
    region: "İstanbul",
    stars: 4,
    roomCount: 78,
    concept: "BB",
    kind: "Kontratlı",
    pms: "Manuel",
    contractType: "Serbest satış",
    integration: "Manuel",
    status: "Askıda",
  },
  {
    id: "capadoccia-cave",
    name: "Kapadokya Cave Lodge",
    city: "Ürgüp",
    region: "Nevşehir",
    stars: 4,
    roomCount: 42,
    concept: "BB",
    kind: "Kontratlı",
    pms: "HotelRunner",
    contractType: "Allotment",
    integration: "Polling",
    status: "Aktif",
  },
]

const TYPE_TEMPLATES: { code: string; name: string; capacity: number; share: number }[] = [
  { code: "STD", name: "Standart oda", capacity: 3, share: 0.55 },
  { code: "DLX", name: "Deluxe oda", capacity: 3, share: 0.25 },
  { code: "FAM", name: "Aile odası", capacity: 4, share: 0.14 },
  { code: "SUI", name: "Suit", capacity: 4, share: 0.06 },
]

const GUESTS = [
  "Ayşe Demir",
  "Klaus Berger",
  "Elif Kaya",
  "Hans Müller",
  "Mert Yılmaz",
  "Sophie Laurent",
  "Deniz Arslan",
  "Olga Ivanova",
  "Caner Aksoy",
  "Emma Wilson",
  "Zeynep Koç",
  "Marco Rossi",
  "Burak Şahin",
  "Anna Schmidt",
  "Selin Aydın",
  "Piotr Nowak",
  "Hakan Öztürk",
  "Laura Becker",
  "Cemre Uçar",
  "Johan Eriksson",
]

const CHANNELS: Channel[] = [
  "etstur.com",
  "Etscore",
  "Odamax",
  "Çağrı merkezi",
  "Acente B2B",
]

function contractShare(hotel: Hotel) {
  if (hotel.kind === "Grup tesisi") return 0.22
  if (hotel.contractType === "Garanti") return 0.18
  if (hotel.contractType === "Allotment") return 0.12
  return 0.07
}

function buildRoomTypes(): RoomType[] {
  return HOTELS.flatMap((hotel) => {
    const contracted = Math.max(8, Math.round(hotel.roomCount * contractShare(hotel)))
    let remainingPhysical = Math.min(32, Math.max(16, Math.round(hotel.roomCount * 0.06)))
    let remainingAllot = contracted
    return TYPE_TEMPLATES.map((tpl, index) => {
      const last = index === TYPE_TEMPLATES.length - 1
      const physical = last
        ? remainingPhysical
        : Math.max(2, Math.round(remainingPhysical * tpl.share))
      const allotment = last
        ? remainingAllot
        : Math.max(1, Math.round(contracted * tpl.share))
      remainingPhysical -= last ? 0 : physical
      remainingAllot -= last ? 0 : allotment
      return {
        id: `${hotel.id}-${tpl.code.toLowerCase()}`,
        hotelId: hotel.id,
        code: tpl.code,
        name: tpl.name,
        capacity: tpl.capacity,
        physical,
        allotment,
      }
    })
  })
}

function buildRooms(roomTypes: RoomType[]): Room[] {
  const rooms: Room[] = []
  for (const type of roomTypes) {
    const hotelTypes = roomTypes.filter((item) => item.hotelId === type.hotelId)
    const typeIndex = hotelTypes.findIndex((item) => item.id === type.id)
    for (let i = 0; i < type.physical; i += 1) {
      const floor = 1 + Math.floor(i / 8) + typeIndex
      const number = `${floor}${String(10 + (i % 8) + typeIndex * 2).padStart(2, "0")}`
      rooms.push({
        id: `${type.id}-${i + 1}`,
        hotelId: type.hotelId,
        roomTypeId: type.id,
        number,
        floor,
      })
    }
  }
  return rooms
}

function buildRates(roomTypes: RoomType[]): RatePlan[] {
  const seasons = [
    { season: "Erken rezervasyon", period: "01 Nis – 31 May", factor: 0.82 },
    { season: "Yaz yüksek", period: "01 Haz – 15 Eyl", factor: 1 },
    { season: "Sonbahar", period: "16 Eyl – 31 Eki", factor: 0.88 },
  ]
  const boards: Board[] = ["AI", "UAI", "HB", "BB"]
  return roomTypes.flatMap((type) => {
    const hotel = HOTELS.find((item) => item.id === type.hotelId)!
    const base =
      hotel.region === "Antalya"
        ? 210
        : hotel.region === "Muğla"
          ? 240
          : hotel.region === "İstanbul"
            ? 160
            : 145
    const typeFactor =
      type.code === "SUI" ? 2.1 : type.code === "FAM" ? 1.45 : type.code === "DLX" ? 1.2 : 1
    const board = hotel.concept
    return seasons.map((slot, index) => ({
      id: `${type.id}-${index}`,
      hotelId: hotel.id,
      roomTypeId: type.id,
      board: boards.includes(board) ? board : "AI",
      season: slot.season,
      period: slot.period,
      doubleRate: Math.round(base * typeFactor * slot.factor),
      extraAdult: Math.round(base * 0.35 * slot.factor),
      child: Math.round(base * 0.18 * slot.factor),
      currency: "EUR" as const,
    }))
  })
}

function pick<T>(list: T[], index: number) {
  return list[index % list.length]
}

function buildReservations(roomTypes: RoomType[], rooms: Room[]): Reservation[] {
  const reservations: Reservation[] = []
  let seq = 18420
  HOTELS.forEach((hotel, hotelIndex) => {
    const types = roomTypes.filter((item) => item.hotelId === hotel.id)
    const count = hotel.kind === "Grup tesisi" ? 14 : 8
    for (let i = 0; i < count; i += 1) {
      const type = pick(types, i + hotelIndex)
      const hotelRooms = rooms.filter((item) => item.roomTypeId === type.id)
      const offset = (i * 2 + hotelIndex) % 9 - 3
      const nights = 3 + ((i + hotelIndex) % 5)
      const checkIn = addDays(TODAY, offset)
      const checkOut = addDays(checkIn, nights)
      const inHouse = checkIn <= TODAY && checkOut > TODAY
      let status: ReservationStatus = "Konfirmeli"
      if (inHouse && i % 4 !== 0) status = "Check-in"
      if (checkOut <= TODAY) status = "Check-out"
      if (i === 1 && hotelIndex % 3 === 0) status = "Opsiyon"
      if (hotel.status === "Askıda" && i === 0) status = "İptal"
      const assigned =
        status === "Check-in" || status === "Check-out"
          ? hotelRooms[i % hotelRooms.length]?.id ?? null
          : i % 3 === 0
            ? hotelRooms[i % hotelRooms.length]?.id ?? null
            : null
      seq += 1
      reservations.push({
        id: `r-${seq}`,
        hotelId: hotel.id,
        roomTypeId: type.id,
        roomId: assigned,
        guest: pick(GUESTS, seq),
        pax: 2 + (i % 3),
        board: hotel.concept,
        checkIn,
        checkOut,
        status,
        channel: pick(CHANNELS, seq + i),
        amount: 180 * nights + i * 25,
        currency: "EUR",
        voucher: `ETS${seq}`,
        note: i === 1 ? "Geç check-in talep etti" : undefined,
      })
    }
  })
  return reservations
}

function buildAllotments(roomTypes: RoomType[]): AllotmentCell[] {
  const days = dateRange(addDays(TODAY, -3), 21)
  const cells: AllotmentCell[] = []
  for (const type of roomTypes) {
    const hotel = HOTELS.find((item) => item.id === type.hotelId)!
    for (const date of days) {
      const weekend = parseInt(date.slice(-2), 10) >= 11 && parseInt(date.slice(-2), 10) <= 13
      const stopSale =
        hotel.status === "Stop sale" ||
        (hotel.id === "side-starlight" && weekend) ||
        (hotel.id === "bodrum-palmea" && date === "2026-09-12")
      cells.push({
        hotelId: hotel.id,
        roomTypeId: type.id,
        date,
        allotted: type.allotment,
        stopSale,
      })
    }
  }
  return cells
}

export function createSeedState(): AppState {
  const roomTypes = buildRoomTypes()
  const rooms = buildRooms(roomTypes)
  return {
    hotels: HOTELS,
    roomTypes,
    rooms,
    reservations: buildReservations(roomTypes, rooms),
    allotments: buildAllotments(roomTypes),
    rates: buildRates(roomTypes),
  }
}
