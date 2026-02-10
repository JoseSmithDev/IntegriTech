/**
 * MissionControl — Remote-operated laser decontamination mission workflow.
 */
"use client";
import React, { useState, useEffect, useCallback } from "react";

type Phase = "pre_check" | "survey" | "deploy" | "decontaminate" | "sample" | "report";

interface MissionPhase {
    id: Phase;
    name: string;
    icon: string;
    description: string;
    checklist: string[];
    duration: string;
}

const PHASES: MissionPhase[] = [
    {
        id: "pre_check", name: "Pre-Verificación", icon: "🔍",
        description: "Verificación de equipos, calibración de sensores, y validación de comunicaciones antes del despliegue.",
        checklist: ["Comunicación con robot verificada", "Calibración Geiger completada", "Calibración pirómetro IR", "Suministro eléctrico confirmado", "EPPs disponibles para equipo local"],
        duration: "30 min",
    },
    {
        id: "survey", name: "Reconocimiento Radiológico", icon: "📡",
        description: "Mapeo inicial de campo de radiación con robot equipado con detector Geiger para generar el gemelo digital.",
        checklist: ["Ruta de reconocimiento programada", "Lecturas Geiger tomadas en cuadrícula", "Mapa de calor generado", "Zonas de exclusión definidas", "Distancias seguras calculadas"],
        duration: "1-2 horas",
    },
    {
        id: "deploy", name: "Despliegue ALARA", icon: "🤖",
        description: "Cálculo de ruta óptima ALARA y despliegue del sistema láser robótico a la zona de trabajo.",
        checklist: ["Ruta ALARA calculada", "Robot desplegado en posición", "Láser Nd:YAG activado remotamente", "Dosímetro robot calibrado", "Enlace de video en vivo confirmado"],
        duration: "15-30 min",
    },
    {
        id: "decontaminate", name: "Descontaminación Láser", icon: "⚡",
        description: "Ejecución de la limpieza láser controlada remotamente. Monitoreo continuo de temperatura y dosis.",
        checklist: ["Parámetros láser configurados", "Monitoreo térmico activo (< 50°C)", "Flujo de gas inerte confirmado", "Residuos capturados en sistema HEPA", "DF medido cada 15 min"],
        duration: "4-8 horas",
    },
    {
        id: "sample", name: "Muestreo & Verificación", icon: "🧪",
        description: "Toma de muestras post-descontaminación para verificar DF alcanzado y caracterizar residuos generados.",
        checklist: ["Muestra de barrido tomada", "DF final calculado", "Residuos caracterizados (isótopos)", "Paquetes de residuos etiquetados ISO", "Cadena de custodia registrada"],
        duration: "1-2 horas",
    },
    {
        id: "report", name: "Informe Regulatorio", icon: "📄",
        description: "Generación del informe para OIEA con dosimetría, trazabilidad de residuos y certificado de descontaminación.",
        checklist: ["Dosimetría del personal compilada", "Log de cumplimiento exportado", "Cadena de custodia sellada", "Certificado SHA-256 generado", "Informe enviado a autoridad reguladora"],
        duration: "2-4 horas",
    },
];

