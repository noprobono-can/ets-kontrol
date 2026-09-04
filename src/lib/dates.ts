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

export function diffDays(from: string, to: string) {
  const a = parseDate(from).getTime()
  const b = parseDate(to).getTime()
  return Math.round((b - a) / 86_400_000)
}

export function dateRange(from: string, days: number) {
  return Array.from({ length: days }, (_, i) => addDays(from, i))
}

export function overlaps(checkIn: string, checkOut: string, day: string) {
  return day >= checkIn && day < checkOut
}

export function staysOn(checkIn: string, checkOut: string, day: string) {
  return overlaps(checkIn, checkOut, day)
}

export function formatDay(iso: string) {
  return parseDate(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  })
}

export function formatWeekday(iso: string) {
  return parseDate(iso).toLocaleDateString("tr-TR", { weekday: "short" })
}

export function formatLong(iso: string) {
  return parseDate(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatMoney(amount: number, currency: "EUR" | "TRY" = "EUR") {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
