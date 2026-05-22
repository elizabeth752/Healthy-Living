# Vercel → Cloudflare Pages Migration

**Date:** 2026-05-22
**Domain:** healthylivingtreatment.com
**From:** Vercel (`lp-healthy-living` project, marketing-2131s-projects team)
**To:** Cloudflare Pages (free tier, e8os GitHub-connected)
**DNS Registrar:** GoDaddy (`ns31/32.domaincontrol.com`)

---

## Pre-migration state (captured 2026-05-22)

```
A records:       141.193.213.10, 141.193.213.11   (Vercel)
www:             CNAME → apex
Nameservers:     ns31/32.domaincontrol.com         (GoDaddy default)
Vercel plan:     Hobby (free)
```

---

## Code changes already made

Branch: `feat/cf-pages-static-export`

- `next.config.ts` — added `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`
- `public/_headers` — security headers + immutable cache for static assets

These produce a fully-static `out/` folder when built, which is what CF Pages serves.

---

## Step-by-step cutover

### 1. Connect CF Pages to the repo (10 min)

1. Open https://dash.cloudflare.com → Workers & Pages → Create application → Pages → Connect to Git
2. Authorize GitHub if not already → select `e8os/lp-healthy-living`
3. **Production branch:** `main` (not the feature branch — we'll merge after testing)
4. **Build settings:**
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: (leave blank)
5. **Environment variables:**
   - `NODE_VERSION` = `20`
6. Save and Deploy

CF Pages will checkout `main` (which doesn't have the export config yet) and likely fail the first build. That's expected. Continue to step 2.

### 2. Test on a preview branch first (15 min)

In CF Pages → your project → Settings → Build configuration → Preview branches → "All non-production branches"

Then in GitHub:
- Open PR from `feat/cf-pages-static-export` → `main`
- CF Pages auto-builds the preview
- Hit the preview URL (`feat-cf-pages-static-export.lp-healthy-living.pages.dev`)
- Verify: page renders, images load, fonts render, animations work
- Open browser devtools → Network → confirm `cf-cache-status` header on assets

### 3. Merge to main (1 min)

Once preview looks good:
```
gh pr merge feat/cf-pages-static-export --squash --delete-branch
```

CF Pages auto-builds `main`. You now have `lp-healthy-living.pages.dev` serving the LP.

### 4. Add custom domain to CF Pages (5 min)

In CF Pages → your project → Custom domains → Set up a custom domain:
- Domain: `healthylivingtreatment.com`
- CF will give you a CNAME target (something like `lp-healthy-living.pages.dev`)
- Also add `www.healthylivingtreatment.com` as a separate custom domain

### 5. Lower DNS TTL at GoDaddy FIRST (safety net)

Before changing any records, lower TTL so you can roll back quickly:

GoDaddy DNS management for healthylivingtreatment.com:
- Edit each A record (141.193.213.10, 141.193.213.11)
- Change TTL from 600 → **300 seconds**
- Save

**Wait 1 hour** (the OLD TTL) before doing the actual cutover. This is the lesson from the 2026-05-15 silverstateadolescenttreatment.com incident — never rush DNS.

### 6. Cut DNS over to CF Pages

GoDaddy DNS management:
- **Delete** both A records (141.193.213.10 / .11)
- **Add** a CNAME for `@` (apex) — GoDaddy uses CNAME flattening, this works
   - Target: `lp-healthy-living.pages.dev`
   - TTL: 300
- **Verify** the `www` CNAME also points correctly (CF Pages handles both)

Alternative (cleaner): change nameservers from GoDaddy default to Cloudflare's. Then CF manages DNS directly. But this is a bigger change — only do it if you want full CF DNS.

### 7. Verify (5 min)

```bash
# Wait 5 min after DNS change for propagation
dig healthylivingtreatment.com +short
# Should now resolve to Cloudflare IPs (172.x.x.x range)

curl -I https://healthylivingtreatment.com | grep -i "server:\|cf-ray:"
# Should show: server: cloudflare + cf-ray header
```

### 8. Vercel cleanup — WAIT 7 DAYS before this step

This is the dangerous step. Per the 2026-05-15 incident, dormant Vercel projects can still be reached and accidentally clobber production.

After 7 days of stable CF Pages serving:
1. Vercel dashboard → lp-healthy-living project → Settings → Domains
2. Remove `healthylivingtreatment.com` and `www.healthylivingtreatment.com`
3. Wait 24h, confirm no traffic
4. Either delete the project or leave it as `lp-healthy-living.vercel.app` only

### 9. Raise TTL back

Once stable for 7 days, raise TTL back to 3600 at GoDaddy. Migration complete.

---

## Rollback plan

If anything looks wrong after step 6:
1. At GoDaddy: re-add the A records (141.193.213.10 / .11)
2. Delete the new CNAME
3. Wait 5 min (your lowered TTL kicks in)
4. Vercel resumes serving — no data loss

---

## Final state

```
Hosting:         Cloudflare Pages (free tier)
Build:           npm run build → out/ → CF Pages CDN
Custom domain:   healthylivingtreatment.com (CF-managed)
Registrar:       GoDaddy (DNS only — could move to CF later)
Vercel plan:     Hobby (or close account)
Monthly cost:    $0
```
