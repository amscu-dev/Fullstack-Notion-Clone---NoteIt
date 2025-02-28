// Hook personalizat pentru a detecta dacă utilizatorul a depășit un anumit prag de scroll pe pagină
import { useEffect, useState } from "react";

export const useScrollTop = (threshold = 10) => {
  // State pentru a urmări dacă utilizatorul a depășit pragul de scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Funcția care se va executa la fiecare scroll
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        // Dacă utilizatorul a scrolled mai mult decât pragul (threshold), setăm scrolled pe true
        setScrolled(true);
      } else {
        // Dacă nu a depășit pragul, setăm scrolled pe false
        setScrolled(false);
      }
    };

    // Adăugăm event listener pentru a asculta scroll-ul pe fereastra browserului
    window.addEventListener("scroll", handleScroll);

    // Curățăm event listener-ul la demontarea componentelor pentru a preveni scurgerile de memorie
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]); // `threshold` este o dependență, astfel încât hook-ul se va actualiza când se schimbă valoarea acestuia

  return scrolled; // Returnăm valoarea `scrolled`, care indică dacă s-a depășit pragul de scroll
};
