/**
 * ALARAPathfinder — Robotic path of least exposure visualization.
 */
"use client";
import React, { useState, useMemo, useCallback } from "react";
import { dangerLevel } from "../../lib/nuclear-formulas";

const GRID = 12;
const COLORS_DG = { safe: "#10b981", caution: "#f59e0b", danger: "#ef4444", critical: "#dc2626" };

type Mode = "obstacle" | "start" | "goal" | "view";

export default function ALARAPathfinder() {
    const [mode, setMode] = useState<Mode>("view");
    const [obstacles, setObstacles] = useState<Set<string>>(new Set(["3-5", "3-6", "4-5", "4-6", "7-8", "7-9", "8-8", "8-9"]));
    const [start, setStart] = useState<[number, number]>([0, 0]);
    const [goal, setGoal] = useState<[number, number]>([11, 11]);
    const [path, setPath] = useState<Array<{ x: number; y: number; dose: number }>>([]);
    const [stats, setStats] = useState<{ dose: number; dist: number; time: number; reduction: number; safe: boolean } | null>(null);
    const [robotSpeed, setRobotSpeed] = useState(0.5);

    // Generate semi-random radiation field from a few hotspots
    const radGrid = useMemo(() => {
        const hotspots = [{ r: 5, c: 3, i: 80 }, { r: 2, c: 9, i: 50 }, { r: 9, c: 6, i: 110 }];
        const g: number[][] = [];
        for (let r = 0; r < GRID; r++) {
            g[r] = [];
            for (let c = 0; c < GRID; c++) {
                let total = 0.5; // background
                for (const hs of hotspots) {
                    const d = Math.max(Math.sqrt((r - hs.r) ** 2 + (c - hs.c) ** 2), 0.5);
                    total += hs.i / (d * d);
                }
                g[r][c] = Math.round(total * 100) / 100;
            }
        }
        return g;
    }, []);

    const maxI = useMemo(() => Math.max(...radGrid.flat(), 1), [radGrid]);

    const handleCellClick = useCallback((r: number, c: number) => {
        const key = `${r}-${c}`;
        if (mode === "obstacle") {
            setObstacles((prev) => {
                const n = new Set(prev);
                n.has(key) ? n.delete(key) : n.add(key);
                return n;
            });
        } else if (mode === "start") {
            setStart([r, c]);
            setMode("view");
        } else if (mode === "goal") {
            setGoal([r, c]);
            setMode("view");
        }
    }, [mode]);

    const computePath = useCallback(() => {
        // Client-side simplified Dijkstra
        const INF = 1e18;
        const dist: number[][] = Array.from({ length: GRID }, () => Array(GRID).fill(INF));
        const prev: Record<string, string | null> = {};
        dist[start[0]][start[1]] = 0;

        const pq: [number, number, number][] = [[0, start[0], start[1]]];
        const timePerCell = 1.0 / robotSpeed;
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

        while (pq.length > 0) {
            pq.sort((a, b) => a[0] - b[0]);
            const [cd, cr, cc] = pq.shift()!;
            if (cd > dist[cr][cc]) continue;
            if (cr === goal[0] && cc === goal[1]) break;

            for (const [dr, dc] of dirs) {
                const nr = cr + dr, nc = cc + dc;
                if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) continue;
                if (obstacles.has(`${nr}-${nc}`)) continue;
                const diagT = (Math.abs(dr) + Math.abs(dc) === 2) ? timePerCell * 1.414 : timePerCell;
                const dose = radGrid[nr][nc] * (diagT / 3600);
                const nd = cd + dose;
                if (nd < dist[nr][nc]) {
                    dist[nr][nc] = nd;
                    prev[`${nr}-${nc}`] = `${cr}-${cc}`;
                    pq.push([nd, nr, nc]);
                }
            }
        }

        // Reconstruct
        const pts: Array<{ x: number; y: number; dose: number }> = [];
        let cur: string | null = `${goal[0]}-${goal[1]}`;
        while (cur) {
            const [r, c] = cur.split("-").map(Number);
            pts.push({ x: c, y: r, dose: dist[r][c] });
            cur = prev[cur] ?? null;
        }
        pts.reverse();

        setPath(pts);
        const totalDose = pts[pts.length - 1]?.dose || 0;
        setStats({
            dose: Math.round(totalDose * 10000) / 10000,
            dist: pts.length,
            time: Math.round(pts.length * (1 / robotSpeed) * 100) / 100,
            reduction: 0,
            safe: totalDose < 100,
        });
    }, [start, goal, obstacles, radGrid, robotSpeed]);

    const pathSet = useMemo(() => new Set(path.map((p) => `${p.y}-${p.x}`)), [path]);

    return (
        <div style={s.wrap}>
            <div style={s.header}>
                <h4 style={s.title}>🤖 ALARA — Ruta de Mínima Exposición</h4>
                <div style={{ display: "flex", gap: 6 }}>
                    {(["obstacle", "start", "goal"] as const).map((m) => (
                        <button key={m} onClick={() => setMode(mode === m ? "view" : m)} style={{
                            ...s.btn, ...(mode === m ? { background: "rgba(239,68,68,.2)", borderColor: "#ef4444", color: "#ef4444" } : {}),
                        }}>
                            {m === "obstacle" && "🧱 Obstáculo"}
                            {m === "start" && "🏁 Inicio"}
                            {m === "goal" && "🎯 Meta"}
                        </button>
                    ))}
                    <button onClick={computePath} style={{ ...s.btn, background: "rgba(16,185,129,.15)", borderColor: "#10b981", color: "#10b981" }}>
                        ▶ Calcular Ruta
                    </button>
                </div>
            </div>

            {/* Speed control */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, color: "#94a3b8" }}>
                <span>Velocidad robot:</span>
                <input type="range" min={0.1} max={2} step={0.1} value={robotSpeed} onChange={(e) => setRobotSpeed(Number(e.target.value))} />
                <span style={{ fontWeight: 700, color: "#06b6d4" }}>{robotSpeed.toFixed(1)} m/s</span>
            </div>

            {/* Grid */}
            <div style={s.gridWrap}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 2 }}>
                    {radGrid.map((row, r) => row.map((val, c) => {
                        const dl = dangerLevel(val);
                        const isObs = obstacles.has(`${r}-${c}`);
                        const isStart = r === start[0] && c === start[1];
                        const isGoal = r === goal[0] && c === goal[1];
                        const isPath = pathSet.has(`${r}-${c}`);
                        const opacity = 0.2 + Math.min(val / maxI, 1) * 0.8;

                        return (
                            <div key={`${r}-${c}`} onClick={() => handleCellClick(r, c)} style={{
                                width: 32, height: 32, borderRadius: 4,
                                background: isObs ? "#1e293b" : dl.color, opacity: isObs ? 1 : opacity,
                                border: isStart ? "2px solid #10b981" : isGoal ? "2px solid #3b82f6" : isPath ? "2px solid rgba(255,255,255,.7)" : "1px solid rgba(0,0,0,.2)",
                                cursor: mode !== "view" ? "crosshair" : "default",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: isStart || isGoal || isObs ? 14 : 8, color: "#fff",
                                transition: "all 0.15s",
                            }}>
                                {isStart ? "🏁" : isGoal ? "🎯" : isObs ? "🧱" : isPath ? "•" : ""}
                            </div>
                        );
                    }))}
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div style={s.statsRow}>
                    <Stat label="Dosis Total" value={`${stats.dose.toFixed(4)} μSv`} color={stats.safe ? "#10b981" : "#ef4444"} />
                    <Stat label="Celdas" value={`${stats.dist}`} color="#06b6d4" />
                    <Stat label="Tiempo" value={`${stats.time}s`} color="#f59e0b" />
                    <Stat label="ALARA" value={stats.safe ? "✅ SEGURO" : "⚠️ EXCEDIDO"} color={stats.safe ? "#10b981" : "#ef4444"} />
                </div>
            )}
        </div>
    );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase" as const }}>{label}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color }}>{value}</span>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 12, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,.08)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    btn: { padding: "5px 12px", borderRadius: 8, fontSize: 10, fontWeight: 600, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.05)", color: "#94a3b8", cursor: "pointer" },
    gridWrap: { background: "rgba(0,0,0,.3)", borderRadius: 12, padding: 12, display: "flex", justifyContent: "center" },
    statsRow: { display: "flex", gap: 24, padding: "10px 14px", background: "rgba(0,0,0,.2)", borderRadius: 10, flexWrap: "wrap" as const },
};
