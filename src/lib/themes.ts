/**
 * Theme Factory - Multi-theme support for Brashline
 * Based on Anthropic's theme-factory skill patterns.
 * 
 * Provides a system for defining, switching, and persisting UI themes.
 */

export interface ThemeColors {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    ring: string;
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    colors: {
        light: ThemeColors;
        dark: ThemeColors;
    };
}

// Default Brashline Coral Theme
export const coralTheme: Theme = {
    id: "coral",
    name: "Coral",
    description: "Brashline's signature coral brand theme",
    colors: {
        light: {
            background: "0 0% 100%",
            foreground: "225 29% 17%",
            card: "0 0% 100%",
            cardForeground: "225 29% 17%",
            primary: "10 100% 65%",
            primaryForeground: "0 0% 100%",
            secondary: "225 29% 17%",
            secondaryForeground: "0 0% 100%",
            muted: "210 20% 98%",
            mutedForeground: "215 14% 34%",
            accent: "10 100% 65%",
            accentForeground: "0 0% 100%",
            border: "214 32% 91%",
            ring: "10 100% 65%",
        },
        dark: {
            background: "232 48% 6%",
            foreground: "210 40% 98%",
            card: "225 29% 17%",
            cardForeground: "210 40% 98%",
            primary: "10 100% 70%",
            primaryForeground: "225 29% 17%",
            secondary: "225 29% 17%",
            secondaryForeground: "210 40% 98%",
            muted: "215 25% 27%",
            mutedForeground: "215 20% 65%",
            accent: "10 100% 70%",
            accentForeground: "225 29% 17%",
            border: "215 25% 27%",
            ring: "10 100% 70%",
        },
    },
};

// Ocean Blue Theme
export const oceanTheme: Theme = {
    id: "ocean",
    name: "Ocean",
    description: "Cool and professional blue tones",
    colors: {
        light: {
            background: "210 50% 99%",
            foreground: "215 50% 15%",
            card: "0 0% 100%",
            cardForeground: "215 50% 15%",
            primary: "211 100% 50%",
            primaryForeground: "0 0% 100%",
            secondary: "215 50% 20%",
            secondaryForeground: "0 0% 100%",
            muted: "210 30% 96%",
            mutedForeground: "215 20% 40%",
            accent: "199 89% 48%",
            accentForeground: "0 0% 100%",
            border: "210 30% 88%",
            ring: "211 100% 50%",
        },
        dark: {
            background: "215 50% 8%",
            foreground: "210 40% 98%",
            card: "215 40% 12%",
            cardForeground: "210 40% 98%",
            primary: "211 100% 60%",
            primaryForeground: "215 50% 10%",
            secondary: "215 30% 25%",
            secondaryForeground: "210 40% 98%",
            muted: "215 30% 18%",
            mutedForeground: "215 20% 65%",
            accent: "199 89% 58%",
            accentForeground: "215 50% 10%",
            border: "215 30% 22%",
            ring: "211 100% 60%",
        },
    },
};

// Forest Green Theme
export const forestTheme: Theme = {
    id: "forest",
    name: "Forest",
    description: "Natural and calming green palette",
    colors: {
        light: {
            background: "120 20% 99%",
            foreground: "140 30% 15%",
            card: "0 0% 100%",
            cardForeground: "140 30% 15%",
            primary: "142 71% 45%",
            primaryForeground: "0 0% 100%",
            secondary: "140 30% 20%",
            secondaryForeground: "0 0% 100%",
            muted: "120 20% 96%",
            mutedForeground: "140 15% 40%",
            accent: "158 64% 52%",
            accentForeground: "0 0% 100%",
            border: "120 20% 88%",
            ring: "142 71% 45%",
        },
        dark: {
            background: "140 30% 6%",
            foreground: "120 20% 98%",
            card: "140 25% 12%",
            cardForeground: "120 20% 98%",
            primary: "142 71% 55%",
            primaryForeground: "140 30% 10%",
            secondary: "140 20% 22%",
            secondaryForeground: "120 20% 98%",
            muted: "140 20% 16%",
            mutedForeground: "140 15% 60%",
            accent: "158 64% 60%",
            accentForeground: "140 30% 10%",
            border: "140 20% 20%",
            ring: "142 71% 55%",
        },
    },
};

// Sunset Purple Theme
export const sunsetTheme: Theme = {
    id: "sunset",
    name: "Sunset",
    description: "Warm purple and orange gradients",
    colors: {
        light: {
            background: "280 20% 99%",
            foreground: "270 40% 15%",
            card: "0 0% 100%",
            cardForeground: "270 40% 15%",
            primary: "263 70% 58%",
            primaryForeground: "0 0% 100%",
            secondary: "270 40% 20%",
            secondaryForeground: "0 0% 100%",
            muted: "280 20% 96%",
            mutedForeground: "270 20% 40%",
            accent: "25 95% 53%",
            accentForeground: "0 0% 100%",
            border: "280 20% 88%",
            ring: "263 70% 58%",
        },
        dark: {
            background: "270 40% 6%",
            foreground: "280 20% 98%",
            card: "270 35% 12%",
            cardForeground: "280 20% 98%",
            primary: "263 70% 68%",
            primaryForeground: "270 40% 10%",
            secondary: "270 25% 22%",
            secondaryForeground: "280 20% 98%",
            muted: "270 25% 16%",
            mutedForeground: "270 15% 60%",
            accent: "25 95% 60%",
            accentForeground: "270 40% 10%",
            border: "270 25% 20%",
            ring: "263 70% 68%",
        },
    },
};

// All available themes
export const themes: Theme[] = [
    coralTheme,
    oceanTheme,
    forestTheme,
    sunsetTheme,
];

// Get theme by ID
export function getTheme(id: string): Theme | undefined {
    return themes.find((t) => t.id === id);
}

// Apply theme to document root
export function applyTheme(theme: Theme, mode: "light" | "dark"): void {
    const root = document.documentElement;
    const colors = theme.colors[mode];

    Object.entries(colors).forEach(([key, value]) => {
        // Convert camelCase to kebab-case for CSS variables
        const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        root.style.setProperty(`--${cssVar}`, value);
    });

    // Store theme preference
    localStorage.setItem("brashline-theme", theme.id);
}

// Get stored theme preference
export function getStoredTheme(): string {
    return localStorage.getItem("brashline-theme") || "coral";
}

// Initialize theme from storage
export function initializeTheme(): Theme {
    const storedThemeId = getStoredTheme();
    const theme = getTheme(storedThemeId) || coralTheme;
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(theme, isDark ? "dark" : "light");
    return theme;
}
