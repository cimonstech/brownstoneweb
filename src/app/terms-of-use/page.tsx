import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUse() {
  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/terms-of-use" />
      <main className="pt-20">
        <section className="py-16 px-6 border-b border-earthy/10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-earthy mb-4 font-serif">
              Terms of Use
            </h1>
            <p className="text-earthy/60 font-light">
              Last updated: February 2025
            </p>
          </div>
        </section>
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto prose-like prose-lg">
            <p className="text-earthy/80 leading-relaxed mb-8">
              Welcome to Brownstone Construction Limited. By accessing or using
              our website brownstoneltd.com, you agree to be bound by these
              Terms of Use. Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              1. Acceptance of Terms
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              By using this website, you accept and agree to comply with these
              Terms of Use and our Privacy Policy. If you do not agree, please
              do not use our website.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              2. Use of Website
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              This website is provided for informational purposes about
              Brownstone Construction Limited, our services, projects, and
              company information. You may not use this site for any unlawful
              purpose, to transmit harmful code, or to attempt to gain
              unauthorized access to our systems or data.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              3. Intellectual Property
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              All content on this website, including text, images, logos, and
              design, is the property of Brownstone Construction Limited or its
              licensors and is protected by applicable intellectual property
              laws. You may not reproduce, distribute, or use our content
              without prior written permission.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              4. Accuracy of Information
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              We strive to keep the information on this website accurate and
              up to date. We do not warrant that all content is complete,
              current, or error-free. Project descriptions, imagery, and
              specifications are subject to change.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              5. Contact and Enquiries
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              Enquiries submitted through our contact form or email are subject
              to our standard engagement and confidentiality practices. We do
              not guarantee a response within any specific timeframe.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              6. Limitation of Liability
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              To the fullest extent permitted by law, Brownstone Construction
              Limited shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of this
              website. Our liability is limited to the extent permitted by
              applicable law in Ghana.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              7. Governing Law
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              These Terms of Use are governed by the laws of Ghana. Any disputes
              shall be subject to the exclusive jurisdiction of the courts of
              Ghana.
            </p>

            <h2 className="text-2xl font-bold text-earthy mt-12 mb-4 font-serif">
              8. Changes
            </h2>
            <p className="text-earthy/80 leading-relaxed mb-6">
              We may update these Terms of Use from time to time. The &quot;Last
              updated&quot; date at the top of this page will reflect any
              changes. Continued use of the website after changes constitutes
              acceptance of the revised terms.
            </p>

            <p className="text-earthy/80 leading-relaxed mt-12 pt-8 border-t border-earthy/10">
              For questions about these Terms of Use, please contact us at{" "}
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
              .
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
