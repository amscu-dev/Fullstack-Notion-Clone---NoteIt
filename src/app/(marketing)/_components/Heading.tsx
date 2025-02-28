"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
        Your Ideas, Documents & Plans. Unified. Welcome to{" "}
        <span className="underline">NoteIt</span>
      </h1>
      <h3 className="text-base sm:text-lg md:text-xl font-normal">
        NoteIt is the connected workspace where
        <br />
        better, faster work happens
      </h3>

      {/* Dacă aplicația este încărcată, se afișează un spinner pentru a indica procesul */}
      {isLoading && (
        <div className="w-full flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      )}

      {/* Dacă utilizatorul este autentificat și aplicația nu este în încărcare */}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter NoteIt <ArrowRight className="h-4 w-2 ml-2" />
          </Link>
        </Button>
      )}

      {/* Dacă utilizatorul nu este autentificat și aplicația nu este în încărcare */}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get NoteIt free <ArrowRight className="h-4 w-2 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default Heading;
