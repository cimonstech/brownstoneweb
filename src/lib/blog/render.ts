import sanitizeHtml from "sanitize-html";
import type { OutputData } from "@/components/admin/Editor";

/**
 * Allowed inline formatting from Editor.js
 * NOTE: sanitize-html already escapes unsafe content
 */
const INLINE_OPTIONS = {
  allowedTags: ["b", "strong", "i", "em", "u", "a", "code", "mark", "br"],
  allowedAttributes: {
    a: ["href", "target", "rel", "class"],
    mark: ["class"],
  },
};

/**
 * Whitelisted embed providers (security critical)
 */
const SAFE_EMBEDS: RegExp[] = [
  /^https:\/\/www\.youtube\.com\/embed\//,
  /^https:\/\/player\.vimeo\.com\/video\//,
];

/**
 * Normalize block text:
 * - Always return a string
 * - Remove [object Object]
 * - Replace literal &nbsp;
 * - Collapse whitespace
 */
function normalizeBlockText(raw: unknown): string {
  if (raw == null) return "";

  let s: string;
  if (typeof raw === "string") {
    s = raw;
  } else if (typeof raw === "object" && raw !== null && "text" in raw) {
    s = String((raw as { text: unknown }).text);
  } else if (typeof raw === "object" && raw !== null && "content" in raw) {
    s = String((raw as { content: unknown }).content);
  } else if (Array.isArray(raw)) {
    s = raw
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "value" in item) return String((item as { value: unknown }).value);
        if (item && typeof item === "object" && "text" in item) return String((item as { text: unknown }).text);
        return String(item);
      })
      .join("");
  } else {
    s = String(raw);
  }

  return s
    .replace(/\[\s*object\s+Object\s*\]/gi, " ")
    .replace(/\&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Extract text from block data (paragraph, header, quote, etc.).
 * Handles: string, { text }, { content }, array of fragments.
 */
function getBlockText(data: unknown): string {
  if (data == null) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.text === "string") return o.text;
    if (typeof o.text !== "undefined") return normalizeBlockText(o.text);
    if (typeof o.content === "string") return o.content;
    if (typeof o.content !== "undefined") return normalizeBlockText(o.content);
    if (Array.isArray(o.items)) return (o.items as unknown[]).map((i) => getBlockText(i)).join("");
  }
  return normalizeBlockText(data);
}

/**
 * Escape ONLY attribute values (src, href, alt, etc.)
 */
function escapeAttr(value: unknown): string {
  if (value == null) return "";
  return String(value).replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return m;
    }
  });
}

/**
 * Sanitize inline Editor.js HTML (bold, links, etc.)
 */
function sanitizeInlineHtml(text: unknown): string {
  const s = normalizeBlockText(text);
  return sanitizeHtml(s, INLINE_OPTIONS);
}

/** List item shape from @editorjs/list: { content, meta?, items? } */
type ListItem = {
  content?: unknown;
  meta?: { checked?: boolean };
  items?: ListItem[];
};

function renderListItem(item: unknown, style: string): string {
  if (typeof item === "string") {
    return `<li>${sanitizeInlineHtml(item)}</li>`;
  }
  if (typeof item !== "object" || item === null) return "";
  const obj = item as ListItem;
  const content = typeof obj.content === "string" ? obj.content : normalizeBlockText(obj.content);
  const checked = style === "checklist" && obj.meta?.checked;
  const attrs =
    style === "checklist"
      ? ` class="${checked ? "list-item-checked" : ""}" role="checkbox" aria-checked="${checked ? "true" : "false"}"`
      : "";
  const inner = sanitizeInlineHtml(content);
  const nested =
    Array.isArray(obj.items) && obj.items.length > 0
      ? `<${style === "ordered" ? "ol" : "ul"}${style === "checklist" ? ' class="list-checklist"' : ""}>${renderListItems(obj.items, style)}</${style === "ordered" ? "ol" : "ul"}>`
      : "";
  return `<li${attrs}>${inner}${nested}</li>`;
}

function renderListItems(items: unknown[], style: string): string {
  return items.map((item) => renderListItem(item, style)).join("");
}

/**
 * Normalize content: if string, parse as JSON (Editor.js output is sometimes stored as string).
 */
function normalizeContent(
  data: OutputData | null | undefined | string
): OutputData | null | undefined {
  if (data == null) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as OutputData;
    } catch {
      return undefined;
    }
  }
  return data;
}

/**
 * Render Editor.js OutputData → HTML
 */
