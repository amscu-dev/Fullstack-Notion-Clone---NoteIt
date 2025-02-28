"use client";

import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import Item from "./Item";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}
// parentDocumentId by default este undefined
function DocumentList({ parentDocumentId, level = 0 }: DocumentListProps) {
  const params = useParams();
  console.log(params);
  const router = useRouter();

  // Record este un tip utilitar din TypeScript.
  // Record creează un tip de obiect în care cheile sunt de un anumit tip, iar valorile sunt de alt tip specificat.
  // Record<KeyType, ValueType>

  // Gestionarea stării pentru expansiune (care documente sunt expandate pentru a arăta copii)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onExpand = (documentId: string) => {
    // Comută starea de expansiune a unui document (dacă este expandat, îl colapsează și invers)
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  // Obține documentele din Convex folosind useQuery
  const documents = useQuery(api.documents.getSiderbar, {
    parentDocument: parentDocumentId, // Filtrarea documentelor pe baza documentului părinte
  });

  // Navighează către pagina unui document specific
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`); // Redirecționează la documentul specific
  };

  // Dacă documentele sunt în curs de încărcare, afișează scheletul de încărcare
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  // Dacă nu există documente și nu avem un document părinte, returnează null (nu se afișează nimic)
  if (!parentDocumentId && documents.length === 0) {
    return null;
  }

  return (
    <>
      {/* La activarea expanded se va apela  recursiv randarea componentului, insa pentru componentele ce nu au copii se va returna un array gol, daca se returneaza un array gol atunci documents.map nu va randa nimic, iar p va devenii ultimul element, asadar se va afisa mesajul de mai jos*/}
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : "12px",
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          {/* initial se vor randa toate documentele root, pentru ca parentid este undefined */}
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {/* Doar la actiunea expanded se va actiona randarea recursiva a componentei si se vor obtine doar documentele copil */}
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
}

export default DocumentList;
