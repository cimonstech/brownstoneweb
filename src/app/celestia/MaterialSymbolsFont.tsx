"use client";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";

export function MaterialSymbolsFont() {
  return (
    <>
      <link
        href={FONT_URL}
        rel="stylesheet"
        media="print"
        onLoad={(e) => {
          (e.target as HTMLLinkElement).media = "all";
        }}
      />
      <noscript>
        <link rel="stylesheet" href={FONT_URL} />
      </noscript>
    </>
  );
}
