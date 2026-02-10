/**
 * Ultrasonic Cleaning Dashboard — Precision cavitation service showcase.
 */
"use client";

import React from "react";
import UltrasonicHero from "@/components/ultrasonic/UltrasonicHero";
import ServiceModes from "@/components/ultrasonic/ServiceModes";
import CavitationAdvantages from "@/components/ultrasonic/CavitationAdvantages";
import CavitationDiagram from "@/components/ultrasonic/CavitationDiagram";
import UltrasonicApplications from "@/components/ultrasonic/UltrasonicApplications";

export default function UltrasonicPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Hero */}
            <section className="animate-fade-in">
                <UltrasonicHero />
            </section>

            {/* Service Modes: Mobile & Workshop */}
            <section className="animate-slide-up">
                <ServiceModes />
            </section>

            {/* Cavitation Process Diagram */}
            <section className="animate-slide-up">
                <CavitationDiagram />
            </section>

            {/* Technical Advantages */}
            <section className="animate-slide-up">
                <CavitationAdvantages />
            </section>

            {/* Applications by Sector */}
            <section className="animate-slide-up">
                <UltrasonicApplications />
            </section>
        </div>
    );
}
