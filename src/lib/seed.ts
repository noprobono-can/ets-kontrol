import { addDays, TODAY } from "./dates"
import type { Hotel, PmsState, Reservation, Room, RoomType } from "./types"

const HOTELS: Hotel[] = [
  {
    id: "fethiye-hill",
    name: "Fethiye Hillside",
    city: "Fethiye",
    region: "Muğla",
    stars: 4,
    phone: "0252 614 00 11",
    newReservationsClosed: false,
  },
  {
    id: "alanya-coral",
    name: "Alanya Coral Bay",
    city: "Alanya",
    region: "Antalya",
    stars: 4,
    phone: "0242 513 44 20",
    newReservationsClosed: false,
  },
  {
    id: "cesme-marina",
    name: "Çeşme Marina",
    city: "Çeşme",
    region: "İzmir",
    stars: 4,
    phone: "0232 712 90 40",
    newReservationsClosed: false,
  },
  {
    id: "kapadokya-cave",
    name: "Kapadokya Cave Lodge",
    city: "Ürgüp",
    region: "Nevşehir",
    stars: 3,
    phone: "0384 341 22 08",
    newReservationsClosed: false,
  },
  {
    id: "kas-mavi",
    name: "Kaş Mavi Butik",
    city: "Kaş",
    region: "Antalya",
    stars: 3,
    phone: "0242 836 11 70",
    newReservationsClosed: true,
  },
  {
    id: "pamukkale-thermal",
    name: "Pamukkale Thermal",
    city: "Pamukkale",
    region: "Denizli",
    stars: 4,
    phone: "0258 272 30 15",
    newReservationsClosed: false,
  },
  {
    id: "side-palmiye",
    name: "Side Palmiye",
    city: "Side",
    region: "Antalya",
    stars: 5,
    phone: "0242 753 18 00",
    newReservationsClosed: false,
  },
  {
    id: "kusadasi-ege",
    name: "Kuşadası Ege Suites",
    city: "Kuşadası",
    region: "Aydın",
    stars: 4,
    phone: "0256 614 55 30",
    newReservationsClosed: false,
  },
]

const ROOM_LAYOUT: { number: string; type: RoomType; floor: number }[] = [
  { number: "101", type: "standart", floor: 1 },
  { number: "102", type: "standart", floor: 1 },
  { number: "103", type: "standart", floor: 1 },
  { number: "104", type: "deniz", floor: 1 },
  { number: "105", type: "deniz", floor: 1 },
  { number: "106", type: "suit", floor: 1 },
  { number: "201", type: "standart", floor: 2 },
  { number: "202", type: "standart", floor: 2 },
  { number: "203", type: "deniz", floor: 2 },
  { number: "204", type: "deniz", floor: 2 },
  { number: "205", type: "suit", floor: 2 },
  { number: "301", type: "standart", floor: 3 },
  { number: "302", type: "deniz", floor: 3 },
  { number: "303", type: "deniz", floor: 3 },
  { number: "304", type: "suit", floor: 3 },
]

type Stay = {
  guestName: string
  guestCount: number
  nationality: string
  inOff: number
  outOff: number
  roomNumber: string
  source: Reservation["source"]
  status: Reservation["status"]
  note?: string
}

