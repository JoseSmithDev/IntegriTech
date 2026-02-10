/**
 * DFCalculator — Decontamination Factor interactive calculator.
 */
"use client";
import React, { useState, useMemo } from "react";
import { decontaminationFactor, radioactiveDecay, shieldingAttenuation, ISOTOPES, SHIELD_MATERIALS, type ShieldMaterial } from "../../lib/nuclear-formulas";

export default function DFCalculator() {
    const [initialBq, setInitialBq] = useState(1e6);
    const [finalBq, setFinalBq] = useState(1e4);
    const [selectedIsotope, setSelectedIsotope] = useState("Cs-137");
    const [elapsedYears, setElapsedYears] = useState(5);
    const [shieldMat, setShieldMat] = useState("lead");
    const [thicknessCm, setThicknessCm] = useState(5);
    const [history, setHistory] = useState<Array<{ df: number; eff: number; color: string }>>([]);

    const dfResult = useMemo(() => decontaminationFactor(initialBq, finalBq), [initialBq, finalBq]);
    const iso = ISOTOPES[selectedIsotope];
    const decayR = useMemo(() => radioactiveDecay(initialBq, elapsedYears * 365.25 * 24 * 3600, iso.halfLifeSeconds), [initialBq, elapsedYears, iso]);
    const mat = SHIELD_MATERIALS[shieldMat];
    const shieldR = useMemo(() => shieldingAttenuation(100, thicknessCm, mat.mu), [thicknessCm, mat]);

    const saveMeasure = () => {
        setHistory((p) => [{ df: dfResult.df, eff: dfResult.efficiencyPct, color: dfResult.color }, ...p].slice(0, 8));
    };

    return (
        <div style={s.wrap}>
            <h4 style={s.title}>⚗️ Calculadora de Factor de Descontaminación (DF)</h4>

            {/* DF Calculator */}
            <div style={s.section}>
                <h5 style={s.secTitle}>DF = Aᵢ / Aꜰ</h5>
                <div style={s.row}>
                    <Field label="Actividad Inicial (Bq)" value={initialBq} onChange={setInitialBq} />
                    <Field label="Actividad Final (Bq)" value={finalBq} onChange={setFinalBq} />
                </div>
                <div style={{ ...s.resultCard, borderColor: `${dfResult.color}44` }}>
                    <div style={s.resultRow}>
                        <div>
                            <div style={{ fontSize: 11, color: "#64748b" }}>Factor DF</div>
                            <div style={{ fontSize: 36, fontWeight: 800, color: dfResult.color, letterSpacing: "-0.03em" }}>{dfResult.df.toFixed(2)}</div>
                        </div>
                        <div style={{ textAlign: "right" as const }}>
                            <span style={{ ...s.badge, background: `${dfResult.color}22`, color: dfResult.color }}>{dfResult.classificationEs}</span>
                            <div style={{ fontSize: 13, color: "#e2e8f0", marginTop: 4 }}>Eficiencia: <strong>{dfResult.efficiencyPct.toFixed(2)}%</strong></div>
                        </div>
                    </div>
                    {/* Scale bar */}
                    <div style={s.scale}>
                        <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ flex: 1, background: "#ef4444" }} />
                            <div style={{ flex: 4, background: "#f59e0b" }} />
                            <div style={{ flex: 5, background: "#06b6d4" }} />
                            <div style={{ flex: 10, background: "#10b981" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#475569", marginTop: 3 }}>
                            <span>1</span><span>2</span><span>10</span><span>100+</span>
                        </div>
                    </div>
                    <button onClick={saveMeasure} style={s.saveBtn}>💾 Registrar Medición</button>
                </div>
            </div>

            {/* Decay Calculator */}
            <div style={s.section}>
                <h5 style={s.secTitle}>📉 Decaimiento Radiactivo: A(t) = A₀ · e^(-λt)</h5>
                <div style={s.row}>
                    <div style={s.field}>
                        <label style={s.label}>Isótopo</label>
                        <select value={selectedIsotope} onChange={(e) => setSelectedIsotope(e.target.value)} style={s.input}>
                            {Object.entries(ISOTOPES).map(([key, info]) => (
                                <option key={key} value={key}>{key} — {info.name} (t½ {info.halfLifeHuman})</option>
                            ))}
                        </select>
                    </div>
                    <Field label="Años Transcurridos" value={elapsedYears} onChange={setElapsedYears} />
                </div>
                <div style={s.miniResult}>
                    <span>Actividad restante: <strong style={{ color: "#06b6d4" }}>{decayR.remaining.toExponential(3)} Bq</strong></span>
                    <span>Fracción: <strong>{(decayR.fraction * 100).toFixed(4)}%</strong></span>
                    <span>Vidas medias transcurridas: <strong>{decayR.halfLivesElapsed.toFixed(2)}</strong></span>
                </div>
            </div>

            {/* Shielding Calculator */}
            <div style={s.section}>
                <h5 style={s.secTitle}>🛡️ Atenuación por Blindaje: I = I₀ · e^(-μx)</h5>
                <div style={s.row}>
                    <div style={s.field}>
                        <label style={s.label}>Material</label>
                        <select value={shieldMat} onChange={(e) => setShieldMat(e.target.value)} style={s.input}>
                            {Object.entries(SHIELD_MATERIALS).map(([key, m]) => (
                                <option key={key} value={key}>{m.nameEs} (μ={m.mu}, HVL={m.hvl} cm)</option>
                            ))}
                        </select>
                    </div>
                    <Field label="Espesor (cm)" value={thicknessCm} onChange={setThicknessCm} />
                </div>
                <div style={s.miniResult}>
                    <span>Intensidad tras blindaje: <strong style={{ color: "#10b981" }}>{shieldR.attenuated.toFixed(4)} μSv/h</strong></span>
                    <span>Reducción: <strong style={{ color: "#10b981" }}>{shieldR.reductionPct.toFixed(2)}%</strong></span>
                </div>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <h5 style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Historial DF</h5>
                    {history.map((h, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: h.color }} />
                            <span style={{ color: h.color, fontWeight: 700 }}>DF {h.df.toFixed(2)}</span>
                            <span style={{ color: "#64748b" }}>{h.eff.toFixed(1)}% eficiencia</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div style={s.field}>
            <label style={s.label}>{label}</label>
            <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} style={s.input} />
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 16, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,.08)" },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    section: { display: "flex", flexDirection: "column", gap: 8 },
    secTitle: { margin: 0, fontSize: 13, fontWeight: 700, color: "#94a3b8" },
    row: { display: "flex", gap: 10, flexWrap: "wrap" as const },
    field: { display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 140 },
    label: { fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const },
    input: { padding: "7px 10px", borderRadius: 8, fontSize: 13, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "#e2e8f0" },
    resultCard: { background: "rgba(255,255,255,.03)", borderRadius: 12, padding: 14, border: "1px solid", display: "flex", flexDirection: "column", gap: 10 },
    resultRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    badge: { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase" as const },
    scale: { position: "relative" },
    saveBtn: { padding: "7px 14px", borderRadius: 8, background: "rgba(6,182,212,.15)", border: "1px solid rgba(6,182,212,.3)", color: "#06b6d4", fontWeight: 600, fontSize: 12, cursor: "pointer" },
    miniResult: { display: "flex", flexWrap: "wrap" as const, gap: 16, fontSize: 12, color: "#94a3b8", padding: "8px 12px", background: "rgba(0,0,0,.2)", borderRadius: 10 },
};
