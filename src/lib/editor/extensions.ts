/**
 * Tiptap extensions used by both the editor (client) and the blog renderer (server).
 * Keep in sync: same list must be passed to useEditor() and to generateHTML().
 */
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    link: false, // we add Link separately with custom config (target, rel)
  }),
  Image.configure({
    inline: false,
    allowBase64: false,
    HTMLAttributes: { class: "rounded-xl max-w-full h-auto" },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
  }),
];
