"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Theme, themes } from "@/lib/themes"

interface ThemeContextType {
    currentTheme: Theme
    setTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes.find(t => t.id === 'modern-forest-mint') || themes[0])
    const [mounted, setMounted] = useState(false)

    // Initialize theme from local storage
    useEffect(() => {
        const savedThemeId = localStorage.getItem("dealtrack-theme")
        if (savedThemeId) {
            const theme = themes.find((t) => t.id === savedThemeId)
            if (theme) {
                setCurrentTheme(theme)
            }
        }
        setMounted(true)
    }, [])

    // Apply theme colors to CSS variables
    useEffect(() => {
        const root = document.documentElement
        const colors = currentTheme.colors

        Object.entries(colors).forEach(([key, value]) => {
            // Convert camelCase to kebab-case for CSS variables
            const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`
            root.style.setProperty(cssVar, value)
        })

        // Save to local storage
        if (mounted) {
            localStorage.setItem("dealtrack-theme", currentTheme.id)
        }
    }, [currentTheme, mounted])

    const setTheme = (themeId: string) => {
        const theme = themes.find((t) => t.id === themeId)
        if (theme) {
            setCurrentTheme(theme)
        }
    }

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
