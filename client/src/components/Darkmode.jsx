"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode";

export default function DarkMode() {
  const { isDarkMode, toggle } = useDarkMode({
    localStorageKey: "demo-basic-theme",
    applyDarkClass: false,
  });

  return (
    <Button
      onClick={toggle}
      variant="outline"
      size="sm"
      className="flex items-center justify-center gap-2"
    >
      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
