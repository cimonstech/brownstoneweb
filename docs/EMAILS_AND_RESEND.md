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

## Resend configuration

### Current use (transactional)

- **Contact form** → Resend sends:
  - One email to your team (to `CONTACTFORMMAIL`),
  - One auto-reply to the user (contact-received template).
- **Brochure / Lakehouse** → Resend sends the Celestia brochure to the user.

Required env (already in use):

- **`RESEND_API_KEY`** — From [Resend](https://resend.com) → API Keys.
- **`RESEND_FROM_SUPPORT`** — Sender for inquiry emails to your team (e.g. `Brownstone Support <support@brownstoneltd.com>`). Must use a verified domain.
- **`RESEND_FROM_NOREPLY`** — Sender for automated emails to users (auto-reply, brochure) (e.g. `Brownstone <noreply@brownstoneltd.com>`). Must use a verified domain.
- **`CONTACT_FROM_EMAIL`** — Fallback if the above are not set. Prefer `RESEND_FROM_SUPPORT` and `RESEND_FROM_NOREPLY` for clarity.
- **`CONTACTFORMMAIL`** — Where contact form submissions are sent (your team inbox).

**Important:** Verify `brownstoneltd.com` at [resend.com/domains](https://resend.com/domains) before sending. Unverified domains can only send to your own email.

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

- **Use a clear, professional From** so the inbox shows e.g. **“Candace from Brownstone”** with your domain, not a generic or relay address. Set **`RESEND_FROM_CAMPAIGNS`** to a real name + verified address, for example:
  - `Candace from Brownstone <candace@brownstoneltd.com>`  
  - or `Candace from Brownstone <hello@brownstoneltd.com>`
- If the recipient sees **“via amazonses.com”** (or similar), your **sending domain is not fully authenticated**. Add and verify **brownstoneltd.com** in [Resend → Domains](https://resend.com/domains): add the domain, then add the SPF/DKIM records Resend gives you to your DNS. After verification, Resend sends from your domain and the “via” line and spam risk go down.
- Use the **same address** (or a known support address) for **`RESEND_REPLY_TO`** so replies go to the right inbox (e.g. `candace@brownstoneltd.com` or `hello@brownstoneltd.com`).

Using a real name + verified domain helps deliverability and makes the email look like a 1:1 message rather than bulk marketing.

Reply tracking (storing inbound replies in the CRM) is not used. Campaign replies go to `RESEND_REPLY_TO`; they are not logged in the contact timeline.

### Template body: paste plain text

In **Email Templates**, the **Body** field accepts **plain text or HTML**. If you **paste plain text** (no HTML tags), the app turns it into formatted HTML when you save: double line breaks become paragraphs, single line breaks become line breaks. So you can paste your intro and it will look like a proper email without writing HTML.

### Campaign sending limits

- **Per hour:** Default **20** emails. Set **`CRM_MAX_EMAILS_PER_HOUR`** in `.env` (e.g. `10` for 10/hour).
- **Per day:** Default **50** emails. Set **`CRM_MAX_EMAILS_PER_DAY`** to change.
- Each **“Send batch”** click sends **up to 10** emails, but never more than your **remaining quota** in the current hour (and day).  
  Example: limit 10/hour, you already sent 3 this hour → next click sends **7** (the remaining 7). After that, the button won’t send until the next hour (or you’ll see “Hourly limit reached”).

## Email deliverability (avoiding Promotions and Spam)

1. **Verify your domain in Resend** — [Resend → Domains](https://resend.com/domains): add `brownstoneltd.com`, add the SPF/DKIM records to your DNS. Until the domain is verified, mail can show “via amazonses.com” and land in Spam.
2. **Use a real name + your domain for campaigns** — e.g. `Candace from Brownstone <candace@brownstoneltd.com>`. Avoid no-reply or generic addresses for cold email.
3. **Brochure/transactional** — Reply-To can be `info@brownstoneltd.com`. Encourage “reply to this email” and “add us to your contacts” in the copy.
4. Avoid leading/trailing spaces in from-address env vars (code trims automatically).

## Env summary

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key (required for all emails). |
| `RESEND_FROM_SUPPORT` | Sender for inquiry emails to your team (e.g. `Brownstone Support <support@brownstoneltd.com>`). Use verified domain. |
| `RESEND_FROM_NOREPLY` | Sender for automated emails to users (e.g. `Candace from Brownstone <info@brownstoneltd.com>`). Use verified domain. No leading spaces. |
| `RESEND_FROM_CAMPAIGNS` | Sender for cold emails (Admin → Campaigns). Use a clear name + verified domain (e.g. `Candace from Brownstone <candace@brownstoneltd.com>`). Verify the domain in Resend to avoid “via amazonses.com” and spam. Falls back to `RESEND_FROM_SUPPORT` if unset. |
| `RESEND_REPLY_TO` | Where replies go (e.g. `ghanaisthefuture@brownstoneltd.com`). Used by campaigns and brochure. |
| `CONTACT_FROM_EMAIL` | Fallback sender if the above are not set. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for leads capture. From Supabase → Settings → API. |
| `CONTACTFORMMAIL` | Recipient for contact form submissions. |
| `BROWNSTONE_LOGO_URL` | Optional. Logo URL for contact auto-reply (other emails). |
| `BROCHURE_PDF_URL` | Optional. URL of Celestia brochure PDF. |
| `BROCHURE_PDF_URL_TOWNHOUSE` | Optional. URL of townhouse brochure PDF. | for the “Download PDF” link in brochure email. |
| `NEXT_PUBLIC_SITE_URL` | Base URL for links in emails (e.g. `https://brownstoneltd.com`). |
| `CRM_MAX_EMAILS_PER_HOUR` | Max campaign emails per hour (default 20). Use e.g. `10` for 10/hour. Each click sends up to 10 or the remaining in that hour. |
| `CRM_MAX_EMAILS_PER_DAY` | Max campaign emails per day (default 50). |
