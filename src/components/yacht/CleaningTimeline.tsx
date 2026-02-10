/**
 * CleaningTimeline — History of cleaning jobs.
 */
"use client";
import React from "react";

const JOBS = [
    { id: "J-1024", date: "2026-02-08", yacht: "Aurora Borealis", area: 450, method: "Láser", status: "Completado", df: 120 },
    { id: "J-1025", date: "2026-02-09", yacht: "Wind Spirit", area: 120, method: "Láser", status: "En Progreso", df: 0 },
    { id: "J-1026", date: "2026-02-12", yacht: "Deep Blue", area: 85, method: "Híbrido", status: "Programado", df: 0 },
];

export default function CleaningTimeline() {
    return (
        <div style={s.wrap}>
            <h3 style={s.title}>📅 Historial de Intervenciones</h3>
            <div style={s.list}>
                {JOBS.map((job) => (
                    <div key={job.id} style={s.row}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{job.yacht}</div>
                            <div style={{ fontSize: 11, color: "#64748b" }}>{job.date} · {job.id}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>{job.area} m² · {job.method}</div>
                            <span style={{
                                fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                background: job.status === "Completado" ? "rgba(16,185,129,.15)" : job.status === "En Progreso" ? "rgba(245,158,11,.15)" : "rgba(59,130,246,.15)",
                                color: job.status === "Completado" ? "#10b981" : job.status === "En Progreso" ? "#f59e0b" : "#3b82f6"
                            }}>
                                {job.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,.08)" },
    title: { margin: "0 0 16px 0", fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    list: { display: "flex", flexDirection: "column", gap: 12 },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,.05)" },
};
