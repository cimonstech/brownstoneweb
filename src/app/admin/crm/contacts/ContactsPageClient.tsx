"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";
import { ContactsTable } from "./ContactsTable";
import { SegmentManager, useSegments } from "./SegmentManager";
import { ImportContacts } from "./ImportContacts";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];

export function ContactsPageClient({
  contacts,
  statusOptions,
  currentStatus,
  currentSearch,
  currentTags,
}: {
  contacts: Contact[];
  statusOptions: { value: string; label: string }[];
  currentStatus: string;
  currentSearch: string;
  currentTags: string;
}) {
  const router = useRouter();
  const { segments, refresh: refreshSegments } = useSegments();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Contacts</h2>
          <p className="text-slate-500 mt-1">
            CRM contact database. Manage pipeline status, segments, and activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ImportContacts
            segments={segments}
            onComplete={() => {
              refreshSegments();
              router.refresh();
            }}
          />
          <Link
            href="/admin/crm/contacts/new"
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add contact
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ContactsTable
            contacts={contacts}
            statusOptions={statusOptions}
            currentStatus={currentStatus}
            currentSearch={currentSearch}
            currentTags={currentTags}
            segments={segments}
            onSegmentsChanged={refreshSegments}
          />
        </div>
        <div>
          <SegmentManager segments={segments} onRefresh={refreshSegments} />
        </div>
      </div>
    </div>
  );
}
