"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type EditorJS = typeof import("@editorjs/editorjs").default;
type OutputData = import("@editorjs/editorjs").OutputData;

declare global {
  interface Window {
    EditorJS: EditorJS;
    editorjsHeader: unknown;
    editorjsList: unknown;
    editorjsImage: unknown;
    editorjsQuote: unknown;
    editorjsCode: unknown;
    editorjsEmbed: unknown;
  }
}

const UPLOAD_URL = "/api/blog/upload";

export function Editor({
  initialData,
  onChange,
  placeholder = "Write your post…",
}: {
  initialData?: OutputData | null;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const editorRef = useRef<InstanceType<EditorJS> | null>(null);
  const [ready, setReady] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const getData = useCallback(async (): Promise<OutputData | null> => {
    if (!editorRef.current) return null;
    return editorRef.current.save();
  }, []);

  useEffect(() => {
    if (!holder.current) return;
    let mounted = true;

    (async () => {
      const [
        { default: EditorJS },
        Header,
        List,
        ImageTool,
        Quote,
        CodeTool,
        Embed,
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/image"),
        import("@editorjs/quote"),
        import("@editorjs/code"),
        // @ts-expect-error - @editorjs/embed exports typings that don't resolve
        import("@editorjs/embed"),
      ]);

      if (!mounted || !holder.current) return;

      const editor = new EditorJS({
        holder: holder.current,
        placeholder,
        data: initialData ?? undefined,
        onChange: async () => {
          const data = await editor.save();
          onChangeRef.current?.(data);
        },
        tools: {
          header: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- EditorJS Header tool constructor types are incompatible
            class: Header.default as any,
            config: { placeholder: "Header", levels: [2, 3, 4] },
          },
          list: {
            class: List.default,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool.default,
            config: {
              endpoints: { byFile: UPLOAD_URL },
              field: "file",
              types: "image/*",
              captionPlaceholder: "Caption (optional)",
            },
          },
          quote: { class: Quote.default, inlineToolbar: true },
          code: { class: CodeTool.default },
          embed: {
            class: Embed.default,
            config: {
              services: { youtube: true, twitter: true, instagram: true },
            },
          },
        },
      });

      await editor.isReady;
      if (mounted) {
        editorRef.current = editor;
        setReady(true);
      }
    })();

    return () => {
      mounted = false;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [initialData, placeholder]);

  useEffect(() => {
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="border border-grey/20 rounded-lg bg-white min-h-[300px]">
      <div ref={holder} id="editorjs" className="px-4 py-2" />
    </div>
  );
}

export type { OutputData };
