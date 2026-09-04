import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PHASES = [
  {
    phase: "1",
    title: "Otel PMS çekirdeği — bu dilim",
    items: [
      "Rezervasyon, blokaj, check-in/out.",
      "Kat hizmeti: temiz / kirli / kontrol / arıza. Çıkış odayı kirliye çeker.",
      "Konaklayanlar, folyo, ekstra posting.",
      "Hedef: 3–5 yıldız, PMS’si olmayan veya Excel ile dönen tesis.",
    ],
  },
  {
    phase: "2",
    title: "Tesis içi operasyon",
    items: [
      "KBS kimlik bildirimi, e-fatura / e-arşiv, konaklama vergisi.",
      "Basit restoran / minibar POS (tek satış noktası, Elektraweb POS değil).",
      "Teknik servis arıza kaydı, oda kapalı (OOO) takvimi.",
    ],
  },
  {
    phase: "3",
    title: "ETS satış omurgası",
    items: [
      "Kontenjan ve fiyatın etstur.com, Odamax, Etscore’a anlık yayını.",
      "Webhook; Elektraweb EtsTourOperator polling’inin yerini alır.",
      "Otel ETS Kontrolden, ETS kanallardan — tek stok.",
    ],
  },
  {
    phase: "4",
    title: "Yayılım",
    items: [
      "Pilot: 10 kontratlı 4 yıldız tesis, düşük sezon.",
      "Eğitim: resepsiyon 1 gün, kat hizmeti 2 saat.",
      "Maxx Royal / Voyage’a dokunma; onların Opera/Elektraweb’i kalsın.",
    ],
  },
]

export default function RoadmapPage() {
  return (
    <div className="min-h-svh bg-[#f4f1ea] text-slate-900">
      <header className="border-b border-black/5 bg-[#0b1f36] text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-heading text-lg">
            ETS Kontrol
          </Link>
          <Link href="/panel" className={cn(buttonVariants(), "bg-teal-300 text-slate-900 hover:bg-teal-200")}>
            Panele dön
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-sm font-medium text-teal-800">Ürün kararı · Eylül 2026</p>
        <h1 className="font-heading mt-3 text-4xl leading-tight">
          ETS, imkânı olmayan otele PMS verir.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Elektraweb 5.000+ tesise satılan tam yığın bir otel programıdır. ETS’nin
          işi onu yeniden yazmak değil; onu alamayan 5 yıldız ve altı otele
          rezervasyondan kat hizmetine kadar çalışan bir sistem vermek. Karşılığında
          operasyon ETS’nin kanallarında görünür kalır.
        </p>

        <h2 className="font-heading mt-12 text-2xl">Neden bu segment?</h2>
        <p className="mt-3 text-slate-700">
          Türkiye’de küçük ve orta tesisin bir kısmı hâlâ PMS’siz veya yalnızca
          kanal yöneticisiyle çalışıyor. Elektraweb / Opera eğitim ve maliyet
          eşiği yüksek. ETS zaten bu otellerle kontratlı: yazılımı vermek hem oteli
          dijitalleştirir hem stoku temizler. Grup tesisleri (Maxx Royal, Voyage,
          Caja) kendi PMS’lerinde kalır.
        </p>

        <h2 className="font-heading mt-12 text-2xl">Kapsam — evet / hayır</h2>
        <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-2">Var</th>
                <th className="px-4 py-2">Yok (bilinçli)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Rezervasyon, blokaj, check-in/out</td>
                <td className="px-4 py-2">800 odalık all-inclusive POS ağı</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Kat hizmeti, arıza, folyo</td>
                <td className="px-4 py-2">SPA, marina, fuar, karbon sertifikası</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">ETS kontenjan ve kontrat fiyatı</td>
                <td className="px-4 py-2">Booking.com kanal yöneticisi (sonra)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-heading mt-12 text-2xl">Fazlar</h2>
        <ol className="mt-4 space-y-4">
          {PHASES.map((item) => (
            <li key={item.phase} className="rounded-xl bg-white p-5 ring-1 ring-foreground/10">
              <p className="text-xs font-medium tracking-wide text-teal-800 uppercase">
                Faz {item.phase}
              </p>
              <h3 className="font-heading mt-1 text-xl">{item.title}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {item.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </article>
    </div>
  )
}
