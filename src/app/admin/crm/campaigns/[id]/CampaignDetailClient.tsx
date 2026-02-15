"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteCampaignButton } from "../DeleteCampaignButton";

type Campaign = {
  id: string;
  name: string;
  type: string;
  template_id: string | null;
  status: string;
};

type CampaignEmail = {
  id: string;
  contact_id: string;
  status: string;
  sent_at: string | null;
};

type ContactOption = {
  id: string;
  email: string;
  name: string | null;
  do_not_contact: boolean;
  unsubscribed: boolean;
};

export function CampaignDetailClient({
  campaign,
  campaignEmails,
  contactMap,
  allContacts,
  existingContactIds,
}: {
  campaign: Campaign;
  campaignEmails: CampaignEmail[];
  contactMap: Record<string, { email: string; name: string | null }>;
  allContacts: ContactOption[];
  existingContactIds: string[];
}) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    sent: number;
    errors?: string[];
  } | null>(null);
  const [addContactIds, setAddContactIds] = useState<Set<string>>(new Set());
  const [addingContacts, setAddingContacts] = useState(false);

  const existingSet = new Set(existingContactIds);
  const addableContacts = allContacts.filter(
    (c) => !c.do_not_contact && !c.unsubscribed && !existingSet.has(c.id)
  );

  function toggleAddContact(id: string) {
    setAddContactIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleAddContacts() {
    if (addContactIds.size === 0) return;
    setAddingContacts(true);
    try {
      const res = await fetch(`/api/crm/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_ids: Array.from(addContactIds) }),
      });
      if (res.ok) {
        setAddContactIds(new Set());
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to add contacts");
      }
    } catch {
      alert("Failed to add contacts");
    } finally {
      setAddingContacts(false);
    }
  }

  const pending = campaignEmails.filter((ce) => ce.status === "pending").length;
  const sent = campaignEmails.filter((ce) => ce.status === "sent").length;

  async function handleSend() {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch(`/api/crm/campaigns/${campaign.id}/send`, {
        method: "POST",
      });
      const data = await res.json();
      setSendResult({ sent: data.sent ?? 0, errors: data.errors });
      router.refresh();
    } catch {
      setSendResult({ sent: 0, errors: ["Request failed"] });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 min-w-[120px]">
          <p className="text-xs font-medium text-slate-500 uppercase">Total</p>
          <p className="text-2xl font-bold text-slate-800">{campaignEmails.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 min-w-[120px]">
          <p className="text-xs font-medium text-slate-500 uppercase">Sent</p>
          <p className="text-2xl font-bold text-green-600">{sent}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 min-w-[120px]">
          <p className="text-xs font-medium text-slate-500 uppercase">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
        </div>
        </div>
        <DeleteCampaignButton campaignId={campaign.id} campaignName={campaign.name} variant="button" />
      </div>

      {pending > 0 && campaign.template_id && (
        <div>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-70"
          >
            {sending ? "Sending..." : `Send batch (up to 10)`}
          </button>
          <p className="text-xs text-slate-500 mt-2">
            Sends up to 10 emails per click. Respects daily/hourly limits.
          </p>
        </div>
      )}

      {sendResult && (
        <div
          className={`p-4 rounded-lg ${
            sendResult.errors?.length ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800"
          }`}
        >
          <p className="font-medium">
            Sent {sendResult.sent} email{sendResult.sent !== 1 ? "s" : ""}.
          </p>
          {sendResult.errors?.length ? (
            <ul className="mt-2 text-sm list-disc list-inside">
              {sendResult.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {addableContacts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-2">Add contacts</h3>
          <p className="text-sm text-slate-500 mb-4">
            Add more recipients. They will be marked as pending and included when you send.
          </p>
          <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto mb-4">
            <div className="divide-y divide-slate-100">
              {addableContacts.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={addContactIds.has(c.id)}
                    onChange={() => toggleAddContact(c.id)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-800 truncate">{c.name || c.email}</span>
                  <span className="text-xs text-slate-500 truncate flex-1">{c.email}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddContacts}
            disabled={addingContacts || addContactIds.size === 0}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl font-semibold text-sm disabled:opacity-70"
          >
            {addingContacts ? "Adding…" : `Add ${addContactIds.size > 0 ? addContactIds.size + " " : ""}to campaign`}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="px-6 py-4 font-bold text-slate-800 border-b border-slate-100">
          Recipients
        </h3>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white">
              <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Sent at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaignEmails.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No recipients. Add contacts when creating the campaign.
                  </td>
                </tr>
              ) : (
                campaignEmails.map((ce) => {
                  const contact = contactMap[ce.contact_id];
                  return (
                    <tr key={ce.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">
                          {contact?.name || contact?.email || ce.contact_id}
                        </span>
                        <p className="text-xs text-slate-500">{contact?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            ce.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : ce.status === "bounced"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ce.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {ce.sent_at
                          ? new Date(ce.sent_at).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
