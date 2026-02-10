/**
 * Heritage Integrity Dashboard — Main page assembling all heritage components.
 */

"use client";

import React, { useState } from "react";
import PointCloudViewer from "@/components/heritage/PointCloudViewer";
import ColorimetryPanel from "@/components/heritage/ColorimetryPanel";
import ThermalMonitor from "@/components/heritage/ThermalMonitor";
import MultispectralViewer from "@/components/heritage/MultispectralViewer";
import ReportGenerator from "@/components/heritage/ReportGenerator";

type StoneType = "limestone" | "marble" | "sandstone" | "granite" | "travertine" | "brick";

const STONE_LABELS: Record<StoneType, string> = {
    limestone: "Caliza",
    marble: "Mármol",
    sandstone: "Arenisca",
    granite: "Granito",
    travertine: "Travertino",
    brick: "Ladrillo",
};

export default function HeritagePage() {
    const [projectName, setProjectName] = useState("Catedral de Burgos — Fachada Sur");
    const [stoneType, setStoneType] = useState<StoneType>("limestone");
    const [pathologiesCount, setPathologiesCount] = useState(0);
    const [colorimetryCount, setColorimetryCount] = useState(0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <section className="animate-fade-in">
                <div style={styles.pageHeader}>
                    <div>
                        <h2 style={styles.pageTitle}>🏛️ Dashboard de Integridad Patrimonial</h2>
                        <p style={styles.pageSubtitle}>
                            Monitoreo no invasivo para conservación de monumentos históricos
                        </p>
                    </div>
                </div>
            </section>

            {/* Project Selector */}
            <section className="animate-slide-up" style={styles.projectBar}>
                <div style={styles.projectField}>
                    <label style={styles.label}>Proyecto</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        style={styles.projectInput}
                    />
                </div>
                <div style={styles.projectField}>
                    <label style={styles.label}>Tipo de Piedra</label>
                    <div style={styles.stoneButtons}>
                        {(Object.entries(STONE_LABELS) as [StoneType, string][]).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setStoneType(key)}
                                style={{
                                    ...styles.stoneBtn,
                                    ...(stoneType === key ? styles.stoneBtnActive : {}),
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Row 1: 3D Viewer + Colorimetry + Pathology */}
            <section className="animate-slide-up" style={styles.mainGrid}>
                {/* Left: Point Cloud Viewer */}
                <div style={{ flex: 2 }}>
                    <PointCloudViewer
                        projectName={projectName}
                        onPathologyAdd={() => setPathologiesCount((p) => p + 1)}
                    />
                </div>

                {/* Right: Colorimetry Panel */}
                <div style={{ flex: 1 }}>
                    <ColorimetryPanel
                        onMeasurementAdd={() => setColorimetryCount((c) => c + 1)}
                    />
                </div>
            </section>

            {/* Row 2: Thermal Monitor + Multispectral */}
            <section className="animate-slide-up" style={styles.secondGrid}>
                <div style={{ flex: 1 }}>
                    <ThermalMonitor />
                </div>
                <div style={{ flex: 1 }}>
                    <MultispectralViewer />
                </div>
            </section>

            {/* Row 3: Report Generator */}
            <section className="animate-slide-up">
                <ReportGenerator
                    pathologiesCount={pathologiesCount}
                    colorimetryCount={colorimetryCount}
                />
            </section>
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    pageHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    pageTitle: {
        margin: 0, fontSize: 26, fontWeight: 800, color: "#f1f5f9",
        letterSpacing: "-0.02em",
    },
    pageSubtitle: {
        margin: "4px 0 0", fontSize: 14, color: "#64748b",
    },
    projectBar: {
        display: "flex", gap: 20, flexWrap: "wrap" as const,
        padding: "16px 20px", borderRadius: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        border: "1px solid rgba(255,255,255,0.08)",
    },
    projectField: {
        display: "flex", flexDirection: "column", gap: 6,
    },
    label: {
        fontSize: 11, fontWeight: 700, color: "#64748b",
        letterSpacing: "0.05em", textTransform: "uppercase" as const,
    },
    projectInput: {
        padding: "8px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)", color: "#f1f5f9",
        minWidth: 280,
    },
    stoneButtons: { display: "flex", gap: 6, flexWrap: "wrap" as const },
    stoneBtn: {
        padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        color: "#94a3b8", cursor: "pointer", transition: "all 0.2s",
    },
    stoneBtnActive: {
        background: "rgba(6,182,212,0.15)", borderColor: "rgba(6,182,212,0.4)",
        color: "#06b6d4",
    },
    mainGrid: {
        display: "flex", gap: 20, alignItems: "flex-start",
    },
    secondGrid: {
        display: "flex", gap: 20,
    },
};
