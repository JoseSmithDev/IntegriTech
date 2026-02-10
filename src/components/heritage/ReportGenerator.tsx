/**
 * ReportGenerator — Conservation report configuration and export.
 *
 * Allows selecting report contents and generating/downloading the PDF.
 */

"use client";

import React, { useState } from "react";

interface ReportGeneratorProps {
    projectId?: string;
    pathologiesCount?: number;
    colorimetryCount?: number;
    thermalReadings?: number;
    alertsCount?: number;
}

export default function ReportGenerator({
    projectId,
    pathologiesCount = 0,
    colorimetryCount = 0,
    thermalReadings = 0,
    alertsCount = 0,
}: ReportGeneratorProps) {
    const [operatorName, setOperatorName] = useState("");
    const [laserType, setLaserType] = useState("Nd:YAG Q-Switch");
    const [wavelength, setWavelength] = useState(1064);
    const [includePathology, setIncludePathology] = useState(true);
    const [includeColorimetry, setIncludeColorimetry] = useState(true);
    const [includeThermal, setIncludeThermal] = useState(true);
    const [includeCertificate, setIncludeCertificate] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 2000));
        setIsGenerating(false);
        setReportGenerated(true);
    };

    return (
        <div style={styles.wrapper}>
            <h4 style={styles.title}>📄 Generador de Informe de Conservación</h4>

            {/* Summary stats */}
            <div style={styles.statsRow}>
                <StatPill icon="📌" label="Patologías" value={pathologiesCount} />
                <StatPill icon="🎨" label="Mediciones ΔE" value={colorimetryCount} />
                <StatPill icon="🌡️" label="Lecturas Térmicas" value={thermalReadings} />
                <StatPill icon="⚠️" label="Alertas" value={alertsCount} alert={alertsCount > 0} />
            </div>

            {/* Configuration */}
            <div style={styles.config}>
                <div style={styles.configSection}>
                    <h5 style={styles.sectionTitle}>Datos del Operador</h5>
                    <div style={styles.fieldRow}>
                        <div style={styles.field}>
                            <label style={styles.fieldLabel}>Nombre del Operador</label>
                            <input
                                type="text" value={operatorName}
                                onChange={(e) => setOperatorName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.fieldLabel}>Tipo de Láser</label>
                            <select value={laserType} onChange={(e) => setLaserType(e.target.value)} style={styles.input}>
                                <option value="Nd:YAG Q-Switch">Nd:YAG Q-Switch</option>
                                <option value="Nd:YAG Long Pulse">Nd:YAG Long Pulse</option>
                                <option value="Er:YAG">Er:YAG</option>
                                <option value="Fiber Laser">Láser de Fibra</option>
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.fieldLabel}>Longitud de Onda (nm)</label>
                            <input
                                type="number" value={wavelength}
                                onChange={(e) => setWavelength(Number(e.target.value))}
                                style={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.configSection}>
                    <h5 style={styles.sectionTitle}>Contenido del Informe</h5>
                    <div style={styles.toggles}>
                        <ToggleItem
                            label="Mapa de Patologías"
                            sublabel={`${pathologiesCount} patologías identificadas`}
                            checked={includePathology}
                            onChange={setIncludePathology}
                            icon="📌"
                        />
                        <ToggleItem
                            label="Análisis Colorimétrico ΔE"
                            sublabel={`${colorimetryCount} mediciones registradas`}
                            checked={includeColorimetry}
                            onChange={setIncludeColorimetry}
                            icon="🎨"
                        />
                        <ToggleItem
                            label="Registro de Temperaturas"
                            sublabel={`${thermalReadings} lecturas, ${alertsCount} alertas`}
                            checked={includeThermal}
                            onChange={setIncludeThermal}
                            icon="🌡️"
                        />
                        <ToggleItem
                            label="Certificado de No Invasividad"
                            sublabel="SHA-256 con marca temporal digital"
                            checked={includeCertificate}
                            onChange={setIncludeCertificate}
                            icon="🏆"
                        />
                    </div>
                </div>
            </div>

            {/* Generate button */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                    ...styles.generateBtn,
                    ...(isGenerating ? styles.generateBtnLoading : {}),
                }}
            >
                {isGenerating ? "⏳ Generando Informe..." : "📋 Generar Informe de Conservación"}
            </button>

            {/* Success message */}
            {reportGenerated && (
                <div style={styles.success}>
                    <div style={styles.successIcon}>✅</div>
                    <div>
                        <strong>Informe generado exitosamente</strong>
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a7f3d0" }}>
                            Incluye certificado de no invasividad con firma SHA-256
                        </p>
                    </div>
                    <button style={styles.downloadBtn}>
                        📥 Descargar PDF
                    </button>
                </div>
            )}

            {/* Certificate preview */}
            {includeCertificate && (
                <div style={styles.certPreview}>
                    <div style={styles.certHeader}>
                        <span style={{ fontSize: 20 }}>🏛️</span>
                        <span style={styles.certTitle}>CERTIFICADO DE NO INVASIVIDAD</span>
                    </div>
                    <div style={styles.certBody}>
                        <div style={styles.certRow}>
                            <span style={styles.certLabel}>Verificación:</span>
                            <span style={styles.certValue}>SHA-256 con marca temporal</span>
                        </div>
                        <div style={styles.certRow}>
                            <span style={styles.certLabel}>Incluye:</span>
                            <span style={styles.certValue}>Histogramas de remoción (µm), logs de temperatura, análisis ΔE</span>
                        </div>
                        <div style={styles.certRow}>
                            <span style={styles.certLabel}>Formato:</span>
                            <span style={styles.certValue}>PDF firmado digitalmente • Conforme a normas de conservación</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────

function StatPill({ icon, label, value, alert = false }: {
    icon: string; label: string; value: number; alert?: boolean;
}) {
    return (
        <div style={{
            ...styles.statPill,
            borderColor: alert ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)",
        }}>
            <span>{icon}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: alert ? "#ef4444" : "#f1f5f9" }}>{value}</span>
            <span style={{ fontSize: 10, color: "#64748b" }}>{label}</span>
        </div>
    );
}

