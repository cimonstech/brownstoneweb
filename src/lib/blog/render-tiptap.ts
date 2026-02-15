import { generateHTML } from "@tiptap/html/server";
import { editorExtensions } from "@/lib/editor/extensions";
import type { JSONContent } from "@tiptap/core";

/**
 * Render Tiptap JSON (ProseMirror doc) to HTML for blog display.
 * Uses the same extensions as the editor so output is consistent.
 */
export function renderTiptapToHtml(doc: JSONContent | null | undefined): string {
  if (!doc || typeof doc !== "object" || doc.type !== "doc") return "";
  try {
    return generateHTML(doc as JSONContent, editorExtensions);
  } catch {
    return "";
  }
}
