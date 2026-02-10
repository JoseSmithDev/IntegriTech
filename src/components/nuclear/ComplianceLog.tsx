/**
 * ComplianceLog — IAEA audit trail + Chain of Custody viewer.
 */
"use client";
import React, { useState } from "react";

interface LogEntry {
    id: string;
    timestamp: string;
    action: string;
    actionEs: string;
    actor: string;
    badgeId: string;
    objectId: string;
    description: string;
    hash: string;
    icon: string;
}

interface CustodyRecord {
    id: string;
    entityName: string;
    entityType: string;
    handler: string;
    location: string;
    receivedAt: string;
    quantity: string;
    batchNumber: string;
    chainHash: string;
}

const DEMO_LOG: LogEntry[] = [
    { id: "CL-20260209-000001", timestamp: "2026-02-09T21:00:00Z", action: "job_created", actionEs: "Trabajo Creado", actor: "Dr. García", badgeId: "OP-4512", objectId: "JOB-001", description: "Misión de descontaminación — Reactor Hall B", hash: "a1b2c3d4...", icon: "🔧" },
    { id: "CL-20260209-000002", timestamp: "2026-02-09T21:05:00Z", action: "robot_deployed", actionEs: "Robot Desplegado", actor: "SISTEMA", badgeId: "", objectId: "ROBOT-A3", description: "Robot enviado a zona caliente vía ruta ALARA", hash: "e5f6g7h8...", icon: "🤖" },
    { id: "CL-20260209-000003", timestamp: "2026-02-09T21:10:00Z", action: "reading_taken", actionEs: "Lectura Tomada", actor: "SENSOR-IR-07", badgeId: "", objectId: "JOB-001", description: "Lectura Geiger: 45.2 μSv/h en coordenada (3, 7)", hash: "i9j0k1l2...", icon: "📡" },
    { id: "CL-20260209-000004", timestamp: "2026-02-09T21:15:00Z", action: "solvent_deployed", actionEs: "Solvente Aplicado", actor: "Dr. García", badgeId: "OP-4512", objectId: "SOL-HNO3-B12", description: "Ácido nítrico 3M aplicado — 2.5L en superficie A4", hash: "m3n4o5p6...", icon: "⚗️" },
    { id: "CL-20260209-000005", timestamp: "2026-02-09T21:20:00Z", action: "waste_created", actionEs: "Residuo Creado", actor: "Dr. García", badgeId: "OP-4512", objectId: "ES-NUC-20260209-0004", description: "Lodo radiactivo del lavado ácido — Cs-137 + residuo", hash: "q7r8s9t0...", icon: "☢️" },
    { id: "CL-20260209-000006", timestamp: "2026-02-09T21:25:00Z", action: "alert_triggered", actionEs: "Alerta Disparada", actor: "SISTEMA", badgeId: "", objectId: "SENSOR-T-03", description: "Temperatura 55°C excede umbral 50°C — Zona B3", hash: "u1v2w3x4...", icon: "🚨" },
    { id: "CL-20260209-000007", timestamp: "2026-02-09T21:30:00Z", action: "certificate_issued", actionEs: "Certificado Emitido", actor: "SISTEMA", badgeId: "", objectId: "JOB-001", description: "Certificado SHA-256 de descontaminación generado", hash: "y5z6a7b8...", icon: "📜" },
];

const DEMO_CUSTODY: CustodyRecord[] = [
    { id: "COC-20260209-0001", entityName: "Ácido Nítrico 3M", entityType: "chemical_solvent", handler: "Dr. García", location: "Almacén Químico B", receivedAt: "2026-02-09T20:00:00Z", quantity: "5L", batchNumber: "HNO3-2026-0045", chainHash: "ab12cd34..." },
    { id: "COC-20260209-0002", entityName: "Lodo Radiactivo — Lavado #1", entityType: "radioactive_sludge", handler: "Téc. Martínez", location: "Bahía Residuos 3A", receivedAt: "2026-02-09T21:20:00Z", quantity: "8.2 kg", batchNumber: "SLG-2026-0012", chainHash: "ef56gh78..." },
    { id: "COC-20260209-0003", entityName: "Bidón 200L — Cs-137", entityType: "waste_package", handler: "Enc. López", location: "SFA Norte — Celda 7", receivedAt: "2026-02-09T21:30:00Z", quantity: "180 kg", batchNumber: "PKG-20260209-0001", chainHash: "ij90kl12..." },
];

