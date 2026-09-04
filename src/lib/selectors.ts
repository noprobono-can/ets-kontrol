import type { AppState, Reservation } from "./types"
import { staysOn } from "./dates"

const HOLDING: Reservation["status"][] = ["Opsiyon", "Konfirmeli", "Check-in"]

export function hotelOf(state: AppState, hotelId: string) {
  return state.hotels.find((item) => item.id === hotelId)
}

export function roomTypesOf(state: AppState, hotelId: string) {
  return state.roomTypes.filter((item) => item.hotelId === hotelId)
}

export function roomsOf(state: AppState, hotelId: string) {
  return state.rooms.filter((item) => item.hotelId === hotelId)
}

export function reservationsOf(state: AppState, hotelId?: string) {
  return hotelId
    ? state.reservations.filter((item) => item.hotelId === hotelId)
    : state.reservations
}

export function roomTypeById(state: AppState, id: string) {
  return state.roomTypes.find((item) => item.id === id)
}

export function roomById(state: AppState, id: string | null) {
  if (!id) return undefined
  return state.rooms.find((item) => item.id === id)
}

export function activeReservations(items: Reservation[]) {
  return items.filter((item) => HOLDING.includes(item.status))
}

export function soldOn(
  state: AppState,
  hotelId: string,
  roomTypeId: string,
  date: string
) {
  return activeReservations(state.reservations).filter(
    (item) =>
      item.hotelId === hotelId &&
      item.roomTypeId === roomTypeId &&
      staysOn(item.checkIn, item.checkOut, date)
  ).length
}

export function allotmentCell(
  state: AppState,
  hotelId: string,
  roomTypeId: string,
  date: string
) {
  return state.allotments.find(
    (item) =>
      item.hotelId === hotelId &&
      item.roomTypeId === roomTypeId &&
      item.date === date
  )
}

export function hotelAllotmentFill(state: AppState, hotelId: string, date: string) {
  const types = roomTypesOf(state, hotelId)
  let allotted = 0
  let sold = 0
  for (const type of types) {
    const cell = allotmentCell(state, hotelId, type.id, date)
    allotted += cell?.allotted ?? type.allotment
    sold += soldOn(state, hotelId, type.id, date)
  }
  return { allotted, sold, fill: allotted === 0 ? 0 : sold / allotted }
}

export function hotelOccupancy(state: AppState, hotelId: string, date: string) {
  const rooms = roomsOf(state, hotelId)
  const occupied = rooms.filter((room) =>
    activeReservations(state.reservations).some(
      (item) => item.roomId === room.id && staysOn(item.checkIn, item.checkOut, date)
    )
  ).length
  return rooms.length === 0 ? 0 : occupied / rooms.length
}

export function arrivalsOn(state: AppState, date: string, hotelId?: string) {
  return reservationsOf(state, hotelId).filter(
    (item) => item.checkIn === date && HOLDING.includes(item.status)
  )
}

export function inHouseOn(state: AppState, date: string, hotelId?: string) {
  return activeReservations(reservationsOf(state, hotelId)).filter((item) =>
    staysOn(item.checkIn, item.checkOut, date)
  )
}

export function departuresOn(state: AppState, date: string, hotelId?: string) {
  return reservationsOf(state, hotelId).filter(
    (item) => item.checkOut === date && item.status !== "İptal"
  )
}

export function stopSaleCount(state: AppState, date: string, hotelId?: string) {
  return state.allotments.filter(
    (item) =>
      item.date === date &&
      item.stopSale &&
      (!hotelId || item.hotelId === hotelId)
  ).length
}

export function nextVoucher(state: AppState) {
  const max = state.reservations.reduce((acc, item) => {
    const num = Number(item.voucher.replace("ETS", ""))
    return Number.isFinite(num) ? Math.max(acc, num) : acc
  }, 20000)
  return `ETS${max + 1}`
}
