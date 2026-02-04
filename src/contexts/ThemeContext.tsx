"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
    mode: ThemeMode
    toggleTheme: () => void
    setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>('light')
    const [mounted, setMounted] = useState(false)

    // Initialize theme from local storage
    useEffect(() => {
        const savedMode = localStorage.getItem("dealtrack-theme-mode") as ThemeMode
        if (savedMode === 'dark' || savedMode === 'light') {
            setModeState(savedMode)
        }
        setMounted(true)
    }, [])

    // Apply theme mode to document
    useEffect(() => {
        if (mounted) {
            const root = document.documentElement
            if (mode === 'dark') {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
            localStorage.setItem("dealtrack-theme-mode", mode)
        }
    }, [mode, mounted])

    const toggleTheme = () => {
        setModeState(prev => prev === 'light' ? 'dark' : 'light')
    }

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode)
    }

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
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
