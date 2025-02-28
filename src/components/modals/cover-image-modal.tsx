"use client";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useEdgeStore } from "@/lib/edgestore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { onCloseCoverImage } from "@/store/slices/converImageSlice";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

function CoverImageModal() {
  const params = useParams();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, url } = useAppSelector((state) => state.coverImage);
  const dispatch = useAppDispatch();
  const { edgestore } = useEdgeStore();
  const update = useMutation(api.documents.update);

  // Funcția care închide modalul și resetează stările
  const onClose = () => {
    setFile(undefined); // Resetează fișierul selectat
    setIsSubmitting(false); // Resetează starea de încărcare
    dispatch(onCloseCoverImage()); // Închide modalul
  };

  // Funcția care se apelează când un fișier este selectat și urcat
  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true); // Setează starea la "în curs de încărcare"
      setFile(file); // Setează fișierul selectat

      let res;
      // Dacă există deja o imagine de copertă, o înlocuim
      if (url) {
        res = await edgestore.publicFiles.upload({
          file, // Upload fișierul selectat
          options: {
            replaceTargetUrl: url, // Înlocuim imaginea existentă cu noua imagine
          },
        });
      } else {
        // Dacă nu există o imagine de copertă, o încărcăm pe prima
        res = await edgestore.publicFiles.upload({ file });
      }

      // Actualizăm documentul cu noua imagine de copertă
      await update({
        id: params.documentId as Id<"documents">, // ID-ul documentului din URL
        coverImage: res.url, // URL-ul imaginii de copertă
      });
    }
    onClose(); // Închidem modalul după încărcare
  };

  // Funcția de închidere a dialogului
  const handleClose = () => {
    dispatch(onCloseCoverImage()); // Închidem modalul prin dispatch-ul acțiunii Redux
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CoverImageModal;
