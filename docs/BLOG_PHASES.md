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
