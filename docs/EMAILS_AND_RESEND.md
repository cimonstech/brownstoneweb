# Email Templates & Resend Configuration

## Email template locations

All email templates live in **`src/lib/emails/`**:

| File | Purpose | Logo used |
|------|---------|-----------|
| **`contact-received.ts`** | Auto-reply when someone submits the main contact form. | Brownstone logo (optional, via `BROWNSTONE_LOGO_URL`) |
| **`lakehouse-thank-you.ts`** | Legacy Lakehouse “exclusive details” email. Replaced in behaviour by Celestia brochure (see below). | Celestia logo |
| **`celestia-brochure.ts`** | **Celestia property brochure** — sent when a user requests the brochure on Celestia, townhouses, or Lakehouse. Townhouse (Phase 1) and Lakehouse highlights, Brownstone colors, optional PDF link. | Celestia logo (`CelestiaLogo-bstone.png`) |

### Logo URLs

- **Celestia emails:**  
  `https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main/CelestiaLogo-bstone.png`  
  (hardcoded in `celestia-brochure.ts` and `lakehouse-thank-you.ts`).
- **Other emails (e.g. contact auto-reply):**  
  Set **`BROWNSTONE_LOGO_URL`** in `.env` / Vercel to your Brownstone logo image URL. If unset, the contact auto-reply is sent without a logo.

---

## Brochure flow (Celestia)

1. User enters email (and consents) on:
   - **Celestia** main page CTA  
   - **Townhouses** page CTA  
   - **Lakehouse** page (Jetty form)
2. Frontend shows: *“Thank you for taking the time to explore our website. We've sent the brochure to your email.”*
3. Backend sends **one automated email** using the **Celestia brochure** template (`celestia-brochure.ts`).

### API and components

- **`POST /api/brochure`** — Body: `{ email, project?: "celestia" | "townhouse" | "lakehouse", consent }`. Sends the Celestia brochure email.
- **`POST /api/lakehouse-leads`** — Used by the Lakehouse page; now sends the **same** Celestia brochure email (and still stores the lead in `lakehouse_leads` if Supabase is configured).
- **`BrochureForm`** — `src/components/BrochureForm.tsx`. Used on Celestia and townhouses pages.

### Optional: brochure PDF

To include a **“Download PDF Brochure”** link in the Celestia brochure email:

- Upload your PDF (e.g. to R2 or a public URL).
- Set in env:
  - **`BROCHURE_PDF_URL`** = full URL to the PDF (e.g. `https://pub-xxx.r2.dev/main/celestia-brochure.pdf`).

If `BROCHURE_PDF_URL` is not set, the email still sends; it just omits the download block and keeps the “View Townhouses” / “Explore the Lakehouse” links.

---

## Sender addresses (Postmark)

This project uses **Postmark** for sending. Each flow can use a **different sender** so forms and campaigns don’t all show the same “From” address.

| Flow | Env var | Example |
|------|---------|--------|
| Contact form (inquiry to team + auto-reply to user) | `POSTMARK_FROM_CONTACT` | `Candace from Brownstone <candace@brownstoneltd.com>` |
| Brochure request (Celestia / Townhouses) | `POSTMARK_FROM_BROCHURE` | `Brownstone <info@brownstoneltd.com>` |
| Lakehouse / Jetty lead (brochure email) | `POSTMARK_FROM_LAKEHOUSE` | `Brownstone Celestia <celestia@brownstoneltd.com>` |
| Exit intent signup | same as Lakehouse | uses `POSTMARK_FROM_LAKEHOUSE` |
| Admin → Campaigns (cold email) | `POSTMARK_FROM_CAMPAIGNS` | `Candace from Brownstone <candace@brownstoneltd.com>` |
| **Password reset & invite** | **Supabase Dashboard** | Set in **Authentication → SMTP**: sender name + sender email (e.g. `Brownstone <noreply@brownstoneltd.com>`). Different from the above. |

