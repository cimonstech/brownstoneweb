# Blog implementation phases

## Phase 1 — Backend foundation (Supabase) ✅

- [x] Auth: Email + Password (enable in Supabase Dashboard)
- [x] Redirect URLs: `/admin/login`, `/admin/reset-password`
- [x] Tables: `profiles`, `roles`, `user_roles`, `posts` — see `supabase/migrations/001_blog_schema.sql`
- [x] RLS policies (public read published; authors/moderators/admins as planned)
- [x] Supabase client: `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`
- [x] Middleware: session refresh; skips Supabase when env vars missing so main site works

**Your `.env.local` (when ready):**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Run the migration in Supabase SQL Editor or `supabase db push`.

---

## Phase 2 — Storage & media (Cloudflare R2)

**Use R2 instead of Supabase Storage** for:

- Post images (Editor.js image tool)
- Cover images
- Author avatars

### 2.1 Create R2 bucket (Cloudflare Dashboard)

1. Cloudflare Dashboard → R2 → Create bucket (e.g. `brownstone-blog`).
2. Optional: attach a custom domain or use R2’s public URL for the bucket so you have stable public URLs.

### 2.2 R2 API tokens

1. R2 → Manage R2 API Tokens → Create API token.
2. Permissions: Object Read & Write for the bucket.
3. Copy: **Access Key ID**, **Secret Access Key**.  
   You’ll also need **Account ID** (from the right sidebar) and **Bucket name**.

### 2.3 Env vars

Add to `.env.local` (server-only; no `NEXT_PUBLIC_`):

```env
# R2 (server-only)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=brownstone-blog
# Public base URL for stored files (e.g. custom domain or R2 dev URL)
R2_PUBLIC_URL=https://your-bucket.example.com
```

If you use a custom domain for the bucket, set `R2_PUBLIC_URL` to that (e.g. `https://media.brownstoneltd.com`).

### 2.4 Next.js upload API

- **Route:** `POST /api/blog/upload` (or `/api/upload`).
- **Auth:** Require Supabase session (and optionally role: author/moderator/admin).
- **Flow:** Accept `multipart/form-data` or base64; upload to R2 with a key like `blog/{year}/{uuid}-{filename}`; return `{ url: string }` (public URL).
- **Usage:** Editor.js image tool and cover/avatar forms call this API and use the returned URL.

A placeholder route lives in `src/app/api/blog/upload/route.ts` — implement the R2 upload there (e.g. with `@aws-sdk/client-s3` and R2’s S3-compatible API).

---

## Phase 3 — Next.js admin routes ✅

- [x] `/admin`, `/admin/login`, `/admin/reset-password`, `/admin/dashboard`, `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]/edit`, `/admin/profile`, `/admin/users`, `/admin/posts/[id]/preview`
- [x] Middleware protects `/admin/*` (except login/reset-password); redirects to `/admin/login` when no session.
- [x] Admin shell with sidebar; login and reset-password are full-page.

---

## Phase 4 — Editor.js integration ✅

- [x] Editor.js + Header, List, Image, Quote, Code, Embed (`src/components/admin/Editor.tsx`).
- [x] Image tool: upload via `POST /api/blog/upload` (R2); returns `{ success: 1, file: { url } }`.
- [x] Post create/edit: title, slug (auto), excerpt, cover image URL, Editor.js, Save draft, Publish (role-restricted: admin/moderator).

---

## Phase 5 — Public blog pages ✅

- [x] `/blog` — list published posts (ISR revalidate 60).
- [x] `/blog/[slug]` — fetch by slug, render Editor.js JSON → HTML (`src/lib/blog/render.ts`), SEO (meta title, description, Open Graph image).
- [x] Nav link “Blog” added.

---

## Phase 6 — User management ✅

- [x] Profile: edit name, bio, avatar URL, change password, view roles (`/admin/profile`).
- [x] Admin-only `/admin/users`: list users with roles and post counts (role assignment remains in Supabase Dashboard or future API).

---

## Phase 7 — Moderation & publishing ✅

- [x] RLS: authors create/edit own; moderators/admins edit any, publish any.
- [x] UI: Publish button only for admin/moderator; authors see only “Save draft”.

---

## Phase 8 — Security & polish ✅

