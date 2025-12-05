"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { BackgroundPatternId, backgroundPatterns } from "@/lib/backgrounds"

interface BackgroundContextType {
    currentPattern: BackgroundPatternId
    setPattern: (patternId: BackgroundPatternId) => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
    const [currentPattern, setCurrentPattern] = useState<BackgroundPatternId>('blobs')
    const [mounted, setMounted] = useState(false)

    // Initialize from local storage
    useEffect(() => {
        const savedPattern = localStorage.getItem("dealtrack-background") as BackgroundPatternId
        if (savedPattern && backgroundPatterns.some(p => p.id === savedPattern)) {
            setCurrentPattern(savedPattern)
        }
        setMounted(true)
    }, [])

    // Save to local storage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("dealtrack-background", currentPattern)
        }
    }, [currentPattern, mounted])

    const setPattern = (patternId: BackgroundPatternId) => {
        setCurrentPattern(patternId)
    }

    return (
        <BackgroundContext.Provider value={{ currentPattern, setPattern }}>
            {children}
        </BackgroundContext.Provider>
    )
}

export function useBackground() {
    const context = useContext(BackgroundContext)
    if (context === undefined) {
        throw new Error("useBackground must be used within a BackgroundProvider")
    }
    return context
}