export function renderEditorJsToHtml(
  data: OutputData | null | undefined | string
): string {
  const normalized = normalizeContent(data);
  if (!normalized?.blocks?.length) return "";
  const dataToUse = normalized;

  const parts: string[] = [];

  for (const block of dataToUse.blocks) {
    if (!block || typeof block !== "object") continue;
    const blockType = String((block as { type?: string }).type ?? "").toLowerCase();
    const data = (block as { data?: Record<string, unknown> }).data;

    switch (blockType) {
      case "paragraph": {
        const text = getBlockText(data?.text ?? data);
        parts.push(`<p>${sanitizeInlineHtml(text)}</p>`);
        break;
      }

      case "header":
      case "heading": {
        const level = Math.min(
          6,
          Math.max(1, (data?.level as number) ?? 2)
        );
        const text = getBlockText(data?.text ?? data);
        parts.push(
          `<h${level}>${sanitizeInlineHtml(text)}</h${level}>`
        );
        break;
      }

      case "list": {
        const style = (data?.style as string) ?? "unordered";
        const tag = style === "ordered" ? "ol" : "ul";
        const listClass =
          style === "checklist" ? " class=\"list-checklist\"" : "";
        const items = (block.data as { items?: unknown[] })?.items ?? [];
        parts.push(
          `<${tag}${listClass}>${renderListItems(items, style)}</${tag}>`
        );
        break;
      }

      case "quote": {
        const text = getBlockText(data?.text ?? data);
        const caption = getBlockText(data?.caption);

        parts.push(
          `<blockquote>
            <p>${sanitizeInlineHtml(text)}</p>
            ${
              caption
                ? `<cite>${sanitizeInlineHtml(caption)}</cite>`
                : ""
            }
          </blockquote>`
        );
        break;
      }

      case "code": {
        const code = (data?.code as string) ?? "";
        parts.push(
          `<pre><code>${escapeAttr(code)}</code></pre>`
        );
        break;
      }

      case "image": {
        const file = (block.data as {
          file?: { url?: string };
          caption?: unknown;
        })?.file;

        const src = file?.url;
        if (!src) break;

        const caption = (block.data as { caption?: unknown })?.caption;

        parts.push(
          `<figure>
            <img src="${escapeAttr(src)}" alt="${escapeAttr(
            caption
          )}" loading="lazy" />
            ${
              caption
                ? `<figcaption>${sanitizeInlineHtml(caption)}</figcaption>`
                : ""
            }
          </figure>`
        );
        break;
      }

      case "embed": {
        const url = (data?.embed as string) ?? (data?.source as string);
        if (!url) break;

        const isSafe = SAFE_EMBEDS.some((r) => r.test(url));
        if (!isSafe) break;

        const caption = (data as { caption?: string })?.caption;

        parts.push(
          `<figure class="embed">
            <iframe
              src="${escapeAttr(url)}"
              loading="lazy"
              allowfullscreen
            ></iframe>
            ${
              caption
                ? `<figcaption>${sanitizeInlineHtml(caption)}</figcaption>`
                : ""
            }
          </figure>`
        );
        break;
      }

      case "delimiter":
        parts.push('<div class="editorjs-delimiter">* * *</div>');
        break;

      case "warning": {
        const title = getBlockText(data?.title ?? "");
        const message = getBlockText(data?.message ?? "");
        parts.push(
          `<div class="editorjs-warning">
            <div class="editorjs-warning__title">${sanitizeInlineHtml(title)}</div>
            <div class="editorjs-warning__message">${sanitizeInlineHtml(message)}</div>
          </div>`
        );
        break;
      }

      case "table": {
        const withHeadings = (block.data as { withHeadings?: boolean })?.withHeadings ?? false;
        const content = (block.data as { content?: string[][] })?.content ?? [];
        if (content.length === 0) break;
        const thead =
          withHeadings && content[0]?.length
            ? `<thead><tr>${content[0].map((c) => `<th>${sanitizeInlineHtml(c)}</th>`).join("")}</tr></thead>`
            : "";
        const bodyRows = withHeadings ? content.slice(1) : content;
        const tbody =
          bodyRows.length > 0
            ? `<tbody>${bodyRows.map((row) => `<tr>${row.map((c) => `<td>${sanitizeInlineHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody>`
            : "";
        parts.push(`<div class="editorjs-table-wrap overflow-x-auto"><table class="w-full border-collapse">${thead}${tbody}</table></div>`);
        break;
      }

      case "simpleimage": {
        const url = (data?.url as string) ?? "";
        const caption = data?.caption;
        if (!url) break;
        parts.push(
          `<figure>
            <img src="${escapeAttr(url)}" alt="${escapeAttr(caption)}" loading="lazy" />
            ${caption ? `<figcaption>${sanitizeInlineHtml(caption)}</figcaption>` : ""}
          </figure>`
        );
        break;
      }

      default: {
        const fallback =
          (block.data as { text?: unknown })?.text ??
          JSON.stringify(block.data);
        parts.push(`<p>${sanitizeInlineHtml(fallback)}</p>`);
      }
    }
  }

  return parts.join("\n");
}
