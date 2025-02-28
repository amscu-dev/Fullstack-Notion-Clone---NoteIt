"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { onOpenCoverImage } from "@/store/slices/converImageSlice";
import { useMutation } from "convex/react";
import { ImageIcon, Smile, X } from "lucide-react";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import IconPicker from "./icon-picker";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}
function Toolbar({ initialData, preview }: ToolbarProps) {
  const dispatch = useAppDispatch();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  // Funcția care activează editarea atunci când nu este în modul preview
  const enableInput = () => {
    if (preview) return; // Dacă este în modul preview, nu se poate edita
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title); // Setăm valoarea input-ului la titlul documentului
      inputRef.current?.focus(); // Dăm focus la textarea
      inputRef.current?.setSelectionRange(value.length, value.length); // Setăm selecția la sfârșitul textului
    }, 0);
  };

  // Funcția care actualizează titlul documentului când utilizatorul scrie în input
  const onInput = (value: string) => {
    setValue(value);
    // Actualizăm titlul documentului în backend
    update({
      id: initialData._id,
      title: value || "Untitled", // Dacă nu există valoare, se setează "Untitled"
    });
  };

  // Funcția care dezactivează editarea
  const disableInput = () => setIsEditing(false);

  // Funcția pentru a detecta când utilizatorul apasă pe tasta Enter și pentru a opri editarea
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Previne comportamentul implicit de a adăuga un newline
      disableInput(); // Oprește editarea
    }
  };

  // Funcția care se activează atunci când utilizatorul selectează o icoană pentru document
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon, // Actualizăm icoana documentului
    });
  };

  // Funcția care elimină icoana documentului
  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id, // Trimitem ID-ul documentului pentru a-l actualiza
    });
  };

  return (
    <div className="pl-[54px] group relative">
      {/* Dacă documentul are UN ICON și nu suntem în preview */}
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-sm"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dacă documentul are UN ICON și suntem în preview */}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-sm"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}

        {/* Dacă documentul nu are o imagine de copertă și nu suntem în preview, oferim opțiunea de a adăuga o imagine de copertă */}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={() => {
              dispatch(onOpenCoverImage());
            }}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>

      {/* Dacă suntem în modul de editare și nu suntem în preview, arătăm un input textarea */}
      {/* Dacă nu suntem în editare, afișăm titlul documentului */}
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput} // Oprește editarea la pierderea focusului
          onKeyDown={onKeyDown} // Gestionează apăsările de tastă
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] "
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
}

export default Toolbar;
