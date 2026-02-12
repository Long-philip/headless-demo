"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
      {/* Text */}
      <div className="max-w-[280px]">
        <h3 className="text-lg font-bold text-black mb-1">
          Join our email list
        </h3>
        <p className="text-sm text-black/60 leading-relaxed">
          Get exclusive deals and early access to new products.
        </p>
      </div>

      {/* Email input */}
      {submitted ? (
        <p className="text-sm text-brand font-medium">
          Thanks for subscribing!
        </p>
      ) : (
        <form
          className="flex-shrink-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSubmitted(true);
          }}
        >
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-[280px] rounded-full border border-black/20 px-5 py-3 pr-12 text-sm focus:outline-none focus:border-black/40"
              required
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
              aria-label="Subscribe"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
