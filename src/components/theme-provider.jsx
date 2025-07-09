// theme-provider.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    // theme: "system",
    // setTheme: () => { },
});

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
}) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(storageKey) || defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            root.classList.remove("light", "dark");
            const appliedTheme =
                theme === "system"
                    ? mediaQuery.matches
                        ? "dark"
                        : "light"
                    : theme;
            root.classList.add(appliedTheme);
            console.log("Applied theme:", appliedTheme);
        };

        applyTheme(); // Apply theme initially
        mediaQuery.addEventListener("change", applyTheme); // Listen for system theme changes

        // Persist theme to localStorage
        localStorage.setItem(storageKey, theme);

        // Cleanup listener on unmount
        return () => mediaQuery.removeEventListener("change", applyTheme);
    }, [theme, storageKey]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
