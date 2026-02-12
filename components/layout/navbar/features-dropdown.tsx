"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const features = [
  { title: "Subscription Box", path: "/pages/subscription-box" },
  { title: "Product Bundle", path: "/search" },
  { title: "Cancellation Flow", path: "/search" },
  { title: "Analytics", path: "/search" },
  { title: "Forecasting Tool", path: "/search" },
];

export function FeaturesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 font-medium text-black/[0.81] underline-offset-4 hover:text-brand transition-colors"
      >
        All Features
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-3 w-52 rounded-xl border border-neutral-200 bg-white py-2 shadow-lg">
          {features.map((item) => (
            <Link
              key={item.title}
              href={item.path}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-black/70 hover:bg-brand/5 hover:text-brand transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileFeaturesAccordion({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="py-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-xl text-black transition-colors hover:text-neutral-500"
      >
        All Features
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <ul className="mt-1 ml-4 flex flex-col border-l border-neutral-200 pl-4">
          {features.map((item) => (
            <li key={item.title}>
              <Link
                href={item.path}
                onClick={onNavigate}
                className="block py-1.5 text-base text-black/60 transition-colors hover:text-brand"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
