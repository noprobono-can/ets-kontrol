import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GAPS = [
  {
    title: "Elektraweb ne?",
    body: "Otellerin kendi ön bürosunu, kat hizmetlerini, POS’unu ve kanal yöneticisini çalıştırdığı bulut PMS. 5.000+ tesis, 30+ yıl, 160 kişilik destek. Angular + Node.",
  },
  {
    title: "ETS bugün ne?",
    body: "Satış tarafı: etstur.com, Odamax, Etscore / Royal API. Oteller Elektraweb’den rezervasyonu polling ile çeker. Merkezin tek ekrandan kontenjan, stop sale ve kontrat kontrolü yok.",
  },
  {
    title: "Doğru ürün",
    body: "Elektraweb’i kopyalamak değil; onun blokaj / kontrat / günlük durum dilimini tur operatörü ölçeğinde yeniden kurmak. Oteller PMS’lerini korur, ETS stoku yönetir.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-svh bg-[#0b1f36] text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-teal-200/80 uppercase">
            Etsgroup
          </p>
          <p className="font-heading text-xl">ETS Kontrol</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/yol-haritasi"
            className={cn(buttonVariants({ variant: "ghost" }), "text-white/80 hover:text-white")}
          >
            Yol haritası
          </Link>
          <Link href="/panel" className={cn(buttonVariants(), "bg-teal-300 text-slate-900 hover:bg-teal-200")}>
            Panele gir
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <p className="text-sm font-medium tracking-wide text-teal-200/90">
          İlk çalışan dilim · Eylül 2026
        </p>
        <h1 className="font-heading mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
          ETS Tur için Elektraweb tarzında tesis kontrolü.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/70">
          Elektraweb otelin kendi yazılımıdır. ETS’nin ihtiyacı, çalıştığı yüzlerce
          tesisi tek merkezden görmek: kontenjan, stop sale, kontrat fiyatı,
          rezervasyon ve blokaj. Bu repo o ürünün kullanılabilir ilk kesitidir.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/panel"
            className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-900 hover:bg-white/90")}
          >
            Demo paneli aç
          </Link>
          <Link
            href="/yol-haritasi"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-white/20 bg-transparent text-white hover:bg-white/10"
            )}
          >
            Nasıl inşa edilir
          </Link>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {GAPS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-white/6 p-5 ring-1 ring-white/10"
            >
              <h2 className="font-heading text-xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-2xl bg-[#f4f1ea] p-6 text-slate-900 sm:p-10">
          <h2 className="font-heading text-3xl">Bu dilimde neler çalışır</h2>
          <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Günlük durum.</strong> 12 tesis, kontenjan doluluk, stop sale,
              bugünkü girişler.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Blokaj.</strong> Oda × tarih ızgarası, oda atama, check-in /
              check-out.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Kontenjan.</strong> Allotment hücresi, stop sale aç/kapa.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Kontrat fiyatı.</strong> Sezonluk dbl fiyatı yerinde düzenleme.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>İki rol.</strong> ETS merkez ve otel kullanıcısı görünümü.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Yol haritası.</strong> PMS kopyalamadan üretime giden fazlar,
              entegrasyon ve riskler.
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
