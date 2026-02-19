"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "@/lib/editor/extensions";
import type { JSONContent } from "@tiptap/core";
import { useCallback, useRef, useEffect, useState } from "react";

const UPLOAD_URL = "/api/blog/upload";
type MediaItem = { key: string; url: string };

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
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: initialContent ?? undefined,
    editorProps: {
      attributes: {
        class: "prose-like max-w-none min-h-[300px] px-4 py-3 focus:outline-none text-sm sm:text-base [&_p]:my-2",
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
          const alt = typeof window !== "undefined" ? window.prompt("Alt text for accessibility (optional):") ?? "" : "";
          editor.chain().focus().setImage({ src: url, alt: alt || undefined }).run();
        }
      } catch {
        // ignore
      }
    },
    [editor]
  );

  const openMediaPicker = useCallback(async () => {
    setShowMediaPicker(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.items ?? []);
      } else {
        setMediaItems([]);
      }
    } catch {
      setMediaItems([]);
    }
  }, []);

  const insertImageFromMedia = useCallback(
    (url: string) => {
      if (editor) {
        const alt = typeof window !== "undefined" ? window.prompt("Alt text for accessibility (optional):") ?? "" : "";
        editor.chain().focus().setImage({ src: url, alt: alt || undefined }).run();
      }
      setShowMediaPicker(false);
    },
    [editor]
  );

  const handleLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = typeof window !== "undefined" ? window.prompt("Link URL:", previousUrl ?? "https://") : "";
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = url.startsWith("http") ? url : `https://${url}`;
    editor.chain().focus().setLink({ href }).run();
  }, [editor]);

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
              title="Insert image from device"
            >
              🖼
            </button>
            <button
              type="button"
              onClick={openMediaPicker}
              className="p-2 rounded hover:bg-slate-200 text-sm"
              title="Insert image from media"
            >
              Media
            </button>
            <span className="w-px h-6 bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={handleLink}
              className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("link") ? "bg-slate-200" : ""}`}
              title="Add or edit link"
            >
              Link
            </button>
          </>
        )}
      </div>
      <EditorContent editor={editor} />

      {showMediaPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowMediaPicker(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Insert image from media</h3>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-3">
                {mediaItems.map((item) => {
                  const isImage = /\.(jpe?g|png|gif|webp|avif)$/i.test(item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => insertImageFromMedia(item.url)}
                      className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none"
                    >
                      {isImage ? (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                          File
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {mediaItems.length === 0 && (
                <p className="text-sm text-slate-500">
                  No media yet. Upload from Admin → Media or use the image button to upload from device.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
