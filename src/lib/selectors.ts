import { TODAY } from "./dates"
import type { Hotel, Reservation, Room } from "./types"

export function occupancy(rooms: Room[]) {
  const sellable = rooms.filter((r) => r.status !== "arizali")
  const occupied = rooms.filter((r) => r.status === "dolu").length
  const pct = sellable.length === 0 ? 0 : Math.round((occupied / sellable.length) * 100)
  return { occupied, sellable: sellable.length, total: rooms.length, pct }
}

export function arrivalsToday(reservations: Reservation[]) {
  return reservations.filter(
    (r) => r.checkIn === TODAY && (r.status === "bekliyor" || r.status === "iceri")
  )
}

export function departuresToday(reservations: Reservation[]) {
  return reservations.filter(
    (r) => r.checkOut === TODAY && (r.status === "iceri" || r.status === "cikti")
  )
}

export function inHouse(reservations: Reservation[]) {
  return reservations.filter((r) => r.status === "iceri")
}

export function pendingArrivals(reservations: Reservation[]) {
  return reservations.filter((r) => r.checkIn === TODAY && r.status === "bekliyor")
}

export function hotelSummary(
  hotel: Hotel,
  rooms: Room[],
  reservations: Reservation[]
) {
  const hotelRooms = rooms.filter((r) => r.hotelId === hotel.id)
  const hotelRes = reservations.filter((r) => r.hotelId === hotel.id)
  const occ = occupancy(hotelRooms)
  return {
    hotel,
    ...occ,
    arrivals: pendingArrivals(hotelRes).length,
    departures: hotelRes.filter((r) => r.checkOut === TODAY && r.status === "iceri")
      .length,
    inHouse: inHouse(hotelRes).length,
    dirty: hotelRooms.filter((r) => r.status === "kirli").length,
  }
}
