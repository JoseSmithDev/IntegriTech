/**
 * Nuclear Decontamination & Waste Management Dashboard.
 */
"use client";
import React from "react";
import RadiationHeatmap from "../../components/nuclear/RadiationHeatmap";
import DFCalculator from "../../components/nuclear/DFCalculator";
import WasteTracker from "../../components/nuclear/WasteTracker";
import ALARAPathfinder from "../../components/nuclear/ALARAPathfinder";
import ComplianceLog from "../../components/nuclear/ComplianceLog";
import MissionControl from "../../components/nuclear/MissionControl";

export default function NuclearPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <section style={s.headerSection}>
                <h2 style={s.h2}>☢️ Descontaminación Nuclear & Gestión de Residuos</h2>
                <p style={s.subtitle}>
                    Operaciones remotas · Seguridad ALARA · Cumplimiento OIEA (RS-G-1.7)
                </p>
                <div style={s.statsRow}>
                    <StatCard label="Estado" value="OPERATIVO" color="#10b981" icon="🟢" />
                    <StatCard label="Dosis Acumulada" value="12.4 μSv" color="#f59e0b" icon="☢️" />
                    <StatCard label="Paquetes Residuos" value="3" color="#ef4444" icon="📦" />
                    <StatCard label="Cadena OIEA" value="ÍNTEGRA" color="#06b6d4" icon="🔗" />
                </div>
            </section>

            {/* Row 1: Mission Control */}
            <section>
                <MissionControl />
            </section>

            {/* Row 2: Heatmap + ALARA side-by-side */}
            <section style={s.row2}>
                <div style={{ flex: 1 }}>
                    <RadiationHeatmap />
                </div>
                <div style={{ flex: 1 }}>
                    <ALARAPathfinder />
                </div>
            </section>

            {/* Row 3: DF Calculator + Waste Tracker */}
            <section style={s.row2}>
                <div style={{ flex: 1 }}>
                    <DFCalculator />
                </div>
                <div style={{ flex: 1 }}>
                    <WasteTracker />
                </div>
            </section>

            {/* Row 4: Compliance Log (full width) */}
            <section>
                <ComplianceLog />
            </section>
        </div>
    );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 18px", borderRadius: 12,
            background: `${color}08`, border: `1px solid ${color}22`,
            minWidth: 160,
        }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.01em" }}>{value}</div>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    headerSection: {
        display: "flex", flexDirection: "column", gap: 10,
        padding: "24px 28px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.06))",
        border: "1px solid rgba(239,68,68,0.12)",
    },
    h2: { margin: 0, fontSize: 24, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" },
    subtitle: { margin: 0, fontSize: 14, color: "#64748b" },
    statsRow: { display: "flex", gap: 12, flexWrap: "wrap" as const, marginTop: 4 },
    row2: { display: "flex", gap: 20, flexWrap: "wrap" as const },
};
