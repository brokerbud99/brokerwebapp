"use client"

import * as React from "react"
import { Check, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBackground } from "@/contexts/BackgroundContext"
import { backgroundPatterns } from "@/lib/backgrounds"
import { cn } from "@/lib/utils"

export function BackgroundSelector() {
    const { currentPattern, setPattern } = useBackground()
    const [isOpen, setIsOpen] = React.useState(false)
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

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-primary/20 opacity-50 cursor-wait">
                <ImageIcon className="h-5 w-5 text-primary" />
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
                title="Change Background"
            >
                <ImageIcon className="h-5 w-5 text-primary" />
                <span className="sr-only">Change Background</span>
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover/95 backdrop-blur-md shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-border">
                        <h3 className="font-semibold text-foreground">Select Background</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                        {backgroundPatterns.map((pattern) => (
                            <button
                                key={pattern.id}
                                onClick={() => {
                                    setPattern(pattern.id)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between p-2 rounded-lg transition-colors border border-transparent text-left",
                                    currentPattern === pattern.id
                                        ? "bg-primary/10 border-primary/20 text-primary"
                                        : "hover:bg-muted/50 text-foreground"
                                )}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{pattern.name}</span>
                                    <span className="text-xs text-muted-foreground">{pattern.description}</span>
                                </div>
                                {currentPattern === pattern.id && (
                                    <Check className="h-4 w-4 text-primary ml-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
