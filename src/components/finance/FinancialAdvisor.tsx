"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
    role: "user" | "advisor";
    text: string;
}

const PRESET_QUESTIONS = [
    "¿Qué diferencia hay entre financiación reembolsable y fondo perdido?",
    "¿Qué es ENISA y cómo funciona la carencia?",
    "¿Puedo solicitar Kit Digital y ENISA a la vez?",
    "¿Qué ventaja fiscal tiene el leasing?",
    "¿Cuánto capital inicial necesito realmente?",
];

const KNOWLEDGE_BASE: Record<string, string> = {
    "reembolsable": `📘 **Financiación Reembolsable vs. Fondo Perdido**

• **Reembolsable** (Préstamos): Son fondos que DEBES devolver con intereses. Ejemplos:
  — *ENISA*: Préstamo participativo a largo plazo (7–9 años), con 5 años de carencia. El interés es variable y se vincula a los resultados de la empresa.
  — *ICO/Leasing*: Líneas de crédito bancarias o arrendamiento financiero. Plazos de 3–7 años.

• **Fondo perdido** (Subvenciones): Son fondos que NO se devuelven. Ejemplos:
  — *Kit Digital*: 3.000€–6.000€ para digitalización, 100% fondo perdido.
  — *Ayudas IVACE/CDTI*: Variables, pueden ser parcial o totalmente a fondo perdido.

💡 Estrategia óptima: Agotar primero los fondos perdidos (Kit Digital, IVACE) y luego apalancar con reembolsable (ENISA) para no consumir caja propia.`,

    "enisa": `🏛️ **Préstamo ENISA — Empresa Nacional de Innovación**

• Importe: 25.000€ – 300.000€ (para IntegriTech Pro estimamos 25k–80k€)
• Carencia TOTAL: 5 años — no pagas nada durante los primeros 5 años
• Plazo total: 7–9 años
• Sin garantías personales ni avales
• Interés: Tramo fijo (Euribor + 3,75%) + Tramo variable vinculado a rentabilidad

📌 Requisitos clave:
  — Sociedad constituida (SL/SA) con al menos 1 año
  — Fondos propios ≥ importe solicitado
  — Plan de empresa viable
  — No estar en situación de crisis empresarial

⚠️ Importante: ENISA es un préstamo participativo, lo que significa que computa como fondos propios a efectos mercantiles. Esto mejora tu ratio de solvencia y facilita acceder a financiación adicional.`,

    "kit digital": `💻 **Kit Digital — Acelera Pyme**

• Importe: 3.000€ (0–2 empleados) / 6.000€ (3–9 empleados)
• 100% subvención a fondo perdido — no se devuelve
• Plazo de ejecución: 12 meses desde la concesión

📦 ¿Qué cubre?
  — Sitio web / presencia en internet
  — Comercio electrónico
  — Gestión de redes sociales
  — CRM / ERP
  — Facturación electrónica
  — Ciberseguridad

✅ Compatibilidad: Es compatible con ENISA, ICO y todas las demás ayudas. No afecta a tu capacidad de endeudamiento porque no es deuda.`,

    "leasing": `🏦 **Leasing — Ventaja Fiscal para Maquinaria**

• El leasing operativo permite "alquilar" la maquinaria con opción de compra al final.
• Las cuotas son 100% deducibles como gasto operativo (reduce la base imponible del IS).
• La propia máquina sirve como garantía — no necesitas aportar aval adicional.
• Al final del contrato, puedes ejercer la opción de compra por un valor residual (~1% del precio original).

💡 Ventaja clave para IntegriTech Pro:
  — Sistema láser fibra: ~30.000€ → cuota mensual ~500€ deducible
  — Equipo criogénico: ~12.000€ → cuota mensual ~200€ deducible
  — El activo aparece fuera de balance en leasing operativo, mejorando ratios financieros.`,

    "capital inicial": `🤝 **Capital Inicial Necesario**

Para arrancar IntegriTech Pro, la estructura de capital óptima es:

| Fuente | Mínimo | Máximo |
|--------|--------|--------|
| Socio Inversor | 40.000€ | 80.000€ |
| ENISA | 25.000€ | 80.000€ |
| ICO/Leasing | 15.000€ | 40.000€ |
| Kit Digital | 3.000€ | 6.000€ |
| Ayudas UE/IVACE | 5.000€ | 50.000€ |
| **TOTAL** | **88.000€** | **256.000€** |

📌 Con el escenario mínimo (88k€), el desembolso real del socio es solo 40k€ — el resto son fondos públicos y deuda sin aval.

💡 Recomendación: Apuntar al rango 120k–150k€ para tener suficiente colchón operativo durante los primeros 12 meses.`,
};

