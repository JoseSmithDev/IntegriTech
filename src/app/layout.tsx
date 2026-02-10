import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "IntegriTech Pro",
    description: "Solución de Recuperación Técnica 360° — Láser, Criogenia y Ultrasonidos",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>
                <nav className="navbar" style={{ flexWrap: "wrap", gap: 12 }}>
                    <a href="/financiacion" style={{ textDecoration: "none" }}>
                        <div className="navbar-brand">
                            <span>⚡ Integri</span>Tech
                        </div>
                    </a>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {/* Grupo: Sectores */}
                        <span style={{
                            fontSize: 9, fontWeight: 700, color: "#475569",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            padding: "0 6px",
                        }}>Sectores</span>
                        <a href="/" className="nav-link">🛥️ Yates</a>
                        <a href="/heritage" className="nav-link">🏛️ Patrimonio</a>
                        <a href="/nuclear" className="nav-link">☢️ Nuclear</a>

                        {/* Separador */}
                        <span style={{
                            width: 1, height: 18, background: "rgba(255,255,255,.1)",
                            margin: "0 4px",
                        }} />

                        {/* Grupo: Tecnologías */}
                        <span style={{
                            fontSize: 9, fontWeight: 700, color: "#475569",
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            padding: "0 6px",
                        }}>Tecnologías</span>
                        <a href="/cryogenic" className="nav-link">❄️ Criogénica</a>
                        <a href="/ultrasonic" className="nav-link">🔊 Ultrasonido</a>

                        {/* Separador */}
                        <span style={{
                            width: 1, height: 18, background: "rgba(255,255,255,.1)",
                            margin: "0 4px",
                        }} />

                        {/* Grupo: Herramientas */}
                        <a href="/solutions" className="nav-link">🔄 Soluciones 360°</a>
                        <a href="/financiacion" className="nav-link" style={{ color: "var(--accent-cyan)" }}>💰 Inversión</a>
                    </div>
                    <button className="btn btn-primary">Solicitar Demo</button>
                </nav>
                <main className="page-container">{children}</main>
            </body>
        </html>
    );
}
