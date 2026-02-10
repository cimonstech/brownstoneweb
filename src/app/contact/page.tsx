"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FaIcon } from "@/components/Icons";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const projectType = (data.get("projectType") as string)?.trim();
    const message = (data.get("message") as string)?.trim();
    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill in name, email, and message.");
      return;
    }
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, projectType, message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(json.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="bg-background-light text-brown-deep min-h-screen">
      <Nav activePath="/contact" />
      <main className="pt-14 sm:pt-16 md:pt-20">
        <section
          className="h-[400px] flex items-center justify-center text-center relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(65, 22, 0, 0.4), rgba(65, 22, 0, 0.6)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="z-10 px-6">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-2xl font-serif px-4">
              Contact Us
            </h1>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </div>
        </section>

        <div
          className="flex-1 min-h-[60vh]"
          style={{
            backgroundImage: `linear-gradient(rgba(248, 246, 246, 0.92), rgba(248, 246, 246, 0.92)), url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=60')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
            <div className="text-center mb-16">
              <h2 className="text-brown-deep text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 font-serif">
                Start Your Journey
              </h2>
              <p className="text-neutral-grey text-lg max-w-2xl mx-auto font-medium">
                Partner with Brownstone for luxury, sustainable construction
                solutions tailored to your unique architectural vision.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 md:p-10 rounded-xl border border-neutral-grey/10 shadow-sm backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "success" && (
                    <p className="rounded-lg bg-green-100 text-green-800 px-4 py-3 text-sm font-medium">
                      Message sent. We&apos;ll get back to you soon.
                    </p>
                  )}
                  {status === "error" && errorMessage && (
                    <p className="rounded-lg bg-red-100 text-red-800 px-4 py-3 text-sm font-medium">
                      {errorMessage}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-brown-deep text-sm font-bold uppercase tracking-wider">
                        Full Name
                      </span>
                      <input
                        name="name"
                        className="rounded-lg border border-neutral-grey/20 bg-transparent focus:border-primary focus:ring-1 focus:ring-primary h-14 px-4 text-brown-deep placeholder:text-neutral-grey/50"
                        placeholder="Enter your name"
                        type="text"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-brown-deep text-sm font-bold uppercase tracking-wider">
                        Email Address
                      </span>
                      <input
                        name="email"
                        className="rounded-lg border border-neutral-grey/20 bg-transparent focus:border-primary focus:ring-1 focus:ring-primary h-14 px-4 text-brown-deep placeholder:text-neutral-grey/50"
                        placeholder="Your email"
                        type="email"
                        required
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-brown-deep text-sm font-bold uppercase tracking-wider">
                      Project Type
                    </span>
                    <select name="projectType" className="rounded-lg border border-neutral-grey/20 bg-transparent focus:border-primary focus:ring-1 focus:ring-primary h-14 px-4 text-brown-deep">
                      <option value="">Select a category</option>
                      <option value="Residential Luxury Development">Residential Luxury Development</option>
                      <option value="Commercial Construction">Commercial Construction</option>
                      <option value="Sustainable Renovation">Sustainable Renovation</option>
                      <option value="Interior Architecture">Interior Architecture</option>
                      <option value="Consulting Services">Consulting Services</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-brown-deep text-sm font-bold uppercase tracking-wider">
                      Message
                    </span>
                    <textarea
                      name="message"
                      className="rounded-lg border border-neutral-grey/20 bg-transparent focus:border-primary focus:ring-1 focus:ring-primary p-4 text-brown-deep placeholder:text-neutral-grey/50 resize-none"
                      placeholder="Tell us about your project vision..."
                      rows={5}
                      required
                    />
                  </label>
                  <button
                    className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 uppercase tracking-widest text-sm disabled:opacity-60 disabled:pointer-events-none"
                    type="submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending…" : "Send Inquiry"}
                  </button>
                </form>
              </div>
              <div className="lg:col-span-5 space-y-10 pl-0 lg:pl-10">
                <div>
                  <h3 className="text-brown-deep text-2xl font-bold mb-6">
                    Get in Touch
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xl">
                        <FaIcon name="location" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brown-deep">Office Location</h4>
                        <p className="text-neutral-grey leading-relaxed">
                          1 Airport Square, Accra – Ghana
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xl">
                        <FaIcon name="phone" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brown-deep">Phone</h4>
                        <p className="text-neutral-grey leading-relaxed">
                          <a href="tel:+233244028773" className="hover:text-primary transition-colors">+233 244 028 773</a>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xl">
                        <FaIcon name="envelope" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brown-deep">Email</h4>
                        <p className="text-neutral-grey leading-relaxed">
                          <a href="mailto:info@brownstoneltd.com" className="hover:text-primary transition-colors">info@brownstoneltd.com</a>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xl">
                        <FaIcon name="globe" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brown-deep">Website</h4>
                        <p className="text-neutral-grey leading-relaxed">
                          <a href="https://www.brownstoneltd.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">www.brownstoneltd.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-brown-deep mb-4">
                    Follow Our Progress
                  </h4>
                  <div className="flex gap-4">
                    <a
                      className="w-10 h-10 border border-neutral-grey/20 rounded-lg flex items-center justify-center text-neutral-grey hover:bg-primary hover:text-white hover:border-primary transition-all"
                      href="https://x.com/brownstneltdgh"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                    >
                      <FaIcon name="xTwitter" className="text-lg" />
                    </a>
                    <a
                      className="w-10 h-10 border border-neutral-grey/20 rounded-lg flex items-center justify-center text-neutral-grey hover:bg-primary hover:text-white hover:border-primary transition-all"
                      href="https://facebook.com/brownstonelimited"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <FaIcon name="facebook" className="text-lg" />
                    </a>
                    <a
                      className="w-10 h-10 border border-neutral-grey/20 rounded-lg flex items-center justify-center text-neutral-grey hover:bg-primary hover:text-white hover:border-primary transition-all"
                      href="https://instagram.com/brownstone.ltd"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaIcon name="instagram" className="text-lg" />
                    </a>
                    <a
                      className="w-10 h-10 border border-neutral-grey/20 rounded-lg flex items-center justify-center text-neutral-grey hover:bg-primary hover:text-white hover:border-primary transition-all"
                      href="https://www.linkedin.com/company/brownstone-construction-firm/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaIcon name="linkedin" className="text-lg" />
                    </a>
                    <a
                      className="w-10 h-10 border border-neutral-grey/20 rounded-lg flex items-center justify-center text-neutral-grey hover:bg-primary hover:text-white hover:border-primary transition-all"
                      href="https://wa.me/233244028485"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                    >
                      <FaIcon name="whatsapp" className="text-lg" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <section className="w-full pt-16 pb-16">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
                <h3 className="text-brown-deep text-2xl font-bold font-serif">Find Us</h3>
              </div>
              <div className="w-full aspect-video rounded-none overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.773290920585!2d-0.1773421!3d5.6004742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ba5321a35ab%3A0xc2611f181b07ac2a!2sBrownStone%20Construction%20Firm%20Ltd!5e0!3m2!1sen!2sgh!4v1770288208927!5m2!1sen!2sgh"
                  width="600"
                  height="450"
                  style={{ border: 0, width: "100%", height: "100%", minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Brownstone Construction Ltd – 1 Airport Square, Accra"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
