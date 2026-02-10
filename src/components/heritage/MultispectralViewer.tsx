/**
 * MultispectralViewer — Toggle between Visible, UV, and IR imagery.
 *
 * Displays placeholder images with opacity overlay controls.
 */

"use client";

import React, { useState } from "react";

type Band = "visible" | "ultraviolet" | "infrared";

const BAND_INFO: Record<Band, { label: string; icon: string; color: string; description: string }> = {
    visible: {
        label: "Luz Visible",
        icon: "👁️",
        color: "#f1f5f9",
        description: "Imagen estándar en espectro visible. Muestra el estado superficial del material.",
    },
    ultraviolet: {
        label: "Ultravioleta (UV)",
        icon: "🟣",
        color: "#a855f7",
        description: "Revela resinas sintéticas, adhesivos y reparaciones anteriores que fluorescen bajo UV.",
    },
    infrared: {
        label: "Infrarrojo (IR)",
        icon: "🔴",
        color: "#ef4444",
        description: "Detecta humedad subsuperficial, patrones de capilaridad y variaciones térmicas ocultas.",
    },
};

export default function MultispectralViewer() {
    const [activeBand, setActiveBand] = useState<Band>("visible");
    const [overlayOpacity, setOverlayOpacity] = useState(0.5);
    const [comparisonMode, setComparisonMode] = useState(false);

    const info = BAND_INFO[activeBand];

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <h4 style={styles.title}>🔭 Visor Multiespectral</h4>
                <button
                    onClick={() => setComparisonMode(!comparisonMode)}
                    style={{
                        ...styles.modeBtn,
                        ...(comparisonMode ? styles.modeBtnActive : {}),
                    }}
                >
                    {comparisonMode ? "Vista Individual" : "Comparar Bandas"}
                </button>
            </div>

            {/* Band tabs */}
            <div style={styles.tabs}>
                {(Object.entries(BAND_INFO) as [Band, typeof BAND_INFO[Band]][]).map(([key, b]) => (
                    <button
                        key={key}
                        onClick={() => setActiveBand(key)}
                        style={{
                            ...styles.tab,
                            ...(activeBand === key ? {
                                background: `${b.color}18`,
                                borderColor: `${b.color}44`,
                                color: b.color,
                            } : {}),
                        }}
                    >
                        <span>{b.icon}</span>
                        <span>{b.label}</span>
                    </button>
                ))}
            </div>

            {/* Image area */}
            {comparisonMode ? (
                <div style={styles.comparison}>
                    {(Object.entries(BAND_INFO) as [Band, typeof BAND_INFO[Band]][]).map(([key, b]) => (
                        <div key={key} style={styles.comparisonPanel}>
                            <div style={{
                                ...styles.imageArea,
                                background: key === "visible"
                                    ? "linear-gradient(135deg, #1e293b, #334155)"
                                    : key === "ultraviolet"
                                        ? "linear-gradient(135deg, #1e1040, #3b0764)"
                                        : "linear-gradient(135deg, #1a0000, #450a0a)",
                                minHeight: 150,
                            }}>
                                <div style={styles.placeholderContent}>
                                    <span style={{ fontSize: 28 }}>{b.icon}</span>
                                    <span style={{ fontSize: 11, color: b.color }}>{b.label}</span>
                                </div>
                                {/* Simulated features */}
                                {key === "ultraviolet" && (
                                    <>
                                        <div style={{ ...styles.uvSpot, left: "30%", top: "40%" }} />
                                        <div style={{ ...styles.uvSpot, left: "65%", top: "55%", width: 28, height: 28 }} />
                                        <div style={{ ...styles.uvSpot, left: "45%", top: "70%", width: 16, height: 16 }} />
                                    </>
                                )}
                                {key === "infrared" && (
                                    <>
                                        <div style={{ ...styles.irSpot, left: "25%", top: "35%" }} />
                                        <div style={{ ...styles.irSpot, left: "55%", top: "45%", width: 40, height: 40 }} />
                                    </>
                                )}
                            </div>
                            <p style={{ fontSize: 10, color: "#64748b", margin: "4px 0 0", textAlign: "center" }}>
                                {b.description.split(".")[0]}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    ...styles.imageArea,
                    background: activeBand === "visible"
                        ? "linear-gradient(135deg, #1e293b, #334155)"
                        : activeBand === "ultraviolet"
                            ? "linear-gradient(135deg, #1e1040, #3b0764)"
                            : "linear-gradient(135deg, #1a0000, #450a0a)",
                }}>
                    <div style={styles.placeholderContent}>
                        <span style={{ fontSize: 48 }}>{info.icon}</span>
                        <span style={{ fontSize: 14, color: info.color, fontWeight: 600 }}>{info.label}</span>
                        <span style={{ fontSize: 11, color: "#64748b", textAlign: "center", maxWidth: 300 }}>
                            {info.description}
                        </span>
                    </div>

                    {/* Simulated features for UV */}
                    {activeBand === "ultraviolet" && (
                        <>
                            <div style={{ ...styles.uvSpot, left: "30%", top: "40%" }} />
                            <div style={{ ...styles.uvSpot, left: "65%", top: "55%", width: 35, height: 35 }} />
                            <div style={{ ...styles.uvSpot, left: "45%", top: "70%", width: 20, height: 20 }} />
                            <div style={styles.uvLegend}>
                                <span style={styles.uvLegendDot} />
                                Fluorescencia = Resina sintética / reparación
                            </div>
                        </>
                    )}

                    {/* Simulated features for IR */}
                    {activeBand === "infrared" && (
                        <>
                            <div style={{ ...styles.irSpot, left: "25%", top: "35%" }} />
                            <div style={{ ...styles.irSpot, left: "55%", top: "45%", width: 50, height: 50 }} />
                            <div style={styles.irLegend}>
                                <span style={styles.irLegendDot} />
                                Zona cálida = Humedad subsuperficial
                            </div>
                        </>
                    )}

                    <div style={styles.overlayLabel}>
                        Cargue imágenes multiespectrales para visualizar
                    </div>
                </div>
            )}

            {/* Opacity control (single mode) */}
            {!comparisonMode && (
                <div style={styles.opacityControl}>
                    <label style={{ fontSize: 11, color: "#64748b" }}>
                        Opacidad de superposición: {Math.round(overlayOpacity * 100)}%
                    </label>
                    <input
                        type="range" min={0} max={100} value={overlayOpacity * 100}
                        onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
                        style={{ width: "100%" }}
                    />
                </div>
            )}
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: "flex", flexDirection: "column", gap: 12,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: 16, padding: 20,
        border: "1px solid rgba(255,255,255,0.08)",
    },
    header: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    modeBtn: {
        padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)",
        color: "#94a3b8", cursor: "pointer",
    },
    modeBtnActive: {
        background: "rgba(6,182,212,0.15)", borderColor: "rgba(6,182,212,0.3)", color: "#06b6d4",
    },
    tabs: { display: "flex", gap: 8 },
    tab: {
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)",
        color: "#94a3b8", cursor: "pointer", transition: "all 0.2s",
    },
    comparison: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
    comparisonPanel: { display: "flex", flexDirection: "column" },
    imageArea: {
        position: "relative", minHeight: 260, borderRadius: 12,
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.06)",
    },
    placeholderContent: {
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        zIndex: 5,
    },
    overlayLabel: {
        position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center",
        fontSize: 11, color: "#475569", fontStyle: "italic",
    },
    uvSpot: {
        position: "absolute", width: 24, height: 24, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.6), transparent)",
        border: "1px solid rgba(168,85,247,0.4)",
        animation: "pulse 2s ease-in-out infinite",
    },
    uvLegend: {
        position: "absolute", top: 12, right: 12,
        fontSize: 10, color: "#a855f7", display: "flex", alignItems: "center", gap: 6,
        background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 6,
    },
    uvLegendDot: {
        width: 8, height: 8, borderRadius: "50%",
        background: "rgba(168,85,247,0.8)",
    },
    irSpot: {
        position: "absolute", width: 30, height: 30, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,68,68,0.5), rgba(234,179,8,0.2), transparent)",
        border: "1px solid rgba(239,68,68,0.3)",
    },
    irLegend: {
        position: "absolute", top: 12, right: 12,
        fontSize: 10, color: "#ef4444", display: "flex", alignItems: "center", gap: 6,
        background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 6,
    },
    irLegendDot: {
        width: 8, height: 8, borderRadius: "50%",
        background: "rgba(239,68,68,0.8)",
    },
    opacityControl: {
        display: "flex", flexDirection: "column", gap: 4,
    },
};
