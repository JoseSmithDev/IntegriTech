/**
 * ThermalMonitor — Real-time temperature chart with threshold alerts.
 *
 * Displays a time-series temperature chart and alert log.
 */

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { checkThermalThreshold } from "../../lib/heritage-formulas";

interface ThermalReading {
    temperature: number;
    timestamp: number;
    alert: boolean;
}

export default function ThermalMonitor() {
    const [readings, setReadings] = useState<ThermalReading[]>([]);
    const [threshold] = useState(50);
    const [isSimulating, setIsSimulating] = useState(false);
    const [currentTemp, setCurrentTemp] = useState(32);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const addReading = useCallback((temp: number) => {
        const check = checkThermalThreshold(temp, threshold);
        setReadings((prev) => [
            ...prev.slice(-59),
            { temperature: temp, timestamp: Date.now(), alert: !check.safe },
        ]);
        setCurrentTemp(temp);
    }, [threshold]);

    // Simulation
    useEffect(() => {
        if (!isSimulating) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            // Simulate realistic pyrometer data with occasional spikes
            const base = 35 + Math.sin(Date.now() / 5000) * 8;
            const noise = (Math.random() - 0.5) * 6;
            const spike = Math.random() > 0.92 ? 15 + Math.random() * 10 : 0;
            addReading(Math.round((base + noise + spike) * 10) / 10);
        }, 500);

        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isSimulating, addReading]);

    const check = checkThermalThreshold(currentTemp, threshold);
    const alerts = readings.filter((r) => r.alert);
    const maxTemp = readings.length > 0 ? Math.max(...readings.map((r) => r.temperature)) : 0;
    const avgTemp = readings.length > 0 ? readings.reduce((s, r) => s + r.temperature, 0) / readings.length : 0;

    // Chart dimensions
    const chartHeight = 180;
    const chartMax = 70; // max temp on Y axis

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <h4 style={styles.title}>🌡️ Monitor Térmico — Pirómetro IR</h4>
                <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    style={{
                        ...styles.simBtn,
                        ...(isSimulating ? styles.simBtnActive : {}),
                    }}
                >
                    {isSimulating ? "⏸ Detener" : "▶ Simular Datos"}
                </button>
            </div>

            {/* Current temperature gauge */}
            <div style={styles.gaugeRow}>
                <div style={styles.gauge}>
                    <div style={styles.gaugeLabel}>ACTUAL</div>
                    <div style={{ ...styles.gaugeValue, color: check.color }}>
                        {currentTemp.toFixed(1)}°C
                    </div>
                    <div style={{
                        ...styles.gaugeBadge,
                        background: `${check.color}22`,
                        color: check.color,
                    }}>
                        {check.safe ? "✅ En Rango Seguro" : check.severity === "critical" ? "🔴 CRÍTICO" : "⚠️ Alerta Térmica"}
                    </div>
                </div>
                <div style={styles.statsGrid}>
                    <StatBox label="Máxima" value={`${maxTemp.toFixed(1)}°C`} color={maxTemp >= threshold ? "#ef4444" : "#f1f5f9"} />
                    <StatBox label="Promedio" value={`${avgTemp.toFixed(1)}°C`} color="#06b6d4" />
                    <StatBox label="Umbral" value={`${threshold}°C`} color="#f59e0b" />
                    <StatBox label="Alertas" value={`${alerts.length}`} color={alerts.length > 0 ? "#ef4444" : "#10b981"} />
                </div>
            </div>

            {/* Temperature chart */}
            <div style={styles.chartWrapper}>
                <div style={styles.chart}>
                    {/* Y-axis labels */}
                    <div style={styles.yAxis}>
                        <span>70°</span><span>50°</span><span>30°</span><span>10°</span>
                    </div>

                    {/* Chart area */}
                    <div style={styles.chartArea}>
                        {/* Threshold line */}
                        <div style={{
                            ...styles.thresholdLine,
                            bottom: `${(threshold / chartMax) * 100}%`,
                        }}>
                            <span style={styles.thresholdLabel}>Umbral {threshold}°C</span>
                        </div>

                        {/* Bars */}
                        <div style={styles.bars}>
                            {readings.map((r, i) => {
                                const height = Math.min(100, (r.temperature / chartMax) * 100);
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            ...styles.bar,
                                            height: `${height}%`,
                                            background: r.alert
                                                ? "linear-gradient(to top, #ef4444, #dc2626)"
                                                : r.temperature > threshold * 0.85
                                                    ? "linear-gradient(to top, #f59e0b, #eab308)"
                                                    : "linear-gradient(to top, #06b6d4, #0891b2)",
                                            opacity: 0.4 + (i / readings.length) * 0.6,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert log */}
            {alerts.length > 0 && (
                <div style={styles.alertLog}>
                    <h5 style={styles.alertTitle}>⚠️ Registro de Alertas ({alerts.length})</h5>
                    <div style={styles.alertList}>
                        {alerts.slice(-5).reverse().map((a, i) => (
                            <div key={i} style={styles.alertItem}>
                                <span style={styles.alertDot}>🔴</span>
                                <span style={styles.alertTemp}>{a.temperature.toFixed(1)}°C</span>
                                <span style={styles.alertTime}>
                                    {new Date(a.timestamp).toLocaleTimeString()}
                                </span>
                                <span style={styles.alertExcess}>
                                    +{(a.temperature - threshold).toFixed(1)}°C sobre umbral
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={styles.statBox}>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "uppercase" as const }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}</div>
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: "flex", flexDirection: "column", gap: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: 16, padding: 20,
        border: "1px solid rgba(255,255,255,0.08)",
    },
    header: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    simBtn: {
        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)",
        color: "#94a3b8", cursor: "pointer",
    },
    simBtnActive: {
        background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)",
        color: "#10b981",
    },
    gaugeRow: { display: "flex", gap: 16, alignItems: "stretch" },
    gauge: {
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 4, padding: 16, minWidth: 140,
        background: "rgba(255,255,255,0.03)", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
    },
    gaugeLabel: { fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.1em" },
    gaugeValue: { fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" },
    gaugeBadge: {
        fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
    },
    statsGrid: {
        flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
    },
    statBox: {
        display: "flex", flexDirection: "column", gap: 2,
        padding: "10px 12px", background: "rgba(255,255,255,0.03)",
        borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
    },
    chartWrapper: {
        background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 12,
    },
    chart: { display: "flex", height: 180, gap: 8 },
    yAxis: {
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        fontSize: 9, color: "#475569", width: 28, textAlign: "right" as const,
    },
    chartArea: { flex: 1, position: "relative" },
    thresholdLine: {
        position: "absolute", left: 0, right: 0, height: 1,
        borderTop: "2px dashed #f59e0b", zIndex: 2,
    },
    thresholdLabel: {
        position: "absolute", right: 0, top: -14,
        fontSize: 9, color: "#f59e0b", fontWeight: 600,
    },
    bars: {
        display: "flex", alignItems: "flex-end", gap: 1,
        height: "100%", position: "relative",
    },
    bar: {
        flex: 1, minWidth: 2, borderRadius: "2px 2px 0 0",
        transition: "height 0.3s ease",
    },
    alertLog: {
        display: "flex", flexDirection: "column", gap: 8,
        padding: 12, background: "rgba(239,68,68,0.05)",
        borderRadius: 12, border: "1px solid rgba(239,68,68,0.15)",
    },
    alertTitle: { margin: 0, fontSize: 13, fontWeight: 600, color: "#fca5a5" },
    alertList: { display: "flex", flexDirection: "column", gap: 4 },
    alertItem: {
        display: "flex", alignItems: "center", gap: 8, fontSize: 12,
    },
    alertDot: { fontSize: 8 },
    alertTemp: { color: "#ef4444", fontWeight: 700, minWidth: 60 },
    alertTime: { color: "#64748b", fontSize: 11 },
    alertExcess: { color: "#fca5a5", fontSize: 11 },
};
