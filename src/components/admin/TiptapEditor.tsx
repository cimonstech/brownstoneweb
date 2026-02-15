"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "@/lib/editor/extensions";
import type { JSONContent } from "@tiptap/core";
import { useCallback, useRef, useEffect } from "react";

const UPLOAD_URL = "/api/blog/upload";

export type TiptapContent = JSONContent;

export function TiptapEditor({
  initialContent,
  onChange,
  placeholder = "Write your post…",
}: {
  initialContent?: TiptapContent | string | null;
  onChange?: (content: TiptapContent) => void;
  placeholder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const didSyncInitial = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: initialContent ?? undefined,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  // When initialContent is HTML (legacy post), sync parsed JSON to parent once so save works
  useEffect(() => {
    if (!editor || !onChange || didSyncInitial.current) return;
    if (typeof initialContent === "string" && initialContent.trim()) {
      didSyncInitial.current = true;
      onChange(editor.getJSON());
    }
  }, [editor, initialContent, onChange]);

  const handleImageUpload = useCallback(async () => {
    const input = fileInputRef.current;
    if (!input || !editor) return;
    input.click();
  }, [editor]);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      e.target.value = "";
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch(UPLOAD_URL, { method: "POST", body: form });
        const data = await res.json();
        const url = data?.file?.url;
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } catch {
        // ignore
      }
    },
    [editor]
  );

  return (
    <div className="border border-grey/20 rounded-lg bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-grey/20 bg-slate-50/80">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
        {editor && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("bold") ? "bg-slate-200 font-bold" : ""}`}
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("italic") ? "bg-slate-200 italic" : ""}`}
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-slate-200 font-mono text-sm ${editor.isActive("code") ? "bg-slate-200" : ""}`}
              title="Code"
            >
              &lt;/&gt;
            </button>
            <span className="w-px h-6 bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-slate-200 text-sm ${editor.isActive("heading", { level: 2 }) ? "bg-slate-200 font-bold" : ""}`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-slate-200 text-sm ${editor.isActive("heading", { level: 3 }) ? "bg-slate-200 font-bold" : ""}`}
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("bulletList") ? "bg-slate-200" : ""}`}
              title="Bullet list"
            >
              •
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("orderedList") ? "bg-slate-200" : ""}`}
              title="Numbered list"
            >
              1.
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("blockquote") ? "bg-slate-200" : ""}`}
              title="Quote"
            >
              “
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-slate-200 font-mono text-sm ${editor.isActive("codeBlock") ? "bg-slate-200" : ""}`}
              title="Code block"
            >
              {}
            </button>
            <span className="w-px h-6 bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={handleImageUpload}
              className="p-2 rounded hover:bg-slate-200"
              title="Insert image"
            >
              🖼
            </button>
          </>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
