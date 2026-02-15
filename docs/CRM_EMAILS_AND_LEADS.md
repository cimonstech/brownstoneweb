# Sending emails and messaging leads

## How to send emails (campaigns)

1. **Create an email template**  
   Admin → **CRM** → **Email Templates** → create a template with subject and HTML body. You can use placeholders like `{{name}}` and `{{email}}`.

2. **Create a campaign**  
   Admin → **CRM** → **Campaigns** → **New campaign** (or the create button).  
   - Give the campaign a name.  
   - Choose the **email template**.  
   - **Select contacts** to send to (checkboxes). Only contacts that are not “Do not contact” or “Unsubscribed” are listed.  
   - Save. You’re taken to the campaign detail page.

3. **Send emails**  
   On the campaign detail page, click **“Send batch (up to 10)”**. Each click sends up to 10 pending emails. There are hourly/daily limits to avoid spam. Repeat until “Pending” is 0 or you’re done.

4. **Add more recipients to a campaign**  
   On the same campaign detail page, use **“Add contacts”** to select more contacts; they’re added as pending and you can send to them with the same button.

So: **you always choose Contacts** when creating or extending a campaign; emails go to those contacts’ email addresses.

---

## Leads vs contacts

- **Leads** = everyone who submitted a form (contact, brochure, lakehouse, exit intent, newsletter). Stored in **Leads** (Admin → **Leads**).
- **Contacts** = the list you use to send campaigns. Stored in **Contacts** (Admin → **CRM** → **Contacts**).

**Who becomes a contact automatically?**

- **Newsletter** signups: a contact is created (or updated) automatically when they subscribe, so they appear in both Leads and Contacts and you can add them to campaigns right away.

**Who stays only as a lead?**

- **Brochure**, **Lakehouse**, **Contact form**, **Exit intent**: these are stored only in **Leads**. They do **not** appear in **Contacts** until you add them.

**How to message leads (brochure, lakehouse, etc.)**

1. Open **Leads** (Admin → **Leads**).
2. For each lead you want to email, click **“Add to contacts”**. That creates (or updates) a contact with the same email and name.
3. Go to **CRM** → **Campaigns** → create a new campaign (or open an existing one and use **“Add contacts”**).
4. Select the contacts you just added (and any others you want).
5. Send as described above.

So: **Leads** = source of people who showed interest; **Contacts** = list of people you’re allowed to send campaign emails to. Use **“Add to contacts”** on a lead to make them available for campaigns.
