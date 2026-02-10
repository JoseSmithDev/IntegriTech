/**
 * RadiationHeatmap — 2D radiation intensity grid with safety zones.
 */
"use client";
import React, { useState, useMemo, useCallback } from "react";
import { dangerLevel, inverseSquareLaw } from "../../lib/nuclear-formulas";

const GRID_SIZE = 16;
const COLORS = { safe: "#10b981", caution: "#f59e0b", danger: "#ef4444", critical: "#dc2626" };

interface Source { row: number; col: number; intensity: number; }

export default function RadiationHeatmap() {
    const [sources, setSources] = useState<Source[]>([
        { row: 4, col: 4, intensity: 120 },
        { row: 10, col: 12, intensity: 60 },
    ]);
    const [isPlacing, setIsPlacing] = useState(false);
    const [newIntensity, setNewIntensity] = useState(50);
    const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

    const grid = useMemo(() => {
        const g: number[][] = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            g[r] = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                let total = 0;
                for (const s of sources) {
                    const dist = Math.sqrt((r - s.row) ** 2 + (c - s.col) ** 2);
                    const d = Math.max(dist, 0.3);
                    total += s.intensity / (d * d);
                }
                g[r][c] = Math.round(total * 100) / 100;
            }
        }
        return g;
    }, [sources]);

    const maxI = useMemo(() => Math.max(...grid.flat(), 1), [grid]);

    const handleClick = useCallback((r: number, c: number) => {
        if (!isPlacing) return;
        setSources((prev) => [...prev, { row: r, col: c, intensity: newIntensity }]);
    }, [isPlacing, newIntensity]);

    const hoveredInfo = hoveredCell ? {
        intensity: grid[hoveredCell.r][hoveredCell.c],
        ...dangerLevel(grid[hoveredCell.r][hoveredCell.c]),
    } : null;

    return (
        <div style={s.wrap}>
            <div style={s.header}>
                <h4 style={s.title}>☢️ Mapa de Radiación — Gemelo Digital</h4>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => setIsPlacing(!isPlacing)} style={{
                        ...s.btn, ...(isPlacing ? { background: "rgba(239,68,68,0.2)", borderColor: "#ef4444", color: "#ef4444" } : {}),
                    }}>
                        {isPlacing ? "✓ Colocando Fuente" : "➕ Añadir Fuente"}
                    </button>
                    {isPlacing && (
                        <input type="number" value={newIntensity} onChange={(e) => setNewIntensity(Number(e.target.value))}
                            style={{ ...s.input, width: 70 }} placeholder="μSv/h" />
                    )}
                    <button onClick={() => setSources([])} style={s.btn}>🗑️ Limpiar</button>
                </div>
            </div>

            {/* Legend */}
            <div style={s.legend}>
                {(["safe", "caution", "danger", "critical"] as const).map((lv) => (
                    <span key={lv} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[lv] }} />
                        {lv === "safe" && "< 2.5 μSv/h"}
                        {lv === "caution" && "2.5–20"}
                        {lv === "danger" && "20–100"}
                        {lv === "critical" && "> 100"}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div style={s.gridWrap}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: 1 }}>
                    {grid.map((row, r) => row.map((val, c) => {
                        const dl = dangerLevel(val);
                        const isSource = sources.some((src) => src.row === r && src.col === c);
                        const opacity = 0.15 + Math.min(val / maxI, 1) * 0.85;
                        return (
                            <div key={`${r}-${c}`}
                                onClick={() => handleClick(r, c)}
                                onMouseEnter={() => setHoveredCell({ r, c })}
                                onMouseLeave={() => setHoveredCell(null)}
                                style={{
                                    width: 28, height: 28, borderRadius: 3,
                                    background: dl.color, opacity,
                                    cursor: isPlacing ? "crosshair" : "default",
                                    border: isSource ? "2px solid #fff" : "1px solid rgba(0,0,0,0.2)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, fontWeight: isSource ? 800 : 400,
                                    color: isSource ? "#fff" : "transparent",
                                    transition: "all 0.15s",
                                }}
                            >
                                {isSource ? "☢" : ""}
                            </div>
                        );
                    }))}
                </div>
            </div>

            {/* Hover Info */}
            {hoveredInfo && (
                <div style={{
                    ...s.infoBar,
                    borderColor: `${hoveredInfo.color}44`,
                }}>
                    <span style={{ color: hoveredInfo.color, fontWeight: 700 }}>{hoveredInfo.levelEs}</span>
                    <span style={{ color: "#e2e8f0", fontWeight: 800 }}>{hoveredInfo.intensity.toFixed(2)} μSv/h</span>
                    <span style={{ color: "#64748b", fontSize: 11 }}>
                        Celda ({hoveredCell!.r}, {hoveredCell!.c})
                    </span>
                    <span style={{ color: "#64748b", fontSize: 11 }}>
                        Distancia segura: {inverseSquareLaw(hoveredInfo.intensity, 1).safeDistance} m
                    </span>
                </div>
            )}

            {/* Source list */}
            {sources.length > 0 && (
                <div style={s.sourceList}>
                    <h5 style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Fuentes ({sources.length})</h5>
                    {sources.map((src, i) => (
                        <div key={i} style={s.sourceItem}>
                            <span>☢ ({src.row}, {src.col})</span>
                            <span style={{ color: "#ef4444", fontWeight: 700 }}>{src.intensity} μSv/h</span>
                            <button onClick={() => setSources((p) => p.filter((_, j) => j !== i))} style={s.removeBtn}>✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 12, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,.08)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    btn: { padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.05)", color: "#94a3b8", cursor: "pointer" },
    input: { padding: "4px 8px", borderRadius: 6, fontSize: 12, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "#e2e8f0" },
    legend: { display: "flex", gap: 12, color: "#64748b" },
    gridWrap: { background: "rgba(0,0,0,.3)", borderRadius: 12, padding: 12, display: "flex", justifyContent: "center" },
    infoBar: { display: "flex", gap: 16, alignItems: "center", padding: "8px 14px", borderRadius: 10, background: "rgba(0,0,0,.3)", border: "1px solid", fontSize: 13 },
    sourceList: { display: "flex", flexDirection: "column", gap: 4 },
    sourceItem: { display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#e2e8f0" },
    removeBtn: { background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 10 },
};
