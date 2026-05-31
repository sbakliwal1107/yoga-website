# Serenity Yoga — Beginner-friendly README

A modern yoga studio website built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

Pages: Home · About · Gallery · Reviews · Contact (with a working form UI).

---

## 1. Prerequisites

You need **Node.js 18+** installed. Check:

```bash
node --version
npm --version
```

If those print version numbers, you're good. (You already have v25 — perfect.)

---

## 2. Run it on your laptop

Open a terminal in this folder and run:

```bash
npm install      # one-time, installs all dependencies (already done)
npm run dev      # starts the local dev server
```

Then open <http://localhost:3000> in your browser. Edit any file in `src/` and the page reloads automatically.

---

## 3. Project structure (what lives where)

```text
yoga-website/
├── public/                  Static files (place your own images here)
├── src/
│   ├── app/                 Each folder = a URL route
│   │   ├── layout.tsx       Wraps every page (Navbar + Footer + fonts)
│   │   ├── globals.css      Theme colors and shared styles
│   │   ├── page.tsx         The "/" home page
│   │   ├── about/page.tsx   The "/about" page
│   │   ├── gallery/page.tsx The "/gallery" page
│   │   ├── reviews/page.tsx The "/reviews" page
│   │   └── contact/page.tsx The "/contact" page
│   └── components/          Reusable building blocks
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── ContactForm.tsx
├── next.config.ts           Next.js config (allows Unsplash images)
├── package.json             Dependencies + scripts
└── tsconfig.json            TypeScript config
```

**Rule of thumb:** to add a new page like `/schedule`, create a folder `src/app/schedule/` with a `page.tsx` inside it.

---

## 4. How to change content

| Want to change… | Edit this file |
|---|---|
| Studio name, hero text, classes | `src/app/page.tsx` |
| About / founder story | `src/app/about/page.tsx` |
| Gallery photos | `src/app/gallery/page.tsx` (`images` array) |
| Reviews | `src/app/reviews/page.tsx` (`reviews` array) |
| Address, email, phone | `src/app/contact/page.tsx` and `src/components/Footer.tsx` |
| Navigation links | `src/components/Navbar.tsx` (`links` array) |
| Colors (sage, sand, etc.) | `src/app/globals.css` (top `:root` block) |

---

## 5. Use your own photos

Right now the site uses placeholder photos from Unsplash. To swap in yours:

1. Drop image files into the `public/` folder, e.g. `public/photos/class-1.jpg`.
2. In any page, replace the URL with `/photos/class-1.jpg` (no need for the domain — `public/` is served from the root).

Example:

```tsx
<Image src="/photos/class-1.jpg" alt="Morning class" fill className="object-cover" />
```

---

## 6. Make the contact form actually send emails

Right now the form fakes a submission. To make it real, the easiest option is **Formspree** (free, 5-minute setup):

1. Sign up at <https://formspree.io>.
2. Create a form, copy your form ID (looks like `xrgjabcd`).
3. Open `src/components/ContactForm.tsx` and replace `handleSubmit` with:

```ts
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setStatus("submitting");
  const data = new FormData(e.currentTarget);
  const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  });
  setStatus(res.ok ? "success" : "error");
  if (res.ok) (e.target as HTMLFormElement).reset();
}
```

That's it — submissions arrive in your email.

---

## 7. Put it on the internet (deploy)

The easiest way (free, takes ~3 minutes):

### Option A — Vercel (recommended for Next.js)

1. Create a free account at <https://vercel.com>.
2. Push this folder to a new GitHub repo.
3. On Vercel, click **Add New → Project**, select the repo, click **Deploy**.
4. You'll get a live URL like `serenity-yoga.vercel.app`.

### Option B — Netlify

Same steps, but on <https://netlify.com>. Both are free.

---

## 8. Buy a custom domain (optional)

When you're happy with the site, get a real domain:

- <https://hostinger.in> · <https://godaddy.com> · <https://namecheap.com>
- Cost: ~₹800–1500/year for a `.com` or `.in` domain.
- After purchase, point it at Vercel/Netlify (their docs walk you through it in one screen).

---

## 9. Helpful scripts

```bash
npm run dev      # Start the local dev server (use while coding)
npm run build    # Build the production version
npm run start    # Run the production build locally
npm run lint     # Check code for issues
```

---

## 10. Where to learn more

- **Next.js docs (excellent):** <https://nextjs.org/learn>
- **Tailwind CSS:** <https://tailwindcss.com/docs>
- **React basics:** <https://react.dev/learn>

Enjoy building. Breathe deep.
