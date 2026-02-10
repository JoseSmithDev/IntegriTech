/**
 * PointCloudViewer — 3D viewer placeholder with pathology tagging system.
 *
 * Uses a Canvas-based visualization (Three.js would be used for real point clouds).
 * Supports adding pathology markers at clicked positions.
 */

"use client";

import React, { useState, useRef, useCallback } from "react";

// ── Types ────────────────────────────────────────────────

type PathologyType = "black_crust" | "biological" | "nitrates" | "salt_efflorescence" | "delamination" | "graffiti";

interface PathologyTag {
    id: string;
    type: PathologyType;
    severity: number;
    x: number;
    y: number;
    notes: string;
}

const PATHOLOGY_LABELS: Record<PathologyType, { label: string; color: string; icon: string }> = {
    black_crust: { label: "Costra Negra", color: "#1e1e1e", icon: "⬛" },
    biological: { label: "Colonización Biológica", color: "#22c55e", icon: "🌿" },
    nitrates: { label: "Nitratos", color: "#f59e0b", icon: "⚗️" },
    salt_efflorescence: { label: "Eflorescencia Salina", color: "#e2e8f0", icon: "🧂" },
    delamination: { label: "Delaminación", color: "#ef4444", icon: "📐" },
    graffiti: { label: "Grafiti", color: "#8b5cf6", icon: "🎨" },
};

const SEVERITY_LABELS = ["", "Leve", "Moderada", "Severa", "Grave", "Crítica"];

// ── Component ────────────────────────────────────────────

interface PointCloudViewerProps {
    projectName?: string;
    onPathologyAdd?: (tag: PathologyTag) => void;
}

