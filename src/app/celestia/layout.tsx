import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export default function CelestiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${newsreader.variable} font-display min-h-screen bg-[#f8f6f6] text-earthy`}>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
