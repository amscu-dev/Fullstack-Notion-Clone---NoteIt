// Importăm funcția `clsx` din biblioteca `clsx` pentru manipularea claselor CSS
import { clsx, type ClassValue } from "clsx";
// Importăm funcția `twMerge` din biblioteca `tailwind-merge` pentru a combina clasele TailwindCSS și a elimina conflictele
import { twMerge } from "tailwind-merge";

// Definim o funcție `cn` care combină și curăță clasele CSS
export function cn(...inputs: ClassValue[]) {
  // Folosim `clsx` pentru a combina clasele primite și `twMerge` pentru a rezolva conflictele între clasele TailwindCSS
  return twMerge(clsx(inputs));
}