function findAnswer(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("reembolsable") || lower.includes("fondo perdido") || lower.includes("diferencia") || lower.includes("devuelve"))
        return KNOWLEDGE_BASE["reembolsable"];
    if (lower.includes("enisa") || lower.includes("carencia") || lower.includes("participativo"))
        return KNOWLEDGE_BASE["enisa"];
    if (lower.includes("kit digital") || lower.includes("kit") || lower.includes("acelera") || lower.includes("digitalización") || (lower.includes("solicitar") && lower.includes("vez")))
        return KNOWLEDGE_BASE["kit digital"];
    if (lower.includes("leasing") || lower.includes("fiscal") || lower.includes("ico") || lower.includes("maquinaria"))
        return KNOWLEDGE_BASE["leasing"];
    if (lower.includes("capital") || lower.includes("inicial") || lower.includes("necesito") || lower.includes("cuánto") || lower.includes("estructura"))
        return KNOWLEDGE_BASE["capital inicial"];

    return `Gracias por tu consulta. Como IntegriTech Advisor, puedo ayudarte con:

• Diferencias entre financiación reembolsable y fondo perdido
• Detalles sobre ENISA, Kit Digital, ICO y Leasing
• Estructura de capital recomendada
• Ventajas fiscales del leasing operativo

Por favor, reformula tu pregunta o selecciona una de las sugerencias de arriba. Para consultas más específicas sobre tu caso particular, te recomendamos agendar una sesión con nuestro equipo financiero.`;
}

export default function FinancialAdvisor() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "advisor",
            text: "👋 ¡Hola! Soy **IntegriTech Advisor**, tu asistente financiero virtual. Puedo explicarte las distintas fuentes de financiación disponibles para tu proyecto, la diferencia entre ayudas reembolsables y fondo perdido, y ayudarte a entender la estructura de capital óptima.\n\n¿En qué puedo ayudarte?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const send = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { role: "user", text: text.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate thinking delay
        setTimeout(() => {
            const answer = findAnswer(text);
            setMessages((prev) => [...prev, { role: "advisor", text: answer }]);
            setIsTyping(false);
        }, 800 + Math.random() * 600);
    };

    return (
        <div style={s.wrap}>
            <div style={s.header}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={s.avatar}>🤖</div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>IntegriTech Advisor</div>
                        <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>● En línea — Asistente Financiero IA</div>
                    </div>
                </div>
            </div>

            {/* Preset questions */}
            <div style={s.presets}>
                {PRESET_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => send(q)} style={s.presetBtn}>{q}</button>
                ))}
            </div>

            {/* Messages */}
            <div ref={listRef} style={s.messageList}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        ...s.msgBubble,
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        background: msg.role === "user" ? "rgba(6,182,212,.15)" : "rgba(255,255,255,.04)",
                        borderColor: msg.role === "user" ? "rgba(6,182,212,.3)" : "rgba(255,255,255,.06)",
                        maxWidth: "85%",
                    }}>
                        <div style={{ fontSize: 12, color: msg.role === "user" ? "#06b6d4" : "#94a3b8", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ ...s.msgBubble, alignSelf: "flex-start", background: "rgba(255,255,255,.04)", borderColor: "rgba(255,255,255,.06)" }}>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                            <span style={{ animation: "pulse 1.5s infinite" }}>Escribiendo...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div style={s.inputRow}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send(input)}
                    placeholder="Pregunta sobre financiación..."
                    style={s.input}
                />
                <button onClick={() => send(input)} style={s.sendBtn}>Enviar</button>
            </div>
            <style>{`@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 0, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden" },
    header: { padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.2)" },
    avatar: { width: 36, height: 36, borderRadius: "50%", background: "rgba(6,182,212,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "1px solid rgba(6,182,212,.3)" },
    presets: { display: "flex", gap: 6, flexWrap: "wrap" as const, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.04)" },
    presetBtn: { padding: "5px 12px", borderRadius: 20, fontSize: 10, fontWeight: 600, border: "1px solid rgba(6,182,212,.2)", background: "rgba(6,182,212,.08)", color: "#06b6d4", cursor: "pointer", transition: "all 0.2s" },
    messageList: { display: "flex", flexDirection: "column", gap: 10, padding: 16, minHeight: 280, maxHeight: 400, overflowY: "auto" as const },
    msgBubble: { padding: "10px 14px", borderRadius: 12, border: "1px solid" },
    inputRow: { display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.2)" },
    input: { flex: 1, padding: "10px 14px", borderRadius: 10, fontSize: 13, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "#e2e8f0", outline: "none" },
    sendBtn: { padding: "10px 20px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "none", background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "#fff", cursor: "pointer" },
};
