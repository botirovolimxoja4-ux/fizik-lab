// FizikLab — bepul AI yechuvchi (Google Gemini).
// Netlify'da GEMINI_API_KEY muhit o'zgaruvchisini sozlang (bepul, kartasiz).
// Bepul kalit: https://aistudio.google.com/app/apikey

const MODEL = 'gemini-2.5-flash';

const AI_SYSTEM = `Siz tajribali fizika o'qituvchisisiz. O'quvchi bergan fizika masalasini (matn yoki rasmda) yeching.
Qat'iy qoidalar:
- FAQAT JSON qaytaring. Hech qanday qo'shimcha matn yozmang.
- JSON aniq shu ko'rinishda bo'lsin:
{"topic":"mavzu nomi","answer":"qisqa yakuniy javob birligi bilan","steps":[{"l":"Berilgan","c":"..."},{"l":"Formula","c":"..."},{"l":"Yechish","c":"..."},{"l":"Javob","c":"..."}],"note":""}
- Hisob-kitobni juda aniq bajaring. SI birliklarida ishlang, birliklarni to'g'ri yozing.
- MUHIM (izchillik uchun): har doim standart darslik usulini ishlating, har safar bir xil yo'l bilan yeching. Bir xil masalaga har doim bir xil javob chiqsin.
- Avval masala shartini DIQQAT bilan o'qi va nima so'ralayotganini aniqla. Berilganlarni, qaysi kattalik topilishi kerakligini va to'g'ri formulani tanlab, to'liq yech.
- ⚠️ MOLEKULA/ATOM HAJMI QOIDASI (izchillik uchun qat'iy amal qil) — bitta molekulaning hajmini qanday hisoblashni masala shartiga qarab tanla:
  • AGAR masalada molekula/atom aniq SHAR (sfera) deb aytilgan BO'LSA, yoki molekulaning RADIUSI (r) berilgan bo'lsa → shar hajmi formulasini ishlat: V0 = (4/3)·π·r^3. Diametr berilgan bo'lsa r = d/2.
  • AKS HOLDA (ya'ni shar deb aytilmagan, faqat DIAMETR d berilgan, idishdagi suyuqlik/jism hajmi yoki molekulalar soni so'ralgan oddiy holatda) → KUB yaqinlashuvini ishlat: har bir molekula tomoni d ga teng kub joyni egallaydi, V0 = d^3. Bu darslik standartidir. Bu holatda shar formulasini va π ni ISHLATMA.
  • Tanlangan formulani butun masala davomida izchil ishlat. Bir xil masalaga har doim bir xil javob chiqishi SHART.
  • ❗ ENG MUHIM ISTISNO: agar foydalanuvchi o'z so'rovida qaysi usulni ishlatishni aniq aytsa (masalan "kub usuli bilan yech", "shar usuli bilan yech", "sferadek hisobla"), uning ko'rsatmasi yuqoridagi standart qoidadan USTUN turadi — har doim foydalanuvchi so'ragan usulni ishlat. Agar foydalanuvchi "ikkala usul bilan" yoki "har ikki yo'l bilan" yechishni so'rasa — ikkala usulni ham (kub: V=d^3 va shar: (4/3)·π·r^3) alohida hisoblab, ikkala natijani ham "steps" ichida ko'rsat, va "answer" da ikkala javobni yoz.
  • Misol (shar deb aytilmagan, faqat diametr): d = 3·10^-10 m, N = 10^24 → V0 = d^3, V = N·d^3 = 10^24·(3·10^-10)^3 = 2.7·10^-5 m^3 = 27 cm^3.
- "steps" ichida har bir qadamni sodda tushuntiring: berilganlar, formula, sonlarni qo'yib hisoblash va natija — toki o'quvchi shunga o'xshash masalalarni keyin o'zi yecha olsin.
- Agar matn/rasmda bir nechta masala bo'lsa va foydalanuvchi qaysi birini so'raganini aytsa (masalan "1-misol"), faqat o'shanisini yeching.
- Agar fizika masalasi bo'lmasa: answer="Bu fizika masalasi emas", steps=[].
- Ma'lumot yetishmasa, qanday qabul qilganingizni "note" da yozing.
- Hammasi o'zbek tilida bo'lsin.`;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const key = process.env.GEMINI_API_KEY;
  if (!key) return json({ error: 'GEMINI_API_KEY sozlanmagan. Netlify sozlamalaridan bepul kalitni qo\u2018shing.' }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Notog\u2018ri so\u2018rov' }, 400); }

  const parts = [];
  if (body.image && body.image.data) {
    parts.push({ inline_data: { mime_type: body.image.mediaType || 'image/jpeg', data: body.image.data } });
  }
  parts.push({ text: (body.text && body.text.trim()) ? body.text.trim() : 'Quyidagi rasmda fizika masalasi bor. Uni yech.' });

  const payload = {
    system_instruction: { parts: [{ text: AI_SYSTEM }] },
    contents: [{ role: 'user', parts }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0, topP: 0, topK: 1 },
  };

  let r;
  try {
    r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(payload),
    });
  } catch {
    return json({ error: 'API ga ulanib bo\u2018lmadi' }, 502);
  }

  const data = await r.json();
  if (!r.ok) return json({ error: (data.error && data.error.message) || 'API xatosi' }, r.status);

  let txt = '';
  try { txt = data.candidates[0].content.parts.map((p) => p.text || '').join(''); } catch { txt = ''; }
  txt = txt.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```\s*$/, '').trim();
  try { return json(JSON.parse(txt)); }
  catch { return json({ error: 'Javobni o\u2018qib bo\u2018lmadi' }, 502); }
};
