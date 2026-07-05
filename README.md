# Ruhsat360 — Tanıtım Web Sitesi

Mimarlık ofisleri için dijital proje, evrak ve ruhsat takip sistemi
[Ruhsat360](https://github.com/aligokten/Mimarl-k-Dosya-Takip)'ın tanıtım,
pazarlama ve satış sitesi. Statik HTML/CSS/JS — GitHub Pages ile yayınlanır.

## Yapı

- `index.html` — ana sayfa (hero, özellikler, nasıl çalışır, fiyatlandırma, danışmanlık, SSS, iletişim)
- `gizlilik.html`, `kullanim-sartlari.html` — yasal sayfalar
- `css/style.css` — koyu tema + turuncu glow tasarım sistemi
- `js/main.js` — scroll animasyonları, mobil menü, SSS akordiyonu, iletişim formu
- `assets/` — logo ve ikon dosyaları
- `CNAME` — özel alan adı (ruhsat360.com)

## Yayınlama (GitHub Pages)

1. GitHub → Settings → Pages → "Deploy from a branch" seçin.
2. Branch olarak bu dalı (veya main'e merge ettikten sonra `main`) ve `/ (root)` klasörünü seçin.
3. Alan adı bağlamak için: Settings → Pages → Custom domain kısmına `ruhsat360.com` yazın,
   DNS sağlayıcınızda `A` kayıtlarını GitHub Pages IP'lerine
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) yönlendirin
   ve `www` için `aligokten.github.io` CNAME kaydı ekleyin.
4. "Enforce HTTPS" seçeneğini işaretleyin.

> Not: Fiyatlar yer tutucudur; `index.html` içinde gerçek rakamlarla güncelleyin.
