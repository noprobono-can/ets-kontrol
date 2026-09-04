# ETS Kontrol

ETS Tur’un, Elektraweb / Opera alamayan **5 yıldız ve altı** otellere verdiği otel yönetim sistemi (PMS). Rezervasyon, blokaj, check-in/out, kat hizmeti ve folyo aynı panelde.

Grup tesisleri (Maxx Royal, Voyage, Caja) kendi PMS’lerinde kalır. Bu ürün, Excel veya yalnızca kanal yöneticisiyle dönen kontratlı oteller içindir.

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcı varsayılanı: `http://127.0.0.1:4317`

| Yol | Ne işe yarar |
| --- | --- |
| `/` | Ürün özeti |
| `/panel` | Günlük durum (otel veya ETS merkez) |
| `/panel/blokaj` | Oda rack, check-in (kirli odaya giriş yok) |
| `/panel/kat-hizmetleri` | Temiz / kirli / kontrol / arıza |
| `/panel/konaklayanlar` | Folyo, ekstra, check-out |
| `/panel/rezervasyonlar` | Voucher ve kanal |
| `/yol-haritasi` | Faz planı |

Demo veri `localStorage` içindedir. Kenar çubuğundan **Otel** görünümü Fethiye Hillside ile açılır. **Veriyi sıfırla** seed’e döner.

## Bilinçli olarak yok

Çoklu restoran POS, SPA, KBS, e-fatura, kapı kilidi. Sonraki fazlar `/yol-haritasi` sayfasında.
