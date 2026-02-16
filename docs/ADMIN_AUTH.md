# Admin panel: users and password reset

## How users get access

- **Admins add users manually.** There is no public “sign up” for the admin panel. Only users you invite can log in.
- **Invite flow:** Go to **Admin → Users**, enter an email and role (author, moderator, admin), and click **Invite**. Supabase sends an invitation email. The recipient clicks the link, is taken to the app’s auth callback, then to **Create your password** (`/admin/update-password`), sets their password once, and can then sign in at `/admin/login` with email + password.

So the system is **invite-only**: you control who has access by inviting them from the Users page.

## Password reset (for existing users)

1. **From the login page:** On `/admin/login`, click **Reset password**.
2. **Enter email:** They enter their account email and click **Send reset link**.
3. **Email:** Supabase sends a password-reset email. The link sends them to the app’s auth callback, then to **Set new password** (`/admin/update-password`).
4. **Set password:** They enter and confirm a new password, then are redirected to the dashboard.

**Supabase config:** In Supabase Dashboard → **Authentication → URL Configuration**, add your **Redirect URLs** so the reset and invite links work:

- `https://yourdomain.com/auth/callback` (use your real domain; no trailing slash)
- For local dev: `http://localhost:3000/auth/callback`

Without these, the reset link may be rejected by Supabase. The URL must match exactly what you pass as `redirectTo` in the app (including path); any server redirect (e.g. http→https, www→non-www) can drop the `#...` fragment and break the “Set new password” form.

### Password reset not working? Checklist

1. **Redirect URLs** — In Supabase Dashboard → **Authentication → URL Configuration** → **Redirect URLs**, add **`https://yourdomain.com/auth/callback`** (and the same for localhost if you test locally). No trailing slash.
2. **Site URL** — In the same page, set **Site URL** to your app’s origin (e.g. `https://brownstoneltd.com`). Supabase uses this when building the reset link.
3. **Email delivery** — If the reset email never arrives, check **Authentication → SMTP Settings** (if using custom SMTP/Postmark) or **Authentication → Email Templates** (Reset Password). Default Supabase emails can land in spam.
4. **Link opens but “Set new password” form doesn’t show** — Supabase normally redirects with the session in the URL hash. If your host or CDN does an extra redirect (e.g. HTTP→HTTPS), the hash can be lost. **Fix:** In **Authentication → Email Templates**, for **Reset Password** and **Invite user**, set the main link to use the token in the query: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&redirect_to=/admin/update-password` (use `type=invite` for Invite user). The app's `/auth/callback` will verify the token and redirect to the set-password page. “This page is for setting a new password…” 5. **User not found** — `resetPasswordForEmail` only works for emails that already have an account (invited users). It does not create accounts.

## Custom “from” and branding (Brownstone instead of Supabase)

### "Invalid or expired link" when clicking reset or invite

If you see **"Invalid or expired link. Request a new reset or invite link"**, the token is not reaching the app (the URL fragment is often stripped by redirects). Use **custom links** in Supabase so the token is in the query string:

1. **Supabase Dashboard** → **Authentication** → **Email Templates**.
2. **Reset Password**: replace the main link with  
   `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&redirect_to=/admin/update-password`
3. **Invite user**: replace the main link with  
   `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite&redirect_to=/admin/update-password`
4. Save. New reset and invite emails will then show the set-password form.

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

#### Invite user — HTML template (paste into “Invite user” template)

Use this in **Authentication → Email Templates → Invite user**. Set **Subject** to e.g. `You're invited to Brownstone` and paste the following into **Message body** (leave “Email body” as the HTML option). Replace `Brownstone` with your site name if different.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 440px; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="padding: 40px 32px;">
              <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #1a1a1a;">You're invited</h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5; color: #4a4a4a;">You've been invited to join the team at <strong>{{ .SiteURL }}</strong>. Click the button below to create your password and get started.</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0;">
                <tr>
                  <td style="border-radius: 8px; background: #1a1a1a;">
                    <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite&redirect_to=/admin/update-password" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">Accept invite</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.5; color: #888;">If you didn't expect this invite, you can ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

The link uses `{{ .SiteURL }}` and `{{ .TokenHash }}` so the token is in the URL query; the app’s `/auth/callback` verifies it and redirects to the set-password page. This avoids the “form doesn’t show” issue when the URL hash is stripped by redirects.

## Summary

| Action | How |
|--------|-----|
| Add a user | Admin → Users → Invite (email + role). They get an email to set password. |
| User signup | Not used. Access is invite-only. |
| Forgot password | Login page → “Reset password” → enter email → use link in email → set new password on `/admin/update-password`. |
