import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Celestia Chalets | Celestia",
  description: "Celestia Chalets — coming soon.",
};

export default function ChaletsPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#fdfcfb]">
      <Nav activePath="/celestia/chalets" />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-earthy mb-4">
            Celestia Chalets
          </h1>
          <p className="text-earthy/80 text-lg">
            This page is coming soon. In the meantime, explore{" "}
            <Link href="/celestia/townhouses" className="text-primary font-semibold underline hover:no-underline">
              Celestia Townhouses
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