function ToggleItem({ label, sublabel, checked, onChange, icon }: {
    label: string; sublabel: string; checked: boolean; onChange: (v: boolean) => void; icon: string;
}) {
    return (
        <label style={styles.toggleItem}>
            <div style={styles.toggleLeft}>
                <span>{icon}</span>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{sublabel}</div>
                </div>
            </div>
            <div
                onClick={() => onChange(!checked)}
                style={{
                    ...styles.toggle,
                    background: checked ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.1)",
                }}
            >
                <div style={{
                    ...styles.toggleKnob,
                    transform: checked ? "translateX(18px)" : "translateX(0)",
                    background: checked ? "#06b6d4" : "#475569",
                }} />
            </div>
        </label>
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
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    statsRow: { display: "flex", gap: 8 },
    statPill: {
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        padding: "10px 8px", borderRadius: 10,
        background: "rgba(255,255,255,0.03)", border: "1px solid",
    },
    config: { display: "flex", flexDirection: "column", gap: 14 },
    configSection: { display: "flex", flexDirection: "column", gap: 8 },
    sectionTitle: { margin: 0, fontSize: 13, fontWeight: 600, color: "#94a3b8" },
    fieldRow: { display: "flex", gap: 10, flexWrap: "wrap" as const },
    field: { display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 160 },
    fieldLabel: { fontSize: 11, color: "#64748b", fontWeight: 600 },
    input: {
        padding: "8px 10px", borderRadius: 8, fontSize: 13,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)", color: "#e2e8f0",
    },
    toggles: { display: "flex", flexDirection: "column", gap: 6 },
    toggleItem: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 12px", borderRadius: 10,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
    },
    toggleLeft: { display: "flex", alignItems: "center", gap: 10 },
    toggle: {
        width: 40, height: 22, borderRadius: 11, padding: 2,
        cursor: "pointer", transition: "background 0.2s",
    },
    toggleKnob: {
        width: 18, height: 18, borderRadius: "50%",
        transition: "transform 0.2s, background 0.2s",
    },
    generateBtn: {
        padding: "14px 20px", borderRadius: 12, fontSize: 15, fontWeight: 700,
        background: "linear-gradient(135deg, #0891b2, #06b6d4)",
        border: "none", color: "#fff", cursor: "pointer",
        transition: "all 0.3s",
        boxShadow: "0 4px 16px rgba(6,182,212,0.3)",
    },
    generateBtnLoading: {
        opacity: 0.7, cursor: "wait",
    },
    success: {
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px", borderRadius: 12,
        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
        color: "#10b981",
    },
    successIcon: { fontSize: 24 },
    downloadBtn: {
        marginLeft: "auto", padding: "8px 14px", borderRadius: 8,
        background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
        color: "#10b981", fontWeight: 600, fontSize: 12, cursor: "pointer",
    },
    certPreview: {
        borderRadius: 12, overflow: "hidden",
        border: "1px solid rgba(234,179,8,0.2)",
    },
    certHeader: {
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px",
        background: "linear-gradient(135deg, rgba(234,179,8,0.12), rgba(234,179,8,0.05))",
    },
    certTitle: {
        fontSize: 12, fontWeight: 700, color: "#eab308",
        letterSpacing: "0.1em",
    },
    certBody: { padding: "10px 16px", display: "flex", flexDirection: "column", gap: 6 },
    certRow: { display: "flex", gap: 8, fontSize: 12 },
    certLabel: { color: "#64748b", fontWeight: 600, minWidth: 100 },
    certValue: { color: "#94a3b8" },
};
