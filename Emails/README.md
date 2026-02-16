# Auth email templates

HTML templates for Supabase auth emails (reset password, invite). Paste the contents into **Supabase Dashboard → Authentication → Email Templates** so reset and invite links work reliably (token in query, not fragment).

## Files

| File | Supabase template | Suggested subject |
|------|-------------------|-------------------|
| `reset-password.html` | **Reset Password** | Reset your password - Brownstone Construction |
| `invite.html` | **Invite user** | You're invited to Brownstone Construction |

## How to use

1. Open **Supabase Dashboard** → **Authentication** → **Email Templates**.
2. For **Reset Password**: open `reset-password.html`, copy all HTML, paste into the **Message body** of the Reset Password template. Set **Subject** to the suggested subject above (or your own).
3. For **Invite user**: open `invite.html`, copy all HTML, paste into the **Message body** of the Invite user template. Set **Subject** as above.
4. Save both templates.

## Important

- All links use the app’s **callback URL** with `token_hash` and `type` in the query string (`/auth/callback?token_hash={{ .TokenHash }}&type=...`). Do **not** replace these with `{{ .ConfirmationURL }}`, or the “Invalid or expired link” / missing set-password form issue can return.
- Supabase variables used: `{{ .SiteURL }}`, `{{ .TokenHash }}`, `{{ .Email }}` (reset only). See [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates) for more.
