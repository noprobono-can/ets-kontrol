"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { TODAY } from "./dates"
import { createSeedState } from "./seed"
import type {
  ActionResult,
  AllotmentCell,
  AppState,
  FolioDepartment,
  FolioItem,
  HousekeepingStatus,
  Reservation,
  Role,
  ViewState,
} from "./types"

const STORAGE_KEY = "ets-kontrol-state-v2"
const VIEW_KEY = "ets-kontrol-view-v2"

type Store = {
  state: AppState
  view: ViewState
  setRole: (role: Role, hotelId?: string) => void
  setHotel: (hotelId: string) => void
  upsertReservation: (reservation: Reservation) => void
  setReservationStatus: (id: string, status: Reservation["status"]) => void
  assignRoom: (reservationId: string, roomId: string | null) => void
  checkIn: (id: string) => ActionResult
  checkOut: (id: string) => ActionResult
  updateRoomHk: (
    roomId: string,
    patch: {
      hkStatus?: HousekeepingStatus
      hkAssignee?: string | null
      hkNote?: string
    }
  ) => void
  addFolio: (
    reservationId: string,
    item: { department: FolioDepartment; description: string; amount: number }
  ) => void
  updateAllotment: (
    hotelId: string,
    roomTypeId: string,
    date: string,
    patch: Partial<Pick<AllotmentCell, "allotted" | "stopSale">>
  ) => void
  updateRate: (id: string, doubleRate: number) => void
  reset: () => void
}

const StoreContext = createContext<Store | null>(null)

const DEFAULT_VIEW: ViewState = { role: "otel", hotelId: "fethiye-hill" }

let memory: AppState | null = null
let viewMemory: ViewState | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function readState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.hotels?.length || !parsed.hkTasks) return createSeedState()
    return parsed
  } catch {
    return createSeedState()
  }
}

function readView(): ViewState {
  try {
    const raw = window.localStorage.getItem(VIEW_KEY)
    if (!raw) return DEFAULT_VIEW
    return JSON.parse(raw) as ViewState
  } catch {
    return DEFAULT_VIEW
  }
}

function getState() {
  if (!memory) memory = readState()
  return memory
}

function getView() {
  if (!viewMemory) viewMemory = readView()
  return viewMemory
}

function persistState(next: AppState) {
  memory = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  emit()
}