export default function PointCloudViewer({ projectName = "Proyecto", onPathologyAdd }: PointCloudViewerProps) {
    const [tags, setTags] = useState<PathologyTag[]>([]);
    const [selectedType, setSelectedType] = useState<PathologyType>("black_crust");
    const [severity, setSeverity] = useState(3);
    const [isTagging, setIsTagging] = useState(false);
    const [hoveredTag, setHoveredTag] = useState<string | null>(null);
    const viewerRef = useRef<HTMLDivElement>(null);

    const handleViewerClick = useCallback((e: React.MouseEvent) => {
        if (!isTagging || !viewerRef.current) return;

        const rect = viewerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newTag: PathologyTag = {
            id: `tag-${Date.now()}`,
            type: selectedType,
            severity,
            x,
            y,
            notes: "",
        };

        setTags((prev) => [...prev, newTag]);
        onPathologyAdd?.(newTag);
    }, [isTagging, selectedType, severity, onPathologyAdd]);

    const removeTag = (id: string) => {
        setTags((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div style={styles.wrapper}>
            {/* Toolbar */}
            <div style={styles.toolbar}>
                <h4 style={styles.toolbarTitle}>🏛️ Visor 3D — Nube de Puntos</h4>
                <div style={styles.toolbarActions}>
                    <button
                        onClick={() => setIsTagging(!isTagging)}
                        style={{
                            ...styles.tagBtn,
                            ...(isTagging ? styles.tagBtnActive : {}),
                        }}
                    >
                        {isTagging ? "✓ Modo Etiquetado Activo" : "📌 Etiquetar Patología"}
                    </button>
                </div>
            </div>

            {/* Tagging controls (visible when tagging) */}
            {isTagging && (
                <div style={styles.tagControls}>
                    <div style={styles.tagField}>
                        <label style={styles.tagLabel}>Tipo:</label>
                        <div style={styles.tagOptions}>
                            {(Object.entries(PATHOLOGY_LABELS) as [PathologyType, typeof PATHOLOGY_LABELS[PathologyType]][]).map(([key, val]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedType(key)}
                                    style={{
                                        ...styles.pathologyBtn,
                                        borderColor: selectedType === key ? val.color : "rgba(255,255,255,0.1)",
                                        background: selectedType === key ? `${val.color}22` : "transparent",
                                    }}
                                >
                                    {val.icon} {val.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={styles.tagField}>
                        <label style={styles.tagLabel}>Severidad: {SEVERITY_LABELS[severity]} ({severity}/5)</label>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            value={severity}
                            onChange={(e) => setSeverity(Number(e.target.value))}
                            style={styles.slider}
                        />
                    </div>
                    <p style={styles.hint}>Haz clic en el visor para colocar una etiqueta</p>
                </div>
            )}

            {/* 3D Viewer Area */}
            <div
                ref={viewerRef}
                onClick={handleViewerClick}
                style={{
                    ...styles.viewer,
                    cursor: isTagging ? "crosshair" : "grab",
                }}
            >
                {/* Simulated point cloud visualization */}
                <div style={styles.pointCloudPlaceholder}>
                    <div style={styles.gridOverlay}>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} style={{
                                ...styles.gridDot,
                                left: `${10 + Math.random() * 80}%`,
                                top: `${10 + Math.random() * 80}%`,
                                opacity: 0.3 + Math.random() * 0.5,
                                width: 2 + Math.random() * 4,
                                height: 2 + Math.random() * 4,
                            }} />
                        ))}
                    </div>
                    <div style={styles.buildingOutline}>
                        <div style={styles.buildingBody} />
                        <div style={styles.buildingRoof} />
                        <div style={styles.buildingDoor} />
                        <div style={styles.buildingWindow1} />
                        <div style={styles.buildingWindow2} />
                    </div>
                    <div style={styles.overlayText}>
                        Cargue un archivo .las / .laz para visualizar la nube de puntos
                    </div>
                </div>

                {/* Pathology tags */}
                {tags.map((tag) => {
                    const info = PATHOLOGY_LABELS[tag.type];
                    return (
                        <div
                            key={tag.id}
                            onMouseEnter={() => setHoveredTag(tag.id)}
                            onMouseLeave={() => setHoveredTag(null)}
                            style={{
                                ...styles.tagPin,
                                left: `${tag.x}%`,
                                top: `${tag.y}%`,
                                borderColor: info.color,
                                background: `${info.color}33`,
                            }}
                        >
                            <span>{info.icon}</span>
                            {hoveredTag === tag.id && (
                                <div style={styles.tagTooltip}>
                                    <strong>{info.label}</strong>
                                    <span>Severidad: {SEVERITY_LABELS[tag.severity]}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeTag(tag.id); }}
                                        style={styles.removeBtn}
                                    >
                                        ✕ Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Tag Summary */}
            {tags.length > 0 && (
                <div style={styles.summary}>
                    <h5 style={styles.summaryTitle}>Patologías Identificadas ({tags.length})</h5>
                    <div style={styles.summaryGrid}>
                        {(Object.entries(PATHOLOGY_LABELS) as [PathologyType, typeof PATHOLOGY_LABELS[PathologyType]][]).map(([key, val]) => {
                            const count = tags.filter((t) => t.type === key).length;
                            if (count === 0) return null;
                            return (
                                <div key={key} style={styles.summaryItem}>
                                    <span>{val.icon}</span>
                                    <span style={{ color: val.color }}>{val.label}</span>
                                    <span style={styles.summaryCount}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    wrapper: { display: "flex", flexDirection: "column", gap: 0 },
    toolbar: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 16px",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: "16px 16px 0 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    toolbarTitle: { margin: 0, fontSize: 15, fontWeight: 700, color: "#f1f5f9" },
    toolbarActions: { display: "flex", gap: 8 },
    tagBtn: {
        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)",
        color: "#94a3b8", cursor: "pointer", transition: "all 0.2s",
    },
    tagBtnActive: {
        background: "rgba(6,182,212,0.15)", borderColor: "rgba(6,182,212,0.4)",
        color: "#06b6d4",
    },
    tagControls: {
        display: "flex", flexDirection: "column", gap: 10,
        padding: "12px 16px",
        background: "rgba(6,182,212,0.05)",
        borderBottom: "1px solid rgba(6,182,212,0.1)",
    },
    tagField: { display: "flex", flexDirection: "column", gap: 6 },
    tagLabel: { fontSize: 12, fontWeight: 600, color: "#94a3b8" },
    tagOptions: { display: "flex", flexWrap: "wrap" as const, gap: 6 },
    pathologyBtn: {
        padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
        border: "1px solid", color: "#e2e8f0", cursor: "pointer",
        background: "transparent", transition: "all 0.2s",
    },
    slider: { width: "100%", maxWidth: 200 },
    hint: { fontSize: 11, color: "#06b6d4", margin: 0, fontStyle: "italic" },
    viewer: {
        position: "relative", minHeight: 420,
        background: "linear-gradient(180deg, #0c1222 0%, #162032 50%, #0f172a 100%)",
        overflow: "hidden",
    },
    pointCloudPlaceholder: {
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    gridOverlay: { position: "absolute", inset: 0 },
    gridDot: {
        position: "absolute", borderRadius: "50%",
        background: "rgba(6,182,212,0.4)",
    },
    buildingOutline: {
        position: "relative", width: 200, height: 250,
    },
    buildingBody: {
        position: "absolute", bottom: 0, width: 200, height: 180,
        border: "2px solid rgba(6,182,212,0.2)", borderRadius: 4,
        background: "rgba(6,182,212,0.03)",
    },
    buildingRoof: {
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "110px solid transparent", borderRight: "110px solid transparent",
        borderBottom: "70px solid rgba(6,182,212,0.08)",
    },
    buildingDoor: {
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 36, height: 56,
        border: "2px solid rgba(6,182,212,0.15)", borderRadius: "4px 4px 0 0",
    },
    buildingWindow1: {
        position: "absolute", bottom: 100, left: 30,
        width: 32, height: 32,
        border: "2px solid rgba(6,182,212,0.15)", borderRadius: 4,
    },
    buildingWindow2: {
        position: "absolute", bottom: 100, right: 30,
        width: 32, height: 32,
        border: "2px solid rgba(6,182,212,0.15)", borderRadius: 4,
    },
    overlayText: {
        position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center",
        fontSize: 12, color: "#475569", fontStyle: "italic",
    },
    tagPin: {
        position: "absolute", transform: "translate(-50%, -50%)",
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, cursor: "pointer", transition: "transform 0.2s",
        zIndex: 10,
    },
    tagTooltip: {
        position: "absolute", top: "110%", left: "50%", transform: "translateX(-50%)",
        background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "8px 12px", whiteSpace: "nowrap" as const,
        display: "flex", flexDirection: "column", gap: 4,
        fontSize: 11, color: "#e2e8f0", zIndex: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    },
    removeBtn: {
        fontSize: 10, color: "#ef4444", background: "transparent",
        border: "none", cursor: "pointer", textAlign: "left" as const, padding: 0,
    },
    summary: {
        padding: "12px 16px",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: "0 0 16px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
    },
    summaryTitle: { margin: "0 0 8px 0", fontSize: 13, fontWeight: 600, color: "#94a3b8" },
    summaryGrid: { display: "flex", flexWrap: "wrap" as const, gap: 10 },
    summaryItem: {
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 12, color: "#e2e8f0",
    },
    summaryCount: {
        fontSize: 11, fontWeight: 700, color: "#06b6d4",
        background: "rgba(6,182,212,0.15)", padding: "2px 6px", borderRadius: 4,
    },
};
