import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PHASES = [
  {
    phase: "0",
    title: "Keşif ve ürün sınırı",
    items: [
      "ETS iç ekipler: kontrat, gelir yönetimi, çağrı merkezi, otel ilişkileri, Etscore.",
      "Mevcut Royal API, rezervasyon çekme (REZTIME / polling) ve PMS eşleme süreçlerini haritalayın.",
      "Kapsamı kilitleyin: kontenjan + rezervasyon + fiyat. Housekeeping, POS, e-fatura, KBS yok.",
    ],
  },
  {
    phase: "1",
    title: "Bu dilim — merkez kontrol paneli",
    items: [
      "Tesis master data, oda tipleri, kontrat tipi, PMS ve entegrasyon durumu.",
      "Blokaj, rezervasyon, kontenjan/stop sale, kontrat fiyatı.",
      "ETS merkez ve otel kullanıcısı rolleri. Demo verisiyle uçtan uca iş akışı.",
    ],
  },
  {
    phase: "2",
    title: "Entegrasyon omurgası",
    items: [
      "Webhook öncelikli, polling yedekli rezervasyon alışverişi. Elektraweb EtsTourOperator’ın yerini alın.",
      "Elektraweb, Opera Cloud, Sedna, HotelRunner için oda tipi / pansiyon / fiyat kodu eşleme.",
      "Değişiklikleri etstur.com, Odamax ve Etscore stokuna aynı anda yayınlayan stok servisi.",
    ],
  },
  {
    phase: "3",
    title: "Kontrat ve gelir",
    items: [
      "Garanti oda, allotment, serbest satış, release period, CTA/CTD.",
      "Sezon, çocuk yaş bandı, erken rezervasyon ve market bazlı fiyat.",
      "Overbooking kuralı, kanal önceliği, stop sale onayı.",
    ],
  },
  {
    phase: "4",
    title: "Operasyon ve uyum",
    items: [
      "Voucher, değişiklik, iptal, no-show, no-show cezası.",
      "Otel extranet (kendi kontenjanını güncelleyen tesis) ve onay kuyruğu.",
      "KVKK, PCI (kart tokene), denetim logu, yetki matrisi.",
    ],
  },
  {
    phase: "5",
    title: "Ölçek — PMS değil, platform",
    items: [
      "Grup tesisleri (Maxx Royal, Voyage, Caja) için derin PMS entegrasyonu.",
      "Dinamik fiyat önerisi, rakip tarama — Elektraweb Rate Manager’ın ETS karşılığı.",
      "Tam otel PMS’i ancak PMS’si olmayan küçük tesislere lite olarak; asla 30 yıllık ürünü baştan yazmayın.",
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
        <p className="text-sm font-medium text-teal-800">Araştırma notu · Eylül 2026</p>
        <h1 className="font-heading mt-3 text-4xl leading-tight">
          Elektraweb kopyalanmaz. ETS için yeniden konumlandırılır.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Amaç, ETS Tur’un bünyesinde çalıştığı otelleri kontrol etmek. Bunun için
          otelin resepsiyon yazılımını yeniden yazmak gerekmez; stok, kontrat ve
          rezervasyonun tek kaynağı olmak gerekir.
        </p>

        <h2 className="font-heading mt-12 text-2xl">Elektraweb ne işe yarar?</h2>
        <p className="mt-3 text-slate-700">
          elektraweb.com bir otel PMS’idir: rezervasyon, check-in/out, folyo, blokaj,
          kat hizmetleri, POS, ön muhasebe, CRM, kanal yöneticisi, online rezervasyon
          motoru, acente kontratı, KBS kimlik bildirimi, e-fatura. Bulut, tarayıcı,
          mobil. Firma 5.000+ referans, 4 kıta, 7/24 destek ve üniversite müfredatı
          iddiasındadır. Teknoloji: Angular, Node.js. Fiyat: oda/modül aboneliği,
          kanal yöneticisi pakete dahil.
        </p>
        <p className="mt-3 text-slate-700">
          ETS zaten bu dünyanın içinde: Elektraweb yardım belgelerinde
          <strong> EtsTourOperator </strong>
          kurulumu var. Tesis operatör ID, kullanıcı kodu ve şifre girer; rezervasyonları
          çeker; oda tipi / fiyat / pansiyon / acente kartını eşler. Kullanıcı kodu 2
          boşsa <code>REZTIME</code> önerilir — yani bugün bağ çekme (polling) ile
          çalışıyor, anlık push ile değil.
        </p>

        <h2 className="font-heading mt-12 text-2xl">ETS Tur bugün nerede?</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          <li>
            <strong>Etsgroup</strong> (1991): Etstur, Didimtur, Ucuzabilet, Otelpuan,
            HotelAgent, Etscore, Etsevent. Kendi tesisleri: Maxx Royal, Voyage, Caja.
          </li>
          <li>
            <strong>Etstur</strong> yurt içinde binlerce otelin satışını yapar.
            Odamax ~200 bin küresel tesis. Etscore B2B: Türkiye’de 10.000+ direkt
            kontrat, 1M+ global envanter.
          </li>
          <li>
            <strong>Royal API</strong> (docs.etscore.com): auth, içerik, otel listesi,
            arama, oda arama, rezervasyon, iptal. Bu, satış API’sidir; otel
            extraneti değildir.
          </li>
          <li>
            <strong>HotelAgent</strong> otellere çağrı merkezi ve dijital pazarlama
            satar; tesis kontrol yazılımı değildir.
          </li>
          <li>
            İç teknoloji izleri: Java/Spring, React, PostgreSQL, Docker. Satış
            yığını hazır; otel-of-record yığını eksik.
          </li>
        </ul>

        <h2 className="font-heading mt-12 text-2xl">Kritik ayrım</h2>
        <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-2">Katman</th>
                <th className="px-4 py-2">Elektraweb</th>
                <th className="px-4 py-2">ETS Kontrol</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Kullanıcı</td>
                <td className="px-4 py-2">Otel resepsiyonu</td>
                <td className="px-4 py-2">ETS kontrat + gelir + otel partneri</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Envanter</td>
                <td className="px-4 py-2">Tüm odalar</td>
                <td className="px-4 py-2">Sadece kontratlı kontenjan</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Check-in / POS / KBS</td>
                <td className="px-4 py-2">Zorunlu</td>
                <td className="px-4 py-2">İlk yılda yok</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Kanal</td>
                <td className="px-4 py-2">Booking, Expedia, ETS…</td>
                <td className="px-4 py-2">etstur.com, Etscore, Odamax</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-700">
          Tam PMS klonu: onlarca yıl, 100+ kişi, otellerin mevcut Elektraweb/Opera
          kurulumunu sökme savaşı. ETS’nin kazanacağı yer, otelin PMS’ine rakip
          olmak değil; PMS’lerin bağlandığı <em>kaynak sistem</em> olmak.
        </p>

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

        <h2 className="font-heading mt-12 text-2xl">Mimari öneri</h2>
        <p className="mt-3 text-slate-700">
          Çekirdek: tesis, oda tipi, kontenjan hücresi, fiyat planı, rezervasyon.
          Etrafında: PMS bağdaştırıcıları (Elektraweb önce; hacim burada), stok
          yayın servisi (Royal API + OTA siteleri), partner extranet, yetki ve
          audit. Türkiye’ye özgü KBS / e-fatura otel PMS’inde kalsın; ETS tarafında
          voucher ve faturalama cari hesap yeter.
        </p>
        <p className="mt-3 text-slate-700">
          Rakipler: Sedna (resort + tur operatörü kontratı), HotelRunner (kanal),
          Opera (zincir standardı). ETS’nin avantajı envanterin zaten kendisinde
          olması — yazılım eksik olan parça.
        </p>

        <h2 className="font-heading mt-12 text-2xl">Riskler</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          <li>Kapsam şişmesi: POS ve kat hizmeti eklemek projeyi Elektraweb yarışına sokar.</li>
          <li>Eşleme kalitesi: yanlış oda tipi overbooking üretir. İlk müşteri Elektraweb otelleri olmalı.</li>
          <li>Polling alışkanlığı: oteller EXE tarayıcı kullanıyor. Webhook’a geçiş eğitim ister.</li>
          <li>Çift stok: PMS ve ETS aynı anda satarsa. Tek kaynak kuralı yazılı olmalı.</li>
        </ul>

        <p className="mt-10 text-sm text-slate-500">
          Kaynaklar: elektraweb.com, elektraotel.com, Elektraweb yardım (EtsTourOperator,
          kontrat, stop sale), etsgroup.com.tr, etscore.com, docs.etscore.com, hotelagent.com,
          Türkiye PMS karşılaştırmaları 2026.
        </p>
      </article>
    </div>
  )
}
