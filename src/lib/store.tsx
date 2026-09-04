"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import { TODAY } from "./dates"
import { DEFAULT_HOTEL_ID, createSeedState } from "./seed"
import type { PmsState, Reservation, Role, Room, ViewState } from "./types"

const STATE_KEY = "ets-pms-state-v1"
const VIEW_KEY = "ets-pms-view-v1"

type PmsContextValue = {
  ready: boolean
  state: PmsState
  view: ViewState
  hotel: PmsState["hotels"][number] | undefined
  setRole: (role: Role) => void
  setHotelId: (hotelId: string) => void
  checkIn: (reservationId: string) => void
  checkOut: (reservationId: string) => void
  markNoShow: (reservationId: string) => void
  markRoomClean: (roomId: string) => void
  setNewReservationsClosed: (hotelId: string, closed: boolean) => void
  createWalkIn: (input: {
    guestName: string
    guestCount: number
    nights: number
    roomId: string
  }) => void
  resetDemo: () => void
}

const PmsContext = createContext<PmsContextValue | null>(null)

function loadState(): PmsState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (raw) return JSON.parse(raw) as PmsState
  } catch {
    /* ignore */
  }
  return createSeedState()
}

function loadView(): ViewState {
  try {
    const raw = localStorage.getItem(VIEW_KEY)
    if (raw) return JSON.parse(raw) as ViewState
  } catch {
    /* ignore */
  }
  return { role: "otel", hotelId: DEFAULT_HOTEL_ID }
}

