import React from "react";

export function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h2v12H6zm10 0h2v12h-2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8v8H8z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 10h2v4H4zm14 0h2v4h-2z"
      />
    </svg>
  );
}

export function YogaMatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 9h8m-8 3h8m-8 3h8"
      />
    </svg>
  );
}

export function ResistanceBandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m-4-3c0 1.5 1.79 3 4 3s4-1.5 4-3V7c0-1.5-1.79-3-4-3S8 5.5 8 7"
      />
    </svg>
  );
}

export function PullUpBarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 6v4M20 6v4M8 6v2m8-2v2"
      />
    </svg>
  );
}

export function KettlebellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v2m0 0c-3 0-5 2-5 5v5c0 2 2 4 5 4s5-2 5-4v-5c0-3-2-5-5-5z"
      />
    </svg>
  );
}

// Add more custom equipment icons as needed
