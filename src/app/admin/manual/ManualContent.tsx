"use client";

import { useRef } from "react";
import Image from "next/image";

function Img({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="block my-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={960}
        height={540}
        className="w-full h-auto"
        unoptimized
      />
    </span>
  );
}

function H1({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h1 id={id} className="text-3xl font-bold text-slate-900 mt-12 mb-4 scroll-mt-24 first:mt-0">
      {children}
    </h1>
  );
}

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-slate-800 mt-10 mb-3 scroll-mt-24 border-b border-slate-200 pb-2">
      {children}
    </h2>
  );
}

function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-xl font-semibold text-slate-700 mt-8 mb-2 scroll-mt-24">
      {children}
    </h3>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="text-lg font-semibold text-slate-700 mt-6 mb-2">{children}</h4>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 leading-relaxed mb-4">{children}</p>;
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 text-sm text-blue-800">
      <strong>Tip:</strong> {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-800">
      <strong>Note:</strong> {children}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-800">
      <strong>Warning:</strong> {children}
    </div>
  );
}

function OL({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal list-inside space-y-1 mb-4 text-slate-600 pl-2">{children}</ol>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc list-inside space-y-1 mb-4 text-slate-600 pl-2">{children}</ul>;
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-slate-800">{children}</strong>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
}

function HR() {
  return <hr className="my-10 border-slate-200" />;
}

const TOC = [
  { id: "introduction", label: "1. Introduction" },
  { id: "getting-started", label: "2. Getting Started" },
  { id: "roles", label: "3. Understanding Roles" },
  { id: "dashboard", label: "4. The Dashboard" },
  { id: "content", label: "5. Content Management" },
  { id: "leads", label: "6. Lead Management" },
  { id: "contacts", label: "7. CRM — Contacts" },
  { id: "segments", label: "8. CRM — Segments" },
  { id: "pipeline", label: "9. CRM — Pipeline" },
  { id: "templates", label: "10. CRM — Email Templates" },
  { id: "campaigns", label: "11. CRM — Campaigns" },
  { id: "analytics", label: "12. CRM — Analytics" },
  { id: "users", label: "13. User Management" },
  { id: "profile", label: "14. Your Profile" },
  { id: "public-site", label: "15. Public Website Overview" },
  { id: "lead-sources", label: "16. Lead Sources Explained" },
  { id: "faq", label: "17. FAQ" },
];

export function ManualContent() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Manual</h1>
          <p className="text-slate-500 mt-1">Complete guide to using the Brownstone Admin panel</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* Table of Contents */}
      <nav className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10 print:mb-6 print:break-after-page">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Table of Contents</h2>
        <ol className="space-y-1.5 columns-1 sm:columns-2">
          {TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-sm text-primary hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content */}
      <div ref={printRef} className="prose-manual">
        {/* ==== 1. INTRODUCTION ==== */}
        <H2 id="introduction">1. Introduction</H2>
        <P>
          The <B>Brownstone Admin</B> panel is the back-office system for managing the Brownstone Construction
          website, blog, leads, and customer relationships. From this panel you can publish articles, track
          prospective clients, run email campaigns, and manage the team.
        </P>
        <P>This manual walks you through every feature, step by step.</P>

        <HR />

        {/* ==== 2. GETTING STARTED ==== */}
        <H2 id="getting-started">2. Getting Started</H2>

        <H3 id="accepting-invitation">2.1 Accepting Your Invitation</H3>
        <P>
          When a moderator invites you to the platform, you will receive an email containing a secure invitation link.
        </P>
        <OL>
          <Li>Open the email and click the invitation link.</Li>
          <Li>You will be taken to the <B>Set Password</B> page.</Li>
          <Li>Enter a strong password (at least 8 characters).</Li>
          <Li>Click <B>Update password</B>.</Li>
          <Li>You will be redirected to the admin dashboard.</Li>
        </OL>
        <Tip>If the invitation link has expired, ask your moderator to send a new one from the Users page.</Tip>
        <Img src="/manual/invitation_email.png" alt="Invitation email" />

        <H3 id="logging-in">2.2 Logging In</H3>
        <OL>
          <Li>Navigate to the admin login page. You can find a small &ldquo;Admin&rdquo; link in the website footer, or go directly to <Code>/admin/login</Code>.</Li>
          <Li>Enter your <B>email</B> and <B>password</B>.</Li>
          <Li>Click <B>Sign in</B>.</Li>
          <Li>You will be taken to the Dashboard.</Li>
        </OL>
        <Img src="/manual/login_page.png" alt="Login page" />

        <H3 id="reset-password">2.3 Resetting Your Password</H3>
        <P>If you have forgotten your password:</P>
        <OL>
          <Li>On the login page, click <B>Forgot password?</B></Li>
          <Li>Enter your email address.</Li>
          <Li>Click <B>Send reset link</B>.</Li>
          <Li>Check your inbox for the reset email and click the link inside.</Li>
          <Li>Enter your new password and confirm.</Li>
        </OL>
        <Note>For security, the reset link expires after a short time. You may request up to 3 reset links per hour.</Note>
        <Img src="/manual/reset_password_page.png" alt="Reset password page" />

        <HR />

        {/* ==== 3. UNDERSTANDING ROLES ==== */}
        <H2 id="roles">3. Understanding Roles</H2>
        <P>Every user is assigned one or more roles that determine what they can see and do.</P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">Capability</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-700 border-b">Moderator</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-700 border-b">Author</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["View dashboard overview", true, true],
                ["Create & edit own posts", true, true],
                ["Edit & publish any post", true, false],
                ["Manage categories", true, false],
                ["Manage media library", true, true],
                ["Delete media files", true, false],
                ["Manage Signature Listings", true, false],
                ["View & manage leads", true, false],
                ["Access CRM (Contacts, Pipeline, Campaigns, Templates, Analytics)", true, false],
                ["Import contacts", true, false],
                ["Manage segments", true, false],
                ["Invite & manage users", true, false],
              ].map(([cap, mod, auth], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-2.5 text-slate-600">{cap as string}</td>
                  <td className="px-4 py-2.5 text-center">{mod ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-2.5 text-center">{auth ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-slate-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <P><B>Moderator</B> — Full access to content management, leads, and the full CRM. Can invite users and manage the team.</P>
        <P><B>Author</B> — Can create and edit their own blog posts. Cannot access leads, the CRM, or user management. The sidebar shows only Content and Profile sections.</P>

        <HR />

        {/* ==== 4. DASHBOARD ==== */}
        <H2 id="dashboard">4. The Dashboard</H2>
        <P>The dashboard is the first screen you see after logging in. It provides a high-level overview of your system.</P>
        <P><B>Content cards:</B></P>
        <UL>
          <Li><B>Draft Posts</B> — Number of posts saved as drafts.</Li>
          <Li><B>Published Posts</B> — Number of live posts on the blog.</Li>
          <Li><B>Total Posts</B> — Combined count of all posts.</Li>
        </UL>
        <P><B>CRM &amp; Team cards</B> (visible to Moderators only):</P>
        <UL>
          <Li><B>Contacts</B> — Total contacts in the CRM.</Li>
          <Li><B>Campaigns</B> — Number of email campaigns.</Li>
          <Li><B>Leads</B> — Total form submissions received.</Li>
          <Li><B>Users</B> — Number of team members.</Li>
        </UL>
        <P>Below the cards you will find a <B>Recent Posts</B> table showing the latest articles with their author, status, and date.</P>
        <P><B>Quick actions:</B> Click <B>New post</B> to jump straight into the post editor.</P>
        <Img src="/manual/dashboard.png" alt="Dashboard" />


        <HR />

        {/* ==== 5. CONTENT MANAGEMENT ==== */}
        <H2 id="content">5. Content Management</H2>

        <H3 id="posts">5.1 Posts</H3>
        <P>Navigate to <B>Content → Posts</B> in the sidebar.</P>

        <H4>Viewing Posts</H4>
        <P>The posts list shows all blog articles across the team. You can:</P>
        <UL>
          <Li><B>Search</B> by title, slug, or excerpt using the search bar.</Li>
          <Li>See each post&rsquo;s <B>author</B>, <B>status</B> (Draft or Published), and <B>date</B>.</Li>
        </UL>

        <H4>Creating a New Post</H4>
        <OL>
          <Li>Click the <B>New post</B> button.</Li>
          <Li>Fill in the following fields:</Li>
        </OL>
        <UL>
          <Li><B>Title</B> — The headline of your article.</Li>
          <Li><B>Slug</B> — Auto-generated from the title. You can edit it manually. This becomes the URL (e.g., <Code>/blog/your-slug</Code>).</Li>
          <Li><B>Excerpt</B> — A short summary shown on the blog listing and in search results.</Li>
          <Li><B>Cover Image</B> — Upload a cover photo using the image upload button.</Li>
          <Li><B>Content</B> — Write your article using the rich text editor. You can add headings, bold/italic text, lists, links, and images.</Li>
          <Li><B>Categories</B> — Select one or more categories for the post.</Li>
          <Li><B>Featured</B> — Toggle this on to feature the post prominently on the blog page.</Li>
          <Li><B>Status</B> — Choose <B>Draft</B> to save privately, or <B>Published</B> to make it live.</Li>
        </UL>
        <OL>
          <Li>Click <B>Save</B> or <B>Publish</B>.</Li>
        </OL>
        <Note>Authors can save drafts but cannot publish. A Moderator must publish your post.</Note>

        <H4>Editing a Post</H4>
        <OL>
          <Li>In the posts list, click the <B>Edit</B> button (pencil icon) next to the post.</Li>
          <Li>Make your changes.</Li>
          <Li>Click <B>Save</B>.</Li>
        </OL>

        <H4>Deleting a Post</H4>
        <OL>
          <Li>Click the <B>Delete</B> button (trash icon) next to the post.</Li>
          <Li>Confirm the deletion in the dialog.</Li>
        </OL>
        <Warning>Deleted posts cannot be recovered.</Warning>
        <Img src="/manual/post_list.png" alt="Posts list" />
        <Img src="/manual/post_editor.png" alt="Post editor" />

        <H3 id="categories">5.2 Categories</H3>
        <P>Navigate to <B>Content → Categories</B> in the sidebar. <em className="text-slate-500">Moderator only.</em></P>
        <P>Categories help organize blog posts. Visitors can filter articles by category on the public blog page.</P>
        <H4>Creating a Category</H4>
        <OL>
          <Li>Enter the <B>Name</B> in the input field.</Li>
          <Li>The <B>Slug</B> is generated automatically.</Li>
          <Li>Optionally add a <B>Description</B>.</Li>
          <Li>Click <B>Create</B>.</Li>
        </OL>
        <H4>Editing or Deleting a Category</H4>
        <UL>
          <Li>Click the <B>Edit</B> button next to a category to change its name or description.</Li>
          <Li>Click the <B>Delete</B> button to remove it. Posts in that category will not be deleted, but they will no longer be associated with it.</Li>
        </UL>
        <Img src="/manual/categories_page.png" alt="Categories page" />

        <H3 id="media">5.3 Media Library</H3>
        <P>Navigate to <B>Content → Media</B> in the sidebar.</P>
        <P>The media library stores all images uploaded to the platform.</P>

        <H4>Uploading an Image</H4>
        <OL>
          <Li>Click the <B>Upload</B> button.</Li>
          <Li>Select an image file from your computer.</Li>
          <Li>Accepted formats: <B>JPEG, PNG, WebP, GIF</B>.</Li>
          <Li>Maximum file size: <B>6 MB</B>.</Li>
          <Li>The image will appear in the library once uploaded.</Li>
        </OL>

        <H4>Using an Image</H4>
        <UL>
          <Li>Click the <B>Copy URL</B> button on any image to copy its public URL to your clipboard.</Li>
          <Li>Paste the URL into a post&rsquo;s cover image field, or use it anywhere else you need an image link.</Li>
        </UL>

        <H4>Deleting an Image</H4>
        <P><em className="text-slate-500">Moderator only.</em> To remove an image from the media library:</P>
        <OL>
          <Li>Hover over the image you want to delete.</Li>
          <Li>Click the <B>Delete</B> button (trash icon) that appears in the top-right corner of the image card.</Li>
          <Li>Confirm the deletion in the dialog.</Li>
        </OL>
        <Warning>Deleting a media file is permanent. If the image is used in a blog post or elsewhere, those references will show a broken image.</Warning>
        <Img src="/manual/media_library.png" alt="Media library" />

        <H3 id="signature-listings">5.4 Signature Listings</H3>
        <P>Navigate to <B>Content → Signature Listings</B> in the sidebar. <em className="text-slate-500">Moderator only.</em></P>
        <P>Signature Listings are the four featured property cards that appear in the blog sidebar under &ldquo;Now Selling.&rdquo; They give visitors a subtle view of current properties for sale.</P>
        <H4>Editing a Listing</H4>
        <OL>
          <Li>Each of the 4 slots shows its current image, name, and link.</Li>
          <Li>Update the <B>Image URL</B> — paste a URL from the Media Library (portrait orientation works best).</Li>
          <Li>Enter the <B>Property Name</B>.</Li>
          <Li>Enter the <B>Project Link</B> — the URL visitors will go to when they click (e.g., <Code>/celestia/townhouses</Code>).</Li>
          <Li>Click <B>Save</B>.</Li>
        </OL>
        <Img src="/manual/signature_listings_page.png" alt="Signature Listings page" />

        <HR />

        {/* ==== 6. LEAD MANAGEMENT ==== */}
        <H2 id="leads">6. Lead Management</H2>
        <P>Navigate to <B>Leads &amp; CRM → Leads</B> in the sidebar. <em className="text-slate-500">Moderator only.</em></P>
        <P>Leads are form submissions from the public website. Every time a visitor fills out a contact form, requests a brochure, signs up for the newsletter, or submits any other form, a lead is created.</P>

        <H3 id="viewing-leads">6.1 Viewing Leads</H3>
        <P>The leads table shows all submissions with:</P>
        <UL>
          <Li><B>Email</B> and <B>Phone</B> — Contact details.</Li>
          <Li><B>Name</B> — If the visitor provided one.</Li>
          <Li><B>Message</B> — What they wrote (if applicable).</Li>
          <Li><B>Source</B> — Where the lead came from (Contact, Brochure, Lakehouse, Newsletter, Exit Intent).</Li>
          <Li><B>Project</B> — The project they inquired about (if applicable).</Li>
          <Li><B>Created</B> — When they submitted the form.</Li>
        </UL>
        <P>The <B>bell icon</B> in the top header and the <B>badge on the Leads menu item</B> show how many new leads have arrived since you last viewed this page. When you open the Leads page, the counter resets to zero.</P>
        <Img src="/manual/leads_table.png" alt="Leads table" />

        <H3 id="filtering-leads">6.2 Filtering &amp; Searching</H3>
        <P>Use the filters at the top of the page to narrow down leads:</P>
        <UL>
          <Li><B>Source</B> — Filter by where the lead originated (e.g., only Newsletter leads).</Li>
          <Li><B>Date range</B> — Show leads from a specific time period.</Li>
        </UL>

        <H3 id="add-lead-contact">6.3 Adding a Lead as a Contact</H3>
        <P>If a lead looks like a genuine prospect and you want to manage them in your CRM:</P>
        <OL>
          <Li>Find the lead in the table.</Li>
          <Li>Click the <B>Add to contacts</B> button in the Actions column.</Li>
          <Li>The lead&rsquo;s information will be copied into a new CRM contact.</Li>
        </OL>
        <P>If the lead&rsquo;s email already matches an existing contact, you will see an <B>orange user icon</B> instead. Click it to go directly to that existing contact.</P>

        <H3 id="exporting-leads">6.4 Exporting Leads</H3>
        <OL>
          <Li>Apply any filters you want (source, date range).</Li>
          <Li>Click the <B>Export</B> button at the top of the page.</Li>
          <Li>A CSV file will download with all leads matching your current filters.</Li>
        </OL>
        <Img src="/manual/export_button.png" alt="Export button and lead actions" />

        <HR />

        {/* ==== 7. CRM — CONTACTS ==== */}
        <H2 id="contacts">7. CRM — Contacts</H2>
        <P>Navigate to <B>Leads &amp; CRM → Contacts</B> in the sidebar. <em className="text-slate-500">Moderator only.</em></P>
        <P>Contacts are people you actively manage and communicate with — prospective buyers, existing clients, partners, etc.</P>

        <H3 id="browsing-contacts">7.1 Browsing Contacts</H3>
        <P>The contacts table shows:</P>
        <UL>
          <Li><B>Name</B>, <B>Email</B>, <B>Phone</B>, <B>Company</B></Li>
          <Li><B>Status</B> — Current stage in your pipeline (New Lead, Contacted, Engaged, Qualified, Negotiation, Converted, Dormant).</Li>
          <Li><B>Segments</B> — Colored badges showing which segments the contact belongs to.</Li>
          <Li><B>Source</B> — How they entered your system.</Li>
          <Li><B>Created</B> — When the contact was added.</Li>
        </UL>
        <P>Use the filters at the top to narrow results:</P>
        <UL>
          <Li><B>Status</B> dropdown — Show only contacts at a specific pipeline stage.</Li>
          <Li><B>Segment</B> dropdown — Show only contacts in a specific segment.</Li>
          <Li><B>Search</B> — Find contacts by name or email.</Li>
        </UL>
        <Img src="/manual/contacts_table.png" alt="Contacts table" />

        <H3 id="adding-contact">7.2 Adding a Contact Manually</H3>
        <OL>
          <Li>Click the <B>Add contact</B> button.</Li>
          <Li>Fill in the form:</Li>
        </OL>
        <UL>
          <Li><B>Name</B> — Full name.</Li>
          <Li><B>Email</B> — Required. Must be unique.</Li>
          <Li><B>Phone</B> — Phone number with country code.</Li>
          <Li><B>Company</B> — Company or organization name.</Li>
          <Li><B>Source</B> — How you know this contact.</Li>
          <Li><B>Status</B> — Their current pipeline stage.</Li>
          <Li><B>Tags</B> — Comma-separated keywords for extra categorization.</Li>
          <Li><B>Segments</B> — Select one or more segments to assign this contact to.</Li>
        </UL>
        <OL>
          <Li>Click <B>Create contact</B>.</Li>
        </OL>
        <Img src="/manual/add_contact_form.png" alt="Add contact form" />

        <H3 id="viewing-contact">7.3 Viewing &amp; Editing a Contact</H3>
        <P><B>Viewing:</B> Click a contact&rsquo;s name in the table to open their detail page. Here you will find:</P>
        <UL>
          <Li><B>Quick Info</B> sidebar — Status, email, phone, company, source, segments, and tags at a glance.</Li>
          <Li><B>Status dropdown</B> — Change the contact&rsquo;s pipeline stage directly.</Li>
          <Li><B>Segments</B> — Toggle segments on or off for this contact by clicking the segment buttons.</Li>
          <Li><B>Notes timeline</B> — A chronological log of notes and updates.</Li>
        </UL>
        <P><B>Editing:</B> Click the <B>Edit</B> button to open the full edit form. Update any field and click <B>Save</B>.</P>
        <Img src="/manual/contact_detail_page.png" alt="Contact detail page" />

        <H3 id="contact-notes">7.4 Contact Notes</H3>
        <P>On the contact detail page, you can add notes to track interactions:</P>
        <OL>
          <Li>Scroll to the <B>Notes</B> section.</Li>
          <Li>Type your note in the text area.</Li>
          <Li>Click <B>Add note</B>.</Li>
          <Li>Notes appear in reverse chronological order with timestamps.</Li>
        </OL>
        <P>Use notes to record phone calls, meeting summaries, follow-up reminders, or any relevant context.</P>

        <H3 id="importing-contacts">7.5 Importing Contacts</H3>
        <P>You can bulk-import contacts from a CSV or Excel file.</P>
        <OL>
          <Li>On the Contacts page, click the <B>Import</B> button.</Li>
          <Li>A dialog will open with three steps:</Li>
        </OL>

        <P><B>Step 1 — Upload</B></P>
        <UL>
          <Li>Click <B>Download template</B> to get a sample CSV file showing the expected format.</Li>
          <Li>Select your CSV or Excel file (<Code>.csv</Code>, <Code>.xlsx</Code>, or <Code>.xls</Code>).</Li>
          <Li>Expected columns: <Code>email</Code> (required), <Code>name</Code>, <Code>phone</Code>, <Code>country_code</Code>, <Code>company</Code>, <Code>source</Code>, <Code>status</Code>, <Code>tags</Code>.</Li>
        </UL>

        <P><B>Step 2 — Map &amp; Preview</B></P>
        <UL>
          <Li>Map each column in your file to the correct contact field.</Li>
          <Li>Optionally select one or more <B>segments</B> to assign all imported contacts to.</Li>
          <Li>Preview the first 5 rows to confirm the mapping looks correct.</Li>
        </UL>

        <P><B>Step 3 — Results</B></P>
        <UL>
          <Li><B>Created</B> — New contacts added.</Li>
          <Li><B>Updated</B> — Existing contacts (matched by email) that were updated with new data.</Li>
          <Li><B>Failed</B> — Rows that could not be imported, with error details.</Li>
        </UL>
        <Note>If an imported email already exists in your contacts, the existing contact will be updated with any new non-empty fields from the file. It will not create a duplicate.</Note>
        <Img src="/manual/import_dialog_upload_step.png" alt="Import dialog — upload step" />
        <Img src="/manual/import_dialog_map_step.png" alt="Import dialog — map step" />
        <Img src="/manual/import_dialog_upload_step_2.png" alt="Import dialog — results step" />

        <H3 id="bulk-actions">7.6 Bulk Actions</H3>
        <P>You can select multiple contacts and apply actions to all of them at once.</P>
        <OL>
          <Li>Use the <B>checkboxes</B> in the left column to select individual contacts, or use the checkbox in the table header to select all visible contacts.</Li>
          <Li>A <B>blue action bar</B> appears at the top showing how many contacts are selected.</Li>
          <Li>Choose a <B>segment</B> from the dropdown in the action bar.</Li>
          <Li>Click <B>Add to segment</B> to assign all selected contacts to that segment.</Li>
          <Li>Click <B>Remove from segment</B> to remove all selected contacts from that segment.</Li>
        </OL>
        <Img src="/manual/bulk_action_bar_with_selections.png" alt="Bulk action bar" />

        <HR />

        {/* ==== 8. CRM — SEGMENTS ==== */}
        <H2 id="segments">8. CRM — Segments</H2>
        <P>Segments let you group contacts into meaningful categories. Examples: &ldquo;Real Clients,&rdquo; &ldquo;US Clients,&rdquo; &ldquo;Celestia Interested,&rdquo; &ldquo;VIP.&rdquo;</P>
        <P>The segment manager is located on the right side of the <B>Contacts</B> page.</P>

        <H3 id="creating-segment">8.1 Creating a Segment</H3>
        <OL>
          <Li>In the <B>Segment Manager</B> panel, type a name in the input field.</Li>
          <Li>Click the <B>color circle</B> to choose a color, or pick from the preset colors.</Li>
          <Li>Click the <B>+</B> button or press Enter to create the segment.</Li>
        </OL>
        <P>You can <B>edit</B> a segment&rsquo;s name or color by clicking on it in the list, and <B>delete</B> a segment by clicking the trash icon.</P>
        <Note>Deleting a segment removes the grouping but does not delete the contacts within it.</Note>
        <Img src="/manual/segment_manager.png" alt="Segment manager" />

        <H3 id="assigning-segments">8.2 Assigning Contacts to Segments</H3>
        <P>There are several ways to assign contacts to segments:</P>
        <UL>
          <Li><B>From the contact detail page</B> — Click segment buttons in the Quick Info sidebar to toggle them on or off.</Li>
          <Li><B>From the edit form</B> — Select segments in the segment picker when creating or editing a contact.</Li>
          <Li><B>During import</B> — Choose segments in Step 2 of the import dialog.</Li>
          <Li><B>In bulk</B> — Select multiple contacts with checkboxes and use the bulk action bar (see Section 7.6).</Li>
        </UL>

        <H3 id="filtering-segments">8.3 Filtering by Segment</H3>
        <P>On the Contacts page, use the <B>Segment</B> dropdown filter to show only contacts belonging to a specific segment.</P>

        <HR />

        {/* ==== 9. PIPELINE ==== */}
        <H2 id="pipeline">9. CRM — Pipeline</H2>
        <P>Navigate to <B>Leads &amp; CRM → Pipeline</B> in the sidebar.</P>
        <P>The Pipeline page presents your contacts as a <B>Kanban board</B> organized by status:</P>

        <div className="overflow-x-auto mb-4">
          <div className="flex gap-3 min-w-max">
            {["New Lead", "Contacted", "Engaged", "Qualified", "Negotiation", "Converted", "Dormant"].map((stage) => (
              <div key={stage} className="w-32 bg-slate-100 rounded-lg px-3 py-2 text-center text-xs font-semibold text-slate-600">
                {stage}
              </div>
            ))}
          </div>
        </div>

        <P>Each contact appears as a card showing their name and email.</P>
        <P><B>To move a contact to a different stage</B>, drag and drop their card from one column to another. The contact&rsquo;s status will be updated automatically.</P>
        <P>This gives you a visual overview of where all your prospects stand in the sales process.</P>
        <Img src="/manual/pipeline_kanban_board.png" alt="Pipeline Kanban board" />

        <HR />

        {/* ==== 10. EMAIL TEMPLATES ==== */}
        <H2 id="templates">10. CRM — Email Templates</H2>
        <P>Navigate to <B>Leads &amp; CRM → Email Templates</B> in the sidebar.</P>
        <P>Email templates are reusable message layouts for your campaigns.</P>

        <H4>Creating a Template</H4>
        <OL>
          <Li>Click <B>New template</B>.</Li>
          <Li>Enter a <B>Name</B> for internal reference (e.g., &ldquo;Welcome Email&rdquo;).</Li>
          <Li>Enter the <B>Subject</B> line.</Li>
          <Li>Write the <B>Body</B> of the email.</Li>
          <Li>Use <B>variables</B> to personalize the email. Available variables:</Li>
        </OL>
        <UL>
          <Li><Code>{"{{name}}"}</Code> — The contact&rsquo;s full name.</Li>
          <Li><Code>{"{{email}}"}</Code> — The contact&rsquo;s email address.</Li>
          <Li><Code>{"{{company}}"}</Code> — The contact&rsquo;s company.</Li>
        </UL>
        <OL>
          <Li>Click <B>Save</B>.</Li>
        </OL>

        <H4>Editing a Template</H4>
        <P>Click a template in the list to edit its subject, body, or name.</P>
        <Img src="/manual/email_template_editor.png" alt="Email template editor" />

        <HR />

        {/* ==== 11. CAMPAIGNS ==== */}
        <H2 id="campaigns">11. CRM — Campaigns</H2>
        <P>Navigate to <B>Leads &amp; CRM → Campaigns</B> in the sidebar.</P>
        <P>Campaigns let you send an email template to a group of contacts.</P>

        <H3 id="creating-campaign">11.1 Creating a Campaign</H3>
        <OL>
          <Li>Click <B>New campaign</B>.</Li>
          <Li>Enter a <B>Campaign name</B>.</Li>
          <Li>Select an <B>Email template</B> to use.</Li>
          <Li>Choose your <B>recipients</B>:</Li>
        </OL>
        <UL>
          <Li>Select contacts by <B>segment</B>, or</Li>
          <Li>Pick individual contacts.</Li>
        </UL>
        <OL>
          <Li>Click <B>Create campaign</B>.</Li>
        </OL>
        <Note>Contacts with a status of &ldquo;Do not contact&rdquo; or &ldquo;Unsubscribed&rdquo; are automatically excluded.</Note>

        <H3 id="sending-campaign">11.2 Sending a Campaign</H3>
        <OL>
          <Li>Open the campaign from the campaigns list.</Li>
          <Li>Review the recipients and email content.</Li>
          <Li>Click <B>Send</B>. Emails are sent in batches of up to 10 at a time.</Li>
          <Li>You can click Send multiple times to process all recipients.</Li>
        </OL>
        <P><B>Rate limits:</B> To protect your sender reputation, the system enforces a maximum of 20 emails per hour and 50 emails per day by default.</P>

        <H3 id="campaign-results">11.3 Viewing Campaign Results</H3>
        <P>After sending, the campaign detail page shows:</P>
        <UL>
          <Li><B>Total recipients</B></Li>
          <Li><B>Sent count</B></Li>
          <Li><B>Pending</B> emails still to be sent</Li>
          <Li>Campaign <B>status</B> (Draft, Sending, Completed)</Li>
        </UL>
        <Img src="/manual/campaign_detail_page.png" alt="Campaign detail page" />

        <HR />

        {/* ==== 12. ANALYTICS ==== */}
        <H2 id="analytics">12. CRM — Analytics</H2>
        <P>Navigate to <B>Leads &amp; CRM → Analytics</B> in the sidebar.</P>
        <P>The analytics page gives you a snapshot of your CRM data:</P>
        <UL>
          <Li><B>Total Contacts</B> — Overall count.</Li>
          <Li><B>New Leads</B> — Contacts at the &ldquo;New Lead&rdquo; stage.</Li>
          <Li><B>Converted</B> — Contacts that reached &ldquo;Converted&rdquo; status.</Li>
          <Li><B>Pipeline Distribution</B> — A chart showing how many contacts are at each stage.</Li>
          <Li><B>Leads Over Time</B> — A 30-day trend line of new leads arriving.</Li>
          <Li><B>Source Breakdown</B> — A chart showing where your contacts came from.</Li>
        </UL>
        <Img src="/manual/analytics_page.png" alt="Analytics page" />

        <HR />

        {/* ==== 13. USER MANAGEMENT ==== */}
        <H2 id="users">13. User Management</H2>
        <P>Navigate to <B>Admin → Users</B> in the sidebar. <em className="text-slate-500">Moderator only.</em></P>

        <H3 id="inviting-user">13.1 Inviting a New User</H3>
        <OL>
          <Li>Click the <B>Invite user</B> button.</Li>
          <Li>Enter the person&rsquo;s <B>email address</B>.</Li>
          <Li>Select a <B>role</B> (Moderator or Author).</Li>
          <Li>Click <B>Send invite</B>.</Li>
          <Li>The person will receive an invitation email with a link to set their password.</Li>
        </OL>
        <P>Pending invitations are shown at the top of the Users page until accepted.</P>

        <H3 id="assigning-roles">13.2 Assigning &amp; Removing Roles</H3>
        <OL>
          <Li>Find the user in the list.</Li>
          <Li>Click the <B>role badge</B> or use the actions menu to add or remove roles.</Li>
          <Li>Changes take effect immediately.</Li>
        </OL>

        <H3 id="deleting-user">13.3 Deleting a User</H3>
        <OL>
          <Li>Click the <B>Delete</B> button next to the user.</Li>
          <Li>Confirm the deletion.</Li>
        </OL>
        <Note>You cannot delete your own account. The user&rsquo;s posts will remain in the system.</Note>
        <Img src="/manual/users_page.png" alt="Users page" />

        <HR />

        {/* ==== 14. PROFILE ==== */}
        <H2 id="profile">14. Your Profile</H2>
        <P>Navigate to <B>Admin → Profile</B> in the sidebar.</P>
        <P>Your profile page lets you manage your personal information.</P>
        <UL>
          <Li><B>Email</B> — Shown for reference (cannot be changed here).</Li>
          <Li><B>Full Name</B> — Your display name, shown on blog posts you author.</Li>
          <Li><B>Bio</B> — A short description of yourself (required, max 300 characters). Shown on your author profile in blog posts.</Li>
          <Li><B>Avatar</B> — Your profile photo, displayed in the sidebar and on your authored posts.</Li>
          <Li><B>Roles</B> — Your current roles (read-only).</Li>
          <Li><B>Password</B> — Change your password.</Li>
        </UL>

        <H3 id="uploading-avatar">14.1 Uploading an Avatar</H3>
        <OL>
          <Li>Click the <B>circular avatar area</B> (it shows your initials if no photo is set).</Li>
          <Li>A camera icon overlay appears on hover — click to open the file picker.</Li>
          <Li>Select an image file from your computer.</Li>
        </OL>
        <UL>
          <Li>Accepted formats: <B>JPEG, PNG, WebP, GIF</B>.</Li>
          <Li>Maximum size: <B>6 MB</B>.</Li>
        </UL>
        <OL>
          <Li>The image uploads automatically and a preview appears.</Li>
          <Li>Click <B>Save profile</B> to confirm the change.</Li>
        </OL>
        <P>To remove your avatar, click the <B>Remove avatar</B> link below the image, then save.</P>
        <Img src="/manual/profile_page_with_avatar_upload.png" alt="Profile page" />

        <H3 id="changing-password">14.2 Changing Your Password</H3>
        <OL>
          <Li>On the Profile page, scroll to the <B>New password</B> field.</Li>
          <Li>Enter your new password.</Li>
          <Li>Click <B>Save profile</B>.</Li>
        </OL>
        <P>Leave the password field blank if you do not want to change it.</P>

        <HR />

        {/* ==== 15. PUBLIC WEBSITE ==== */}
        <H2 id="public-site">15. Public Website Overview</H2>
        <P>This section describes the pages that visitors see on the public website. As a team member, you control the content that appears on many of these pages.</P>

        <H3 id="home-page">15.1 Home Page</H3>
        <P>The landing page introduces Brownstone Construction with:</P>
        <UL>
          <Li>A hero section with a call-to-action.</Li>
          <Li>Company values: Luxury, Sustainability, Precision.</Li>
          <Li>Featured projects: Celestia, East Legon Trio, Wilma Crescent.</Li>
          <Li>&ldquo;Why Choose Us&rdquo; section highlighting Master Planning, Quality Assurance, Smart Integration, and Client Partnership.</Li>
          <Li>A contact call-to-action at the bottom.</Li>
        </UL>

        <H3 id="about-page">15.2 About Page</H3>
        <P>Tells the story of Brownstone Construction:</P>
        <UL>
          <Li>Mission and Vision statements.</Li>
          <Li>Impact statistics (Sustainable Sourcing, Years of Excellence, Iconic Projects).</Li>
          <Li>Heritage timeline (milestones from 2024–2025).</Li>
          <Li>Leadership team profiles.</Li>
        </UL>

        <H3 id="services-page">15.3 Services Page</H3>
        <P>Showcases the six service categories:</P>
        <OL>
          <Li>Residential Construction</Li>
          <Li>Master-Planned Communities</Li>
          <Li>Sustainable Infrastructure</Li>
          <Li>Real Estate Development</Li>
          <Li>Project Management</Li>
          <Li>Mixed-Use Spaces</Li>
        </OL>

        <H3 id="portfolio-page">15.4 Portfolio Page</H3>
        <P>A visual gallery of completed and in-progress projects. Visitors can filter by project (Celestia, East Legon Trio, Wilma Crescent, Others) and view images in a lightbox.</P>

        <H3 id="celestia-pages">15.5 Celestia Pages</H3>
        <P>Celestia is the flagship luxury residential development in Akosombo, Ghana (90 minutes from Accra). The Celestia section includes:</P>
        <UL>
          <Li><B>Main page</B> (<Code>/celestia</Code>) — Overview of the development, philosophy, and residences.</Li>
          <Li><B>Townhouses</B> (<Code>/celestia/townhouses</Code>) — Detailed information, galleries, investment details, and ownership process.</Li>
          <Li><B>Chalets</B> (<Code>/celestia/chalets</Code>) — Chalet-specific features and amenities.</Li>
          <Li><B>Lakehouse</B> (<Code>/celestia/lakehouse</Code>) — Lakefront property details and amenities.</Li>
        </UL>
        <P>Each page includes a <B>brochure request form</B>. When a visitor submits their email, they receive the brochure via email, and a lead is created in your system.</P>

        <H3 id="blog-public">15.6 Blog</H3>
        <P>The blog is powered by the posts you create in the admin panel.</P>
        <UL>
          <Li><B>Blog listing page</B> — Shows all published posts with a featured post at the top. Visitors can filter by category. The sidebar shows a newsletter signup form, popular topics, and the four Signature Listings (Now Selling).</Li>
          <Li><B>Blog post page</B> — Displays the full article with the author&rsquo;s photo and bio, a reading progress bar, social share buttons, related posts, and the newsletter/Signature Listings sidebar.</Li>
        </UL>
        <P><B>Newsletter signup:</B> When a visitor enters their email in the newsletter form, they are automatically added as both a lead (source: Newsletter) and a contact in your CRM.</P>

        <H3 id="contact-page">15.7 Contact Page</H3>
        <P>The public contact page allows visitors to reach out by filling in: Name, Email, Project type (dropdown), and Message.</P>
        <P>When submitted:</P>
        <UL>
          <Li>A <B>lead</B> is created in the system.</Li>
          <Li>A <B>notification email</B> is sent to the team.</Li>
          <Li>An <B>auto-reply</B> is sent to the visitor confirming receipt.</Li>
        </UL>

        <HR />

        {/* ==== 16. LEAD SOURCES ==== */}
        <H2 id="lead-sources">16. Lead Sources Explained</H2>
        <P>Leads arrive from several places on the public website. Here is what each source means:</P>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">Where It Comes From</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">What It Captures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Contact", "The Contact Us page form", "Name, email, project type, message"],
                ["Brochure", "Celestia brochure request forms", "Email, project name"],
                ["Lakehouse", "Lakehouse-specific inquiry form", "Email, phone, message"],
                ["Newsletter", "Blog sidebar and CTA newsletter signup", "Email"],
                ["Exit Intent", "Popup shown when a visitor is about to leave", "Email"],
              ].map(([source, from, captures], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{source}</td>
                  <td className="px-4 py-2.5 text-slate-600">{from}</td>
                  <td className="px-4 py-2.5 text-slate-600">{captures}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>All sources create a lead entry visible on the Leads page. Newsletter signups are also automatically created as CRM contacts.</P>

        <HR />

        {/* ==== 17. FAQ ==== */}
        <H2 id="faq">17. Frequently Asked Questions</H2>

        <div className="space-y-6">
          {[
            {
              q: "I created a post but it doesn't appear on the blog. Why?",
              a: "Make sure the post status is set to Published, not Draft. If you are an Author, ask a Moderator to publish it.",
            },
            {
              q: "A visitor submitted a form but I don't see a new lead notification.",
              a: "Lead notifications update every 30 seconds. Refresh the page or wait a moment. If the issue persists, check that the lead actually arrived on the Leads page — the form submission may have failed on the visitor's end.",
            },
            {
              q: "I accidentally deleted a post / contact / segment. Can I recover it?",
              a: "No. Deletions are permanent. Please be careful before confirming any deletion.",
            },
            {
              q: "How many emails can I send in a campaign?",
              a: "By default, the system allows up to 20 emails per hour and 50 per day. Emails are sent in batches of up to 10.",
            },
            {
              q: "What happens when I import contacts with emails that already exist?",
              a: "Existing contacts are updated with any new non-empty fields from the import file. No duplicates are created.",
            },
            {
              q: "Can I use the CRM if I'm an Author?",
              a: "No. The CRM (Contacts, Leads, Pipeline, Campaigns, Templates, Analytics) is only available to Moderators. As an Author, you can create and edit blog posts and manage your profile.",
            },
            {
              q: "What image formats can I upload?",
              a: "JPEG, PNG, WebP, and GIF. Maximum file size is 6 MB. SVG files are not accepted for security reasons.",
            },
            {
              q: "How do I add a property to the blog sidebar?",
              a: 'Go to Content → Signature Listings and update one of the four slots with the property image URL, name, and link.',
            },
            {
              q: "I deleted a media file but the image still appears in my post. Why?",
              a: "Deleted files may be cached briefly. The image will disappear from the post once the cache expires. To fix it immediately, edit the post and replace or remove the image reference.",
            },
          ].map(({ q, a }, i) => (
            <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-800 text-sm">Q: {q}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-slate-600 text-sm">A: {a}</p>
              </div>
            </div>
          ))}
        </div>

        <HR />

        <P><em className="text-slate-400">This manual is current as of February 2026. For support, contact your team moderator.</em></P>
      </div>
    </div>
  );
}
