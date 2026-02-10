/**
 * BeforeAfterToggle — Toggle between dirty and clean states
 * with an animated transition on the 3D model.
 */

"use client";

import React, { useState } from "react";

interface BeforeAfterToggleProps {
    /** Current cleaning progress 0..1 */
    progress: number;
    /** Callback when user changes the progress */
    onProgressChange: (value: number) => void;
}

export function BeforeAfterToggle({
    progress,
    onProgressChange,
}: BeforeAfterToggleProps) {
    const [isClean, setIsClean] = useState(false);

    const handleToggle = () => {
        const next = !isClean;
        setIsClean(next);
        onProgressChange(next ? 1.0 : 0.0);
    };

    return (
        <div style={styles.container}>
            <span style={{ ...styles.label, opacity: isClean ? 0.5 : 1 }}>
                Before
            </span>

            <button
                onClick={handleToggle}
                style={styles.toggleTrack}
                aria-label="Toggle before/after view"
            >
                <div
                    style={{
                        ...styles.toggleThumb,
                        transform: isClean ? "translateX(28px)" : "translateX(2px)",
                        background: isClean ? "#10b981" : "#ef4444",
                    }}
                />
            </button>

            <span style={{ ...styles.label, opacity: isClean ? 1 : 0.5 }}>
                After
            </span>

            {/* Slider for fine control */}
            <input
                type="range"
                min={0}
                max={100}
                value={Math.round(progress * 100)}
                onChange={(e) => {
                    const v = parseInt(e.target.value, 10) / 100;
                    onProgressChange(v);
                    setIsClean(v > 0.5);
                }}
                style={styles.slider}
                aria-label="Cleaning progress"
            />
            <span style={styles.percentage}>{Math.round(progress * 100)}%</span>
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(12px)",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: "#e2e8f0",
        transition: "opacity 0.3s",
        userSelect: "none" as const,
    },
    toggleTrack: {
        width: 56,
        height: 28,
        borderRadius: 14,
        background: "rgba(30, 41, 59, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        cursor: "pointer",
        position: "relative" as const,
        outline: "none",
        padding: 0,
    },
    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: "50%",
        transition: "transform 0.3s ease, background 0.3s ease",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    },
    slider: {
        width: 100,
        accentColor: "#06b6d4",
        cursor: "pointer",
    },
    percentage: {
        fontSize: 13,
        fontWeight: 700,
        color: "#06b6d4",
        minWidth: 40,
        textAlign: "right" as const,
        fontVariantNumeric: "tabular-nums",
    },
};
