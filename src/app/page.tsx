import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GAPS = [
  {
    title: "Kime?",
    body: "Elektraweb / Opera alamayan 3, 4 ve 5 yıldız oteller. Excel ve defterle dönen tesisler. ETS’nin kontratlı partnerleri öncelikli.",
  },
  {
    title: "Ne?",
    body: "Otelin kendi PMS’i: rezervasyon, blokaj, check-in/out, kat hizmeti, folyo. ETS merkez aynı veriyi görür.",
  },
  {
    title: "Neden ETS?",
    body: "Yazılım ücretsiz/ucuz verilir, stok etstur.com ve Etscore’a akar. Otel operasyonu kazanınca ETS de satışını kontrol eder.",
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
          Otel PMS’i · ilk dilim
        </p>
        <h1 className="font-heading mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
          İmkânı olmayan otele, Elektraweb kadar sistem.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/70">
          ETS Tur, 5 yıldız ve altı tesislere kendi bünyesinde bir otel yönetim
          sistemi verir. Rezervasyondan kat hizmetine, folyodan kontenjana kadar
          günlük operasyon bu panelde yürür. Opera ve Elektraweb’i kopyalamıyoruz;
          onların ulaşamadığı otele gidiyoruz.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/panel"
            className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-900 hover:bg-white/90")}
          >
            Otel panelini aç
          </Link>
          <Link
            href="/panel/kat-hizmetleri"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-white/20 bg-transparent text-white hover:bg-white/10"
            )}
          >
            Kat hizmetleri
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
          <h2 className="font-heading text-3xl">Bu dilimde otel ne yapar</h2>
          <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Blokaj.</strong> Oda rack, check-in. Kirli odaya giriş yok.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Kat hizmetleri.</strong> Temiz / kirli / kontrol / arıza, görevli atama.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Konaklayanlar.</strong> Folyo, minibar posting, check-out odayı kirliye alır.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Rezervasyon.</strong> Walk-in, etstur.com, Etscore, çağrı merkezi.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>Kontenjan ve fiyat.</strong> ETS satış kanallarına açılan stok.
            </li>
            <li className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <strong>İki rol.</strong> Otel resepsiyonu ve ETS merkez aynı veriyi görür.
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
