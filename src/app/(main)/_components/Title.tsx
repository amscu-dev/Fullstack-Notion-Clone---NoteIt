"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

interface TitleProps {
  initialData: Doc<"documents">;
}

function Title({ initialData }: TitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.documents.update);
  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  // Funcția care activează input-ul și setează titlul documentului pentru editare
  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    // Settimeout pentru ca ref-urile vor exista dupa schimbarea starii
    // ref-urile sunt populate după ce elementul asociat a fost montat în DOM
    //  Componentele React nu sunt "blocate" de funcții asincrone
    // Când o componentă React este apelată, aceasta:

    // Execută codul sincron din funcția componentei.
    // Returnează JSX-ul care trebuie randerat.
    // React actualizează UI-ul pe baza JSX-ului returnat.
    // Funcțiile asincrone continuă să ruleze în fundal și, când se termină, pot declanșa o nouă re-randare.
    setTimeout(() => {
      // Metode specifice pentru HTMLInputElement, din DOM API
      inputRef.current?.focus(); // Pune automat cursorul în input
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length); // Selectează întreg textul
    }, 0);
  };

  // Funcția care dezactivează input-ul după ce utilizatorul a terminat editarea
  const disableInput = () => {
    setIsEditing(false); // Deactivează modul de editare
  };

  // Funcția care actualizează titlul documentului în starea locală și în baza de date
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value); // Actualizează titlul în starea locală
    update({
      id: initialData._id,
      title: event.target.value || "Untitled", // Actualizează titlul documentului în Convex
    });
  };

  // Funcția care se execută când utilizatorul apasă tasta Enter în input
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput(); // Dezactivează input-ul dacă tasta Enter este apăsată
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          className="h-7 px-2 focus-visible:ring-transparent "
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
}

// Componente suplimentare pentru starea de încărcare (loading state)
Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-8 w-24 rounded-md" />;
};

export default Title;
