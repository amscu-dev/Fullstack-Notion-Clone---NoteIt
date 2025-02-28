"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";

function DocumentsPage() {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  // Funcția care creează un document și redirecționează utilizatorul către pagina acestuia
  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then(
      (documentId) => router.push(`/documents/${documentId}`) // Redirecționează utilizatorul către documentul nou creat
    );
    // toast.promise(promise, {...}): Aceasta este o metodă din Sonner care permite asocierea unui toast cu o promisiune (promise). În funcție de rezultatul promisiunii (rezolvat sau respins), va arăta un mesaj de loading, success, sau error.
    //
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created",
      error: "Failed to create a new note",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        width="300"
        height="300"
        alt="empty-document"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        width="300"
        height="300"
        alt="empty-document"
        className="dark:block hidden"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.username}&apos;s NoteIt
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-1" />
        Create a note
      </Button>
    </div>
  );
}

export default DocumentsPage;