- [x] Validation: zod schema for post (title, slug, excerpt, cover_image) in `src/lib/blog/validate.ts`.
- [x] Editor.js output rendered with escaped HTML in `render.ts` (no raw HTML from blocks).
- [x] Autosave drafts every 30s when dirty.
- [x] Publish confirmation (browser confirm).
- [x] Unsaved changes warning (beforeunload).
- [x] Preview: `/admin/posts/[id]/preview` for author/moderator/admin.

**Not done in code (configure externally):** rate-limit admin routes (Cloudflare), R2 write access (already auth-only via Supabase session).


Here’s the summary again of what was implemented:

---

## Summary: What Was Implemented (Phases 3–8)

### Phase 3 — Admin routes
- **Admin layout** – `src/app/admin/layout.tsx` and `AdminShell`: sidebar for dashboard, posts, profile, users; full-page layout for login and reset-password.
- **Pages added:**
  - `/admin` → redirects to `/admin/dashboard`
  - `/admin/login` – email/password sign-in (Supabase)
  - `/admin/reset-password` – “forgot password” flow
  - `/admin/dashboard` – stats (draft/published counts) + recent posts + “New post”
  - `/admin/posts` – table of all posts with Edit
  - `/admin/posts/new` – create post (title, slug, excerpt, cover, Editor.js, Save draft / Publish)
  - `/admin/posts/[id]/edit` – edit existing post
  - `/admin/posts/[id]/preview` – preview draft (author/moderator/admin only)
  - `/admin/profile` – edit profile (name, bio, avatar URL, password, view roles)
  - `/admin/users` – admin-only list of users with roles and post counts
- **Auth** – Middleware still sends unauthenticated users to `/admin/login` for any `/admin/*` except login and reset-password.

---

### Phase 4 — Editor.js integration
- **Packages** (in `package.json`): `editorjs`, `@editorjs/header`, `@editorjs/list`, `@editorjs/image`, `@editorjs/quote`, `@editorjs/code`, `@editorjs/embed`, `@aws-sdk/client-s3`, `zod`.
- **Editor component** – `src/components/admin/Editor.tsx`: Editor.js with Header, List, Image, Quote, Code, Embed. Image tool uploads to `/api/blog/upload`.
- **Upload API** – `src/app/api/blog/upload/route.ts`: accepts multipart or base64, uploads to Cloudflare R2 (S3-compatible), returns `{ success: 1, file: { url } }` for Editor.js.
- **Post form** – Title, slug (auto from title), excerpt, cover image URL, Editor.js content, “Save draft”, “Publish” (only for admin/moderator).

---

### Phase 5 — Public blog
- **`/blog`** – Lists published posts (revalidate 60). Uses Nav + Footer.
- **`/blog/[slug]`** – Single post: fetches by slug, renders Editor.js JSON to HTML via `src/lib/blog/render.ts`, with meta title, description, and Open Graph image.
- **Nav** – “Blog” link added in the main site nav.

---

### Phase 6 — User management
- **Profile** – `/admin/profile`: edit full name, bio, avatar URL, change password; shows current roles.
- **Users (admin only)** – `/admin/users`: list users with roles and post counts. Role assignment is still done in Supabase (or a future API).

---

### Phase 7 — Moderation & publishing
- **RLS** – Unchanged: authors create/edit own posts; moderators/admins can edit and publish any post.
- **UI** – “Publish” button only for admin/moderator; authors only see “Save draft”.

---

### Phase 8 — Security & UX
- **Validation** – `src/lib/blog/validate.ts`: zod schema for title, slug, excerpt, cover_image before save.
- **Rendering** – `src/lib/blog/render.ts`: block content escaped when converting Editor.js JSON to HTML.
- **Autosave** – Draft autosaves every 30 seconds when there are unsaved changes.
- **Publish confirmation** – Browser `confirm()` before publishing.
- **Unsaved changes** – `beforeunload` warning when the form is dirty; “Unsaved changes” label when dirty.
- **Preview** – “Preview” link on edit page opens `/admin/posts/[id]/preview` (author/moderator/admin only).

---

