"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import type { Segment } from "./SegmentManager";

type ParsedRow = Record<string, string>;

const CONTACT_FIELDS = [
  { key: "email", label: "Email", required: true },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "country_code", label: "Country code" },
  { key: "company", label: "Company" },
  { key: "source", label: "Source" },
] as const;

export function ImportContacts({
  segments,
  onComplete,
}: {
  segments: Segment[];
  onComplete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "map" | "preview" | "result">("upload");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    updated: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStep("upload");
    setRows([]);
    setHeaders([]);
    setMapping({});
    setSelectedSegments([]);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(ws, { defval: "" });

        if (jsonData.length === 0) {
          alert("File is empty or has no data rows.");
          return;
        }

        const cols = Object.keys(jsonData[0]);
        setHeaders(cols);
        setRows(jsonData.slice(0, 5000));

        const autoMap: Record<string, string> = {};
        for (const field of CONTACT_FIELDS) {
          const match = cols.find(
            (h) => h.toLowerCase().replace(/[^a-z]/g, "") === field.key.replace(/_/g, "")
          );
          if (match) autoMap[field.key] = match;
        }
        setMapping(autoMap);
        setStep("map");
      } catch {
        alert("Failed to parse file. Please ensure it's a valid CSV or Excel file.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function getMappedContacts() {
    return rows
      .map((row) => {
        const contact: Record<string, string | string[]> = {};
        for (const field of CONTACT_FIELDS) {
          const col = mapping[field.key];
          if (col && row[col]) {
            contact[field.key] = String(row[col]).trim();
          }
        }
        return contact;
      })
      .filter((c) => c.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(c.email)));
  }

  async function handleImport() {
    const mapped = getMappedContacts();
    if (mapped.length === 0) {
      alert("No valid contacts to import. Make sure email column is mapped.");
      return;
    }
    setImporting(true);
    try {
      const res = await fetch("/api/crm/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts: mapped,
          segment_ids: selectedSegments.length > 0 ? selectedSegments : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStep("result");
      } else {
        alert(data.error ?? "Import failed");
      }
    } catch {
      alert("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  }

  function downloadTemplate() {
    const header = "email,name,phone,country_code,company,source";
    const rows = [
      "jane@example.com,Jane Doe,+1 555 123 4567,+1,Acme Realty,referral",
      "kwame@example.com,Kwame Mensah,024 402 8773,+233,Mensah Estates,cold_outreach",
      "info@globalcorp.com,Sarah Chen,,+44,Global Corp,newsletter",
    ];
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-white border border-slate-200 hover:border-primary/30 text-slate-700 hover:text-primary px-5 py-2.5 rounded-xl font-semibold text-sm transition-all inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
        </svg>
        Import
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Import contacts</h3>
          <button
            type="button"
            onClick={() => { setOpen(false); reset(); }}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "upload" && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
              <p className="text-slate-600 mb-1 font-medium">Upload a CSV or Excel file</p>
              <p className="text-sm text-slate-400 mb-6">
                Must contain at minimum an <strong>email</strong> column. Max 5,000 rows.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <label className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                  </svg>
                  Choose file
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Download template
                </button>
              </div>
              <div className="text-left max-w-md mx-auto bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected columns</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span><strong className="text-slate-800">email</strong> (required)</span>
                  <span>name</span>
                  <span>phone</span>
                  <span>country_code</span>
                  <span>company</span>
                  <span>source</span>
                </div>
              </div>
            </div>
          )}

          {step === "map" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Map columns</h4>
                <p className="text-sm text-slate-500">
                  Found {rows.length} rows with {headers.length} columns. Map your file columns to contact fields.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CONTACT_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      {field.label} {"required" in field && field.required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={mapping[field.key] ?? ""}
                      onChange={(e) =>
                        setMapping((m) => ({
                          ...m,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">— skip —</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Assign to segments */}
              {segments.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Assign imported contacts to segments (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {segments.map((seg) => {
                      const active = selectedSegments.includes(seg.id);
                      return (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() =>
                            setSelectedSegments((prev) =>
                              active ? prev.filter((s) => s !== seg.id) : [...prev, seg.id]
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            active
                              ? "border-transparent text-white"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                          style={active ? { backgroundColor: seg.color } : {}}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: active ? "#fff" : seg.color }}
                          />
                          {seg.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Preview (first 5 rows)</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                        {CONTACT_FIELDS.filter((f) => mapping[f.key]).map((f) => (
                          <th key={f.key} className="px-3 py-2">
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          {CONTACT_FIELDS.filter((f) => mapping[f.key]).map((f) => (
                            <td key={f.key} className="px-3 py-2 text-slate-700">
                              {row[mapping[f.key]] || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {getMappedContacts().length} valid contacts (with email) out of {rows.length} total rows
                </p>
              </div>
            </div>
          )}

          {step === "result" && result && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-green-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Import complete</h4>
              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <p className="text-2xl font-bold text-green-600">{result.created}</p>
                  <p className="text-slate-500">Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{result.updated}</p>
                  <p className="text-slate-500">Updated</p>
                </div>
                {result.failed > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                    <p className="text-slate-500">Failed</p>
                  </div>
                )}
              </div>
              {result.errors.length > 0 && (
                <div className="mt-4 text-left bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600">
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          {step === "map" && (
            <>
              <button
                type="button"
                onClick={reset}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={importing || !mapping.email || getMappedContacts().length === 0}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
              >
                {importing
                  ? "Importing..."
                  : `Import ${getMappedContacts().length} contacts`}
              </button>
            </>
          )}
          {step === "result" && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
                onComplete();
              }}
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
