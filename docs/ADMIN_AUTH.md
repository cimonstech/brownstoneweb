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

**Supabase config:** In Supabase Dashboard → **Authentication → URL Configuration**, set:

- **Site URL:** e.g. `https://yourdomain.com` (or `http://localhost:3000` for local).
- **Redirect URLs:** Add these (invite and password-reset links use the auth callback):
  - `https://yourdomain.com/auth/callback`
  - `https://yourdomain.com/admin/update-password`
  - `https://yourdomain.com/admin/login`
  - For local: `http://localhost:3000/auth/callback`, `http://localhost:3000/admin/update-password`, `http://localhost:3000/admin/login`

Without the callback URL, invite links will 404. Without the update-password URL, reset links may be rejected.

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

## Testing password reset and invite

Before testing, confirm in **Supabase Dashboard**:

1. **Authentication → SMTP Settings** — Custom SMTP is enabled and uses your Postmark credentials (so Supabase can send mail).
2. **Authentication → URL Configuration → Redirect URLs** — Include:
   - `https://yourdomain.com/auth/callback` (required for invite and recovery links)
   - `https://yourdomain.com/admin/update-password`
   - `https://yourdomain.com/admin/login`
   - For local: `http://localhost:3000/auth/callback`, `http://localhost:3000/admin/update-password`, `http://localhost:3000/admin/login`

### Test 1: Password reset

1. Open `/admin/login` and click **Reset password**.
2. Enter an email that **already has an account** (e.g. your admin email).
3. Click **Send reset link**.
4. You should see **"Check your email for the reset link"** (no error).
5. Check that inbox (and spam). You should get an email with a link.
6. Click the link — you should land on `/admin/update-password` with a form to set a new password.
7. Set and confirm a new password, submit — you should be redirected to the dashboard.

If you see "Error sending recovery email", Supabase is not sending mail: check SMTP settings and Postmark.

### Test 2: User invitation

1. Log in as an **admin**.
2. Go to **Admin → Users**.
3. In the invite form, enter a **new** email (not already in the system) and choose a role.
4. Click **Invite**.
5. You should see **"Invitation sent. They can sign in with the link in the email."** (no error).
6. Check that recipient's inbox (and spam). They should get an invite email with a link.
7. They click the link, set their password on the page Supabase shows, then can sign in at `/admin/login`.

If the API returns an error (e.g. "User already invited or already exists"), use a different email. If the invite "succeeds" but no email arrives, check Supabase SMTP and Postmark.

## Summary

| Action | How |
|--------|-----|
| Add a user | Admin → Users → Invite (email + role). They get an email to set password. |
| User signup | Not used. Access is invite-only. |
| Forgot password | Login page → “Reset password” → enter email → use link in email → set new password on `/admin/update-password`. |
