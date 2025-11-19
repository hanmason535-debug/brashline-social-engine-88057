/**
 * File overview: src/components/ui/theme-switch.tsx
 *
 * React component `theme-switch` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

const ThemeSwitch = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setChecked(resolvedTheme === "dark"), [resolvedTheme]);

  const handleCheckedChange = useCallback(
    (isChecked: boolean) => {
      const newTheme = isChecked ? "dark" : "light";
      setChecked(isChecked);
      setTheme(newTheme);
      analytics.trackThemeSwitch(newTheme);
    },
    [setTheme],
  );

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "h-9 w-20",
        className
      )}
      {...props}
    >
      <Switch
        checked={checked}
        onCheckedChange={handleCheckedChange}
        aria-label={checked ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "peer absolute inset-0 h-full w-full rounded-full transition-colors",
          "bg-muted border-2 border-border",
          "data-[state=checked]:bg-foreground data-[state=checked]:border-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "[&>span]:h-7 [&>span]:w-7 [&>span]:rounded-full [&>span]:shadow-md [&>span]:z-10",
          "[&>span]:bg-background [&>span]:border [&>span]:border-border",
          "data-[state=unchecked]:[&>span]:translate-x-1",
          "data-[state=checked]:[&>span]:translate-x-[44px]"
        )}
      />

      <span
        className={cn(
          "pointer-events-none absolute left-2 inset-y-0 z-0",
          "flex items-center justify-center"
        )}
      >
        <SunIcon
          size={16}
          className={cn(
            "transition-all duration-300 ease-out",
            checked ? "text-background opacity-40" : "text-foreground scale-110 opacity-100"
          )}
        />
      </span>

      <span
        className={cn(
          "pointer-events-none absolute right-2 inset-y-0 z-0",
          "flex items-center justify-center"
        )}
      >
        <MoonIcon
          size={16}
          className={cn(
            "transition-all duration-300 ease-out",
            checked ? "text-background scale-110 opacity-100" : "text-muted-foreground opacity-40"
          )}
        />
      </span>
    </div>
  );
};

export default ThemeSwitch;
