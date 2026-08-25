# Taklifnoma — Online Wedding Invitation Platform

React + Vite + Supabase asosidagi online wedding invitation platform. Admin invitation yaratadi
(matn, sana, rasmlar, musiqa, dizayn), va mijozga bitta public URL beriladi:

```
https://taklifnoma.vercel.app/ali-va-valiya
```

## Texnologiyalar

- React 18 + Vite
- React Router v6
- Supabase (Auth, Database, Storage)
- Framer Motion (animatsiyalar)

## Loyihaning tuzilishi

```
src/
  components/       # Umumiy va admin komponentlar
  hooks/            # useAuth, useCountdown
  layouts/          # AdminLayout
  lib/              # supabaseClient, utils
  pages/            # LoginPage, AdminDashboard, Create/EditInvitation, PublicInvitation, NotFound
  services/         # invitationService, storageService (Supabase so'rovlari)
  themes/           # 3 ta dizayn: dark, warm, light + InvitationRenderer
supabase/
  migrations/001_init.sql   # Jadval, RLS va Storage policy'lari
```

Yangi (4-chi) dizayn qo'shish uchun: `src/themes/` ichida yangi papka yarating, komponent va CSS
yozing, so'ng `src/themes/index.jsx` ichidagi `THEME_MAP`ga qo'shing. Boshqa kodni o'zgartirish shart emas.

## 1. O'rnatish

```bash
npm install
```

## 2. Supabase loyihasini yaratish

1. [supabase.com](https://supabase.com) da yangi loyiha yarating.
2. Project Settings → API bo'limidan quyidagilarni oling:
   - Project URL
   - anon public key

## 3. Environment variables

`.env.example` faylidan nusxa oling:

```bash
cp .env.example .env
```

`.env` faylini to'ldiring:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. Database — SQL migration

Supabase Dashboard → SQL Editor'ga o'ting va `supabase/migrations/001_init.sql` faylining
to'liq mazmunini nusxalab ishga tushiring.

Bu quyidagilarni yaratadi:

- `invitations`, `invitation_photos`, `invitation_rsvps` jadvallari
- Barcha jadvallar uchun Row Level Security (RLS) policy'lari
- `wedding-photos` nomli public Storage bucket va uning policy'lari

## 5. Supabase Auth sozlash (admin user yaratish)

Bu loyihada public ro'yxatdan o'tish yo'q — faqat siz (admin) login qila olasiz.

1. Supabase Dashboard → Authentication → Users → **Add user**.
2. Email va parol kiriting (masalan `admin@taklifnoma.uz`).
3. "Auto Confirm User" belgisini yoqing (yoki emailni tasdiqlang).
4. Shu email/parol bilan `/` sahifasidan login qiling.

Kerak bo'lsa, Authentication → Providers'da "Email" provayderi yoqilganini tekshiring.

## 6. Storage sozlash

Migration fayli `wedding-photos` bucket'ini avtomatik yaratadi va **public** qiladi (o'qish uchun),
shuningdek fayl yuklash/o'chirishni faqat egasi (owner) uchun cheklaydi (RLS orqali).

Agar biror sababdan bucket yaratilmagan bo'lsa, Dashboard → Storage → **New bucket** →
nomi: `wedding-photos`, Public: yoqilgan.

## 7. RLS policies — qisqacha

- **invitations**: egasi (owner_id) to'liq CRUD qila oladi; hammaga faqat `status = 'published'`
  bo'lgan yozuvlarni o'qish ruxsat etiladi.
- **invitation_photos**: shu mantiqqa bog'liq — egasi boshqaradi, published invitation rasmlari
  hammaga ochiq.
- **invitation_rsvps**: har kim published invitationga RSVP yubora oladi (insert), lekin faqat
  egasi RSVP'larni o'qiy oladi.
- **storage.objects**: fayllar `{owner_id}/{invitation_id}/...` papkasida saqlanadi; faqat
  shu owner_id papkasiga yozish/o'chirish mumkin, o'qish esa public.

## 8. Local ishga tushirish

```bash
npm run dev
```

`http://localhost:5173` da ochiladi. `/` — admin login, `/admin` — dashboard, `/:slug` — public
invitation.

## 9. Build

```bash
npm run build
npm run preview
```

## 10. Vercel'ga deploy

1. Repo'ni Vercel'ga ulang yoki `vercel` CLI orqali deploy qiling.
2. Vercel loyihasi sozlamalarida quyidagi environment variable'larni qo'shing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. `vercel.json` fayli allaqachon SPA rewrite konfiguratsiyasini o'z ichiga oladi — shuning
   uchun `/ali-va-valiya` kabi public URL'lar refresh qilinganda 404 bermaydi.

## Ishlatish tartibi (admin sifatida)

1. `/` orqali login qiling.
2. "Create Invitation" tugmasini bosing, ma'lumotlarni kiriting, dizayn tanlang, slug bering.
3. "Saqlash" tugmasini bosing — shundan keyin rasm va musiqa yuklash imkoniyati ochiladi.
4. Hero va gallery rasmlarni yuklang, kerak bo'lsa musiqa qo'shing.
5. Live preview orqali natijani ko'ring.
6. "Saqlash va nashr qilish" bosilganda invitation `published` holatiga o'tadi va public URL
   ishlay boshlaydi: `/{slug}`.
7. Dashboard orqali istalgan vaqtda edit, preview, delete qilish mumkin.

## Eslatmalar

- Bitta admin (yoki bir nechta, agar Supabase Dashboard'da qo'shsangiz) — public ro'yxatdan
  o'tish yo'q.
- Har bir invitation faqat o'z egasiga (owner_id) bog'liq — boshqa admin foydalanuvchi
  qo'shilsa, ular bir-birlarining invitationlarini ko'ra olmaydi (RLS orqali ta'minlangan).
- Musiqa avtoplay qilinmaydi (brauzer siyosati) — foydalanuvchi pastki o'ng burchakdagi
  tugma orqali yoqadi.
