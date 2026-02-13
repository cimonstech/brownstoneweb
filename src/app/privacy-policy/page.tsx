import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/privacy-policy" />
      <main className="pt-20">
        <section className="py-16 px-6 border-b border-earthy/10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-earthy mb-4 font-serif">
              Privacy Policy
            </h1>
            <p className="text-earthy/60 font-light">
              Last updated: February 2025
            </p>
          </div>
        </section>
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto prose prose-earthy prose-lg">
            <p className="text-earthy/80 leading-relaxed mb-8">
              Brownstone Construction Limited (&quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, and safeguard your
              information when you use our website brownstoneltd.com.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              1. Information We Collect
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              We may collect information you provide directly, such as your
              name, email address, phone number, and message content when you
              submit our contact form or otherwise get in touch. We may also
              collect technical data such as your IP address, browser type, and
              pages visited when you use our website.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              2. How We Use Your Information
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              We use the information we collect to respond to your enquiries,
              improve our website and services, send relevant updates (with your
              consent where required), and comply with legal obligations. We do
              not sell your personal information to third parties.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              3. Cookies and Similar Technologies
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              Our website may use cookies and similar technologies to improve
              your experience, analyze site traffic, and remember your
              preferences. You can control cookie settings through your browser.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              4. Data Retention and Security
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              We retain your information only for as long as necessary to
              fulfill the purposes described in this policy or as required by
              law. We implement appropriate technical and organizational
              measures to protect your data against unauthorized access,
              alteration, or destruction.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              5. Your Rights
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              Depending on applicable law, you may have the right to access,
              correct, or delete your personal data, or to object to or restrict
              certain processing. To exercise these rights or ask questions,
              contact us using the details below.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              6. Third-Party Links
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              Our website may contain links to third-party sites. We are not
              responsible for the privacy practices of those sites. We encourage
              you to read their privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              7. Updates to This Policy
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. The &quot;Last
              updated&quot; date at the top of this page will reflect any
              changes. We encourage you to review this policy periodically.
            </p>

            <p className="text-earthy/80 leading-relaxed mt-12 pt-8 border-t border-earthy/10">
              For privacy-related enquiries, please contact us at{" "}
              <a
                href="mailto:info@brownstoneltd.com"
                className="text-primary font-medium hover:underline"
              >
                info@brownstoneltd.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:+233244028773"
                className="text-primary font-medium hover:underline"
              >
                +233 244 028 773
              </a>
              . Brownstone Construction Limited, Accra, Ghana.
            </p>

            <div className="mt-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
