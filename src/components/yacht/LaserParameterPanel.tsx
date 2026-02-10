/**
 * LaserParameterPanel — Interactive configuration for laser cleaning.
 */
"use client";
import React, { useState, useEffect } from "react";

export default function LaserParameterPanel() {
    const [powerW, setPowerW] = useState(500); // Watts
    const [freqKHz, setFreqKHz] = useState(50); // kHz
    const [scanSpeedMmS, setScanSpeedMmS] = useState(2000); // mm/s
    const [spotSizeMm, setSpotSizeMm] = useState(0.8); // mm

    // Physics calcs
    const pulseEnergyJ = powerW / (freqKHz * 1000); // E = P / f
    const spotAreaCm2 = Math.PI * Math.pow((spotSizeMm / 10) / 2, 2);
    const fluenceJcm2 = pulseEnergyJ / spotAreaCm2; // F = E / A
    const ablationRateMm3S = powerW * 0.15; // Rough estimate for specific ablation energy

    // Safety thresholds
    const maxFluenceAl = 8.0; // J/cm² damage threshold for Aluminum
    const isSafe = fluenceJcm2 < maxFluenceAl;

    return (
        <div style={s.wrap}>
            <h3 style={s.title}>⚡ Parámetros del Láser (Nd:YAG 1064nm)</h3>

            <div style={s.grid}>
                <div style={s.controls}>
                    <Control label="Potencia Media" value={powerW} unit="W" min={100} max={2000} step={50} onChange={setPowerW} />
                    <Control label="Frecuencia Pulso" value={freqKHz} unit="kHz" min={20} max={200} step={10} onChange={setFreqKHz} />
                    <Control label="Velocidad Escaneo" value={scanSpeedMmS} unit="mm/s" min={500} max={5000} step={100} onChange={setScanSpeedMmS} />
                    <Control label="Diámetro Spot" value={spotSizeMm} unit="mm" min={0.2} max={2.0} step={0.1} onChange={setSpotSizeMm} />
                </div>

                <div style={s.readout}>
                    <div style={s.metricGrid}>
                        <Metric label="Energía Pulso" value={(pulseEnergyJ * 1000).toFixed(1)} unit="mJ" />
                        <Metric label="Fluencia" value={fluenceJcm2.toFixed(2)} unit="J/cm²" color={isSafe ? "#10b981" : "#ef4444"} />
                        <Metric label="Tasa Ablación" value={ablationRateMm3S.toFixed(0)} unit="mm³/s" />
                    </div>

                    <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: 8, background: isSafe ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", border: `1px solid ${isSafe ? "#10b981" : "#ef4444"}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: isSafe ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 13 }}>
                            <span>{isSafe ? "✓ PARÁMETROS SEGUROS" : "⚠️ RIESGO DE DAÑO A SUSTRATO"}</span>
                        </div>
                        <div style={{ fontSize: 11, color: isSafe ? "#065f46" : "#7f1d1d", marginTop: 4 }}>
                            Fluencia {fluenceJcm2.toFixed(2)} J/cm² {isSafe ? "debajo" : "excede"} el umbral de daño para Aluminio ({maxFluenceAl} J/cm²).
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Control({ label, value, unit, min, max, step, onChange }: any) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
                <span>{label}</span>
                <span style={{ fontWeight: 700, color: "#e2e8f0" }}>{value} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: "#06b6d4" }} />
        </div>
    );
}

function Metric({ label, value, unit, color = "#f1f5f9" }: any) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontSize: 20, fontWeight: 800, color }}>{value} <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{unit}</span></span>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,.08)" },
    title: { margin: "0 0 16px 0", fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
    controls: { display: "flex", flexDirection: "column", gap: 16 },
    readout: { background: "rgba(0,0,0,.2)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,.05)" },
    metricGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
};
