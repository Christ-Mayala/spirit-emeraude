import { useEffect } from "react";
import { useLocation } from "wouter";

// Hook global pour remonter en haut de page à chaque changement de route.
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return null;
}
