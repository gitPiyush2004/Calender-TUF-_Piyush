import { useEffect, useState } from "react";

export function useHeroImage(primarySrc, fallbackSrc) {
  const [imageSrc, setImageSrc] = useState(primarySrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoaded(false);
    setImageSrc(primarySrc);

    const primary = new Image();
    primary.onload = () => {
      if (!mounted) return;
      setIsLoaded(true);
    };
    primary.onerror = () => {
      if (!mounted) return;
      if (!fallbackSrc || fallbackSrc === primarySrc) {
        setIsLoaded(false);
        return;
      }
      const fallback = new Image();
      fallback.onload = () => {
        if (!mounted) return;
        setImageSrc(fallbackSrc);
        setIsLoaded(true);
      };
      fallback.onerror = () => {
        if (!mounted) return;
        setIsLoaded(false);
      };
      fallback.src = fallbackSrc;
    };
    primary.src = primarySrc;

    return () => {
      mounted = false;
    };
  }, [primarySrc, fallbackSrc]);

  return { imageSrc, isLoaded };
}