function persistView(next: ViewState) {
  viewMemory = next
  window.localStorage.setItem(VIEW_KEY, JSON.stringify(next))
  emit()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getState, createSeedState)
  const view = useSyncExternalStore(subscribe, getView, () => DEFAULT_VIEW)

  const setRole = useCallback((role: Role, hotelId?: string) => {
    persistView({ role, hotelId: hotelId ?? getView().hotelId })
  }, [])

  const setHotel = useCallback((hotelId: string) => {
    persistView({ ...getView(), hotelId })
  }, [])

  const upsertReservation = useCallback((reservation: Reservation) => {
    const current = getState()
    const exists = current.reservations.some((item) => item.id === reservation.id)
    persistState({
      ...current,
      reservations: exists
        ? current.reservations.map((item) =>
            item.id === reservation.id ? reservation : item
          )
        : [reservation, ...current.reservations],
    })
  }, [])

  const setReservationStatus = useCallback(
    (id: string, status: Reservation["status"]) => {
      const current = getState()
      persistState({
        ...current,
        reservations: current.reservations.map((item) =>
          item.id === id ? { ...item, status } : item
        ),
      })
    },
    []
  )

  const assignRoom = useCallback((reservationId: string, roomId: string | null) => {
    const current = getState()
    persistState({
      ...current,
      reservations: current.reservations.map((item) =>
        item.id === reservationId ? { ...item, roomId } : item
      ),
    })
  }, [])

  const checkIn = useCallback((id: string): ActionResult => {
    const current = getState()
    const reservation = current.reservations.find((item) => item.id === id)
    if (!reservation) return { ok: false, reason: "Rezervasyon yok" }
    if (!reservation.roomId) return { ok: false, reason: "Önce oda atayın" }
    const room = current.rooms.find((item) => item.id === reservation.roomId)
    if (!room) return { ok: false, reason: "Oda bulunamadı" }
    if (room.hkStatus === "Arızalı") {
      return { ok: false, reason: "Oda arızalı, check-in yapılamaz" }
    }
    if (room.hkStatus === "Kirli") {
      return { ok: false, reason: "Oda kirli. Kat hizmeti temizlemeden giriş olmaz" }
    }
    persistState({
      ...current,
      reservations: current.reservations.map((item) =>
        item.id === id ? { ...item, status: "Check-in" } : item
      ),
    })
    return { ok: true }
  }, [])

  const checkOut = useCallback((id: string): ActionResult => {
    const current = getState()
    const reservation = current.reservations.find((item) => item.id === id)
    if (!reservation?.roomId) {
      persistState({
        ...current,
        reservations: current.reservations.map((item) =>
          item.id === id ? { ...item, status: "Check-out" } : item
        ),
      })
      return { ok: true }
    }
    const room = current.rooms.find((item) => item.id === reservation.roomId)
    persistState({
      ...current,
      reservations: current.reservations.map((item) =>
        item.id === id ? { ...item, status: "Check-out" } : item
      ),
      rooms: current.rooms.map((item) =>
        item.id === reservation.roomId
          ? { ...item, hkStatus: "Kirli", hkNote: "Çıkış temizliği bekliyor" }
          : item
      ),
      hkTasks: [
        {
          id: `hk-${reservation.roomId}-${Date.now()}`,
          hotelId: reservation.hotelId,
          roomId: reservation.roomId,
          type: "Çıkış temizliği",
          status: "Açık",
          assignee: room?.hkAssignee ?? "Fatma Yıldız",
          due: TODAY,
        },
        ...current.hkTasks,
      ],
    })
    return { ok: true }
  }, [])

  const updateRoomHk = useCallback(
    (
      roomId: string,
      patch: {
        hkStatus?: HousekeepingStatus
        hkAssignee?: string | null
        hkNote?: string
      }
    ) => {
      const current = getState()
      persistState({
        ...current,
        rooms: current.rooms.map((item) =>
          item.id === roomId ? { ...item, ...patch } : item
        ),
        hkTasks: current.hkTasks.map((task) =>
          task.roomId === roomId && patch.hkStatus === "Temiz"
            ? { ...task, status: "Tamam" }
            : task
        ),
      })
    },
    []
  )

  const addFolio = useCallback(
    (
      reservationId: string,
      item: { department: FolioDepartment; description: string; amount: number }
    ) => {
      const current = getState()
      const extra: FolioItem = {
        id: `f-${Date.now()}`,
        reservationId,
        ...item,
      }
      persistState({ ...current, folio: [...current.folio, extra] })
    },
    []
  )

  const updateAllotment = useCallback(
    (
      hotelId: string,
      roomTypeId: string,
      date: string,
      patch: Partial<Pick<AllotmentCell, "allotted" | "stopSale">>
    ) => {
      const current = getState()
      persistState({
        ...current,
        allotments: current.allotments.map((item) =>
          item.hotelId === hotelId &&
          item.roomTypeId === roomTypeId &&
          item.date === date
            ? { ...item, ...patch }
            : item
        ),
      })
    },
    []
  )

  const updateRate = useCallback((id: string, doubleRate: number) => {
    const current = getState()
    persistState({
      ...current,
      rates: current.rates.map((item) =>
        item.id === id ? { ...item, doubleRate } : item
      ),
    })
  }, [])

  const reset = useCallback(() => {
    persistState(createSeedState())
  }, [])

  const value = useMemo<Store>(
    () => ({
      state,
      view,
      setRole,
      setHotel,
      upsertReservation,
      setReservationStatus,
      assignRoom,
      checkIn,
      checkOut,
      updateRoomHk,
      addFolio,
      updateAllotment,
      updateRate,
      reset,
    }),
    [
      state,
      view,
      setRole,
      setHotel,
      upsertReservation,
      setReservationStatus,
      assignRoom,
      checkIn,
      checkOut,
      updateRoomHk,
      addFolio,
      updateAllotment,
      updateRate,
      reset,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error("useStore must be used within StoreProvider")
  return store
}
