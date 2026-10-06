import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-ticket bg-brand-white shadow-sm ring-1 ring-brand-brown/10 p-4 ${className}`}
      {...props}
    />
  );
}
