import { Newsreader } from "next/font/google";
import { MaterialSymbolsFont } from "./MaterialSymbolsFont";

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
      <MaterialSymbolsFont />
      {children}
    </div>
  );
}
