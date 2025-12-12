/**
 * Theme Selector Component
 * Allows users to switch between available themes.
 */

import { useState, useEffect } from "react";
import { Check, Palette } from "lucide-react";
import {
    themes,
    Theme,
    getTheme,
    applyTheme,
    getStoredTheme
} from "@/lib/themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

interface ThemeSelectorProps {
    /** Compact mode shows only icon */
    compact?: boolean;
}

export function ThemeSelector({ compact = false }: ThemeSelectorProps) {
    const { theme: colorMode } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

    useEffect(() => {
        const storedId = getStoredTheme();
        const theme = getTheme(storedId);
        if (theme) {
            setCurrentTheme(theme);
        }
    }, []);

    const handleThemeChange = (theme: Theme) => {
        const mode = colorMode === "dark" ? "dark" : "light";
        applyTheme(theme, mode);
        setCurrentTheme(theme);
    };

    // Theme color preview circles
    const ThemePreview = ({ theme }: { theme: Theme }) => {
        const colors = theme.colors.light;
        return (
            <div className="flex gap-0.5 shrink-0">
                <div
                    className="w-3 h-3 rounded-full border border-border"
                    style={{ backgroundColor: `hsl(${colors.primary})` }}
                />
                <div
                    className="w-3 h-3 rounded-full border border-border"
                    style={{ backgroundColor: `hsl(${colors.accent})` }}
                />
            </div>
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={compact ? "icon" : "default"}
                    className="relative"
                >
                    <Palette className="h-4 w-4" />
                    {!compact && (
                        <span className="ml-2">{currentTheme?.name || "Theme"}</span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {themes.map((theme) => (
                    <DropdownMenuItem
                        key={theme.id}
                        onClick={() => handleThemeChange(theme)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <ThemePreview theme={theme} />
                            <div>
                                <div className="font-medium">{theme.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {theme.description}
                                </div>
                            </div>
                        </div>
                        {currentTheme?.id === theme.id && (
                            <Check className="h-4 w-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ThemeSelector;