### Files created/updated (concise)
- **Admin:** `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/login/page.tsx`, `app/admin/reset-password/page.tsx`, `app/admin/dashboard/page.tsx`, `app/admin/posts/page.tsx`, `app/admin/posts/new/page.tsx`, `app/admin/posts/[id]/edit/page.tsx`, `app/admin/posts/[id]/preview/page.tsx`, `app/admin/profile/page.tsx`, `app/admin/users/page.tsx`.
- **Components:** `components/admin/AdminShell.tsx`, `components/admin/Editor.tsx`, `components/admin/PostForm.tsx`, `components/admin/ProfileForm.tsx`.
- **API:** `app/api/blog/upload/route.ts` (R2 upload).
- **Blog:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `lib/blog/render.ts`, `lib/blog/validate.ts`.
- **Auth/roles:** `lib/supabase/auth.ts` (getUserRoles, canPublish, isAdmin).
- **Nav:** “Blog” link in `components/Nav.tsx`.
- **Docs:** `docs/BLOG_PHASES.md` updated with checkmarks for Phases 3–8.
- **Dependencies:** Editor.js, tools, `@aws-sdk/client-s3`, `zod` added to `package.json`.

---

### What you need to do
1. Run **`npm install`**.
2. Run the **Supabase migration** (`supabase/migrations/001_blog_schema.sql`) and set redirect URLs for `/admin/login` and `/admin/reset-password`.
3. (Optional) Add **R2 env vars** so the Image tool and upload API work.
4. Assign **roles** in `user_roles` (and ensure `profiles`/`get_user_roles` exist) so you can log in and test draft/publish.


-------------------

[2 tools called]


Updating Editor.js package versions to published ranges:


[6 tools called]


Updated `package.json` so the Editor.js packages use versions that exist on npm:

- **`@editorjs/list`**: `^2.2.0` → `^2.0.0` (latest published is 2.0.9)
- **`@editorjs/quote`**: `^2.2.0` → `^2.0.0`
- **`editorjs`**: `^2.29.0` → `^2.28.0`

Run install again:

```bash
npm install
```

If anything else fails with “No matching version found”, say which package and we can adjust its version range.

-----------------------

[8 tools called]


Loading the Editor with Next.js `dynamic` and `ssr: false` so it never runs on the server:


[3 tools called]


Summary of changes:

**1. `package.json`**
- **Removed:** `"editorjs": "^2.28.0"` (invalid unscoped name).
- **Added:** `"@editorjs/editorjs": "latest"` (correct scoped package).
- **Adjusted:** `"@editorjs/quote": "^2.2.0"` → `"@editorjs/quote": "^2.0.0"` (2.2.0 doesn’t exist).

**2. `src/components/admin/Editor.tsx`**
- **Import:** `import("editorjs")` → `import("@editorjs/editorjs")`.

**3. `src/components/admin/PostForm.tsx`**
- **Editor loading:** Editor is loaded with `next/dynamic` and `{ ssr: false }` so it only runs on the client and doesn’t run during SSR.
- **Types:** `OutputData` is imported as a type from `./Editor`.

Reinstall and run:

```bash
npm install
npm run dev
```

Reviewing the HTML layouts and current blog structure:


[5 tools called]


Implementing the plan: creating the migration and updating types, then building the admin and blog UI.


[4 tools called]


Adding migration 002 and implementing the blog layout and admin features.


[5 tools called]


Checking `get_user_roles` return type and existing blog types/pages:


[11 tools called]


Implementing: fixing the migration's post_categories policy, then adding types, admin categories, PostForm updates, and blog pages.


[4 tools called]


Creating admin categories page and server actions.


[8 tools called]


Creating category server actions and the admin categories page.


[3 tools called]


Updating PostForm and post edit/new pages to support categories, read_time_minutes, and featured.


[9 tools called]


Implementing the blog list page to match mainblog.html.


[5 tools called]


Adding the blog detail page and reading progress bar.


[4 tools called]


Making share buttons work without `window` on the server: using a client component that receives `title` and `slug` and builds share URLs with `window.location.origin` in the browser.


[1 tool called]


Passing the canonical URL from the server so share links work on first paint.


[3 tools called]


Fixing share URL: we can't use `window` in a server component. Building the canonical URL on the server:


[1 tool called]


Checking for lint errors and fixing the migration RLS: Postgres uses `NEW` in WITH CHECK for inserts.


[4 tools called]


Summary of what’s in place:

### 1. **Database (migration `002_blog_categories_featured.sql`)**
- **`categories`**: `id`, `name`, `slug`, `description`. RLS: public read; only **admin** can insert/update/delete.
- **`post_categories`**: many-to-many post ↔ category. RLS: public read; authors can manage categories on their own posts; moderators/admins on any post.
- **`posts`**: added `read_time_minutes` (nullable) and `featured` (boolean, default false).

