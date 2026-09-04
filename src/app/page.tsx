import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[#1b2a4a] text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-orange-300 uppercase">
            ETSTUR
          </p>
          <p className="font-[family-name:var(--font-heading)] text-lg">ETS Kontrol</p>
        </div>
        <Button
          render={<Link href="/pms" />}
          className="bg-orange-500 text-white hover:bg-orange-400"
        >
          Demo paneli aç
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 lg:pt-16">
        <p className="text-sm font-medium text-orange-300">
          Yalnızca ETSTUR otelleri
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl leading-tight sm:text-5xl">
          Oteli ETSTUR işletir. Resepsiyon da, merkez de aynı sistemi kullanır.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          ETS Kontrol, ETSTUR ile çalışan ve kendi PMS’ini alamayan oteller için
          ön büro sistemidir. Oda rafı, rezervasyon, giriş-çıkış, konaklayan
          misafir ve günlük pano otelde çalışır; ETS Merkez aynı gün tüm
          tesisleri görür ve gerekirse yeni rezervasyonu durdurur.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            size="lg"
            render={<Link href="/pms" />}
            className="bg-orange-500 text-white hover:bg-orange-400"
          >
            Fethiye Hillside resepsiyonu
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/pms/oteller" />}
            className="border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            ETS Merkez — otel ağı
          </Button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/5 text-white shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Otel ön büro</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-white/70">
              Bugünün giriş-çıkış listesi, oda durumu, walk-in ve misafir
              kartı. Kirli veya arızalı odaya giriş kapalıdır; çıkış odayı
              kirli işaretler.
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 text-white shadow-none">
            <CardHeader>
              <CardTitle className="text-base">ETS Merkez denetimi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-white/70">
              Sekiz demo tesisin doluluk ve beklenen girişleri tek listede.
              Fırtına, tadilat veya kontenjan dolunca yeni rezervasyon
              durdurulur; içerideki misafir etkilenmez.
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 text-white shadow-none sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Kapsam dışı</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-white/70">
              Tur operatörü kontenjan paneli değil. Maxx Royal, Voyage veya
              Caja gibi kendi Opera/Elektraweb’i olan gruplar bu ürüne
              alınmaz. Bu demo yalnızca ETS otelleridir.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