If a flow-specific var is not set, **`POSTMARK_FROM`** is used as fallback. Format: `"Name <email@domain.com>"` or just the email. Verify your domain in [Postmark → Sender Signatures](https://account.postmarkapp.com/sender_signatures).

---

## Postmark configuration

### Current use (transactional)

- **Contact form** → Postmark sends:
  - One email to your team (to `CONTACTFORMMAIL`),
  - One auto-reply to the user (contact-received template).
- **Brochure / Lakehouse** → Postmark sends the Celestia brochure to the user.

Required env:

- **`POSTMARK_API_KEY`** — From [Postmark](https://account.postmarkapp.com) → Server → API Tokens.
- **`POSTMARK_FROM`** — Fallback From address (e.g. `Candace from Brownstone <candace@brownstoneltd.com>`).
- **`POSTMARK_FROM_CONTACT`**, **`POSTMARK_FROM_BROCHURE`**, **`POSTMARK_FROM_LAKEHOUSE`**, **`POSTMARK_FROM_CAMPAIGNS`** — Optional; per-flow senders (see table above).
- **`CONTACTFORMMAIL`** — Where contact form submissions are sent (your team inbox).
- **`EMAIL_LEAD_NOTIFY`** — Optional. When set (e.g. `candace@brownstoneltd.com`), every new lead (contact, brochure, lakehouse, newsletter) triggers a short notification email to this address so a moderator can follow up.

**No confusion:** `CONTACTFORMMAIL` is the **recipient** — the inbox that receives the inquiry (e.g. `creative@brownstoneltd.com`). `POSTMARK_FROM_CONTACT` is the **sender** — the From name and address shown on the email (e.g. `Brownstone Contact Form <noreply@brownstoneltd.com>`). So the team receives at creative@; the user sees the message as coming from noreply@. Both are independent.

**Important:** Verify your domain in Postmark (Sender Signatures) so mail doesn’t show “via postmarkapp.com” and land in spam.

### Newsletters with Resend

You have two main patterns:

1. **Transactional only (current)**  
   Each email is triggered by a user action (contact, brochure request). No “list” or “broadcast” in Resend. Good for: contact auto-reply, brochure, one-off notifications.

2. **Newsletter / broadcast list**  
   Resend supports [Audiences](https://resend.com/docs/dashboard/audiences/contacts) and [Broadcasts](https://resend.com/docs/dashboard/broadcasts/send-broadcast):

   - **Audience:** Create an audience (e.g. “Newsletter”), add contacts (email + optional fields). Contacts can come from:
     - Manual add in Resend dashboard, or  
     - Your app calling [Resend Contacts API](https://resend.com/docs/api-reference/contacts/create-contact) when users subscribe (e.g. from a “Subscribe to newsletter” form).
   - **Broadcast:** Create a campaign, choose audience, compose HTML (or use a template), send or schedule.

So for “newsletters”:

- **Option A — Resend dashboard only:**  
  Add subscribers manually or via CSV in Resend; write and send broadcasts in the dashboard. No code change.

- **Option B — App collects, Resend sends:**  
  - Add a “Newsletter” signup (e.g. on blog or footer) that POSTs to your API.  
  - Your API calls Resend’s API to add the contact to an audience (and optionally sends a double-opt-in or thank-you email via Resend).  
  - When you want to send a newsletter, use Resend’s dashboard (or their API) to send a broadcast to that audience.

If you want, we can add a small **newsletter signup API** that:
- Accepts `email` (and consent),
- Calls Resend to add the contact to an audience,
- Optionally sends a short “You’re subscribed” email using a new template in `src/lib/emails/`.

---

## Leads capture (admin panel)

Brochure, contact, and lakehouse form submissions are stored in the **leads** table (visible in **Admin → Leads**).

**Requirements:** 1) **`SUPABASE_SERVICE_ROLE_KEY`** — From Supabase Dashboard → Settings → API → copy the `service_role` key. Add to `.env.local` and Vercel. 2) **Migration applied** — Run `supabase db push` or apply `supabase/migrations/008_leads.sql`.

Without `SUPABASE_SERVICE_ROLE_KEY`, leads are not stored. Check server logs for `Leads insert error` if inserts fail.

## Cold emails (Admin → Campaigns)

**Admin → CRM → Email Templates** and **Campaigns** are for sending cold emails to contacts.

### Sender and “via …” / spam

- **Use a clear, professional From** so the inbox shows e.g. **“Candace from Brownstone”** with your domain, not a generic or relay address. Set **`POSTMARK_FROM_CAMPAIGNS`** to a real name + verified address, for example:
  - `Candace from Brownstone <candace@brownstoneltd.com>`  
  - or `Candace from Brownstone <hello@brownstoneltd.com>`
- If the recipient sees **“via postmarkapp.com”** (or similar), your **sending domain is not fully authenticated**. Add and verify **brownstoneltd.com** in [Postmark → Sender Signatures](https://account.postmarkapp.com/sender_signatures): add the domain, then add the DNS records Postmark gives you. After that, mail sends from your domain and the “via” line and spam risk go down.
- Set **`POSTMARK_REPLY_TO`** so replies go to the right inbox (e.g. `candace@brownstoneltd.com`).

Using a real name + verified domain helps deliverability and makes the email look like a 1:1 message rather than bulk marketing.

Reply tracking (storing inbound replies in the CRM) is not used. Campaign replies go to `POSTMARK_REPLY_TO`; they are not logged in the contact timeline.

### Template body: paste plain text

In **Email Templates**, the **Body** field accepts **plain text or HTML**. If you **paste plain text** (no HTML tags), the app turns it into formatted HTML when you save: double line breaks become paragraphs, single line breaks become line breaks. So you can paste your intro and it will look like a proper email without writing HTML.

### Campaign sending limits

- **Per hour:** Default **20** emails. Set **`CRM_MAX_EMAILS_PER_HOUR`** in `.env` (e.g. `10` for 10/hour).
- **Per day:** Default **50** emails. Set **`CRM_MAX_EMAILS_PER_DAY`** to change.
- Each **“Send batch”** click sends **up to 10** emails, but never more than your **remaining quota** in the current hour (and day).  
  Example: limit 10/hour, you already sent 3 this hour → next click sends **7** (the remaining 7). After that, the button won’t send until the next hour (or you’ll see “Hourly limit reached”).

## Email deliverability (avoiding Promotions and Spam)

1. **Verify your domain in Postmark** — [Postmark → Sender Signatures](https://account.postmarkapp.com/sender_signatures): add `brownstoneltd.com`, add the SPF/DKIM records to your DNS. Until the domain is verified, mail can show “via postmarkapp.com” and land in Spam.
2. **Use a real name + your domain for campaigns** — set `POSTMARK_FROM_CAMPAIGNS` (e.g. `Candace from Brownstone <candace@brownstoneltd.com>`).
3. **Brochure/transactional** — Set `POSTMARK_REPLY_TO` (e.g. `info@brownstoneltd.com`). The contact auto-reply and brochure emails already encourage “reply to this email” and “add us to your contacts” in the copy; no extra change needed.
4. Avoid leading/trailing spaces in from-address env vars (code trims automatically).

## Env summary

| Variable | Purpose |
|----------|---------|
| `POSTMARK_API_KEY` | Postmark server API token (required for contact, brochure, lakehouse, campaigns). |
| `POSTMARK_FROM` | Fallback From address if a flow-specific var is not set. |
| `POSTMARK_FROM_CONTACT` | Sender for contact form (inquiry to team + auto-reply to user). |
| `POSTMARK_FROM_BROCHURE` | Sender for brochure request (Celestia / Townhouses). |
| `POSTMARK_FROM_LAKEHOUSE` | Sender for Lakehouse/Jetty lead and exit-intent brochure email. |
| `POSTMARK_FROM_CAMPAIGNS` | Sender for cold emails (Admin → Campaigns). |
| `POSTMARK_REPLY_TO` | Reply-To for brochure, lakehouse, campaigns. |
| **Password reset / invite** | **Supabase Dashboard → Auth → SMTP**: sender name + sender email (separate from Postmark). |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for leads capture. From Supabase → Settings → API. |
| `CONTACTFORMMAIL` | Recipient for contact form submissions. |
| `EMAIL_LEAD_NOTIFY` | Optional. Email address to notify when a new lead is created (contact, brochure, lakehouse, newsletter). |
| `BROWNSTONE_LOGO_URL` | Optional. Logo URL for contact auto-reply (other emails). |
| `BROCHURE_PDF_URL` | Optional. URL of Celestia brochure PDF. |
| `BROCHURE_PDF_URL_TOWNHOUSE` | Optional. URL of townhouse brochure PDF. | for the “Download PDF” link in brochure email. |
| `NEXT_PUBLIC_SITE_URL` | Base URL for links in emails (e.g. `https://brownstoneltd.com`). |
| `CRM_MAX_EMAILS_PER_HOUR` | Max campaign emails per hour (default 20). Use e.g. `10` for 10/hour. Each click sends up to 10 or the remaining in that hour. |
| `CRM_MAX_EMAILS_PER_DAY` | Max campaign emails per day (default 50). |
