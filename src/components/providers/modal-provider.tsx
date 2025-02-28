"use client";
import { useEffect, useState } from "react";
import SettingsModal from "@/components/modals/settings-modal";
import CoverImageModal from "@/components/modals/cover-image-modal";
import UserSettingsModal from "../modals/user-settings-modal";

function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  // Când folosești componente precum Dialogs într-o aplicație Next.js (în special în App Router cu use client), pot apărea hydration errors. Acestea apar când HTML-ul generat pe server (SSR) diferă de cel randat pe client.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <UserSettingsModal />
      <SettingsModal />
      <CoverImageModal />
    </>
  );
}

export default ModalProvider;
