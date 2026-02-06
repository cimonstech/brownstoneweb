"use client";

type Props = { title: string; url: string };

export function ShareButtons({ title, url }: Props) {
  const base = url;

  const copyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(base);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(base)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-3 rounded-lg bg-earthy/5 hover:bg-primary hover:text-white transition-all"
        aria-label="Share on X"
      >
        <span className="text-xl font-bold">𝕏</span>
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="flex items-center justify-center p-3 rounded-lg bg-earthy/5 hover:bg-primary hover:text-white transition-all"
        aria-label="Copy link"
      >
        <span className="text-xl">🔗</span>
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(base)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-3 rounded-lg bg-earthy/5 hover:bg-primary hover:text-white transition-all"
        aria-label="Share on LinkedIn"
      >
        <span className="text-xl">in</span>
      </a>
    </div>
  );
}
