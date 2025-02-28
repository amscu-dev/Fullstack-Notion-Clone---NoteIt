"use client";

import Cover from "@/components/cover";
import Editor from "@/components/editor";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

function DocumentIdPage() {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });
  const update = useMutation(api.documents.update);

  // Funcția care actualizează conținutul documentului
  const onChange = (content: string) => {
    update({
      id: params.documentId as Id<"documents">, // ID-ul documentului care va fi actualizat
      content, // Noua valoare a conținutului documentului
    });
  };

  // Verifică dacă documentul nu a fost încă încărcat
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />{" "}
        {/* Arată un skeleton pentru încărcarea imaginii de copertă */}
        <div className="md:max-w-4xl lg:max-w-6xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      </div>
    );
  }

  // Renderizează documentul atunci când datele sunt încărcate

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-4xl lg:max-w-6xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
}

export default DocumentIdPage;
