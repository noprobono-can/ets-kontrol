export const TODAY = "2026-09-04"

export function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function toIso(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function addDays(iso: string, days: number) {
  const date = parseDate(iso)
  date.setDate(date.getDate() + days)
  return toIso(date)
}

export function formatLong(iso: string) {
  return parseDate(iso).toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatShort(iso: string) {
  return parseDate(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  })
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = parseDate(checkIn).getTime()
  const b = parseDate(checkOut).getTime()
  return Math.max(1, Math.round((b - a) / 86_400_000))
}
