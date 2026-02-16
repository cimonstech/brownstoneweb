# Admin panel: users and password reset

## How users get access

- **Admins add users manually.** There is no public “sign up” for the admin panel. Only users you invite can log in.
- **Invite flow:** Go to **Admin → Users**, enter an email and role (author, moderator, admin), and click **Invite**. Supabase sends an invitation email; the recipient clicks the link to set their password and then can sign in at `/admin/login`.

So the system is **invite-only**: you control who has access by inviting them from the Users page.

## Password reset (for existing users)

1. **From the login page:** On `/admin/login`, click **Reset password**.
2. **Enter email:** They enter their account email and click **Send reset link**.
3. **Email:** Supabase sends a password-reset email. The link sends them to **Set new password** (`/admin/update-password`).
4. **Set password:** They enter and confirm a new password, then are redirected to the dashboard.

**Supabase config:** In Supabase Dashboard → **Authentication → URL Configuration**, add your **Redirect URLs** so the reset link works:

- `https://yourdomain.com/admin/update-password` (use your real domain; no trailing slash)
- For local dev: `http://localhost:3000/admin/update-password`

Without these, the reset link may be rejected by Supabase. The URL must match exactly what you pass as `redirectTo` in the app (including path); any server redirect (e.g. http→https, www→non-www) can drop the `#...` fragment and break the “Set new password” form.

### Password reset not working? Checklist

1. **Redirect URLs** — In Supabase Dashboard → **Authentication → URL Configuration** → **Redirect URLs**, add the **exact** URL your app uses (e.g. `https://brownstoneltd.com/admin/update-password`). No extra path, no trailing slash unless your app uses it.
2. **Site URL** — In the same page, set **Site URL** to your app’s origin (e.g. `https://brownstoneltd.com`). Supabase uses this when building the reset link.
3. **Email delivery** — If the reset email never arrives, check **Authentication → SMTP Settings** (if using custom SMTP/Postmark) or **Authentication → Email Templates** (Reset Password). Default Supabase emails can land in spam.
4. **Link opens but “Set new password” form doesn’t show** — The reset link includes a hash (`#access_token=...&type=recovery`). If your host or CDN redirects (e.g. HTTP→HTTPS, adding/removing www), the hash can be lost and the page will show “This page is for setting a new password…” with no form. Fix: use a Redirect URL that does **not** trigger a server redirect (e.g. the final HTTPS URL), and ensure the link in the email points straight to that URL.
5. **User not found** — `resetPasswordForEmail` only works for emails that already have an account (invited users). It does not create accounts.

## Custom “from” and branding (Brownstone instead of Supabase)

By default, auth emails (password reset, invite) are sent from **Supabase** (`noreply@mail.app.supabase.io`). To send them from your own address and brand them as Brownstone:

### 1. Custom SMTP (Postmark) so emails are from Brownstone

You use Postmark for the site. Use it for Supabase auth emails too:

1. In **Supabase Dashboard** go to **Authentication → SMTP Settings**.
2. **Enable Custom SMTP** and fill in:
   - **Sender email:** An address on your verified domain, e.g. `candace@brownstoneltd.com`. Must be a domain you’ve verified in [Postmark → Sender Signatures](https://account.postmarkapp.com/sender_signatures).
   - **Sender name:** e.g. `Brownstone` or `Brownstone Construction`.
   - **Host:** `smtp.postmarkapp.com`
   - **Port:** `587` (TLS)
   - **Username:** Your **Postmark Server API token** (same as `POSTMARK_API_KEY`).
   - **Password:** Same as Username (Postmark uses the API token for both).
3. Save. From then on, password reset and invite emails are sent via Postmark from your sender address.

### 2. Edit the email template (subject and body)

The content of the reset (and invite) email is still Supabase’s default until you change it:

1. In **Supabase Dashboard** go to **Authentication → Email Templates**.
2. Open **Reset Password** (and optionally **Invite user**).
3. Change the **Subject** and **Message body** to your own wording and remove “powered by Supabase” / “Opt out of these emails” if you don’t want them.
4. You can use Supabase’s placeholders, e.g. `{{ .ConfirmationURL }}` for the reset link in the Reset Password template.
5. Save.

After both steps, users will receive reset (and invite) emails from your Brownstone address with your chosen text.

## Summary

| Action | How |
|--------|-----|
| Add a user | Admin → Users → Invite (email + role). They get an email to set password. |
| User signup | Not used. Access is invite-only. |
| Forgot password | Login page → “Reset password” → enter email → use link in email → set new password on `/admin/update-password`. |