Run the migration (Supabase SQL Editor or `supabase db push`).

### 2. **Admin**
- **Categories** at **`/admin/categories`**: list, add (name, optional slug/description), edit, delete. Only admins can access; nav link added in AdminShell.
- **Post form** (new & edit): category checkboxes, “Read time (minutes)”, and “Featured post” (only for users who can publish). Saving updates `read_time_minutes`, `featured`, and syncs `post_categories`.

### 3. **Blog list (`/blog`) – mainblog-style**
- **Featured block** at top: single published post with `featured = true` (latest by `published_at`).
- **Category tabs**: “All Articles” + one tab per category; `?category=<slug>` filters the grid.
- **Article grid**: cover, first category label, title, excerpt (2-line clamp), date and “X min read”.
- **Sidebar**: newsletter box and “Popular Topics” (categories with post counts).
- **“Load more”**: first 8 posts shown; button reveals the rest.

### 4. **Blog detail (`/blog/[slug]`) – blogdetails-style**
- **Reading progress bar** at top (client component).
- **Hero**: full-bleed cover, gradient overlay, category badge, “Date • X Min Read”, title, excerpt with left primary border.
- **Main**: existing Editor.js → HTML content.
- **Sidebar**: About the Author (from `profiles`), Share (X, copy link, LinkedIn via `ShareButtons` + canonical URL), Related Insights (3 other published posts).
- **Newsletter CTA** section at the bottom.

### 5. **Share URL**
Share buttons use a canonical URL built as  
`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`.  
Set **`NEXT_PUBLIC_SITE_URL`** (e.g. `https://yoursite.com`) so share links are correct; otherwise they may be wrong if the env is missing.

### 6. **Roles**
- **Categories**: only **admin** can create/edit/delete (enforced in RLS and in `/admin/categories`).
- **Featured**: only users who can publish (admin/moderator) see and set the “Featured post” checkbox.
- Moderators can edit any post and set categories/read time; only admins manage the category list. No new roles or permissions tables were added; you can add a permissions/roles UI later if you want.

Archives (e.g. “Posts by month/year”) were not implemented; they can be added as a sidebar block or a dedicated page that groups published posts by `published_at` once the above is in use.


****************

Here’s how to track emails from all forms in one place.

---

## Forms on the site

| Form | Location | Current fields | Stored today? |
|------|----------|----------------|---------------|
| **Contact form** | `/contact` | name, email, projectType, message | No |
| **Brochure form** | Celestia, townhouses | email, consent | No |
| **Lakehouse form** | `/celestia/lakehouse` | email, consent | Yes (`lakehouse_leads`) |
| **Exit intent popup** | Site-wide | email, consent | Yes (same API as Lakehouse) |
| **Newsletter** | Blog (if present) | email | No |

---

## Unified lead tracking

Use a single `leads` table for all forms:

```
leads
├── id (uuid)
├── email (required)
├── phone (nullable)
├── country_code (nullable)
├── name (nullable) — contact form
├── message (nullable) — contact form (truncated if needed)
├── source (required) — "contact" | "brochure" | "lakehouse" | "exit_intent" | "newsletter"
├── project (nullable) — "celestia" | "townhouse" | "lakehouse" | "Celestia Phase 1" etc.
├── consent (nullable)
├── created_at
```

Admin list can show:

- Email, phone, name, source, project, date  
- Filters by source and date  
- Optional export (CSV)

---

## Implementation plan

1. **Create `leads` table** in Supabase (and, if needed, migrate existing `lakehouse_leads` rows).
2. **Update APIs** to insert into `leads`:
   - `POST /api/contact` → insert with `source: "contact"`
   - `POST /api/brochure` → insert with `source: "brochure"`
   - `POST /api/lakehouse-leads` → insert with `source: "lakehouse"` or `"exit_intent"` (depending on where it’s called)
3. **Add `/admin/leads`** page to list and filter leads.
4. **Role checks** so only admins and moderators can access the leads page.

---

The difference from the earlier plan is that one `leads` table is used for every form, with `source` and optional fields like `name`, `message`, `project` to distinguish them.  

If you confirm this, the next step is implementing the schema and wiring all forms into it.


==================================

"Zone is invalid" usually means Cloudflare can't find an active DNS zone for that domain in the account you're using.

---

## Why you see this

