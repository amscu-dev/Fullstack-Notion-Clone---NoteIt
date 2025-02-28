"use client";

import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { onReplaceCoverImage } from "@/store/slices/converImageSlice";
import { useMutation } from "convex/react";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

function Cover({ url, preview }: CoverImageProps) {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const dispatch = useAppDispatch();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  // Funcția pentru a elimina imaginea de copertă
  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ url: url }); // Ștergem imaginea de pe edge store
    }

    removeCoverImage({
      id: params.documentId as Id<"documents">, // Trimitem ID-ul documentului pentru a elimina imaginea
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {/* Afișăm imaginea de copertă dacă există URL-ul */}
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}

      {/* Dacă există URL și nu este un preview, afișăm butoane pentru schimbare sau ștergere */}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => {
              dispatch(
                onReplaceCoverImage({
                  url: url,
                  isOpen: true,
                })
              );
            }}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Change Cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}

// Componenta Skeleton pentru a arăta o interfață de încărcare pentru imaginea de copertă
Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};

export default Cover;
