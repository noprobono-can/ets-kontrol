import { Badge } from "@/components/ui/badge"
import { roomStatusLabel, reservationStatusLabel } from "@/lib/labels"
import type { ReservationStatus, RoomStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const roomTone: Record<RoomStatus, string> = {
  bos: "bg-emerald-50 text-emerald-800 border-emerald-200",
  dolu: "bg-sky-50 text-sky-900 border-sky-200",
  kirli: "bg-amber-50 text-amber-900 border-amber-200",
  arizali: "bg-rose-50 text-rose-900 border-rose-200",
}

const resTone: Record<ReservationStatus, string> = {
  bekliyor: "bg-orange-50 text-orange-900 border-orange-200",
  iceri: "bg-sky-50 text-sky-900 border-sky-200",
  cikti: "bg-zinc-100 text-zinc-700 border-zinc-200",
  iptal: "bg-zinc-100 text-zinc-500 border-zinc-200",
  "no-show": "bg-rose-50 text-rose-800 border-rose-200",
}

export function RoomBadge({ status }: { status: RoomStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", roomTone[status])}>
      {roomStatusLabel[status]}
    </Badge>
  )
}

export function ReservationBadge({ status }: { status: ReservationStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", resTone[status])}>
      {reservationStatusLabel[status]}
    </Badge>
  )
}
