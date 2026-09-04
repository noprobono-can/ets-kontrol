import { Badge } from "@/components/ui/badge"
import type { Hotel, Integration, ReservationStatus } from "@/lib/types"

export function StatusBadge({ status }: { status: Hotel["status"] }) {
  if (status === "Aktif") {
    return <Badge className="bg-teal-700/15 text-teal-800">{status}</Badge>
  }
  if (status === "Stop sale") {
    return <Badge variant="destructive">{status}</Badge>
  }
  return <Badge variant="secondary">{status}</Badge>
}

export function IntegrationBadge({ value }: { value: Integration }) {
  if (value === "Çift yönlü") {
    return <Badge className="bg-teal-700/15 text-teal-800">{value}</Badge>
  }
  if (value === "Polling") {
    return <Badge className="bg-amber-500/15 text-amber-800">{value}</Badge>
  }
  return <Badge variant="destructive">{value}</Badge>
}

export function ReservationBadge({ status }: { status: ReservationStatus }) {
  const map: Record<ReservationStatus, string> = {
    Opsiyon: "bg-amber-500/15 text-amber-800",
    Konfirmeli: "bg-sky-600/15 text-sky-800",
    "Check-in": "bg-teal-700/15 text-teal-800",
    "Check-out": "bg-slate-500/15 text-slate-700",
    İptal: "bg-destructive/10 text-destructive",
    "No-show": "bg-destructive/10 text-destructive",
  }
  return <Badge className={map[status]}>{status}</Badge>
}

export function ChannelBadge({ channel }: { channel: string }) {
  return <Badge variant="outline">{channel}</Badge>
}
