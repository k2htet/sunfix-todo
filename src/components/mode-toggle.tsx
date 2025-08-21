"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Button
        size={"icon"}
        variant="outline"
        className="relative"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <Moon className="h-[1.2rem] w-[1.2rem] " />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] " />
        )}
      </Button>
    </>
  );
}
