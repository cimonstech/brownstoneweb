# Blog backend setup (Supabase + Cloudflare R2)

## Overview

- **Supabase:** Auth (email/password), PostgreSQL (profiles, roles, user_roles, posts), RLS.
- **Cloudflare R2:** Storage for blog images (Editor.js, cover images, avatars). No Supabase Storage.

---

## Phase 1 — Supabase

### 1. Auth (Dashboard)

1. **Supabase Dashboard → Authentication → Providers:** Enable **Email**.
2. **Email templates:** Configure verification and password reset (optional custom templates).
3. **URL configuration:** Add redirect URLs:
   - `https://yourdomain.com/admin/login`
   - `https://yourdomain.com/admin/reset-password`
   - For local: `http://localhost:3000/admin/login`, `http://localhost:3000/admin/reset-password`

### 2. Database

1. **SQL Editor:** Run the migration in order:
   - `supabase/migrations/001_blog_schema.sql`
2. **Profile on signup:** If the trigger on `auth.users` is not allowed, create profiles from the app (e.g. after first login in middleware or an API that inserts into `profiles` when missing).

### 3. Env

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; for admin/role checks if needed)

### 4. RLS

Policies are in `001_blog_schema.sql`:

- **Public:** Read `posts` where `status = 'published'`.
- **Authors:** Create posts (own), update own drafts.
- **Moderators / Admins:** Update/delete any post, manage `user_roles`.
- **Admins:** Full access (implement extra checks in app for user management).

---

## Phase 2 — Cloudflare R2 (instead of Supabase Storage)

1. **Cloudflare Dashboard → R2:** Create bucket `blog-images` (or name in `.env`).
2. **Public access:** Either R2 public bucket or custom domain; set `R2_PUBLIC_URL` for public image URLs.
3. **API tokens:** Create R2 API token with read/write; set `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` in `.env.local`.
4. **Next.js:** Use `@aws-sdk/client-s3` with R2 endpoint (`https://<account_id>.r2.cloudflarestorage.com`). Implement an API route (e.g. `POST /api/upload`) that:
   - Accepts multipart/form or base64 image.
   - Uploads to R2.
   - Returns public URL (`R2_PUBLIC_URL` + key) for Editor.js and cover/avatar fields.

---

## Phase 3 — Next.js

- **Middleware:** `src/middleware.ts` runs Supabase `updateSession` and redirects unauthenticated users from `/admin/*` (except `/admin/login`, `/admin/reset-password`) to `/admin/login`.
- **Admin routes to add:** `/admin`, `/admin/login`, `/admin/reset-password`, `/admin/dashboard`, `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]/edit`, `/admin/profile`, `/admin/users`.
- **Role checks:** In admin layout or pages, fetch `user_roles` (or use a small RPC) and restrict UI/actions by role (author / moderator / admin).

---

## Phase 4+ (Editor.js, public blog, etc.)

- **Editor.js:** Install `@editorjs/editorjs` and tools; image tool calls your upload API and stores only URLs in JSON.
- **Public blog:** Fetch published posts from Supabase; render Editor.js JSON to HTML; add meta/OG for SEO.
- **Caching:** Use ISR or revalidate; optionally put Cloudflare CDN in front.

---

## Quick start

1. Run `001_blog_schema.sql` in Supabase SQL Editor.
2. Configure Auth redirect URLs and email in Supabase Dashboard.
3. Install deps: `npm install @supabase/supabase-js @supabase/ssr`.
4. Copy `.env.example` → `.env.local` and fill Supabase + R2 vars.
5. Implement admin login page and dashboard; then Editor.js and R2 upload route.
