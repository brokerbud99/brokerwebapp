"use client"

import * as React from "react"
import { Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"
import { Theme, ThemeCategory, themes } from "@/lib/themes"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
    const { currentTheme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = React.useState(false)
    const [activeCategory, setActiveCategory] = React.useState<ThemeCategory>('modern')
    const [mounted, setMounted] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const categories: { id: ThemeCategory; label: string }[] = [
        { id: 'modern', label: 'Modern' },
        { id: 'dark', label: 'Dark' },
        { id: 'light', label: 'Light' },
        { id: 'mixed', label: 'Mixed' },
    ]

    const filteredThemes = themes.filter(theme => theme.category === activeCategory)

    if (!mounted) {
        return (
            <Button
                variant="outline"
                size="icon"
                className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10 opacity-50 cursor-wait"
            >
                <Palette className="h-5 w-5 text-primary" />
            </Button>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                size="icon"
                className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                onClick={() => setIsOpen(!isOpen)}
                title="Change Theme"
            >
                <Palette className="h-5 w-5 text-primary" />
                <span className="sr-only">Change Theme</span>
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-popover/95 backdrop-blur-md shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold text-foreground mb-3">Select Theme</h3>
                        <div className="flex p-1 bg-muted/50 rounded-lg">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={cn(
                                        "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
                                        activeCategory === category.id
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                    )}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                        {filteredThemes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setTheme(theme.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-2 rounded-lg transition-colors border border-transparent",
                                    currentTheme.id === theme.id
                                        ? "bg-primary/10 border-primary/20"
                                        : "hover:bg-muted/50"
                                )}
                            >
                                {/* Color Preview Circles */}
                                <div className="flex -space-x-2 shrink-0">
                                    <div
                                        className="w-6 h-6 rounded-full border border-border shadow-sm z-30"
                                        style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                                    />
                                    <div
                                        className="w-6 h-6 rounded-full border border-border shadow-sm z-20"
                                        style={{ backgroundColor: `hsl(${theme.colors.background})` }}
                                    />
                                    <div
                                        className="w-6 h-6 rounded-full border border-border shadow-sm z-10"
                                        style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                                    />
                                </div>

                                <span className={cn(
                                    "flex-1 text-left text-sm font-medium",
                                    currentTheme.id === theme.id ? "text-primary" : "text-foreground"
                                )}>
                                    {theme.name}
                                </span>

                                {currentTheme.id === theme.id && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
