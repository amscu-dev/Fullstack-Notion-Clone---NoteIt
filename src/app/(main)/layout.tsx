"use client";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
import SearchCommand from "@/components/search-command";
import ModalProvider from "@/components/providers/modal-provider";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Dacă aplicația este încărcată, afișează un spinner pentru a informa utilizatorul
  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Dacă utilizatorul nu este autentificat, redirecționează-l către pagina principală
  if (!isAuthenticated) {
    return redirect("/"); // Redirecționează utilizatorul către pagina de autentificare
  }

  // Dacă utilizatorul este autentificat și aplicația nu este în încărcare
  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        <ModalProvider />
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
