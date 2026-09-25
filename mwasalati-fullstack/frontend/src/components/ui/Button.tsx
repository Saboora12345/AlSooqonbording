import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand-brown text-brand-white hover:opacity-90",
  secondary: "bg-brand-gold text-brand-brown hover:opacity-90",
  ghost: "bg-transparent text-brand-brown border border-brand-brown/30 hover:bg-brand-brown/5",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`w-full rounded-ticket px-4 py-3 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
