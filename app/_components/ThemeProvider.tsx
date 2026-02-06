"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-white dark:bg-black h-screen w-screen"></div>; // Prevent hydration mismatch

  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
}