export function PmsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<PmsState>(createSeedState)
  const [view, setView] = useState<ViewState>({
    role: "otel",
    hotelId: DEFAULT_HOTEL_ID,
  })

  useEffect(() => {
    setState(loadState())
    setView(loadView())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
  }, [ready, state])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(VIEW_KEY, JSON.stringify(view))
  }, [ready, view])

  const hotel = state.hotels.find((h) => h.id === view.hotelId)

  const setRole = useCallback((role: Role) => {
    setView((v) => ({ ...v, role }))
  }, [])

  const setHotelId = useCallback((hotelId: string) => {
    setView((v) => ({ ...v, hotelId }))
  }, [])

  const resetDemo = useCallback(() => {
    setState(createSeedState())
    setView({ role: "otel", hotelId: DEFAULT_HOTEL_ID })
    toast.success("Demo verisi sıfırlandı")
  }, [])

  const setNewReservationsClosed = useCallback(
    (hotelId: string, closed: boolean) => {
      setState((prev) => ({
        ...prev,
        hotels: prev.hotels.map((h) =>
          h.id === hotelId ? { ...h, newReservationsClosed: closed } : h
        ),
      }))
      toast.success(
        closed
          ? "Yeni rezervasyon durduruldu. Mevcut girişler devam eder."
          : "Yeni rezervasyon yeniden açıldı."
      )
    },
    []
  )

  const checkIn = useCallback((reservationId: string) => {
    setState((prev) => {
      const reservation = prev.reservations.find((r) => r.id === reservationId)
      if (!reservation || reservation.status !== "bekliyor") {
        toast.error("Bu rezervasyon için giriş yapılamaz.")
        return prev
      }
      if (!reservation.roomId) {
        toast.error("Önce oda atayın.")
        return prev
      }
      const room = prev.rooms.find((r) => r.id === reservation.roomId)
      if (!room) {
        toast.error("Oda bulunamadı.")
        return prev
      }
      if (room.status === "kirli") {
        toast.error("Oda kirli. Kat hizmeti temizlemeden giriş yapılamaz.")
        return prev
      }
      if (room.status === "arizali") {
        toast.error("Oda arızalı. Giriş yapılamaz.")
        return prev
      }
      if (room.status === "dolu") {
        toast.error("Oda dolu.")
        return prev
      }
      toast.success(`${reservation.guestName} giriş yaptı · oda ${room.number}`)
      return {
        ...prev,
        rooms: prev.rooms.map((r) =>
          r.id === room.id ? { ...r, status: "dolu" } : r
        ),
        reservations: prev.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "iceri" } : r
        ),
      }
    })
  }, [])

  const checkOut = useCallback((reservationId: string) => {
    setState((prev) => {
      const reservation = prev.reservations.find((r) => r.id === reservationId)
      if (!reservation || reservation.status !== "iceri") {
        toast.error("Bu rezervasyon için çıkış yapılamaz.")
        return prev
      }
      toast.success(`${reservation.guestName} çıkış yaptı. Oda kirli olarak işaretlendi.`)
      return {
        ...prev,
        rooms: prev.rooms.map((r) =>
          r.id === reservation.roomId ? { ...r, status: "kirli" } : r
        ),
        reservations: prev.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "cikti" } : r
        ),
      }
    })
  }, [])

  const markNoShow = useCallback((reservationId: string) => {
    setState((prev) => {
      const reservation = prev.reservations.find((r) => r.id === reservationId)
      if (!reservation || reservation.status !== "bekliyor") {
        toast.error("Sadece beklenen rezervasyon gelmedi işaretlenebilir.")
        return prev
      }
      toast.message(`${reservation.guestName} gelmedi olarak işlendi.`)
      return {
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "no-show" } : r
        ),
      }
    })
  }, [])

  const markRoomClean = useCallback((roomId: string) => {
    setState((prev) => {
      const room = prev.rooms.find((r) => r.id === roomId)
      if (!room) return prev
      if (room.status === "dolu") {
        toast.error("Dolu oda temizlenemez. Önce çıkış alın.")
        return prev
      }
      toast.success(`Oda ${room.number} temiz · satışa açık`)
      return {
        ...prev,
        rooms: prev.rooms.map((r) =>
          r.id === roomId ? { ...r, status: "bos" } : r
        ),
      }
    })
  }, [])

  const createWalkIn = useCallback(
    (input: {
      guestName: string
      guestCount: number
      nights: number
      roomId: string
    }) => {
      setState((prev) => {
        const hotel = prev.hotels.find((h) => h.id === view.hotelId)
        if (!hotel) return prev
        if (hotel.newReservationsClosed) {
          toast.error(
            "ETS Merkez bu otelde yeni rezervasyonu durdurdu. Walk-in alınamaz."
          )
          return prev
        }
        const room = prev.rooms.find((r) => r.id === input.roomId)
        if (!room || room.hotelId !== hotel.id) {
          toast.error("Oda seçin.")
          return prev
        }
        if (room.status !== "bos") {
          toast.error("Sadece boş odaya walk-in yazılır.")
          return prev
        }
        const reservation: Reservation = {
          id: `rsv-walk-${Date.now()}`,
          hotelId: hotel.id,
          confirmationNo: `ETS-WI-${String(Date.now()).slice(-6)}`,
          guestName: input.guestName.trim(),
          guestCount: input.guestCount,
          nationality: "TR",
          checkIn: TODAY,
          checkOut: addDaysSafe(input.nights),
          roomId: room.id,
          roomType: room.type,
          source: "resepsiyon",
          status: "bekliyor",
        }
        toast.success("Walk-in kaydı açıldı. Girişi şimdi alabilirsiniz.")
        return { ...prev, reservations: [...prev.reservations, reservation] }
      })
    },
    [view.hotelId]
  )

  const value = useMemo(
    () => ({
      ready,
      state,
      view,
      hotel,
      setRole,
      setHotelId,
      checkIn,
      checkOut,
      markNoShow,
      markRoomClean,
      setNewReservationsClosed,
      createWalkIn,
      resetDemo,
    }),
    [
      ready,
      state,
      view,
      hotel,
      setRole,
      setHotelId,
      checkIn,
      checkOut,
      markNoShow,
      markRoomClean,
      setNewReservationsClosed,
      createWalkIn,
      resetDemo,
    ]
  )

  return <PmsContext.Provider value={value}>{children}</PmsContext.Provider>
}

function addDaysSafe(nights: number) {
  const [y, m, d] = TODAY.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + nights)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

export function usePms() {
  const ctx = useContext(PmsContext)
  if (!ctx) throw new Error("usePms must be used inside PmsProvider")
  return ctx
}

export function roomsForHotel(rooms: Room[], hotelId: string) {
  return rooms.filter((r) => r.hotelId === hotelId)
}

export function reservationsForHotel(
  reservations: Reservation[],
  hotelId: string
) {
  return reservations.filter((r) => r.hotelId === hotelId)
}
