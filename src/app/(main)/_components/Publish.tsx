"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import useOrigin from "../../../../hooks/use-origin";

interface PublishProps {
  initialData: Doc<"documents">;
}
function Publish({ initialData }: PublishProps) {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = `${origin}/preview/${initialData._id}`;

  // Funcția care se ocupă de acțiunea de depublicare a unui document
  const onUnpublish = () => {
    setIsSubmitting(true); // Setează starea de încărcare
    const promise = update({ id: initialData._id, isPublished: false }).finally(
      () => setIsSubmitting(false) // După finalizarea acțiunii, setează starea de încărcare la false
    );
    toast.promise(promise, {
      loading: "Removing note from public view...",
      success: "Note successfully removed from public field!",
      error: "Please try again there was a problem...",
    });
  };

  // Funcția care se ocupă de acțiunea de publicare a unui document
  const onPublish = () => {
    setIsSubmitting(true); // Setează starea de încărcare
    const promise = update({ id: initialData._id, isPublished: true }).finally(
      () => setIsSubmitting(false) // După finalizarea acțiunii, setează starea de încărcare la false
    );
    toast.promise(promise, {
      loading: "Publish a new note...",
      success: "New note published",
      error: "Failed to publish a new note",
    });
  };

  // Funcția care copiază URL-ul documentului în clipboard
  const onCopy = () => {
    navigator.clipboard.writeText(url); // Copiază URL-ul în clipboard
    setCopied(true); // Setează starea de copiere la true
    setTimeout(() => {
      setCopied(false); // După 1 secundă, setează starea de copiere înapoi la false
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {/* Dacă documentul este publicat, se va afișa statusul și opțiunile corespunzătoare */}
        {/* Dacă documentul nu este publicat, se va afișa un mesaj și opțiunea de a-l publica */}
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-400 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web
              </p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                className="flex-1 px-2 text-xs border  rounded-l-md bg-muted truncate h-8"
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-sm"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-fill text-sm"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Publish;
