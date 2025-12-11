"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardTheme } from "@/contexts/DashboardThemeContext"

export function DashboardThemeSelector() {
    const { currentTheme, setTheme } = useDashboardTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground opacity-50 cursor-wait px-4"
            >
                <Sun className="h-5 w-5" />
                <span className="font-medium">Theme</span>
            </Button>
        )
    }

    const isDark = currentTheme.category === 'dark'

    const toggleTheme = () => {
        if (isDark) {
            setTheme('light-minimalist')
        } else {
            setTheme('dark-midnight-slate')
        }
    }

    return (
        <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:bg-muted hover:text-foreground px-4"
            onClick={toggleTheme}
        >
            {isDark ? (
                <Moon className="h-5 w-5 flex-shrink-0" />
            ) : (
                <Sun className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="font-medium">
                {isDark ? "Dark Mode" : "Light Mode"}
            </span>
        </Button>
    )
}
