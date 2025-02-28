// Hook personalizat pentru a obține origin-ul URL-ului în care se află aplicația
import { useEffect, useState } from "react";

function useOrigin() {
  // State pentru a verifica dacă componenta este montată
  const [mounted, setMounted] = useState(false);

  // Obținem origin-ul doar dacă suntem în browser (adică când `window` este definit)
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin // Returnăm origin-ul complet (ex: 'http://localhost:3000')
      : ""; // Returnăm un string gol dacă nu suntem în browser (pentru SSR)

  useEffect(() => {
    // Setăm `mounted` pe true doar după ce componenta este montată
    setMounted(true);
  }, []); // Doar la prima montare a componentelor

  if (!mounted) {
    // Dacă componenta nu este încă montată, returnăm un string gol pentru a evita erorile pe server
    return "";
  }
  return origin; // Returnăm origin-ul doar dacă componenta este montată
}

export default useOrigin;
