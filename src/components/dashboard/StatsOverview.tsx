/**
 * StatsOverview — KPI cards for the dashboard.
 */

"use client";

import React from "react";
import { formatEUR } from "../../lib/formulas";

interface Stat {
    label: string;
    value: string | number;
    icon: string;
    change?: string;      // e.g. "+12%"
    changeType?: "up" | "down" | "neutral";
}

interface StatsOverviewProps {
    stats?: Stat[];
}

const DEFAULT_STATS: Stat[] = [
    { label: "Yates Activos", value: 4, icon: "🛥️", change: "Flota Premium", changeType: "neutral" },
    { label: "Ahorro Total", value: "€284,500", icon: "💰", change: "+15% vs tradicional", changeType: "up" },
    { label: "Huella CO₂", value: "-4.8 ton", icon: "🌱", change: "85% reducción / año", changeType: "up" },
    { label: "Próxima Limpieza", value: "15 Feb", icon: "📅", change: "Deep Blue (Antifouling)", changeType: "neutral" },
];

export default function StatsOverview({ stats = DEFAULT_STATS }: StatsOverviewProps) {
    return (
        <div style={styles.grid}>
            {stats.map((stat, i) => (
                <div key={i} style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={styles.icon}>{stat.icon}</span>
                        <span style={styles.label}>{stat.label}</span>
                    </div>
                    <div style={styles.value}>{stat.value}</div>
                    {stat.change && (
                        <div
                            style={{
                                ...styles.change,
                                color:
                                    stat.changeType === "up"
                                        ? "#10b981"
                                        : stat.changeType === "down"
                                            ? "#06b6d4"
                                            : "#94a3b8",
                            }}
                        >
                            {stat.change}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
    },
    card: {
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: 14,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    icon: { fontSize: 20 },
    label: {
        fontSize: 13,
        fontWeight: 500,
        color: "#94a3b8",
        textTransform: "uppercase" as const,
        letterSpacing: "0.04em",
    },
    value: {
        fontSize: 28,
        fontWeight: 800,
        color: "#f1f5f9",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
    },
    change: {
        fontSize: 12,
        fontWeight: 600,
    },
};
