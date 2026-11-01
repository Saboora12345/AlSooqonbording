import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { useDirection } from "../../hooks/useDirection";

export function AppShell({ children }: { children: ReactNode }) {
  useDirection();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-brand-cream">
      <Header />
      <main className="flex-1 px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
