"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useScrollTop } from "../../../../hooks/use-scroll-top";
import Logo from "./Logo";

function NavBar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-3 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        {/* Dacă datele sunt încărcate, afișează un spinner */}
        {isLoading && <Spinner />}

        {/* Dacă datele nu sunt încărcate, si userul nu este autentificat */}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get NoteIt free</Button>
            </SignInButton>
          </>
        )}

        {/* Dacă datele nu sunt încărcate, si userul  este autentificat */}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter NoteIt</Link>
            </Button>
            <UserButton />
          </>
        )}

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </div>
  );
}

export default NavBar;
