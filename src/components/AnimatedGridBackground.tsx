"use client"

import React, { useEffect, useRef } from 'react';

export function AnimatedGridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Grid configuration
        const gridSize = 40;
        const gridColor = '#00ff88'; // Terminal green
        const activeLineColor = '#00d9ff'; // Terminal cyan

        // Active lines state
        const activeLines: {
            x: number;
            y: number;
            vertical: boolean;
            life: number;
            maxLife: number;
        }[] = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const drawGrid = () => {
            ctx.fillStyle = '#050505'; // Very dark background
            ctx.fillRect(0, 0, width, height);

            // Draw static grid
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        };

        const updateActiveLines = () => {
            // Add new active lines randomly
            if (Math.random() < 0.1) {
                const isVertical = Math.random() > 0.5;
                const snapToGrid = (val: number) => Math.floor(val / gridSize) * gridSize;

                activeLines.push({
                    x: snapToGrid(Math.random() * width),
                    y: snapToGrid(Math.random() * height),
                    vertical: isVertical,
                    life: 0,
                    maxLife: 50 + Math.random() * 50
                });
            }

            // Update and draw active lines
            for (let i = activeLines.length - 1; i >= 0; i--) {
                const line = activeLines[i];
                line.life++;

                if (line.life >= line.maxLife) {
                    activeLines.splice(i, 1);
                    continue;
                }

                const opacity = Math.sin(line.life / line.maxLife * Math.PI);
                ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.5})`;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = activeLineColor;

                ctx.beginPath();
                if (line.vertical) {
                    const length = Math.min(line.life * 5, 200);
                    ctx.moveTo(line.x, line.y);
                    ctx.lineTo(line.x, line.y + length);
                } else {
                    const length = Math.min(line.life * 5, 200);
                    ctx.moveTo(line.x, line.y);
                    ctx.lineTo(line.x + length, line.y);
                }
                ctx.stroke();

                // Reset shadow for next operations
                ctx.shadowBlur = 0;
            }
        };

        const animate = () => {
            drawGrid();
            updateActiveLines();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{
        background: '#050505'
    }} />;
}
