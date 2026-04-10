# Deploying Demoday to demoday.work

The site is a static-prerendered Next.js 14 app (App Router). Fastest path
to production: push to GitHub → import to Vercel → point Namecheap DNS at
Vercel.

## 1. Push to GitHub

```bash
# from the demoday/ directory
git add .
git commit -m "Initial Demoday landing page"

# create a new empty repo at https://github.com/new (e.g. demoday/landing)
git remote add origin git@github.com:<your-user>/demoday.git
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to https://vercel.com/new and import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Root directory: leave default.
4. Build command: `next build` (auto-detected).
5. Output directory: `.next` (auto-detected).
6. Click **Deploy**. First deploy takes ~60s.

You'll get a `*.vercel.app` URL once it's live — test it end to end before
flipping DNS.

## 3. Attach demoday.work in Vercel

In Vercel → project → **Settings → Domains**:

1. Add `demoday.work` and `www.demoday.work`.
2. Vercel shows the two DNS records you need on Namecheap.
   - Typically: apex `A 76.76.21.21` (or an ALIAS/ANAME if your provider
     supports it) and `www CNAME cname.vercel-dns.com`.
   - Vercel always shows the current values in the UI — use whatever it
     shows, not what this doc says.
3. Choose which host is the primary (usually apex `demoday.work`) and let
   Vercel redirect the other.

## 4. Configure DNS on Namecheap

1. Sign in at https://ap.www.namecheap.com/
2. Domain List → **Manage** next to `demoday.work`.
3. Open the **Advanced DNS** tab.
4. Delete any default "Parking Page" records that conflict with the ones
   you're about to add.
5. Add the records Vercel showed you in step 3:
   - `A` record · Host `@` · Value from Vercel · TTL Automatic
   - `CNAME` record · Host `www` · Value `cname.vercel-dns.com.` · TTL
     Automatic
6. Save.

Namecheap DNS propagates within minutes (Vercel polls and verifies
automatically). Once Vercel shows the green check next to each domain,
https://demoday.work is live. Vercel provisions SSL automatically.

## 5. After-launch checklist

- [ ] `https://demoday.work` loads the landing page.
- [ ] `https://www.demoday.work` redirects to the apex.
- [ ] `https://demoday.work/robots.txt` returns the robots file.
- [ ] `https://demoday.work/sitemap.xml` returns the sitemap.
- [ ] `https://demoday.work/icon.svg` returns the favicon.
- [ ] Open DevTools → Network → verify `_next/static/*` files are served
      with `cache-control: public, max-age=31536000, immutable`.
- [ ] Submit `https://demoday.work/sitemap.xml` to Google Search Console.

## Local dev reminder

```bash
npm install
npm run dev
# http://localhost:3000
```
