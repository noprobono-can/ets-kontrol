# ETS Kontrol

Yalnızca **ETSTUR otelleri** için otel PMS’i. Resepsiyon odaları, rezervasyonları, giriş-çıkışı ve konaklayan misafirleri yönetir. ETS Merkez aynı veriyi görür ve yeni rezervasyonu durdurabilir.

Bu bir kontenjan / tur operatörü kontrol paneli değildir. Maxx Royal veya Voyage gibi kendi PMS’i olan gruplar kapsam dışıdır.

Canlı site (GitHub Pages): [noprobono-can.github.io/ets-kontrol](https://noprobono-can.github.io/ets-kontrol/)

Kaynak: [github.com/noprobono-can/ets-kontrol](https://github.com/noprobono-can/ets-kontrol)

## Demo

Veri tarayıcıda (`localStorage`) tutulur. Varsayılan tesis **Fethiye Hillside**, gün **4 Eylül 2026**.

- Kirli veya arızalı odaya giriş alınamaz.
- Çıkış odayı kirli işaretler.
- Kaş Mavi Butik, fırtına senaryosuyla yeni rezervasyonu durdurulmuş gelir.
- Üstten **Otel** / **ETS Merkez** rolünü değiştirin.

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

Uygulama `http://127.0.0.1:4521` adresinde açılır.

```bash
npm run build
npm start
```