export default function MissionControl() {
    const [activePhase, setActivePhase] = useState(0);
    const [checkStates, setCheckStates] = useState<Record<string, boolean[]>>(() => {
        const cs: Record<string, boolean[]> = {};
        PHASES.forEach((p) => { cs[p.id] = p.checklist.map(() => false); });
        return cs;
    });
    const [missionActive, setMissionActive] = useState(false);
    const [elapsedSec, setElapsedSec] = useState(0);
    const [alerts, setAlerts] = useState<string[]>([]);

    useEffect(() => {
        if (!missionActive) return;
        const t = setInterval(() => setElapsedSec((p) => p + 1), 1000);
        return () => clearInterval(t);
    }, [missionActive]);

    const toggleCheck = useCallback((phaseId: string, idx: number) => {
        setCheckStates((prev) => {
            const n = { ...prev, [phaseId]: [...prev[phaseId]] };
            n[phaseId][idx] = !n[phaseId][idx];
            return n;
        });
    }, []);

    const phaseProgress = (phaseId: string) => {
        const checks = checkStates[phaseId];
        const done = checks.filter(Boolean).length;
        return Math.round((done / checks.length) * 100);
    };

    const overallProgress = () => {
        const total = PHASES.reduce((a, p) => a + p.checklist.length, 0);
        const done = Object.values(checkStates).flat().filter(Boolean).length;
        return Math.round((done / total) * 100);
    };

    const startMission = () => {
        setMissionActive(true);
        setAlerts((p) => [`[${new Date().toLocaleTimeString("es-ES")}] ▶ MISIÓN INICIADA`, ...p]);
    };

    const abortMission = () => {
        setMissionActive(false);
        setAlerts((p) => [`[${new Date().toLocaleTimeString("es-ES")}] ⛔ MISIÓN ABORTADA`, ...p]);
    };

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    const current = PHASES[activePhase];

    return (
        <div style={st.wrap}>
            <div style={st.headerRow}>
                <div>
                    <h4 style={st.title}>🎮 Control de Misión — Descontaminación Remota</h4>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Flujo operativo para misión láser teledirigida</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {missionActive ? (
                        <>
                            <span style={{ fontSize: 20, fontWeight: 800, color: "#10b981", fontFamily: "monospace" }}>{formatTime(elapsedSec)}</span>
                            <button onClick={abortMission} style={{ ...st.btn, background: "rgba(239,68,68,.15)", borderColor: "#ef4444", color: "#ef4444" }}>⛔ Abortar</button>
                        </>
                    ) : (
                        <button onClick={startMission} style={{ ...st.btn, background: "rgba(16,185,129,.15)", borderColor: "#10b981", color: "#10b981" }}>▶ Iniciar Misión</button>
                    )}
                </div>
            </div>

            {/* Overall progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}>
                    <span>Progreso general</span>
                    <span style={{ fontWeight: 700, color: "#06b6d4" }}>{overallProgress()}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,.05)" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#06b6d4,#10b981)", width: `${overallProgress()}%`, transition: "width 0.5s" }} />
                </div>
            </div>

            {/* Phase tabs */}
            <div style={st.phaseTabs}>
                {PHASES.map((p, i) => {
                    const prog = phaseProgress(p.id);
                    const isComplete = prog === 100;
                    const isActive = i === activePhase;
                    return (
                        <div key={p.id} onClick={() => setActivePhase(i)} style={{
                            ...st.phaseTab,
                            borderColor: isActive ? "#06b6d4" : isComplete ? "#10b981" : "rgba(255,255,255,.05)",
                            background: isActive ? "rgba(6,182,212,.08)" : isComplete ? "rgba(16,185,129,.05)" : "rgba(0,0,0,.15)",
                        }}>
                            <span style={{ fontSize: 18 }}>{p.icon}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "#06b6d4" : "#94a3b8" }}>{p.name}</span>
                            <span style={{ fontSize: 9, color: isComplete ? "#10b981" : "#475569" }}>{prog}%</span>
                        </div>
                    );
                })}
            </div>

            {/* Active phase detail */}
            <div style={st.phaseDetail}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h5 style={{ margin: 0, fontSize: 15, color: "#e2e8f0" }}>{current.icon} Fase {activePhase + 1}: {current.name}</h5>
                    <span style={{ fontSize: 11, color: "#64748b" }}>⏱ Estimado: {current.duration}</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 8px" }}>{current.description}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {current.checklist.map((item, i) => {
                        const checked = checkStates[current.id][i];
                        return (
                            <div key={i} onClick={() => toggleCheck(current.id, i)} style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
                                borderRadius: 8, background: checked ? "rgba(16,185,129,.08)" : "rgba(0,0,0,.15)",
                                cursor: "pointer", transition: "all 0.2s",
                                border: `1px solid ${checked ? "rgba(16,185,129,.2)" : "transparent"}`,
                            }}>
                                <span style={{
                                    width: 18, height: 18, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                                    background: checked ? "#10b981" : "rgba(255,255,255,.1)", color: "#fff", fontSize: 11, fontWeight: 800,
                                }}>
                                    {checked ? "✓" : ""}
                                </span>
                                <span style={{ fontSize: 13, color: checked ? "#10b981" : "#e2e8f0", textDecoration: checked ? "line-through" : "none" }}>{item}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Phase nav */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <button disabled={activePhase === 0} onClick={() => setActivePhase((p) => p - 1)} style={{ ...st.btn, opacity: activePhase === 0 ? 0.3 : 1 }}>← Anterior</button>
                    <button disabled={activePhase === PHASES.length - 1} onClick={() => setActivePhase((p) => p + 1)} style={{ ...st.btn, background: "rgba(6,182,212,.15)", borderColor: "#06b6d4", color: "#06b6d4", opacity: activePhase === PHASES.length - 1 ? 0.3 : 1 }}>Siguiente →</button>
                </div>
            </div>

            {/* Mission log */}
            {alerts.length > 0 && (
                <div style={st.logBox}>
                    <h5 style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Log de Misión</h5>
                    {alerts.slice(0, 5).map((a, i) => (
                        <div key={i} style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{a}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

const st: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 14, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,.08)" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 8 },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    btn: { padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.05)", color: "#94a3b8", cursor: "pointer" },
    phaseTabs: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 },
    phaseTab: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px", borderRadius: 10, border: "1px solid", cursor: "pointer", transition: "all 0.2s" },
    phaseDetail: { padding: "14px 16px", borderRadius: 12, background: "rgba(0,0,0,.2)", border: "1px solid rgba(6,182,212,.1)" },
    logBox: { display: "flex", flexDirection: "column", gap: 3, padding: "10px 12px", borderRadius: 10, background: "rgba(0,0,0,.3)", maxHeight: 100, overflow: "auto" as const },
};
