"use client"

import React, { createContext, useContext, useEffect, useState, useMemo } from "react"
import { Theme, themes } from "@/lib/themes"

interface DashboardThemeContextType {
    currentTheme: Theme
    setTheme: (themeId: string) => void
    themeStyles: React.CSSProperties
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined)

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
    // Default to a dark theme for dashboard if not set
    const defaultTheme = themes.find(t => t.id === 'light-mint-fresh') || themes[0]
    const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)
    const [mounted, setMounted] = useState(false)

    // Initialize theme from local storage
    useEffect(() => {
        const savedThemeId = localStorage.getItem("dealtrack-dashboard-theme")
        if (savedThemeId) {
            const theme = themes.find((t) => t.id === savedThemeId)
            if (theme) {
                setCurrentTheme(theme)
            }
        }
        setMounted(true)
    }, [])

    // Save to local storage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("dealtrack-dashboard-theme", currentTheme.id)
        }
    }, [currentTheme, mounted])

    const setTheme = (themeId: string) => {
        const theme = themes.find((t) => t.id === themeId)
        if (theme) {
            setCurrentTheme(theme)
        }
    }

    // Generate CSS variables for the style prop
    const themeStyles = useMemo(() => {
        const styles: Record<string, string> = {}
        Object.entries(currentTheme.colors).forEach(([key, value]) => {
            const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`
            styles[cssVar] = value
        })
        return styles as React.CSSProperties
    }, [currentTheme])

    return (
        <DashboardThemeContext.Provider value={{ currentTheme, setTheme, themeStyles }}>
            {children}
        </DashboardThemeContext.Provider>
    )
}

export function useDashboardTheme() {
    const context = useContext(DashboardThemeContext)
    if (context === undefined) {
        throw new Error("useDashboardTheme must be used within a DashboardThemeProvider")
    }
    return context
}
