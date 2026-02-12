"use client";

export function CurrencySelector() {
  return (
    <div className="hidden md:flex items-center gap-0.5 text-sm text-black/60 hover:text-brand transition-colors cursor-pointer">
      <span className="font-medium">USD</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-3.5 w-3.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  );
}
