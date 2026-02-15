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

- `https://yourdomain.com/admin/update-password`
- For local dev: `http://localhost:3000/admin/update-password`

Without these, the reset link may be rejected by Supabase.

## Custom “from” and branding (Brownstone instead of Supabase)

By default, auth emails (password reset, invite) are sent from **Supabase** (`noreply@mail.app.supabase.io`). To send them from your own address and brand them as Brownstone:

### 1. Custom SMTP (Resend) so emails are from Brownstone

You already use Resend for the site. Use it for Supabase auth emails too:

1. In **Supabase Dashboard** go to **Authentication → SMTP Settings**.
2. **Enable Custom SMTP** and fill in:
   - **Sender email:** An address on your verified domain, e.g. `noreply@brownstoneltd.com` or `auth@brownstoneltd.com`. Must be a domain you’ve verified in [Resend → Domains](https://resend.com/domains).
   - **Sender name:** e.g. `Brownstone` or `Brownstone Construction`.
   - **Host:** `smtp.resend.com`
   - **Port:** `465`
   - **Username:** `resend`
   - **Password:** Your **Resend API key** (same as `RESEND_API_KEY` in your app).
3. Save. From then on, password reset and invite emails are sent via Resend from your sender address.

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
