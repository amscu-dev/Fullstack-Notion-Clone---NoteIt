"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { onClose, toggle } from "@/store/slices/commandSlice";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

function SearchCommand() {
  const { user } = useUser();
  const router = useRouter();
  const { isOpen } = useAppSelector((state) => state.command);
  const dispatch = useAppDispatch();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  // Când folosești componente precum Dialogs într-o aplicație Next.js (în special în App Router cu use client), pot apărea hydration errors. Acestea apar când HTML-ul generat pe server (SSR) diferă de cel randat pe client.
  useEffect(() => {
    setIsMounted(true); // Setăm `isMounted` pe `true` după montarea componentei pe client
  }, []);

  // Folosim un alt useEffect pentru a adăuga un shortcut pentru deschiderea căutării (cmd + k sau ctrl + k)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(toggle());
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [dispatch]);

  // Funcția care se activează atunci când utilizatorul selectează un document din lista de căutare
  const onSelect = (id: string) => {
    const documentId = id.split("-")[0];
    router.push(`/documents/${documentId}`);
    dispatch(onClose());
  };

  // Funcția care închide dialogul de comandă
  const handleClose = () => {
    dispatch(onClose());
  };

  // Prevenim renderizarea componentelor până când componenta este montată pe client
  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={handleClose}>
      <CommandInput placeholder={`Search ${user?.username}'s NoteIt...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default SearchCommand;