type Tab = "log" | "custody";

export default function ComplianceLog() {
    const [tab, setTab] = useState<Tab>("log");
    const [filter, setFilter] = useState("");

    const filteredLog = DEMO_LOG.filter((e) =>
        !filter || e.actionEs.toLowerCase().includes(filter.toLowerCase()) || e.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div style={s.wrap}>
            <div style={s.header}>
                <h4 style={s.title}>📋 Registro de Cumplimiento OIEA (RS-G-1.7)</h4>
                <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setTab("log")} style={{ ...s.tabBtn, ...(tab === "log" ? s.tabActive : {}) }}>Auditoría</button>
                    <button onClick={() => setTab("custody")} style={{ ...s.tabBtn, ...(tab === "custody" ? s.tabActive : {}) }}>Cadena de Custodia</button>
                </div>
            </div>

            {/* Chain integrity */}
            <div style={s.chainBanner}>
                <span style={{ color: "#10b981", fontWeight: 800 }}>✓ CADENA ÍNTEGRA</span>
                <span style={{ fontSize: 11, color: "#475569" }}>{DEMO_LOG.length} entradas · Hash-encadenado SHA-256</span>
            </div>

            {tab === "log" && (
                <>
                    <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrar acciones..." style={s.search} />
                    <div style={s.timeline}>
                        {filteredLog.map((entry) => (
                            <div key={entry.id} style={s.entry}>
                                <div style={s.entryIcon}>{entry.icon}</div>
                                <div style={s.entryContent}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{entry.actionEs}</span>
                                        <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{entry.id}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{entry.description}</div>
                                    <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 10, color: "#475569" }}>
                                        <span>👤 {entry.actor}{entry.badgeId ? ` (${entry.badgeId})` : ""}</span>
                                        <span>🕐 {new Date(entry.timestamp).toLocaleString("es-ES")}</span>
                                        <span style={{ fontFamily: "monospace" }}>🔗 {entry.hash}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {tab === "custody" && (
                <div style={s.custodyList}>
                    {DEMO_CUSTODY.map((rec) => (
                        <div key={rec.id} style={s.custodyCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>
                                    {rec.entityType === "chemical_solvent" && "⚗️ "}
                                    {rec.entityType === "radioactive_sludge" && "☢️ "}
                                    {rec.entityType === "waste_package" && "📦 "}
                                    {rec.entityName}
                                </span>
                                <span style={{ ...s.typeBadge, background: rec.entityType === "chemical_solvent" ? "rgba(6,182,212,.15)" : "rgba(239,68,68,.15)", color: rec.entityType === "chemical_solvent" ? "#06b6d4" : "#ef4444" }}>
                                    {rec.entityType === "chemical_solvent" ? "Solvente" : rec.entityType === "radioactive_sludge" ? "Lodo Radiactivo" : "Paquete"}
                                </span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
                                <CustField label="Custodio" value={rec.handler} />
                                <CustField label="Ubicación" value={rec.location} />
                                <CustField label="Cantidad" value={rec.quantity} />
                                <CustField label="Lote" value={rec.batchNumber} />
                                <CustField label="Recibido" value={new Date(rec.receivedAt).toLocaleString("es-ES")} />
                                <CustField label="Hash" value={rec.chainHash} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function CustField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase" as const }}>{label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: label === "Hash" ? "monospace" : "inherit" }}>{value}</div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 12, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,.08)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    tabBtn: { padding: "5px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#64748b", cursor: "pointer" },
    tabActive: { background: "rgba(6,182,212,.12)", borderColor: "rgba(6,182,212,.3)", color: "#06b6d4" },
    chainBanner: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderRadius: 10, background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.15)" },
    search: { padding: "8px 12px", borderRadius: 8, fontSize: 13, border: "1px solid rgba(255,255,255,.1)", background: "rgba(0,0,0,.2)", color: "#e2e8f0" },
    timeline: { display: "flex", flexDirection: "column", gap: 2 },
    entry: { display: "flex", gap: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(0,0,0,.15)", borderLeft: "3px solid rgba(6,182,212,.3)" },
    entryIcon: { fontSize: 20, width: 32, textAlign: "center" as const, flexShrink: 0 },
    entryContent: { flex: 1, display: "flex", flexDirection: "column" },
    custodyList: { display: "flex", flexDirection: "column", gap: 8 },
    custodyCard: { padding: "12px 14px", borderRadius: 12, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.05)" },
    typeBadge: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 },
};
