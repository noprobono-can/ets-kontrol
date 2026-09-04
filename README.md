# ETS Kontrol

ETS Tur’un kontratlı otellerini merkezden yönetmek için Elektraweb tarzında bir kontrol sistemi. Bu depo, ürünün çalışan ilk dilimini ve araştırma notuna dayalı yol haritasını içerir.

Elektraweb bir otel PMS’idir (resepsiyon, POS, kat hizmetleri, kanal yöneticisi). ETS Kontrol onun klonu değildir: otelin tüm odalarını değil, **ETS’ye ayrılmış kontenjanı** yönetir. Tesisler Elektraweb / Opera / Sedna kullanmaya devam eder.

## Yerel çalıştırma

```bash
npm install
npm run dev
```

Tarayıcı: [http://127.0.0.1:4317](http://127.0.0.1:4317)

- `/` ürün özeti
- `/panel` günlük durum, tesisler, blokaj, rezervasyon, kontenjan, fiyat
- `/yol-haritasi` Elektraweb × ETS araştırması ve faz planı

Veri tarayıcıda `localStorage` içindedir. Kenar çubuğundaki **Veriyi sıfırla** seed’e döner. Kimlik doğrulama ve veritabanı yoktur; bu bilinçli bir ilk dilimdir.

## Bu dilimde

| Ekran | Ne yapar |
| --- | --- |
| Günlük durum | Portföy KPI, dikkat listesi, bugünkü girişler |
| Tesisler | Bölge / PMS filtresi, entegrasyon sağlığı |
| Blokaj | Oda × tarih rack, oda atama, check-in / out |
| Rezervasyonlar | Voucher arama, kanal, yeni kayıt |
| Kontenjan | Allotment hücresi, stop sale |
| Kontrat fiyatı | Sezonluk dbl fiyatı |

Görünüm: **ETS merkez** veya **Otel**. Demo tesisler arasında Maxx Royal, Voyage, Caja (grup) ve kontratlı Antalya / Muğla / İstanbul tesisleri vardır.

## Bilinçli olarak yok

Housekeeping, restoran POS, e-fatura, KBS, kapı kilidi, gerçek PMS API’si. Bunlar otel yazılımının işidir; yol haritasında faz 5’e kadar PMS lite bile önerilmez.

## Üretim için sonraki adım

`/yol-haritasi` sayfasındaki faz 2: Elektraweb EtsTourOperator polling’inin yerine webhook, ardından stokun etstur.com / Etscore / Odamax’a yayını.
