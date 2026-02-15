import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import ExitIntentDynamic from "@/components/ExitIntentDynamic";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://brownstoneltd.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Brownstone Construction | Luxury Construction in Accra",
    template: "%s | Brownstone Construction",
  },
  description:
    "Premium construction and real estate development in Accra, Ghana. Reinventing Africa's future, brick by brick.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    url: baseUrl,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Brownstone Construction Limited",
    url: baseUrl,
    logo: `${baseUrl}/BrownStoneW.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Airport Square",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+233-244-028-773",
      email: "info@brownstoneltd.com",
      contactType: "customer service",
    },
    sameAs: [
      "https://x.com/brownstneltdgh",
      "https://facebook.com/brownstonelimited",
      "https://instagram.com/brownstone.ltd",
      "https://www.linkedin.com/company/brownstone-construction-firm/",
      "https://www.youtube.com/@brownstoneltd",
    ],
  };

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white text-dark-brown antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
        <ExitIntentDynamic />
      </body>
    </html>
  );
}
