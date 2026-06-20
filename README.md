# FizikLab — fizika kalkulyatori + bepul AI yechuvchi

Aniq hisoblaydigan fizika ilovasi. O'quvchi masalasini **yozadi yoki rasmga oladi** —
ilova javob + to'liq yechim (shpargalka) chiqaradi. Javob ustiga bosilsa yechilishi ko'rinadi.

## Bo'limlar
- **Yechuvchi (AI)** — masala yozasiz yoki rasm olasiz → javob + qadam-baqadam yechim.
- **Hisob** — 28 ta formula bo'yicha aniq hisob (internetsiz ham ishlaydi).
- **Misollar, Formula, Asbob** (Grafik, Konvertor, Doimiylar) — internetsiz ishlaydi.

## AI yechuvchi qanday bepul ishlaydi
Ikki bepul usul ketma-ket ishlatiladi:

1. **Puter.js (sozlovsiz, kalitsiz)** — ilova internetga ulansa, AI o'zi ishlaydi.
   Hech narsa sozlamasangiz ham ko'p hollarda ishlaydi (har foydalanuvchi o'z bepul
   limitidan foydalanadi). Hech qanday qadam talab qilinmaydi.

2. **Google Gemini (bepul kalit — eng ishonchli)** — agar barqaror va tez ishlashini
   xohlasangiz, bepul Gemini kalitini sozlang (pastga qarang). Kalit serverda yashirin
   turadi (`netlify/functions/solve.mjs`), saytga kiruvchilar uni ko'rmaydi.

> Maslahat: faqat Puter.js ham yetishi mumkin. Lekin maktab/ko'p o'quvchi uchun
> ishonchliroq bo'lishi uchun bepul Gemini kalitini ham sozlab qo'ying.

## Bepul Gemini kalitini sozlash (ixtiyoriy, lekin tavsiya)
### 1) Bepul kalit oling (kartasiz)
- https://aistudio.google.com/app/apikey → Google bilan kiring → **Create API key**.
- Bepul: kuniga ~1500 so'rovgacha pulsiz (Gemini 2.5 Flash). Kredit karta shart emas.

### 2) Saytni Netlify'ga joylang (GitHub orqali)
Server funksiyasi uchun GitHub usuli ishonchli:
1. https://github.com → yangi repository → shu papkadagi **barcha fayllarni** yuklang.
2. https://app.netlify.com → **Add new site → Import an existing project → GitHub** → repони tanlang → **Deploy** (sozlamalar `netlify.toml` dan avtomatik).

### 3) Kalitni qo'shing
- Netlify: **Site configuration → Environment variables → Add a variable**
- Nomi: `GEMINI_API_KEY` — qiymati: olgan kalitingiz.
- **Deploys → Trigger deploy → Deploy site** (qayta joylang). Tayyor.

> Faqat oddiy kalkulyator (AI'siz) yetarli bo'lsa, papkani to'g'ridan-to'g'ri
> https://app.netlify.com/drop ga tashlasangiz ham bo'ladi — qolgan bo'limlar ishlaydi.

## Telefonga o'rnatish va ulashish
- Netlify havolasini telefonda oching → menyu → **"Bosh ekranga qo'shish"**
  (iPhone'da Safari orqali).
- Do'stlarga: ilovadagi **↗ Ulashish** tugmasi yoki havolani yuboring.

## Eslatma (maxfiylik)
Bepul AI xizmatlari (Gemini bepul tarif, Puter.js) so'rovlardan modelni yaxshilashda
foydalanishi mumkin. Bu yerda shaxsiy ma'lumot emas, faqat fizika masalalari yuboriladi.
