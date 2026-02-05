import type { OutputData } from "@/components/admin/Editor";

const BLOCK_TAGS: Record<string, string> = {
  paragraph: "p",
  header: "h2",
  list: "ul",
  quote: "blockquote",
  code: "pre",
  image: "figure",
  embed: "div",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}

export function renderEditorJsToHtml(data: OutputData | null | undefined): string {
  if (!data?.blocks?.length) return "";

  const parts: string[] = [];
  for (const block of data.blocks) {
    const tag = BLOCK_TAGS[block.type] ?? "p";
    switch (block.type) {
      case "paragraph":
        parts.push(`<p>${escapeHtml(block.data.text || "")}</p>`);
        break;
      case "header":
        const level = Math.min(6, Math.max(1, (block.data as { level?: number }).level ?? 2));
        const h = `h${level}`;
        parts.push(`<${h}>${escapeHtml((block.data as { text?: string }).text || "")}</${h}>`);
        break;
      case "list":
        const style = (block.data as { style?: string }).style ?? "unordered";
        const listTag = style === "ordered" ? "ol" : "ul";
        const items = (block.data as { items?: string[] }).items ?? [];
        parts.push(
          `<${listTag}>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</${listTag}>`
        );
        break;
      case "quote":
        const quoteText = (block.data as { text?: string }).text ?? "";
        const quoteCaption = (block.data as { caption?: string }).caption ?? "";
        parts.push(
          `<blockquote><p>${escapeHtml(quoteText)}</p>${quoteCaption ? `<cite>${escapeHtml(quoteCaption)}</cite>` : ""}</blockquote>`
        );
        break;
      case "code":
        const code = (block.data as { code?: string }).code ?? "";
        parts.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
        break;
      case "image":
        const file = (block.data as { file?: { url?: string }; caption?: string }).file;
        const caption = (block.data as { caption?: string }).caption ?? "";
        const src = file?.url ?? "";
        if (src) {
          parts.push(
            `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(caption)}" loading="lazy" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`
          );
        }
        break;
      case "embed":
        const embedUrl = (block.data as { embed?: string }).embed ?? (block.data as { source?: string }).source ?? "";
        const embedCaption = (block.data as { caption?: string }).caption ?? "";
        if (embedUrl) {
          parts.push(
            `<figure class="embed"><iframe src="${escapeHtml(embedUrl)}" loading="lazy" allowfullscreen></iframe>${embedCaption ? `<figcaption>${escapeHtml(embedCaption)}</figcaption>` : ""}</figure>`
          );
        }
        break;
      default:
        parts.push(`<p>${escapeHtml(JSON.stringify(block.data))}</p>`);
    }
  }
  return parts.join("\n");
}
