"use client"

import React from "react"
import { useBackground } from "@/contexts/BackgroundContext"

export function BackgroundRenderer() {
    const { currentPattern } = useBackground()

    // Common container style
    const containerStyle = "fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background transition-colors duration-300"

    switch (currentPattern) {
        case 'blobs':
            return (
                <div className={`${containerStyle} blob-background`}>
                    <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80" style={{ width: '100%', height: '100%' }}>
                        <path fill="hsl(var(--primary) / 0.5)" className="blob-out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" />
                        <path fill="hsl(var(--secondary) / 0.6)" className="blob-in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" />
                        <path fill="hsl(var(--primary) / 0.4)" className="blob-out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" />
                        <path fill="hsl(var(--secondary) / 0.5)" className="blob-in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" />
                    </svg>
                </div>
            )

        case 'grid':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }} />
            )

        case 'dots':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `radial-gradient(hsl(var(--secondary) / 0.2) 2px, transparent 2px)`,
                    backgroundSize: '30px 30px',
                    maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
                }} />
            )

        case 'waveform':
            return (
                <div className={containerStyle}>
                    <svg className="absolute bottom-0 w-full h-1/2 opacity-20" preserveAspectRatio="none" viewBox="0 0 1440 320">
                        <path fill="hsl(var(--primary))" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                    <svg className="absolute bottom-0 w-full h-1/2 opacity-20" preserveAspectRatio="none" viewBox="0 0 1440 320" style={{ transform: 'scaleY(-1)', bottom: 'auto', top: 0 }}>
                        <path fill="hsl(var(--secondary))" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            )

        case 'gradient-mesh':
            return (
                <div className={containerStyle}>
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px]" />
                    <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-[100px]" />
                </div>
            )

        case 'hexagons':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    maskImage: 'linear-gradient(to bottom, black, transparent)'
                }} />
            )

        case 'circuit':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='currentColor' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cpath d='M20 20h60v60h-60z' fill='none' stroke='currentColor' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cpath d='M50 10v20M50 70v20M10 50h20M70 50h20' stroke='currentColor' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Ccircle cx='50' cy='50' r='5' fill='currentColor' fill-opacity='0.05'/%3E%3C/svg%3E")`,
                    color: 'hsl(var(--primary))',
                    maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
                }} />
            )

        case 'topography':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0c20 20 40 0 60 20s40 0 40 20v60H0V0z' fill='none' stroke='currentColor' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
                    color: 'hsl(var(--secondary))',
                    backgroundSize: '200px 200px',
                    maskImage: 'linear-gradient(to bottom, black, transparent)'
                }} />
            )

        case 'stripes':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--primary) / 0.05) 0px, hsl(var(--primary) / 0.05) 2px, transparent 2px, transparent 20px)`,
                }} />
            )

        case 'particles':
            return (
                <div className={containerStyle}>
                    <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-primary/30 animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-[30%] right-[15%] w-3 h-3 rounded-full bg-secondary/20 animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-[40%] left-[40%] w-2 h-2 rounded-full bg-accent/25 animate-pulse" style={{ animationDuration: '5s' }} />
                    <div className="absolute top-[60%] right-[30%] w-2 h-2 rounded-full bg-primary/20 animate-pulse" style={{ animationDuration: '3.5s' }} />
                    <div className="absolute bottom-[20%] left-[60%] w-3 h-3 rounded-full bg-secondary/30 animate-pulse" style={{ animationDuration: '4.5s' }} />
                    <div className="absolute top-[80%] right-[50%] w-2 h-2 rounded-full bg-accent/20 animate-pulse" style={{ animationDuration: '6s' }} />
                </div>
            )

        case 'waves':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--primary) / 0.03) 0px, hsl(var(--primary) / 0.03) 2px, transparent 2px, transparent 40px), repeating-linear-gradient(90deg, hsl(var(--secondary) / 0.03) 0px, hsl(var(--secondary) / 0.03) 2px, transparent 2px, transparent 40px)`,
                    backgroundSize: '100% 100%',
                }} />
            )

        case 'geometric':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 30c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zM0 30c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zm60 0c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zM30 0c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zm0 60c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            )

        case 'mesh-gradient':
            return (
                <div className={containerStyle}>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                    <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-full bg-accent/10 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-full bg-primary/10 blur-[120px]" />
                </div>
            )

        case 'radial-lines':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, hsl(var(--primary) / 0.05) 0deg, hsl(var(--primary) / 0.05) 2deg, transparent 2deg, transparent 10deg)`,
                }} />
            )

        case 'cross-hatch':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--primary) / 0.03) 0px, hsl(var(--primary) / 0.03) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, hsl(var(--secondary) / 0.03) 0px, hsl(var(--secondary) / 0.03) 1px, transparent 1px, transparent 10px)`,
                }} />
            )

        case 'noise':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }} />
            )

        case 'bokeh':
            return (
                <div className={containerStyle}>
                    <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-primary/10 blur-[40px]" />
                    <div className="absolute top-[50%] right-[20%] w-40 h-40 rounded-full bg-secondary/10 blur-[50px]" />
                    <div className="absolute bottom-[20%] left-[50%] w-36 h-36 rounded-full bg-accent/10 blur-[45px]" />
                    <div className="absolute top-[70%] right-[60%] w-28 h-28 rounded-full bg-primary/8 blur-[35px]" />
                </div>
            )

        case 'zigzag':
            return (
                <div className={containerStyle} style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L20 20L40 40L40 0L20 20L0 0Z' fill='none' stroke='currentColor' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
                    color: 'hsl(var(--primary))',
                }} />
            )

        case 'constellation':
            return (
                <div className={containerStyle}>
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <radialGradient id="dotGradient">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <circle cx="10%" cy="20%" r="2" fill="url(#dotGradient)" />
                        <circle cx="30%" cy="15%" r="2" fill="url(#dotGradient)" />
                        <circle cx="50%" cy="25%" r="2" fill="url(#dotGradient)" />
                        <circle cx="70%" cy="18%" r="2" fill="url(#dotGradient)" />
                        <circle cx="90%" cy="22%" r="2" fill="url(#dotGradient)" />
                        <circle cx="15%" cy="60%" r="2" fill="url(#dotGradient)" />
                        <circle cx="40%" cy="70%" r="2" fill="url(#dotGradient)" />
                        <circle cx="65%" cy="65%" r="2" fill="url(#dotGradient)" />
                        <circle cx="85%" cy="75%" r="2" fill="url(#dotGradient)" />
                        <line x1="10%" y1="20%" x2="30%" y2="15%" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.1" />
                        <line x1="30%" y1="15%" x2="50%" y2="25%" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.1" />
                        <line x1="50%" y1="25%" x2="70%" y2="18%" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.1" />
                        <line x1="70%" y1="18%" x2="90%" y2="22%" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.1" />
                        <line x1="15%" y1="60%" x2="40%" y2="70%" stroke="hsl(var(--secondary))" strokeWidth="0.5" strokeOpacity="0.1" />
                        <line x1="40%" y1="70%" x2="65%" y2="65%" stroke="hsl(var(--secondary))" strokeWidth="0.5" strokeOpacity="0.1" />
                        <line x1="65%" y1="65%" x2="85%" y2="75%" stroke="hsl(var(--secondary))" strokeWidth="0.5" strokeOpacity="0.1" />
                    </svg>
                </div>
            )

        case 'minimalist':
        default:
            return <div className={containerStyle} />
    }
}
