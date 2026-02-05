import Link from "next/link";
import Image from "next/image";
import { FaIcon } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="bg-earthy text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/BrownStoneW.png"
                alt="Brownstone Construction Limited"
                width={86}
                height={26}
                className="h-5 w-auto object-contain"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Setting the gold standard in African construction. Specializing in
              high-end residential, commercial towers, and sustainable urban
              infrastructure.
            </p>
            <div className="flex gap-4">
              <a
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                href="https://x.com/brownstneltdgh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <FaIcon name="xTwitter" className="size-5" />
              </a>
              <a
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                href="https://facebook.com/brownstonelimited"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaIcon name="facebook" className="size-5" />
              </a>
              <a
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                href="https://instagram.com/brownstone.ltd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaIcon name="instagram" className="size-5" />
              </a>
              <a
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                href="https://www.linkedin.com/company/brownstone-construction-firm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaIcon name="linkedin" className="size-5" />
              </a>
              <a
                className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
                href="https://wa.me/233244028485"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaIcon name="whatsapp" className="size-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-8 text-primary font-serif">Services</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/50">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Residential Design
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Commercial Construction
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Sustainable Consulting
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Smart City Infrastructure
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-8 text-primary font-serif">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/50">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Leadership Team
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-8 text-primary font-serif">Headquarters</h4>
            <div className="flex flex-col gap-4 text-sm text-white/50">
              <p>1 Airport Square, Accra – Ghana</p>
              <a
                href="mailto:info@brownstoneltd.com"
                className="hover:text-primary transition-colors"
              >
                info@brownstoneltd.com
              </a>
              <a href="tel:+233244028773" className="hover:text-primary transition-colors">
                +233 244 028 773
              </a>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
          <p>© 2025 Brownstone Construction Limited. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
