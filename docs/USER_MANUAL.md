# Brownstone Admin — User Manual

**Brownstone Construction Limited**
1 Airport Square, Accra — Ghana
info@brownstoneltd.com · +233 244 028 773

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
   - 2.1 [Accepting Your Invitation](#21-accepting-your-invitation)
   - 2.2 [Logging In](#22-logging-in)
   - 2.3 [Resetting Your Password](#23-resetting-your-password)
3. [Understanding Roles](#3-understanding-roles)
4. [The Dashboard](#4-the-dashboard)
5. [Content Management](#5-content-management)
   - 5.1 [Posts](#51-posts)
   - 5.2 [Categories](#52-categories)
   - 5.3 [Media Library](#53-media-library)
   - 5.4 [Signature Listings](#54-signature-listings)
6. [Lead Management](#6-lead-management)
   - 6.1 [Viewing Leads](#61-viewing-leads)
   - 6.2 [Filtering & Searching](#62-filtering--searching)
   - 6.3 [Adding a Lead as a Contact](#63-adding-a-lead-as-a-contact)
   - 6.4 [Exporting Leads](#64-exporting-leads)
7. [CRM — Contacts](#7-crm--contacts)
   - 7.1 [Browsing Contacts](#71-browsing-contacts)
   - 7.2 [Adding a Contact Manually](#72-adding-a-contact-manually)
   - 7.3 [Viewing & Editing a Contact](#73-viewing--editing-a-contact)
   - 7.4 [Contact Notes](#74-contact-notes)
   - 7.5 [Importing Contacts](#75-importing-contacts)
   - 7.6 [Bulk Actions](#76-bulk-actions)
8. [CRM — Segments](#8-crm--segments)
   - 8.1 [Creating a Segment](#81-creating-a-segment)
   - 8.2 [Assigning Contacts to Segments](#82-assigning-contacts-to-segments)
   - 8.3 [Filtering by Segment](#83-filtering-by-segment)
9. [CRM — Pipeline](#9-crm--pipeline)
10. [CRM — Email Templates](#10-crm--email-templates)
11. [CRM — Campaigns](#11-crm--campaigns)
    - 11.1 [Creating a Campaign](#111-creating-a-campaign)
    - 11.2 [Sending a Campaign](#112-sending-a-campaign)
    - 11.3 [Viewing Campaign Results](#113-viewing-campaign-results)
12. [CRM — Analytics](#12-crm--analytics)
13. [User Management](#13-user-management)
    - 13.1 [Inviting a New User](#131-inviting-a-new-user)
    - 13.2 [Assigning & Removing Roles](#132-assigning--removing-roles)
    - 13.3 [Deleting a User](#133-deleting-a-user)
14. [Your Profile](#14-your-profile)
    - 14.1 [Uploading an Avatar](#141-uploading-an-avatar)
    - 14.2 [Changing Your Password](#142-changing-your-password)
15. [Public Website Overview](#15-public-website-overview)
    - 15.1 [Home Page](#151-home-page)
    - 15.2 [About Page](#152-about-page)
    - 15.3 [Services Page](#153-services-page)
    - 15.4 [Portfolio Page](#154-portfolio-page)
    - 15.5 [Celestia Pages](#155-celestia-pages)
    - 15.6 [Blog](#156-blog)
    - 15.7 [Contact Page](#157-contact-page)
16. [Lead Sources Explained](#16-lead-sources-explained)
17. [Frequently Asked Questions](#17-frequently-asked-questions)

---

## 1. Introduction

The **Brownstone Admin** panel is the back-office system for managing the Brownstone Construction website, blog, leads, and customer relationships. From this panel you can publish articles, track prospective clients, run email campaigns, and manage the team.

This manual walks you through every feature, step by step.

---

## 2. Getting Started

### 2.1 Accepting Your Invitation

When a moderator invites you to the platform, you will receive an email containing a secure invitation link.

1. Open the email and click the invitation link.
2. You will be taken to the **Set Password** page.
3. Enter a strong password (at least 8 characters).
4. Click **Update password**.
5. You will be redirected to the admin dashboard.

> **Tip:** If the invitation link has expired, ask your moderator to send a new one from the Users page.

![Invitation email](/manual/invitation_email.png)

### 2.2 Logging In

1. Navigate to the admin login page. You can find a small "Admin" link in the website footer, or go directly to `/admin/login`.
2. Enter your **email** and **password**.
3. Click **Sign in**.
4. You will be taken to the Dashboard.

![Login page](/manual/login_page.png)

### 2.3 Resetting Your Password

If you have forgotten your password:

1. On the login page, click **Forgot password?**
2. Enter your email address.
3. Click **Send reset link**.
4. Check your inbox for the reset email and click the link inside.
5. Enter your new password and confirm.

> **Note:** For security, the reset link expires after a short time. You may request up to 3 reset links per hour.

![Reset password page](/manual/reset_password_page.png)

---

## 3. Understanding Roles

Every user is assigned one or more roles that determine what they can see and do.

<!-- Original role table with admin included (kept for internal reference):
| Capability | Admin | Moderator | Author |
|---|:---:|:---:|:---:|
| View dashboard overview | Yes | Yes | Yes |
| Create & edit own posts | Yes | Yes | Yes |
| Edit & publish any post | Yes | Yes | — |
| Manage categories | Yes | — | — |
| Manage media library | Yes | Yes | Yes |
| Delete media files | Yes | Yes | — |
| Manage Signature Listings | Yes | Yes | — |
| View & manage leads | Yes | Yes | — |
| Access CRM (Contacts, Pipeline, Campaigns, Templates, Analytics) | Yes | Yes | — |
| Import contacts | Yes | Yes | — |
| Manage segments | Yes | Yes | — |
| Invite & manage users | Yes | Yes | — |
| View audit log | Yes | — | — |
-->

| Capability | Moderator | Author |
|---|:---:|:---:|
| View dashboard overview | Yes | Yes |
| Create & edit own posts | Yes | Yes |
| Edit & publish any post | Yes | — |
| Manage categories | Yes | — |
| Manage media library | Yes | Yes |
| Delete media files | Yes | — |
| Manage Signature Listings | Yes | — |
| View & manage leads | Yes | — |
| Access CRM (Contacts, Pipeline, Campaigns, Templates, Analytics) | Yes | — |
| Import contacts | Yes | — |
| Manage segments | Yes | — |
| Invite & manage users | Yes | — |

**Moderator** — Full access to content management, leads, and the full CRM. Can invite users and manage the team.

**Author** — Can create and edit their own blog posts. Cannot access leads, the CRM, or user management. The sidebar shows only Content and Profile sections.

---

## 4. The Dashboard

The dashboard is the first screen you see after logging in. It provides a high-level overview of your system.

**Content cards:**
- **Draft Posts** — Number of posts saved as drafts.
- **Published Posts** — Number of live posts on the blog.
- **Total Posts** — Combined count of all posts.

**CRM & Team cards** (visible to Moderators only):
- **Contacts** — Total contacts in the CRM.
- **Campaigns** — Number of email campaigns.
- **Leads** — Total form submissions received.
- **Users** — Number of team members.

Below the cards you will find a **Recent Posts** table showing the latest articles with their author, status, and date.

**Quick actions:** Click **New post** to jump straight into the post editor.

![Dashboard](/manual/dashboard.png)


---

## 5. Content Management

### 5.1 Posts

Navigate to **Content → Posts** in the sidebar.

#### Viewing Posts

The posts list shows all blog articles across the team. You can:
- **Search** by title, slug, or excerpt using the search bar.
- See each post's **author**, **status** (Draft or Published), and **date**.

#### Creating a New Post

1. Click the **New post** button.
2. Fill in the following fields:
   - **Title** — The headline of your article.
   - **Slug** — Auto-generated from the title. You can edit it manually. This becomes the URL (e.g., `/blog/your-slug`).
   - **Excerpt** — A short summary shown on the blog listing and in search results.
   - **Cover Image** — Upload a cover photo using the image upload button.
   - **Content** — Write your article using the rich text editor. You can add headings, bold/italic text, lists, links, and images.
   - **Categories** — Select one or more categories for the post.
   - **Featured** — Toggle this on to feature the post prominently on the blog page.
   - **Status** — Choose **Draft** to save privately, or **Published** to make it live.
3. Click **Save** or **Publish**.

> **Authors:** You can save drafts but cannot publish. A Moderator must publish your post.

#### Editing a Post

1. In the posts list, click the **Edit** button (pencil icon) next to the post.
2. Make your changes.
3. Click **Save**.

#### Deleting a Post

1. Click the **Delete** button (trash icon) next to the post.
2. Confirm the deletion in the dialog.

> **Warning:** Deleted posts cannot be recovered.

![Posts list](/manual/post_list.png)
![Post editor](/manual/post_editor.png)

### 5.2 Categories

Navigate to **Content → Categories** in the sidebar. *Moderator only.*

Categories help organize blog posts. Visitors can filter articles by category on the public blog page.

#### Creating a Category

1. Enter the **Name** in the input field.
2. The **Slug** is generated automatically.
3. Optionally add a **Description**.
4. Click **Create**.

#### Editing or Deleting a Category

- Click the **Edit** button next to a category to change its name or description.
- Click the **Delete** button to remove it. Posts in that category will not be deleted, but they will no longer be associated with it.

![Categories page](/manual/categories_page.png)

### 5.3 Media Library

Navigate to **Content → Media** in the sidebar.

The media library stores all images uploaded to the platform. Images are hosted on Cloudflare R2 for fast global delivery.

#### Uploading an Image

1. Click the **Upload** button.
2. Select an image file from your computer.
3. Accepted formats: **JPEG, PNG, WebP, GIF**.
4. Maximum file size: **6 MB**.
5. The image will appear in the library once uploaded.

#### Using an Image

- Click the **Copy URL** button on any image to copy its public URL to your clipboard.
- Paste the URL into a post's cover image field, or use it anywhere else you need an image link.

#### Deleting an Image

*Moderator only.* To remove an image from the media library:

1. Hover over the image you want to delete.
2. Click the **Delete** button (trash icon) that appears in the top-right corner of the image card.
3. Confirm the deletion in the dialog.

> **Warning:** Deleting a media file is permanent. If the image is used in a blog post or elsewhere, those references will show a broken image.

![Media library](/manual/media_library.png)

### 5.4 Signature Listings

Navigate to **Content → Signature Listings** in the sidebar. *Moderator only.*

Signature Listings are the four featured property cards that appear in the blog sidebar under "Now Selling." They give visitors a subtle view of current properties for sale.

#### Editing a Listing

1. Each of the 4 slots shows its current image, name, and link.
2. Update the **Image URL** — paste a URL from the Media Library (portrait orientation works best).
3. Enter the **Property Name**.
4. Enter the **Project Link** — the URL visitors will go to when they click (e.g., `/celestia/townhouses`).
5. Click **Save**.

![Signature Listings page](/manual/signature_listings_page.png)

---

## 6. Lead Management

Navigate to **Leads & CRM → Leads** in the sidebar. *Moderator only.*

Leads are form submissions from the public website. Every time a visitor fills out a contact form, requests a brochure, signs up for the newsletter, or submits any other form, a lead is created.

### 6.1 Viewing Leads

The leads table shows all submissions with:
- **Email** and **Phone** — Contact details.
- **Name** — If the visitor provided one.
- **Message** — What they wrote (if applicable).
- **Source** — Where the lead came from (Contact, Brochure, Lakehouse, Newsletter, Exit Intent).
- **Project** — The project they inquired about (if applicable).
- **Created** — When they submitted the form.

The **bell icon** in the top header and the **badge on the Leads menu item** show how many new leads have arrived since you last viewed this page. When you open the Leads page, the counter resets to zero.

![Leads table](/manual/leads_table.png)

### 6.2 Filtering & Searching

Use the filters at the top of the page to narrow down leads:
- **Source** — Filter by where the lead originated (e.g., only Newsletter leads).
- **Date range** — Show leads from a specific time period.

### 6.3 Adding a Lead as a Contact

If a lead looks like a genuine prospect and you want to manage them in your CRM:

1. Find the lead in the table.
2. Click the **Add to contacts** button in the Actions column.
3. The lead's information will be copied into a new CRM contact.

If the lead's email already matches an existing contact, you will see an **orange user icon** instead. Click it to go directly to that existing contact.

### 6.4 Exporting Leads

1. Apply any filters you want (source, date range).
2. Click the **Export** button at the top of the page.
3. A CSV file will download with all leads matching your current filters.

![Export button and lead actions](/manual/export_button.png)

---

## 7. CRM — Contacts

Navigate to **Leads & CRM → Contacts** in the sidebar. *Moderator only.*

Contacts are people you actively manage and communicate with — prospective buyers, existing clients, partners, etc.

### 7.1 Browsing Contacts

The contacts table shows:
- **Name**, **Email**, **Phone**, **Company**
- **Status** — Current stage in your pipeline (New Lead, Contacted, Engaged, Qualified, Negotiation, Converted, Dormant).
- **Segments** — Colored badges showing which segments the contact belongs to.
- **Source** — How they entered your system.
- **Created** — When the contact was added.

Use the filters at the top to narrow results:
- **Status** dropdown — Show only contacts at a specific pipeline stage.
- **Segment** dropdown — Show only contacts in a specific segment.
- **Search** — Find contacts by name or email.

![Contacts table](/manual/contacts_table.png)

### 7.2 Adding a Contact Manually

1. Click the **Add contact** button.
2. Fill in the form:
   - **Name** — Full name.
   - **Email** — Required. Must be unique.
   - **Phone** — Phone number with country code.
   - **Company** — Company or organization name.
   - **Source** — How you know this contact.
   - **Status** — Their current pipeline stage.
   - **Tags** — Comma-separated keywords for extra categorization.
   - **Segments** — Select one or more segments to assign this contact to.
3. Click **Create contact**.

![Add contact form](/manual/add_contact_form.png)

### 7.3 Viewing & Editing a Contact

**Viewing:** Click a contact's name in the table to open their detail page. Here you will find:
- **Quick Info** sidebar — Status, email, phone, company, source, segments, and tags at a glance.
- **Status dropdown** — Change the contact's pipeline stage directly.
- **Segments** — Toggle segments on or off for this contact by clicking the segment buttons.
- **Notes timeline** — A chronological log of notes and updates.

**Editing:** Click the **Edit** button to open the full edit form. Update any field and click **Save**.

![Contact detail page](/manual/contact_detail_page.png)

### 7.4 Contact Notes

On the contact detail page, you can add notes to track interactions:

1. Scroll to the **Notes** section.
2. Type your note in the text area.
3. Click **Add note**.
4. Notes appear in reverse chronological order with timestamps.

Use notes to record phone calls, meeting summaries, follow-up reminders, or any relevant context.

### 7.5 Importing Contacts

You can bulk-import contacts from a CSV or Excel file.

1. On the Contacts page, click the **Import** button.
2. A dialog will open with three steps:

**Step 1 — Upload**
- Click **Download template** to get a sample CSV file showing the expected format.
- Select your CSV or Excel file (`.csv`, `.xlsx`, or `.xls`).
- Expected columns: `email` (required), `name`, `phone`, `country_code`, `company`, `source`, `status`, `tags`.

**Step 2 — Map & Preview**
- Map each column in your file to the correct contact field.
- Optionally select one or more **segments** to assign all imported contacts to.
- Preview the first 5 rows to confirm the mapping looks correct.

**Step 3 — Results**
- The import runs and shows a summary:
  - **Created** — New contacts added.
  - **Updated** — Existing contacts (matched by email) that were updated with new data.
  - **Failed** — Rows that could not be imported, with error details.

> **Note:** If an imported email already exists in your contacts, the existing contact will be updated with any new non-empty fields from the file. It will not create a duplicate.

![Import dialog — upload step](/manual/import_dialog_upload_step.png)
![Import dialog — map step](/manual/import_dialog_map_step.png)
![Import dialog — results step](/manual/import_dialog_upload_step_2.png)

### 7.6 Bulk Actions

You can select multiple contacts and apply actions to all of them at once.

1. Use the **checkboxes** in the left column to select individual contacts, or use the checkbox in the table header to select all visible contacts.
2. A **blue action bar** appears at the top showing how many contacts are selected.
3. Choose a **segment** from the dropdown in the action bar.
4. Click **Add to segment** to assign all selected contacts to that segment.
5. Click **Remove from segment** to remove all selected contacts from that segment.

![Bulk action bar](/manual/bulk_action_bar_with_selections.png)

---

## 8. CRM — Segments

Segments let you group contacts into meaningful categories. Examples: "Real Clients," "US Clients," "Celestia Interested," "VIP."

The segment manager is located on the right side of the **Contacts** page.

### 8.1 Creating a Segment

1. In the **Segment Manager** panel, type a name in the input field.
2. Click the **color circle** to choose a color, or pick from the preset colors.
3. Click the **+** button or press Enter to create the segment.

You can **edit** a segment's name or color by clicking on it in the list, and **delete** a segment by clicking the trash icon.

> **Note:** Deleting a segment removes the grouping but does not delete the contacts within it.

![Segment manager](/manual/segment_manager.png)

### 8.2 Assigning Contacts to Segments

There are several ways to assign contacts to segments:

- **From the contact detail page** — Click segment buttons in the Quick Info sidebar to toggle them on or off.
- **From the edit form** — Select segments in the segment picker when creating or editing a contact.
- **During import** — Choose segments in Step 2 of the import dialog.
- **In bulk** — Select multiple contacts with checkboxes and use the bulk action bar (see Section 7.6).

### 8.3 Filtering by Segment

On the Contacts page, use the **Segment** dropdown filter to show only contacts belonging to a specific segment.

---

## 9. CRM — Pipeline

Navigate to **Leads & CRM → Pipeline** in the sidebar.

The Pipeline page presents your contacts as a **Kanban board** organized by status:

| New Lead | Contacted | Engaged | Qualified | Negotiation | Converted | Dormant |
|---|---|---|---|---|---|---|

Each contact appears as a card showing their name and email.

**To move a contact to a different stage**, drag and drop their card from one column to another. The contact's status will be updated automatically.

This gives you a visual overview of where all your prospects stand in the sales process.

![Pipeline Kanban board](/manual/pipeline_kanban_board.png)

---

## 10. CRM — Email Templates

Navigate to **Leads & CRM → Email Templates** in the sidebar.

Email templates are reusable message layouts for your campaigns.

#### Creating a Template

1. Click **New template**.
2. Enter a **Name** for internal reference (e.g., "Welcome Email").
3. Enter the **Subject** line.
4. Write the **Body** of the email.
5. Use **variables** to personalize the email. Available variables:
   - `{{name}}` — The contact's full name.
   - `{{email}}` — The contact's email address.
   - `{{company}}` — The contact's company.
6. Click **Save**.

#### Editing a Template

Click a template in the list to edit its subject, body, or name.

![Email template editor](/manual/email_template_editor.png)

---

## 11. CRM — Campaigns

Navigate to **Leads & CRM → Campaigns** in the sidebar.

Campaigns let you send an email template to a group of contacts.

### 11.1 Creating a Campaign

1. Click **New campaign**.
2. Enter a **Campaign name**.
3. Select an **Email template** to use.
4. Choose your **recipients**:
   - Select contacts by **segment**, or
   - Pick individual contacts.
5. Click **Create campaign**.

> **Note:** Contacts with a status of "Do not contact" or "Unsubscribed" are automatically excluded.

### 11.2 Sending a Campaign

1. Open the campaign from the campaigns list.
2. Review the recipients and email content.
3. Click **Send**. Emails are sent in batches of up to 10 at a time.
4. You can click Send multiple times to process all recipients.

**Rate limits:** To protect your sender reputation, the system enforces a maximum of 20 emails per hour and 50 emails per day by default.

### 11.3 Viewing Campaign Results

After sending, the campaign detail page shows:
- **Total recipients**
- **Sent count**
- **Pending** emails still to be sent
- Campaign **status** (Draft, Sending, Completed)

![Campaign detail page](/manual/campaign_detail_page.png)

---

## 12. CRM — Analytics

Navigate to **Leads & CRM → Analytics** in the sidebar.

The analytics page gives you a snapshot of your CRM data:

- **Total Contacts** — Overall count.
- **New Leads** — Contacts at the "New Lead" stage.
- **Converted** — Contacts that reached "Converted" status.
- **Pipeline Distribution** — A chart showing how many contacts are at each stage.
- **Leads Over Time** — A 30-day trend line of new leads arriving.
- **Source Breakdown** — A chart showing where your contacts came from.

![Analytics page](/manual/analytics_page.png)

---

## 13. User Management

Navigate to **Admin → Users** in the sidebar. *Moderator only.*

### 13.1 Inviting a New User

1. Click the **Invite user** button.
2. Enter the person's **email address**.
3. Select a **role** (Moderator or Author).
4. Click **Send invite**.
5. The person will receive an invitation email with a link to set their password.

Pending invitations are shown at the top of the Users page until accepted.

### 13.2 Assigning & Removing Roles

1. Find the user in the list.
2. Click the **role badge** or use the actions menu to add or remove roles.
3. Changes take effect immediately.

### 13.3 Deleting a User

1. Click the **Delete** button next to the user.
2. Confirm the deletion.

> **Note:** You cannot delete your own account. The user's posts will remain in the system.

![Users page](/manual/users_page.png)

---

## 14. Your Profile

Navigate to **Admin → Profile** in the sidebar.

Your profile page lets you manage your personal information.

- **Email** — Shown for reference (cannot be changed here).
- **Full Name** — Your display name, shown on blog posts you author.
- **Bio** — A short description of yourself (required, max 300 characters). Shown on your author profile in blog posts.
- **Avatar** — Your profile photo, displayed in the sidebar and on your authored posts.
- **Roles** — Your current roles (read-only).
- **Password** — Change your password.

### 14.1 Uploading an Avatar

1. Click the **circular avatar area** (it shows your initials if no photo is set).
2. A camera icon overlay appears on hover — click to open the file picker.
3. Select an image file from your computer.
   - Accepted formats: **JPEG, PNG, WebP, GIF**.
   - Maximum size: **6 MB**.
4. The image uploads automatically and a preview appears.
5. Click **Save profile** to confirm the change.

To remove your avatar, click the **Remove avatar** link below the image, then save.

![Profile page](/manual/profile_page_with_avatar_upload.png)

### 14.2 Changing Your Password

1. On the Profile page, scroll to the **New password** field.
2. Enter your new password.
3. Click **Save profile**.

Leave the password field blank if you do not want to change it.

---

## 15. Public Website Overview

This section describes the pages that visitors see on the public website. As a team member, you control the content that appears on many of these pages.

### 15.1 Home Page

The landing page introduces Brownstone Construction with:
- A hero section with a call-to-action.
- Company values: Luxury, Sustainability, Precision.
- Featured projects: Celestia, East Legon Trio, Wilma Crescent.
- "Why Choose Us" section highlighting Master Planning, Quality Assurance, Smart Integration, and Client Partnership.
- A contact call-to-action at the bottom.

### 15.2 About Page

Tells the story of Brownstone Construction:
- Mission and Vision statements.
- Impact statistics (Sustainable Sourcing, Years of Excellence, Iconic Projects).
- Heritage timeline (milestones from 2024–2025).
- Leadership team profiles.

### 15.3 Services Page

Showcases the six service categories:
1. Residential Construction
2. Master-Planned Communities
3. Sustainable Infrastructure
4. Real Estate Development
5. Project Management
6. Mixed-Use Spaces

### 15.4 Portfolio Page

A visual gallery of completed and in-progress projects. Visitors can filter by project (Celestia, East Legon Trio, Wilma Crescent, Others) and view images in a lightbox.

### 15.5 Celestia Pages

Celestia is the flagship luxury residential development in Akosombo, Ghana (90 minutes from Accra). The Celestia section includes:

- **Main page** (`/celestia`) — Overview of the development, philosophy, and residences.
- **Townhouses** (`/celestia/townhouses`) — Detailed information, galleries, investment details, and ownership process.
- **Chalets** (`/celestia/chalets`) — Chalet-specific features and amenities.
- **Lakehouse** (`/celestia/lakehouse`) — Lakefront property details and amenities.

Each page includes a **brochure request form**. When a visitor submits their email, they receive the brochure via email, and a lead is created in your system.

### 15.6 Blog

The blog is powered by the posts you create in the admin panel.

- **Blog listing page** — Shows all published posts with a featured post at the top. Visitors can filter by category. The sidebar shows a newsletter signup form, popular topics, and the four Signature Listings (Now Selling).
- **Blog post page** — Displays the full article with the author's photo and bio, a reading progress bar, social share buttons, related posts, and the newsletter/Signature Listings sidebar.

**Newsletter signup:** When a visitor enters their email in the newsletter form, they are automatically added as both a lead (source: Newsletter) and a contact in your CRM.

### 15.7 Contact Page

The public contact page allows visitors to reach out by filling in:
- Name, Email, Project type (dropdown), and Message.

When submitted:
- A **lead** is created in the system.
- A **notification email** is sent to the team.
- An **auto-reply** is sent to the visitor confirming receipt.

---

## 16. Lead Sources Explained

Leads arrive from several places on the public website. Here is what each source means:

| Source | Where It Comes From | What It Captures |
|---|---|---|
| **Contact** | The Contact Us page form | Name, email, project type, message |
| **Brochure** | Celestia brochure request forms | Email, project name |
| **Lakehouse** | Lakehouse-specific inquiry form | Email, phone, message |
| **Newsletter** | Blog sidebar and CTA newsletter signup | Email |
| **Exit Intent** | Popup shown when a visitor is about to leave | Email |

All sources create a lead entry visible on the Leads page. Newsletter signups are also automatically created as CRM contacts.

---

## 17. Frequently Asked Questions

**Q: I created a post but it doesn't appear on the blog. Why?**
A: Make sure the post status is set to **Published**, not Draft. If you are an Author, ask a Moderator to publish it.

**Q: A visitor submitted a form but I don't see a new lead notification.**
A: Lead notifications update every 30 seconds. Refresh the page or wait a moment. If the issue persists, check that the lead actually arrived on the Leads page — the form submission may have failed on the visitor's end.

**Q: I accidentally deleted a post / contact / segment. Can I recover it?**
A: No. Deletions are permanent. Please be careful before confirming any deletion.

**Q: How many emails can I send in a campaign?**
A: By default, the system allows up to 20 emails per hour and 50 per day. Emails are sent in batches of up to 10.

**Q: What happens when I import contacts with emails that already exist?**
A: Existing contacts are **updated** with any new non-empty fields from the import file. No duplicates are created.

**Q: Can I use the CRM if I'm an Author?**
A: No. The CRM (Contacts, Leads, Pipeline, Campaigns, Templates, Analytics) is only available to Moderators. As an Author, you can create and edit blog posts and manage your profile.

**Q: What image formats can I upload?**
A: JPEG, PNG, WebP, and GIF. Maximum file size is 6 MB. SVG files are not accepted for security reasons.

**Q: How do I add a property to the blog sidebar?**
A: Go to **Content → Signature Listings** and update one of the four slots with the property image URL, name, and link.

**Q: I deleted a media file but the image still appears in my post. Why?**
A: Deleted files may be cached briefly. The image will disappear from the post once the cache expires. To fix it immediately, edit the post and replace or remove the image reference.

---

## Platform & Services

| Service | Provider |
|---|---|
| **Database** | Supabase |
| **CDN & Nameservers** | Cloudflare / R2 |
| **Email Service** | Postmark |
| **Analytics** | Google Analytics (creative@brownstoneltd.com) |
| **Hosting** | Vercel |

---

*This manual is current as of February 2026.*
