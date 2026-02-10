/**
 * ServiceSchedule — Maintenance calendar.
 */
"use client";
import React from "react";

export default function ServiceSchedule() {
    return (
        <div style={s.wrap}>
            <h3 style={s.title}>🛠️ Calendario de Mantenimiento</h3>
            <div style={s.content}>
                <div style={s.alert}>
                    <span style={{ fontSize: 18 }}>🔔</span>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>Atención Requerida</div>
                        <div style={{ fontSize: 11, color: "#cbd5e1" }}>Titan Worker vence inspección de casco en 5 días.</div>
                    </div>
                </div>

                <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Próximos Vencimientos</div>
                    <ScheduleItem yacht="Deep Blue" task="Limpieza antifouling" date="15 Feb" daysLeft={5} />
                    <ScheduleItem yacht="Aurora Borealis" task="Pulido hélices" date="28 Feb" daysLeft={18} />
                    <ScheduleItem yacht="Wind Spirit" task="Tratamiento cubierta" date="10 Mar" daysLeft={28} />
                </div>
            </div>
        </div>
    );
}

function ScheduleItem({ yacht, task, date, daysLeft }: any) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
            <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{yacht}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{task}</div>
            </div>
            <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#f1f5f9" }}>{date}</div>
                <div style={{ fontSize: 10, color: daysLeft < 7 ? "#f59e0b" : "#10b981" }}>en {daysLeft} días</div>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,.08)", height: "100%" },
    title: { margin: "0 0 16px 0", fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    content: { display: "flex", flexDirection: "column", gap: 12 },
    alert: { display: "flex", gap: 10, padding: 12, borderRadius: 10, background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.2)" },
};