R2 custom domains work only when the domain is in Cloudflare DNS. The bucket and domain must be in the same Cloudflare account.

---

## Checklist

### 1. Is brownstoneltd.com on Cloudflare?

- **Not on Cloudflare:** Add the site at [Cloudflare Dashboard](https://dash.cloudflare.com) → Add site → enter `brownstoneltd.com`, then complete setup (nameservers or CNAME).
- **On Cloudflare:** Confirm the zone is active and not in "pending" or "moved" state.

### 2. Same account?

- R2 bucket and `brownstoneltd.com` zone must be in the **same Cloudflare account**.
- If they’re in different accounts, either move the zone or use the account that owns the zone.

### 3. Zone status

- In Cloudflare: **Websites** → **brownstoneltd.com** → DNS.
- Zone should be **Active** (green).
- If it’s “Pending Nameserver Update” or similar, finish that step first.

### 4. Typo / subdomain

- In R2 custom domain, use exactly: `brownstoneltd.com` (or `www.brownstoneltd.com` for a subdomain).
- Ensure you’re not mixing different domains.

---

## Root domain vs subdomain

R2 custom domains can use:

- **Root:** `brownstoneltd.com`
- **Subdomain:** `cdn.brownstoneltd.com`, `assets.brownstoneltd.com`, etc.

If `brownstoneltd.com` already points to your main site (e.g. Vercel), using a subdomain for R2 is often easier:

- Root: `brownstoneltd.com` → Vercel (or main host)
- Subdomain: `cdn.brownstoneltd.com` or `assets.brownstoneltd.com` → R2 bucket

---

## What to do next

1. Log into Cloudflare.
2. Open **Websites** and confirm `brownstoneltd.com` is listed and active.
3. If it’s missing, add the site.
4. If it’s there, check that you’re in the same account as the R2 bucket.
5. Try connecting the R2 custom domain again, using either the root (`brownstoneltd.com`) or a subdomain (`cdn.brownstoneltd.com`).

If you share whether `brownstoneltd.com` is already on Cloudflare and which account it’s in, we can narrow down the exact fix.



=====



Cloudflare already has a record for that host, so you can’t add another one. You need to change the existing record instead.

---

## What to do

### 1. Open the existing record

- Go to **Cloudflare** → **DNS**.
- Find the record for the host you’re changing (e.g. `@` or `www`).

### 2. Update it

**For `@` (root):**

- If there’s an **A** record for `@`, click **Edit**.
- Set **IPv4 address** to: `76.76.21.21`
- Save.

**For `www`:**

- If there’s a **CNAME** record for `www`, click **Edit**.
- Set **Target** to: `cname.vercel-dns.com`
- Save.

### 3. If the record type is wrong

- Click **Edit** on the record.
- Cloudflare usually lets you change the target and, in some cases, the type.
- If you **must** change the type (e.g. CNAME → A for `@`), delete the record first, then create a new one with the correct type and value.

---

## Summary

- Don’t create a new record for the same host.
- Edit the existing record so it points to Vercel (`76.76.21.21` or `cname.vercel-dns.com`).
- If you need a different record type, delete the old record, then add the new one.

## DMARC configuration

You configure this in **Cloudflare**, since your nameservers are there.

**Steps in Cloudflare:**

1. Open your domain → **DNS** → **Records**
2. Click **Add record**
3. Set:
   - **Type:** TXT
   - **Name:** `_dmarc` (leaves the zone as `_dmarc.brownstoneltd.com`)
   - **Content:** `v=DMARC1; p=none;`
   - **TTL:** Auto

Cloudflare manages DNS, so any DNS records (including DMARC) go there. Vercel only needs the domain added and pointed to them, not DNS management.

---

## Deploying on Vercel

This setup works well on Vercel.

- **Next.js** – Vercel is built for Next.js
- **Supabase** – external API; works normally from Vercel
- **Resend** – external API; works normally from Vercel
- **R2 assets** – served via public URLs; no server-side dependency
- **Custom domain** – add it in Vercel and point it via Cloudflare (A/CNAME records)

**Vercel configuration:**

1. Add your repo and deploy
2. Add environment variables from `.env.local` (Supabase, Resend, assets URL, etc.)
3. Add your domain in Vercel and update DNS in Cloudflare per Vercel’s instructions (usually a CNAME `cname.vercel-dns.com` or A records)

Your domain and DNS stay in Cloudflare; DMARC and other records live there.