const STAYS: Record<string, Stay[]> = {
  "fethiye-hill": [
    {
      guestName: "Ayşe & Kemal Demir",
      guestCount: 2,
      nationality: "TR",
      inOff: -2,
      outOff: 3,
      roomNumber: "203",
      source: "etstur.com",
      status: "iceri",
    },
    {
      guestName: "Lena Hoffmann",
      guestCount: 1,
      nationality: "DE",
      inOff: -1,
      outOff: 4,
      roomNumber: "104",
      source: "etstur.com",
      status: "iceri",
    },
    {
      guestName: "Mehmet Yıldız ailesi",
      guestCount: 3,
      nationality: "TR",
      inOff: 0,
      outOff: 5,
      roomNumber: "205",
      source: "etstur.com",
      status: "bekliyor",
    },
    {
      guestName: "James Whitaker",
      guestCount: 2,
      nationality: "GB",
      inOff: 0,
      outOff: 2,
      roomNumber: "302",
      source: "ets-merkez",
      status: "bekliyor",
    },
    {
      guestName: "Selin Arslan",
      guestCount: 1,
      nationality: "TR",
      inOff: -3,
      outOff: 0,
      roomNumber: "102",
      source: "resepsiyon",
      status: "iceri",
    },
    {
      guestName: "Piotr Kowalski",
      guestCount: 2,
      nationality: "PL",
      inOff: 1,
      outOff: 6,
      roomNumber: "303",
      source: "etstur.com",
      status: "bekliyor",
    },
  ],
  "alanya-coral": [
    {
      guestName: "Fatma Koç",
      guestCount: 2,
      nationality: "TR",
      inOff: -1,
      outOff: 2,
      roomNumber: "201",
      source: "etstur.com",
      status: "iceri",
    },
    {
      guestName: "Anna Berg",
      guestCount: 2,
      nationality: "SE",
      inOff: 0,
      outOff: 7,
      roomNumber: "106",
      source: "etstur.com",
      status: "bekliyor",
    },
    {
      guestName: "Hakan Özdemir",
      guestCount: 4,
      nationality: "TR",
      inOff: -4,
      outOff: 0,
      roomNumber: "304",
      source: "resepsiyon",
      status: "iceri",
    },
  ],
  "cesme-marina": [
    {
      guestName: "Ece & Can Aydın",
      guestCount: 2,
      nationality: "TR",
      inOff: 0,
      outOff: 3,
      roomNumber: "105",
      source: "etstur.com",
      status: "bekliyor",
    },
    {
      guestName: "Marco Rossi",
      guestCount: 2,
      nationality: "IT",
      inOff: -2,
      outOff: 1,
      roomNumber: "204",
      source: "etstur.com",
      status: "iceri",
    },
  ],
  "kapadokya-cave": [
    {
      guestName: "Claire Dubois",
      guestCount: 2,
      nationality: "FR",
      inOff: -1,
      outOff: 2,
      roomNumber: "101",
      source: "etstur.com",
      status: "iceri",
    },
    {
      guestName: "Burak Şahin",
      guestCount: 2,
      nationality: "TR",
      inOff: 0,
      outOff: 1,
      roomNumber: "202",
      source: "ets-merkez",
      status: "bekliyor",
    },
  ],
  "kas-mavi": [
    {
      guestName: "Nilüfer Kaya",
      guestCount: 1,
      nationality: "TR",
      inOff: -3,
      outOff: 1,
      roomNumber: "103",
      source: "etstur.com",
      status: "iceri",
      note: "Fırtına uyarısı — ETS yeni rezervasyonu durdurdu",
    },
  ],
  "pamukkale-thermal": [
    {
      guestName: "Hans Müller",
      guestCount: 2,
      nationality: "DE",
      inOff: 0,
      outOff: 4,
      roomNumber: "205",
      source: "etstur.com",
      status: "bekliyor",
    },
    {
      guestName: "Zeynep Aksoy",
      guestCount: 2,
      nationality: "TR",
      inOff: -2,
      outOff: 3,
      roomNumber: "104",
      source: "resepsiyon",
      status: "iceri",
    },
  ],
  "side-palmiye": [
    {
      guestName: "Olivia Grant",
      guestCount: 2,
      nationality: "GB",
      inOff: -1,
      outOff: 6,
      roomNumber: "304",
      source: "etstur.com",
      status: "iceri",
    },
    {
      guestName: "Emre Çelik ailesi",
      guestCount: 4,
      nationality: "TR",
      inOff: 0,
      outOff: 7,
      roomNumber: "106",
      source: "ets-merkez",
      status: "bekliyor",
    },
    {
      guestName: "Sofia Nielsen",
      guestCount: 2,
      nationality: "DK",
      inOff: -5,
      outOff: 0,
      roomNumber: "203",
      source: "etstur.com",
      status: "iceri",
    },
  ],
  "kusadasi-ege": [
    {
      guestName: "Ahmet Kara",
      guestCount: 2,
      nationality: "TR",
      inOff: 0,
      outOff: 2,
      roomNumber: "102",
      source: "etstur.com",
      status: "bekliyor",
    },
  ],
}

let seq = 1000

function nextId(prefix: string) {
  seq += 1
  return `${prefix}-${seq}`
}

function confirmation(hotelId: string, n: number) {
  const code = hotelId.slice(0, 3).toUpperCase()
  return `ETS-${code}-${String(24000 + n)}`
}

export function createSeedState(): PmsState {
  const rooms: Room[] = []
  const reservations: Reservation[] = []

  for (const hotel of HOTELS) {
    const hotelRooms: Room[] = ROOM_LAYOUT.map((layout) => ({
      id: `${hotel.id}-${layout.number}`,
      hotelId: hotel.id,
      number: layout.number,
      type: layout.type,
      floor: layout.floor,
      status: "bos",
    }))

    const stays = STAYS[hotel.id] ?? []
    stays.forEach((stay, index) => {
      const room = hotelRooms.find((r) => r.number === stay.roomNumber)
      if (!room) return
      const checkIn = addDays(TODAY, stay.inOff)
      const checkOut = addDays(TODAY, stay.outOff)
      reservations.push({
        id: nextId("rsv"),
        hotelId: hotel.id,
        confirmationNo: confirmation(hotel.id, index + 1),
        guestName: stay.guestName,
        guestCount: stay.guestCount,
        nationality: stay.nationality,
        checkIn,
        checkOut,
        roomId: room.id,
        roomType: room.type,
        source: stay.source,
        status: stay.status,
        note: stay.note,
      })
      if (stay.status === "iceri") {
        room.status = "dolu"
      }
    })

    if (hotel.id === "fethiye-hill") {
      const dirty = hotelRooms.find((r) => r.number === "101")
      const ooo = hotelRooms.find((r) => r.number === "301")
      if (dirty) dirty.status = "kirli"
      if (ooo) ooo.status = "arizali"
    }

    rooms.push(...hotelRooms)
  }

  return { hotels: HOTELS, rooms, reservations }
}

export const DEFAULT_HOTEL_ID = "fethiye-hill"
